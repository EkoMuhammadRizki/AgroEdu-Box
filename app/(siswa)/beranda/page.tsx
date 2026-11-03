"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { Butterfly, Ladybug } from "@/components/agro/decorative-nature";
import {
  mockDevices, mockModules, mockMissions, mockActivities
} from "@/lib/mock-data";
import {
  Thermometer, Droplets, Sprout, Sun, ArrowRight,
  Trophy, CheckCircle2, Clock, Sparkles, BookOpen, Check
} from "lucide-react";
import { formatTimestamp } from "@/lib/iot";
import Link from "next/link";
import { useEffect, useState } from "react";
import { showToast } from "@/lib/swal";

export default function BerandaSiswaPage() {
  const [studentName, setStudentName] = useState("Andi");
  const [character, setCharacter] = useState<"original" | "girl">("original");
  const [completedDaily, setCompletedDaily] = useState<Record<string, boolean>>({
    "misi-daily-1": true,
    "misi-daily-2": false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("agro_student_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setStudentName(parsed.name.split(" ")[0]);
        if (parsed.character) setCharacter(parsed.character);
      }
    } catch {
      // ignore
    }
  }, []);

  const device = mockDevices[0]; // Box 1 – Kangkung (online)
  const isOffline = device.status === "offline";

  const toggleDailyMission = (id: string, title: string) => {
    setCompletedDaily((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        showToast(`Hebat! "${title}" selesai, +10 Bintang! ⭐`, "success", 1600);
      }
      return { ...prev, [id]: nextState };
    });
  };

  return (
    <AppShell role="siswa">
      {/* Friendly Hero Banner with BiBoo */}
      <div className="relative px-3.5 pt-4 pb-2 sm:px-8 sm:pt-8 max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-gradient-to-r from-[#BFE6F7] via-[#EAF6D9] to-[#CDEBB0] border-3 border-white p-4 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <Butterfly className="absolute top-2 right-4 sm:top-4 sm:right-20 animate-bounce" />

          <div className="space-y-1.5 sm:space-y-2 text-center md:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/85 text-green-700 text-[11px] sm:text-xs font-heading font-extrabold shadow-xs">
              <Sparkles className="w-3 h-3 text-yellow-500" /> Hari Petualangan Baru!
            </span>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl md:text-4xl text-ink-900 leading-tight">
              Halo, <span className="text-green-600">{studentName}!</span> Siap Belajar? 🌱
            </h1>
            <p className="text-xs sm:text-sm text-ink-600 max-w-md">
              Kondisi tanamanmu di <strong>{device.name}</strong> terpantau sehat hari ini. Yuk periksa data sensor dan selesaikan misi!
            </p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
              <Link href="/lab-iot" className="btn-secondary text-xs h-10 px-4 sm:px-5 gap-1.5 shadow-btn-yellow inline-flex items-center flex-1 sm:flex-initial justify-center">
                Cek Sensor Live
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/misi" className="btn-primary text-xs h-10 px-4 sm:px-5 gap-1.5 inline-flex items-center flex-1 sm:flex-initial justify-center">
                Kerjakan Misi
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <BibooMascot
              mood="wave"
              size="lg"
              character={character}
              bubbleText="Tanamanmu segar banget!"
              animated={true}
              className="scale-90 sm:scale-100"
            />
          </div>
        </div>
      </div>

      <ContentWrapper className="space-y-4 sm:space-y-6 pt-2 sm:pt-4 pb-8">
        {/* ── 4-Panel Dashboard Grid from DESIGN 2.md (Section 5.6) ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* 1. LIVE IOT SENSOR STATUS */}
          <div className="card-green flex flex-col justify-between p-4 sm:p-6">
            <div>
              <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-3 sm:mb-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 dot-pulse" />
                  LIVE IOT SENSOR STATUS
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-ink-600">
                  {formatTimestamp(device.lastDataAt)}
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/90 border-2 border-green-300 flex items-center justify-center p-1 shadow-xs flex-shrink-0">
                  <BibooMascot mood="happy" size="sm" character={character} animated={true} />
                </div>
                <div className="min-w-0">
                  <p className="font-heading font-extrabold text-sm sm:text-base text-ink-900 leading-tight truncate">
                    {device.name}
                  </p>
                  <p className="text-[11px] sm:text-xs text-ink-600 mt-0.5 truncate">
                    Sistem Hidroponik NFT · Minggu ke-3 Vegetatif
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-white text-green-700 text-[9px] sm:text-[10px] font-bold border border-green-200">
                    ✓ Mikroklimat Stabil
                  </span>
                </div>
              </div>

              {/* Sensor Pills Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-3 sm:mb-4">
                {/* Suhu */}
                <div className="bg-white/90 p-2.5 sm:p-3 rounded-2xl border-2 border-orange-400/30 flex items-center gap-2 sm:gap-3 shadow-xs">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-400/20 text-orange-500 flex items-center justify-center flex-shrink-0">
                    <Thermometer className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-heading font-bold text-ink-600 block truncate">Suhu Udara</span>
                    <span className="font-heading font-extrabold text-base sm:text-lg text-ink-900 leading-none">28.4°C</span>
                  </div>
                </div>

                {/* Kelembapan Tanah */}
                <div className="bg-white/90 p-2.5 sm:p-3 rounded-2xl border-2 border-blue-400/30 flex items-center gap-2 sm:gap-3 shadow-xs">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-200/50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-heading font-bold text-ink-600 block truncate">Kelembapan Tanah</span>
                    <span className="font-heading font-extrabold text-base sm:text-lg text-ink-900 leading-none">45%</span>
                  </div>
                </div>

                {/* Kelembapan Udara */}
                <div className="bg-white/90 p-2.5 sm:p-3 rounded-2xl border-2 border-blue-400/30 flex items-center gap-2 sm:gap-3 shadow-xs">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-200/50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-heading font-bold text-ink-600 block truncate">Kelembapan Udara</span>
                    <span className="font-heading font-extrabold text-base sm:text-lg text-ink-900 leading-none">62%</span>
                  </div>
                </div>

                {/* Cahaya */}
                <div className="bg-white/90 p-2.5 sm:p-3 rounded-2xl border-2 border-yellow-400/30 flex items-center gap-2 sm:gap-3 shadow-xs">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-yellow-300/40 text-yellow-600 flex items-center justify-center flex-shrink-0">
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-heading font-bold text-ink-600 block truncate">Intensitas Cahaya</span>
                    <span className="font-heading font-extrabold text-base sm:text-lg text-ink-900 leading-none">3200 lux</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/lab-iot"
              className="btn-secondary w-full text-center text-xs h-10 sm:h-11 inline-flex items-center justify-center gap-1.5"
            >
              Lihat Grafik & Catatan Pengamatan
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2. DAILY MISSIONS (Kartu Misi Checklist Pil) */}
          <div className="card-cream flex flex-col justify-between p-4 sm:p-6">
            <div>
              <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-3 sm:mb-4 flex items-center justify-between bg-yellow-300/40 border-yellow-300 text-brown-600">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                  DAILY MISSIONS (MISI HARIAN)
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-brown-600">
                  {Object.values(completedDaily).filter(Boolean).length}/3 Selesai
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-ink-600 mb-2.5">
                Lakukan langkah harian untuk menjaga tanamanmu tetap optimal:
              </p>

              <div className="space-y-2">
                {[
                  { id: "misi-daily-1", title: "Siram dan cek aliran nutrisi tunas", desc: "Pastikan kelembapan tanah >40%", pts: 10 },
                  { id: "misi-daily-2", title: "Periksa paparan sinar matahari", desc: "Intensitas optimal: 2500 - 4500 lux", pts: 10 },
                  { id: "misi-daily-3", title: "Kerjakan Misi Detektif Tanaman Sehat", desc: "Catat bukti pengamatan visual ke form", pts: 30, link: "/misi/misi-1" },
                ].map((item) => {
                  const isDone = completedDaily[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleDailyMission(item.id, item.title)}
                      className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isDone
                          ? "bg-green-100/60 border-green-300 text-green-800"
                          : "bg-white border-green-200 hover:border-green-400"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isDone ? "bg-green-500 border-green-500 text-white" : "border-ink-300 bg-white"
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <div className="min-w-0">
                          <p className={`font-heading font-bold text-xs sm:text-sm truncate ${isDone ? "line-through text-ink-600" : "text-ink-900"}`}>
                            {item.title}
                          </p>
                          <p className="text-[10px] text-ink-600 truncate">{item.desc}</p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-yellow-300/60 text-brown-600 font-heading font-extrabold text-[10px] flex-shrink-0">
                        +{item.pts} ⭐
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 sm:pt-4">
              <Link
                href="/misi"
                className="btn-primary w-full text-center text-xs h-10 sm:h-11 inline-flex items-center justify-center gap-1.5"
              >
                Buka Semua Kartu Misi Digital
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── 3. QUIZ CORNER & 4. INTERACTIVE LEARNING LAB ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* QUIZ CORNER CARD (1 col) */}
          <div className="card-cream flex flex-col justify-between text-center relative overflow-hidden p-4 sm:p-6">
            <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-3 sm:mb-4 bg-yellow-300/40 border-yellow-300 text-brown-600">
              QUIZ CORNER
            </div>

            <div className="py-1 sm:py-2 space-y-2 sm:space-y-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center text-white shadow-card transform hover:scale-105 transition-transform">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 fill-white drop-shadow-sm" />
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-ink-900">
                  Kuis Agro-Pintar
                </h3>
                <p className="text-xs text-ink-600 max-w-xs mx-auto mt-1 leading-relaxed">
                  Uji pemahamanmu tentang sensor & pertanian hidroponik! Dapatkan piala emas dan sertifikat resmi.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-yellow-300 text-[11px] font-bold text-brown-600">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Hadiah: 50 Bintang + Sertifikat
              </div>
            </div>

            <div className="pt-3 sm:pt-4">
              <Link
                href="/kuis/quiz-1"
                className="btn-secondary w-full text-center text-xs h-10 sm:h-11 inline-flex items-center justify-center gap-1.5"
              >
                Mulai Kuis Sekarang!
                <Trophy className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* INTERACTIVE LEARNING LAB (2 col) */}
          <div className="lg:col-span-2 card flex flex-col justify-between p-4 sm:p-6">
            <div>
              <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-3 sm:mb-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                  INTERACTIVE LEARNING LAB
                </span>
                <Link href="/materi" className="text-[10px] sm:text-[11px] font-bold text-green-600 hover:underline">
                  Semua Modul →
                </Link>
              </div>

              <p className="text-xs text-ink-600 mb-2.5">
                Pelajari materi terstruktur lengkap dengan simulasi Bioskop Agro dan praktikum IoT:
              </p>

              {/* Module cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {mockModules.map((mod, i) => {
                  const progress = i === 0 ? 100 : i === 1 ? 100 : 40;
                  const isFinished = progress === 100;
                  return (
                    <Link
                      key={mod.id}
                      href={`/materi/${mod.slug}`}
                      className="p-3 sm:p-3.5 rounded-2xl border-2 border-green-200/80 bg-green-50/50 hover:bg-white hover:border-green-400 hover:shadow-card transition-all group block"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-green-200 text-green-800 text-[9px] sm:text-[10px] font-heading font-extrabold uppercase">
                          {mod.topic}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-ink-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {mod.durationMin} mnt
                        </span>
                      </div>

                      <h4 className="font-heading font-extrabold text-xs sm:text-sm text-ink-900 group-hover:text-green-600 transition-colors line-clamp-1">
                        {mod.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-ink-600 line-clamp-2 mt-0.5 leading-relaxed">
                        {mod.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-green-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <div className="h-1.5 sm:h-2 w-full bg-white rounded-full overflow-hidden border border-green-200">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-bold text-ink-600">{progress}%</span>
                        </div>
                        {isFinished ? (
                          <span className="text-green-600 font-bold text-[10px] flex items-center gap-0.5 flex-shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" /> Selesai
                          </span>
                        ) : (
                          <span className="text-xs text-green-600 font-bold flex items-center gap-0.5">
                            Buka →
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <Link
                href="/materi"
                className="text-xs font-heading font-bold text-green-700 hover:text-green-800 inline-flex items-center gap-1 hover:underline"
              >
                Silabus & Materi Selengkapnya →
              </Link>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
