"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { GuruStatCard } from "@/components/agro/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { GuruDataState } from "@/components/agro/guru-data-state";
import { mockDevices } from "@/lib/mock-data";
import { ringkasanKelas } from "@/lib/guru-data";
import { useGuruData } from "@/lib/use-guru-data";
import { AlertTriangle, ArrowRight, BookOpen, ClipboardCheck, Cpu, Users } from "lucide-react";
import { formatTimestamp } from "@/lib/iot";
import Link from "next/link";

export default function GuruDashboardPage() {
  const { data, failed, reload } = useGuruData();
  const kelasInfo = data?.kelas.map((kelas) => ({ kelas, info: ringkasanKelas(data, kelas.id) })) ?? [];
  const total = (key: "jumlahKelompok" | "belumBerkelompok") => kelasInfo.reduce((sum, item) => sum + item.info[key], 0);

  return (
    <AppShell role="guru">
      <PageHeader
        title="Dashboard Guru"
        description={`AGRO EDU TRACK · ${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
      />

      <ContentWrapper className="space-y-6 pb-8">
        {!data && <GuruDataState failed={failed} reload={reload} />}

        {data && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Link href="/guru/kelas" className="block group transition-transform active:scale-[0.98]">
                <GuruStatCard label="Total Siswa" value={data.siswa.length} icon={<Users className="h-4 w-4" strokeWidth={1.75} />} />
              </Link>
              <Link href="/guru/kelas" className="block group transition-transform active:scale-[0.98]">
                <GuruStatCard label="Kelas" value={data.kelas.length} icon={<BookOpen className="h-4 w-4" strokeWidth={1.75} />} />
              </Link>
              <Link href="/guru/kelas" className="block group transition-transform active:scale-[0.98]">
                <GuruStatCard label="Kelompok Aktif" value={total("jumlahKelompok")} icon={<Users className="h-4 w-4" strokeWidth={1.75} />} />
              </Link>
              <Link href="/guru/tugas" className="block group transition-transform active:scale-[0.98]">
                <GuruStatCard label="Perlu Dinilai" value={data.laporan.filter((l) => l.nilai === null).length} highlight icon={<ClipboardCheck className="h-4 w-4" strokeWidth={1.75} />} />
              </Link>
            </div>

            {total("belumBerkelompok") > 0 && (
              <div className="card border-amber-200 bg-amber-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm font-semibold text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  {total("belumBerkelompok")} siswa belum punya kelompok, jadi belum bisa mengerjakan Kartu Misi.
                </p>
                <Link href="/guru/kelas" className="btn-primary text-xs gap-1.5 inline-flex items-center justify-center flex-shrink-0">
                  Bentuk Kelompok
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center justify-between">
              <span>KELAS</span>
              <Link href="/guru/kelas" className="text-[10px] font-normal normal-case hover:underline">
                Kelola Semua →
              </Link>
            </div>
            <div className="space-y-2">
              {kelasInfo.map(({ kelas, info }) => (
                <Link
                  key={kelas.id}
                  href={`/guru/kelas/${kelas.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-muted hover:bg-guru-100/50 transition-colors duration-150 group"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink group-hover:text-guru-700 transition-colors">{kelas.nama}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {info.jumlahSiswa} siswa · {info.jumlahKelompok} kelompok · {info.laporanMasuk} laporan
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-ink-muted" />
                </Link>
              ))}
            </div>
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

        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center justify-between">
            <span>LAPORAN KARTU MISI TERBARU</span>
            <Link href="/guru/tugas" className="text-[10px] font-normal normal-case hover:underline">
              Semua Laporan →
            </Link>
          </div>
          {data && data.laporan.length === 0 && (
            <p className="text-xs text-ink-muted text-center py-4">Belum ada laporan dari siswa.</p>
          )}
          <div className="space-y-2">
            {data?.laporan.slice(0, 5).map((item) => {
              const kelompok = data.kelompok.find((k) => k.id === item.kelompokId);
              const kelas = data.kelas.find((k) => k.id === kelompok?.kelasId);
              return (
                <Link
                  key={`${item.kelompokId}-${item.pot}`}
                  href="/guru/tugas"
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-muted hover:bg-guru-100/50 transition-colors duration-150"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{kelompok?.nama} {kelas?.nama}: Pot {item.pot}</p>
                    <p className="text-xs text-ink-muted mt-0.5 truncate">
                      Dikirim {item.pengirim ?? "-"} · {formatTimestamp(item.selesaiAt)} · {item.nilai === null ? "Perlu dinilai" : `Nilai ${item.nilai}`}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-ink-muted flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
