import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { GURU_COOKIE, isValidGuruSession } from "./guru-session";

/** Middleware hanya menjaga halaman, jadi setiap API guru wajib memanggil ini. */
export async function requireGuru() {
  const store = await cookies();
  if (await isValidGuruSession(store.get(GURU_COOKIE)?.value)) return null;
  return NextResponse.json({ success: false, error: "Sesi guru berakhir" }, { status: 401 });
}
