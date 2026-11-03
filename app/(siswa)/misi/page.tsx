"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { MissionCard } from "@/components/agro/mission-card";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { mockMissions, mockSubmissions } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { ClipboardCheck, Sparkles, Star, Award, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function MisiPage() {
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
        title="Kartu Misi & Tugas Digital"
        description="Selesaikan misi praktikum, lampirkan bukti pembacaan sensor, dan kumpulkan laporan ke guru."
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* Banner with BiBoo */}
        <div className="card-green flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 p-4 sm:p-6">
          <div className="space-y-1.5 sm:space-y-2 text-center md:text-left">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-pill bg-white text-green-700 text-[11px] sm:text-xs font-heading font-extrabold shadow-xs inline-flex items-center gap-1.5">
              <ClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" /> Tantangan Belajar Aktif
            </span>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-ink-900 leading-tight">
              Kumpulkan Bukti Ilmiah Tanamanmu! 🌿
            </h2>
            <p className="text-xs sm:text-sm text-ink-600 max-w-md leading-relaxed">
              Setiap misi melatihmu berpikir seperti ilmuwan: mengamati langsung kondisi daun dan media, mencatat data sensor fisik, lalu merumuskan kesimpulan logis.
            </p>
          </div>
          <div className="flex-shrink-0">
            <BibooMascot
              mood="watering"
              size="md"
              character={character}
              animated={true}
            />
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="card text-center p-2.5 sm:p-4">
            <p className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-green-600 tabular-nums">{mockMissions.length}</p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-1 truncate">Total Misi</p>
          </div>
          <div className="card text-center p-2.5 sm:p-4">
            <p className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-blue-500 tabular-nums">{mockSubmissions.length}</p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-1 truncate">Misi Terkirim</p>
          </div>
          <div className="card text-center p-2.5 sm:p-4">
            <p className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-yellow-500 tabular-nums">40 ⭐</p>
            <p className="text-[10px] sm:text-xs font-heading font-bold text-ink-600 mt-1 truncate">Bintang Diraih</p>
          </div>
        </div>

        {/* Mission List */}
        <div className="space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-ink-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" /> Daftar Kartu Misi Aktif
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockMissions.map((mission) => {
              const sub = mockSubmissions.find((s) => s.missionId === mission.id);
              return (
                <div key={mission.id} className="relative">
                  <MissionCard mission={mission} href={`/misi/${mission.id}`} compact />
                  {sub && (
                    <div className="absolute top-4 right-14">
                      <StatusBadge status={sub.status} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
