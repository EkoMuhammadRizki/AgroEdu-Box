"use client";
import { ReactNode } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { IotStatus } from "@/lib/types";
import { formatTimeAgo } from "@/lib/iot";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: IotStatus;
  updatedAt?: string;
  icon?: ReactNode;
  offline?: boolean;
}

export function StatCard({ label, value, unit, status, updatedAt, icon, offline }: StatCardProps) {
  const displayValue = offline ? "—" : value;

  return (
    <div className="card card-hover flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-muted">{label}</span>
        {icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-[var(--accent)]">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold tabular-nums ${offline ? "text-ink-muted" : "text-[var(--accent)]"}`}>
          {displayValue}
        </span>
        {!offline && unit && (
          <span className="text-sm font-medium text-ink-muted">{unit}</span>
        )}
      </div>

      {offline && (
        <p className="text-xs text-ink-muted">
          {updatedAt ? `Data terakhir: ${formatTimeAgo(updatedAt)}` : "Belum ada data dari perangkat."}
        </p>
      )}

      {!offline && (status || updatedAt) && (
        <div className="flex items-center gap-2 flex-wrap">
          {status && <StatusBadge status={status} />}
          {updatedAt && (
            <span className="text-xs text-ink-muted">diperbarui {formatTimeAgo(updatedAt)}</span>
          )}
        </div>
      )}
    </div>
  );
}

interface GuruStatCardProps {
  label: string;
  value: number;
  highlight?: boolean;
  icon?: ReactNode;
}

export function GuruStatCard({ label, value, highlight, icon }: GuruStatCardProps) {
  return (
    <div className={`card card-hover flex flex-col gap-2 ${highlight ? "border-[var(--accent)] bg-accent-soft" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-muted">{label}</span>
        {icon && (
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${highlight ? "bg-[var(--accent)] text-white" : "bg-surface-muted text-ink-muted"}`}>
            {icon}
          </span>
        )}
      </div>
      <span className={`text-3xl font-extrabold tabular-nums ${highlight ? "text-[var(--accent)]" : "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}
