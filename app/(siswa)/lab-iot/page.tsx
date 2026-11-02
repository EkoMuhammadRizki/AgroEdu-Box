"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { StatCard } from "@/components/agro/stat-card";
import { SensorChart } from "@/components/agro/sensor-chart";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockDevices, mockSensorHistory } from "@/lib/mock-data";
import { Thermometer, Droplets, Sprout, Sun, Cpu, ChevronRight, Save, Trash2, Copy, Sparkles, Clock, Check } from "lucide-react";
import { formatTimestamp } from "@/lib/iot";
import Link from "next/link";
import { useState, useEffect } from "react";
import { showSuccessAlert, showWarningAlert, showConfirmDialog, showToast } from "@/lib/swal";

const SENSOR_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  air_temp: { label: "Suhu Udara", icon: <Thermometer className="h-4 w-4" strokeWidth={1.75} />, color: "#E57C2F" },
  air_humidity: { label: "Kelembapan Udara", icon: <Droplets className="h-4 w-4" strokeWidth={1.75} />, color: "#2F7CE5" },
  soil_moisture: { label: "Kelembapan Tanah", icon: <Sprout className="h-4 w-4" strokeWidth={1.75} />, color: "#166A43" },
  light: { label: "Intensitas Cahaya", icon: <Sun className="h-4 w-4" strokeWidth={1.75} />, color: "#C4A800" },
};

interface ObservationNote {
  id: string;
  deviceName: string;
  content: string;
  timestamp: string;
}

const EXAMPLE_NOTE = "Pukul 09.30 WIB — Daun ke-4 mulai tumbuh hijau cerah, media cocopeat terasa lembap, tidak tampak tanda hama. Suhu udara 28.5°C dan kelembapan 65% terpantau dalam kondisi optimal.";

export default function LabIotPage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState(mockDevices[0].id);
  const [noteText, setNoteText] = useState("");
  const [savedNotes, setSavedNotes] = useState<ObservationNote[]>([
    {
      id: "note-1",
      deviceName: "Box 1 — Kangkung",
      content: "Pukul 08.00 WIB: Air nutrisi hidroponik bersirkulasi lancar. Sensor kelembapan tanah menunjukkan 48%, kondisi tanaman segar dan tegak.",
      timestamp: "Hari ini, 08:05 WIB",
    },
  ]);

  // Load notes from localStorage on mount
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
      "Catatan Berhasil Disimpan!",
      "Catatan pengamatan telah dicatat dalam log Lab IoT dan siap dijadikan bukti tugas misi.",
      1600
    );
  };

  const handleDeleteNote = async (id: string) => {
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
      const updated = savedNotes.filter((n) => n.id !== id);
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

  const handleUseExample = () => {
    setNoteText(EXAMPLE_NOTE);
    showToast("Contoh teks pengamatan disalin ke formulir!", "success", 1400);
  };

  return (
    <AppShell role="siswa">
      <PageHeader
        title="Lab IoT"
        description="Data sensor real-time dari perangkat AGRO EDU BOX."
      />

      <ContentWrapper className="space-y-5 pb-8">
        {/* Device Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {mockDevices.map((d) => {
            const isSelected = d.id === selectedDeviceId;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDeviceId(d.id)}
                className={`flex-shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 border text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-[var(--accent)] text-white border-transparent shadow-sm"
                    : "bg-surface border-line text-ink-muted hover:border-[var(--accent)] hover:text-ink"
                }`}
              >
                <Cpu className="h-3.5 w-3.5" strokeWidth={isSelected ? 2.5 : 1.75} />
                {d.name}
                <span
                  className={`h-2 w-2 rounded-full ${
                    d.status === "online"
                      ? "bg-emerald-400"
                      : d.status === "data_terakhir"
                      ? "bg-amber-400"
                      : "bg-gray-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Device info bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-xl bg-surface border border-line">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-siswa-100">
              <Cpu className="h-4 w-4 text-siswa-600" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">{device.name}</p>
              <p className="text-xs text-ink-muted">ID: {device.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={device.status} />
            <span className="text-xs text-ink-muted hidden sm:block">
              {isOffline
                ? "Tidak ada data baru"
                : `Data terakhir: ${formatTimestamp(device.lastDataAt)}`}
            </span>
          </div>
        </div>

        {/* Status warning */}
        {device.status === "data_terakhir" && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FFF4D6] border border-[#E5C566]">
            <span className="text-sm">⚠️</span>
            <p className="text-sm text-[#8A5A00]">
              <strong>Data belum diperbarui.</strong> Menampilkan data terakhir dari{" "}
              {formatTimestamp(device.lastDataAt)}. Ini bukan data terkini — perangkat mungkin tidak terhubung.
            </p>
          </div>
        )}

        {device.status === "offline" && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#EEF0F2] border border-line">
            <span className="text-sm">📡</span>
            <p className="text-sm text-gray-600">
              <strong>Perangkat offline.</strong> Belum ada data dari perangkat ini. Periksa koneksi Box IoT.
            </p>
          </div>
        )}

        {/* Sensor cards */}
        {!isOffline && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {device.sensors.map((sensor) => {
                const meta = SENSOR_META[sensor.sensorType];
                return (
                  <Link
                    key={sensor.sensorId}
                    href={`/lab-iot/${sensor.sensorId}`}
                    className="block group"
                  >
                    <StatCard
                      label={meta.label}
                      value={sensor.value}
                      unit={sensor.unit}
                      status={sensor.connectionStatus}
                      updatedAt={sensor.measuredAt}
                      icon={meta.icon}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Chart for first sensor (suhu) */}
            <div className="[--accent:#E57C2F]">
              <SensorChart
                data={mockSensorHistory["s1-temp"]}
                unit="°C"
                color="#E57C2F"
                label="Riwayat Suhu Udara"
              />
            </div>

            {/* ── Catatan Pengamatan Interaktif ──────────────────────── */}
            <div className="card space-y-4">
              <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-1 rounded-t-card flex items-center justify-between">
                <span>CATATAN PENGAMATAN</span>
                <span className="text-[10px] font-normal normal-case opacity-90">Log Harian Siswa</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="catatan" className="text-xs font-bold text-ink">
                    Pengamatan Lapangan & Kondisi Fisik Tanaman
                  </label>
                  <button
                    type="button"
                    onClick={handleUseExample}
                    className="text-xs text-siswa-600 hover:text-siswa-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3" />
                    Gunakan Contoh Teks
                  </button>
                </div>

                <textarea
                  id="catatan"
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Contoh: Pukul 09.30 WIB — Daun ke-4 mulai tumbuh hijau cerah, media cocopeat lembap, tidak tampak hama. Suhu 28.5°C dan kelembapan 65% terpantau optimal."
                  className="input-field h-auto resize-none text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-line">
                <span className="text-[11px] text-ink-muted">
                  Perangkat: <strong className="text-ink">{device.name}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="btn-primary text-xs h-9 px-4 gap-1.5 cursor-pointer inline-flex items-center"
                >
                  <Save className="h-3.5 w-3.5" />
                  Simpan Catatan
                </button>
              </div>

              {/* Riwayat Catatan Pengamatan */}
              {savedNotes.length > 0 && (
                <div className="pt-3 border-t border-line space-y-2.5">
                  <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-siswa-600" />
                    Catatan Tersimpan ({savedNotes.length})
                  </p>
                  <div className="space-y-2">
                    {savedNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl bg-surface-muted border border-line text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px] text-ink-muted">
                          <span className="font-semibold text-siswa-700 bg-siswa-100 px-2 py-0.5 rounded-md">
                            {note.deviceName}
                          </span>
                          <span>{note.timestamp}</span>
                        </div>
                        <p className="text-ink leading-relaxed whitespace-pre-wrap">{note.content}</p>
                        <div className="flex justify-end gap-2 pt-1 border-t border-line/60">
                          <button
                            type="button"
                            onClick={() => handleCopyNote(note.content)}
                            className="text-[11px] text-ink-muted hover:text-ink font-semibold inline-flex items-center gap-1 cursor-pointer px-2 py-1 rounded hover:bg-surface"
                            title="Salin untuk pengerjaan misi"
                          >
                            <Copy className="h-3 w-3" />
                            Salin Catatan
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1 cursor-pointer px-2 py-1 rounded hover:bg-rose-50"
                            title="Hapus catatan"
                          >
                            <Trash2 className="h-3 w-3" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Link to all sensors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {device.sensors.map((sensor) => {
                const meta = SENSOR_META[sensor.sensorType];
                return (
                  <Link
                    key={sensor.sensorId}
                    href={`/lab-iot/${sensor.sensorId}`}
                    className="flex items-center justify-between gap-2 p-3 rounded-xl bg-surface border border-line hover:border-[var(--accent)] transition-colors duration-150"
                  >
                    <span className="text-xs font-medium text-ink">{meta.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-ink-muted" strokeWidth={1.75} />
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </ContentWrapper>
    </AppShell>
  );
}
