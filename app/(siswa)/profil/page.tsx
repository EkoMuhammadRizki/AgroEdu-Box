"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { mockModules, mockSubmissions, mockActivities } from "@/lib/mock-data";
import { ActivityList } from "@/components/agro/activity-list";
import {
  User, BookOpen, ClipboardCheck, Star, Trophy, Award,
  Send, ChevronRight, CheckCircle2, Sparkles, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { showSuccessAlert, showConfirmDialog, showToast } from "@/lib/swal";
import { updateStudentCharacter } from "@/lib/student-session";

export default function ProfilPage() {
  const [studentName, setStudentName] = useState("Andi Pratama");
  const [className, setClassName] = useState("Kelas 10A – Agribisnis");
  const [classCode, setClassCode] = useState("AGRO10A");
  const [character, setCharacter] = useState<"original" | "girl">("original");
  const [stars, setStars] = useState(120);
  const [studentNote, setStudentNote] = useState("");
  const [statusMessage, setStatusMessage] = useState("Sedang Eksperimen Sensor NFT");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("agro_student_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setStudentName(parsed.name);
        if (parsed.className) setClassName(parsed.className);
        if (parsed.classCode) setClassCode(parsed.classCode);
        if (parsed.character) setCharacter(parsed.character);
        if (parsed.stars) setStars(parsed.stars);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleCharacter = async () => {
    const nextChar = character === "original" ? "girl" : "original";
    setCharacter(nextChar);
    updateStudentCharacter(nextChar);
    showToast(`Karakter diganti menjadi BiBoo ${nextChar === "girl" ? "Girl" : "Original"}!`, "success", 1600);
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNote.trim()) {
      showToast("Tulis pesan atau pertanyaanmu terlebih dahulu.", "info");
      return;
    }

    const confirm = await showConfirmDialog({
      title: "Kirim Refleksi ke Guru?",
      text: "Pertanyaan atau catatanmu akan langsung masuk ke dashboard AGRO EDU TRACK Pak Eko.",
      icon: "question",
      confirmButtonText: "Ya, Kirim Pesan",
      cancelButtonText: "Batal",
      role: "siswa",
    });

    if (confirm.isConfirmed) {
      setStudentNote("");
      await showSuccessAlert(
        "Pesan Terkirim! ✉️",
        "Refleksi belajarmu telah dikirimkan ke guru pembimbing.",
        1600
      );
    }
  };

  return (
    <AppShell role="siswa">
      <PageHeader
        title="Profil Petani Muda"
        description="Pantau pencapaian bintang, sertifikat, riwayat kuis, dan bimbingan guru."
      />

      <ContentWrapper className="space-y-6 pb-10">
        {/* Profile Card Hero */}
        <div className="card-cream flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-white border-3 border-green-300 p-2 shadow-card flex items-center justify-center">
                <BibooMascot mood="happy" size="md" character={character} animated={true} />
              </div>
              <button
                type="button"
                onClick={handleToggleCharacter}
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-1.5 rounded-full bg-yellow-400 text-ink-900 border-2 border-white shadow-xs hover:scale-110 transition-transform cursor-pointer"
                title="Ganti karakter BiBoo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-ink-900">{studentName}</h2>
                <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[9px] sm:text-[10px] font-heading font-extrabold">
                  {character === "girl" ? "BiBoo Girl" : "BiBoo Ori"}
                </span>
              </div>
              <p className="text-xs text-ink-600 font-bold">{className} (NIS: 2026-001)</p>
              <div className="flex items-center gap-2 pt-0.5 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-white border border-green-300 text-[11px] sm:text-xs font-bold text-green-700">
                  🌱 {statusMessage}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 sm:gap-3">
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white border-2 border-yellow-300 shadow-xs text-center min-w-[76px] sm:min-w-[90px]">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-400 mx-auto mb-0.5 sm:mb-1" />
              <p className="font-heading font-extrabold text-lg sm:text-xl text-ink-900 leading-tight">{stars}</p>
              <p className="text-[9px] sm:text-[10px] font-bold text-ink-600">Bintang</p>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white border-2 border-yellow-300 shadow-xs text-center min-w-[76px] sm:min-w-[90px]">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-400 mx-auto mb-0.5 sm:mb-1" />
              <p className="font-heading font-extrabold text-lg sm:text-xl text-ink-900 leading-tight">1</p>
              <p className="text-[9px] sm:text-[10px] font-bold text-ink-600">Piala IoT</p>
            </div>
          </div>
        </div>

        {/* 3 Clickable Stats Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Link
            href="/materi"
            className="card text-center p-2.5 sm:p-4 hover:border-green-400 transition-all block group"
          >
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-heading font-extrabold text-lg sm:text-2xl text-ink-900 tabular-nums">2 / {mockModules.length}</p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-0.5 truncate group-hover:text-green-600">Modul Selesai →</p>
          </Link>

          <Link
            href="/misi"
            className="card text-center p-2.5 sm:p-4 hover:border-green-400 transition-all block group"
          >
            <ClipboardCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-heading font-extrabold text-lg sm:text-2xl text-ink-900 tabular-nums">{mockSubmissions.length}</p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-0.5 truncate group-hover:text-blue-500">Misi Terkirim →</p>
          </Link>

          <Link
            href="/kuis"
            className="card text-center p-2.5 sm:p-4 hover:border-green-400 transition-all block group"
          >
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-heading font-extrabold text-lg sm:text-2xl text-ink-900 tabular-nums">80%</p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-0.5 truncate group-hover:text-yellow-600">Rata-Rata Kuis →</p>
          </Link>
        </div>

        {/* Umpan Balik Guru & Pesan Balasan */}
        <div className="card space-y-4">
          <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-1">
            BIMBINGAN & UMPAN BALIK GURU
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 flex gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-heading font-extrabold text-base flex-shrink-0">
              E
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-heading font-extrabold text-xs text-blue-900">Pak Eko Mulyadi (Guru Pembimbing)</span>
                <span className="text-[10px] text-ink-600 font-bold">16 Okt 2026</span>
              </div>
              <p className="text-xs md:text-sm text-ink-900 leading-relaxed">
                "Pengamatan visual kangkungmu pada Misi #1 sangat cermat, Andi! Nilai kelembapan media 45% cocok dengan fase pertumbuhannya. Pertahankan konsistensi pencatatan waktu pembacaan ya!"
              </p>
            </div>
          </div>

          {/* Form Balasan Siswa */}
          <form onSubmit={handleSendFeedback} className="pt-1 space-y-2">
            <label htmlFor="student-reply" className="font-heading font-bold text-xs text-ink-900 block">
              Kirim Pertanyaan / Refleksi Balasan ke Pak Eko:
            </label>
            <div className="flex gap-2">
              <input
                id="student-reply"
                type="text"
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                placeholder="Tulis pesan atau pertanyaan lanjutan..."
                className="input-field text-xs flex-1 h-11"
              />
              <button
                type="submit"
                className="btn-primary text-xs px-5 h-11 gap-1.5 flex-shrink-0 inline-flex items-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Kirim
              </button>
            </div>
          </form>
        </div>

        {/* Riwayat Aktivitas Belajar */}
        <div className="card space-y-3">
          <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-1">
            LOG AKTIVITAS BELAJAR SISWA
          </div>
          <ActivityList activities={mockActivities} />
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
