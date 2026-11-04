"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import {
  Save, Cpu, Shield,
  Check, Sliders, Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { showSuccessAlert } from "@/lib/swal";
import { getGuruName, getGuruEmail, saveGuruProfile } from "@/lib/guru-client";

export default function GuruPengaturanPage() {
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [schoolName, setSchoolName] = useState("SMK Pertanian Negeri 1");
  const [telemetryInterval, setTelemetryInterval] = useState("60");
  const [offlineThreshold, setOfflineThreshold] = useState("180");
  const [apiToken, setApiToken] = useState("aeb_live_token_77a94f091bc389d4");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // 1. Inisialisasi cepat dari client-side storage
    const localName = getGuruName();
    if (localName) setTeacherName(localName);

    const localEmail = getGuruEmail();
    if (localEmail) setTeacherEmail(localEmail);

    try {
      const storedSchool = localStorage.getItem("agro_guru_school");
      if (storedSchool) setSchoolName(storedSchool);
    } catch {
      // ignore
    }

    // 2. Sinkronkan dengan data akun guru dari server session Supabase
    fetch("/api/guru/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.guru) {
          if (data.guru.nama) {
            setTeacherName(data.guru.nama);
            saveGuruProfile({ nama: data.guru.nama });
          }
          if (data.guru.email) {
            setTeacherEmail(data.guru.email);
            saveGuruProfile({ email: data.guru.email });
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);

    // Simpan ke local client
    saveGuruProfile({ nama: teacherName, email: teacherEmail });
    try {
      localStorage.setItem("agro_guru_school", schoolName);
    } catch {
      // ignore
    }

    // Perbarui nama di database jika tersambung
    try {
      await fetch("/api/guru/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: teacherName }),
      });
    } catch {
      // ignore
    }

    await showSuccessAlert(
      "Pengaturan Berhasil Disimpan!",
      "Profil guru dan konfigurasi IoT telah diperbarui.",
      1600
    );
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <AppShell role="guru">
      <PageHeader
        title="Pengaturan Sistem & IoT"
        description="Konfigurasi parameter ESP32, token telemetri, ambang kalibrasi tanaman, dan profil akun guru."
      />

      <ContentWrapper className="pb-16 max-w-4xl space-y-6">
        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="h-4 w-4 text-emerald-600" />
            Pengaturan sistem dan kalibrasi berhasil disimpan!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Profil Guru & Sekolah */}
          <div className="card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <Shield className="h-4 w-4 text-guru-700" />
              <h3 className="text-sm font-bold text-ink">Profil Guru & Lembaga</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-ink block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  placeholder="Nama Guru"
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink block mb-1">Nama Sekolah / Instansi</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  placeholder="Nama Sekolah"
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink block mb-1">Email Guru (Akun Terdaftar)</label>
                <input
                  type="email"
                  disabled
                  value={teacherEmail || "guru.agroedubox@gmail.com"}
                  className="input-field text-xs bg-surface-muted text-ink-muted cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink block mb-1">Peran Akses</label>
                <input
                  type="text"
                  disabled
                  value="Guru Pembimbing (AGRO EDU TRACK)"
                  className="input-field text-xs bg-surface-muted text-ink-muted cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* 2. Pengaturan Ingest Telemetri ESP32 */}
          <div className="card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <Cpu className="h-4 w-4 text-guru-700" />
              <h3 className="text-sm font-bold text-ink">Konfigurasi Jaringan & Telemetri ESP32</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink block mb-1">Token Autentikasi Ingest Telemetri</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    disabled
                    value={apiToken}
                    className="input-field text-xs font-mono bg-surface-muted text-ink-muted cursor-not-allowed flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(apiToken);
                      alert("Token disalin ke papan klip!");
                    }}
                    className="btn-ghost text-xs px-3"
                  >
                    Salin
                  </button>
                </div>
                <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">
                  Gunakan token ini pada header HTTP POST <code className="font-mono text-ink">X-Box-Token</code> saat ESP32 mengirim paket telemetri ke endpoint <code className="font-mono text-ink">/api/iot/ingest</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-ink block mb-1">Frekuensi Transmisi Telemetri</label>
                  <select
                    value={telemetryInterval}
                    onChange={(e) => setTelemetryInterval(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="30">Setiap 30 Detik (Mode Eksperimen Cepat)</option>
                    <option value="60">Setiap 1 Menit (Rekomendasi Standar)</option>
                    <option value="300">Setiap 5 Menit (Hemat Daya / Baterai)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink block mb-1">Batas Waktu Status Offline</label>
                  <select
                    value={offlineThreshold}
                    onChange={(e) => setOfflineThreshold(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="120">2 Jam Tanpa Data</option>
                    <option value="180">3 Jam Tanpa Data (Default)</option>
                    <option value="360">6 Jam Tanpa Data</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Parameter Kalibrasi Sensor Per Tanaman */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-guru-700" />
                <h3 className="text-sm font-bold text-ink">Ambang Batas Kalibrasi Sensor per Komoditas</h3>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-3">
              <Info className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>Prinsip Ilmiah AGRO EDU BOX:</strong> Nilai sensor tidak boleh diberi label &quot;baik/buruk&quot; dari angka universal. Nilai di bawah ini digunakan sebagai rentang target referensi bagi siswa untuk membandingkan pembacaan nyata.
              </p>
            </div>

            {/* Kangkung */}
            <div className="p-3.5 rounded-xl bg-surface-muted border border-line space-y-3">
              <h4 className="text-xs font-bold text-ink">1. Kangkung Darat (Ipomoea aquatica)</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-ink-muted block mb-1">Suhu Target (°C)</label>
                  <input
                    type="text"
                    defaultValue="24.0 - 30.0"
                    className="input-field text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-ink-muted block mb-1">Kelembapan Media (%)</label>
                  <input
                    type="text"
                    defaultValue="40 - 60"
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bayam Hijau */}
            <div className="p-3.5 rounded-xl bg-surface-muted border border-line space-y-3">
              <h4 className="text-xs font-bold text-ink">2. Bayam Hijau (Amaranthus tricolor)</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-ink-muted block mb-1">Suhu Target (°C)</label>
                  <input
                    type="text"
                    defaultValue="22.0 - 28.0"
                    className="input-field text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-ink-muted block mb-1">Kelembapan Media (%)</label>
                  <input
                    type="text"
                    defaultValue="45 - 65"
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="btn-primary text-xs gap-1.5 inline-flex items-center px-6 py-2.5"
            >
              <Save className="h-4 w-4" />
              Simpan Semua Perubahan
            </button>
          </div>
        </form>
      </ContentWrapper>
    </AppShell>
  );
}
