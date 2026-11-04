import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { isUuid } from "@/lib/student-session";
import { STARS_PER_POT } from "@/lib/daily-missions";
import { checkCardReport, getInvestigationCard, type CardReport } from "@/lib/investigation-cards";

export const dynamic = "force-dynamic";

interface SiswaRow {
  bintang: number;
  kelompok: { id: string; nama: string } | null;
}

interface MisiRow {
  pot: string;
  laporan: CardReport;
  nilai: number | null;
  umpan_balik: string | null;
  siswa: { nama: string } | null;
}

export async function GET(request: Request) {
  try {
    const siswaId = new URL(request.url).searchParams.get("siswaId");
    if (!isUuid(siswaId)) {
      return NextResponse.json({ success: false, error: "Data siswa tidak valid" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: siswa, error } = await supabase
      .from("siswa")
      .select("bintang, kelompok(id, nama)")
      .eq("id", siswaId)
      .maybeSingle()
      .overrideTypes<SiswaRow, { merge: false }>();
    if (error) throw error;
    if (!siswa) {
      return NextResponse.json({ success: false, error: "Siswa tidak ditemukan" }, { status: 404 });
    }
    if (!siswa.kelompok) {
      return NextResponse.json({ success: true, kelompok: null, anggota: [], selesai: [], laporan: {}, bintang: siswa.bintang });
    }

    const [{ data: rows, error: rowsError }, { data: anggota, error: anggotaError }] = await Promise.all([
      supabase
        .from("misi_kelompok")
        .select("pot, laporan, nilai, umpan_balik, siswa(nama)")
        .eq("kelompok_id", siswa.kelompok.id)
        .overrideTypes<MisiRow[], { merge: false }>(),
      supabase.from("siswa").select("nama").eq("kelompok_id", siswa.kelompok.id).order("nama"),
    ]);
    if (rowsError || anggotaError) throw rowsError ?? anggotaError;

    return NextResponse.json({
      success: true,
      kelompok: siswa.kelompok,
      anggota: (anggota ?? []).map((row) => row.nama),
      selesai: (rows ?? []).map((row) => row.pot),
      laporan: Object.fromEntries(
        (rows ?? []).map((row) => [
          row.pot,
          { ...row.laporan, pengirim: row.siswa?.nama, nilai: row.nilai, umpanBalik: row.umpan_balik },
        ])
      ),
      bintang: siswa.bintang,
    });
  } catch (err) {
    console.error("GET /api/siswa/misi-harian", err);
    return NextResponse.json({ success: false, error: "Gagal memuat misi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { siswaId, pot, laporan } = body ?? {};
    const card = typeof pot === "string" ? getInvestigationCard(pot) : undefined;
    if (!isUuid(siswaId) || !card) {
      return NextResponse.json({ success: false, error: "Data misi tidak valid" }, { status: 400 });
    }

    const { errors, report } = checkCardReport(card, laporan);
    if (!report) {
      return NextResponse.json({ success: false, error: "Laporan belum lengkap", errors }, { status: 422 });
    }

    const { data: bintang, error } = await getSupabaseAdmin().rpc("selesaikan_misi_kelompok", {
      p_siswa_id: siswaId,
      p_pot: card.pot,
      p_bintang: STARS_PER_POT,
      p_laporan: report,
    });
    if (error) throw error;
    if (bintang === null) {
      return NextResponse.json({ success: false, error: "Kartu ini tidak bisa dikirim" }, { status: 409 });
    }

    return NextResponse.json({ success: true, bintang, laporan: report });
  } catch (err) {
    console.error("POST /api/siswa/misi-harian", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan misi" }, { status: 500 });
  }
}
