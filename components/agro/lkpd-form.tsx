"use client";
import { Thermometer, Droplets, Info } from "lucide-react";
import type { LkpdBagian, LkpdBlok, LkpdField, LkpdJawaban } from "@/lib/lkpd";
import { MAKS_TEKS, MAKS_URAIAN } from "@/lib/lkpd";

interface Props {
  bagian: LkpdBagian;
  jawaban: LkpdJawaban;
  onUbah: (id: string, nilai: string | string[]) => void;
  /** Mengisi kelembapan & suhu dari pembacaan alat. Null bila pot belum menyala. */
  onAmbilSensor?: (pot: string) => { kelembapan: number; suhu: number } | null;
  terkunci?: boolean;
}

const teksDari = (nilai: string | string[] | undefined) => (typeof nilai === "string" ? nilai : "");
const daftarDari = (nilai: string | string[] | undefined) => (Array.isArray(nilai) ? nilai : []);

function Isian({ field, jawaban, onUbah, terkunci }: { field: LkpdField } & Omit<Props, "bagian" | "onAmbilSensor">) {
  const nilai = jawaban[field.id];
  const umum = "input-field text-sm disabled:opacity-70";

  if (field.type === "uraian") {
    return (
      <textarea
        id={field.id}
        rows={3}
        maxLength={MAKS_URAIAN}
        disabled={terkunci}
        value={teksDari(nilai)}
        onChange={(e) => onUbah(field.id, e.target.value)}
        placeholder={field.placeholder ?? "Tulis jawabanmu di sini..."}
        className={`${umum} h-auto py-2.5 leading-relaxed w-full`}
      />
    );
  }

  if (field.type === "angka") {
    return (
      <div className="relative">
        <input
          id={field.id}
          type="text"
          inputMode="decimal"
          disabled={terkunci}
          value={teksDari(nilai)}
          onChange={(e) => onUbah(field.id, e.target.value.replace(/[^0-9.,]/g, "").replace(",", "."))}
          placeholder="0"
          className={`${umum} w-full pr-10 text-center font-heading font-extrabold tabular-nums`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-600 pointer-events-none">
          {field.satuan}
        </span>
      </div>
    );
  }

  if (field.type === "pilihan") {
    const terpilih = teksDari(nilai);
    return (
      <div className="flex flex-wrap gap-1.5">
        {(field.opsi ?? []).map((opsi) => {
          const aktif = terpilih === opsi;
          return (
            <button
              key={opsi}
              type="button"
              disabled={terkunci}
              aria-pressed={aktif}
              // Menekan pilihan yang sama sekali lagi akan membatalkannya,
              // supaya siswa yang salah tekan bisa mengosongkannya kembali.
              onClick={() => onUbah(field.id, aktif ? "" : opsi)}
              className={`px-3 py-1.5 rounded-pill text-xs font-heading font-bold border-2 transition-all cursor-pointer disabled:cursor-not-allowed ${
                aktif
                  ? "bg-green-500 text-white border-green-600 shadow-xs"
                  : "bg-white text-ink-900 border-green-200 hover:border-green-400"
              }`}
            >
              {opsi}
            </button>
          );
        })}
      </div>
    );
  }

  if (field.type === "pilihanGanda") {
    const terpilih = daftarDari(nilai);
    return (
      <div className="space-y-1.5">
        {(field.opsi ?? []).map((opsi) => {
          const aktif = terpilih.includes(opsi);
          return (
            <button
              key={opsi}
              type="button"
              disabled={terkunci}
              aria-pressed={aktif}
              onClick={() => onUbah(field.id, aktif ? terpilih.filter((o) => o !== opsi) : [...terpilih, opsi])}
              className={`w-full text-left flex items-start gap-2.5 p-2.5 rounded-2xl border-2 transition-all cursor-pointer disabled:cursor-not-allowed ${
                aktif ? "bg-green-100 border-green-500" : "bg-white border-green-200 hover:border-green-400"
              }`}
            >
              <span
                className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center text-[10px] font-extrabold ${
                  aktif ? "bg-green-500 border-green-600 text-white" : "border-green-300 bg-white"
                }`}
              >
                {aktif ? "✓" : ""}
              </span>
              <span className="text-xs sm:text-sm font-medium text-ink-900 leading-snug">{opsi}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <input
      id={field.id}
      type="text"
      maxLength={MAKS_TEKS}
      disabled={terkunci}
      value={teksDari(nilai)}
      onChange={(e) => onUbah(field.id, e.target.value)}
      placeholder={field.placeholder ?? "Tulis di sini..."}
      className={`${umum} w-full`}
    />
  );
}

function Blok({ blok, jawaban, onUbah, onAmbilSensor, terkunci }: { blok: LkpdBlok } & Omit<Props, "bagian">) {
  const isi = { jawaban, onUbah, terkunci };

  if (blok.jenis === "catatan") {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-blue-200/30 border-2 border-blue-200">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-ink-900 leading-relaxed">{blok.teks}</p>
      </div>
    );
  }

  if (blok.jenis === "isian") {
    return (
      <div className="space-y-3">
        {blok.judul && (
          <p className="text-xs sm:text-sm font-heading font-bold text-ink-900 leading-relaxed">{blok.judul}</p>
        )}
        {blok.fields.map((field) => (
          <div key={field.id} className="space-y-1.5">
            {field.label && (
              <label htmlFor={field.id} className="block text-xs font-bold text-ink-600 leading-relaxed">
                {field.label}
              </label>
            )}
            <Isian field={field} {...isi} />
          </div>
        ))}
      </div>
    );
  }

  if (blok.jenis === "kolom") {
    return (
      <div className="space-y-3">
        <p className="text-xs sm:text-sm font-heading font-bold text-ink-900 leading-relaxed">{blok.judul}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {blok.kolom.map((kolom) => (
            <div key={kolom.judul} className="rounded-2xl border-2 border-green-200 overflow-hidden bg-white">
              <p className="bg-green-600 text-white px-3 py-2 text-xs font-heading font-extrabold leading-snug">
                {kolom.judul}
              </p>
              <div className="p-2.5 space-y-2">
                {kolom.fields.map((field) => (
                  <Isian key={field.id} field={field} {...isi} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (blok.jenis === "tabel") {
    return (
      <div className="space-y-3">
        <p className="text-xs sm:text-sm font-heading font-bold text-ink-900 leading-relaxed">{blok.judul}</p>

        {/* Di layar kecil tabel lima kolom tidak terbaca, jadi tiap baris jadi satu kartu. */}
        <div className="space-y-3 lg:hidden">
          {blok.baris.map((baris) => {
            const sensor = baris.pot && onAmbilSensor ? onAmbilSensor(baris.pot) : null;
            return (
              <div key={baris.label} className="rounded-2xl border-2 border-green-200 overflow-hidden bg-white">
                <div className="bg-green-600 text-white px-3 py-2">
                  <p className="text-xs font-heading font-extrabold">{baris.label}</p>
                  {baris.sub && <p className="text-[10px] opacity-90 leading-snug">{baris.sub}</p>}
                </div>
                <div className="p-3 space-y-2.5">
                  {baris.fields.map((field, i) => (
                    <div key={field.id} className="space-y-1">
                      <span className="block text-[11px] font-bold text-ink-600">{blok.kepala[i + 1]}</span>
                      <Isian field={field} {...isi} />
                    </div>
                  ))}
                  {baris.pot && onAmbilSensor && !terkunci && (
                    <TombolSensor baris={baris} sensor={sensor} onUbah={onUbah} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden lg:block overflow-x-auto rounded-2xl border-2 border-green-200">
          <table className="w-full text-xs">
            <thead className="bg-green-600 text-white">
              <tr>
                {blok.kepala.map((judul) => (
                  <th key={judul} className="px-3 py-2.5 text-left font-heading font-extrabold">
                    {judul}
                  </th>
                ))}
                {blok.baris.some((b) => b.pot) && onAmbilSensor && <th className="px-3 py-2.5" />}
              </tr>
            </thead>
            <tbody className="bg-white">
              {blok.baris.map((baris) => {
                const sensor = baris.pot && onAmbilSensor ? onAmbilSensor(baris.pot) : null;
                return (
                  <tr key={baris.label} className="border-t-2 border-green-100 align-top">
                    <td className="px-3 py-2.5">
                      <p className="font-heading font-extrabold text-ink-900">{baris.label}</p>
                      {baris.sub && <p className="text-[11px] text-ink-600 leading-snug">{baris.sub}</p>}
                    </td>
                    {baris.fields.map((field) => (
                      <td key={field.id} className="px-2 py-2.5 min-w-[7.5rem]">
                        <Isian field={field} {...isi} />
                      </td>
                    ))}
                    {baris.pot && onAmbilSensor && (
                      <td className="px-2 py-2.5">
                        {!terkunci && <TombolSensor baris={baris} sensor={sensor} onUbah={onUbah} />}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Menjodohkan: tiap baris kiri memilih satu huruf dari daftar kanan.
  return (
    <div className="space-y-3">
      <p className="text-xs sm:text-sm font-heading font-bold text-ink-900 leading-relaxed">{blok.judul}</p>

      <div className="rounded-2xl border-2 border-brown-400/40 bg-cream-50 p-3 space-y-1.5">
        <p className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-brown-600">Isi Kebun</p>
        {blok.kanan.map((kanan) => (
          <p key={kanan.kode} className="text-xs text-ink-900 leading-relaxed">
            <strong className="font-heading font-extrabold text-brown-600">{kanan.kode}.</strong> {kanan.teks}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        {blok.kiri.map((kiri) => (
          <div
            key={kiri.id}
            className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 rounded-2xl border-2 border-green-200 bg-white"
          >
            <span className="text-xs font-bold text-ink-900 flex-1 leading-snug">{kiri.teks}</span>
            <Isian
              field={{ id: kiri.id, type: "pilihan", opsi: blok.kanan.map((k) => k.kode) }}
              jawaban={jawaban}
              onUbah={onUbah}
              terkunci={terkunci}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TombolSensor({
  baris,
  sensor,
  onUbah,
}: {
  baris: { pot?: string; fields: LkpdField[] };
  sensor: { kelembapan: number; suhu: number } | null;
  onUbah: Props["onUbah"];
}) {
  const kelembapan = baris.fields.find((f) => f.satuan === "%");
  const suhu = baris.fields.find((f) => f.satuan === "°C");

  return (
    <button
      type="button"
      disabled={!sensor}
      onClick={() => {
        if (!sensor) return;
        if (kelembapan) onUbah(kelembapan.id, String(Number(sensor.kelembapan.toFixed(1))));
        if (suhu) onUbah(suhu.id, String(Number(sensor.suhu.toFixed(1))));
      }}
      title={sensor ? `Isi dari pembacaan Pot ${baris.pot}` : `Pot ${baris.pot} belum menyala`}
      className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-pill text-[11px] font-heading font-bold border-2 border-blue-200 bg-blue-200/30 text-blue-500 hover:bg-blue-200/60 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
    >
      <Droplets className="w-3.5 h-3.5" />
      <Thermometer className="w-3.5 h-3.5" />
      {sensor ? "Ambil dari alat" : "Alat belum menyala"}
    </button>
  );
}

export function LkpdForm({ bagian, jawaban, onUbah, onAmbilSensor, terkunci }: Props) {
  return (
    <div className="space-y-5">
      {/* Kepala bagian meniru papan coklat pada lembar cetak */}
      <div className="rounded-3xl bg-brown-600 text-white p-4 sm:p-5 space-y-2">
        <h2 className="font-heading font-extrabold text-base sm:text-xl leading-tight">{bagian.judul}</h2>
        {bagian.subjudul && <p className="text-xs sm:text-sm text-white/90 leading-relaxed">{bagian.subjudul}</p>}
        {bagian.aktivitas && (
          <div className="pt-1 space-y-1">
            <p className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-yellow-300">
              Aktivitas Petualangan Kelompok
            </p>
            <ol className="list-decimal list-inside space-y-0.5">
              {bagian.aktivitas.map((teks) => (
                <li key={teks} className="text-[11px] sm:text-xs text-white/90 leading-relaxed">
                  {teks}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {bagian.blok.map((blok, i) => (
        <div key={i} className="card space-y-3">
          <Blok blok={blok} jawaban={jawaban} onUbah={onUbah} onAmbilSensor={onAmbilSensor} terkunci={terkunci} />
        </div>
      ))}
    </div>
  );
}
