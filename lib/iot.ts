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
    online: { text: "text-siswa-600", bg: "bg-siswa-100", dot: "bg-siswa-600" },
    data_terakhir: { text: "text-[#8A5A00]", bg: "bg-[#FFF4D6]", dot: "bg-[#8A5A00]" },
    offline: { text: "text-gray-500", bg: "bg-[#EEF0F2]", dot: "bg-gray-400" },
    tidak_valid: { text: "text-[#B42318]", bg: "bg-[#FDECEA]", dot: "bg-[#B42318]" },
    simulasi: { text: "text-[#6941C6]", bg: "bg-[#F1EBFF]", dot: "bg-[#6941C6]" },
  };
  return map[status] ?? { text: "text-gray-500", bg: "bg-gray-100", dot: "bg-gray-400" };
}

export function getTaskStatusColors(status: string): { text: string; bg: string; dot: string } {
  const map: Record<string, { text: string; bg: string; dot: string }> = {
    draf: { text: "text-gray-500", bg: "bg-[#EEF0F2]", dot: "bg-gray-400" },
    terkirim: { text: "text-guru-600", bg: "bg-guru-100", dot: "bg-guru-600" },
    perlu_revisi: { text: "text-[#8A5A00]", bg: "bg-[#FFF4D6]", dot: "bg-[#8A5A00]" },
    dinilai: { text: "text-siswa-600", bg: "bg-siswa-100", dot: "bg-siswa-600" },
    terbit: { text: "text-siswa-600", bg: "bg-siswa-100", dot: "bg-siswa-600" },
    diarsipkan: { text: "text-gray-500", bg: "bg-[#EEF0F2]", dot: "bg-gray-400" },
  };
  return map[status] ?? { text: "text-gray-500", bg: "bg-gray-100", dot: "bg-gray-400" };
}

export function formatTimeAgo(isoString: string): string {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 60) return `${diffSec} detik lalu`;
  if (diffMin < 60) return `${diffMin} menit lalu`;
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
