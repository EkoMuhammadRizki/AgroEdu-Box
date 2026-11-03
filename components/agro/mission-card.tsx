"use client";
import Link from "next/link";
import { Mission } from "@/lib/types";
import {
  Calendar, ChevronRight, Target, Lightbulb, ListChecks,
  Wrench, FileCheck, CheckCircle2, Droplets, ArrowRight, Sparkles
} from "lucide-react";
import { BibooMascot } from "./biboo-mascot";

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
      <Link href={href} className="card card-hover block group p-3.5 sm:p-5 bg-white border-3 border-white">
        <div className="flex items-start justify-between gap-2.5 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-green-700">
                Kartu Misi Digital
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-base text-ink-900 group-hover:text-green-600 transition-colors leading-snug">
              {mission.title}
            </h3>
            <p className="text-xs text-ink-600 mt-1 line-clamp-2 leading-relaxed">{mission.objective}</p>
            {mission.deadline && (
              <div className="flex items-center gap-1.5 mt-2.5">
                <Calendar className="h-3.5 w-3.5 text-yellow-600" />
                <span className="text-xs font-bold text-brown-600">Tenggat: {formatDeadline(mission.deadline)}</span>
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 group-hover:bg-green-500 group-hover:text-white transition-all flex-shrink-0 mt-1">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="card-cream space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-heading font-extrabold">
              KARTU MISI RESMI
            </span>
            <span className="text-xs font-bold text-ink-600">Kode: {mission.id.toUpperCase()}</span>
          </div>
          {mission.deadline && (
            <span className="flex items-center gap-1.5 text-xs font-heading font-extrabold text-brown-600 bg-yellow-300/60 rounded-full px-3 py-1">
              <Calendar className="h-3.5 w-3.5 text-yellow-600" />
              Tenggat: {formatDeadline(mission.deadline)}
            </span>
          )}
        </div>

        <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-ink-900 leading-tight">
          {mission.title}
        </h1>

        <Section icon={<Target />} title="Tujuan Eksperimen">
          <p className="text-xs md:text-sm text-ink-600 leading-relaxed font-medium">{mission.objective}</p>
        </Section>

        <Section icon={<Lightbulb />} title="Pertanyaan Pemantik">
          <p className="text-xs md:text-sm italic text-brown-600 font-semibold bg-white p-3 rounded-2xl border border-yellow-300">
            "{mission.triggerQuestion}"
          </p>
        </Section>
      </div>

      {/* Steps */}
      <div className="card">
        <Section icon={<ListChecks />} title="Langkah Kerja Eksperimen">
          <ol className="space-y-2.5 mt-3">
            {mission.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-xs md:text-sm text-ink-900">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-xs font-heading font-extrabold mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      {/* Tools & Evidence */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <Section icon={<Wrench />} title="Alat & Bahan Praktikum">
            <ul className="mt-2.5 space-y-2">
              {mission.tools.map((tool, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs md:text-sm text-ink-900">
                  <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                  <span>{tool}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="card">
          <Section icon={<FileCheck />} title="Bukti yang Wajib Dikumpulkan">
            <ul className="mt-2.5 space-y-2">
              {mission.evidenceRequired.map((e, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs md:text-sm text-ink-900">
                  <span className="h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      {/* Criteria */}
      <div className="card">
        <Section icon={<CheckCircle2 />} title="Kriteria Penilaian Guru (Rubrik Sukses)">
          <ul className="mt-2.5 space-y-2">
            {mission.completionCriteria.map((c, i) => (
              <li key={i} className="flex items-center gap-2.5 text-xs md:text-sm text-ink-900">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* CTA (DESIGN 2.md Section 5.9 Tombol bertumpuk) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <Link
          href="/lab-iot"
          className="btn-info text-center inline-flex items-center justify-center gap-2"
        >
          <Droplets className="w-4 h-4" />
          Cek Data Sensor di Lab IoT
        </Link>
        <Link
          href={`${href}/kerjakan`}
          className="btn-primary text-center inline-flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Kerjakan & Kumpulkan Misi Ini
        </Link>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-green-600 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        <h3 className="font-heading font-extrabold text-sm md:text-base text-ink-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
