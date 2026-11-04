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
  } catch {
    // ignore
  }
}

/** Simpan perubahan bintang/karakter ke lokal lalu ke database. */
export async function updateStudentProgress(
  changes: Partial<Pick<StudentProfile, "stars" | "character">>
) {
  const profile = getStudentProfile();
  if (!profile) return;
  const updated = { ...profile, ...changes };
  saveStudentProfile(updated);
  await pushProgress(updated);
}

/** Dorong progres terakhir (menutup kegagalan sync sebelumnya), lalu hapus sesi dari perangkat. */
export async function logoutStudent() {
  const profile = getStudentProfile();
  if (profile) await pushProgress(profile);
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

async function pushProgress({ id, stars, character }: StudentProfile) {
  try {
    await fetch("/api/siswa/progres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siswaId: id, stars, character }),
      keepalive: true,
    });
  } catch {
    // Offline: nilai tetap ada di lokal dan dikirim ulang saat update/logout berikutnya.
  }
}
