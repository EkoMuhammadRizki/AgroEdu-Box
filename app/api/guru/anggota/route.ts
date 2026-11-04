import { NextResponse } from "next/server";
import { requireGuru } from "@/lib/guru-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { isUuid } from "@/lib/student-session";
import { MAX_ANGGOTA_KELOMPOK } from "@/lib/guru-data";

export const dynamic = "force-dynamic";

/** kelompokId null berarti mengeluarkan siswa dari kelompoknya. */
export async function POST(request: Request) {
  const denied = await requireGuru();
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => null);
    const { kelasId, kelompokId, siswaIds } = body ?? {};
    const validIds = Array.isArray(siswaIds) && siswaIds.length > 0 && siswaIds.every(isUuid);
    if (typeof kelasId !== "string" || !validIds || (kelompokId !== null && typeof kelompokId !== "string")) {
      return NextResponse.json({ success: false, error: "Data tidak valid" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    if (kelompokId) {
      const { data: kelompok, error: kelompokError } = await supabase
        .from("kelompok")
        .select("id")
        .eq("id", kelompokId)
        .eq("kelas_id", kelasId)
        .maybeSingle();
      if (kelompokError) throw kelompokError;
      if (!kelompok) {
        return NextResponse.json({ success: false, error: "Kelompok tidak ada di kelas ini" }, { status: 404 });
      }

      const { data: anggota, error: anggotaError } = await supabase
        .from("siswa")
        .select("id")
        .eq("kelompok_id", kelompokId);
      if (anggotaError) throw anggotaError;

      const total = new Set([...anggota.map((s) => s.id), ...siswaIds]).size;
      if (total > MAX_ANGGOTA_KELOMPOK) {
        return NextResponse.json(
          { success: false, error: `Satu kelompok maksimal ${MAX_ANGGOTA_KELOMPOK} siswa.` },
          { status: 409 }
        );
      }
    }

    const { error } = await supabase
      .from("siswa")
      .update({ kelompok_id: kelompokId })
      .in("id", siswaIds)
      .eq("kelas_id", kelasId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/guru/anggota", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan anggota" }, { status: 500 });
  }
}
