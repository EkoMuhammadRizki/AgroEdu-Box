"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { LkpdForm } from "@/components/agro/lkpd-form";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { usePots } from "@/lib/use-pots";
import { readSensor } from "@/lib/iot";
import { getStudentProfile, type StudentProfile } from "@/lib/student-session";
import {
  LKPD_BAGIAN,
  LKPD_HALAMAN_BACA,
  hitungKemajuan,
  type LkpdJawaban,
  type LkpdLingkup,
} from "@/lib/lkpd";
import { BookOpen, Check, CloudOff, Loader2, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Status = "siap" | "menyimpan" | "tersimpan" | "gagal";

interface Penilaian {
  nilai: number | null;
  umpanBalik: string | null;
  dinilaiAt: string | null;
  dinilaiOleh: string | null;
}

const JEDA_SIMPAN = 1200;

export default function LkpdPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [kelompok, setKelompok] = useState<{ id: string; nama: string } | null>(null);
  const [jwbKelompok, setJwbKelompok] = useState<LkpdJawaban>({});
  const [jwbRefleksi, setJwbRefleksi] = useState<LkpdJawaban>({});
  const [penilaian, setPenilaian] = useState<Penilaian | null>(null);
  const [aktif, setAktif] = useState(LKPD_BAGIAN[0].id);
  const [status, setStatus] = useState<Status>("siap");
  const [gagalMuat, setGagalMuat] = useState(false);
  const [siapPakai, setSiapPakai] = useState(false);
  const [lihatHalaman, setLihatHalaman] = useState<number | null>(null);

  const pots = usePots(10000);
  // Ref dipakai agar penyimpanan saat halaman ditutup memakai isi terbaru.
  const isiRef = useRef({ kelompok: {} as LkpdJawaban, siswa: {} as LkpdJawaban });
  const kotorRef = useRef({ kelompok: false, siswa: false });

  const muat = useCallback(async () => {
    const tersimpan = getStudentProfile();
    if (!tersimpan) return;
    setProfile(tersimpan);
    setGagalMuat(false);
    try {
      const res = await fetch(`/api/siswa/lkpd?siswaId=${tersimpan.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setKelompok(data.kelompok);
      setJwbKelompok(data.jawabanKelompok ?? {});
      setJwbRefleksi(data.jawabanRefleksi ?? {});
      setPenilaian(data.penilaian ?? null);
      isiRef.current = { kelompok: data.jawabanKelompok ?? {}, siswa: data.jawabanRefleksi ?? {} };
      setSiapPakai(true);
    } catch {
      setGagalMuat(true);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  const kirim = useCallback(
    async (lingkup: LkpdLingkup, jawaban: LkpdJawaban, saatTutup = false) => {
      const siswaId = getStudentProfile()?.id;
      if (!siswaId) return;
      if (!saatTutup) setStatus("menyimpan");
      try {
        const res = await fetch("/api/siswa/lkpd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siswaId, lingkup, jawaban }),
          keepalive: saatTutup,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        kotorRef.current[lingkup] = false;
        if (!saatTutup) setStatus("tersimpan");
      } catch {
        if (!saatTutup) setStatus("gagal");
      }
    },
    []
  );

  // Menyimpan otomatis setelah siswa berhenti mengetik sejenak.
  useEffect(() => {
    if (!siapPakai || !kotorRef.current.kelompok) return;
    const timer = setTimeout(() => void kirim("kelompok", jwbKelompok), JEDA_SIMPAN);
    return () => clearTimeout(timer);
  }, [jwbKelompok, siapPakai, kirim]);

  useEffect(() => {
    if (!siapPakai || !kotorRef.current.siswa) return;
    const timer = setTimeout(() => void kirim("siswa", jwbRefleksi), JEDA_SIMPAN);
    return () => clearTimeout(timer);
  }, [jwbRefleksi, siapPakai, kirim]);

  // Siswa yang menutup tab atau mengunci layar tidak boleh kehilangan ketikannya.
  useEffect(() => {
    const simpanSisa = () => {
      if (document.visibilityState !== "hidden") return;
      if (kotorRef.current.kelompok) void kirim("kelompok", isiRef.current.kelompok, true);
      if (kotorRef.current.siswa) void kirim("siswa", isiRef.current.siswa, true);
    };
    document.addEventListener("visibilitychange", simpanSisa);
    return () => document.removeEventListener("visibilitychange", simpanSisa);
  }, [kirim]);

  const ubah = (lingkup: LkpdLingkup) => (id: string, nilai: string | string[]) => {
    kotorRef.current[lingkup] = true;
    setStatus("menyimpan");
    const perbarui = (lama: LkpdJawaban) => {
      const baru = { ...lama, [id]: nilai };
      isiRef.current[lingkup] = baru;
      return baru;
    };
    if (lingkup === "kelompok") setJwbKelompok(perbarui);
    else setJwbRefleksi(perbarui);
  };

  const ambilSensor = (pot: string) => {
    const perangkat = pots.find((p) => p.id === `pot-${pot.toLowerCase()}`);
    if (!perangkat || perangkat.status !== "online") return null;
    return {
      kelembapan: readSensor(perangkat, "soil_moisture"),
      suhu: readSensor(perangkat, "air_temp"),
    };
  };

  const bagian = LKPD_BAGIAN.find((b) => b.id === aktif) ?? LKPD_BAGIAN[0];
  const kelompokJwb = hitungKemajuan("kelompok", jwbKelompok);
  const siswaJwb = hitungKemajuan("siswa", jwbRefleksi);
  const terisi = kelompokJwb.terisi + siswaJwb.terisi;
  const total = kelompokJwb.total + siswaJwb.total;
  const persen = total > 0 ? Math.round((terisi / total) * 100) : 0;

  const terkunci = bagian.lingkup === "kelompok" && !kelompok;
  const jawaban = bagian.lingkup === "kelompok" ? jwbKelompok : jwbRefleksi;

  return (
    <AppShell role="siswa">
      <PageHeader
        title="Lembar Kerja (LKPD)"
        description="Isi langsung di sini bersama kelompokmu. Jawabanmu tersimpan otomatis."
        badge={<PenandaSimpan status={status} />}
      />

      <ContentWrapper className="space-y-4 pb-10">
        {!siapPakai && (
          gagalMuat ? (
            <div className="card text-center space-y-2 py-8">
              <p className="text-sm font-bold text-ink-900">Lembar kerjamu belum bisa dimuat.</p>
              <p className="text-xs text-ink-600">Periksa koneksi, lalu coba lagi ya.</p>
              <button type="button" onClick={muat} className="btn-secondary text-xs cursor-pointer">
                Coba Lagi
              </button>
            </div>
          ) : (
            <p className="text-sm text-ink-600 text-center py-10">Membuka lembar kerjamu...</p>
          )
        )}

        {siapPakai && (
          <>
            {/* Kemajuan pengisian */}
            <div className="card-cream p-3.5 sm:p-4 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-xs font-heading font-bold text-ink-900">
                  {kelompok ? kelompok.nama : "Belum punya kelompok"}
                  {profile?.className ? ` · ${profile.className}` : ""}
                </p>
                <p className="text-xs font-heading font-extrabold text-green-700 tabular-nums">
                  {terisi}/{total} isian · {persen}%
                </p>
              </div>
              <div className="h-2.5 w-full rounded-full bg-white overflow-hidden border-2 border-green-200">
                <div className="h-full rounded-full bg-green-500 transition-all duration-500" style={{ width: `${persen}%` }} />
              </div>
            </div>

            {/* Nilai dari guru */}
            {penilaian?.nilai !== null && penilaian && (
              <div className="card bg-blue-200/20 border-blue-200 space-y-1.5">
                <p className="text-xs font-heading font-extrabold text-blue-500">
                  Nilai LKPD dari {penilaian.dinilaiOleh ?? "guru"}: {penilaian.nilai}
                </p>
                {penilaian.umpanBalik && (
                  <p className="text-xs sm:text-sm text-ink-900 leading-relaxed">&ldquo;{penilaian.umpanBalik}&rdquo;</p>
                )}
              </div>
            )}

            {/* Pindah bagian */}
            <div role="tablist" className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {LKPD_BAGIAN.map((b) => {
                const dipilih = b.id === aktif;
                const kemajuan = hitungKemajuan(b.lingkup, b.lingkup === "kelompok" ? jwbKelompok : jwbRefleksi);
                return (
                  <button
                    key={b.id}
                    role="tab"
                    aria-selected={dipilih}
                    type="button"
                    onClick={() => setAktif(b.id)}
                    className={`flex-shrink-0 rounded-pill px-4 py-2 text-xs font-heading font-bold border-2 transition-all cursor-pointer ${
                      dipilih
                        ? "bg-green-500 text-white border-green-600 shadow-xs"
                        : "bg-white text-ink-900 border-green-200 hover:border-green-400"
                    }`}
                  >
                    {namaPendek(b.id)}
                    {kemajuan.terisi > 0 && !dipilih && <span className="ml-1.5 text-green-600">●</span>}
                  </button>
                );
              })}
            </div>

            {terkunci && (
              <div className="card-cream flex items-start gap-3">
                <BibooMascot mood="thinking" size="sm" character={profile?.character ?? "original"} animated={false} />
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm font-heading font-bold text-ink-900">Kamu belum punya kelompok.</p>
                  <p className="text-[11px] sm:text-xs text-ink-600 leading-relaxed">
                    Bagian ini diisi bersama kelompok. Minta gurumu memasukkanmu ke sebuah kelompok dulu ya.
                    Halaman <strong>Refleksi</strong> tetap bisa kamu isi sendiri sekarang.
                  </p>
                </div>
              </div>
            )}

            <LkpdForm
              bagian={bagian}
              jawaban={jawaban}
              onUbah={ubah(bagian.lingkup)}
              onAmbilSensor={ambilSensor}
              terkunci={terkunci}
            />

            {/* Lembar asli & halaman bacaan */}
            <div className="card space-y-2.5">
              <p className="text-xs font-heading font-extrabold text-ink-900">Lembar LKPD Asli</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setLihatHalaman(bagian.halaman)} className="btn-secondary text-xs gap-1.5 inline-flex items-center cursor-pointer">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Lihat halaman {bagian.halaman}
                </button>
                {LKPD_HALAMAN_BACA.map((h) => (
                  <button
                    key={h.halaman}
                    type="button"
                    onClick={() => setLihatHalaman(h.halaman)}
                    className="btn-ghost text-xs gap-1.5 inline-flex items-center cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {h.judul}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </ContentWrapper>

      {lihatHalaman !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-3 overflow-y-auto"
          onClick={() => setLihatHalaman(null)}
        >
          <div className="max-w-3xl mx-auto py-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setLihatHalaman(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-white text-ink-900 font-heading font-bold text-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
                Tutup
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/LKPD/web/${lihatHalaman}.webp`}
              alt={`Lembar LKPD halaman ${lihatHalaman}`}
              className="w-full h-auto rounded-2xl bg-white"
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}

function namaPendek(id: string) {
  const peta: Record<string, string> = {
    identitas: "Identitas",
    "misi-1": "Misi #1",
    "misi-2": "Misi #2",
    "misi-3": "Misi #3",
    analisis: "Analisis",
    refleksi: "Refleksi",
  };
  return peta[id] ?? id;
}

function PenandaSimpan({ status }: { status: Status }) {
  if (status === "siap") return null;
  const gaya = {
    menyimpan: { teks: "Menyimpan...", warna: "bg-cream-50 text-brown-600 border-yellow-300", ikon: <Loader2 className="w-3 h-3 animate-spin" /> },
    tersimpan: { teks: "Tersimpan", warna: "bg-green-100 text-green-700 border-green-300", ikon: <Check className="w-3 h-3 stroke-[3]" /> },
    gagal: { teks: "Belum tersimpan", warna: "bg-[#FEECEB] text-red-500 border-red-500/40", ikon: <CloudOff className="w-3 h-3" /> },
  }[status];

  return (
    <span
      data-simpan={status}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-[10px] font-heading font-extrabold border ${gaya.warna}`}
    >
      {gaya.ikon}
      {gaya.teks}
    </span>
  );
}
