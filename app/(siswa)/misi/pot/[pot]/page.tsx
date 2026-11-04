"use client";
import { notFound, useParams } from "next/navigation";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { InvestigationCardView } from "@/components/agro/investigation-card-view";
import { getInvestigationCard } from "@/lib/investigation-cards";

export default function KartuInvestigasiPage() {
  const params = useParams();
  const card = getInvestigationCard(String(params?.pot ?? ""));
  if (!card) notFound();

  return (
    <AppShell role="siswa">
      <PageHeader title={`Kartu Investigasi #${card.number}`} description={`Pot Tanaman ${card.pot}`} />
      <ContentWrapper className="pb-10">
        <InvestigationCardView key={card.pot} card={card} />
      </ContentWrapper>
    </AppShell>
  );
}
