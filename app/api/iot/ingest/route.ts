import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { markAllPotsOffline, readPots, resolvePotId, savePotReadings, type PotReadingInput } from "@/lib/iot-store";
import { POT_DEVICES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

// Rentang wajar DHT22 dan sensor tanah. Angka di luar ini berarti sensor rusak
// atau data palsu, dan tidak boleh sampai ke layar siswa.
const SUHU_MIN = -40;
const SUHU_MAX = 85;

const bad = (error: string, status = 400) => NextResponse.json({ success: false, error }, { status });

/** Membandingkan token tanpa membocorkan panjang cocoknya lewat lama waktu. */
function sameToken(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

function checkToken(request: Request): NextResponse | null {
  const expected = process.env.IOT_INGEST_TOKEN;
  if (!expected) {
    // Tanpa token siapa pun bisa mengirim angka palsu. Di komputer sendiri itu
    // memudahkan uji coba, tetapi di produksi harus ditolak.
    if (process.env.NODE_ENV === "production") {
      return bad("IOT_INGEST_TOKEN belum diatur di server.", 503);
    }
    return null;
  }
  // Tiga cara, supaya alat atau perantara apa pun bisa memakai yang tersedia.
  const given =
    request.headers.get("x-iot-token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    new URL(request.url).searchParams.get("token") ??
    "";
  return sameToken(given, expected) ? null : bad("Token alat tidak cocok.", 401);
}

function angka(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * ESP32 mengirim JSON apa adanya. Bentuk terbungkus {"payload": "<teks JSON>"}
 * juga diterima, supaya perantara seperti broker MQTT bisa dipasang di
 * kemudian hari tanpa mengubah sisi server.
 */
function unwrap(body: unknown): Record<string, unknown> | null {
  if (typeof body === "string") {
    try {
      return unwrap(JSON.parse(body));
    } catch {
      return null;
    }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const obj = body as Record<string, unknown>;
  if (typeof obj.payload === "string" || (obj.payload && typeof obj.payload === "object")) {
    return unwrap(obj.payload) ?? obj;
  }
  return obj;
}

/** Bentuk baru: {"suhu":28.4,"pot":{"a":45.2,"b":62.0,"c":21.5,"d":70.1}} */
function fromPotMap(obj: Record<string, unknown>): PotReadingInput[] | string {
  const pot = obj.pot as Record<string, unknown>;
  const suhu = obj.suhu === null || obj.suhu === undefined ? null : angka(obj.suhu);
  if (suhu !== null && (suhu < SUHU_MIN || suhu > SUHU_MAX)) {
    return `suhu ${suhu} di luar rentang ${SUHU_MIN}..${SUHU_MAX}.`;
  }

  const hasil: PotReadingInput[] = [];
  for (const [key, raw] of Object.entries(pot)) {
    const id = resolvePotId(key);
    if (!id) return `Nama pot "${key}" tidak dikenal. Gunakan a, b, c, atau d.`;
    const kelembapan = angka(raw);
    if (kelembapan === null || kelembapan < 0 || kelembapan > 100) {
      return `Kelembapan ${id} harus angka 0..100.`;
    }
    hasil.push({ id, kelembapan, suhu });
  }
  return hasil.length > 0 ? hasil : "Tidak ada pot yang dikirim.";
}

/** Bentuk lama, masih dipakai untuk uji coba manual lewat curl. */
function fromDeviceReadings(obj: Record<string, unknown>): PotReadingInput[] | string {
  const id = resolvePotId(String(obj.deviceId));
  if (!id) return "deviceId tidak dikenal. Gunakan pot-a, pot-b, pot-c, atau pot-d.";
  if (!Array.isArray(obj.readings)) return "readings harus berupa array.";

  let kelembapan: number | null = null;
  let suhu: number | null = null;
  for (const item of obj.readings as Array<Record<string, unknown>>) {
    const value = angka(item?.value);
    if (value === null) continue;
    if (item?.sensorType === "soil_moisture" && value >= 0 && value <= 100) kelembapan = value;
    if (item?.sensorType === "air_temp" && value >= SUHU_MIN && value <= SUHU_MAX) suhu = value;
  }
  if (kelembapan === null) {
    return "Butuh pembacaan soil_moisture berupa angka 0..100.";
  }
  return [{ id, kelembapan, suhu }];
}

export async function POST(request: Request) {
  const denied = checkToken(request);
  if (denied) return denied;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return bad("Format body bukan JSON yang valid.");
  }

  const obj = unwrap(raw);
  if (!obj) return bad("Payload tidak dikenali.");

  try {
    // Pesan Last Will dari broker: alat mati, semua pot langsung tidur.
    if (obj.status === "mati" || obj.status === "offline") {
      const jumlah = await markAllPotsOffline();
      return NextResponse.json({ success: true, status: "mati", potDiubah: jumlah });
    }

    const hasil =
      obj.pot && typeof obj.pot === "object" && !Array.isArray(obj.pot)
        ? fromPotMap(obj)
        : obj.deviceId
          ? fromDeviceReadings(obj)
          : "Payload tidak dikenali. Kirim {\"suhu\":28.4,\"pot\":{\"a\":45.2}}.";

    if (typeof hasil === "string") return bad(hasil);

    const tersimpan = await savePotReadings(hasil);
    return NextResponse.json({
      success: true,
      potTersimpan: tersimpan,
      diterimaAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("POST /api/iot/ingest", err);
    return bad("Gagal menyimpan data sensor.", 500);
  }
}

export async function GET() {
  const devices = await readPots();
  return NextResponse.json({
    service: "Agro-Edu Box: penerima data alat IoT",
    pot: POT_DEVICES.map((pot) => pot.id),
    menyala: devices.filter((d) => d.status === "online").length,
    tokenDiperlukan: Boolean(process.env.IOT_INGEST_TOKEN),
    cara: {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-iot-token": "<IOT_INGEST_TOKEN>" },
      contohData: { suhu: 28.4, pot: { a: 45.2, b: 62, c: 21.5, d: 70.1 } },
      contohAlatMati: { status: "mati" },
    },
  });
}
