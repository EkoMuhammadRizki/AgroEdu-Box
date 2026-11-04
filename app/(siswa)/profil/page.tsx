"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { ClipboardCheck, Star, Award, Users, RefreshCw, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/lib/swal";
import { getStudentProfile, updateStudentCharacter, type StudentProfile } from "@/lib/student-session";
import { fetchMissionStatus, type MissionStatus } from "@/lib/mission-status";
import { DAILY_POTS } from "@/lib/daily-missions";
import { getInvestigationCard } from "@/lib/investigation-cards";

const tanggal = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default function ProfilPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [status, setStatus] = useState<MissionStatus | null>(null);
  const [gagal, setGagal] = useState(false);

  const muat = useCallback(async () => {
    const tersimpan = getStudentProfile();
    if (!tersimpan) return;
    setProfile(tersimpan);
    setGagal(false);
    try {
      setStatus(await fetchMissionStatus(tersimpan));
      const terbaru = getStudentProfile();
      if (terbaru) setProfile(terbaru);
    } catch {
      setGagal(true);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  const handleToggleCharacter = async () => {
    if (!profile) return;
    const next = profile.character === "original" ? "girl" : "original";
    setProfile({ ...profile, character: next });
    await updateStudentCharacter(next);
    showToast(`Karakter diganti menjadi Situnas ${next === "girl" ? "Girl" : "Original"}!`, "success", 1600);
  };

  // Hanya kartu yang sudah dinilai guru yang punya umpan balik.
  const umpanBalik = DAILY_POTS.flatMap((pot) => {
    const laporan = status?.laporan[pot];
    if (!laporan || (laporan.nilai === null && !laporan.umpanBalik)) return [];
    return [{ pot, ...laporan }];
  }).sort((a, b) => (b.dinilaiAt ?? "").localeCompare(a.dinilaiAt ?? ""));

  const selesai = status?.selesai.length ?? 0;

  return (
    <AppShell role="siswa">
      <PageHeader
        title="Profil Petani Muda"
        description="Pantau bintang, Kartu Misi, nilai kuis, dan bimbingan dari gurumu."
      />

      <ContentWrapper className="space-y-6 pb-10">
        {/* Kartu profil */}
        <div className="card-cream flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-white border-3 border-green-300 p-2 shadow-card flex items-center justify-center">
                <BibooMascot mood="happy" size="md" character={profile?.character ?? "original"} animated={true} />
              </div>
              <button
                type="button"
                onClick={handleToggleCharacter}
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-1.5 rounded-full bg-yellow-400 text-ink-900 border-2 border-white shadow-xs hover:scale-110 transition-transform cursor-pointer"
                title="Ganti karakter Situnas"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-ink-900">
                  {profile?.name ?? "Memuat..."}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[9px] sm:text-[10px] font-heading font-extrabold">
                  {profile?.character === "girl" ? "Situnas Girl" : "Situnas Ori"}
                </span>
              </div>
              <p className="text-xs text-ink-600 font-bold">{profile?.className ?? ""}</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white border-2 border-yellow-300 shadow-xs text-center min-w-[90px]">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="font-heading font-extrabold text-lg sm:text-xl text-ink-900 leading-tight tabular-nums">
              {profile?.stars ?? 0}
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold text-ink-600">Bintang</p>
          </div>
        </div>

        {/* Tiga angka, semuanya dari data sungguhan */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Link href="/misi" className="card text-center p-2.5 sm:p-4 hover:border-green-400 transition-all block group">
            <ClipboardCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-heading font-extrabold text-lg sm:text-2xl text-ink-900 tabular-nums">{selesai} / 4</p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-0.5 truncate group-hover:text-blue-500">
              Kartu Misi →
            </p>
          </Link>

          <Link href="/kuis" className="card text-center p-2.5 sm:p-4 hover:border-green-400 transition-all block group">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-heading font-extrabold text-lg sm:text-2xl text-ink-900 tabular-nums">
              {status?.kuis ? status.kuis.terbaik : "–"}
            </p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-0.5 truncate group-hover:text-yellow-600">
              Nilai Kuis Terbaik →
            </p>
          </Link>

          <div className="card text-center p-2.5 sm:p-4">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-1" />
            <p className="font-heading font-extrabold text-sm sm:text-lg text-ink-900 leading-tight mt-1">
              {status?.kelompok?.nama ?? "Belum ada"}
            </p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-0.5 truncate">Kelompok</p>
          </div>
        </div>

        {/* Umpan balik guru sungguhan */}
        <div className="card space-y-3">
          <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-1">
            BIMBINGAN & UMPAN BALIK GURU
          </div>

          {gagal && (
            <div className="p-4 rounded-2xl bg-cream-50 border-2 border-yellow-300 text-center space-y-2">
              <p className="text-xs font-bold text-brown-600">Belum bisa memuat bimbingan gurumu.</p>
              <button type="button" onClick={muat} className="btn-ghost text-xs cursor-pointer">
                Coba Lagi
              </button>
            </div>
          )}

          {!gagal && umpanBalik.length === 0 && (
            <div className="p-5 rounded-2xl bg-green-50 border-2 border-green-200 text-center space-y-1.5">
              <MessageSquare className="w-7 h-7 text-green-600 mx-auto" />
              <p className="text-xs sm:text-sm font-bold text-ink-900">Belum ada bimbingan dari guru.</p>
              <p className="text-[11px] sm:text-xs text-ink-600 leading-relaxed">
                Selesaikan Kartu Misi bersama kelompokmu. Setelah gurumu menilai laporannya,
                catatan beliau akan muncul di sini.
              </p>
            </div>
          )}

          {umpanBalik.map((item) => {
            const kartu = getInvestigationCard(item.pot);
            const guru = item.dinilaiOleh ?? "Guru Pembimbing";
            return (
              <div key={item.pot} className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-heading font-extrabold text-base flex-shrink-0">
                  {guru.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-heading font-extrabold text-xs text-blue-900">
                      {guru} (Guru Pembimbing)
                    </span>
                    {item.dinilaiAt && (
                      <span className="text-[10px] text-ink-600 font-bold">{tanggal(item.dinilaiAt)}</span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-ink-600">
                    Pot {item.pot}
                    {kartu ? ` · ${kartu.title}` : ""}
                    {item.nilai !== null && item.nilai !== undefined ? ` · Nilai ${item.nilai}` : ""}
                  </p>
                  {item.umpanBalik ? (
                    <p className="text-xs md:text-sm text-ink-900 leading-relaxed">&ldquo;{item.umpanBalik}&rdquo;</p>
                  ) : (
                    <p className="text-xs text-ink-600 italic">Guru memberi nilai tanpa catatan tambahan.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
