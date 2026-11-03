"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockDevices, mockSensorHistory } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatTimestamp } from "@/lib/iot";
import {
  Cpu, RefreshCw, AlertTriangle, CheckCircle2, Wifi,
  WifiOff, Clock, Database, Settings, ArrowUpRight, Thermometer, Droplets, Sun, Activity
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { showToast } from "@/lib/swal";

export default function GuruIotMonitoringPage() {
  const [devices, setDevices] = useState(mockDevices);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBox, setSelectedBox] = useState(devices[0].id);

  const fetchLiveData = async () => {
    try {
      const res = await fetch("/api/iot/data");
      if (res.ok) {
        const json = await res.json();
        if (json.devices && json.devices.length > 0) {
          setDevices(json.devices);
        }
      }
    } catch {
      // fallback
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLiveData();
    setIsRefreshing(false);
    await showToast("Data telemetri ESP32 berhasil disinkronkan!", "success", 1600);
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeDevice = devices.find((d) => d.id === selectedBox) || devices[0];

  return (
    <AppShell role="guru">
      <PageHeader
        title="Pemantauan Perangkat IoT"
        description="Pantau kesehatan mikrokontroler ESP32, telemetri sensor, dan integritas timestamp data di seluruh box."
        action={
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary text-xs gap-1.5 inline-flex items-center"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Segarkan Telemetri
          </button>
        }
      />

      <ContentWrapper className="space-y-6 pb-12">
        {/* Ringkasan Status Box */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Total Unit Box</p>
            <p className="text-2xl font-extrabold text-ink mt-1">{devices.length} Unit</p>
            <p className="text-[11px] text-ink-muted mt-1">ESP32 Telemetri</p>
          </div>

          <div className="card bg-emerald-50/50 border-emerald-200">
            <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">Box Online</p>
            <p className="text-2xl font-extrabold text-emerald-900 mt-1">1 Box</p>
            <p className="text-[11px] text-emerald-700 mt-1">Koneksi stabil (&lt; 5 menit)</p>
          </div>

          <div className="card bg-amber-50/50 border-amber-200">
            <p className="text-[11px] uppercase tracking-wider font-bold text-amber-800">Data Terakhir (Stale)</p>
            <p className="text-2xl font-extrabold text-amber-900 mt-1">1 Box</p>
            <p className="text-[11px] text-amber-700 mt-1">Perlu pengecekan daya/WiFi</p>
          </div>

          <div className="card bg-rose-50/50 border-rose-200">
            <p className="text-[11px] uppercase tracking-wider font-bold text-rose-800">Box Offline</p>
            <p className="text-2xl font-extrabold text-rose-900 mt-1">1 Box</p>
            <p className="text-[11px] text-rose-700 mt-1">Tidak ada transmisi paket</p>
          </div>
        </div>

        {/* Tab Pemilih Box */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {devices.map((dev) => {
            const isSel = dev.id === selectedBox;
            return (
              <button
                key={dev.id}
                onClick={() => setSelectedBox(dev.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSel
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                    : "bg-surface border-line text-ink-muted hover:border-[var(--accent)] hover:text-ink"
                }`}
              >
                <Cpu className="h-4 w-4" />
                <span>{dev.name}</span>
                <span className={`h-2 w-2 rounded-full ${
                  dev.status === "online" ? "bg-emerald-400" : dev.status === "data_terakhir" ? "bg-amber-400" : "bg-rose-400"
                }`}></span>
              </button>
            );
          })}
        </div>

        {/* Kartu Detail Box Aktif */}
        <div className="card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-ink">{activeDevice.name}</h3>
                <StatusBadge status={activeDevice.status} />
              </div>
              <p className="text-xs text-ink-muted mt-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Waktu transmisi terakhir: <strong className="text-ink">{formatTimestamp(activeDevice.lastDataAt)}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="badge bg-surface-muted text-ink-muted border border-line font-mono">
                MAC: 24:6F:28:B4:7A:1C
              </span>
              <span className="badge bg-surface-muted text-ink-muted border border-line font-mono">
                Firmware: v2.4.1
              </span>
            </div>
          </div>

          {/* Jika box offline atau data lama */}
          {activeDevice.status === "offline" && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <WifiOff className="h-5 w-5 text-rose-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 space-y-1">
                <p className="font-bold">Peringatan: Perangkat Terputus dari Jaringan</p>
                <p>
                  ESP32 tidak mengirimkan paket telemetri lebih dari 3 jam. Sistem otomatis menyembunyikan data kadaluarsa
                  agar siswa tidak menarik kesimpulan dari angka yang tidak valid. Periksa koneksi catu daya dan sinyal WiFi sekolah.
                </p>
              </div>
            </div>
          )}

          {activeDevice.status === "data_terakhir" && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold">Status: Data Terakhir Tersimpan (Stale Telemetry)</p>
                <p>
                  Data ini dikirim 47 menit lalu. Sensor terhubung namun paket telemetry tertunda. Label &quot;data terakhir&quot; ditampilkan pada siswa untuk kejujuran ilmiah.
                </p>
              </div>
            </div>
          )}

          {/* Grid Sensor Box */}
          {activeDevice.sensors.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {activeDevice.sensors.map((s) => (
                <div key={s.sensorId} className="p-3.5 rounded-xl bg-surface-muted border border-line space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-ink-muted uppercase">{s.sensorType.replace("_", " ")}</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold font-mono text-ink">{s.value}</span>
                    <span className="text-xs text-ink-muted font-semibold">{s.unit}</span>
                  </div>
                  <p className="text-[10px] text-ink-muted font-mono truncate">
                    Read: {s.measuredAt ? new Date(s.measuredAt).toLocaleTimeString("id-ID") : "-"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-ink-muted text-xs border border-dashed border-line rounded-xl">
              Tidak ada data sensor aktif yang diterima untuk perangkat ini saat ini.
            </div>
          )}

          {/* Pengaturan Kalibrasi Cepat */}
          <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink-muted">
            <div className="space-y-0.5">
              <span className="font-bold text-ink">Catatan Kalibrasi Terpasang:</span>
              <p>Sensor tanah dikalibrasi untuk media arang sekam + cocopeat (offset: -3.5%)</p>
            </div>
            <Link
              href="/guru/pengaturan"
              className="text-[var(--accent)] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Ubah Parameter Kalibrasi di Pengaturan
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
