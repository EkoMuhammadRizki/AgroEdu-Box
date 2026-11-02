"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockModules, mockClasses } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { BookOpen, Plus, Search, Edit3, Eye, Clock, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Module, ContentStatus } from "@/lib/types";

export default function GuruMateriPage() {
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"semua" | ContentStatus>("semua");

  const filtered = modules.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.topic.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "semua" || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AppShell role="guru">
      <PageHeader
        title="Kelola Materi Pembelajaran"
        description="Buat, perbarui, dan atur modul silabus pertanian hidroponik & IoT."
        action={
          <Link
            href="/guru/materi/baru/edit"
            className="btn-primary text-xs gap-1.5 inline-flex items-center"
          >
            <Plus className="h-4 w-4" />
            Buat Modul Baru
          </Link>
        }
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* Kontrol Pencarian & Filter Status */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              type="search"
              placeholder="Cari materi atau topik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>

          <div className="flex gap-1.5">
            {(["semua", "terbit", "draf", "diarsipkan"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                  filterStatus === st
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "bg-surface border-line text-ink-muted hover:text-ink"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel / Grid Modul Guru */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((mod) => (
            <div key={mod.id} className="card flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge bg-surface-muted text-ink-muted border border-line text-[11px] font-semibold">
                    {mod.topic}
                  </span>
                  <StatusBadge status={mod.status} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-ink leading-snug">{mod.title}</h3>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-ink-muted pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {mod.durationMin} Menit
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {mod.objectives.length} Tujuan Belajar
                  </span>
                  {mod.quizId && (
                    <span className="text-guru-700 font-semibold">
                      Ada Kuis
                    </span>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-surface-muted border border-line text-[11px] text-ink-muted">
                  Kelas Sasaran:{" "}
                  <strong className="text-ink">
                    {mod.classIds.map((cid) => mockClasses.find((c) => c.id === cid)?.name || cid).join(", ")}
                  </strong>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-line flex items-center justify-between">
                <Link
                  href={`/materi/${mod.slug}`}
                  target="_blank"
                  className="text-xs text-ink-muted hover:text-ink inline-flex items-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Pratinjau Siswa
                </Link>

                <Link
                  href={`/guru/materi/${mod.id}/edit`}
                  className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Modul
                </Link>
              </div>
            </div>
          ))}
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
