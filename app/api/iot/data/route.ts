import { NextResponse } from "next/server";
import { readPots } from "@/lib/iot-store";

export const dynamic = "force-dynamic";

/** Dipanggil berkala oleh halaman siswa dan guru. Hanya data empat pot, tanpa data pribadi. */
export async function GET() {
  const devices = await readPots();
  return NextResponse.json({ success: true, devices });
}
