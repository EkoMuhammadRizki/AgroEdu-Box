import { NextResponse } from "next/server";
import { GURU_COOKIE } from "@/lib/guru-session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(GURU_COOKIE);
  return response;
}
