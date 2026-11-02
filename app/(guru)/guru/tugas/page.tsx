"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockMissions, mockSubmissions, mockClasses } from "@/lib/mock-data";
import { ClipboardCheck, Plus, Clock, Users, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function GuruTugasPage() {
  return (
    <AppShell role="guru">
      <PageHeader
        title="Kelola Tugas & Kartu Misi"
        description="Pantau Kartu Misi Digital siswa, kelola tenggat waktu, dan lakukan penilaian berbasis rubrik."
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* Ringkasan Status Tugas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Misi Aktif</p>
            <p className="text-2xl font-extrabold text-ink mt-1">{mockMissions.length}</p>
            <p className="text-[11px] text-ink-muted mt-1">Semester berjalan</p>
          </div>

          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Terkumpul</p>
            <p className="text-2xl font-extrabold text-ink mt-1">19</p>
            <p className="text-[11px] text-ink-muted mt-1">Dari total 78 siswa</p>
          </div>

          <div className="card bg-amber-50/50 border-amber-200">
            <p className="text-[11px] uppercase tracking-wider font-bold text-amber-800">Perlu Dinilai Segera</p>
            <p className="text-2xl font-extrabold text-amber-900 mt-1">5 Laporan</p>
            <p className="text-[11px] text-amber-700 mt-1">Menunggu evaluasi rubrik</p>
          </div>

          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Sudah Dinilai</p>
            <p className="text-2xl font-extrabold text-guru-700 mt-1">14</p>
            <p className="text-[11px] text-ink-muted mt-1">Umpan balik terkirim</p>
          </div>
        </div>

        {/* Daftar Misi */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted">
            Daftar Kartu Misi Digital Aktif
          </h2>

          {mockMissions.map((misi) => {
            const submissionsCount = mockSubmissions.filter((s) => s.missionId === misi.id).length;
            const targetClasses = misi.classIds
              .map((cid) => mockClasses.find((c) => c.id === cid)?.name || cid)
              .join(", ");

            return (
              <div key={misi.id} className="card hover:border-[var(--accent)] transition-all duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge bg-guru-100 text-guru-700 border border-guru-200 text-xs font-semibold">
                        Misi Sains & IoT
                      </span>
                      <span className="text-xs text-ink-muted">
                        Kelas: <strong className="text-ink">{targetClasses}</strong>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-ink">{misi.title}</h3>
                    <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                      {misi.objective}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-ink-muted pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Tenggat: {misi.deadline ? new Date(misi.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-amber-700">
                        <AlertCircle className="h-3.5 w-3.5" />
                        5 Menunggu Penilaian
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2 flex-shrink-0">
                    <Link
                      href={`/guru/tugas/${misi.id}/penilaian`}
                      className="btn-primary text-xs gap-1.5 inline-flex items-center justify-center py-2 px-4"
                    >
                      Buka Lembar Penilaian
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <Link
                      href={`/misi/${misi.id}`}
                      target="_blank"
                      className="btn-secondary text-xs text-center py-1.5"
                    >
                      Lihat Kartu Misi Siswa
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
