export type StudentCharacter = "original" | "girl";

export interface StudentProfile {
  id: string;
  name: string;
  classId: string;
  className: string;
  classCode: string;
  character: StudentCharacter;
  stars: number;
}

const STORAGE_KEY = "agro_student_profile";
export const PROFILE_UPDATED_EVENT = "agro-profile-updated";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

/** Null bila belum login, termasuk profil lama (`siswa-<timestamp>`) dari sebelum ada database. */
export function getStudentProfile(): StudentProfile | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return isUuid(parsed?.id) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveStudentProfile(profile: StudentProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  } catch {
    // ignore
  }
}

export async function updateStudentCharacter(character: StudentCharacter) {
  const profile = getStudentProfile();
  if (!profile) return;
  saveStudentProfile({ ...profile, character });
  await postProgress({ siswaId: profile.id, character });
}

/** Tambah bintang di server, lalu pakai total dari server sebagai nilai lokal. */
export async function addStudentStars(amount: number) {
  const profile = getStudentProfile();
  if (!profile) return;
  saveStudentProfile({ ...profile, stars: profile.stars + amount });
  const res = await postProgress({ siswaId: profile.id, addStars: amount });
  const bintang = res?.ok ? (await res.json()).bintang : undefined;
  const latest = getStudentProfile();
  if (latest && typeof bintang === "number") saveStudentProfile({ ...latest, stars: bintang });
}

export function logoutStudent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

async function postProgress(body: Record<string, unknown>) {
  try {
    return await fetch("/api/siswa/progres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    return null;
  }
}
