"use client";
import { ActivityItem } from "@/lib/types";
import { formatTimeAgo } from "@/lib/iot";
import { BookOpen, ClipboardCheck, Activity, MessageCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

const TYPE_CONFIG = {
  materi: { icon: BookOpen, label: "Materi", color: "text-siswa-600", href: "/materi" },
  tugas: { icon: ClipboardCheck, label: "Tugas/Misi", color: "text-guru-600", href: "/misi" },
  data: { icon: Activity, label: "Data IoT", color: "text-[#8A5A00]", href: "/lab-iot" },
  umpan_balik: { icon: MessageCircle, label: "Umpan Balik", color: "text-[#6941C6]", href: "/profil" },
};

interface ActivityListProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export function ActivityList({ activities, maxItems = 5 }: ActivityListProps) {
  const displayed = activities.slice(0, maxItems);

  if (displayed.length === 0) {
    return (
      <p className="text-sm text-ink-muted py-4 text-center">Belum ada aktivitas terbaru.</p>
    );
  }

  return (
    <ul className="flex flex-col">
      {displayed.map((item, i) => {
        const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.materi;
        const Icon = config.icon;
        const isLast = i === displayed.length - 1;

        return (
          <li key={item.id} className="flex gap-3 group">
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-surface-muted mt-0.5 group-hover:bg-siswa-100 transition-colors">
                <Icon className={`h-3.5 w-3.5 ${config.color}`} strokeWidth={2} />
              </div>
              {!isLast && <div className="flex-1 w-px bg-line mt-1 mb-1 min-h-[16px]" />}
            </div>

            {/* Content Link */}
            <Link
              href={config.href}
              className="pb-4 flex-1 min-w-0 block hover:translate-x-0.5 transition-transform"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-ink font-medium leading-snug group-hover:text-[var(--accent)] transition-colors">
                    {item.title}
                  </p>
                  {item.detail && (
                    <p className="text-xs text-ink-muted mt-0.5">{item.detail}</p>
                  )}
                  <p className="text-[10px] text-ink-muted mt-1">{formatTimeAgo(item.time)}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
