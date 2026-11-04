const NAME_KEY = "agro_guru_nama";
const EMAIL_KEY = "agro_guru_email";
/** Email yang diingat untuk mengisi form login. Bertahan walau guru keluar sesi. */
const INGAT_KEY = "agro_guru_ingat_email";
export const GURU_PROFILE_UPDATED_EVENT = "agro:guru-profile-updated";

/** Nama hanya untuk tampilan. Hak akses ditentukan cookie sesi yang diperiksa middleware. */
export function getGuruName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function getGuruEmail(): string {
  try {
    return localStorage.getItem(EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveGuruProfile({ nama, email }: { nama?: string; email?: string }) {
  try {
    if (typeof nama === "string" && nama.trim()) {
      localStorage.setItem(NAME_KEY, nama.trim());
    }
    if (typeof email === "string" && email.trim()) {
      localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(GURU_PROFILE_UPDATED_EVENT));
    }
  } catch {
    // ignore
  }
}

export function saveGuruName(nama: string) {
  saveGuruProfile({ nama });
}

/** Hanya email yang diingat, tidak pernah kata sandi. */
export function rememberGuruEmail(email: string | null) {
  try {
    if (email) localStorage.setItem(INGAT_KEY, email.trim().toLowerCase());
    else localStorage.removeItem(INGAT_KEY);
  } catch {
    // ignore
  }
}

export function getRememberedGuruEmail(): string {
  try {
    return localStorage.getItem(INGAT_KEY) ?? "";
  } catch {
    return "";
  }
}

export async function logoutGuru() {
  try {
    await fetch("/api/guru/logout", { method: "POST" });
    // Email yang diingat sengaja dibiarkan, supaya form login tetap terisi.
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(EMAIL_KEY);
  } catch {
    // ignore
  }
}
