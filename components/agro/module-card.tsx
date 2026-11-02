"use client";
import Link from "next/link";
import { Module } from "@/lib/types";
import { Clock, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

interface ModuleCardProps {
  module: Module;
  progress?: number; // 0-100
  completed?: boolean;
  href: string;
}

export function ModuleCard({ module, progress = 0, completed = false, href }: ModuleCardProps) {
  return (
    <Link href={href} className="card card-hover block group">
      {/* Topic chip */}
      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] bg-accent-soft rounded-full px-2.5 py-0.5 mb-3">
        {module.topic}
      </span>

      <h3 className="text-sm font-bold text-ink group-hover:text-[var(--accent)] transition-colors duration-150 leading-snug mb-1">
        {module.title}
      </h3>
      <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 mb-3">
        {module.description}
      </p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-ink-muted">Progress</span>
          <span className="text-[10px] font-semibold text-ink-muted">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-ink-muted">
            <Clock className="h-3 w-3" strokeWidth={1.75} />
            {module.durationMin} mnt
          </span>
          <StatusBadge status={completed ? "dinilai" : "draf"} showDot={false} />
        </div>
        <ChevronRight className="h-4 w-4 text-ink-muted group-hover:text-[var(--accent)] transition-colors duration-150" />
      </div>
    </Link>
  );
}
