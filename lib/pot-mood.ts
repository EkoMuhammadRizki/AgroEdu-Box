import type { BibooMood } from "@/components/agro/biboo-mascot";

export type MoodTone = "ok" | "warn" | "bad" | "off";

export interface PotMood {
  mood: BibooMood;
  tone: MoodTone;
  /** Satu kata untuk lencana, misalnya "Hangat". */
  label: string;
  /** Ucapan Si Tunas, ditulis sebagai gelembung bicara. */
  say: string;
  /** Penjelasan singkat untuk anak. */
  hint: string;
  /** Indeks emoji pada skala: 0 = kurang, 1 = pas, 2 = berlebih. */
  step: 0 | 1 | 2;
}

// Batas mudah diubah. Kelembapan mengikuti Kartu Investigasi: kritis < 30%, ideal 50-80%.
export const TEMP_COLD_BELOW = 24;
export const TEMP_HOT_ABOVE = 32;
export const SOIL_DRY_BELOW = 30;
export const SOIL_OK_FROM = 50;
export const SOIL_WET_ABOVE = 80;

const SLEEPING: Omit<PotMood, "say" | "hint"> = { mood: "sleepy", tone: "off", label: "Tidur", step: 1 };

export function temperatureMood(value: number, live: boolean): PotMood {
  if (!live) {
    return { ...SLEEPING, say: "Zzz... aku tidur.", hint: "Nyalakan alatnya dulu ya, supaya aku bangun!" };
  }
  if (value < TEMP_COLD_BELOW) {
    return { mood: "cold", tone: "bad", label: "Dingin", step: 0, say: "Brrr... dingin! Daunku jadi layu.", hint: "Udara terlalu dingin untuk tanaman." };
  }
  if (value > TEMP_HOT_ABOVE) {
    return { mood: "hot", tone: "warn", label: "Panas", step: 2, say: "Huft... panas sekali!", hint: "Udara terlalu panas, tanaman kepanasan." };
  }
  return { mood: "happy", tone: "ok", label: "Hangat", step: 1, say: "Hangat sekali! Aku senang!", hint: "Suhu udara pas untuk tanaman." };
}

export function moistureMood(value: number, live: boolean): PotMood {
  if (!live) {
    return { ...SLEEPING, say: "Zzz... aku tidur.", hint: "Nyalakan alatnya dulu ya, supaya aku bangun!" };
  }
  if (value < SOIL_DRY_BELOW) {
    return { mood: "sad", tone: "bad", label: "Kering", step: 0, say: "Aku haus... tanahku kering!", hint: "Tanah kering sekali, tanaman butuh air." };
  }
  if (value < SOIL_OK_FROM) {
    return { mood: "thinking", tone: "warn", label: "Agak kering", step: 0, say: "Hmm, tanahku mulai kering...", hint: "Tanah mulai kering, tanaman mau minum sedikit." };
  }
  if (value > SOIL_WET_ABOVE) {
    return { mood: "soggy", tone: "warn", label: "Terlalu basah", step: 2, say: "Ups! Tanahku terlalu basah.", hint: "Air terlalu banyak, akar sulit bernapas." };
  }
  return { mood: "happy", tone: "ok", label: "Pas", step: 1, say: "Segar! Tanahnya pas banget!", hint: "Kelembapan tanah pas untuk tanaman." };
}
