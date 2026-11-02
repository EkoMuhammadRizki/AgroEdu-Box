"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockModules } from "@/lib/mock-data";
import { notFound, useParams, useRouter } from "next/navigation";
import { CheckCircle2, Clock, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { showSuccessAlert, showConfirmDialog } from "@/lib/swal";

export default function MateriDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "pengenalan-iot";
  const mod = mockModules.find((m) => m.slug === slug) || mockModules[0];
  if (!mod) notFound();

  const [isCompleted, setIsCompleted] = useState(false);

  const handleMarkComplete = async () => {
    setIsCompleted(true);
    await showSuccessAlert(
      "Modul Diselesaikan!",
      `Bagus sekali! Kamu telah mempelajari materi "${mod.title}". Progres belajarmu telah bertambah.`,
      1800
    );
  };

  return (
    <AppShell role="siswa">
      <PageHeader
        title={mod.title}
        description={`${mod.topic} · Estimasi ${mod.durationMin} menit membaca`}
        badge={
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] bg-accent-soft rounded-full px-2.5 py-0.5">
            {mod.topic}
          </span>
        }
        action={
          <Link href="/materi" className="btn-secondary text-xs gap-1.5 inline-flex items-center">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Materi
          </Link>
        }
      />

      <ContentWrapper className="space-y-4 pb-8">
        {/* Tujuan Pembelajaran */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card">
            TUJUAN PEMBELAJARAN
          </div>
          <ul className="space-y-2">
            {mod.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-ink-muted">
                <CheckCircle2 className="h-4 w-4 text-[var(--accent)] flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Materi Inti */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card">
            MATERI INTI
          </div>
          <div className="prose prose-sm max-w-none text-ink leading-relaxed space-y-3">
            <p className="font-medium text-sm text-ink">{mod.content}</p>
            <p className="text-sm text-ink-muted">
              Pertanian modern hidroponik membutuhkan pemahaman mendalam tentang bagaimana teknologi mikrokontroler seperti ESP32 dapat membaca kondisi riil media tanam dan mikroklimat tanaman secara otomatis.
            </p>
            <p className="text-sm text-ink-muted">
              Data yang dikumpulkan oleh sensor IoT (seperti suhu udara DHT22, kelembapan tanah resistif/kapasitif, dan intensitas cahaya lux) memberikan gambaran kuantitatif. Namun, data tersebut harus selalu dikonfirmasikan dengan pengamatan langsung terhadap warna daun, laju pembentukan tunas, dan kesehatan perakaran.
            </p>
          </div>
        </div>

        {/* Aktivitas Praktikum */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card">
            AKTIVITAS BELAJAR & PRAKTIK
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-muted border border-line">
              <BookOpen className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.75} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">Baca materi dan pahami istilah kunci</p>
                <p className="text-xs text-ink-muted">Estimasi 15 menit</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-siswa-600" strokeWidth={2} />
            </div>

            <Link
              href="/lab-iot"
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-muted border border-line hover:border-[var(--accent)] transition-colors group cursor-pointer"
            >
              <Clock className="h-4 w-4 text-ink-muted group-hover:text-[var(--accent)]" strokeWidth={1.75} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink group-hover:text-[var(--accent)]">
                  Eksplorasi pembacaan data sensor di Lab IoT →
                </p>
                <p className="text-xs text-ink-muted">Bandingkan teori modul dengan data real-time</p>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-muted group-hover:text-[var(--accent)]" />
            </Link>
          </div>
        </div>

        {/* Pertanyaan Refleksi */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card">
            PERTANYAAN REFLEKSI
          </div>
          <ol className="space-y-3">
            {[
              "Apa perbedaan antara kelembapan tanah dan kelembapan udara? Bagaimana keduanya saling memengaruhi pertumbuhan tanaman?",
              "Mengapa angka sensor tidak langsung menentukan apakah kondisi tanaman 'baik' atau 'buruk' tanpa melihat fase tumbuh?",
              "Jika sensor suhu menunjukkan 35°C, informasi tambahan apa yang kamu butuhkan sebelum menyalakan sirkulasi pompa atau tirai peneduh?",
            ].map((q, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink-muted">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent)] text-[var(--accent)] text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {mod.quizId ? (
            <Link
              href={`/kuis/${mod.quizId}`}
              className="btn-primary w-full text-center inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              Uji Pemahaman: Mulai Kuis Modul
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={isCompleted}
              className={`btn-primary w-full text-center inline-flex items-center justify-center gap-2 cursor-pointer ${
                isCompleted ? "bg-emerald-700 opacity-90 cursor-default" : ""
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isCompleted ? "Modul Selesai ✓" : "Tandai Modul Selesai"}
            </button>
          )}
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
