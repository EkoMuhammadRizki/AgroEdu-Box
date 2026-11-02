"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { ModuleCard } from "@/components/agro/module-card";
import { mockModules } from "@/lib/mock-data";
import { Search, SlidersHorizontal, BookOpen, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { showToast } from "@/lib/swal";

const TOPICS = ["Semua", "Dasar-Dasar", "Nutrisi", "Teknologi", "Perlindungan"];

export default function MateriPage() {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Semua");
  const [filterCompletedOnly, setFilterCompletedOnly] = useState(false);

  const progressMap: Record<string, number> = { "mod-1": 100, "mod-2": 100, "mod-3": 30 };

  const filtered = mockModules.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.topic.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());

    const matchesTopic = selectedTopic === "Semua" || m.topic.toLowerCase().includes(selectedTopic.toLowerCase());
    const isCompleted = (progressMap[m.id] ?? 0) === 100;
    const matchesCompleted = !filterCompletedOnly || isCompleted;

    return matchesSearch && matchesTopic && matchesCompleted;
  });

  const completedCount = mockModules.filter((m) => (progressMap[m.id] ?? 0) === 100).length;

  return (
    <AppShell role="siswa">
      <PageHeader
        title="Materi Pembelajaran"
        description="Pelajari modul silabus agribisnis dan sains IoT yang telah disiapkan gurumu."
      />

      <ContentWrapper className="space-y-5 pb-8">
        {/* Search + Filter */}
        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" strokeWidth={1.75} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari modul atau konsep agrikultur..."
              className="input-field pl-9 text-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !filterCompletedOnly;
              setFilterCompletedOnly(next);
              showToast(next ? "Menampilkan modul yang sudah selesai" : "Menampilkan semua modul", "success", 1200);
            }}
            className={`btn-secondary gap-2 flex-shrink-0 text-xs cursor-pointer ${
              filterCompletedOnly ? "border-siswa-600 bg-siswa-100/60 text-siswa-700" : ""
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
            {filterCompletedOnly ? "Hanya Selesai ✓" : "Filter Status"}
          </button>
        </div>

        {/* Topic tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {TOPICS.map((topic) => {
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "bg-surface border border-line text-ink-muted hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs text-ink-muted flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-ink">{filtered.length}</strong> modul ditemukan
            </span>
            <span>·</span>
            <span>
              <strong className="text-siswa-600">{completedCount}</strong> selesai
            </span>
            <span>·</span>
            <span>
              <strong className="text-ink">{mockModules.length - completedCount}</strong> belum selesai
            </span>
          </div>

          {(search || selectedTopic !== "Semua" || filterCompletedOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedTopic("Semua");
                setFilterCompletedOnly(false);
              }}
              className="text-xs text-rose-600 hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Module grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                href={`/materi/${mod.slug}`}
                progress={progressMap[mod.id] ?? 0}
                completed={(progressMap[mod.id] ?? 0) === 100}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-10 space-y-2">
            <BookOpen className="h-8 w-8 text-ink-muted mx-auto" />
            <p className="text-sm font-bold text-ink">Tidak ada modul yang cocok</p>
            <p className="text-xs text-ink-muted">Coba ubah kata kunci pencarian atau ganti filter topik.</p>
          </div>
        )}
      </ContentWrapper>
    </AppShell>
  );
}
