"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockDevices, mockSensorHistory } from "@/lib/mock-data";
import { SensorChart } from "@/components/agro/sensor-chart";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatTimestamp } from "@/lib/iot";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import {
  Thermometer, Droplets, Sun, Activity, Download,
  ArrowLeft, Info
} from "lucide-react";
import Link from "next/link";
import { showToast } from "@/lib/swal";

const SENSOR_META: Record<string, { name: string; unit: string; icon: React.ElementType; idealRange: string; desc: string; color: string }> = {
  "s1-temp": {
    name: "Suhu Udara",
    unit: "°C",
    icon: Thermometer,
    idealRange: "24.0°C – 28.5°C (Kangkung Vegetatif)",
    desc: "Mengukur temperatur lingkungan mikro di kanopi daun tanaman dengan sensor DHT22 terkalibrasi.",
    color: "#F59A3B",
  },
  "s1-hum": {
    name: "Kelembapan Udara",
    unit: "%",
    icon: Droplets,
    idealRange: "55% – 70% RH",
    desc: "Tingkat uap air di sekitar kanopi. Kelembapan seimbang mencegah serangan spora jamur daun.",
    color: "#3FA7E0",
  },
  "s1-soil": {
    name: "Kelembapan Media (A0)",
    unit: "%",
    icon: Activity,
    idealRange: "40% – 65% (Kapasitas Lapang)",
    desc: "Kadar air substrat perakaran. Sensor resistif analog yang membaca konduktivitas larutan nutrisi.",
    color: "#3F9B2E",
  },
  "s1-light": {
    name: "Intensitas Cahaya",
    unit: "lux",
    icon: Sun,
    idealRange: "2.500 – 4.500 lux",
    desc: "Intensitas foton cahaya yang diserap klorofil untuk laju fotosintesis optimal tanaman.",
    color: "#FFB81C",
  },
};

export default function SensorDetailPage() {
  const params = useParams();
  const sensorId = (params?.sensorId as string) || "s1-temp";
  const [selectedRange, setSelectedRange] = useState<"1h" | "6h" | "24h" | "7d">("24h");
  const [isExporting, setIsExporting] = useState(false);

  const device = mockDevices[0];
  const currentSensor = device.sensors.find((s) => s.sensorId === sensorId);
  const meta = SENSOR_META[sensorId] || {
    name: currentSensor?.sensorType || "Sensor",
    unit: currentSensor?.unit || "",
    icon: Activity,
    idealRange: "Sesuai karakteristik tanaman",
    desc: "Pembacaan telemetri modul sensor terpasang pada box agrikultur.",
    color: "#3F9B2E",
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
        description={`${device.name} · Waktu Pembacaan: ${formatTimestamp(device.lastDataAt)}`}
        action={
          <Link href="/lab-iot" className="btn-ghost text-xs gap-1.5 inline-flex items-center">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Lab
          </Link>
        }
      />

      <ContentWrapper className="space-y-6 pb-10">
        {/* Navigasi Cepat Antar Sensor */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {device.sensors.map((s) => {
            const isCurrent = s.sensorId === sensorId;
            const sm = SENSOR_META[s.sensorId];
            return (
              <Link
                key={s.sensorId}
                href={`/lab-iot/${s.sensorId}`}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-pill text-xs font-heading font-bold border-2 transition-all ${
                  isCurrent
                    ? "bg-green-500 text-white border-green-600 shadow-btn"
                    : "bg-white border-green-200 text-ink-600 hover:border-green-400"
                }`}
              >
                <span>{sm?.name || s.sensorType}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isCurrent ? "bg-white/25 text-white" : "bg-green-100 text-green-800"}`}>
                  {s.value} {s.unit}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Ringkasan Nilai & Statistik */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="card text-center p-3 sm:p-4">
            <p className="text-[9px] sm:text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink-600 truncate">Nilai Saat Ini</p>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl sm:text-3xl font-heading font-extrabold tabular-nums text-green-700">
                {currentSensor?.value ?? "-"}
              </span>
              <span className="text-xs font-bold text-ink-600">{meta.unit}</span>
            </div>
            <div className="mt-2 flex justify-center">
              <StatusBadge status={device.status} />
            </div>
          </div>

          <div className="card text-center p-3 sm:p-4">
            <p className="text-[9px] sm:text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink-600 truncate">Rata-Rata ({selectedRange})</p>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl sm:text-3xl font-heading font-extrabold tabular-nums text-ink-900">{avgVal}</span>
              <span className="text-xs font-bold text-ink-600">{meta.unit}</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-ink-600 mt-2 truncate">Dari data valid</p>
          </div>

          <div className="card text-center p-3 sm:p-4">
            <p className="text-[9px] sm:text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink-600 truncate">Minimum</p>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl sm:text-3xl font-heading font-extrabold tabular-nums text-blue-500">{minVal}</span>
              <span className="text-xs font-bold text-ink-600">{meta.unit}</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-ink-600 mt-2 truncate">Nilai terendah</p>
          </div>

          <div className="card text-center p-3 sm:p-4">
            <p className="text-[9px] sm:text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink-600 truncate">Maksimum</p>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl sm:text-3xl font-heading font-extrabold tabular-nums text-orange-500">{maxVal}</span>
              <span className="text-xs font-bold text-ink-600">{meta.unit}</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-ink-600 mt-2 truncate">Nilai tertinggi</p>
          </div>
        </div>

        {/* Panel Grafik Historis */}
        <div className="card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
            <div>
              <h2 className="font-heading font-extrabold text-base md:text-lg text-ink-900">
                Grafik Tren Pembacaan: {meta.name}
              </h2>
              <p className="text-xs text-ink-600 mt-0.5">
                Ambang batas target: <strong className="text-green-700">{meta.idealRange}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-green-100 p-1 rounded-pill border border-green-200">
                {(["1h", "6h", "24h", "7d"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRange(r)}
                    className={`px-3 py-1 text-xs font-heading font-bold rounded-pill transition-all ${
                      selectedRange === r
                        ? "bg-white shadow-xs text-green-700"
                        : "text-ink-600 hover:text-ink-900"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="btn-ghost text-xs gap-1.5 inline-flex items-center border border-green-300 py-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                {isExporting ? "Menyiapkan..." : "Unduh CSV"}
              </button>
            </div>
          </div>

          <SensorChart
            data={historyPoints}
            unit={meta.unit}
            color={meta.color}
            label={`Histori ${meta.name} (${selectedRange})`}
          />

          <div className="p-3.5 rounded-2xl bg-cream-50 border-2 border-yellow-300 flex items-start gap-3">
            <Info className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-brown-600 leading-relaxed">
              <strong>Pedoman Sains IoT:</strong> {meta.desc} Hubungkan tren grafik dengan waktu penyinaran matahari atau sirkulasi nutrisi.
            </p>
          </div>
        </div>

        {/* Tabel Log Telemetri */}
        <div className="card space-y-3">
          <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-2 flex items-center justify-between">
            <span>LOG PEMBACAAN TELEMETRI TERBARU</span>
            <span className="text-[10px] font-bold text-green-700">{historyPoints.length} titik data</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-line text-ink-600 uppercase tracking-wider font-heading font-bold">
                  <th className="py-2.5 px-3">Waktu (WIB)</th>
                  <th className="py-2.5 px-3">Nilai Sensor</th>
                  <th className="py-2.5 px-3">Satuan</th>
                  <th className="py-2.5 px-3">Validitas Data</th>
                  <th className="py-2.5 px-3">Perangkat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {historyPoints.slice(-10).reverse().map((pt, idx) => (
                  <tr key={idx} className="hover:bg-green-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-ink-900">{pt.time}</td>
                    <td className="py-2.5 px-3 font-mono font-extrabold text-green-700">
                      {pt.value !== null ? pt.value : <span className="text-red-500 italic">Data Hilang</span>}
                    </td>
                    <td className="py-2.5 px-3 text-ink-600">{meta.unit}</td>
                    <td className="py-2.5 px-3">
                      {pt.value !== null ? (
                        <span className="inline-flex items-center gap-1 text-green-700 font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                          Valid (ESP32)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          Offline
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-ink-600">
                      Box 1 (WiFi Terhubung)
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
