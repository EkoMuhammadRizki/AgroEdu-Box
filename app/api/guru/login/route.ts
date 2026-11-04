import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { GURU_COOKIE, GURU_SESSION_SECONDS, createGuruSession } from "@/lib/guru-session";

export const dynamic = "force-dynamic";

// Hash acak: email tak terdaftar tetap melewati bcrypt, jadi waktu respons
// tidak membocorkan email mana yang terdaftar.
const UNKNOWN_USER_HASH = "$2b$10$ck2lkXKSoO3hWKg5KQmeP.5NaQde0tm6y4hxXJyIQ6JTDL1rhNX86";
const MAX_PASSWORD_LENGTH = 200;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!email || !password || password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json({ success: false, error: "Email atau kata sandi salah" }, { status: 401 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("guru")
      .select("id, nama, password_hash")
      .eq("email", email)
      .maybeSingle();
    if (error) throw error;

    const matches = await bcrypt.compare(password, data?.password_hash ?? UNKNOWN_USER_HASH);
    if (!data || !matches) {
      return NextResponse.json({ success: false, error: "Email atau kata sandi salah" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, nama: data.nama, email });
    response.cookies.set(GURU_COOKIE, await createGuruSession(data.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: GURU_SESSION_SECONDS,
    });
    return response;
  } catch (err) {
    console.error("POST /api/guru/login", err);
    return NextResponse.json({ success: false, error: "Gagal masuk" }, { status: 500 });
  }
}
