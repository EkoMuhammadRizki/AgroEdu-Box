import { NextResponse } from "next/server";
import { requireGuru } from "@/lib/guru-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { CardReport } from "@/lib/investigation-cards";
import type { DailyPot } from "@/lib/daily-missions";
import type { GuruData } from "@/lib/guru-data";

export const dynamic = "force-dynamic";

interface MisiRow {
  kelompok_id: string;
  pot: DailyPot;
  laporan: CardReport;
  selesai_at: string;
  nilai: number | null;
  umpan_balik: string | null;
  siswa: { nama: string } | null;
}

export async function GET() {
  const denied = await requireGuru();
  if (denied) return denied;

  try {
    const supabase = getSupabaseAdmin();
    const [kelas, kelompok, siswa, misi] = await Promise.all([
      supabase.from("kelas").select("id, nama, kode").order("nama"),
      supabase.from("kelompok").select("id, kelas_id, nama").order("id"),
      supabase.from("siswa").select("id, kelas_id, kelompok_id, nama, bintang").order("nama"),
      supabase
        .from("misi_kelompok")
        .select("kelompok_id, pot, laporan, selesai_at, nilai, umpan_balik, siswa(nama)")
        .order("selesai_at", { ascending: false })
        .overrideTypes<MisiRow[], { merge: false }>(),
    ]);
    const error = kelas.error ?? kelompok.error ?? siswa.error ?? misi.error;
    if (error) throw error;

    const data: GuruData = {
      kelas: kelas.data ?? [],
      kelompok: (kelompok.data ?? []).map((k) => ({ id: k.id, kelasId: k.kelas_id, nama: k.nama })),
      siswa: (siswa.data ?? []).map((s) => ({
        id: s.id,
        kelasId: s.kelas_id,
        kelompokId: s.kelompok_id,
        nama: s.nama,
        bintang: s.bintang,
      })),
      laporan: (misi.data ?? []).map((m) => ({
        kelompokId: m.kelompok_id,
        pot: m.pot,
        laporan: m.laporan,
        pengirim: m.siswa?.nama ?? null,
        selesaiAt: m.selesai_at,
        nilai: m.nilai,
        umpanBalik: m.umpan_balik,
      })),
    };
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/guru/data", err);
    return NextResponse.json({ success: false, error: "Gagal memuat data" }, { status: 500 });
  }
}
