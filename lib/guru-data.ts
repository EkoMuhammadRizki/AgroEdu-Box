import type { DailyPot } from "./daily-missions";
import type { CardReport } from "./investigation-cards";

export const MAX_ANGGOTA_KELOMPOK = 5;

export interface GuruKelas {
  id: string;
  nama: string;
  kode: string;
}

export interface GuruKelompok {
  id: string;
  kelasId: string;
  nama: string;
}

/** Sengaja tanpa NISN dan No. Induk: portal guru tidak membutuhkannya. */
export interface GuruSiswa {
  id: string;
  kelasId: string;
  kelompokId: string | null;
  nama: string;
  bintang: number;
  /** Hasil Kuis Pintar; null bila belum pernah mengerjakan. */
  kuis: { terbaik: number; terakhir: number; percobaan: number } | null;
}

export interface GuruLaporan {
  kelompokId: string;
  pot: DailyPot;
  laporan: CardReport;
  pengirim: string | null;
  selesaiAt: string;
  nilai: number | null;
  umpanBalik: string | null;
}

export interface GuruData {
  kelas: GuruKelas[];
  kelompok: GuruKelompok[];
  siswa: GuruSiswa[];
  laporan: GuruLaporan[];
}

export const kelompokOfKelas = (data: GuruData, kelasId: string) =>
  data.kelompok.filter((k) => k.kelasId === kelasId);

export const siswaOfKelas = (data: GuruData, kelasId: string) =>
  data.siswa.filter((s) => s.kelasId === kelasId);

export const anggotaOf = (data: GuruData, kelompokId: string) =>
  data.siswa.filter((s) => s.kelompokId === kelompokId);

export const laporanOf = (data: GuruData, kelompokId: string) =>
  data.laporan.filter((l) => l.kelompokId === kelompokId);

export function ringkasanKelas(data: GuruData, kelasId: string) {
  const siswa = siswaOfKelas(data, kelasId);
  const kelompok = kelompokOfKelas(data, kelasId);
  const kelompokIds = new Set(kelompok.map((k) => k.id));
  return {
    jumlahSiswa: siswa.length,
    belumBerkelompok: siswa.filter((s) => !s.kelompokId).length,
    /** Kelompok kosong tidak dihitung, karena tidak ada yang bisa mengerjakan kartunya. */
    jumlahKelompok: kelompok.filter((k) => anggotaOf(data, k.id).length > 0).length,
    laporanMasuk: data.laporan.filter((l) => kelompokIds.has(l.kelompokId)).length,
  };
}
