import { NextResponse } from "next/server";
import { getGuruId, requireGuru } from "@/lib/guru-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { LkpdJawaban } from "@/lib/lkpd";

export const dynamic = "force-dynamic";

const MAKS_UMPAN_BALIK = 1000;

export interface GuruLkpd {
  kelompokId: string;
  jawaban: LkpdJawaban;
  diperbaruiAt: string | null;
  nilai: number | null;
  umpanBalik: string | null;
}

export interface GuruRefleksi {
  siswaId: string;
  jawaban: LkpdJawaban;
  diperbaruiAt: string | null;
}

export async function GET() {
  const denied = await requireGuru();
  if (denied) return denied;

  try {
    const supabase = getSupabaseAdmin();
    const [kelompok, refleksi] = await Promise.all([
      supabase.from("lkpd_kelompok").select("kelompok_id, jawaban, diperbarui_at, nilai, umpan_balik").order("kelompok_id"),
      supabase.from("lkpd_refleksi").select("siswa_id, jawaban, diperbarui_at"),
    ]);
    const error = kelompok.error ?? refleksi.error;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      lkpd: (kelompok.data ?? []).map(
        (row): GuruLkpd => ({
          kelompokId: row.kelompok_id,
          jawaban: row.jawaban ?? {},
          diperbaruiAt: row.diperbarui_at,
          nilai: row.nilai,
          umpanBalik: row.umpan_balik,
        })
      ),
      refleksi: (refleksi.data ?? []).map(
        (row): GuruRefleksi => ({
          siswaId: row.siswa_id,
          jawaban: row.jawaban ?? {},
          diperbaruiAt: row.diperbarui_at,
        })
      ),
    });
  } catch (err) {
    console.error("GET /api/guru/lkpd", err);
    return NextResponse.json({ success: false, error: "Gagal memuat LKPD" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireGuru();
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => null);
    const { kelompokId, nilai, umpanBalik } = body ?? {};
    const feedback = typeof umpanBalik === "string" ? umpanBalik.trim() : "";
    const valid =
      typeof kelompokId === "string" &&
      kelompokId.length > 0 &&
      Number.isInteger(nilai) &&
      nilai >= 0 &&
      nilai <= 100 &&
      feedback.length <= MAKS_UMPAN_BALIK;
    if (!valid) {
      return NextResponse.json({ success: false, error: "Nilai harus angka 0 sampai 100." }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("lkpd_kelompok")
      .update({
        nilai,
        umpan_balik: feedback || null,
        dinilai_at: new Date().toISOString(),
        dinilai_oleh: await getGuruId(),
      })
      .eq("kelompok_id", kelompokId)
      .select("kelompok_id");
    if (error) throw error;
    if (data.length === 0) {
      return NextResponse.json({ success: false, error: "LKPD kelompok ini belum pernah diisi." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/guru/lkpd", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan nilai LKPD" }, { status: 500 });
  }
}
