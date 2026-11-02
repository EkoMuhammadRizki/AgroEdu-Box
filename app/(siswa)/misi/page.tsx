import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { MissionCard } from "@/components/agro/mission-card";
import { mockMissions, mockSubmissions } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Misi & Tugas" };

export default function MisiPage() {
  return (
    <AppShell role="siswa">
      <PageHeader
        title="Misi & Tugas"
        description="Selesaikan misi untuk membuktikan pemahamanmu."
      />

      <ContentWrapper className="space-y-4 pb-8">
        {/* Summary row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Misi", value: mockMissions.length },
            { label: "Terkirim", value: mockSubmissions.length },
            { label: "Perlu Revisi", value: 0 },
          ].map((item) => (
            <div key={item.label} className="card text-center">
              <p className="text-2xl font-extrabold text-[var(--accent)] tabular-nums">{item.value}</p>
              <p className="text-xs text-ink-muted mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Mission list */}
        <div className="space-y-3">
          {mockMissions.map((mission) => {
            const sub = mockSubmissions.find((s) => s.missionId === mission.id);
            return (
              <div key={mission.id} className="relative">
                <MissionCard mission={mission} href={`/misi/${mission.id}`} compact />
                {sub && (
                  <div className="absolute top-3 right-10">
                    <StatusBadge status={sub.status} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
