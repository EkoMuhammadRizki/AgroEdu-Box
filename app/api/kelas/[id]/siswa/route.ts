import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Hanya id & nama: NISN, No. Induk, dan jenis kelamin tidak boleh keluar ke browser.
    const { data, error } = await getSupabaseAdmin()
      .from("siswa")
      .select("id, nama")
      .eq("kelas_id", id)
      .order("nama");
    if (error) throw error;

    return NextResponse.json({ success: true, siswa: data });
  } catch (err) {
    console.error("GET /api/kelas/[id]/siswa", err);
    return NextResponse.json({ success: false, error: "Gagal memuat daftar siswa" }, { status: 500 });
  }
}
