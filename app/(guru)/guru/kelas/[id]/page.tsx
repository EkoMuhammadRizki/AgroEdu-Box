"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockClasses, mockStudents, mockDevices, mockModules } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Users, BookOpen, Award, ArrowLeft, Search, Filter,
  ChevronRight, CheckCircle2, AlertTriangle, Cpu, Mail
} from "lucide-react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useState } from "react";

export default function GuruDetailKelasPage() {
  const params = useParams();
  const classId = (params?.id as string) || "kelas-1";

  const cls = mockClasses.find((c) => c.id === classId) || mockClasses[0];
  const [search, setSearch] = useState("");
  const [filterProgress, setFilterProgress] = useState<"semua" | "lengkap" | "perlu_dukungan">("semua");

  // Mock student stats inside this class
  const classStudents = [
    { id: "siswa-1", name: "Andi Pratama", modulesCompleted: 3, totalModules: 4, missionsSubmitted: 2, quizAvg: 88, status: "aktif" },
    { id: "siswa-2", name: "Budi Santoso", modulesCompleted: 2, totalModules: 4, missionsSubmitted: 1, quizAvg: 75, status: "aktif" },
    { id: "siswa-3", name: "Citra Dewi", modulesCompleted: 4, totalModules: 4, missionsSubmitted: 2, quizAvg: 95, status: "aktif" },
    { id: "siswa-5", name: "Fajar Nugraha", modulesCompleted: 1, totalModules: 4, missionsSubmitted: 0, quizAvg: 60, status: "perlu_perhatian" },
    { id: "siswa-6", name: "Gita Permata", modulesCompleted: 3, totalModules: 4, missionsSubmitted: 2, quizAvg: 84, status: "aktif" },
  ];

  const filteredStudents = classStudents.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    if (filterProgress === "lengkap") return matchSearch && s.modulesCompleted === s.totalModules;
    if (filterProgress === "perlu_dukungan") return matchSearch && s.quizAvg < 70;
    return matchSearch;
  });

  const associatedDevices = mockDevices.filter((d) => d.classId === classId || d.classId === "kelas-1");

  return (
    <AppShell role="guru">
      <PageHeader
        title={cls.name}
        description={`Kode Kelas: ${cls.code} · ${classStudents.length} Siswa Aktif`}
        action={
          <Link href="/guru/kelas" className="btn-secondary text-xs gap-1.5 inline-flex items-center">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Daftar Kelas
          </Link>
        }
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* Ringkasan Kelas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Total Siswa</p>
            <p className="text-2xl font-extrabold text-ink mt-1">{cls.studentCount}</p>
            <p className="text-[11px] text-ink-muted mt-1">Siswa terdaftar</p>
          </div>

          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Rata-Rata Kuis</p>
            <p className="text-2xl font-extrabold text-guru-700 mt-1">80.4</p>
            <p className="text-[11px] text-emerald-700 mt-1">↑ +4% dari modul lalu</p>
          </div>

          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Penyelesaian Modul</p>
            <p className="text-2xl font-extrabold text-ink mt-1">72%</p>
            <p className="text-[11px] text-ink-muted mt-1">3 dari 4 modul diajarkan</p>
          </div>

          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Perangkat IoT Terhubung</p>
            <p className="text-2xl font-extrabold text-ink mt-1">{associatedDevices.length} Box</p>
            <p className="text-[11px] text-ink-muted mt-1">Box 1, Box 2</p>
          </div>
        </div>

        {/* Perangkat IoT Kelas */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5" />
              PERANGKAT AGRO EDU BOX KELAS INI
            </span>
            <Link href="/guru/iot" className="text-[11px] text-[var(--accent)] font-medium hover:underline">
              Kelola IoT →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {associatedDevices.map((dev) => (
              <div key={dev.id} className="p-3 rounded-xl bg-surface-muted border border-line flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-ink">{dev.name}</h4>
                  <p className="text-[11px] text-ink-muted">4 sensor aktif · Kangkung</p>
                </div>
                <StatusBadge status={dev.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Tabel Siswa & Progres */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>DAFTAR SISWA & PROGRES BELAJAR</span>
            <span className="text-[11px] font-normal lowercase">{filteredStudents.length} siswa ditampilkan</span>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
              <input
                type="search"
                placeholder="Cari nama siswa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-8 text-xs py-1.5"
              />
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={() => setFilterProgress("semua")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  filterProgress === "semua"
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "bg-surface border-line text-ink-muted"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterProgress("perlu_dukungan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  filterProgress === "perlu_dukungan"
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-surface border-line text-ink-muted"
                }`}
              >
                Perlu Dukungan
              </button>
            </div>
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-line text-ink-muted uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Modul Selesai</th>
                  <th className="py-2.5 px-3">Misi Terkumpul</th>
                  <th className="py-2.5 px-3">Rata-Rata Kuis</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {filteredStudents.map((s) => {
                  const pct = Math.round((s.modulesCompleted / s.totalModules) * 100);
                  return (
                    <tr key={s.id} className="hover:bg-surface-muted/50 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-bold text-ink">{s.name}</p>
                        <p className="text-[10px] text-ink-muted font-mono">NIS: 2026-{s.id.replace("siswa-", "00")}</p>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-line rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[var(--accent)] h-full rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="font-mono text-ink-muted text-[11px]">{s.modulesCompleted}/{s.totalModules}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-ink">
                        {s.missionsSubmitted} Misi
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-mono font-bold ${s.quizAvg < 70 ? "text-amber-600" : "text-ink"}`}>
                          {s.quizAvg}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {s.status === "perlu_perhatian" ? (
                          <span className="badge bg-amber-50 text-amber-700 border border-amber-200 text-[10px] inline-flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Perlu Bimbingan
                          </span>
                        ) : (
                          <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Baik
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/guru/kelas/${cls.id}/siswa/${s.id}`}
                          className="btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          Lihat Detail
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
