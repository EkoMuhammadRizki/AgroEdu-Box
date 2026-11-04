import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("kelas")
      .select("id, nama, kode, siswa(count)")
      .order("nama");
    if (error) throw error;

    const kelas = data.map(({ id, nama, kode, siswa }) => ({
      id,
      nama,
      kode,
      jumlahSiswa: siswa[0]?.count ?? 0,
    }));
    return NextResponse.json({ success: true, kelas });
  } catch (err) {
    console.error("GET /api/kelas", err);
    return NextResponse.json({ success: false, error: "Gagal memuat daftar kelas" }, { status: 500 });
  }
}
