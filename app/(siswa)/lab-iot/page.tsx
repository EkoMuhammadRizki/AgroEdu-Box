"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { StatCard } from "@/components/agro/stat-card";
import { SensorChart } from "@/components/agro/sensor-chart";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockDevices, mockSensorHistory } from "@/lib/mock-data";
import {
  Thermometer, Droplets, Sprout, Sun, Cpu, ChevronRight,
  Save, Trash2, Copy, Sparkles, Clock, AlertTriangle, Radio
} from "lucide-react";
import { formatTimestamp } from "@/lib/iot";
import Link from "next/link";
import { useState, useEffect } from "react";
import { showSuccessAlert, showWarningAlert, showConfirmDialog, showToast } from "@/lib/swal";

const SENSOR_META: Record<string, { label: string; icon: React.ReactNode; color: string; scheme: "orange" | "blue" | "green" | "yellow" }> = {
  air_temp: { label: "Suhu Udara", icon: <Thermometer className="h-5 w-5" />, color: "#F59A3B", scheme: "orange" },
  soil_moisture: { label: "Kelembapan Tanah", icon: <Sprout className="h-5 w-5" />, color: "#3F9B2E", scheme: "green" },
  air_humidity: { label: "Kelembapan Udara", icon: <Droplets className="h-5 w-5" />, color: "#3FA7E0", scheme: "blue" },
  light: { label: "Intensitas Cahaya", icon: <Sun className="h-5 w-5" />, color: "#FFB81C", scheme: "yellow" },
};

interface ObservationNote {
  id: string;
  deviceName: string;
  content: string;
  timestamp: string;
}

const EXAMPLE_NOTE = "Pukul 09.30 WIB — Daun ke-4 mulai tumbuh hijau cerah, media cocopeat terasa lembap gembur. Suhu 28.4°C dan kelembapan 62% terpantau optimal untuk fase vegetatif.";

export default function LabIotPage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState(mockDevices[0].id);
  const [noteText, setNoteText] = useState("");
  const [savedNotes, setSavedNotes] = useState<ObservationNote[]>([
    {
      id: "note-1",
      deviceName: "Box 1 – Kangkung",
      content: "Pukul 08.00 WIB: Air nutrisi hidroponik bersirkulasi lancar. Sensor kelembapan tanah menunjukkan 45%, kondisi tanaman segar dan tegak.",
      timestamp: "Hari ini, 08:05 WIB",
    },
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("agro_lab_notes");
      if (stored) {
        setSavedNotes(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const device = mockDevices.find((d) => d.id === selectedDeviceId) || mockDevices[0];
  const isOffline = device.status === "offline" || device.sensors.length === 0;

  const handleSaveNote = async () => {
    if (!noteText.trim()) {
      await showWarningAlert(
        "Catatan Masih Kosong",
        "Silakan tulis hasil pengamatan tanaman terlebih dahulu sebelum menyimpan."
      );
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    const newNote: ObservationNote = {
      id: `note-${Date.now()}`,
      deviceName: device.name,
      content: noteText.trim(),
      timestamp: `Hari ini, ${formattedTime}`,
    };

    const updated = [newNote, ...savedNotes];
    setSavedNotes(updated);
    try {
      localStorage.setItem("agro_lab_notes", JSON.stringify(updated));
    } catch {
      // ignore
    }

    setNoteText("");
    await showSuccessAlert(
      "Catatan Berhasil Disimpan! 🌿",
      "Catatan pengamatanmu tersimpan dan siap disalin ke formulir Kartu Misi.",
      1600
    );
  };

  const handleDeleteNote = async (noteId: string) => {
    const confirm = await showConfirmDialog({
      title: "Hapus Catatan?",
      text: "Catatan pengamatan ini akan dihapus dari riwayat Lab IoT Anda.",
      icon: "warning",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      isDanger: true,
      role: "siswa",
    });

    if (confirm.isConfirmed) {
      const updated = savedNotes.filter((n) => n.id !== noteId);
      setSavedNotes(updated);
      try {
        localStorage.setItem("agro_lab_notes", JSON.stringify(updated));
      } catch {
        // ignore
      }
      await showToast("Catatan pengamatan dihapus.", "success", 1400);
    }
  };

  const handleCopyNote = async (content: string) => {
    await navigator.clipboard.writeText(content);
    await showToast("Catatan disalin ke clipboard! Siap ditempel di form Misi.", "success", 1800);
  };

  return (
    <AppShell role="siswa">
      <PageHeader
        title="Lab IoT Pertanian"
        description="Pantau telemetri mikrokontroler ESP32 dan catatan pengamatan lapangan."
      />

      <ContentWrapper className="space-y-6 pb-10">
        {/* Device Selector Segment */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {mockDevices.map((d) => {
            const isSelected = d.id === selectedDeviceId;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDeviceId(d.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 rounded-pill px-5 py-2.5 border-2 font-heading font-bold text-xs md:text-sm transition-all cursor-pointer ${
                  isSelected
                    ? "bg-green-500 text-white border-green-600 shadow-btn"
                    : "bg-white border-green-200 text-ink-600 hover:border-green-400"
                }`}
              >
                <Cpu className="h-4 w-4" />
                {d.name}
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    d.status === "online"
                      ? "bg-green-300 dot-pulse"
                      : d.status === "data_terakhir"
                      ? "bg-yellow-300"
                      : "bg-gray-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Device Info Header */}
        <div className="card-cream flex items-center justify-between flex-wrap gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-green-300 flex items-center justify-center text-green-700 shadow-xs">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading font-extrabold text-base text-ink-900">{device.name}</p>
              <p className="text-xs text-ink-600">Alat: ESP32 Rev-3 · ID: {device.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={device.status} />
            <span className="text-xs text-ink-600 font-bold hidden sm:block">
              {isOffline ? "Perangkat Terputus" : `Terakhir: ${formatTimestamp(device.lastDataAt)}`}
            </span>
          </div>
        </div>

        {/* Warnings */}
        {device.status === "data_terakhir" && (
          <div className="p-4 rounded-2xl bg-cream-50 border-2 border-yellow-300 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-brown-600 font-medium">
              <strong>Data Terakhir Tersimpan:</strong> Menampilkan data dari {formatTimestamp(device.lastDataAt)}. Perangkat sedang tidak mengirim data baru secara real-time.
            </p>
          </div>
        )}

        {device.status === "offline" && (
          <div className="p-4 rounded-2xl bg-gray-100 border-2 border-gray-300 flex items-start gap-3">
            <Radio className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-ink-600 font-medium">
              <strong>Perangkat Offline:</strong> Belum ada data dari sensor Box 3. Hubungkan ESP32 ke jaringan WiFi kelas untuk memulai telemetri.
            </p>
          </div>
        )}

        {/* Sensor Grid */}
        {!isOffline && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {device.sensors.map((sensor) => {
                const meta = SENSOR_META[sensor.sensorType];
                return (
                  <Link
                    key={sensor.sensorId}
                    href={`/lab-iot/${sensor.sensorId}`}
                    className="block group"
                    title="Lihat riwayat grafik sensor ini"
                  >
                    <StatCard
                      label={meta.label}
                      value={sensor.value}
                      unit={sensor.unit}
                      status={sensor.connectionStatus}
                      updatedAt={sensor.measuredAt}
                      icon={meta.icon}
                      colorScheme={meta.scheme}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Interactive Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SensorChart
                data={mockSensorHistory["s1-temp"]}
                unit="°C"
                color="#F59A3B"
                label="Riwayat Suhu Udara (DHT22)"
              />
              <SensorChart
                data={mockSensorHistory["s1-soil"]}
                unit="%"
                color="#3F9B2E"
                label="Riwayat Kelembapan Tanah (A0)"
              />
            </div>

            {/* ── Catatan Pengamatan Siswa ─────────────────────────────────── */}
            <div className="card space-y-4">
              <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-2 flex items-center justify-between">
                <span>CATATAN PENGAMATAN LAPANGAN</span>
                <span className="text-[10px] font-bold text-green-700">Terintegrasi Kartu Misi</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="catatan-lab" className="font-heading font-bold text-xs md:text-sm text-ink-900">
                    Tulis Pengamatan Fisik Tanaman:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNoteText(EXAMPLE_NOTE);
                      showToast("Contoh teks disalin ke formulir!", "success");
                    }}
                    className="text-xs font-heading font-bold text-green-700 hover:text-green-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                    Contoh Teks
                  </button>
                </div>

                <textarea
                  id="catatan-lab"
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Contoh: Pukul 09.30 WIB — Daun ke-4 mulai tumbuh hijau cerah, media cocopeat lembap gembur..."
                  className="input-field h-auto py-2.5 text-xs md:text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-line">
                <span className="text-xs text-ink-600 font-medium">
                  Terkait: <strong>{device.name}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="btn-primary text-xs h-10 px-5 gap-1.5 cursor-pointer inline-flex items-center"
                >
                  <Save className="h-4 w-4" />
                  Simpan Catatan
                </button>
              </div>

              {/* Saved Notes List */}
              {savedNotes.length > 0 && (
                <div className="pt-3 border-t border-line space-y-2.5">
                  <p className="text-xs font-heading font-extrabold text-ink-900 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-green-600" />
                    Catatan Tersimpan ({savedNotes.length})
                  </p>
                  <div className="space-y-2">
                    {savedNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3.5 rounded-2xl bg-cream-50 border-2 border-yellow-200/80 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px] text-ink-600">
                          <span className="font-heading font-extrabold text-green-800 bg-green-200 px-2 py-0.5 rounded-md">
                            {note.deviceName}
                          </span>
                          <span>{note.timestamp}</span>
                        </div>
                        <p className="text-ink-900 leading-relaxed font-body">{note.content}</p>
                        <div className="flex justify-end gap-2 pt-1 border-t border-yellow-200">
                          <button
                            type="button"
                            onClick={() => handleCopyNote(note.content)}
                            className="text-[11px] text-brown-600 hover:text-ink-900 font-bold inline-flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-pill bg-white border border-yellow-300"
                          >
                            <Copy className="h-3 w-3" /> Salin Catatan
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-[11px] text-red-500 hover:text-red-600 font-bold inline-flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-pill bg-white border border-red-200"
                          >
                            <Trash2 className="h-3 w-3" /> Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </ContentWrapper>
    </AppShell>
  );
}
