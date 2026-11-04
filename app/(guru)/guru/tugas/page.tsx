"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { GuruDataState } from "@/components/agro/guru-data-state";
import { GuruReportDetail } from "@/components/agro/guru-report-detail";
import { GuruGradeForm } from "@/components/agro/guru-grade-form";
import { useGuruData } from "@/lib/use-guru-data";
import { anggotaOf, kelompokOfKelas, laporanOf } from "@/lib/guru-data";
import { DAILY_POTS, type DailyPot } from "@/lib/daily-missions";
import { INVESTIGATION_CARDS } from "@/lib/investigation-cards";
import { Check, PenLine } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function GuruTugasPage() {
  const { data, failed, reload } = useGuruData();
  const [kelasId, setKelasId] = useState<string | null>(null);
  const [openKey, setOpenKey] = useState<{ kelompokId: string; pot: DailyPot } | null>(null);

  const activeKelas = kelasId ?? data?.kelas[0]?.id ?? "";
  const kelompok = data ? kelompokOfKelas(data, activeKelas).filter((k) => anggotaOf(data, k.id).length > 0) : [];
  const open = data?.laporan.find((l) => l.kelompokId === openKey?.kelompokId && l.pot === openKey?.pot);
  const perluDinilai = kelompok.flatMap((k) => (data ? laporanOf(data, k.id) : [])).filter((l) => l.nilai === null).length;

  return (
    <AppShell role="guru">
      <PageHeader
        title="Tugas & Kartu Misi"
        description="Pantau 4 Kartu Investigasi tiap kelompok dan baca laporan yang dikirim siswa."
      />

      <ContentWrapper className="space-y-4 pb-8">
        {!data && <GuruDataState failed={failed} reload={reload} />}

        {data && (
          <>
            <div className="flex gap-2">
              {data.kelas.map((kelas) => (
                <button
                  key={kelas.id}
                  type="button"
                  onClick={() => { setKelasId(kelas.id); setOpenKey(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    kelas.id === activeKelas ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "bg-surface border-line text-ink-muted"
                  }`}
                >
                  {kelas.nama}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {INVESTIGATION_CARDS.map((card) => {
                const done = kelompok.filter((k) => laporanOf(data, k.id).some((l) => l.pot === card.pot)).length;
                return (
                  <div key={card.pot} className="card">
                    <p className="text-xs font-bold" style={{ color: card.color }}>Kartu #{card.number} · Pot {card.pot}</p>
                    <p className="text-xl font-extrabold text-ink mt-1">{done}/{kelompok.length}</p>
                    <p className="text-[11px] text-ink-muted">Kelompok selesai</p>
                  </div>
                );
              })}
            </div>

            <section className="card space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-ink">Progres Kelompok</h2>
                {perluDinilai > 0 && (
                  <span className="text-xs font-bold text-amber-700">{perluDinilai} laporan perlu dinilai</span>
                )}
              </div>
              {kelompok.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  Belum ada kelompok berisi siswa di kelas ini.{" "}
                  <Link href={`/guru/kelas/${activeKelas}`} className="text-[var(--accent)] font-semibold hover:underline">
                    Bentuk kelompok
                  </Link>
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-line text-ink-muted font-semibold">
                        <th className="py-2 pr-3">Kelompok</th>
                        {DAILY_POTS.map((pot) => <th key={pot} className="py-2 px-2 text-center">Pot {pot}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/60">
                      {kelompok.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 pr-3">
                            <p className="font-bold text-ink">{item.nama}</p>
                            <p className="text-[11px] text-ink-muted">{anggotaOf(data, item.id).length} siswa</p>
                          </td>
                          {DAILY_POTS.map((pot) => {
                            const report = laporanOf(data, item.id).find((l) => l.pot === pot);
                            return (
                              <td key={pot} className="py-2 px-2 text-center">
                                {report ? (
                                  <button
                                    type="button"
                                    onClick={() => setOpenKey({ kelompokId: report.kelompokId, pot: report.pot })}
                                    aria-label={`Baca laporan ${item.nama} Pot ${pot}`}
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border font-semibold ${
                                      report.nilai === null
                                        ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    }`}
                                  >
                                    {report.nilai === null ? <PenLine className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                                    {report.nilai === null ? "Nilai" : report.nilai}
                                  </button>
                                ) : (
                                  <span className="text-ink-muted">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {open && (
              <section className="card space-y-2">
                <p className="text-xs font-bold text-ink-muted">
                  {data.kelompok.find((k) => k.id === open.kelompokId)?.nama}
                </p>
                <GuruReportDetail item={open} />
                <GuruGradeForm key={`${open.kelompokId}-${open.pot}`} item={open} onSaved={reload} />
              </section>
            )}
          </>
        )}
      </ContentWrapper>
    </AppShell>
  );
}
