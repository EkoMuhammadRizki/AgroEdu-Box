"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { mockQuizzes, mockModules } from "@/lib/mock-data";
import { Trophy, Star, Sparkles, CheckCircle2, Clock, ArrowRight, Award, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function KuisListPage() {
  const [character, setCharacter] = useState<"original" | "girl">("original");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("agro_student_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.character) setCharacter(parsed.character);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <AppShell role="siswa">
      <PageHeader
        title="Portal Kuis Agro-Pintar"
        description="Uji pemahaman teorimu dan interpretasi data sensor bersama BiBoo!"
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* ── PORTAL KUIS GERBANG HERO (DESIGN 2.md Section 5.12) ────────── */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#FFE27A] via-[#EAF6D9] to-[#BFE6F7] border-3 border-white p-6 md:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-brown-600 text-xs font-heading font-extrabold shadow-xs">
              <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-400" /> Siap Uji Pengetahuan?
            </span>
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-ink-900 leading-tight">
              Gerbang Tantangan Petani Muda IoT! 🌟
            </h2>
            <p className="text-xs md:text-sm text-ink-600 max-w-md">
              Jawab soal pilihan ganda interaktif, raih skor 100%, klaim bintang berharga, dan dapatkan <strong>Sertifikat Resmi Petani Muda</strong>!
            </p>
            <div className="pt-2">
              <Link href="/kuis/quiz-1" className="btn-secondary text-xs h-10 px-6 gap-2 inline-flex items-center shadow-btn-yellow">
                Mulai Kuis Utama Sekarang!
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <BibooMascot
              mood="trophy"
              size="xl"
              character={character}
              bubbleText="Ayo buktikan kemampuanmu!"
              animated={true}
            />
          </div>
        </div>

        {/* ── DAFTAR KUIS ─────────────────────────────────────────────── */}
        <div>
          <h3 className="font-heading font-extrabold text-lg text-ink-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" /> Daftar Kuis Tersedia
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockQuizzes.map((quiz) => {
              const relatedModule = mockModules.find((m) => m.id === quiz.moduleId);
              return (
                <div key={quiz.id} className="card-cream flex flex-col justify-between hover:shadow-card-hover transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-pill bg-white text-ink-600 border border-green-200 text-xs font-heading font-extrabold flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                        {quiz.questions.length} Soal
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill bg-yellow-300/50 text-brown-600 text-xs font-heading font-extrabold">
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" /> +50 Poin
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-extrabold text-base md:text-lg text-ink-900 leading-snug">
                        {quiz.title}
                      </h4>
                      {relatedModule && (
                        <p className="text-xs text-ink-600 mt-1">
                          Terkait materi: <strong>{relatedModule.title}</strong>
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-ink-600 leading-relaxed">
                      Mencakup pemahaman fungsi mikrokontroler ESP32, kalibrasi kelembapan tanah, suhu udara DHT22, dan interpretasi timestamp data.
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-yellow-300/60 flex items-center justify-between">
                    <span className="text-xs text-ink-600 flex items-center gap-1.5 font-bold">
                      <Clock className="w-3.5 h-3.5 text-green-600" /> ~10 menit
                    </span>

                    <Link
                      href={`/kuis/${quiz.id}`}
                      className="btn-primary text-xs h-9 px-5 gap-1.5 inline-flex items-center"
                    >
                      Buka Kuis
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
