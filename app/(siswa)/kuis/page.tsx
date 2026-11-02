import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockQuizzes, mockModules } from "@/lib/mock-data";
import { HelpCircle, CheckCircle2, Clock, ArrowRight, Play, Award } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Daftar Kuis" };

export default function KuisListPage() {
  // Mock quiz status for student
  const quizStatuses: Record<string, { completed: boolean; score?: number; lastTaken?: string }> = {
    "quiz-1": { completed: true, score: 80, lastTaken: "Kemarin, 14:20" },
  };

  return (
    <AppShell role="siswa">
      <PageHeader
        title="Kuis & Evaluasi"
        description="Uji pemahamanmu setelah menyelesaikan materi dan pengamatan sensor."
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* Banner Motivasi */}
        <div className="card bg-gradient-to-r from-siswa-50 to-emerald-50/50 border-siswa-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-siswa-100 text-siswa-700 rounded-xl flex-shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">Evaluasi Pemahaman Ilmiah</h2>
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                Kuis di AGRO EDU BOX tidak hanya menguji hafalan, tetapi juga kemampuan membaca data sensor,
                memahami timestamp, dan menghubungkan data fisik tanaman secara logis.
              </p>
            </div>
          </div>
        </div>

        {/* Daftar Kuis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockQuizzes.map((quiz) => {
            const status = quizStatuses[quiz.id];
            const relatedModule = mockModules.find((m) => m.id === quiz.moduleId);

            return (
              <div key={quiz.id} className="card flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge bg-surface-muted text-ink-muted border border-line text-[11px] font-medium">
                      {quiz.questions.length} Pertanyaan
                    </span>
                    {status?.completed ? (
                      <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Nilai: {status.score}/100
                      </span>
                    ) : (
                      <span className="badge bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                        Belum Dikerjakan
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-ink leading-snug">{quiz.title}</h3>
                    {relatedModule && (
                      <p className="text-xs text-ink-muted mt-1">
                        Modul: <span className="text-ink font-medium">{relatedModule.title}</span>
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-ink-muted leading-relaxed">
                    Mencakup pemahaman fungsi sensor DHT22, validasi timestamp data, interpretasi pembacaan, dan kalibrasi.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-line flex items-center justify-between">
                  {status?.completed ? (
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{status.lastTaken}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-ink-muted">Estimasi: 10 menit</span>
                  )}

                  <Link
                    href={`/kuis/${quiz.id}`}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-150 inline-flex items-center gap-1.5 ${
                      status?.completed
                        ? "btn-secondary text-ink hover:text-[var(--accent)]"
                        : "btn-primary"
                    }`}
                  >
                    {status?.completed ? "Ulangi Kuis" : "Mulai Kuis"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
