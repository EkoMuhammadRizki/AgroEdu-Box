"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { GuruDataState } from "@/components/agro/guru-data-state";
import { useGuruData } from "@/lib/use-guru-data";
import { laporanOf, ringkasanKelas, type GuruData } from "@/lib/guru-data";
import { showToast } from "@/lib/swal";
import { Download, Printer } from "lucide-react";

const csvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

function buildCsv(data: GuruData) {
  const rows = data.siswa.map((s) => {
    const kelas = data.kelas.find((k) => k.id === s.kelasId)?.nama ?? "";
    const kelompok = data.kelompok.find((k) => k.id === s.kelompokId)?.nama ?? "Belum ada";
    const laporan = s.kelompokId ? laporanOf(data, s.kelompokId) : [];
    const nilai = laporan.flatMap((l) => (l.nilai === null ? [] : [l.nilai]));
    const rataNilai = nilai.length ? Math.round(nilai.reduce((total, n) => total + n, 0) / nilai.length) : "";
    return [s.nama, kelas, kelompok, `${laporan.length}/4`, rataNilai, s.bintang].map(csvCell).join(",");
  });
  return ["Nama Siswa,Kelas,Kelompok,Kartu Selesai,Rata-Rata Nilai Kelompok,Bintang", ...rows].join("\n");
}

export default function GuruLaporanPage() {
  const { data, failed, reload } = useGuruData();

  const handleDownload = () => {
    if (!data) return;
    // BOM agar Excel membaca nama siswa dengan benar.
    const blob = new Blob(["﻿", buildCsv(data)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan_agro_edu_box.csv";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Laporan CSV berhasil diunduh!", "success", 1600);
  };

  return (
    <AppShell role="guru">
      <PageHeader
        title="Laporan Kelas"
        description="Ringkasan kelompok, Kartu Misi, dan bintang setiap kelas."
        action={
          <div className="flex gap-2">
            <button type="button" onClick={() => window.print()} className="btn-secondary text-xs gap-1.5 inline-flex items-center">
              <Printer className="h-3.5 w-3.5" />
              Cetak
            </button>
            <button type="button" disabled={!data} onClick={handleDownload} className="btn-primary text-xs gap-1.5 inline-flex items-center">
              <Download className="h-3.5 w-3.5" />
              Ekspor CSV
            </button>
          </div>
        }
      />

      <ContentWrapper className="space-y-4 pb-10">
        {!data && <GuruDataState failed={failed} reload={reload} />}

        {data?.kelas.map((kelas) => {
          const info = ringkasanKelas(data, kelas.id);
          const siswa = data.siswa.filter((s) => s.kelasId === kelas.id);
          const rataBintang = siswa.length ? Math.round(siswa.reduce((total, s) => total + s.bintang, 0) / siswa.length) : 0;
          const targetLaporan = info.jumlahKelompok * 4;
          return (
            <section key={kelas.id} className="card space-y-3">
              <h2 className="text-sm font-bold text-ink">{kelas.nama}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-surface-muted">
                  <p className="text-xl font-extrabold text-ink">{info.jumlahSiswa}</p>
                  <p className="text-[11px] text-ink-muted">Siswa</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-muted">
                  <p className="text-xl font-extrabold text-ink">{info.jumlahKelompok}</p>
                  <p className="text-[11px] text-ink-muted">Kelompok</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-muted">
                  <p className="text-xl font-extrabold text-ink">{info.laporanMasuk}/{targetLaporan}</p>
                  <p className="text-[11px] text-ink-muted">Laporan Masuk</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-muted">
                  <p className="text-xl font-extrabold text-ink">{rataBintang}</p>
                  <p className="text-[11px] text-ink-muted">Rata-Rata Bintang</p>
                </div>
              </div>
              {info.belumBerkelompok > 0 && (
                <p className="text-xs font-semibold text-amber-700">{info.belumBerkelompok} siswa belum punya kelompok.</p>
              )}
            </section>
          );
        })}
      </ContentWrapper>
    </AppShell>
  );
}
