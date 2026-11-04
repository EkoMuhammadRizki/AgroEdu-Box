import "server-only";
import { getSupabaseAdmin } from "./supabase-server";
import { POT_DEVICES } from "./mock-data";
import { getOfflineAfterMs } from "./iot";
import type { Device, SensorReading } from "./types";

/** Menerima "pot-a", "Pot A", "POT_A", atau "a". Null bila bukan salah satu dari empat pot. */
export function resolvePotId(raw: string): string | null {
  const key = String(raw).toLowerCase().replace(/[^a-z0-9]/g, "").replace(/^pot/, "");
  return POT_DEVICES.find((pot) => pot.id === `pot-${key}`)?.id ?? null;
}

export interface PotReadingInput {
  id: string;
  kelembapan: number;
  /** Null bila DHT22 gagal dibaca saat itu. */
  suhu: number | null;
}

interface PotRow {
  id: string;
  nama: string;
  suhu: number | null;
  suhu_at: string | null;
  kelembapan: number | null;
  diperbarui_at: string | null;
  offline_at: string | null;
}

function sensor(
  deviceId: string,
  sensorType: SensorReading["sensorType"],
  value: number,
  measuredAt: string
): SensorReading {
  return {
    deviceId,
    sensorId: `${deviceId}-${sensorType}`,
    sensorType,
    value,
    unit: sensorType === "soil_moisture" ? "%" : "°C",
    measuredAt,
    receivedAt: measuredAt,
    valid: true,
    connectionStatus: "online",
  };
}

/** Semua pot dalam keadaan belum menyala; dipakai juga bila database tak terjangkau. */
function sleepingDevices(): Device[] {
  return POT_DEVICES.map(({ id, name }) => ({
    id,
    name,
    boxId: id,
    classId: "",
    status: "offline" as const,
    lastDataAt: "",
    sensors: [],
  }));
}

function toDevice(row: PotRow, now: number, maxAgeMs: number): Device {
  const fresh = (iso: string | null) => {
    const at = iso ? Date.parse(iso) : NaN;
    return Number.isFinite(at) && now - at <= maxAgeMs;
  };
  // Alat dianggap mati bila broker mengabarkannya mati, atau bila sudah lama diam.
  const hidup = row.offline_at === null && fresh(row.diperbarui_at);
  const sensors: SensorReading[] = [];
  if (hidup && row.kelembapan !== null) {
    sensors.push(sensor(row.id, "soil_moisture", Number(row.kelembapan), row.diperbarui_at!));
  }
  // Suhu punya waktunya sendiri: DHT22 yang copot berhenti menampilkan angka,
  // sementara kelembapan tanah tetap jalan.
  if (hidup && row.suhu !== null && fresh(row.suhu_at)) {
    sensors.push(sensor(row.id, "air_temp", Number(row.suhu), row.suhu_at!));
  }
  return {
    id: row.id,
    name: row.nama,
    boxId: row.id,
    classId: "",
    status: sensors.length > 0 ? "online" : "offline",
    lastDataAt: row.diperbarui_at ?? "",
    sensors,
  };
}

/** Status empat pot dari database. Database bermasalah berarti semua pot tidur, bukan halaman error. */
export async function readPots(): Promise<Device[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("iot_pot")
      .select("id, nama, suhu, suhu_at, kelembapan, diperbarui_at, offline_at")
      .order("id");
    if (error) throw error;
    if (!data?.length) return sleepingDevices();
    const now = Date.now();
    const maxAgeMs = getOfflineAfterMs();
    return (data as PotRow[]).map((row) => toDevice(row, now, maxAgeMs));
  } catch (err) {
    console.error("readPots", err);
    return sleepingDevices();
  }
}

export async function savePotReadings(readings: PotReadingInput[]): Promise<number> {
  const { data, error } = await getSupabaseAdmin().rpc("simpan_pembacaan_iot", { p_data: readings });
  if (error) throw error;
  return Number(data ?? 0);
}

/** Dipanggil saat broker mengabarkan alat mati (pesan Last Will). */
export async function markAllPotsOffline(): Promise<number> {
  const { data, error } = await getSupabaseAdmin().rpc("tandai_iot_mati");
  if (error) throw error;
  return Number(data ?? 0);
}
