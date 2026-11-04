"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { GuruDataState } from "@/components/agro/guru-data-state";
import { LkpdForm } from "@/components/agro/lkpd-form";
import { useGuruData, sendGuruChange } from "@/lib/use-guru-data";
import { anggotaOf, kelompokOfKelas } from "@/lib/guru-data";
import { LKPD_BAGIAN, hitungKemajuan, type LkpdJawaban } from "@/lib/lkpd";
import type { GuruLkpd, GuruRefleksi } from "@/app/api/guru/lkpd/route";
import { showToast, showWarningAlert } from "@/lib/swal";
import { ChevronDown, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const tanggal = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function GuruLkpdPage() {
  const { data, failed, reload } = useGuruData();
  const [lkpd, setLkpd] = useState<GuruLkpd[]>([]);
  const [refleksi, setRefleksi] = useState<GuruRefleksi[]>([]);
  const [gagalLkpd, setGagalLkpd] = useState(false);
  const [siap, setSiap] = useState(false);
  const [kelasId, setKelasId] = useState<string | null>(null);
  const [terbuka, setTerbuka] = useState<string | null>(null);

  const muatLkpd = useCallback(async () => {
    setGagalLkpd(false);
    try {
      const res = await fetch("/api/guru/lkpd");
      if (res.status === 401) {
        window.location.assign("/guru/login");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setLkpd(json.lkpd ?? []);
      setRefleksi(json.refleksi ?? []);
      setSiap(true);
    } catch {
      setGagalLkpd(true);
    }
  }, []);

  useEffect(() => {
    muatLkpd();
  }, [muatLkpd]);

  const kelasAktif = kelasId ?? data?.kelas[0]?.id ?? "";
  const kelompok = data ? kelompokOfKelas(data, kelasAktif).filter((k) => anggotaOf(data, k.id).length > 0) : [];
  const lkpdDari = (id: string) => lkpd.find((l) => l.kelompokId === id);
  const belumDinilai = kelompok.filter((k) => {
    const isi = lkpdDari(k.id);
    return isi && isi.nilai === null;
  }).length;

  return (
    <AppShell role="guru">
      <PageHeader
        title="Lembar Kerja (LKPD)"
        description="Baca isian LKPD tiap kelompok, lihat refleksi tiap siswa, lalu berikan nilai."
        badge={
          belumDinilai > 0 ? (
            <span className="px-3 py-1 rounded-pill bg-cream-50 border border-yellow-300 text-brown-600 text-xs font-heading font-extrabold">
              {belumDinilai} belum dinilai
            </span>
          ) : undefined
        }
      />

      <ContentWrapper className="space-y-4 pb-10">
        {(!data || !siap) && <GuruDataState failed={failed || gagalLkpd} reload={() => { reload(); muatLkpd(); }} />}

        {data && siap && (
          <>
            <div className="flex gap-2">
              {data.kelas.map((kelas) => (
                <button
                  key={kelas.id}
                  type="button"
                  onClick={() => { setKelasId(kelas.id); setTerbuka(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    kelas.id === kelasAktif
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "bg-surface border-line text-ink-muted"
                  }`}
                >
                  {kelas.nama}
                </button>
              ))}
            </div>

            {kelompok.length === 0 && (
              <p className="card text-sm text-ink-muted text-center py-8">
                Belum ada kelompok berisi siswa di kelas ini.
              </p>
            )}

            {kelompok.map((k) => {
              const isi = lkpdDari(k.id);
              const jawaban: LkpdJawaban = isi?.jawaban ?? {};
              const kemajuan = hitungKemajuan("kelompok", jawaban);
              const dibuka = terbuka === k.id;
              const anggota = anggotaOf(data, k.id);

              return (
                <section key={k.id} data-kelompok-lkpd={k.id} className="card space-y-3">
                  <button
                    type="button"
                    onClick={() => setTerbuka(dibuka ? null : k.id)}
                    className="w-full flex items-center justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink">{k.nama}</p>
                      <p className="text-[11px] text-ink-muted">
                        {kemajuan.terisi}/{kemajuan.total} isian · diperbarui {tanggal(isi?.diperbaruiAt ?? null)}
                        {isi?.nilai !== null && isi?.nilai !== undefined ? ` · Nilai ${isi.nilai}` : " · belum dinilai"}
                      </p>
                    </div>
                    <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${dibuka ? "rotate-180" : ""}`} />
                  </button>

                  {dibuka && (
                    <div className="space-y-5 pt-2 border-t border-line">
                      {!isi && (
                        <p className="text-sm text-ink-muted text-center py-6">
                          Kelompok ini belum mengisi LKPD sama sekali.
                        </p>
                      )}

                      {isi &&
                        LKPD_BAGIAN.filter((b) => b.lingkup === "kelompok").map((bagian) => (
                          <LkpdForm key={bagian.id} bagian={bagian} jawaban={jawaban} onUbah={() => {}} terkunci />
                        ))}

                      {/* Refleksi tiap anggota, karena halaman itu diisi sendiri-sendiri */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-ink">Refleksi Masing-Masing Siswa</h3>
                        {anggota.map((siswa) => {
                          const milik = refleksi.find((r) => r.siswaId === siswa.id);
                          const punya = milik && Object.keys(milik.jawaban).length > 0;
                          return (
                            <div key={siswa.id} className="rounded-2xl border border-line p-3 space-y-2">
                              <p className="text-xs font-bold text-ink">{siswa.nama}</p>
                              {!punya && <p className="text-[11px] text-ink-muted">Belum mengisi refleksi.</p>}
                              {punya &&
                                LKPD_BAGIAN.filter((b) => b.lingkup === "siswa").map((bagian) => (
                                  <LkpdForm
                                    key={bagian.id}
                                    bagian={bagian}
                                    jawaban={milik.jawaban}
                                    onUbah={() => {}}
                                    terkunci
                                  />
                                ))}
                            </div>
                          );
                        })}
                      </div>

                      {isi && <FormNilaiLkpd item={isi} onSaved={muatLkpd} />}
                    </div>
                  )}
                </section>
              );
            })}
          </>
        )}
      </ContentWrapper>
    </AppShell>
  );
}

function FormNilaiLkpd({ item, onSaved }: { item: GuruLkpd; onSaved: () => Promise<void> | void }) {
  const [nilai, setNilai] = useState(item.nilai?.toString() ?? "");
  const [umpanBalik, setUmpanBalik] = useState(item.umpanBalik ?? "");
  const [menyimpan, setMenyimpan] = useState(false);

  const kirim = async (event: React.FormEvent) => {
    event.preventDefault();
    const angka = Number(nilai);
    if (!Number.isInteger(angka) || angka < 0 || angka > 100) {
      await showWarningAlert("Nilai Belum Benar", "Isi nilai dengan angka bulat 0 sampai 100.");
      return;
    }
    setMenyimpan(true);
    const error = await sendGuruChange("/api/guru/lkpd", "POST", {
      kelompokId: item.kelompokId,
      nilai: angka,
      umpanBalik,
    });
    if (error) await showWarningAlert("Nilai Belum Tersimpan", error);
    else {
      showToast("Nilai LKPD terkirim ke kelompok siswa", "success", 1600);
      await onSaved();
    }
    setMenyimpan(false);
  };

  return (
    <form onSubmit={kirim} className="space-y-2.5 pt-3 border-t border-line">
      <h3 className="text-sm font-bold text-ink">Penilaian LKPD</h3>
      <div>
        <label htmlFor={`nilai-${item.kelompokId}`} className="text-xs font-semibold text-ink block mb-1">
          Nilai (0–100)
        </label>
        <input
          id={`nilai-${item.kelompokId}`}
          type="text"
          inputMode="numeric"
          value={nilai}
          onChange={(e) => setNilai(e.target.value)}
          className="input-field text-sm max-w-32"
        />
      </div>
      <div>
        <label htmlFor={`umpan-${item.kelompokId}`} className="text-xs font-semibold text-ink block mb-1">
          Umpan Balik untuk Kelompok
        </label>
        <textarea
          id={`umpan-${item.kelompokId}`}
          rows={3}
          value={umpanBalik}
          onChange={(e) => setUmpanBalik(e.target.value)}
          placeholder="Tulis apresiasi atau saran untuk kelompok ini..."
          className="input-field h-auto py-2.5 leading-relaxed text-sm"
        />
      </div>
      <button type="submit" disabled={menyimpan} className="btn-primary text-xs gap-1.5 inline-flex items-center">
        <Save className="h-3.5 w-3.5" />
        {menyimpan ? "Menyimpan..." : item.nilai === null ? "Simpan Nilai" : "Perbarui Nilai"}
      </button>
    </form>
  );
}
