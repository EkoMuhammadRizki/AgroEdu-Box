"use client";
import { IotStatus, TaskStatus, ContentStatus } from "@/lib/types";
import { getStatusColors, getTaskStatusColors, formatStatusLabel } from "@/lib/iot";

type BadgeStatus = IotStatus | TaskStatus | ContentStatus;

const TASK_STATUS_LABELS: Record<string, string> = {
  draf: "Draf",
  terkirim: "Terkirim",
  perlu_revisi: "Perlu Revisi",
  dinilai: "Dinilai",
  terbit: "Terbit",
  diarsipkan: "Diarsipkan",
};

const IOT_STATUSES: IotStatus[] = ["online", "data_terakhir", "offline", "tidak_valid", "simulasi"];

interface StatusBadgeProps {
  status: BadgeStatus;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, showDot = true, className = "" }: StatusBadgeProps) {
  const isIot = IOT_STATUSES.includes(status as IotStatus);
  const colors = isIot
    ? getStatusColors(status as IotStatus)
    : getTaskStatusColors(status);
  const label = isIot
    ? formatStatusLabel(status as IotStatus)
    : (TASK_STATUS_LABELS[status] ?? status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.text} ${colors.bg} ${className}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${colors.dot} ${status === "online" ? "dot-pulse" : ""}`}
        />
      )}
      {label}
    </span>
  );
}
