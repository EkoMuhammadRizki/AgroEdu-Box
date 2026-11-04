import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { isUuid } from "@/lib/student-session";

export const dynamic = "force-dynamic";

const MAX_STARS = 100_000;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { siswaId, stars, character } = body ?? {};
    const validStars = Number.isInteger(stars) && stars >= 0 && stars <= MAX_STARS;
    const validCharacter = character === "original" || character === "girl";
    if (!isUuid(siswaId) || !validStars || !validCharacter) {
      return NextResponse.json({ success: false, error: "Data progres tidak valid" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("siswa")
      .update({ bintang: stars, karakter: character })
      .eq("id", siswaId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/siswa/progres", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan progres" }, { status: 500 });
  }
}
