import type { DailyPot } from "./daily-missions";
import type { CardReport } from "./investigation-cards";
import { saveStudentProfile, type StudentProfile } from "./student-session";

export interface MissionStatus {
  kelompok: { id: string; nama: string } | null;
  anggota: string[];
  selesai: DailyPot[];
  laporan: Partial<Record<DailyPot, CardReport>>;
}

/** Sekaligus menyegarkan bintang lokal, karena teman sekelompok bisa menambahnya kapan saja. */
export async function fetchMissionStatus(profile: StudentProfile): Promise<MissionStatus> {
  const res = await fetch(`/api/siswa/misi-harian?siswaId=${profile.id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { kelompok, anggota, selesai, laporan, bintang } = await res.json();
  if (bintang !== profile.stars) saveStudentProfile({ ...profile, stars: bintang });
  return { kelompok, anggota, selesai, laporan };
}
