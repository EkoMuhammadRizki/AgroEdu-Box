import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GURU_COOKIE, getGuruIdFromSession } from "@/lib/guru-session";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = await cookies();
    const guruId = await getGuruIdFromSession(store.get(GURU_COOKIE)?.value);
    if (!guruId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("guru")
      .select("id, nama, email")
      .eq("id", guruId)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Data guru tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, guru: { id: data.id, nama: data.nama, email: data.email } });
  } catch (err) {
    console.error("GET /api/guru/me", err);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const store = await cookies();
    const guruId = await getGuruIdFromSession(store.get(GURU_COOKIE)?.value);
    if (!guruId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const nama = typeof body?.nama === "string" ? body.nama.trim() : "";
    if (!nama) {
      return NextResponse.json({ success: false, error: "Nama wajib diisi" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("guru")
      .update({ nama })
      .eq("id", guruId);

    if (error) throw error;
    return NextResponse.json({ success: true, nama });
  } catch (err) {
    console.error("PATCH /api/guru/me", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui profil" }, { status: 500 });
  }
}

