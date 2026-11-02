"use client";
import Link from "next/link";
import { Mission } from "@/lib/types";
import { Calendar, ChevronRight, Target, Lightbulb, ListChecks, Wrench, FileCheck, CheckCircle2 } from "lucide-react";

interface MissionCardProps {
  mission: Mission;
  href: string;
  compact?: boolean;
}

function formatDeadline(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function MissionCard({ mission, href, compact = false }: MissionCardProps) {
  if (compact) {
    return (
      <Link href={href} className="card card-hover block group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-ink group-hover:text-[var(--accent)] transition-colors duration-150 leading-snug">
              {mission.title}
            </h3>
            <p className="text-xs text-ink-muted mt-1 line-clamp-2">{mission.objective}</p>
            {mission.deadline && (
              <div className="flex items-center gap-1 mt-2">
                <Calendar className="h-3 w-3 text-ink-muted" strokeWidth={1.75} />
                <span className="text-[10px] text-ink-muted">Tenggat: {formatDeadline(mission.deadline)}</span>
              </div>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-ink-muted group-hover:text-[var(--accent)] flex-shrink-0 mt-1 transition-colors duration-150" />
        </div>
      </Link>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-xl font-extrabold text-ink leading-tight">{mission.title}</h2>
          {mission.deadline && (
            <span className="flex items-center gap-1 text-xs text-[#8A5A00] bg-[#FFF4D6] rounded-full px-2.5 py-1 flex-shrink-0">
              <Calendar className="h-3 w-3" strokeWidth={2} />
              {formatDeadline(mission.deadline)}
            </span>
          )}
        </div>

        <Section icon={<Target />} title="Tujuan">
          <p className="text-sm text-ink-muted">{mission.objective}</p>
        </Section>

        <Section icon={<Lightbulb />} title="Pertanyaan Pemantik">
          <p className="text-sm italic text-ink-muted">"{mission.triggerQuestion}"</p>
        </Section>
      </div>

      {/* Steps */}
      <div className="card">
        <Section icon={<ListChecks />} title="Langkah Kerja">
          <ol className="space-y-2 mt-2">
            {mission.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink-muted">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-[var(--accent)] text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Section>
      </div>

      {/* Tools & Evidence */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <Section icon={<Wrench />} title="Alat & Bahan">
            <ul className="mt-2 space-y-1">
              {mission.tools.map((tool, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-ink-muted">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                  {tool}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="card">
          <Section icon={<FileCheck />} title="Bukti yang Diperlukan">
            <ul className="mt-2 space-y-1">
              {mission.evidenceRequired.map((e, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-ink-muted">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                  {e}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      {/* Criteria */}
      <div className="card">
        <Section icon={<CheckCircle2 />} title="Kriteria Selesai">
          <ul className="mt-2 space-y-1">
            {mission.completionCriteria.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-ink-muted">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)] flex-shrink-0" strokeWidth={2} />
                {c}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* CTA */}
      <div className="pb-4">
        <Link href={`${href}/kerjakan`} className="btn-primary w-full text-center">
          Kerjakan Misi
        </Link>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[var(--accent)] [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        <h4 className="text-sm font-bold text-ink">{title}</h4>
      </div>
      {children}
    </div>
  );
}
