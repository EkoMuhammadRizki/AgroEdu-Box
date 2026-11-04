/** Skor minimal untuk lulus (sertifikat) dan bintang pada percobaan pertama. */
export const QUIZ_PASS_SCORE = 80;

export const quizStars = (skor: number) => (skor >= QUIZ_PASS_SCORE ? 50 : 30);

export interface QuizSubmitResult {
  benar: number;
  total: number;
  skor: number;
  bintangDiberikan: number;
  bintang: number;
  percobaan: number;
}
