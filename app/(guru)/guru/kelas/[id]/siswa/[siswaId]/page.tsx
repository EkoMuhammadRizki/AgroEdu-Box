"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockClasses, mockStudents, mockModules, mockMissions, mockSubmissions } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  User, Award, BookOpen, ClipboardCheck, ArrowLeft,
  CheckCircle2, Clock, Send, MessageSquare, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { showSuccessAlert, showWarningAlert } from "@/lib/swal";

export default function DetailPerkembanganSiswaPage() {
  const params = useParams();
  const classId = (params?.id as string) || "kelas-1";
  const siswaId = (params?.siswaId as string) || "siswa-1";

  const cls = mockClasses.find((c) => c.id === classId) || mockClasses[0];
  const student = mockStudents.find((s) => s.id === siswaId) || mockStudents[0];

  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([
    {
      id: "fb-1",
      date: "14 Okt 2026, 10:15 WIB",
      text: "Pengamatan daun kangkung sangat rinci. Namun pastikan waktu pembacaan sensor dicatat secara tepat sesuai timestamp perangkat.",
      author: "Pak Guru Eko",
    },
    {
      id: "fb-2",
      date: "08 Okt 2026, 14:00 WIB",
      text: "Bagus! Kamu sudah memahami konsep kelembapan kapasitas lapang tanah.",
      author: "Pak Guru Eko",
    },
  ]);

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      await showWarningAlert("Catatan Masih Kosong", "Silakan ketik saran atau umpan balik untuk siswa.");
      return;
    }

    const newFb = {
      id: `fb-${Date.now()}`,
      date: "Hari ini, " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      text: feedback.trim(),
      author: "Pak Guru Eko",
    };

    setFeedbackList([newFb, ...feedbackList]);
    setFeedback("");
    await showSuccessAlert(
      "Umpan Balik Terkirim!",
      `Catatan pembimbing telah dikirimkan ke rapor perkembangan ${student.name}.`,
      1600
    );
  };

  return (
    <AppShell role="guru">
      <PageHeader
        title={`Perkembangan: ${student.name}`}
        description={`${cls.name} · NIS: 2026-${student.id.replace("siswa-", "00")} · Status: Aktif`}
        action={
          <Link href={`/guru/kelas/${classId}`} className="btn-secondary text-xs gap-1.5 inline-flex items-center">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke {cls.name}
          </Link>
        }
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* Ringkasan Skor & Capaian */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Modul Selesai</p>
            <p className="text-2xl font-extrabold text-ink mt-1">3 / 4</p>
            <p className="text-[11px] text-ink-muted mt-1">75% total silabus</p>
          </div>

          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Rata-Rata Kuis</p>
            <p className="text-2xl font-extrabold text-guru-700 mt-1">88 / 100</p>
            <p className="text-[11px] text-emerald-700 mt-1">Sangat Baik</p>
          </div>

          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Misi Terkumpul</p>
            <p className="text-2xl font-extrabold text-ink mt-1">2 Misi</p>
            <p className="text-[11px] text-ink-muted mt-1">1 dinilai, 1 menunggu</p>
          </div>

          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Keaktifan IoT</p>
            <p className="text-2xl font-extrabold text-ink mt-1">Tinggi</p>
            <p className="text-[11px] text-ink-muted mt-1">Rutin cek telemetry</p>
          </div>
        </div>

        {/* Riwayat Misi & Tugas Siswa */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center justify-between">
            <span>RIWAYAT PENGERJAAN KARTU MISI DIGITAL</span>
            <span className="text-[11px] font-normal lowercase">{mockMissions.length} misi tersedia</span>
          </div>

          <div className="space-y-3">
            {mockMissions.map((misi, i) => {
              const sub = mockSubmissions.find((s) => s.missionId === misi.id && s.studentId === student.id);

              return (
                <div key={misi.id} className="p-3.5 rounded-xl border border-line bg-surface-muted flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-ink">{misi.title}</h4>
                      {sub ? (
                        <StatusBadge status={sub.status} />
                      ) : (
                        <span className="badge bg-amber-50 text-amber-700 border border-amber-200 text-[10px]">
                          Belum Dikumpulkan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-muted line-clamp-1">{misi.objective}</p>
                    {sub && (
                      <p className="text-[11px] text-ink-muted italic">
                        Pengamatan: &quot;{sub.observation.slice(0, 80)}...&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {sub && (
                      <Link
                        href={`/guru/tugas/${misi.id}/penilaian`}
                        className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
                      >
                        Beri Penilaian & Rubrik
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Umpan Balik Guru (Feedback Dialog & History) */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center gap-2">
            <MessageSquare className="h-3.5 w-3.5" />
            CATATAN & UMPAN BALIK GURU
          </div>

          <form onSubmit={handleSendFeedback} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-ink block mb-1">
                Tulis Umpan Balik / Catatan Pendampingan untuk {student.name}
              </label>
              <textarea
                rows={3}
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tuliskan apresiasi, saran perbaikan observasi, atau panduan belajar..."
                className="input-field text-xs"
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary text-xs gap-1.5 inline-flex items-center">
                <Send className="h-3.5 w-3.5" />
                Kirim Umpan Balik
              </button>
            </div>
          </form>

          {/* Riwayat Umpan Balik */}
          <div className="mt-6 pt-4 border-t border-line space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Riwayat Catatan yang Telah Diberikan
            </h4>

            {feedbackList.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-surface-muted border border-line space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-ink">{item.author}</span>
                  <span className="text-ink-muted">{item.date}</span>
                </div>
                <p className="text-xs text-ink leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
