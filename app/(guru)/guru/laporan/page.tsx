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
    return [s.nama, kelas, kelompok, `${laporan.length}/4`, rataNilai, s.kuis?.terbaik ?? "", s.kuis?.percobaan ?? 0, s.bintang].map(csvCell).join(",");
  });
  return ["Nama Siswa,Kelas,Kelompok,Kartu Selesai,Rata-Rata Nilai Kelompok,Nilai Kuis Terbaik,Percobaan Kuis,Bintang", ...rows].join("\n");
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
        description="Ringkasan kelompok, Kartu Misi, nilai Kuis Pintar, dan bintang setiap kelas."
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
          const sudahKuis = siswa.filter((s) => s.kuis);
          const rataKuis = sudahKuis.length ? Math.round(sudahKuis.reduce((total, s) => total + (s.kuis?.terbaik ?? 0), 0) / sudahKuis.length) : 0;
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

              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-ink">
                  Kuis Pintar: {sudahKuis.length} dari {siswa.length} siswa sudah mengerjakan
                  {sudahKuis.length > 0 && ` · rata-rata nilai terbaik ${rataKuis}`}
                </h3>
                <div className="overflow-x-auto rounded-xl border border-line">
                  <table className="w-full text-xs">
                    <thead className="bg-surface-muted text-ink-muted">
                      <tr>
                        <th className="text-left font-semibold px-3 py-2">Nama</th>
                        <th className="text-center font-semibold px-3 py-2">Terbaik</th>
                        <th className="text-center font-semibold px-3 py-2">Terakhir</th>
                        <th className="text-center font-semibold px-3 py-2">Percobaan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siswa.map((s) => (
                        <tr key={s.id} className="border-t border-line">
                          <td className="px-3 py-1.5 text-ink">{s.nama}</td>
                          <td className="px-3 py-1.5 text-center font-bold text-ink">{s.kuis ? s.kuis.terbaik : "-"}</td>
                          <td className="px-3 py-1.5 text-center text-ink">{s.kuis ? s.kuis.terakhir : "-"}</td>
                          <td className="px-3 py-1.5 text-center text-ink">{s.kuis ? s.kuis.percobaan : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          );
        })}
      </ContentWrapper>
    </AppShell>
  );
}
