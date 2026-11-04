import { NextResponse } from "next/server";
import { requireGuru } from "@/lib/guru-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/** Membuat kelompok baru dengan nomor terkecil yang belum dipakai di kelas itu. */
export async function POST(request: Request) {
  const denied = await requireGuru();
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => null);
    const kelasId = typeof body?.kelasId === "string" ? body.kelasId : "";
    const supabase = getSupabaseAdmin();

    const { data: kelas, error: kelasError } = await supabase
      .from("kelas")
      .select("kode")
      .eq("id", kelasId)
      .maybeSingle();
    if (kelasError) throw kelasError;
    if (!kelas) return NextResponse.json({ success: false, error: "Kelas tidak ditemukan" }, { status: 404 });

    const { data: existing, error: existingError } = await supabase
      .from("kelompok")
      .select("nama")
      .eq("kelas_id", kelasId);
    if (existingError) throw existingError;

    const used = new Set(existing.map((k) => k.nama));
    let nomor = 1;
    while (used.has(`Kelompok ${nomor}`)) nomor += 1;

    const { error } = await supabase.from("kelompok").insert({
      id: `${kelas.kode.toLowerCase()}-${nomor}`,
      kelas_id: kelasId,
      nama: `Kelompok ${nomor}`,
    });
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/guru/kelompok", err);
    return NextResponse.json({ success: false, error: "Gagal membuat kelompok" }, { status: 500 });
  }
}
