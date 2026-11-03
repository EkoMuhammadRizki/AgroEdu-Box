// lib/iot.ts
import { IotStatus } from "./types";

export function formatStatusLabel(status: IotStatus): string {
  const map: Record<IotStatus, string> = {
    online: "Online",
    data_terakhir: "Data Terakhir",
    offline: "Offline",
    tidak_valid: "Data Tidak Valid",
    simulasi: "Simulasi",
  };
  return map[status] ?? status;
}

export function getStatusColors(status: IotStatus): {
  text: string;
  bg: string;
  dot: string;
} {
  const map: Record<IotStatus, { text: string; bg: string; dot: string }> = {
    online: { text: "text-green-700 font-bold", bg: "bg-green-100 border border-green-300", dot: "bg-green-500" },
    data_terakhir: { text: "text-brown-600 font-bold", bg: "bg-cream-50 border border-yellow-300", dot: "bg-yellow-500" },
    offline: { text: "text-ink-600 font-semibold", bg: "bg-[#EAEFE6] border border-ink-300/40", dot: "bg-ink-300" },
    tidak_valid: { text: "text-red-500 font-bold", bg: "bg-[#FEECEB] border border-red-200", dot: "bg-red-500" },
    simulasi: { text: "text-blue-500 font-bold", bg: "bg-blue-200/50 border border-blue-300", dot: "bg-blue-500" },
  };
  return map[status] ?? { text: "text-ink-600", bg: "bg-green-100", dot: "bg-ink-300" };
}

export function getTaskStatusColors(status: string): { text: string; bg: string; dot: string } {
  const map: Record<string, { text: string; bg: string; dot: string }> = {
    draf: { text: "text-ink-600 font-semibold", bg: "bg-green-50 border border-green-200", dot: "bg-ink-300" },
    terkirim: { text: "text-blue-500 font-bold", bg: "bg-blue-200/40 border border-blue-300", dot: "bg-blue-500" },
    perlu_revisi: { text: "text-brown-600 font-bold", bg: "bg-cream-50 border border-yellow-300", dot: "bg-yellow-500" },
    dinilai: { text: "text-green-700 font-bold", bg: "bg-green-100 border border-green-300", dot: "bg-green-500" },
    terbit: { text: "text-green-700 font-bold", bg: "bg-green-100 border border-green-300", dot: "bg-green-500" },
    diarsipkan: { text: "text-ink-600", bg: "bg-gray-100 border border-gray-200", dot: "bg-gray-400" },
  };
  return map[status] ?? { text: "text-ink-600", bg: "bg-gray-100", dot: "bg-gray-400" };
}

export function formatTimeAgo(isoString: string): string {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 60) return `${diffSec} dtk lalu`;
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  return then.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function formatTimestamp(isoString: string): string {
  return new Date(isoString).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSensorLabel(type: string): string {
  const map: Record<string, string> = {
    air_temp: "Suhu Udara",
    air_humidity: "Kelembapan Udara",
    soil_moisture: "Kelembapan Tanah",
    light: "Intensitas Cahaya",
  };
  return map[type] ?? type;
}

export function getSensorIcon(type: string): string {
  const map: Record<string, string> = {
    air_temp: "Thermometer",
    air_humidity: "Droplets",
    soil_moisture: "Sprout",
    light: "Sun",
  };
  return map[type] ?? "Activity";
}
