"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { GuruDataState, PotProgress } from "@/components/agro/guru-data-state";
import { GuruReportDetail } from "@/components/agro/guru-report-detail";
import { useGuruData } from "@/lib/use-guru-data";
import { anggotaOf, laporanOf } from "@/lib/guru-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetailPerkembanganSiswaPage() {
  const params = useParams();
  const { data, failed, reload } = useGuruData();
  const siswa = data?.siswa.find((s) => s.id === params?.siswaId);
  const kelas = data?.kelas.find((k) => k.id === siswa?.kelasId);
  const kelompok = data?.kelompok.find((k) => k.id === siswa?.kelompokId);
  const laporan = data && kelompok ? laporanOf(data, kelompok.id) : [];

  return (
    <AppShell role="guru">
      <PageHeader
        title={siswa?.nama ?? "Detail Siswa"}
        description={kelas?.nama}
        action={
          <Link href={`/guru/kelas/${params?.id}`} className="btn-secondary text-xs gap-1.5 inline-flex items-center">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Kelas
          </Link>
        }
      />

      <ContentWrapper className="space-y-4 pb-8">
        {!data && <GuruDataState failed={failed} reload={reload} />}
        {data && !siswa && <p className="text-sm text-ink-muted text-center py-10">Siswa tidak ditemukan.</p>}

        {data && siswa && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="card">
                <p className="text-xl font-extrabold text-ink">{siswa.bintang}</p>
                <p className="text-[11px] text-ink-muted">Bintang</p>
              </div>
              <div className="card">
                <p className="text-xl font-extrabold text-ink">{laporan.length}/4</p>
                <p className="text-[11px] text-ink-muted">Kartu Selesai</p>
              </div>
              <div className="card">
                <p className="text-xl font-extrabold text-ink">{siswa.kuis ? siswa.kuis.terbaik : "-"}</p>
                <p className="text-[11px] text-ink-muted">
                  Nilai Kuis Terbaik{siswa.kuis ? ` (${siswa.kuis.percobaan}x coba)` : ""}
                </p>
              </div>
              <div className="card">
                <p className="text-sm font-extrabold text-ink leading-7">{kelompok?.nama ?? "Belum ada"}</p>
                <p className="text-[11px] text-ink-muted">Kelompok</p>
              </div>
            </div>

            {kelompok ? (
              <section className="card space-y-2">
                <h2 className="text-sm font-bold text-ink">Anggota {kelompok.nama}</h2>
                <PotProgress selesai={laporan.map((l) => l.pot)} />
                <p className="text-xs text-ink">{anggotaOf(data, kelompok.id).map((s) => s.nama).join(", ")}</p>
              </section>
            ) : (
              <p className="card text-sm text-amber-700 font-semibold">
                Siswa ini belum punya kelompok, jadi belum bisa mengerjakan Kartu Misi.
              </p>
            )}

            {laporan.map((item) => (
              <section key={item.pot} className="card">
                <GuruReportDetail item={item} />
              </section>
            ))}
          </>
        )}
      </ContentWrapper>
    </AppShell>
  );
}
