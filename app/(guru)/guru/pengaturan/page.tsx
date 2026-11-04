"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { usePots } from "@/lib/use-pots";
import { formatLastSeen, readSensor } from "@/lib/iot";
import { SOIL_DRY_BELOW, SOIL_OK_FROM, SOIL_WET_ABOVE } from "@/lib/pot-mood";
import { getGuruEmail, getGuruName, saveGuruProfile } from "@/lib/guru-client";
import { showSuccessAlert, showWarningAlert } from "@/lib/swal";
import { Save, Shield, Cpu, Info } from "lucide-react";
import { useEffect, useState } from "react";

export default function GuruPengaturanPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);
  const pots = usePots(10000);

  useEffect(() => {
    const lokalNama = getGuruName();
    if (lokalNama) setNama(lokalNama);
    const lokalEmail = getGuruEmail();
    if (lokalEmail) setEmail(lokalEmail);

    fetch("/api/guru/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.guru) return;
        if (data.guru.nama) {
          setNama(data.guru.nama);
          saveGuruProfile({ nama: data.guru.nama });
        }
        if (data.guru.email) {
          setEmail(data.guru.email);
          saveGuruProfile({ email: data.guru.email });
        }
      })
      .catch(() => {});
  }, []);

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      await showWarningAlert("Nama Belum Diisi", "Isi nama Anda lebih dulu ya.");
      return;
    }
    setMenyimpan(true);
    try {
      const res = await fetch("/api/guru/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: nama.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      saveGuruProfile({ nama: nama.trim() });
      await showSuccessAlert("Tersimpan!", "Nama Anda sudah diperbarui.", 1400);
    } catch {
      await showWarningAlert("Belum Tersimpan", "Periksa koneksi internet lalu coba lagi.");
    }
    setMenyimpan(false);
  };

  const menyala = pots.filter((p) => p.status === "online").length;

  return (
    <AppShell role="guru">
      <PageHeader title="Pengaturan" description="Profil akun Anda dan kondisi alat IoT di kelas." />

      <ContentWrapper className="pb-16 max-w-4xl space-y-5">
        {/* Profil guru */}
        <form onSubmit={simpan} className="card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <Shield className="h-4 w-4 text-[var(--accent)]" />
            <h2 className="text-sm font-bold text-ink">Profil Akun Guru</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nama" className="text-xs font-semibold text-ink block mb-1">
                Nama Lengkap
              </label>
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama Anda"
                className="input-field text-xs"
              />
              <p className="text-[11px] text-ink-muted mt-1">
                Nama ini yang dilihat siswa pada umpan balik LKPD dan Kartu Misi.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="text-xs font-semibold text-ink block mb-1">
                Email Akun
              </label>
              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className="input-field text-xs bg-surface-muted text-ink-muted cursor-not-allowed"
              />
              <p className="text-[11px] text-ink-muted mt-1">
                Email dan kata sandi diubah lewat Supabase oleh pengelola sistem.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={menyimpan} className="btn-primary text-xs gap-1.5 inline-flex items-center px-5">
              <Save className="h-3.5 w-3.5" />
              {menyimpan ? "Menyimpan..." : "Simpan Nama"}
            </button>
          </div>
        </form>

        {/* Kondisi alat: hanya tampilan, tidak ada yang perlu diatur */}
        <section className="card space-y-3">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[var(--accent)]" />
              <h2 className="text-sm font-bold text-ink">Kondisi Alat IoT</h2>
            </div>
            <span className="text-xs font-bold text-ink-muted">{menyala}/{pots.length} pot menyala</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {pots.map((pot) => {
              const hidup = pot.status === "online";
              return (
                <div
                  key={pot.id}
                  data-pot-pengaturan={pot.id}
                  className={`p-3 rounded-xl border ${hidup ? "bg-green-100/60 border-green-300" : "bg-surface-muted border-line"}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${hidup ? "bg-green-500" : "bg-ink-300"}`} />
                    <p className="text-xs font-bold text-ink">{pot.name}</p>
                  </div>
                  <p className="text-lg font-extrabold text-ink mt-1 tabular-nums">
                    {hidup ? `${Number(readSensor(pot, "soil_moisture").toFixed(1))}%` : "—"}
                  </p>
                  <p className="text-[11px] text-ink-muted leading-snug">
                    {hidup ? `Suhu ${Number(readSensor(pot, "air_temp").toFixed(1))}°C` : formatLastSeen(pot.lastDataAt)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-200/20 border border-blue-200">
            <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-ink leading-relaxed space-y-1">
              <p className="font-bold">Alat ini tidak perlu diatur dari sini.</p>
              <p>
                Cukup colokkan daya ESP32 dan tunggu sekitar setengah menit. Angka akan muncul sendiri di
                halaman Data &amp; Sensor dan di Lab IoT siswa. Bila alat dimatikan atau tidak mengirim data
                lebih dari 2 menit, semua angkanya otomatis kembali 0 supaya siswa tidak membaca angka lama.
              </p>
              <p>
                Jika alat tidak kunjung muncul, buka Serial Monitor pada Arduino IDE di kecepatan 115200.
                Pesan di sana sudah menjelaskan sebabnya, misalnya nama WiFi salah atau kata sandi keliru.
              </p>
            </div>
          </div>
        </section>

        {/* Acuan angka, sama dengan LKPD dan alatnya */}
        <section className="card space-y-3">
          <div className="pb-3 border-b border-line">
            <h2 className="text-sm font-bold text-ink">Acuan Kelembapan Tanah</h2>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Angka ini sudah ditanam di alat, di LKPD, dan di soal kuis, jadi tidak perlu diubah.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-xs">
              <thead className="bg-surface-muted text-ink-muted">
                <tr>
                  <th className="text-left font-semibold px-3 py-2">Kelembapan Tanah</th>
                  <th className="text-left font-semibold px-3 py-2">Kondisi</th>
                  <th className="text-left font-semibold px-3 py-2">Tanda pada Alat</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [`Di bawah ${SOIL_DRY_BELOW}%`, "Kering", "LED merah, buzzer berbunyi"],
                  [`${SOIL_DRY_BELOW}–${SOIL_OK_FROM - 1}%`, "Agak kering", "Belum berbunyi"],
                  [`${SOIL_OK_FROM}–${SOIL_WET_ABOVE}%`, "Ideal", "LED hijau"],
                  [`Di atas ${SOIL_WET_ABOVE}%`, "Terlalu basah", "LED merah, buzzer berbunyi"],
                ].map(([rentang, kondisi, tanda]) => (
                  <tr key={rentang} className="border-t border-line">
                    <td className="px-3 py-1.5 font-bold text-ink tabular-nums">{rentang}</td>
                    <td className="px-3 py-1.5 text-ink">{kondisi}</td>
                    <td className="px-3 py-1.5 text-ink-muted">{tanda}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ContentWrapper>
    </AppShell>
  );
}
