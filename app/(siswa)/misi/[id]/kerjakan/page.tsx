"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockMissions, mockDevices } from "@/lib/mock-data";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Save, Send, Camera, Upload, Info } from "lucide-react";
import { showSuccessAlert, showWarningAlert, showConfirmDialog, showToast } from "@/lib/swal";

export default function KerjakanMisiPage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = routeParams?.id as string;
  const mission = mockMissions.find((m) => m.id === id) || mockMissions[0];
  if (!mission) notFound();

  const [form, setForm] = useState({
    observation: "",
    conclusion: "",
    reflection: "",
    selectedSensors: [] as string[],
  });
  const [status, setStatus] = useState<"idle" | "saved" | "submitted">("idle");

  const device = mockDevices[0];
  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setStatus("idle");
  };

  const isEmpty = !form.observation.trim() || !form.conclusion.trim() || !form.reflection.trim();

  return (
    <AppShell role="siswa">
      <PageHeader
        title={`Kerjakan: ${mission.title}`}
        description="Isi formulir pengerjaan misi dan kumpulkan buktimu."
      />

      <ContentWrapper className="space-y-4 pb-8">
        {/* Status bar */}
        {status !== "idle" && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
            status === "saved" ? "bg-siswa-100 text-siswa-600" : "bg-guru-100 text-guru-600"
          }`}>
            {status === "saved" ? "✓ Draf tersimpan" : "✓ Misi berhasil dikirim!"}
          </div>
        )}

        {/* Panduan */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-soft border border-[var(--accent)]/20">
          <Info className="h-4 w-4 text-[var(--accent)] flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-xs text-ink-muted">
            Isi setiap bagian berdasarkan pengamatan dan data sensor yang kamu kumpulkan sendiri.
            Data sensor harus dicatat dengan waktu pembacaannya.
          </p>
        </div>

        {/* 1. Catatan Pengamatan */}
        <div className="card">
          <label className="block text-sm font-bold text-ink mb-1">
            1. Catatan Pengamatan Visual <span className="text-[#B42318]">*</span>
          </label>
          <p className="text-xs text-ink-muted mb-2">Deskripsikan apa yang kamu lihat pada tanaman dan media tanam secara langsung.</p>
          <textarea
            rows={4}
            className="input-field h-auto resize-none"
            placeholder="Contoh: Daun kangkung berwarna hijau tua, batang tegak, tidak ada tanda-tanda layu. Media tanam terasa lembap saat disentuh..."
            value={form.observation}
            onChange={(e) => handleChange("observation", e.target.value)}
          />
          {!form.observation && (
            <p className="text-xs text-[#B42318] mt-1">Catatan pengamatan wajib diisi.</p>
          )}
        </div>

        {/* 2. Data Sensor */}
        <div className="card">
          <label className="block text-sm font-bold text-ink mb-1">2. Data Sensor yang Digunakan</label>
          <p className="text-xs text-ink-muted mb-3">Pilih data sensor yang kamu gunakan sebagai bukti. Pastikan catat waktu pembacaannya.</p>

          {device.sensors.map((sensor) => (
            <label
              key={sensor.sensorId}
              className="flex items-center gap-3 p-3 rounded-xl border border-line hover:border-[var(--accent)] cursor-pointer transition-all duration-150 mb-2"
            >
              <input
                type="checkbox"
                className="accent-[var(--accent)] h-4 w-4"
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...form.selectedSensors, sensor.sensorId]
                    : form.selectedSensors.filter((s) => s !== sensor.sensorId);
                  setForm((f) => ({ ...f, selectedSensors: next }));
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">
                  {sensor.sensorType === "air_temp" ? "Suhu Udara" :
                   sensor.sensorType === "air_humidity" ? "Kelembapan Udara" :
                   sensor.sensorType === "soil_moisture" ? "Kelembapan Tanah" : "Intensitas Cahaya"} —{" "}
                  <span className="text-[var(--accent)] font-bold tabular-nums">{sensor.value}{sensor.unit}</span>
                </p>
                <p className="text-xs text-ink-muted">
                  Waktu baca: {new Date(sensor.measuredAt).toLocaleString("id-ID")}
                </p>
              </div>
            </label>
          ))}
        </div>

        {/* 3. Kesimpulan */}
        <div className="card">
          <label className="block text-sm font-bold text-ink mb-1">
            3. Kesimpulan <span className="text-[#B42318]">*</span>
          </label>
          <p className="text-xs text-ink-muted mb-2">Tulis kesimpulanmu berdasarkan pengamatan DAN data sensor. Jangan simpulkan hanya dari satu sumber.</p>
          <textarea
            rows={4}
            className="input-field h-auto resize-none"
            placeholder="Berdasarkan pengamatan visual dan data sensor (suhu X°C, kelembapan tanah X%)..."
            value={form.conclusion}
            onChange={(e) => handleChange("conclusion", e.target.value)}
          />
        </div>

        {/* 4. Refleksi */}
        <div className="card">
          <label className="block text-sm font-bold text-ink mb-1">
            4. Refleksi <span className="text-[#B42318]">*</span>
          </label>
          <p className="text-xs text-ink-muted mb-2">Apa yang kamu pelajari? Apa pertanyaan lanjutan yang muncul?</p>
          <textarea
            rows={3}
            className="input-field h-auto resize-none"
            placeholder="Saya belajar bahwa... Saya masih penasaran tentang..."
            value={form.reflection}
            onChange={(e) => handleChange("reflection", e.target.value)}
          />
        </div>

        {/* 5. Upload Bukti */}
        <div className="card">
          <label className="block text-sm font-bold text-ink mb-1">5. Bukti Tambahan (opsional)</label>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => showSuccessAlert("Simulasi Foto Berhasil", "Foto dokumentasi pertumbuhan tanaman telah berhasil ditambahkan.")}
              className="btn-secondary gap-2 text-xs flex-1 cursor-pointer"
            >
              <Camera className="h-3.5 w-3.5" strokeWidth={1.75} />
              Foto Tanaman
            </button>
            <button
              type="button"
              onClick={() => showSuccessAlert("Simulasi Dokumen", "Dokumen grafik sensor IoT terlampir dengan format PDF.")}
              className="btn-secondary gap-2 text-xs flex-1 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
              Upload Dokumen
            </button>
          </div>
          <p className="text-[10px] text-ink-muted mt-2">Foto hanya bila diizinkan sekolah. Maks 5MB per file.</p>
        </div>

        {/* Footer actions — sticky on mobile */}
        <div className="sticky bottom-20 lg:relative lg:bottom-auto flex gap-3 bg-bg/80 backdrop-blur-sm lg:backdrop-blur-none lg:bg-transparent py-2 -mx-4 px-4 lg:mx-0 lg:px-0">
          <button
            type="button"
            className="btn-secondary flex-1 gap-2 cursor-pointer"
            onClick={async () => {
              setStatus("saved");
              await showToast("Draf misi berhasil disimpan!", "success");
            }}
          >
            <Save className="h-4 w-4" strokeWidth={1.75} />
            Simpan Draf
          </button>
          <button
            type="button"
            className={`btn-primary flex-[2] gap-2 cursor-pointer ${isEmpty ? "opacity-60" : ""}`}
            onClick={async () => {
              if (isEmpty) {
                await showWarningAlert("Data Belum Lengkap", "Harap isi Catatan Pengamatan, Kesimpulan, dan Refleksi sebelum mengirim.");
                return;
              }
              const confirm = await showConfirmDialog({
                title: "Kumpulkan Misi?",
                text: "Laporan observasi dan data sensor akan dikirimkan kepada guru pembimbing untuk dievaluasi.",
                icon: "question",
                confirmButtonText: "Ya, Kirim Sekarang",
                cancelButtonText: "Periksa Lagi",
                role: "siswa",
              });

              if (confirm.isConfirmed) {
                setStatus("submitted");
                await showSuccessAlert("Misi Berhasil Dikirim!", "Laporanmu telah berhasil dikirimkan ke guru pembimbing. Pantau status penilaian di menu Misi & Tugas.", 1800);
                router.push("/misi");
              }
            }}
          >
            <Send className="h-4 w-4" strokeWidth={1.75} />
            Kirim Misi
          </button>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
