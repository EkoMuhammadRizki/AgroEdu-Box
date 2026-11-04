"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { Check, ClipboardCheck, Lock, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getStudentProfile } from "@/lib/student-session";
import { DAILY_POTS, STARS_PER_POT, type DailyPot } from "@/lib/daily-missions";
import { INVESTIGATION_CARDS } from "@/lib/investigation-cards";
import { fetchMissionStatus, type MissionStatus } from "@/lib/mission-status";

export default function MisiPage() {
  const [character, setCharacter] = useState<"original" | "girl">("original");
  const [completed, setCompleted] = useState<DailyPot[]>([]);
  const [group, setGroup] = useState<MissionStatus["kelompok"]>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [reports, setReports] = useState<MissionStatus["laporan"]>({});
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const load = async () => {
    const profile = getStudentProfile();
    if (!profile) return;
    setCharacter(profile.character);
    setStatus("loading");
    try {
      const mission = await fetchMissionStatus(profile);
      setGroup(mission.kelompok);
      setMembers(mission.anggota);
      setReports(mission.laporan);
      setCompleted(mission.selesai);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AppShell role="siswa">
      <PageHeader
        title="Kartu Misi & Tugas Digital"
        description="Selesaikan 4 Kartu Investigasi bersama kelompokmu, dari Pot A sampai Pot D."
      />

      <ContentWrapper className="space-y-6 pb-8">
        <div className="card-green flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 p-4 sm:p-6">
          <div className="space-y-1.5 sm:space-y-2 text-center md:text-left">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-pill bg-white text-green-700 text-[11px] sm:text-xs font-heading font-extrabold inline-flex items-center gap-1.5 shadow-xs">
              <ClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" /> Tantangan Belajar Aktif
            </span>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-ink-900 leading-tight">
              Kumpulkan Bukti Ilmiah Tanamanmu! 🌿
            </h2>
            <p className="text-xs sm:text-sm text-ink-600 max-w-md leading-relaxed">
              Kerjakan bersama kelompokmu: cukup satu anggota yang mengirim, misi tercentang untuk semua dan setiap anggota mendapat bintang.
            </p>
          </div>
          <div className="flex-shrink-0">
            <BibooMascot mood="watering" size="md" character={character} animated={true} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="card text-center p-2.5 sm:p-4">
            <p className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-green-600 tabular-nums">{DAILY_POTS.length}</p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-1 truncate">Total Kartu</p>
          </div>
          <div className="card text-center p-2.5 sm:p-4">
            <p className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-blue-500 tabular-nums">{completed.length}</p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-1 truncate">Kartu Selesai</p>
          </div>
          <div className="card text-center p-2.5 sm:p-4">
            <p className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-yellow-500 tabular-nums">{completed.length * STARS_PER_POT} ⭐</p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-1 truncate">Bintang Diraih</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-ink-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" /> Kartu Investigasi
            {group && (
              <span className="px-2.5 py-0.5 rounded-pill bg-green-100 text-green-700 text-[11px] font-heading font-extrabold">
                {group.nama}
              </span>
            )}
          </h3>

          {group && (
            <p className="text-xs text-ink-600 leading-relaxed">
              <strong>Anggota kelompokmu:</strong> {members.join(", ")}
            </p>
          )}

          {status === "ready" && !group && (
            <div className="card text-center space-y-1.5">
              <Users className="w-6 h-6 text-ink-600 mx-auto" />
              <p className="text-sm font-bold text-ink-900">Kamu belum masuk kelompok</p>
              <p className="text-xs text-ink-600">Minta gurumu memasukkanmu ke kelompok supaya bisa mengerjakan kartu.</p>
            </div>
          )}

          {status === "error" && (
            <div className="card text-center space-y-2">
              <p className="text-sm text-ink-600">Kartu misi belum bisa dimuat.</p>
              <button type="button" onClick={load} className="btn-ghost text-xs px-4 py-1.5">Coba Lagi</button>
            </div>
          )}

          {status === "loading" && <p className="text-center text-sm text-ink-600 py-6">Memuat kartu misi...</p>}

          {status === "ready" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INVESTIGATION_CARDS.map((card, index) => {
                const isDone = completed.includes(card.pot);
                const isNext = group !== null && index === completed.length;
                return (
                  <Link
                    key={card.pot}
                    href={`/misi/pot/${card.pot.toLowerCase()}`}
                    className={`block rounded-3xl overflow-hidden bg-white border-3 border-white shadow-card transition-transform hover:-translate-y-0.5 ${
                      !isDone && !isNext ? "opacity-70" : ""
                    }`}
                  >
                    <div className="p-3.5 text-white" style={{ backgroundColor: card.color }}>
                      <p className="font-heading font-extrabold text-[10px] tracking-wider text-yellow-200">
                        KARTU INVESTIGASI #{card.number} | {card.code}
                      </p>
                      <h4 className="font-heading font-extrabold text-sm sm:text-base leading-snug mt-0.5">
                        Misi Pot {card.pot}: {card.title}
                      </h4>
                    </div>
                    <div className="p-3.5 space-y-2">
                      <p className="text-xs text-ink-600 leading-relaxed">{card.focus}</p>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill text-[11px] font-heading font-extrabold ${
                          isDone
                            ? "bg-green-100 text-green-700"
                            : isNext
                              ? "bg-yellow-300/60 text-brown-600"
                              : "bg-[#EAEFE6] text-ink-600"
                        }`}
                      >
                        {isDone && (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            {typeof reports[card.pot]?.nilai === "number" ? `Selesai · Nilai ${reports[card.pot]?.nilai}` : "Selesai"}
                          </>
                        )}
                        {!isDone && isNext && <>Kerjakan sekarang (+{STARS_PER_POT} ⭐)</>}
                        {!isDone && !isNext && <><Lock className="w-3 h-3" /> Terkunci</>}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
