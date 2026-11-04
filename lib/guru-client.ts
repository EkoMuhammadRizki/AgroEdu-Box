const NAME_KEY = "agro_guru_nama";

/** Nama hanya untuk tampilan. Hak akses ditentukan cookie sesi yang diperiksa middleware. */
export function getGuruName() {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveGuruName(nama: string) {
  try {
    localStorage.setItem(NAME_KEY, nama);
  } catch {
    // ignore
  }
}

export async function logoutGuru() {
  try {
    await fetch("/api/guru/logout", { method: "POST" });
    localStorage.removeItem(NAME_KEY);
  } catch {
    // ignore
  }
}
