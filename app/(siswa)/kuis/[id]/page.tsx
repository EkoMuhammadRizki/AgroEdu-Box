"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockQuizzes } from "@/lib/mock-data";
import { useState } from "react";
import { notFound, useRouter, useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { showSuccessAlert, showWarningAlert, showConfirmDialog } from "@/lib/swal";

export default function KuisPage() {
  const routeParams = useParams();
  const id = routeParams?.id as string;
  const quiz = mockQuizzes.find((q) => q.id === id) || mockQuizzes[0];
  if (!quiz) notFound();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const question = quiz.questions[current];
  const total = quiz.questions.length;
  const answered = Object.keys(answers).length;
  const progress = (answered / total) * 100;

  const handleAnswer = (optionIdx: number) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [question.id]: optionIdx }));
  };

  const handleSubmit = async () => {
    if (answered < total) {
      await showWarningAlert(
        "Soal Belum Lengkap",
        `Kamu baru menjawab ${answered} dari ${total} soal. Harap jawab semua soal terlebih dahulu!`
      );
      return;
    }

    const confirm = await showConfirmDialog({
      title: "Selesaikan Kuis?",
      text: `Kamu telah menjawab semua ${total} soal. Yakin ingin mengakhiri kuis dan melihat nilaimu?`,
      icon: "question",
      confirmButtonText: "Ya, Selesaikan",
      cancelButtonText: "Periksa Lagi",
      role: "siswa",
    });

    if (confirm.isConfirmed) {
      const correctCount = quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length;
      const calculatedScore = Math.round((correctCount / total) * 100);
      setSubmitted(true);
      if (calculatedScore >= 80) {
        await showSuccessAlert(
          "Luar Biasa!",
          `Skor kamu ${calculatedScore}/100! Kamu sangat menguasai konsep sensor & IoT tanaman.`,
          1800
        );
      } else {
        await showSuccessAlert(
          "Kuis Selesai!",
          `Skor kamu ${calculatedScore}/100. Pelajari kembali pembahasan di bawah ini untuk memahami materi lebih dalam.`,
          1800
        );
      }
    }
  };

  const score = submitted
    ? Math.round(
        (quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length / total) * 100
      )
    : 0;

  if (submitted) {
    const correct = quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length;
    return (
      <AppShell role="siswa">
        <PageHeader title="Hasil Kuis" />
        <ContentWrapper className="pb-8 space-y-4">
          {/* Score */}
          <div className="card text-center py-8">
            <div className={`text-6xl font-extrabold tabular-nums mb-2 ${score >= 80 ? "text-siswa-600" : score >= 60 ? "text-[#8A5A00]" : "text-[#B42318]"}`}>
              {score}
            </div>
            <p className="text-sm text-ink-muted">dari 100 poin</p>
            <p className="mt-2 text-base font-semibold text-ink">
              {score >= 80 ? "🎉 Sangat Baik!" : score >= 60 ? "👍 Cukup Baik" : "📚 Perlu Belajar Lagi"}
            </p>
            <p className="text-xs text-ink-muted mt-1">{correct} dari {total} soal benar</p>
          </div>

          {/* Pembahasan */}
          <div className="card">
            <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card">PEMBAHASAN</div>
            <div className="space-y-4">
              {quiz.questions.map((q, i) => {
                const isCorrect = answers[q.id] === q.correctIndex;
                return (
                  <div key={q.id} className={`p-3 rounded-xl border ${isCorrect ? "border-siswa-100 bg-siswa-100/40" : "border-[#FDECEA] bg-[#FDECEA]/40"}`}>
                    <p className="text-sm font-medium text-ink mb-1">
                      {i + 1}. {q.text}
                    </p>
                    <p className="text-xs">
                      <span className={isCorrect ? "text-siswa-600 font-semibold" : "text-[#B42318] font-semibold"}>
                        {isCorrect ? "✓ Benar" : "✗ Salah"}
                      </span>
                      {!isCorrect && (
                        <span className="text-ink-muted"> · Jawaban: {q.options[q.correctIndex]}</span>
                      )}
                    </p>
                    <p className="text-xs text-ink-muted mt-1 italic">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="btn-primary w-full cursor-pointer"
            onClick={async () => {
              const confirm = await showConfirmDialog({
                title: "Ulangi Kuis?",
                text: "Jawaban saat ini akan direset dan kamu akan memulai kuis kembali dari nomor 1.",
                icon: "question",
                confirmButtonText: "Ya, Mulai Ulang",
                cancelButtonText: "Batal",
                role: "siswa",
              });
              if (confirm.isConfirmed) {
                setSubmitted(false);
                setCurrent(0);
                setAnswers({});
              }
            }}
          >
            Coba Lagi
          </button>
        </ContentWrapper>
      </AppShell>
    );
  }

  return (
    <AppShell role="siswa">
      <PageHeader title={quiz.title} description={`Soal ${current + 1} dari ${total}`} />
      <ContentWrapper className="pb-8 space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-ink-muted mb-1">
            <span>{answered} terjawab</span>
            <span>{total - answered} tersisa</span>
          </div>
          <div className="h-2 w-full rounded-full bg-line overflow-hidden">
            <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Soal */}
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">Soal {current + 1}</p>
          <p className="text-base font-bold text-ink leading-snug">{question.text}</p>
        </div>

        {/* Pilihan */}
        <div className="space-y-2">
          {question.options.map((option, idx) => {
            const isSelected = answers[question.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all duration-150 ${
                  isSelected
                    ? "border-[var(--accent)] bg-accent-soft text-[var(--accent)]"
                    : "border-line bg-surface text-ink hover:border-[var(--accent)]/50"
                }`}
              >
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold mr-2 ${isSelected ? "bg-[var(--accent)] text-white" : "bg-surface-muted text-ink-muted border border-line"}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Navigasi */}
        <div className="flex gap-3 pt-2">
          <button
            className="btn-secondary flex-1 gap-2"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            Sebelumnya
          </button>

          {current < total - 1 ? (
            <button
              className="btn-primary flex-[2] gap-2"
              onClick={() => setCurrent((c) => c + 1)}
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          ) : (
            <button
              className={`btn-primary flex-[2] ${answered < total ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={answered < total}
              onClick={handleSubmit}
            >
              Selesai & Lihat Hasil
            </button>
          )}
        </div>

        {/* Soal navigator */}
        <div className="flex gap-1.5 flex-wrap">
          {quiz.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrent(i)}
              className={`h-8 w-8 rounded-lg text-xs font-bold transition-all duration-150 ${
                i === current ? "bg-[var(--accent)] text-white" :
                answers[q.id] !== undefined ? "bg-accent-soft text-[var(--accent)]" :
                "bg-surface border border-line text-ink-muted"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
