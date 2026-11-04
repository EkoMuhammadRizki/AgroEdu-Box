/** Urutan di sini adalah urutan pengerjaan; harus sama dengan array di supabase/kartu-misi.sql. */
export const DAILY_POTS = ["A", "B", "C", "D"] as const;
export type DailyPot = (typeof DAILY_POTS)[number];

export const STARS_PER_POT = 10;
