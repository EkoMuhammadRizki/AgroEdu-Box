"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { Butterfly, Ladybug } from "@/components/agro/decorative-nature";
import { mockQuizzes } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { notFound, useRouter, useParams } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Trophy, Star, Sparkles, Award,
  Check, X, RefreshCw, Printer, Maximize2, ArrowRight
} from "lucide-react";
import { showSuccessAlert, showWarningAlert, showConfirmDialog, showToast } from "@/lib/swal";
import { submitQuiz } from "@/lib/student-session";
import { QUIZ_PASS_SCORE, type QuizSubmitResult } from "@/lib/quiz";
import { BrandIcon } from "@/components/agro/brand-logo";
import Link from "next/link";

export default function KuisPage() {
  const routeParams = useParams();
  const router = useRouter();
  const id = routeParams?.id as string;
  const quiz = mockQuizzes.find((q) => q.id === id) || mockQuizzes[0];
  if (!quiz) notFound();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showClassroomMode, setShowClassroomMode] = useState(false);
  const [studentName, setStudentName] = useState("Petani Muda");
  const [className, setClassName] = useState("");
  const [character, setCharacter] = useState<"original" | "girl">("original");
  const [result, setResult] = useState<QuizSubmitResult | null>(null);
  const [saving, setSaving] = useState(false);
  // Urutan pilihan diacak tiap percobaan (di browser, setelah muat, agar tidak beda dengan server).
  const [order, setOrder] = useState<number[][] | null>(null);
  const shuffleOrder = () =>
    quiz.questions.map((q) => {
      const idx = q.options.map((_, i) => i);
      for (let i = idx.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idx[i], idx[j]] = [idx[j], idx[i]];
      }
      return idx;
    });
  useEffect(() => {
    setOrder(shuffleOrder());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.id]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("agro_student_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setStudentName(parsed.name);
        if (parsed.className) setClassName(parsed.className);
        if (parsed.character) setCharacter(parsed.character);
      }
    } catch {
      // ignore
    }
  }, []);

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
        "Ada Soal Belum Terjawab!",
        `Kamu baru menjawab ${answered} dari ${total} soal. Selesaikan semua soal dulu yuk!`
      );
      return;
    }

    const confirm = await showConfirmDialog({
      title: "Kirim Jawaban Kuis?",
      text: `Kamu telah menjawab seluruh ${total} soal dengan teliti. Yakin ingin mengakhiri dan melihat skormu?`,
      icon: "question",
      confirmButtonText: "Ya, Selesaikan!",
      cancelButtonText: "Periksa Lagi",
      role: "siswa",
    });

    if (confirm.isConfirmed) {
      const correctCount = quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length;
      const calculatedScore = Math.round((correctCount / total) * 100);
      setSaving(true);
      // Server menghitung ulang skor dan memberi bintang hanya pada percobaan pertama.
      const saved = await submitQuiz(quiz.id, quiz.questions.map((q) => answers[q.id]));
      setSaving(false);
      setResult(saved);
      setSubmitted(true);

      const note = !saved
        ? " Hasilnya belum tersimpan karena koneksi bermasalah, jadi bintang belum bertambah."
        : saved.bintangDiberikan > 0
          ? ` Kamu mendapat +${saved.bintangDiberikan} bintang!`
          : " Bintang hanya diberikan pada percobaan pertama.";
      if (calculatedScore >= QUIZ_PASS_SCORE) {
        await showSuccessAlert("Luar Biasa! 🎉", `Skormu ${calculatedScore}/100! Kamu berhak mengklaim Sertifikat Petani Muda.${note}`, 2400);
      } else {
        await showSuccessAlert("Kuis Selesai! 👍", `Skor kamu ${calculatedScore}/100. Pelajari lagi pembahasannya.${note}`, 2400);
      }
    }
  };

  const score = submitted
    ? Math.round(
        (quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length / total) * 100
      )
    : 0;

  // Option Letter Colors from DESIGN 2.md (Section 2.4 & 5.10):
  // A: Blue, B: Green, C: Yellow, D: Orange
  const optionLetterStyles = [
    "bg-blue-500 text-white shadow-xs",      // A
    "bg-green-500 text-white shadow-xs",     // B
    "bg-yellow-500 text-ink-900 shadow-xs",  // C
    "bg-orange-400 text-white shadow-xs",    // D
  ];

  /* ── VIEW: HASIL KUIS & SERTIFIKAT (DESIGN 2.md Section 5.11) ──────────────── */
  if (submitted) {
    const correct = quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length;

    return (
      <AppShell role="siswa">
        <PageHeader title="Hasil Kuis & Penghargaan" />

        <ContentWrapper className="pb-10 space-y-6">
          {/* Trophy & Celebration Hero */}
          <div className="relative overflow-hidden rounded-[24px] sm:rounded-[36px] bg-gradient-to-b from-[#FFFBEA] via-[#EAF6D9] to-[#CDEBB0] border-4 border-white p-4 sm:p-8 shadow-card text-center space-y-3 sm:space-y-4">
            <Butterfly className="absolute top-4 left-4 sm:top-6 sm:left-12 animate-bounce" />
            <Ladybug className="absolute bottom-4 right-4 sm:bottom-6 sm:right-16" />

            {/* Glowing Golden Trophy */}
            <div className="relative inline-block mx-auto mt-1 sm:mt-2">
              <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-60 animate-pulse" />
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 border-4 border-white shadow-card flex items-center justify-center">
                <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-white fill-white drop-shadow-md" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-ink-900 leading-tight">
                Selamat, <span className="text-green-600">{studentName}!</span>
              </h2>
              <p className="font-heading font-bold text-sm sm:text-base md:text-lg text-brown-600">
                Skor {score}%
              </p>
              <p className="text-xs text-ink-600 font-medium">
                {correct} dari {total} pertanyaan berhasil dijawab dengan benar!
              </p>
              <p className="text-xs font-bold text-brown-600">
                {!result
                  ? "Hasil belum tersimpan (koneksi bermasalah)."
                  : result.bintangDiberikan > 0
                    ? `+${result.bintangDiberikan} bintang masuk ke akunmu!`
                    : "Bintang hanya diberikan pada percobaan pertama."}
              </p>
            </div>

            {/* Mascot reaction */}
            <BibooMascot
              mood="trophy"
              size="md"
              character={character}
              bubbleText={score >= QUIZ_PASS_SCORE ? "Hebat banget! Kamu calon petani muda!" : "Yuk baca materinya lagi, lalu coba lagi!"}
              className="mx-auto my-1 sm:my-2"
            />

            {/* ── 3 TOMBOL BERTUMPUK DARI DESIGN 2.md (Section 5.11) ────────── */}
            <div className="max-w-md mx-auto space-y-2.5 sm:space-y-3 pt-2">
              {/* 1. Klaim Sertifikat (Hijau), hanya untuk skor 80 ke atas */}
              {score >= QUIZ_PASS_SCORE && (<button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="btn-primary w-full text-xs sm:text-base h-11 sm:h-13 gap-2 inline-flex items-center justify-center cursor-pointer"
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                Klaim Sertifikat Digital!
              </button>)}

              {/* 2. Tantangan Berikutnya (Kuning) */}
              <Link
                href="/misi"
                className="btn-secondary w-full text-xs sm:text-base h-11 sm:h-13 gap-2 inline-flex items-center justify-center cursor-pointer"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-brown-600" />
                Tantangan Berikutnya: Kerjakan Misi
              </Link>

              {/* 3. Tampilkan di Kelas! (Biru) */}
              <button
                type="button"
                onClick={() => setShowClassroomMode(true)}
                className="btn-info w-full text-xs sm:text-base h-11 sm:h-13 gap-2 inline-flex items-center justify-center cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Tampilkan di Kelas! (Layar Penuh)
              </button>
            </div>
          </div>

          {/* ── Pembahasan Rinci Per Soal ─────────────────────────────────── */}
          <div className="card space-y-4">
            <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-2">
              PEMBAHASAN JAWABAN KUIS
            </div>
            <div className="space-y-3">
              {quiz.questions.map((q, i) => {
                const isCorrect = answers[q.id] === q.correctIndex;
                const chosenIdx = answers[q.id];
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border-2 space-y-2 ${
                      isCorrect
                        ? "bg-green-100/60 border-green-300"
                        : "bg-red-50/70 border-red-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-heading font-bold text-sm text-ink-900">
                        {i + 1}. {q.text}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-heading font-extrabold flex-shrink-0 ${
                          isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        {isCorrect ? "Benar" : "Salah"}
                      </span>
                    </div>

                    {!isCorrect && (
                      <p className="text-xs text-ink-600">
                        Jawabanmu: <span className="line-through text-red-600 font-bold">{q.options[chosenIdx]}</span> · Kunci: <strong className="text-green-700">{q.options[q.correctIndex]}</strong>
                      </p>
                    )}

                    <div className="pt-1 border-t border-line/60 text-xs text-ink-600 italic">
                      💡 <strong>Pembahasan:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setCurrent(0);
                  setAnswers({});
                  setResult(null);
                  setOrder(shuffleOrder());
                }}
                className="btn-ghost w-full gap-2 inline-flex items-center justify-center cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Ulangi Kuis dari Awal
              </button>
            </div>
          </div>
        </ContentWrapper>

        {/* ── MODAL SERTIFIKAT DIGITAL SISWA ──────────────────────────── */}
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[32px] border-4 border-yellow-400 p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-5 animate-scaleUp">
              {/* Certificate Canvas Frame */}
              <div className="relative border-4 border-double border-green-600 rounded-2xl p-6 md:p-8 bg-gradient-to-b from-[#FFFBEA] via-white to-[#EAF6D9] text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <BrandIcon className="w-11 h-11 flex-shrink-0" />
                  <span className="font-heading font-extrabold text-xl md:text-2xl text-green-700 tracking-tight">
                    AGRO-EDU BOX INDONESIA
                  </span>
                  <BrandIcon className="w-11 h-11 flex-shrink-0" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-ink-900 tracking-wide uppercase">
                    Sertifikat Penghargaan
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-600">
                    Nomor: AEB-IOT-{Date.now().toString().slice(-6)}
                  </p>
                </div>

                <p className="text-xs md:text-sm text-ink-600">
                  Dengan bangga diberikan kepada Petani Muda:
                </p>

                <div className="py-2">
                  <p className="font-heading font-extrabold text-2xl md:text-4xl text-green-700 underline decoration-yellow-400 decoration-4 underline-offset-4">
                    {studentName}
                  </p>
                  <p className="text-xs font-bold text-ink-600 mt-1">
                    {className}
                  </p>
                </div>

                <p className="text-xs md:text-sm text-ink-700 max-w-lg mx-auto leading-relaxed">
                  Telah berhasil menyelesaikan pembelajaran praktikum agrikultur cerdas, mempelajari rahasia tanah dan suhu udara, serta lulus <strong>Kuis Pintar Agro-Edu Box</strong> dengan skor <strong>{score}</strong>.
                </p>

                {/* Signatures & Seal */}
                <div className="pt-6 grid grid-cols-2 gap-6 text-center text-xs">
                  <div>
                    <p className="text-ink-600">Tanggal Terbit:</p>
                    <p className="font-bold text-ink-900">{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                    <div className="mt-4 pt-1 border-t border-ink-300 font-heading font-bold text-ink-900">
                      Sistem Agro-Edu Box
                    </div>
                  </div>

                  <div>
                    <p className="text-ink-600">Guru Pembimbing:</p>
                    <div className="mt-8 pt-1 border-t border-ink-300 font-heading font-bold text-ink-900">
                      Guru Kelas
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="btn-ghost flex-1 sm:flex-initial"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    showToast("Membuka dialog cetak sertifikat...", "success");
                  }}
                  className="btn-primary flex-1 sm:flex-initial gap-2 inline-flex items-center justify-center cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Cetak / Simpan PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL PROYEKTOR KELAS (TAMPILKAN DI KELAS!) ────────────── */}
        {showClassroomMode && (
          <div className="fixed inset-0 z-50 bg-gradient-to-b from-blue-900 via-indigo-900 to-black text-white flex flex-col justify-between p-8 overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-white p-0.5 flex-shrink-0">
                  <BrandIcon />
                </span>
                <span className="font-heading font-extrabold text-2xl text-yellow-300">
                  Agro-Edu Box · Mode Presentasi Kelas
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowClassroomMode(false)}
                className="px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-heading font-bold text-sm"
              >
                Tutup Mode Kelas (Esc)
              </button>
            </div>

            <div className="my-auto text-center space-y-6">
              <div className="w-32 h-32 mx-auto rounded-full bg-yellow-400 border-4 border-white shadow-2xl flex items-center justify-center animate-bounce">
                <Trophy className="w-18 h-18 text-yellow-900 fill-yellow-900" />
              </div>

              <div className="space-y-2">
                <h2 className="font-heading font-extrabold text-4xl md:text-6xl text-yellow-300">
                  🎉 {studentName} 🎉
                </h2>
                <p className="font-heading font-bold text-2xl md:text-3xl text-white/90">
                  Berhasil Menuntaskan Kuis Pintar dengan Skor {score}%!
                </p>
                <p className="text-lg text-green-300 font-medium">
                  {className} · Siap Lanjut ke Misi Pemantauan Lapangan
                </p>
              </div>

              <BibooMascot
                mood="celebrating"
                size="2xl"
                character={character}
                bubbleText="Hebat sekali kawan!"
                className="mx-auto"
              />
            </div>

            <p className="text-center text-xs text-white/50">
              Tekan tombol Tutup untuk kembali ke dashboard siswa.
            </p>
          </div>
        )}
      </AppShell>
    );
  }

  /* ── VIEW: PENGERJAAN SOAL KUIS (DESIGN 2.md Section 5.10) ───────────────── */
  return (
    <AppShell role="siswa">
      <PageHeader
        title={quiz.title}
        description={`Pertanyaan ke-${current + 1} dari total ${total} soal`}
        badge={
          <span className="px-3 py-1 rounded-pill bg-yellow-300 text-brown-600 text-xs font-heading font-extrabold">
            Kuis Agro-Pintar
          </span>
        }
      />

      <ContentWrapper className="pb-8 space-y-5">
        {/* Progress bar */}
        <div className="card-cream p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-heading font-bold text-ink-600">
            <span>{answered} dari {total} soal terjawab</span>
            <span className="text-green-700">{Math.round(progress)}% Selesai</span>
          </div>
          <div className="h-3 w-full rounded-full bg-white overflow-hidden border-2 border-green-200">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Soal Card */}
        <div className="card bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-heading font-extrabold">
              SOAL #{current + 1}
            </span>
            <span className="text-xs text-ink-600 font-bold">Pilih salah satu jawaban yang paling tepat</span>
          </div>

          <h2 className="font-heading font-extrabold text-lg md:text-xl text-ink-900 leading-snug">
            {question.text}
          </h2>
        </div>

        {/* ── PILIHAN JAWABAN (DESIGN 2.md Section 5.10) ────────────────── */}
        <div className="space-y-2.5 sm:space-y-3">
          {(order?.[current] ?? []).map((idx, pos) => {
            const option = question.options[idx];
            const isSelected = answers[question.id] === idx;
            const letter = String.fromCharCode(65 + pos);
            const letterStyle = optionLetterStyles[pos % optionLetterStyles.length];

            return (
              <button
                key={idx}
                type="button"
                disabled={saving}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-3 sm:p-4 rounded-2xl border-3 flex items-center gap-2.5 sm:gap-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? "border-green-500 bg-green-100/70 shadow-card scale-[1.01]"
                    : "border-white bg-white hover:bg-green-50 hover:border-green-200 shadow-sm"
                }`}
              >
                {/* Colored circle letter from DESIGN 2.md */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-heading font-extrabold text-xs sm:text-sm flex-shrink-0 ${letterStyle}`}
                >
                  {letter}
                </div>

                <span className={`text-xs sm:text-base font-body font-bold flex-1 leading-snug ${isSelected ? "text-green-900" : "text-ink-900"}`}>
                  {option}
                </span>

                {isSelected && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Friendly mascot cheering on the bottom */}
        <div className="flex items-center gap-3 p-3 bg-white/70 rounded-2xl border-2 border-green-200">
          <BibooMascot mood="happy" size="sm" character={character} animated={false} />
          <p className="text-xs font-heading font-bold text-ink-600">
            Situnas: "Baca soalnya pelan-pelan ya! Kamu pasti bisa menjawabnya dengan benar!"
          </p>
        </div>

        {/* Navigasi Soal */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="btn-ghost flex-1 gap-2 cursor-pointer"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </button>

          {current < total - 1 ? (
            <button
              type="button"
              className="btn-primary flex-[2] gap-2 cursor-pointer"
              onClick={() => setCurrent((c) => c + 1)}
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              className={`btn-secondary flex-[2] gap-2 cursor-pointer ${answered < total ? "opacity-60" : ""}`}
              onClick={handleSubmit}
            >
              Selesai & Lihat Skor
              <Trophy className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Soal Navigator Grid */}
        <div className="card p-3">
          <p className="text-[11px] font-bold text-ink-600 mb-2">Navigasi Nomor Soal:</p>
          <div className="flex gap-2 flex-wrap">
            {quiz.questions.map((q, i) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = i === current;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`w-9 h-9 rounded-xl font-heading font-extrabold text-xs transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-green-600 text-white shadow-btn scale-105"
                      : isAnswered
                      ? "bg-green-200 text-green-900 border border-green-300"
                      : "bg-white border-2 border-line text-ink-600 hover:border-green-400"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
