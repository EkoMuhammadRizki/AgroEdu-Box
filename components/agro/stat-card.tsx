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
  colorScheme?: "green" | "blue" | "orange" | "yellow";
}

export function StatCard({
  label,
  value,
  unit,
  status,
  updatedAt,
  icon,
  offline,
  colorScheme = "green",
}: StatCardProps) {
  const displayValue = offline ? "—" : value;

  const bgStyles = {
    green: "bg-green-100/60 border-green-200 text-green-700",
    blue: "bg-blue-200/50 border-blue-200 text-blue-500",
    orange: "bg-orange-400/15 border-orange-400/30 text-orange-400",
    yellow: "bg-yellow-300/30 border-yellow-300/50 text-yellow-500",
  };

  return (
    <div className="card card-hover flex flex-col justify-between gap-2.5 p-3.5 sm:p-5">
      <div className="flex items-center justify-between gap-1.5">
        <span className="text-[11px] sm:text-xs font-heading font-bold text-ink-600 truncate">{label}</span>
        {icon && (
          <span className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-xl sm:rounded-2xl border flex-shrink-0 ${bgStyles[colorScheme]}`}>
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1 my-0.5">
        <span className={`text-2xl sm:text-3xl font-heading font-extrabold tabular-nums ${offline ? "text-ink-300" : "text-ink-900"}`}>
          {displayValue}
        </span>
        {!offline && unit && (
          <span className="text-xs sm:text-sm font-heading font-bold text-ink-600">{unit}</span>
        )}
      </div>

      {offline ? (
        <p className="text-[10px] sm:text-[11px] text-ink-600 truncate">
          {updatedAt ? `Terakhir: ${formatTimeAgo(updatedAt)}` : "Belum ada data sensor."}
        </p>
      ) : (
        <div className="flex items-center justify-between gap-1.5 flex-wrap pt-1 border-t border-line/60">
          {status && <StatusBadge status={status} />}
          {updatedAt && (
            <span className="text-[9px] sm:text-[10px] text-ink-600 font-medium truncate">{formatTimeAgo(updatedAt)}</span>
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
    <div className={`card card-hover flex flex-col gap-2 p-3.5 sm:p-5 ${highlight ? "bg-green-100 border-green-400" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-heading font-bold text-ink-600">{label}</span>
        {icon && (
          <span className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl sm:rounded-2xl ${highlight ? "bg-green-500 text-white" : "bg-green-100 text-green-700"}`}>
            {icon}
          </span>
        )}
      </div>
      <span className={`text-2xl sm:text-3xl font-heading font-extrabold tabular-nums ${highlight ? "text-green-700" : "text-ink-900"}`}>
        {value}
      </span>
    </div>
  );
}
