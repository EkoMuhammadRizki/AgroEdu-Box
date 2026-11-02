"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import {
  Settings, Save, Key, Cpu, Bell, Shield,
  Check, RefreshCw, Smartphone, Sliders, Info
} from "lucide-react";
import { useState } from "react";
import { showSuccessAlert, showConfirmDialog } from "@/lib/swal";

export default function GuruPengaturanPage() {
  const [teacherName, setTeacherName] = useState("Pak Eko Mulyadi, S.P.");
  const [schoolName, setSchoolName] = useState("SMK Pertanian Negeri 1");
  const [telemetryInterval, setTelemetryInterval] = useState("60");
  const [offlineThreshold, setOfflineThreshold] = useState("180");
  const [apiToken, setApiToken] = useState("aeb_live_token_77a94f091bc389d4");
  const [showToken, setShowToken] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Calibration settings per crop
  const [cropCalibration, setCropCalibration] = useState({
    kangkung: { minTemp: 24, maxTemp: 30, minSoil: 40, maxSoil: 60, minLight: 2500 },
    bayam: { minTemp: 22, maxTemp: 28, minSoil: 45, maxSoil: 65, minLight: 2000 },
    selada: { minTemp: 18, maxTemp: 25, minSoil: 50, maxSoil: 70, minLight: 1800 },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    await showSuccessAlert("Pengaturan Berhasil Disimpan!", "Konfigurasi telemetri ESP32 dan ambang batas kalibrasi sensor telah diperbarui.", 1600);
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
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink block mb-1">Email Guru</label>
                <input
                  type="email"
                  disabled
                  value="eko.guru@agroedubox.id"
                  className="input-field text-xs bg-surface-muted text-ink-muted cursor-not-allowed"
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
                    type={showToken ? "text" : "password"}
                    readOnly
                    value={apiToken}
                    className="input-field text-xs font-mono flex-1 bg-surface-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="btn-secondary text-xs"
                  >
                    {showToken ? "Sembunyikan" : "Tampilkan"}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const confirm = await showConfirmDialog({
                        title: "Generate Token Baru?",
                        text: "Token lama tidak akan berlaku lagi. Perangkat ESP32 harus dikonfigurasi ulang dengan token baru.",
                        icon: "warning",
                        confirmButtonText: "Ya, Buat Token Baru",
                        cancelButtonText: "Batal",
                        role: "guru",
                      });
                      if (confirm.isConfirmed) {
                        const newToken = `aeb_live_${Math.random().toString(36).substring(2, 12)}`;
                        setApiToken(newToken);
                        await showSuccessAlert("Token Baru Berhasil Dibuat!", `Token ingest: ${newToken}`, 1600);
                      }
                    }}
                    className="btn-secondary text-xs gap-1 inline-flex items-center cursor-pointer"
                    title="Generate Token Baru"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
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
                <div>
                  <label className="text-[11px] text-ink-muted block mb-1">Intensitas Cahaya (lux)</label>
                  <input
                    type="text"
                    defaultValue="> 2500"
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bayam Hijau */}
            <div className="p-3.5 rounded-xl bg-surface-muted border border-line space-y-3">
              <h4 className="text-xs font-bold text-ink">2. Bayam Hijau (Amaranthus tricolor)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
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
                <div>
                  <label className="text-[11px] text-ink-muted block mb-1">Intensitas Cahaya (lux)</label>
                  <input
                    type="text"
                    defaultValue="> 2000"
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
