import { NextResponse } from "next/server";
import { requireGuru } from "@/lib/guru-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireGuru();
  if (denied) return denied;

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    // Menghapus kelompok ikut menghapus laporannya, jadi kelompok yang sudah bekerja dikunci.
    const { count, error: countError } = await supabase
      .from("misi_kelompok")
      .select("pot", { count: "exact", head: true })
      .eq("kelompok_id", id);
    if (countError) throw countError;
    if (count) {
      return NextResponse.json(
        { success: false, error: "Kelompok ini sudah mengirim laporan, jadi tidak bisa dihapus." },
        { status: 409 }
      );
    }

    const { error } = await supabase.from("kelompok").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/guru/kelompok/[id]", err);
    return NextResponse.json({ success: false, error: "Gagal menghapus kelompok" }, { status: 500 });
  }
}
