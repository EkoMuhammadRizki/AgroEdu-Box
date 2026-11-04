import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { isUuid } from "@/lib/student-session";

export const dynamic = "force-dynamic";

const MAX_STARS_PER_REQUEST = 100;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { siswaId, addStars, character } = body ?? {};
    if (!isUuid(siswaId)) {
      return NextResponse.json({ success: false, error: "Data siswa tidak valid" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    if (character !== undefined) {
      if (character !== "original" && character !== "girl") {
        return NextResponse.json({ success: false, error: "Karakter tidak valid" }, { status: 400 });
      }
      const { error } = await supabase.from("siswa").update({ karakter: character }).eq("id", siswaId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (!Number.isInteger(addStars) || addStars < 1 || addStars > MAX_STARS_PER_REQUEST) {
      return NextResponse.json({ success: false, error: "Data progres tidak valid" }, { status: 400 });
    }
    const { data: bintang, error } = await supabase.rpc("tambah_bintang", {
      p_siswa_id: siswaId,
      p_tambah: addStars,
    });
    if (error) throw error;

    return NextResponse.json({ success: true, bintang });
  } catch (err) {
    console.error("POST /api/siswa/progres", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan progres" }, { status: 500 });
  }
}
