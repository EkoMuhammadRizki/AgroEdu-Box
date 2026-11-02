"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockDevices, mockSensorHistory } from "@/lib/mock-data";
import { SensorChart } from "@/components/agro/sensor-chart";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatTimestamp } from "@/lib/iot";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Thermometer, Droplets, Sun, Activity, Download,
  ArrowLeft, Calendar, Info, RefreshCw, Filter
} from "lucide-react";
import Link from "next/link";
import { showToast } from "@/lib/swal";

const SENSOR_META: Record<string, { name: string; unit: string; icon: React.ElementType; idealRange: string; desc: string }> = {
  "s1-temp": {
    name: "Suhu Udara",
    unit: "°C",
    icon: Thermometer,
    idealRange: "24.0°C – 28.0°C (Kangkung fase vegetatif)",
    desc: "Mengukur temperatur lingkungan mikro di sekitar kanopi daun tanaman dengan sensor DHT22 terkalibrasi.",
  },
  "s1-hum": {
    name: "Kelembapan Udara",
    unit: "%",
    icon: Droplets,
    idealRange: "60% – 70% RH",
    desc: "Tingkat uap air di udara sekitar kanopi. Kelembapan tinggi tanpa sirkulasi dapat memicu timbulnya jamur.",
  },
  "s1-soil": {
    name: "Kelembapan Media",
    unit: "%",
    icon: Activity,
    idealRange: "40% – 60% (Kapasitas lapang media tanam)",
    desc: "Kadar kelembapan substrat perakaran. Sensor resistif/kapasitif yang dikalibrasi sesuai porositas media.",
  },
  "s1-light": {
    name: "Intensitas Cahaya",
    unit: "lux",
    icon: Sun,
    idealRange: "2.500 – 4.500 lux (Pertumbuhan daun optimal)",
    desc: "Intensitas foton cahaya yang diterima kanopi untuk fotosintesis harian tanaman.",
  },
};

export default function SensorDetailPage() {
  const params = useParams();
  const sensorId = (params?.sensorId as string) || "s1-temp";
  const [selectedRange, setSelectedRange] = useState<"1h" | "6h" | "24h" | "7d">("24h");
  const [isExporting, setIsExporting] = useState(false);

  const device = mockDevices[0]; // Box 1 - Kangkung
  const currentSensor = device.sensors.find((s) => s.sensorId === sensorId);
  const meta = SENSOR_META[sensorId] || {
    name: currentSensor?.sensorType || "Sensor",
    unit: currentSensor?.unit || "",
    icon: Activity,
    idealRange: "Sesuai karakteristik tanaman",
    desc: "Pembacaan telemetri dari modul sensor terpasang pada box agrikultur.",
  };

  const historyPoints = (mockSensorHistory as Record<string, { time: string; value: number | null }[]>)[sensorId] || [];
  const validPoints = historyPoints.filter((p) => p.value !== null).map((p) => p.value as number);

  const minVal = validPoints.length ? Math.min(...validPoints).toFixed(1) : "-";
  const maxVal = validPoints.length ? Math.max(...validPoints).toFixed(1) : "-";
  const avgVal = validPoints.length
    ? (validPoints.reduce((a, b) => a + b, 0) / validPoints.length).toFixed(1)
    : "-";

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvRows = [
        "Waktu,Nilai,Satuan,Perangkat,Status",
        ...historyPoints.map((p) => `${p.time},${p.value ?? ""},${meta.unit},${device.name},valid`),
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `telemetri_${sensorId}_${selectedRange}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
      showToast(`Data telemetri ${meta.name} (${selectedRange}) berhasil diunduh!`, "success", 1600);
    }, 400);
  };

  return (
    <AppShell role="siswa">
      <PageHeader
        title={`Detail ${meta.name}`}
        description={`${device.name} · Waktu Pembacaan Terakhir: ${formatTimestamp(device.lastDataAt)}`}
        action={
          <Link href="/lab-iot" className="btn-secondary text-xs gap-1.5 inline-flex items-center">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Lab
          </Link>
        }
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* Navigasi Cepat Antar Sensor */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {device.sensors.map((s) => {
            const isCurrent = s.sensorId === sensorId;
            const sm = SENSOR_META[s.sensorId];
            return (
              <Link
                key={s.sensorId}
                href={`/lab-iot/${s.sensorId}`}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                  isCurrent
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                    : "bg-surface border-line text-ink-muted hover:border-[var(--accent)] hover:text-ink"
                }`}
              >
                <span>{sm?.name || s.sensorType}</span>
                <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${isCurrent ? "bg-white/20 text-white" : "bg-surface-muted text-ink"}`}>
                  {s.value} {s.unit}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Ringkasan Nilai Saat Ini & Statistik */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card bg-surface-muted/60 border-line">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Nilai Saat Ini</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono text-ink">
                {currentSensor?.value ?? "-"}
              </span>
              <span className="text-sm font-semibold text-ink-muted">{meta.unit}</span>
            </div>
            <div className="mt-2">
              <StatusBadge status={device.status} />
            </div>
          </div>

          <div className="card bg-surface-muted/60 border-line">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Rata-Rata ({selectedRange})</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono text-ink">{avgVal}</span>
              <span className="text-sm font-semibold text-ink-muted">{meta.unit}</span>
            </div>
            <p className="text-[11px] text-ink-muted mt-2">Dihitung dari data valid</p>
          </div>

          <div className="card bg-surface-muted/60 border-line">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Minimum</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono text-ink text-sky-600">{minVal}</span>
              <span className="text-sm font-semibold text-ink-muted">{meta.unit}</span>
            </div>
            <p className="text-[11px] text-ink-muted mt-2">Nilai terendah terekam</p>
          </div>

          <div className="card bg-surface-muted/60 border-line">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Maksimum</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono text-ink text-amber-600">{maxVal}</span>
              <span className="text-sm font-semibold text-ink-muted">{meta.unit}</span>
            </div>
            <p className="text-[11px] text-ink-muted mt-2">Nilai tertinggi terekam</p>
          </div>
        </div>

        {/* Panel Grafik Historis */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-line">
            <div>
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <span>Grafik Tren Pembacaan Sensor</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Ambang optimal target: <strong className="text-ink">{meta.idealRange}</strong>
              </p>
            </div>

            {/* Filter Rentang & Ekspor */}
            <div className="flex items-center gap-2">
              <div className="flex bg-surface-muted p-1 rounded-xl border border-line">
                {(["1h", "6h", "24h", "7d"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRange(r)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      selectedRange === r
                        ? "bg-surface shadow-xs text-ink"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExport}
                disabled={isExporting}
                className="btn-secondary text-xs gap-1.5 inline-flex items-center"
              >
                <Download className="h-3.5 w-3.5" />
                {isExporting ? "Menyiapkan..." : "Unduh CSV"}
              </button>
            </div>
          </div>

          {/* Grafik Canvas */}
          <div className="pt-2">
            <SensorChart
              data={historyPoints}
              unit={meta.unit}
              color="var(--accent)"
              label={`Histori ${meta.name} (24 Jam)`}
            />
          </div>

          {/* Catatan Ilmiah / Konteks Pembelajaran */}
          <div className="mt-5 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-3">
            <Info className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed space-y-1">
              <p className="font-semibold">Pedoman Interpretasi Ilmiah:</p>
              <p>
                {meta.desc} Ambang batas sensor tidak bersifat mutlak universal; perlu selalu dievaluasi bersamaan dengan
                pengamatan fisik daun, batang, dan kelembapan perakaran pada tanaman target.
              </p>
            </div>
          </div>
        </div>

        {/* Tabel Log Pembacaan Terakhir */}
        <div className="card">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center justify-between">
            <span>LOG PEMBACAAN TELEMETRI TERBARU</span>
            <span className="text-[10px] font-normal lowercase">{historyPoints.length} titik data</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-line text-ink-muted uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Waktu (WIB)</th>
                  <th className="py-2.5 px-3">Nilai Sensor</th>
                  <th className="py-2.5 px-3">Satuan</th>
                  <th className="py-2.5 px-3">Validitas</th>
                  <th className="py-2.5 px-3">Status Jaringan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {historyPoints.slice(-10).reverse().map((pt, idx) => (
                  <tr key={idx} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-ink font-medium">{pt.time}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-ink">
                      {pt.value !== null ? pt.value : <span className="text-rose-500 italic">Data Hilang</span>}
                    </td>
                    <td className="py-2.5 px-3 text-ink-muted">{meta.unit}</td>
                    <td className="py-2.5 px-3">
                      {pt.value !== null ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                          Putus
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-ink-muted">ESP32-Box1 (WiFi Ok)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
