"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { GuruDataState } from "@/components/agro/guru-data-state";
import { useGuruData } from "@/lib/use-guru-data";
import { ringkasanKelas } from "@/lib/guru-data";
import { AlertTriangle, BookOpen, ChevronRight, ClipboardCheck, Users } from "lucide-react";
import Link from "next/link";

export default function GuruKelasPage() {
  const { data, failed, reload } = useGuruData();

  return (
    <AppShell role="guru">
      <PageHeader
        title="Kelola Kelas"
        description="Pilih kelas untuk membentuk kelompok dan memantau Kartu Misi siswa."
      />

      <ContentWrapper className="space-y-4 pb-8">
        {!data && <GuruDataState failed={failed} reload={reload} />}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.kelas.map((kelas) => {
              const info = ringkasanKelas(data, kelas.id);
              return (
                <Link key={kelas.id} href={`/guru/kelas/${kelas.id}`} className="card block space-y-3 hover:border-[var(--accent)] transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-guru-100 text-guru-700">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-ink flex-1">{kelas.nama}</h3>
                    <ChevronRight className="h-4 w-4 text-ink-muted" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-ink-muted">
                    <div>
                      <Users className="h-3.5 w-3.5 mx-auto mb-0.5" />
                      <span className="block text-sm font-bold text-ink">{info.jumlahSiswa}</span>
                      Siswa
                    </div>
                    <div>
                      <Users className="h-3.5 w-3.5 mx-auto mb-0.5" />
                      <span className="block text-sm font-bold text-ink">{info.jumlahKelompok}</span>
                      Kelompok
                    </div>
                    <div>
                      <ClipboardCheck className="h-3.5 w-3.5 mx-auto mb-0.5" />
                      <span className="block text-sm font-bold text-ink">{info.laporanMasuk}</span>
                      Laporan
                    </div>
                  </div>

                  {info.belumBerkelompok > 0 ? (
                    <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                      {info.belumBerkelompok} siswa belum punya kelompok, jadi belum bisa mengerjakan Kartu Misi.
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-emerald-700">Semua siswa sudah punya kelompok.</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </ContentWrapper>
    </AppShell>
  );
}
