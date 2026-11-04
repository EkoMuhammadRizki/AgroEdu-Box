import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { isUuid } from "@/lib/student-session";
import { bersihkanJawaban, type LkpdJawaban } from "@/lib/lkpd";

export const dynamic = "force-dynamic";

interface SiswaRow {
  kelompok: { id: string; nama: string } | null;
}

const gagal = (error: string, status: number) => NextResponse.json({ success: false, error }, { status });

export async function GET(request: Request) {
  try {
    const siswaId = new URL(request.url).searchParams.get("siswaId");
    if (!isUuid(siswaId)) return gagal("Data siswa tidak valid", 400);

    const supabase = getSupabaseAdmin();
    const { data: siswa, error } = await supabase
      .from("siswa")
      .select("kelompok(id, nama)")
      .eq("id", siswaId)
      .maybeSingle()
      .overrideTypes<SiswaRow, { merge: false }>();
    if (error) throw error;
    if (!siswa) return gagal("Siswa tidak ditemukan", 404);

    const [refleksi, kelompokLkpd] = await Promise.all([
      supabase.from("lkpd_refleksi").select("jawaban").eq("siswa_id", siswaId).maybeSingle(),
      siswa.kelompok
        ? supabase
            .from("lkpd_kelompok")
            .select("jawaban, diperbarui_at, nilai, umpan_balik, dinilai_at, dinilai_oleh")
            .eq("kelompok_id", siswa.kelompok.id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);
    if (refleksi.error) throw refleksi.error;
    if (kelompokLkpd.error) throw kelompokLkpd.error;

    // Nama guru penilai diambil terpisah agar kolom lain tabel guru tidak ikut terbawa.
    let dinilaiOleh: string | null = null;
    const idPenilai = kelompokLkpd.data?.dinilai_oleh;
    if (idPenilai) {
      const { data: guru } = await supabase.from("guru").select("nama").eq("id", idPenilai).maybeSingle();
      dinilaiOleh = guru?.nama ?? null;
    }

    return NextResponse.json({
      success: true,
      kelompok: siswa.kelompok,
      jawabanKelompok: (kelompokLkpd.data?.jawaban ?? {}) as LkpdJawaban,
      jawabanRefleksi: (refleksi.data?.jawaban ?? {}) as LkpdJawaban,
      diperbaruiAt: kelompokLkpd.data?.diperbarui_at ?? null,
      penilaian: {
        nilai: kelompokLkpd.data?.nilai ?? null,
        umpanBalik: kelompokLkpd.data?.umpan_balik ?? null,
        dinilaiAt: kelompokLkpd.data?.dinilai_at ?? null,
        dinilaiOleh,
      },
    });
  } catch (err) {
    console.error("GET /api/siswa/lkpd", err);
    return gagal("Gagal memuat LKPD", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { siswaId, lingkup, jawaban } = body ?? {};
    if (!isUuid(siswaId)) return gagal("Data siswa tidak valid", 400);
    if (lingkup !== "kelompok" && lingkup !== "siswa") return gagal("Lingkup tidak dikenal", 400);

    // Isian dari browser dibersihkan dulu: isian asing dibuang, teks dipotong,
    // angka di luar batas ditolak.
    const bersih = bersihkanJawaban(lingkup, jawaban);
    if (Object.keys(bersih).length === 0) {
      return NextResponse.json({ success: true, tersimpan: 0 });
    }

    const supabase = getSupabaseAdmin();
    if (lingkup === "siswa") {
      const { error } = await supabase.rpc("simpan_lkpd_refleksi", { p_siswa_id: siswaId, p_jawaban: bersih });
      if (error) {
        if (error.message.includes("siswa_tidak_ada")) return gagal("Siswa tidak ditemukan", 404);
        throw error;
      }
    } else {
      // Kelompok tujuan ditentukan server dari data siswa, bukan dari browser.
      const { error } = await supabase.rpc("simpan_lkpd_kelompok", { p_siswa_id: siswaId, p_jawaban: bersih });
      if (error) {
        if (error.message.includes("tanpa_kelompok")) {
          return gagal("Kamu belum punya kelompok, jadi LKPD kelompok belum bisa diisi.", 409);
        }
        throw error;
      }
    }

    return NextResponse.json({ success: true, tersimpan: Object.keys(bersih).length });
  } catch (err) {
    console.error("POST /api/siswa/lkpd", err);
    return gagal("Gagal menyimpan LKPD", 500);
  }
}
