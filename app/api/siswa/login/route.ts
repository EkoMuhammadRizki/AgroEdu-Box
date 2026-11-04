import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { isUuid, type StudentCharacter, type StudentProfile } from "@/lib/student-session";

export const dynamic = "force-dynamic";

interface SiswaRow {
  id: string;
  nama: string;
  karakter: StudentCharacter;
  bintang: number;
  kelas: { id: string; nama: string; kode: string };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!isUuid(body?.siswaId)) {
      return NextResponse.json({ success: false, error: "Data siswa tidak valid" }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("siswa")
      .select("id, nama, karakter, bintang, kelas(id, nama, kode)")
      .eq("id", body.siswaId)
      .maybeSingle()
      .overrideTypes<SiswaRow, { merge: false }>();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: "Siswa tidak ditemukan" }, { status: 404 });
    }

    const profile: StudentProfile = {
      id: data.id,
      name: data.nama,
      classId: data.kelas.id,
      className: data.kelas.nama,
      classCode: data.kelas.kode,
      character: data.karakter,
      stars: data.bintang,
    };
    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error("POST /api/siswa/login", err);
    return NextResponse.json({ success: false, error: "Gagal masuk" }, { status: 500 });
  }
}
