"use client";
import { ActivityItem } from "@/lib/types";
import { formatTimeAgo } from "@/lib/iot";
import { BookOpen, ClipboardCheck, Activity, MessageCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

const TYPE_CONFIG = {
  materi: { icon: BookOpen, label: "Materi", color: "text-green-600 bg-green-100", href: "/materi" },
  tugas: { icon: ClipboardCheck, label: "Tugas/Misi", color: "text-blue-500 bg-blue-100", href: "/misi" },
  data: { icon: Activity, label: "Data IoT", color: "text-yellow-600 bg-yellow-100", href: "/lab-iot" },
  umpan_balik: { icon: MessageCircle, label: "Umpan Balik", color: "text-brown-600 bg-cream-50", href: "/profil" },
};

interface ActivityListProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export function ActivityList({ activities, maxItems = 5 }: ActivityListProps) {
  const displayed = activities.slice(0, maxItems);

  if (displayed.length === 0) {
    return (
      <p className="text-xs text-ink-600 py-3 text-center">Belum ada aktivitas terbaru.</p>
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
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl border border-green-200 mt-0.5 ${config.color} shadow-xs`}>
                <Icon className="h-4 w-4" strokeWidth={2} />
              </div>
              {!isLast && <div className="flex-1 w-0.5 bg-green-200 mt-1 mb-1 min-h-[18px]" />}
            </div>

            {/* Content Link */}
            <Link
              href={config.href}
              className="pb-3.5 flex-1 min-w-0 block hover:translate-x-0.5 transition-transform"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs md:text-sm font-heading font-bold text-ink-900 group-hover:text-green-600 transition-colors">
                    {item.title}
                  </p>
                  {item.detail && (
                    <p className="text-xs text-ink-600 mt-0.5 leading-relaxed">{item.detail}</p>
                  )}
                  <p className="text-[10px] text-ink-600 font-medium mt-1">{formatTimeAgo(item.time)}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
