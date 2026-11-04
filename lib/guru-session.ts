import { SignJWT, jwtVerify } from "jose";

export const GURU_COOKIE = "agro_guru_session";
export const GURU_SESSION_SECONDS = 60 * 60 * 24;
/** Dipakai bila guru mencentang "Ingat saya" di perangkat miliknya sendiri. */
export const GURU_REMEMBER_SECONDS = 60 * 60 * 24 * 30;

function getKey() {
  const secret = process.env.GURU_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("GURU_SESSION_SECRET belum diisi (minimal 32 karakter)");
  }
  return new TextEncoder().encode(secret);
}

export function createGuruSession(guruId: string, seconds = GURU_SESSION_SECONDS) {
  return new SignJWT()
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(guruId)
    .setIssuedAt()
    .setExpirationTime(`${seconds}s`)
    .sign(getKey());
}

export async function isValidGuruSession(token: string | undefined) {
  if (!token) return false;
  try {
    await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function getGuruIdFromSession(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
