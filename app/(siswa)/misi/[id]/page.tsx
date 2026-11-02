import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { MissionCard } from "@/components/agro/mission-card";
import { mockMissions } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const mission = mockMissions.find((m) => m.id === id);
  return { title: mission?.title ?? "Kartu Misi" };
}

export default async function MisiDetailPage({ params }: Props) {
  const { id } = await params;
  const mission = mockMissions.find((m) => m.id === id);
  if (!mission) notFound();

  return (
    <AppShell role="siswa">
      <PageHeader title="Kartu Misi Digital" />
      <ContentWrapper className="pb-8">
        <MissionCard mission={mission} href={`/misi/${id}`} />
      </ContentWrapper>
    </AppShell>
  );
}
