/** Urutan di sini adalah urutan pengerjaan; harus sama dengan array di supabase/misi-harian.sql. */
export const DAILY_POTS = ["A", "B", "C", "D"] as const;
export type DailyPot = (typeof DAILY_POTS)[number];

export const STARS_PER_POT = 10;

/** Pergantian hari mengikuti WIB, bukan UTC server, agar misi reset tengah malam di sekolah. */
export function getTodayWib() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}
