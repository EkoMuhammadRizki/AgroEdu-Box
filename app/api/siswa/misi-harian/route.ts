import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { isUuid } from "@/lib/student-session";
import { DAILY_POTS, STARS_PER_POT, getTodayWib, type DailyPot } from "@/lib/daily-missions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const siswaId = new URL(request.url).searchParams.get("siswaId");
    if (!isUuid(siswaId)) {
      return NextResponse.json({ success: false, error: "Data siswa tidak valid" }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("misi_harian")
      .select("pot")
      .eq("siswa_id", siswaId)
      .eq("tanggal", getTodayWib());
    if (error) throw error;

    return NextResponse.json({ success: true, selesai: data.map((row) => row.pot) });
  } catch (err) {
    console.error("GET /api/siswa/misi-harian", err);
    return NextResponse.json({ success: false, error: "Gagal memuat misi harian" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { siswaId, pot } = body ?? {};
    if (!isUuid(siswaId) || !DAILY_POTS.includes(pot as DailyPot)) {
      return NextResponse.json({ success: false, error: "Data misi tidak valid" }, { status: 400 });
    }

    const { data: bintang, error } = await getSupabaseAdmin().rpc("selesaikan_misi_harian", {
      p_siswa_id: siswaId,
      p_tanggal: getTodayWib(),
      p_pot: pot,
      p_bintang: STARS_PER_POT,
    });
    if (error) throw error;
    if (bintang === null) {
      return NextResponse.json({ success: false, error: "Bukan giliran pot ini" }, { status: 409 });
    }

    return NextResponse.json({ success: true, bintang });
  } catch (err) {
    console.error("POST /api/siswa/misi-harian", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan misi" }, { status: 500 });
  }
}
