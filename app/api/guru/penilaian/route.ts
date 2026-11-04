import { NextResponse } from "next/server";
import { requireGuru } from "@/lib/guru-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { DAILY_POTS, type DailyPot } from "@/lib/daily-missions";

export const dynamic = "force-dynamic";

const MAX_FEEDBACK_LENGTH = 1000;

export async function POST(request: Request) {
  const denied = await requireGuru();
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => null);
    const { kelompokId, pot, nilai, umpanBalik } = body ?? {};
    const feedback = typeof umpanBalik === "string" ? umpanBalik.trim() : "";
    const valid =
      typeof kelompokId === "string" &&
      DAILY_POTS.includes(pot as DailyPot) &&
      Number.isInteger(nilai) &&
      nilai >= 0 &&
      nilai <= 100 &&
      feedback.length <= MAX_FEEDBACK_LENGTH;
    if (!valid) {
      return NextResponse.json({ success: false, error: "Nilai harus angka 0 sampai 100." }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("misi_kelompok")
      .update({ nilai, umpan_balik: feedback || null, dinilai_at: new Date().toISOString() })
      .eq("kelompok_id", kelompokId)
      .eq("pot", pot)
      .select("pot");
    if (error) throw error;
    if (data.length === 0) {
      return NextResponse.json({ success: false, error: "Laporan tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/guru/penilaian", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan nilai" }, { status: 500 });
  }
}
