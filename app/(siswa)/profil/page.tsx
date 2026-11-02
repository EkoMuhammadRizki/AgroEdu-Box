"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { currentStudent, mockModules, mockSubmissions, mockActivities } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActivityList } from "@/components/agro/activity-list";
import { User, BookOpen, ClipboardCheck, Star, Edit, ChevronRight, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { showSuccessAlert, showConfirmDialog, showToast } from "@/lib/swal";

export default function ProfilPage() {
  const [studentStatus, setStudentStatus] = useState("Aktif belajar");
  const [studentNote, setStudentNote] = useState("");
  const completedModules = 2;
  const totalModules = mockModules.filter((m) => m.status === "terbit").length;
  const submittedMissions = mockSubmissions.length;

  const handleUpdateStatus = async () => {
    const confirm = await showConfirmDialog({
      title: "Kirim Refleksi ke Guru?",
      text: "Catatan atau pertanyaanmu akan dikirimkan langsung ke dashboard bimbingan Pak Eko.",
      icon: "question",
      confirmButtonText: "Ya, Kirim Pesan",
      cancelButtonText: "Batal",
      role: "siswa",
    });

    if (confirm.isConfirmed) {
      setStudentNote("");
      await showSuccessAlert(
        "Pesan Terkirim!",
        "Refleksi belajarmu telah dikirimkan ke guru pembimbing.",
        1600
      );
    }
  };

  return (
    <AppShell role="siswa">
      <PageHeader
        title="Profil & Perkembangan"
        description="Pantau pencapaian silabus, riwayat kuis, dan umpan balik pembimbing."
      />

      <ContentWrapper className="space-y-4 pb-8">
        {/* Identitas Siswa */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-siswa-100">
                <User className="h-8 w-8 text-siswa-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-ink">{currentStudent.name}</p>
                <p className="text-sm text-ink-muted mt-0.5">{currentStudent.classCode} · NIS: 2026-001</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    ✓ {studentStatus}
                  </span>
                  <span className="text-xs text-ink-muted">Semester Genap 2026</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                const newSt = studentStatus === "Aktif belajar" ? "Sedang Eksperimen Lab" : "Aktif belajar";
                setStudentStatus(newSt);
                await showToast(`Status belajar diperbarui menjadi: ${newSt}`, "success", 1400);
              }}
              className="btn-secondary text-xs gap-1.5 self-start sm:self-center cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" />
              Ganti Status Belajar
            </button>
          </div>
        </div>

        {/* Clickable Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/materi"
            className="card text-center hover:border-siswa-600 hover:shadow-xs transition-all group block cursor-pointer"
            title="Buka daftar materi"
          >
            <BookOpen className="h-5 w-5 text-siswa-600 mx-auto mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.75} />
            <p className="text-2xl font-extrabold text-ink tabular-nums">{completedModules}/{totalModules}</p>
            <p className="text-[10px] text-ink-muted mt-1 group-hover:text-siswa-600">Modul Selesai →</p>
          </Link>

          <Link
            href="/misi"
            className="card text-center hover:border-siswa-600 hover:shadow-xs transition-all group block cursor-pointer"
            title="Buka daftar misi"
          >
            <ClipboardCheck className="h-5 w-5 text-siswa-600 mx-auto mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.75} />
            <p className="text-2xl font-extrabold text-ink tabular-nums">{submittedMissions}</p>
            <p className="text-[10px] text-ink-muted mt-1 group-hover:text-siswa-600">Misi Terkirim →</p>
          </Link>

          <Link
            href="/kuis"
            className="card text-center hover:border-siswa-600 hover:shadow-xs transition-all group block cursor-pointer"
            title="Buka daftar kuis"
          >
            <Star className="h-5 w-5 text-siswa-600 mx-auto mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.75} />
            <p className="text-2xl font-extrabold text-ink tabular-nums">80</p>
            <p className="text-[10px] text-ink-muted mt-1 group-hover:text-siswa-600">Rata-Rata Kuis →</p>
          </Link>
        </div>

        {/* Progress Modul — Clickable to detail */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center justify-between">
            <span>PROGRESS MODUL PEMBELAJARAN</span>
            <Link href="/materi" className="text-[10px] font-normal normal-case hover:underline">
              Semua Materi →
            </Link>
          </div>
          <div className="space-y-3">
            {mockModules.filter((m) => m.status === "terbit").map((mod, i) => {
              const p = i === 0 ? 100 : i === 1 ? 100 : 30;
              return (
                <Link
                  key={mod.id}
                  href={`/materi/${mod.slug}`}
                  className="block p-2 rounded-xl hover:bg-surface-muted transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-ink font-semibold group-hover:text-[var(--accent)] transition-colors">
                      {mod.title}
                    </span>
                    <span className="text-ink-muted tabular-nums flex items-center gap-1 font-mono">
                      {p}%
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${p}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Riwayat Kuis — Clickable */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center justify-between">
            <span>RIWAYAT KUIS & EVALUASI</span>
            <Link href="/kuis" className="text-[10px] font-normal normal-case hover:underline">
              Buka Kuis →
            </Link>
          </div>
          <div className="space-y-2">
            {[
              { id: "quiz-1", quiz: "Kuis: Sensor IoT dalam Pertanian", score: 80, date: "16 Okt 2026" },
              { id: "quiz-2", quiz: "Kuis: Mengenal Hidroponik", score: 90, date: "10 Okt 2026" },
            ].map((item) => (
              <Link
                key={item.quiz}
                href={`/kuis/${item.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-muted hover:bg-siswa-100/40 transition-colors group cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-siswa-700 transition-colors">
                    {item.quiz}
                  </p>
                  <p className="text-xs text-ink-muted">{item.date} · Klik untuk lihat ulasan soal</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-extrabold tabular-nums ${item.score >= 80 ? "text-siswa-600" : "text-[#8A5A00]"}`}>
                    {item.score}
                  </span>
                  <ChevronRight className="h-4 w-4 text-ink-muted group-hover:text-siswa-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Komentar Guru & Kirim Balasan */}
        <div className="card space-y-3">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-2 rounded-t-card">
            UMPAN BALIK DARI GURU
          </div>
          <div className="flex gap-3 p-3.5 rounded-xl bg-guru-100/50 border border-guru-100">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-guru-100">
              <User className="h-4 w-4 text-guru-600" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-guru-600 mb-0.5">Pak Eko Mulyadi · 16 Okt 2026</p>
              <p className="text-sm text-ink leading-relaxed">
                "Pengamatan visual kangkungmu sudah sangat cermat, Andi! Coba tautkan lebih banyak rentang jam data sensor suhu saat menyimpulkan laju transpirasi tanaman."
              </p>
            </div>
          </div>

          {/* Form Balasan Siswa */}
          <div className="pt-2">
            <label htmlFor="refleksi" className="text-xs font-bold text-ink block mb-1">
              Kirim Pertanyaan / Refleksi Balasan ke Guru:
            </label>
            <div className="flex gap-2">
              <input
                id="refleksi"
                type="text"
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                placeholder="Tulis pesan atau pertanyaan untuk Pak Eko..."
                className="input-field text-xs flex-1"
              />
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="btn-primary text-xs px-4 gap-1.5 flex-shrink-0 cursor-pointer inline-flex items-center"
              >
                <Send className="h-3.5 w-3.5" />
                Kirim
              </button>
            </div>
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card">
            RIWAYAT AKTIVITAS
          </div>
          <ActivityList activities={mockActivities} />
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
