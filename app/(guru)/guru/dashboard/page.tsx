import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { GuruStatCard } from "@/components/agro/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActivityList } from "@/components/agro/activity-list";
import {
  mockGuruStats, mockDevices, mockClasses, mockActivities, mockSubmissions,
} from "@/lib/mock-data";
import { Users, BookOpen, ClipboardCheck, AlertCircle, Leaf, Cpu, ArrowRight } from "lucide-react";
import { formatTimestamp } from "@/lib/iot";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard Guru" };

export default function GuruDashboardPage() {
  return (
    <AppShell role="guru">
      <PageHeader
        title="Dashboard Guru"
        description={`AGRO EDU TRACK · ${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* ── Indikator Utama (Clickable) ─────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/guru/kelas" className="block group transition-transform active:scale-[0.98]">
            <GuruStatCard label="Total Siswa" value={mockGuruStats.totalSiswa} icon={<Users className="h-4 w-4" strokeWidth={1.75} />} />
          </Link>
          <Link href="/guru/kelas" className="block group transition-transform active:scale-[0.98]">
            <GuruStatCard label="Kelas Aktif" value={mockGuruStats.totalKelas} icon={<BookOpen className="h-4 w-4" strokeWidth={1.75} />} />
          </Link>
          <Link href="/guru/tugas" className="block group transition-transform active:scale-[0.98]">
            <GuruStatCard label="Misi Aktif" value={mockGuruStats.totalMisi} icon={<ClipboardCheck className="h-4 w-4" strokeWidth={1.75} />} />
          </Link>
          <Link href="/guru/tugas" className="block group transition-transform active:scale-[0.98]">
            <GuruStatCard label="Perlu Dinilai" value={mockGuruStats.perluDinilai} highlight icon={<AlertCircle className="h-4 w-4" strokeWidth={1.75} />} />
          </Link>
        </div>

        {/* ── Kelas + IoT ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Kelas */}
          <div className="card">
            <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center justify-between">
              <span>KELAS AKTIF</span>
              <Link href="/guru/kelas" className="text-[10px] font-normal normal-case hover:underline">
                Kelola Semua →
              </Link>
            </div>
            <div className="space-y-2">
              {mockClasses.map((cls) => (
                <Link
                  key={cls.id}
                  href={`/guru/kelas/${cls.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-muted hover:bg-guru-100/50 transition-colors duration-150 group cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink group-hover:text-guru-700 transition-colors">{cls.name}</p>
                    <p className="text-xs text-ink-muted mt-0.5">Kode: {cls.code} · {cls.studentCount} siswa</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="terbit" showDot={false} />
                    <ArrowRight className="h-3.5 w-3.5 text-ink-muted group-hover:text-guru-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/guru/kelas" className="block mt-3 text-xs text-center text-guru-600 font-semibold hover:underline">
              Buka menu kelola kelas →
            </Link>
          </div>

          {/* Status IoT (Clickable to /guru/iot) */}
          <div className="card">
            <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center justify-between">
              <span>STATUS PERANGKAT IoT</span>
              <Link href="/guru/iot" className="text-[10px] font-normal normal-case hover:underline">
                Pantau Detail →
              </Link>
            </div>
            <div className="space-y-2">
              {mockDevices.map((device) => (
                <Link
                  key={device.id}
                  href="/guru/iot"
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-muted hover:bg-guru-100/50 transition-colors duration-150 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface group-hover:bg-guru-100 transition-colors">
                      <Cpu className="h-3.5 w-3.5 text-ink-muted group-hover:text-guru-600" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink group-hover:text-guru-700 transition-colors">{device.name}</p>
                      <p className="text-xs text-ink-muted">
                        {device.status === "offline"
                          ? "Tidak ada data baru"
                          : `Data: ${formatTimestamp(device.lastDataAt)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={device.status} />
                    <ArrowRight className="h-3.5 w-3.5 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/guru/iot" className="block mt-3 text-xs text-center text-guru-600 font-semibold hover:underline">
              Pantau seluruh box & telemetri →
            </Link>
          </div>
        </div>

        {/* ── Perlu Dinilai ───────────────────────────────────────── */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center justify-between">
            <span>PERLU DINILAI SEGERA</span>
            <Link href="/guru/tugas" className="text-[10px] font-normal normal-case hover:underline">
              Semua Tugas →
            </Link>
          </div>
          {mockSubmissions.length > 0 ? (
            <div className="space-y-2">
              {mockSubmissions.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/guru/tugas/${sub.missionId}/penilaian`}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF4D6] border border-[#E5C566] hover:border-guru-600 hover:shadow-xs transition-all duration-150 group cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-bold text-ink group-hover:text-guru-700 transition-colors">
                      Laporan Misi: Detektif Tanaman Sehat
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Siswa: Andi Pratama (Kelas 10A) · Dikumpulkan: {sub.submittedAt ? formatTimestamp(sub.submittedAt) : "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={sub.status} />
                    <span className="btn-primary text-xs py-1.5 px-3 rounded-lg gap-1 inline-flex items-center">
                      Buka Rubrik
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-muted text-center py-4">Semua misi siswa telah dinilai.</p>
          )}
        </div>

        {/* ── Aktivitas Terbaru ───────────────────────────────────── */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card">
            AKTIVITAS TERBARU KELAS
          </div>
          <ActivityList activities={mockActivities} />
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
