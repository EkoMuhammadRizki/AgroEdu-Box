"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { mockModules } from "@/lib/mock-data";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  CheckCircle2, Clock, BookOpen, ArrowRight, ArrowLeft,
  Play, Sparkles, Droplets, Check, HelpCircle, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { showSuccessAlert, showToast } from "@/lib/swal";

export default function MateriDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "sensor-iot-pertanian";
  const mod = mockModules.find((m) => m.slug === slug) || mockModules[0];
  if (!mod) notFound();

  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [moistureLevel, setMoistureLevel] = useState(22); // Simulated moisture level

  const handleSimulateWatering = () => {
    setMoistureLevel(78);
    showToast("💧 Air disiramkan! Kelembapan media A0 naik ke 78% (Lembap Optimal)!", "success", 2000);
  };

  const handleMarkComplete = async () => {
    setIsCompleted(true);
    await showSuccessAlert(
      "Modul Diselesaikan! 🎉",
      `Hebat sekali! Kamu telah menuntaskan "${mod.title}". Poin bertambah +30 Bintang!`,
      1800
    );
  };

  return (
    <AppShell role="siswa">
      <PageHeader
        title={mod.title}
        description={`${mod.topic} · Estimasi ${mod.durationMin} menit belajar`}
        badge={
          <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-green-700 bg-green-100 rounded-pill px-3 py-1 border border-green-200">
            {mod.topic}
          </span>
        }
        action={
          <Link href="/materi" className="btn-ghost text-xs gap-1.5 inline-flex items-center">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Katalog
          </Link>
        }
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* Kotak Tugas Kutipan Hijau Muda (DESIGN 2.md Section 5.7) */}
        <div className="bg-green-100/90 border-2 border-green-300 rounded-3xl p-5 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-green-300 flex items-center justify-center p-0.5 flex-shrink-0 shadow-xs">
            <BibooMascot mood="happy" size="sm" animated={false} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-sm text-green-800 uppercase tracking-wider">
              Tugas Petani Muda:
            </h3>
            <p className="text-xs md:text-sm text-ink-900 font-medium leading-relaxed mt-0.5">
              "Pahami cara membaca sensor, tonton mekanisme pergerakan air di <strong>Bioskop Agro</strong>, lalu bandingkan tiga kondisi tanah sebelum mengambil keputusan!"
            </p>
          </div>
        </div>

        {/* ── BIOSKOP AGRO & CEK IOT (DESIGN 2.md Section 5.8) ──────────────── */}
        <div className="card-cream space-y-4">
          <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-2 flex items-center justify-between bg-blue-200/50 border-blue-200 text-blue-500">
            <span className="flex items-center gap-1.5 sm:gap-2 truncate">
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-blue-500 text-blue-500 flex-shrink-0" />
              BIOSKOP AGRO: SIMULASI SENSOR & AIR
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-blue-500 flex-shrink-0">
              Sensor A0 Live
            </span>
          </div>

          {/* TV / Tablet Dark Frame Screen */}
          <div className="relative rounded-[24px] sm:rounded-[28px] bg-ink-900 border-4 border-brown-600 p-3.5 sm:p-6 shadow-2xl text-white overflow-hidden min-h-[240px] flex flex-col justify-between">
            {/* Corner Live Overlay */}
            <div className="flex flex-wrap items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-pill bg-black/60 border border-white/20 backdrop-blur-md text-[11px] sm:text-xs font-mono">
                <span className={`w-2.5 h-2.5 rounded-full ${moistureLevel > 40 ? "bg-green-400" : "bg-red-400"} dot-pulse flex-shrink-0`} />
                <span>Sensor A0: <strong>{moistureLevel}%</strong></span>
                <span className="text-white/60 hidden sm:inline">({moistureLevel < 35 ? "Kering" : moistureLevel > 80 ? "Basah" : "Lembap Optimal"})</span>
              </div>

              <div className="px-2.5 py-0.5 rounded-pill bg-yellow-500 text-ink-900 text-[10px] font-heading font-extrabold flex-shrink-0">
                Mode Simulasi
              </div>
            </div>

            {/* Screen Content: Animated Tank & Soil Mechanism */}
            <div className="py-4 sm:py-6 my-auto text-center z-10 space-y-3">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                {/* Sprout Mascot */}
                <div className={`transition-all transform ${moistureLevel > 40 ? "scale-105" : "scale-95"}`}>
                  <BibooMascot
                    mood={moistureLevel > 40 ? "happy" : "thinking"}
                    size="md"
                    bubbleText={moistureLevel > 40 ? "Wah segar sekali!" : "Aduh aku haus..."}
                    animated={true}
                  />
                </div>

                {/* Soil Animation Box */}
                <div className="w-full max-w-[200px] p-3 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-left text-xs space-y-2">
                  <p className="font-heading font-bold text-white text-[11px] flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" /> Profil Media Tanam
                  </p>
                  <div className="h-3.5 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/20">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        moistureLevel > 40 ? "bg-gradient-to-r from-blue-400 to-green-400" : "bg-orange-500"
                      }`}
                      style={{ width: `${moistureLevel}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/80">
                    Nilai resistif: {moistureLevel * 10} mV
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Screen CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-white/10 z-10">
              <span className="text-[11px] sm:text-xs text-white/80 font-medium text-center sm:text-left">
                Tekan tombol untuk menguji respon sensor tanah:
              </span>
              <button
                type="button"
                onClick={handleSimulateWatering}
                className="btn-info text-xs h-9 px-4 sm:px-5 gap-1.5 shadow-btn-blue inline-flex items-center cursor-pointer w-full sm:w-auto justify-center"
              >
                <Droplets className="w-3.5 h-3.5" />
                Pahami! Coba Misi Siram!
              </button>
            </div>
          </div>
        </div>

        {/* ── DIAGRAM PERBANDINGAN 3 KOLOM (DESIGN 2.md Section 5.7) ─────────────── */}
        <div className="card space-y-4">
          <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-2">
            DIAGRAM PERBANDINGAN KONDISI MEDIA TANAM
          </div>
          <p className="text-xs text-ink-600">
            Berikut adalah cara membaca kondisi fisik tanaman dan membandingkannya dengan rentang angka sensor:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. KERING */}
            <div className="p-4 rounded-2xl border-2 border-orange-300 bg-orange-50/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-200 text-orange-800 text-[10px] font-heading font-extrabold uppercase">
                    1. Kering (&lt; 35%)
                  </span>
                  <span className="text-xl">🍂</span>
                </div>
                <h4 className="font-heading font-extrabold text-sm text-ink-900 mt-2">
                  Tanah / Media Kering
                </h4>
                <p className="text-xs text-ink-600 mt-1 leading-relaxed">
                  Permukaan media retak dan berwarna coklat terang. Tanaman mulai layu karena kekurangan air untuk fotosintesis.
                </p>
              </div>
              <div className="pt-2 border-t border-orange-200 text-[11px] font-bold text-orange-700">
                Tindakan: Segera siram & periksa pompa.
              </div>
            </div>

            {/* 2. LEMBAP (OPTIMAL) */}
            <div className="p-4 rounded-2xl border-3 border-green-500 bg-green-100/70 flex flex-col justify-between space-y-3 shadow-card scale-102">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-heading font-extrabold uppercase">
                    2. Lembap Optimal (40 - 75%)
                  </span>
                  <span className="text-xl">🌱</span>
                </div>
                <h4 className="font-heading font-extrabold text-sm text-green-800 mt-2">
                  Kondisi Paling Ideal!
                </h4>
                <p className="text-xs text-ink-700 mt-1 leading-relaxed">
                  Media tanam gembur, berwarna coklat tua lembap. Tunas berdiri tegak, akar menyerap nutrisi dengan sangat baik.
                </p>
              </div>
              <div className="pt-2 border-t border-green-300 text-[11px] font-bold text-green-700">
                Tindakan: Pertahankan sirkulasi nutrisi.
              </div>
            </div>

            {/* 3. BASAH (TERGENANG) */}
            <div className="p-4 rounded-2xl border-2 border-blue-300 bg-blue-50/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-800 text-[10px] font-heading font-extrabold uppercase">
                    3. Tergenang (&gt; 85%)
                  </span>
                  <span className="text-xl">🌊</span>
                </div>
                <h4 className="font-heading font-extrabold text-sm text-ink-900 mt-2">
                  Media Terlalu Basah
                </h4>
                <p className="text-xs text-ink-600 mt-1 leading-relaxed">
                  Air tergenang di sekitar akar. Rongga oksigen tertutup sehingga berisiko menyebabkan busuk akar pada tanaman.
                </p>
              </div>
              <div className="pt-2 border-t border-blue-200 text-[11px] font-bold text-blue-700">
                Tindakan: Kurangi debit air & cek drainase.
              </div>
            </div>
          </div>
        </div>

        {/* ── TUJUAN & MATERI INTI ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Tujuan Pembelajaran */}
          <div className="card space-y-3">
            <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-2">
              TUJUAN PEMBELAJARAN
            </div>
            <ul className="space-y-2.5">
              {mod.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-ink-900">
                  <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Materi Inti */}
          <div className="card space-y-3">
            <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-2">
              RINGKASAN TEORI
            </div>
            <div className="text-xs md:text-sm text-ink-600 leading-relaxed space-y-2">
              <p className="font-bold text-ink-900">{mod.content}</p>
              <p>
                Mikrokontroler ESP32 membaca resistansi atau kapasitansi elektroda di dalam tanah, lalu mengonversinya menjadi angka persentase digital yang dikirimkan secara nirkabel ke dashboard website Agro-Edu.
              </p>
            </div>
          </div>
        </div>

        {/* ── PERTANYAAN PEMANTIK ────────────────────────────────────────────── */}
        <div className="card space-y-3">
          <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-2">
            PERTANYAAN REFLEKSI & PENELITIAN
          </div>
          <div className="space-y-3">
            {[
              "Mengapa data angka 45% tidak bisa langsung disimpulkan 'bagus' sebelum mengetahui jenis tanaman kangkung vs selada?",
              "Jika suhu udara naik tajam di siang hari (misal 34°C), apa yang terjadi dengan laju penguapan air di media tanam?",
              "Bagaimana cara membedakan data sensor yang nyata dengan data simulasi pada dashboard?",
            ].map((q, i) => (
              <div key={i} className="p-3 rounded-2xl bg-cream-50 border border-yellow-300/80 flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-ink-900 font-medium">{q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/misi/misi-1"
            className="btn-secondary flex-1 text-center inline-flex items-center justify-center gap-2"
          >
            Tonton Video & Lanjut Misi!
            <ArrowRight className="w-4 h-4" />
          </Link>

          {mod.quizId ? (
            <Link
              href={`/kuis/${mod.quizId}`}
              className="btn-primary flex-1 text-center inline-flex items-center justify-center gap-2"
            >
              Uji Pemahaman: Mulai Kuis Modul
              <Sparkles className="w-4 h-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={isCompleted}
              className={`btn-primary flex-1 text-center inline-flex items-center justify-center gap-2 ${
                isCompleted ? "opacity-80" : ""
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? "Modul Selesai ✓ (+30 Bintang)" : "Tandai Modul Selesai"}
            </button>
          )}
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
