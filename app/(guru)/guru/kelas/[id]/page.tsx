"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { GuruDataState, PotProgress } from "@/components/agro/guru-data-state";
import { sendGuruChange, useGuruData } from "@/lib/use-guru-data";
import {
  MAX_ANGGOTA_KELOMPOK, anggotaOf, kelompokOfKelas, laporanOf, ringkasanKelas, siswaOfKelas,
  type GuruData, type GuruKelas, type GuruKelompok,
} from "@/lib/guru-data";
import { showConfirmDialog, showToast, showWarningAlert } from "@/lib/swal";
import { ArrowLeft, Check, ChevronRight, Plus, Search, Trash2, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function GuruDetailKelasPage() {
  const params = useParams();
  const { data, failed, reload } = useGuruData();
  const kelas = data?.kelas.find((k) => k.id === params?.id);

  return (
    <AppShell role="guru">
      <PageHeader
        title={kelas?.nama ?? "Kelas"}
        description="Bentuk kelompok, lalu pantau kerja setiap kelompok."
        action={
          <Link href="/guru/kelas" className="btn-secondary text-xs gap-1.5 inline-flex items-center">
            <ArrowLeft className="h-3.5 w-3.5" />
            Daftar Kelas
          </Link>
        }
      />
      <ContentWrapper className="space-y-5 pb-8">
        {!data && <GuruDataState failed={failed} reload={reload} />}
        {data && !kelas && <p className="text-sm text-ink-muted text-center py-10">Kelas tidak ditemukan.</p>}
        {data && kelas && <KelasContent data={data} kelas={kelas} reload={reload} />}
      </ContentWrapper>
    </AppShell>
  );
}

function FlowGuide({ data, kelas }: { data: GuruData; kelas: GuruKelas }) {
  const info = ringkasanKelas(data, kelas.id);
  const steps = [
    { label: "Buat kelompok", done: kelompokOfKelas(data, kelas.id).length > 0 },
    { label: "Masukkan semua siswa", done: info.jumlahSiswa > 0 && info.belumBerkelompok === 0 },
    { label: "Siswa kerjakan Kartu Misi", done: info.laporanMasuk > 0 },
  ];
  return (
    <ol className="card grid grid-cols-1 sm:grid-cols-4 gap-2">
      {steps.map((step, index) => (
        <li key={step.label} className="flex items-center gap-2 text-xs font-semibold text-ink">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-emerald-600 text-white" : "bg-surface-muted text-ink-muted border border-line"}`}>
            {step.done ? <Check className="w-3.5 h-3.5" /> : index + 1}
          </span>
          {step.label}
        </li>
      ))}
      <li>
        <Link href="/guru/tugas" className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)] hover:underline">
          <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-muted border border-line">4</span>
          Baca laporan di Tugas & Misi
        </Link>
      </li>
    </ol>
  );
}

function KelasContent({ data, kelas, reload }: { data: GuruData; kelas: GuruKelas; reload: () => Promise<void> }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");

  const kelompok = kelompokOfKelas(data, kelas.id);
  const siswa = siswaOfKelas(data, kelas.id);
  const belumBerkelompok = siswa.filter((s) => !s.kelompokId);

  const run = async (change: () => Promise<string | null>, success: string) => {
    setBusy(true);
    const error = await change();
    if (error) {
      await showWarningAlert("Belum Tersimpan", error);
    } else {
      showToast(success, "success", 1400);
      setSelected([]);
    }
    await reload();
    setBusy(false);
  };

  const addKelompok = () =>
    run(() => sendGuruChange("/api/guru/kelompok", "POST", { kelasId: kelas.id }), "Kelompok baru dibuat");

  const assign = (kelompokId: string | null, siswaIds: string[]) =>
    run(
      () => sendGuruChange("/api/guru/anggota", "POST", { kelasId: kelas.id, kelompokId, siswaIds }),
      kelompokId ? "Siswa masuk ke kelompok" : "Siswa dikeluarkan dari kelompok"
    );

  const removeKelompok = async (item: GuruKelompok) => {
    const confirm = await showConfirmDialog({
      title: `Hapus ${item.nama}?`,
      text: "Anggotanya akan kembali ke daftar belum punya kelompok.",
      icon: "warning",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      isDanger: true,
      role: "guru",
    });
    if (confirm.isConfirmed) {
      await run(() => sendGuruChange(`/api/guru/kelompok/${encodeURIComponent(item.id)}`, "DELETE"), "Kelompok dihapus");
    }
  };

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]));

  const kelompokName = (id: string | null) => kelompok.find((k) => k.id === id)?.nama ?? "Belum ada";
  const filtered = siswa.filter((s) => s.nama.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <FlowGuide data={data} kelas={kelas} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <section className="card space-y-2 lg:sticky lg:top-4">
          <h2 className="text-sm font-bold text-ink">Belum Punya Kelompok ({belumBerkelompok.length})</h2>
          {belumBerkelompok.length === 0 ? (
            <p className="text-xs text-emerald-700 font-semibold">Semua siswa sudah punya kelompok.</p>
          ) : (
            <>
              <p className="text-xs text-ink-muted">Centang siswa, lalu tekan Masukkan pada kelompok tujuan.</p>
              <ul className="space-y-1 max-h-96 overflow-y-auto">
                {belumBerkelompok.map((s) => (
                  <li key={s.id}>
                    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-muted cursor-pointer text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={selected.includes(s.id)}
                        onChange={() => toggle(s.id)}
                        className="w-4 h-4 flex-shrink-0 accent-green-600"
                      />
                      {s.nama}
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-ink">Kelompok ({kelompok.length})</h2>
            <button type="button" disabled={busy} onClick={addKelompok} className="btn-primary text-xs gap-1.5 inline-flex items-center">
              <Plus className="h-4 w-4" />
              Buat Kelompok
            </button>
          </div>

          {kelompok.length === 0 && (
            <p className="card text-sm text-ink-muted text-center">Belum ada kelompok. Tekan Buat Kelompok untuk mulai.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {kelompok.map((item) => {
              const anggota = anggotaOf(data, item.id);
              const laporan = laporanOf(data, item.id);
              const sisa = MAX_ANGGOTA_KELOMPOK - anggota.length;
              return (
                <article key={item.id} className="card space-y-2.5" data-kelompok={item.nama}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-ink">{item.nama}</h3>
                    <span className={`text-xs font-bold ${sisa === 0 ? "text-emerald-700" : "text-ink-muted"}`}>
                      {anggota.length}/{MAX_ANGGOTA_KELOMPOK}
                    </span>
                  </div>

                  <PotProgress selesai={laporan.map((l) => l.pot)} />

                  <ul className="space-y-1">
                    {anggota.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-2 text-xs text-ink">
                        <span className="truncate">{s.nama}</span>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => assign(null, [s.id])}
                          aria-label={`Keluarkan ${s.nama}`}
                          className="p-1 rounded text-ink-muted hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busy || selected.length === 0 || selected.length > sisa}
                      onClick={() => assign(item.id, selected)}
                      className="btn-secondary text-xs flex-1 gap-1.5 inline-flex items-center justify-center disabled:opacity-50"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      {selected.length > sisa ? `Sisa ${sisa} tempat` : `Masukkan${selected.length ? ` ${selected.length} siswa` : ""}`}
                    </button>
                    <button
                      type="button"
                      disabled={busy || laporan.length > 0}
                      onClick={() => removeKelompok(item)}
                      aria-label={`Hapus ${item.nama}`}
                      title={laporan.length > 0 ? "Sudah ada laporan, tidak bisa dihapus" : "Hapus kelompok"}
                      className="p-2 rounded-lg border border-line text-ink-muted hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <section className="card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-ink">Daftar Siswa ({siswa.length})</h2>
          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
            <input
              type="search"
              placeholder="Cari nama siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-8 text-xs"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-line text-ink-muted font-semibold">
                <th className="py-2 pr-3">Nama</th>
                <th className="py-2 pr-3">Kelompok</th>
                <th className="py-2 pr-3">Kartu</th>
                <th className="py-2 pr-3">Bintang</th>
                <th className="py-2" aria-label="Aksi" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 pr-3 font-semibold text-ink">{s.nama}</td>
                  <td className={`py-2 pr-3 ${s.kelompokId ? "text-ink" : "text-amber-700 font-semibold"}`}>{kelompokName(s.kelompokId)}</td>
                  <td className="py-2 pr-3 text-ink">{s.kelompokId ? laporanOf(data, s.kelompokId).length : 0}/4</td>
                  <td className="py-2 pr-3 text-ink">{s.bintang}</td>
                  <td className="py-2 text-right">
                    <Link href={`/guru/kelas/${kelas.id}/siswa/${s.id}`} className="inline-flex items-center text-[var(--accent)] font-semibold hover:underline">
                      Detail
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
