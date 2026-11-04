import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { isUuid } from "@/lib/student-session";
import { STARS_PER_POT } from "@/lib/daily-missions";
import { checkCardReport, getInvestigationCard } from "@/lib/investigation-cards";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const siswaId = new URL(request.url).searchParams.get("siswaId");
    if (!isUuid(siswaId)) {
      return NextResponse.json({ success: false, error: "Data siswa tidak valid" }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("misi_harian")
      .select("pot, laporan")
      .eq("siswa_id", siswaId);
    if (error) throw error;

    return NextResponse.json({
      success: true,
      selesai: data.map((row) => row.pot),
      laporan: Object.fromEntries(data.map((row) => [row.pot, row.laporan])),
    });
  } catch (err) {
    console.error("GET /api/siswa/misi-harian", err);
    return NextResponse.json({ success: false, error: "Gagal memuat misi harian" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { siswaId, pot, laporan } = body ?? {};
    const card = typeof pot === "string" ? getInvestigationCard(pot) : undefined;
    if (!isUuid(siswaId) || !card) {
      return NextResponse.json({ success: false, error: "Data misi tidak valid" }, { status: 400 });
    }

    const { errors, report } = checkCardReport(card, laporan);
    if (!report) {
      return NextResponse.json({ success: false, error: "Laporan belum sesuai panduan", errors }, { status: 422 });
    }

    const { data: bintang, error } = await getSupabaseAdmin().rpc("selesaikan_misi_harian", {
      p_siswa_id: siswaId,
      p_pot: card.pot,
      p_bintang: STARS_PER_POT,
      p_laporan: report,
    });
    if (error) throw error;
    if (bintang === null) {
      return NextResponse.json({ success: false, error: "Bukan giliran pot ini" }, { status: 409 });
    }

    return NextResponse.json({ success: true, bintang, laporan: report });
  } catch (err) {
    console.error("POST /api/siswa/misi-harian", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan misi" }, { status: 500 });
  }
}
