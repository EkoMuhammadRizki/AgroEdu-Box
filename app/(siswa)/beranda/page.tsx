"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { StatCard } from "@/components/agro/stat-card";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { Butterfly, Ladybug } from "@/components/agro/decorative-nature";
import {
  mockDevices, mockModules, mockMissions, mockActivities
} from "@/lib/mock-data";
import {
  Thermometer, Droplets, Sprout, Sun, ArrowRight,
  Trophy, CheckCircle2, Clock, Sparkles, BookOpen, ChevronRight, Check
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
      <div className="relative px-4 pt-6 pb-2 md:px-8 md:pt-8 max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#BFE6F7] via-[#EAF6D9] to-[#CDEBB0] border-3 border-white p-6 md:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <Butterfly className="absolute top-4 right-20 animate-bounce" />
          <Ladybug className="absolute bottom-4 left-6" />

          <div className="space-y-2 text-center md:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-green-700 text-xs font-heading font-extrabold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Hari Petualangan Baru!
            </span>
            <h1 className="font-heading font-extrabold text-2xl md:text-4xl text-ink-900 leading-tight">
              Halo, <span className="text-green-600">{studentName}!</span> Siap Belajar? 🌱
            </h1>
            <p className="text-xs md:text-sm text-ink-600 max-w-md">
              Kondisi tanamanmu di <strong>{device.name}</strong> terpantau sehat hari ini. Yuk periksa data sensor dan selesaikan misi!
            </p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
              <Link href="/lab-iot" className="btn-secondary text-xs h-10 px-5 gap-1.5 shadow-btn-yellow inline-flex items-center">
                Cek Sensor Live
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/misi" className="btn-primary text-xs h-10 px-5 gap-1.5 inline-flex items-center">
                Kerjakan Misi
                <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <BibooMascot
              mood="wave"
              size="xl"
              character={character}
              bubbleText="Tanamanmu segar banget!"
              animated={true}
            />
          </div>
        </div>
      </div>

      <ContentWrapper className="space-y-6 pt-4 pb-8">
        {/* ── 4-Panel Dashboard Grid from DESIGN 2.md (Section 5.6) ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 1. LIVE IOT SENSOR STATUS */}
          <div className="card-green flex flex-col justify-between">
            <div className="panel-header -mx-5 -mt-5 md:-mx-6 md:-mt-6 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 dot-pulse" />
                LIVE IOT SENSOR STATUS
              </span>
              <span className="text-[10px] font-bold text-ink-600">
                {formatTimestamp(device.lastDataAt)}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-white/90 border-2 border-green-300 flex items-center justify-center p-1 shadow-sm flex-shrink-0">
                <BibooMascot mood="happy" size="md" character={character} animated={true} />
              </div>
              <div>
                <p className="font-heading font-extrabold text-base text-ink-900 leading-tight">
                  {device.name}
                </p>
                <p className="text-xs text-ink-600 mt-0.5">
                  Sistem Hidroponik NFT · Minggu ke-3 Vegetatif
                </p>
                <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-white text-green-700 text-[10px] font-bold border border-green-200">
                  ✓ Mikroklimat Stabil
                </span>
              </div>
            </div>

            {/* Sensor Pills Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {/* Suhu */}
              <div className="bg-white/90 p-3 rounded-2xl border-2 border-orange-400/30 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-orange-400/20 text-orange-500 flex items-center justify-center flex-shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-heading font-bold text-ink-600 block">Suhu Udara</span>
                  <span className="font-heading font-extrabold text-lg text-ink-900 leading-none">28.4°C</span>
                </div>
              </div>

              {/* Kelembapan Tanah */}
              <div className="bg-white/90 p-3 rounded-2xl border-2 border-blue-400/30 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-200/50 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-heading font-bold text-ink-600 block">Kelembapan Tanah</span>
                  <span className="font-heading font-extrabold text-lg text-ink-900 leading-none">45%</span>
                </div>
              </div>

              {/* Kelembapan Udara */}
              <div className="bg-white/90 p-3 rounded-2xl border-2 border-blue-400/30 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-200/50 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-heading font-bold text-ink-600 block">Kelembapan Udara</span>
                  <span className="font-heading font-extrabold text-lg text-ink-900 leading-none">62%</span>
                </div>
              </div>

              {/* Cahaya */}
              <div className="bg-white/90 p-3 rounded-2xl border-2 border-yellow-400/30 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-yellow-300/40 text-yellow-600 flex items-center justify-center flex-shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-heading font-bold text-ink-600 block">Intensitas Cahaya</span>
                  <span className="font-heading font-extrabold text-lg text-ink-900 leading-none">3200 lux</span>
                </div>
              </div>
            </div>

            <Link
              href="/lab-iot"
              className="btn-secondary w-full text-center text-xs h-11 inline-flex items-center justify-center gap-2"
            >
              Lihat Grafik & Catatan Pengamatan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2. DAILY MISSIONS (Kartu Misi Checklist Pil) */}
          <div className="card-cream flex flex-col justify-between">
            <div>
              <div className="panel-header -mx-5 -mt-5 md:-mx-6 md:-mt-6 mb-4 flex items-center justify-between bg-yellow-300/40 border-yellow-300 text-brown-600">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  DAILY MISSIONS (MISI HARIAN)
                </span>
                <span className="text-[10px] font-bold text-brown-600">
                  {Object.values(completedDaily).filter(Boolean).length}/3 Selesai
                </span>
              </div>

              <p className="text-xs text-ink-600 mb-3">
                Lakukan langkah harian untuk menjaga tanamanmu tetap optimal:
              </p>

              <div className="space-y-2.5">
                {[
                  { id: "misi-daily-1", title: "Siram dan cek aliran nutrisi tunas", desc: "Pastikan kelembapan tanah di atas 40%", pts: 10 },
                  { id: "misi-daily-2", title: "Periksa paparan sinar matahari", desc: "Intensitas optimal: 2500 - 4500 lux", pts: 10 },
                  { id: "misi-daily-3", title: "Kerjakan Misi Detektif Tanaman Sehat", desc: "Catat bukti pengamatan visual ke formulir", pts: 30, link: "/misi/misi-1" },
                ].map((item) => {
                  const isDone = completedDaily[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleDailyMission(item.id, item.title)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isDone
                          ? "bg-green-100/60 border-green-300 text-green-800"
                          : "bg-white border-green-200 hover:border-green-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isDone ? "bg-green-500 border-green-500 text-white" : "border-ink-300 bg-white"
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <div>
                          <p className={`font-heading font-bold text-sm ${isDone ? "line-through text-ink-600" : "text-ink-900"}`}>
                            {item.title}
                          </p>
                          <p className="text-[11px] text-ink-600">{item.desc}</p>
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

            <div className="pt-4">
              <Link
                href="/misi"
                className="btn-primary w-full text-center text-xs h-11 inline-flex items-center justify-center gap-2"
              >
                Buka Semua Kartu Misi Digital
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── 3. QUIZ CORNER & 4. INTERACTIVE LEARNING LAB ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* QUIZ CORNER CARD (1 col) */}
          <div className="card-cream flex flex-col justify-between text-center relative overflow-hidden">
            <div className="panel-header -mx-5 -mt-5 md:-mx-6 md:-mt-6 mb-4 bg-yellow-300/40 border-yellow-300 text-brown-600">
              QUIZ CORNER
            </div>

            <div className="py-2 space-y-3">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center text-white shadow-card transform hover:scale-110 transition-transform">
                <Trophy className="w-10 h-10 fill-white drop-shadow-sm" />
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-xl text-ink-900">
                  Kuis Agro-Pintar
                </h3>
                <p className="text-xs text-ink-600 max-w-xs mx-auto mt-1">
                  Uji pemahamanmu tentang sensor & pertanian hidroponik! Dapatkan piala emas dan sertifikat resmi.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-yellow-300 text-xs font-bold text-brown-600">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Hadiah: 50 Bintang + Sertifikat
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/kuis/quiz-1"
                className="btn-secondary w-full text-center text-xs h-11 inline-flex items-center justify-center gap-2"
              >
                Mulai Kuis Sekarang!
                <Trophy className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* INTERACTIVE LEARNING LAB (2 col) */}
          <div className="lg:col-span-2 card flex flex-col justify-between">
            <div>
              <div className="panel-header -mx-5 -mt-5 md:-mx-6 md:-mt-6 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  INTERACTIVE LEARNING LAB
                </span>
                <Link href="/materi" className="text-[11px] font-bold text-green-600 hover:underline">
                  Semua Modul →
                </Link>
              </div>

              <p className="text-xs text-ink-600 mb-3">
                Pelajari materi terstruktur lengkap dengan simulasi Bioskop Agro dan praktikum IoT:
              </p>

              {/* Module cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mockModules.map((mod, i) => {
                  const progress = i === 0 ? 100 : i === 1 ? 100 : 40;
                  const isFinished = progress === 100;
                  return (
                    <Link
                      key={mod.id}
                      href={`/materi/${mod.slug}`}
                      className="p-3.5 rounded-2xl border-2 border-green-200/80 bg-green-50/50 hover:bg-white hover:border-green-400 hover:shadow-card transition-all group block"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-green-200 text-green-800 text-[10px] font-heading font-extrabold uppercase">
                          {mod.topic}
                        </span>
                        <span className="text-[10px] font-bold text-ink-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {mod.durationMin} mnt
                        </span>
                      </div>

                      <h4 className="font-heading font-extrabold text-sm text-ink-900 group-hover:text-green-600 transition-colors line-clamp-1">
                        {mod.title}
                      </h4>
                      <p className="text-[11px] text-ink-600 line-clamp-2 mt-0.5">
                        {mod.description}
                      </p>

                      <div className="mt-3 pt-2 border-t border-green-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-green-200">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-ink-600">{progress}%</span>
                        </div>
                        {isFinished ? (
                          <span className="text-green-600 font-bold text-[10px] flex items-center gap-0.5 flex-shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" /> Selesai
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-ink-600 group-hover:text-green-600 transition-colors flex-shrink-0" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Link
                href="/materi"
                className="text-xs font-heading font-bold text-green-700 hover:text-green-800 inline-flex items-center gap-1 hover:underline"
              >
                Jelajahi Silabus & Materi Pembelajaran Selengkapnya →
              </Link>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
