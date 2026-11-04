import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { isUuid } from "@/lib/student-session";
import { mockQuizzes } from "@/lib/mock-data";
import { quizStars } from "@/lib/quiz";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { siswaId, kuisId, jawaban } = body ?? {};
    const quiz = mockQuizzes.find((q) => q.id === kuisId);
    if (!isUuid(siswaId) || !quiz) {
      return NextResponse.json({ success: false, error: "Data kuis tidak valid" }, { status: 400 });
    }
    const valid =
      Array.isArray(jawaban) &&
      jawaban.length === quiz.questions.length &&
      jawaban.every((a, i) => Number.isInteger(a) && a >= 0 && a < quiz.questions[i].options.length);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Semua soal harus dijawab" }, { status: 400 });
    }

    // Skor dihitung di sini: angka dari browser tidak dipercaya.
    const benar = quiz.questions.filter((q, i) => jawaban[i] === q.correctIndex).length;
    const total = quiz.questions.length;
    const skor = Math.round((benar / total) * 100);

    const { data, error } = await getSupabaseAdmin().rpc("kirim_kuis", {
      p_siswa_id: siswaId,
      p_kuis_id: quiz.id,
      p_benar: benar,
      p_total: total,
      p_jawaban: jawaban,
      p_bintang_pertama: quizStars(skor),
    });
    if (error) {
      if (error.message.includes("siswa_tidak_ada")) {
        return NextResponse.json({ success: false, error: "Siswa tidak ditemukan" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, benar, total, skor, ...data });
  } catch (err) {
    console.error("POST /api/siswa/kuis", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan hasil kuis" }, { status: 500 });
  }
}
