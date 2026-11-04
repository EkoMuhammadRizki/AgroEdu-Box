import { DAILY_POTS, type DailyPot } from "./daily-missions";

export type BuzzerStatus = "berbunyi" | "tenang";

export interface InvestigationCard {
  pot: DailyPot;
  number: number;
  code: string;
  title: string;
  focus: string;
  color: string;
  greeting: string;
  specs: { label: string; value: string }[];
  steps: { title: string; detail: string }[];
  questions: { title: string; text: string }[];
  successIndicator: string;
  /** Kartu dengan uji siram wajib mencatat kelembapan setelah disiram. */
  wateringTest: boolean;
}

export interface CardReport {
  moisture: number;
  moistureAfter?: number;
  temperature: number;
  buzzer: BuzzerStatus;
  answers: string[];
}

const MIN_ANSWER_LENGTH = 15;
const MAX_ANSWER_LENGTH = 2000;

export const INVESTIGATION_CARDS: InvestigationCard[] = [
  {
    pot: "A",
    number: 1,
    code: "AEB-POT-A",
    title: "Kasus Tanah Tandus Tanpa Air (Tanah Biasa Kering)",
    focus: "Dampak Defisit Air (Kekeringan Ekstrem) & Respons Peringatan Dini Alarm Buzzer IoT",
    color: "#B71C1C",
    greeting:
      "Lihatlah Pot A! Tanahnya tampak pucat, berdebu, dan retak-retak seperti sawah saat kemarau panjang. Batang tanaman di dalamnya terkulai lemas. Ayo tancapkan sensor garpu A0 milikmu dan dengarkan apa yang diteriakkan oleh Buzzer D8!",
    specs: [
      { label: "Komposisi Media Tanam", value: "100% Tanah Biasa (Tanpa Campuran Pupuk Kompos Organik)" },
      { label: "Perlakuan Air Awal", value: "0 mL / Tanpa Penyiraman Air (Kondisi Sangat Kering)" },
      { label: "Acuan Sensor Tanah (A0)", value: "< 30% (Rentang Kritis 10% – 25% | Indikator Layar: MERAH [KRITIS])" },
      { label: "Respons Buzzer (D8)", value: "BERBUNYI 'Bip.. Bip..!' [ALARM AKTIF] (Peringatan Tanaman Kehausan Ekstrem!)" },
      { label: "Kondisi Fisik Tanaman", value: "Daun menguning/menggulung, batang layu terkulai, tanah keras/retak" },
    ],
    steps: [
      { title: "Pengamatan Fisik Awal", detail: "Amati warna tanah, tekstur permukaan tanah, dan kondisi daun/batang tanaman pada Pot A sebelum diuji." },
      { title: "Pengujian Sensor IoT", detail: "Tancapkan garpu Sensor Soil Moisture (A0) sedalam 3–4 cm di dekat perakaran Pot A dan letakkan Sensor Suhu DHT22 (D2) di dekat pot." },
      { title: "Pembacaan Dashboard & Alarm", detail: "Catat angka kelembapan (%) dan suhu (°C) yang muncul di layar 'Stasiun Kebun IoT Live'. Perhatikan warna indikator layar dan dengarkan bunyi Buzzer D8!" },
      { title: "Aksi Penyelamatan Darurat (Uji Siram)", detail: "Gunakan botol penyiram untuk menyiramkan 40 mL air secara perlahan ke Pot A. Amati kenaikan angka kelembapan di layar hingga alarm buzzer berhenti berbunyi!" },
    ],
    questions: [
      { title: "Analisis Sensor IoT", text: "Berapa angka kelembapan (%) pada Pot A saat alarm buzzer berbunyi, dan pada angka berapa alarm tersebut berhenti setelah disiram air?" },
      { title: "Analisis Biologi Tumbuhan", text: "Mengapa batang tanaman pada Pot A menjadi lemas/layu ketika tanah kehilangan air? Apa fungsi air bagi tekanan tegak (turgor) batang dan proses fotosintesis?" },
    ],
    successIndicator: "Siswa berhasil mencatat data kelembapan Pot A (< 30%), menjelaskan penyebab bunyi alarm Buzzer D8, dan mendemonstrasikan penyiraman penyelamatan hingga indikator berubah hijau.",
    wateringTest: true,
  },
  {
    pot: "B",
    number: 2,
    code: "AEB-POT-B",
    title: "Kasus Hidrasi Seimbang Tanpa Pupuk (Tanah Biasa Lembap)",
    focus: "Peran Air Ideal (50%–80%) dalam Menjaga Kesegaran Tanaman & Keterbatasan Unsur Hara",
    color: "#0277BD",
    greeting:
      "Sekarang pindah ke Pot B! Bersihkan dulu ujung garpu sensor A0 dengan tisu kering ya! Di Pot B ini, tanahnya rutin disiram air sehingga terasa sejuk dan basah, tetapi belum diberi pupuk kompos. Kira-kira bagaimana pembacaan sensornya dan bagaimana pertumbuhan tanamannya?",
    specs: [
      { label: "Komposisi Media Tanam", value: "100% Tanah Biasa (Tanpa Tambahan Pupuk Kompos Organik)" },
      { label: "Perlakuan Air Awal", value: "Disiram Terukur 40 mL Air Bersih / Hari (Kondisi Lembap)" },
      { label: "Acuan Sensor Tanah (A0)", value: "50% – 80% (Kondisi Lembap Ideal | Indikator Layar: HIJAU [IDEAL])" },
      { label: "Respons Buzzer (D8)", value: "TENANG / TIDAK BERBUNYI [ALARM NONAKTIF] (Kebutuhan Air Terpenuhi)" },
      { label: "Kondisi Fisik Tanaman", value: "Batang tegak segar dan benih tumbuh normal, namun ukuran daun sedang dan kurang rimbun" },
    ],
    steps: [
      { title: "Kalibrasi Kebersihan Sensor", detail: "Pastikan garpu Sensor Soil Moisture (A0) sudah dilap bersih dan kering setelah dicabut dari Pot A." },
      { title: "Pengujian Sensor pada Pot B", detail: "Tancapkan Sensor A0 ke dalam media tanah Pot B dan amati perubahan grafik secara langsung pada layar 'Stasiun Kebun IoT Live'." },
      { title: "Pencatatan Data Komparatif", detail: "Catat persentase kelembapan tanah (%), suhu udara (°C), dan status Buzzer D8. Bandingkan tinggi batang dan kesegaran daun Pot B dengan Pot A!" },
      { title: "Uji Pikir Kritis (Jangan Berlebihan Air)", detail: "Diskusikan: jika kelembapan sudah 65%–75% (Hijau), apakah kita boleh menyiramnya terus hingga tergenang becek (> 95%)? Pindai QR untuk mengecek jawabannya!" },
    ],
    questions: [
      { title: "Perbandingan Pot A vs Pot B", text: "Mengapa tanaman pada Pot B dapat berdiri tegak dan segar sedangkan Pot A layu, padahal keduanya sama-sama menggunakan tanah biasa tanpa pupuk?" },
      { title: "Prediksi Pertumbuhan Jangka Panjang", text: "Jika tanaman di Pot B hanya diberi air terus-menerus selama berbulan-bulan tanpa pernah diberi pupuk organik, mengapa lama-kelamaan pertumbuhannya melambat dan daunnya pucat?" },
    ],
    successIndicator: "Siswa berhasil membuktikan rentang kelembapan ideal (50%–80%) pada layar IoT dan menjelaskan bahwa air menjaga kesegaran tanaman namun belum cukup menyediakan seluruh nutrisi pertumbuhan.",
    wateringTest: false,
  },
  {
    pot: "C",
    number: 3,
    code: "AEB-POT-C",
    title: "Misteri Pupuk Melimpah Tanpa Air (Tanah Pupuk Kering)",
    focus: "Membuktikan Bahwa Nutrisi Pupuk Tidak Dapat Diserap Akar Tanpa Pelarut Air",
    color: "#E65100",
    greeting:
      "Inilah teka-teki paling seru bagi Detektif Sains! Di Pot C, petani sudah mencampurkan banyak sekali Pupuk Kompos Organik yang bergizi tinggi. Tapi anehnya, tanaman di Pot C tetap layu merana! Ayo tancapkan sensor A0 ke Pot C dan pecahkan misteri mengapa makanan yang banyak itu tidak bisa dimakan oleh akar!",
    specs: [
      { label: "Komposisi Media Tanam", value: "Tanah + Campuran Pupuk Kompos Organik Kaya Unsur Hara (N, P, K & Humus)" },
      { label: "Perlakuan Air Awal", value: "0 mL / Tanpa Penyiraman Air (Kondisi Pupuk Kering Kerontang)" },
      { label: "Acuan Sensor Tanah (A0)", value: "< 30% (Rentang Kritis 15% – 28% | Indikator Layar: MERAH [KRITIS])" },
      { label: "Respons Buzzer (D8)", value: "BERBUNYI 'Bip.. Bip..!' [ALARM AKTIF] (Tanaman Kelaparan & Kehausan di Tengah Pupuk!)" },
      { label: "Kondisi Fisik Tanaman", value: "Tanaman tetap layu/kerdil meskipun tanahnya berwarna gelap kaya pupuk kompos" },
    ],
    steps: [
      { title: "Pengujian Sensor IoT pada Pot C (Sebelum Disiram)", detail: "Tancapkan Sensor A0 ke Pot C. Amati angka kelembapan (< 30%) dan bunyi Buzzer D8. Catat pada kolom 'Pot C Sebelum Disiram' di LKPD!" },
      { title: "Penyelidikan Visual AR", detail: "Pindai kode QR pada kartu ini untuk melihat animasi mikroskopis rambut akar tanaman di tanah kering berpupuk." },
      { title: "Eksperimen Pembuktian 'Kunci Pelarut Air'", detail: "Sekarang tuangkan 40 mL air bersih secara merata ke permukaan Pot C menggunakan botol penyiram Mini Farming Kit." },
      { title: "Pengamatan Perubahan Real-Time", detail: "Amati layar 'Stasiun Kebun IoT Live'! Catat kenaikan angka kelembapan tanah hingga mencapai 50%–80% (Hijau) dan berhentinya alarm buzzer pada kolom 'Uji Siram Pot C'!" },
    ],
    questions: [
      { title: "Pertanyaan HOTS Utama", text: "Mengapa akar tanaman pada Pot C tidak bisa mengambil vitamin/unsur hara dari pupuk kompos saat kelembapan tanah di bawah 30%? (Petunjuk: Apakah akar punya gigi untuk mengunyah pupuk padat?)" },
      { title: "Kesimpulan Eksperimen Pot C", text: "Apa peran air terhadap pupuk kompos setelah kalian menyiram Pot C hingga kelembapannya naik ke 65%?" },
    ],
    successIndicator: "Siswa berhasil menyimpulkan prinsip ilmiah utama bahwa unsur hara dari pupuk padat harus dilarutkan oleh air terlebih dahulu menjadi larutan hara agar dapat diserap oleh rambut akar tanaman.",
    wateringTest: true,
  },
  {
    pot: "D",
    number: 4,
    code: "AEB-POT-D",
    title: "Formula Juara Panen Subur (Tanah Pupuk + Lembap Ideal)",
    focus: "Harmoni Komponen Abiotik (Air + Unsur Hara Kompos + Suhu/Cahaya) untuk Ketahanan Pangan",
    color: "#1B5E20",
    greeting:
      "Selamat datang di Pot D, sang Juara Kebun AGRO EDU BOX! Lihatlah betapa tingginya batang tanaman ini dan betapa hijau lebatnya daun-daunnya! Ayo kita buktikan dengan data sensor IoT mengapa Pot D menjadi formula terbaik bagi para petani di daerah kita!",
    specs: [
      { label: "Komposisi Media Tanam", value: "Tanah Gembur + Campuran Pupuk Kompos Organik Kaya Humus & Mikroba Baik" },
      { label: "Perlakuan Air Awal", value: "Disiram Terukur 40 mL Air Bersih (Kelembapan Terjaga Stabil)" },
      { label: "Acuan Sensor Tanah (A0)", value: "50% – 80% (Kelembapan Optimal & Stabil | Indikator Layar: HIJAU [OPTIMAL])" },
      { label: "Respons Buzzer (D8)", value: "TENANG / TIDAK BERBUNYI [ALARM NONAKTIF] (Ekosistem Perakaran Harmonis)" },
      { label: "Kondisi Fisik Tanaman", value: "JUARA SUBUR! Batang paling tinggi & kokoh, daun paling rimbun dan hijau pekat" },
    ],
    steps: [
      { title: "Pengujian Sensor IoT pada Pot D", detail: "Bersihkan sensor garpu A0, lalu tancapkan ke dalam Pot D. Catat persentase kelembapan tanah (%), suhu udara DHT22 (°C), dan status Buzzer D8." },
      { title: "Pengamatan Daya Ikat Air Humus", detail: "Sentuh dan amati tekstur tanah berpupuk kompos pada Pot D menggunakan garpu tanah mini. Perhatikan betapa gembur dan sejuknya tanah kompos dalam menyimpan air!" },
      { title: "Analisis Komparatif 4 Pot (Pot A, B, C, dan D)", detail: "Bandingkan seluruh data tabel dari Pot A, Pot B, Pot C, dan Pot D bersama kelompokmu." },
      { title: "Pengiriman Data ke Guru", detail: "Setelah tabel ke-4 pot lengkap, masukkan angkanya ke fitur 'LKPD Digital' di tablet dan tekan tombol [ Kirim ke Guru (AGRO EDU TRACK) ]!" },
    ],
    questions: [
      { title: "Analisis Perbandingan Pot B vs Pot D", text: "Pot B dan Pot D sama-sama memiliki kelembapan air yang ideal (50%–80%), tetapi mengapa tanaman pada Pot D tumbuh jauh lebih subur, tinggi, dan berdaun lebat dibandingkan Pot B?" },
      { title: "Fungsi Ganda Kompos Organik", text: "Selain memberi makanan (unsur hara) bagi akar, mengapa tanah yang dicampur kompos (Pot D) mampu menahan kelembapan air lebih lama saat cuaca panas dibandingkan tanah berpasir?" },
    ],
    successIndicator: "Siswa berhasil melengkapi tabel perbandingan 4 pot secara utuh, mengirimkan data ke AGRO EDU TRACK, dan menyimpulkan bahwa perpaduan nutrisi kompos + air ideal adalah kunci ketahanan pangan.",
    wateringTest: false,
  },
];

export function getInvestigationCard(pot: string) {
  return INVESTIGATION_CARDS.find((card) => card.pot === pot.toUpperCase());
}

const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

/**
 * Dipakai di form dan API, jadi syarat selesai tidak bisa dilewati lewat browser.
 * Angka sensor dicatat apa adanya: hanya kelengkapannya yang diperiksa, bukan target tertentu.
 */
export function checkCardReport(card: InvestigationCard, input: unknown) {
  const data = (input ?? {}) as Record<string, unknown>;
  const errors: string[] = [];

  const steps = data.steps;
  if (!Array.isArray(steps) || steps.length !== card.steps.length || !steps.every((done) => done === true)) {
    errors.push("Centang semua langkah kerja setelah kamu mengerjakannya.");
  }

  const { moisture, moistureAfter, temperature, buzzer, answers } = data;
  if (!isNumber(moisture) || moisture < 0 || moisture > 100) {
    errors.push("Isi angka kelembapan tanah antara 0 sampai 100.");
  }

  if (card.wateringTest && (!isNumber(moistureAfter) || moistureAfter < 0 || moistureAfter > 100)) {
    errors.push("Isi angka kelembapan setelah disiram.");
  }

  if (!isNumber(temperature) || temperature < 0 || temperature > 60) {
    errors.push("Isi angka suhu udara (°C) dari sensor.");
  }

  if (buzzer !== "berbunyi" && buzzer !== "tenang") {
    errors.push("Pilih status Buzzer D8 yang kamu dengar.");
  }

  const cleanAnswers = Array.isArray(answers) ? answers.map((a) => (typeof a === "string" ? a.trim() : "")) : [];
  const answered =
    cleanAnswers.length === card.questions.length &&
    cleanAnswers.every((a) => a.length >= MIN_ANSWER_LENGTH && a.length <= MAX_ANSWER_LENGTH);
  if (!answered) {
    errors.push(`Jawab semua pertanyaan diskusi dengan kalimatmu sendiri (minimal ${MIN_ANSWER_LENGTH} huruf).`);
  }

  if (errors.length > 0) return { errors, report: null };

  const report: CardReport = {
    moisture: moisture as number,
    temperature: temperature as number,
    buzzer: buzzer as BuzzerStatus,
    answers: cleanAnswers,
    ...(card.wateringTest ? { moistureAfter: moistureAfter as number } : {}),
  };
  return { errors, report };
}

export function getPreviousPot(pot: DailyPot) {
  return DAILY_POTS[DAILY_POTS.indexOf(pot) - 1];
}
