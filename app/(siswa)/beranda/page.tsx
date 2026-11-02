import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { StatCard } from "@/components/agro/stat-card";
import { ActivityList } from "@/components/agro/activity-list";
import { ModuleCard } from "@/components/agro/module-card";
import { MissionCard } from "@/components/agro/mission-card";
import {
  mockDevices, mockModules, mockMissions, mockActivities, currentStudent,
} from "@/lib/mock-data";
import { Thermometer, Droplets, Sprout, Sun, Leaf } from "lucide-react";
import { formatTimestamp } from "@/lib/iot";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Beranda Siswa" };

const SENSOR_ICONS: Record<string, React.ReactNode> = {
  air_temp: <Thermometer className="h-4 w-4" strokeWidth={1.75} />,
  air_humidity: <Droplets className="h-4 w-4" strokeWidth={1.75} />,
  soil_moisture: <Sprout className="h-4 w-4" strokeWidth={1.75} />,
  light: <Sun className="h-4 w-4" strokeWidth={1.75} />,
};

const SENSOR_LABEL: Record<string, string> = {
  air_temp: "Suhu Udara",
  air_humidity: "Kelembapan Udara",
  soil_moisture: "Kelembapan Tanah",
  light: "Intensitas Cahaya",
};

export default function BerandaSiswaPage() {
  const device = mockDevices[0]; // Box 1 – Kangkung (online)
  const isOffline = device.status === "offline";

  return (
    <AppShell role="siswa">
      <PageHeader
        title={`Halo, ${currentStudent.name.split(" ")[0]}! 👋`}
        description={`${currentStudent.classCode} · ${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}`}
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* ── Kartu Sensor ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-ink">Data Sensor — {device.name}</h2>
              <span className="text-[10px] text-ink-muted">
                {isOffline ? "Tidak ada data" : `Diperbarui ${formatTimestamp(device.lastDataAt)}`}
              </span>
            </div>
            <Link href="/lab-iot" className="text-xs text-[var(--accent)] font-semibold hover:underline">
              Buka Lab IoT →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {device.sensors.length > 0
              ? device.sensors.map((sensor) => (
                  <Link
                    key={sensor.sensorId}
                    href={`/lab-iot/${sensor.sensorId}`}
                    className="block group transition-transform active:scale-[0.98]"
                    title={`Lihat grafik detail ${SENSOR_LABEL[sensor.sensorType]}`}
                  >
                    <StatCard
                      label={SENSOR_LABEL[sensor.sensorType] ?? sensor.sensorType}
                      value={sensor.value}
                      unit={sensor.unit}
                      status={sensor.connectionStatus}
                      updatedAt={sensor.measuredAt}
                      icon={SENSOR_ICONS[sensor.sensorType]}
                      offline={!sensor.valid}
                    />
                  </Link>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <Link key={i} href="/lab-iot" className="block">
                    <StatCard
                      label={Object.values(SENSOR_LABEL)[i]}
                      value="—"
                      offline
                      icon={Object.values(SENSOR_ICONS)[i]}
                    />
                  </Link>
                ))}
          </div>
        </section>

        {/* ── Tanaman + Aktivitas ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* PlantCard */}
          <div className="card">
            <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center justify-between">
              <span>TANAMAN AKTIF</span>
              <Link href="/lab-iot" className="text-[10px] font-normal normal-case hover:underline">
                Lihat di Lab →
              </Link>
            </div>
            <Link href="/lab-iot" className="flex items-center gap-4 group cursor-pointer">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-siswa-100 group-hover:bg-siswa-200 transition-colors">
                <Leaf className="h-8 w-8 text-siswa-600" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink text-base group-hover:text-[var(--accent)] transition-colors">{device.name}</p>
                <p className="text-xs text-ink-muted mt-0.5">Eksperimen aktif · {device.status === "online" ? "Perangkat terhubung" : "Perangkat terputus"}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-ink-muted">Minggu ke-3</span>
                  <span className="text-xs text-[var(--accent)] font-medium">Fase pertumbuhan vegetatif</span>
                </div>
              </div>
            </Link>
            <div className="mt-4 pt-4 border-t border-line grid grid-cols-3 gap-2 text-center">
              <Link href="/materi" className="p-2 rounded-xl hover:bg-surface-muted transition-colors group block">
                <p className="text-lg font-bold text-[var(--accent)] tabular-nums group-hover:scale-105 transition-transform">3</p>
                <p className="text-[10px] text-ink-muted">Modul selesai →</p>
              </Link>
              <Link href="/misi" className="p-2 rounded-xl hover:bg-surface-muted transition-colors group block">
                <p className="text-lg font-bold text-[var(--accent)] tabular-nums group-hover:scale-105 transition-transform">1</p>
                <p className="text-[10px] text-ink-muted">Misi terkirim →</p>
              </Link>
              <Link href="/kuis" className="p-2 rounded-xl hover:bg-surface-muted transition-colors group block">
                <p className="text-lg font-bold text-[var(--accent)] tabular-nums group-hover:scale-105 transition-transform">80</p>
                <p className="text-[10px] text-ink-muted">Skor kuis →</p>
              </Link>
            </div>
          </div>

          {/* Aktivitas terbaru */}
          <div className="card">
            <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card">
              AKTIVITAS TERBARU
            </div>
            <ActivityList activities={mockActivities} maxItems={4} />
          </div>
        </div>

        {/* ── Materi terbaru ───────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-ink">Lanjutkan Belajar</h2>
            <a href="/materi" className="text-xs text-[var(--accent)] font-medium hover:underline">Lihat semua →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mockModules.filter((m) => m.status === "terbit").slice(0, 3).map((mod, i) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                href={`/materi/${mod.slug}`}
                progress={i === 0 ? 100 : i === 1 ? 100 : 30}
                completed={i < 2}
              />
            ))}
          </div>
        </section>

        {/* ── Misi aktif ───────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-ink">Misi Aktif</h2>
            <a href="/misi" className="text-xs text-[var(--accent)] font-medium hover:underline">Lihat semua →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                href={`/misi/${mission.id}`}
                compact
              />
            ))}
          </div>
        </section>
      </ContentWrapper>
    </AppShell>
  );
}
