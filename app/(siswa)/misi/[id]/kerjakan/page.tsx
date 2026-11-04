"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockMissions, mockDevices } from "@/lib/mock-data";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Save, Send, Camera, Upload, Info, Check, Sparkles, Droplets, ArrowLeft } from "lucide-react";
import { showSuccessAlert, showWarningAlert, showConfirmDialog, showToast } from "@/lib/swal";
import Link from "next/link";

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
    attachments: [] as string[],
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
        description="Lengkapi bukti pengamatan visual dan lampiran data sensor fisik."
        action={
          <Link href={`/misi/${mission.id}`} className="btn-ghost text-xs gap-1.5 inline-flex items-center">
            <ArrowLeft className="h-4 w-4" />
            Detail Kartu Misi
          </Link>
        }
      />

      <ContentWrapper className="space-y-5 pb-10">
        {/* Status bar */}
        {status !== "idle" && (
          <div className={`flex items-center gap-2 p-3.5 rounded-2xl text-xs md:text-sm font-heading font-bold shadow-xs ${
            status === "saved" ? "bg-yellow-300 text-brown-600 border-2 border-yellow-400" : "bg-green-100 text-green-800 border-2 border-green-300"
          }`}>
            <Check className="w-4 h-4 stroke-[3]" />
            {status === "saved" ? "Draf laporan berhasil disimpan di sesi lokalmu!" : "Misi berhasil dikirimkan ke guru pembimbing!"}
          </div>
        )}

        {/* Panduan Ilmiah */}
        <div className="bg-green-100/80 border-2 border-green-300 rounded-3xl p-4 flex items-start gap-3 shadow-xs">
          <Info className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-ink-900 leading-relaxed font-medium">
            <strong>Petunjuk:</strong> Hubungkan apa yang terlihat langsung pada tanaman (warna daun, kesegaran batang) dengan angka sensor (suhu, kelembapan). Jangan menyimpulkan hanya dari satu data saja!
          </p>
        </div>

        {/* 1. Catatan Pengamatan Visual */}
        <div className="card space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="obs-text" className="font-heading font-extrabold text-sm md:text-base text-ink-900">
              1. Catatan Pengamatan Visual Lapangan <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] font-bold text-ink-600">Wajib diisi</span>
          </div>
          <p className="text-xs text-ink-600 leading-relaxed">
            Deskripsikan kondisi fisik tanaman secara nyata: warna daun, tunas baru, tinggi tanaman, dan kelembapan media saat disentuh.
          </p>
          <textarea
            id="obs-text"
            rows={4}
            className="input-field h-auto py-3 leading-relaxed text-xs md:text-sm"
            placeholder="Contoh: Daun kangkung terlihat hijau segar, batang tegak tidak ada tanda layu. Permukaan cocopeat terasa lembap gembur..."
            value={form.observation}
            onChange={(e) => handleChange("observation", e.target.value)}
          />
        </div>

        {/* 2. Lampirkan Data Sensor IoT */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-heading font-extrabold text-sm md:text-base text-ink-900">
              2. Lampirkan Data Sensor sebagai Bukti Kuat
            </label>
            <Link href="/lab-iot" className="text-xs font-heading font-bold text-green-700 hover:underline">
              Buka Lab IoT →
            </Link>
          </div>
          <p className="text-xs text-ink-600">
            Centang sensor yang relevan dengan pengamatanmu dari <strong>{device.name}</strong>:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {device.sensors.map((sensor) => {
              const isChecked = form.selectedSensors.includes(sensor.sensorId);
              return (
                <label
                  key={sensor.sensorId}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isChecked
                      ? "border-green-500 bg-green-100/70 shadow-xs"
                      : "border-green-200 bg-white hover:bg-green-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    className="accent-green-600 h-4 w-4 rounded cursor-pointer"
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...form.selectedSensors, sensor.sensorId]
                        : form.selectedSensors.filter((s) => s !== sensor.sensorId);
                      setForm((f) => ({ ...f, selectedSensors: next }));
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-heading font-bold text-ink-900 truncate">
                      {sensor.sensorType === "air_temp" ? "Suhu Udara" : "Kelembapan Tanah"}
                    </p>
                    <p className="text-xs text-green-700 font-extrabold tabular-nums">
                      {sensor.value} {sensor.unit}
                    </p>
                    <p className="text-[10px] text-ink-600">
                      Waktu: {new Date(sensor.measuredAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. Kesimpulan Ilmiah */}
        <div className="card space-y-2">
          <label htmlFor="concl-text" className="font-heading font-extrabold text-sm md:text-base text-ink-900 block">
            3. Kesimpulan Ilmiah <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-ink-600">
            Tulis kesimpulan logis berdasarkan gabungan pengamatan visual DAN bukti data sensor di atas.
          </p>
          <textarea
            id="concl-text"
            rows={3}
            className="input-field h-auto py-3 leading-relaxed text-xs md:text-sm"
            placeholder="Contoh: Berdasarkan data suhu 28.4°C dan kelembapan media 45%, tanaman berada dalam kondisi vegetatif optimal..."
            value={form.conclusion}
            onChange={(e) => handleChange("conclusion", e.target.value)}
          />
        </div>

        {/* 4. Refleksi & Pertanyaan Lanjutan */}
        <div className="card space-y-2">
          <label htmlFor="ref-text" className="font-heading font-extrabold text-sm md:text-base text-ink-900 block">
            4. Refleksi Pembelajaran <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-ink-600">
            Apa hal baru yang kamu pelajari dari eksperimen ini? Apa pertanyaan yang ingin kamu teliti selanjutnya?
          </p>
          <textarea
            id="ref-text"
            rows={3}
            className="input-field h-auto py-3 leading-relaxed text-xs md:text-sm"
            placeholder="Contoh: Saya belajar bahwa angka kelembapan tanah sangat mempengaruhi laju pertumbuhan tunas baru..."
            value={form.reflection}
            onChange={(e) => handleChange("reflection", e.target.value)}
          />
        </div>

        {/* 5. Lampiran Bukti Foto / Dokumen */}
        <div className="card space-y-3">
          <label className="font-heading font-extrabold text-sm md:text-base text-ink-900 block">
            5. Bukti Foto / Dokumen Pendukung (Opsional)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                setForm((f) => ({ ...f, attachments: [...f.attachments, "foto_tunas_kangkung.jpg"] }));
                showSuccessAlert("Foto Terlampir!", "Foto dokumentasi tanaman hidroponik berhasil ditambahkan.", 1200);
              }}
              className="btn-ghost text-xs gap-2 flex-1 border-2 border-green-300 py-2.5 cursor-pointer inline-flex items-center justify-center"
            >
              <Camera className="w-4 h-4 text-green-600" />
              Ambil / Unggah Foto Tanaman
            </button>
            <button
              type="button"
              onClick={() => {
                setForm((f) => ({ ...f, attachments: [...f.attachments, "grafik_lab_iot.pdf"] }));
                showSuccessAlert("Grafik Terlampir!", "Ekspor grafik IoT berhasil dilampirkan.", 1200);
              }}
              className="btn-ghost text-xs gap-2 flex-1 border-2 border-green-300 py-2.5 cursor-pointer inline-flex items-center justify-center"
            >
              <Upload className="w-4 h-4 text-green-600" />
              Lampirkan Tangkapan Layar Sensor
            </button>
          </div>

          {form.attachments.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {form.attachments.map((att, i) => (
                <span key={i} className="px-3 py-1 rounded-pill bg-green-100 text-green-800 text-xs font-bold border border-green-300 inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> {att}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tombol Aksi Bawah */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="btn-secondary flex-1 gap-2 cursor-pointer inline-flex items-center justify-center"
            onClick={async () => {
              setStatus("saved");
              await showToast("Draf misi berhasil disimpan!", "success");
            }}
          >
            <Save className="h-4 w-4" />
            Simpan Draf Laporan
          </button>

          <button
            type="button"
            className={`btn-primary flex-[2] gap-2 cursor-pointer inline-flex items-center justify-center ${isEmpty ? "opacity-60" : ""}`}
            onClick={async () => {
              if (isEmpty) {
                await showWarningAlert("Data Belum Lengkap", "Harap isi Catatan Pengamatan, Kesimpulan, dan Refleksi sebelum mengirim.");
                return;
              }
              const confirm = await showConfirmDialog({
                title: "Kumpulkan Misi ke Guru?",
                text: "Laporan observasi dan bukti sensor akan dikirimkan langsung ke penilaian guru pembimbing.",
                icon: "question",
                confirmButtonText: "Ya, Kirim Sekarang!",
                cancelButtonText: "Periksa Lagi",
                role: "siswa",
              });

              if (confirm.isConfirmed) {
                setStatus("submitted");
                await showSuccessAlert(
                  "Misi Berhasil Dikirimkan! 🎉",
                  "Laporanmu telah diterima Pak Eko. Kamu mendapatkan +40 Bintang!",
                  1800
                );
                router.push("/misi");
              }
            }}
          >
            <Send className="h-4 w-4" />
            Saya Sudah Selesai! Kirim Misi Ini
          </button>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
