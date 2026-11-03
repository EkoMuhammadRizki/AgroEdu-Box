"use client";
import Link from "next/link";
import { Module } from "@/lib/types";
import { Clock, ChevronRight, Check } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

interface ModuleCardProps {
  module: Module;
  progress?: number; // 0-100
  completed?: boolean;
  href: string;
}

export function ModuleCard({ module, progress = 0, completed = false, href }: ModuleCardProps) {
  return (
    <Link href={href} className="card card-hover block group p-5 bg-white border-3 border-white">
      {/* Topic chip */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="inline-block text-[11px] font-heading font-extrabold uppercase tracking-wider text-green-700 bg-green-100 rounded-pill px-3 py-1 border border-green-200">
          {module.topic}
        </span>
        {completed && (
          <span className="inline-flex items-center gap-1 text-[11px] font-heading font-extrabold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> Selesai
          </span>
        )}
      </div>

      <h3 className="font-heading font-extrabold text-base text-ink-900 group-hover:text-green-600 transition-colors leading-snug mb-1">
        {module.title}
      </h3>
      <p className="text-xs text-ink-600 leading-relaxed line-clamp-2 mb-4">
        {module.description}
      </p>

      {/* Progress bar */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-ink-600">Progres Belajar</span>
          <span className="text-[11px] font-heading font-extrabold text-green-700">{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-green-100 overflow-hidden border border-green-200">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-line">
        <span className="flex items-center gap-1.5 text-xs text-ink-600 font-bold">
          <Clock className="h-3.5 w-3.5 text-green-600" />
          {module.durationMin} menit
        </span>

        <span className="flex items-center gap-1 text-xs font-heading font-bold text-green-600 group-hover:translate-x-1 transition-transform">
          Buka Modul
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
