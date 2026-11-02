// lib/mock-data.ts
import {
  Device,
  Module,
  Mission,
  Quiz,
  Class,
  Student,
  ActivityItem,
  SensorHistoryPoint,
  Submission,
  RubricRow,
} from "./types";

// ─── CLASSES ────────────────────────────────────────────────────
export const mockClasses: Class[] = [
  { id: "kelas-1", name: "Kelas 10A – Agribisnis", code: "AGRO10A", teacherId: "guru-1", studentCount: 28 },
  { id: "kelas-2", name: "Kelas 10B – Agribisnis", code: "AGRO10B", teacherId: "guru-1", studentCount: 26 },
  { id: "kelas-3", name: "Kelas 11A – Agribisnis", code: "AGRO11A", teacherId: "guru-1", studentCount: 24 },
];

// ─── STUDENTS ───────────────────────────────────────────────────
export const mockStudents: Student[] = [
  { id: "siswa-1", name: "Andi Pratama", classId: "kelas-1", classCode: "AGRO10A" },
  { id: "siswa-2", name: "Budi Santoso", classId: "kelas-1", classCode: "AGRO10A" },
  { id: "siswa-3", name: "Citra Dewi", classId: "kelas-1", classCode: "AGRO10A" },
  { id: "siswa-4", name: "Dian Safitri", classId: "kelas-2", classCode: "AGRO10B" },
];

export const currentStudent = mockStudents[0];

// ─── IoT DEVICES ────────────────────────────────────────────────
const NOW = new Date().toISOString();
const MINS_AGO = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const mockDevices: Device[] = [
  {
    id: "device-1",
    name: "Box 1 – Kangkung",
    boxId: "box-1",
    classId: "kelas-1",
    status: "online",
    lastDataAt: MINS_AGO(2),
    sensors: [
      { deviceId: "device-1", sensorId: "s1-temp", sensorType: "air_temp", value: 28.4, unit: "°C", measuredAt: MINS_AGO(2), receivedAt: MINS_AGO(1), valid: true, connectionStatus: "online" },
      { deviceId: "device-1", sensorId: "s1-hum", sensorType: "air_humidity", value: 62, unit: "%", measuredAt: MINS_AGO(2), receivedAt: MINS_AGO(1), valid: true, connectionStatus: "online" },
      { deviceId: "device-1", sensorId: "s1-soil", sensorType: "soil_moisture", value: 45, unit: "%", measuredAt: MINS_AGO(2), receivedAt: MINS_AGO(1), valid: true, connectionStatus: "online" },
      { deviceId: "device-1", sensorId: "s1-light", sensorType: "light", value: 3200, unit: "lux", measuredAt: MINS_AGO(2), receivedAt: MINS_AGO(1), valid: true, connectionStatus: "online" },
    ],
  },
  {
    id: "device-2",
    name: "Box 2 – Bayam",
    boxId: "box-2",
    classId: "kelas-1",
    status: "data_terakhir",
    lastDataAt: MINS_AGO(47),
    sensors: [
      { deviceId: "device-2", sensorId: "s2-temp", sensorType: "air_temp", value: 29.1, unit: "°C", measuredAt: MINS_AGO(47), receivedAt: MINS_AGO(46), valid: true, connectionStatus: "data_terakhir" },
      { deviceId: "device-2", sensorId: "s2-hum", sensorType: "air_humidity", value: 58, unit: "%", measuredAt: MINS_AGO(47), receivedAt: MINS_AGO(46), valid: true, connectionStatus: "data_terakhir" },
      { deviceId: "device-2", sensorId: "s2-soil", sensorType: "soil_moisture", value: 38, unit: "%", measuredAt: MINS_AGO(47), receivedAt: MINS_AGO(46), valid: true, connectionStatus: "data_terakhir" },
      { deviceId: "device-2", sensorId: "s2-light", sensorType: "light", value: 2800, unit: "lux", measuredAt: MINS_AGO(47), receivedAt: MINS_AGO(46), valid: true, connectionStatus: "data_terakhir" },
    ],
  },
  {
    id: "device-3",
    name: "Box 3 – Selada",
    boxId: "box-3",
    classId: "kelas-2",
    status: "offline",
    lastDataAt: MINS_AGO(180),
    sensors: [],
  },
];

// ─── SENSOR HISTORY (dummy 24 jam terakhir) ─────────────────────
function genHistory(base: number, variance: number, points = 24): SensorHistoryPoint[] {
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(Date.now() - (points - 1 - i) * 3600_000).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const value = i > 20 ? null : parseFloat((base + (Math.random() - 0.5) * variance * 2).toFixed(1));
    return { time, value };
  });
}

export const mockSensorHistory = {
  "s1-temp": genHistory(28, 1.5),
  "s1-hum": genHistory(62, 5),
  "s1-soil": genHistory(45, 8),
  "s1-light": genHistory(3000, 600),
};

// ─── MODULES ────────────────────────────────────────────────────
export const mockModules: Module[] = [
  {
    id: "mod-1", slug: "mengenal-hidroponik", title: "Mengenal Hidroponik", topic: "Dasar-Dasar",
    description: "Memahami konsep dasar hidroponik dan manfaatnya dalam pertanian modern.",
    durationMin: 45, status: "terbit", classIds: ["kelas-1", "kelas-2"],
    objectives: ["Menjelaskan pengertian hidroponik", "Menyebutkan kelebihan dibanding tanah", "Mengidentifikasi jenis media tanam"],
    content: "Hidroponik adalah metode bercocok tanam tanpa menggunakan tanah...",
  },
  {
    id: "mod-2", slug: "nutrisi-tanaman", title: "Nutrisi & Larutan Nutrisi", topic: "Nutrisi",
    description: "Memahami kebutuhan nutrisi tanaman dan cara menyiapkan larutan nutrisi AB Mix.",
    durationMin: 60, status: "terbit", classIds: ["kelas-1", "kelas-2"],
    objectives: ["Menjelaskan unsur makro dan mikro", "Menghitung konsentrasi larutan", "Menyiapkan larutan AB Mix"],
    content: "Tanaman membutuhkan 16 unsur hara esensial...",
  },
  {
    id: "mod-3", slug: "sensor-iot-pertanian", title: "Sensor IoT dalam Pertanian", topic: "Teknologi",
    description: "Memahami cara kerja sensor dan interpretasi data IoT untuk keputusan pertanian.",
    durationMin: 50, status: "terbit", classIds: ["kelas-1"],
    objectives: ["Menjelaskan jenis sensor yang digunakan", "Membaca dan menginterpretasikan data sensor", "Mengaitkan data sensor dengan kondisi tanaman"],
    content: "Sensor IoT memungkinkan pemantauan kondisi tanaman secara real-time...",
    quizId: "quiz-1",
  },
  {
    id: "mod-4", slug: "hama-penyakit", title: "Hama & Penyakit pada Hidroponik", topic: "Perlindungan",
    description: "Mengidentifikasi hama dan penyakit umum serta cara pengendaliannya.",
    durationMin: 55, status: "draf", classIds: ["kelas-1"],
    objectives: ["Mengidentifikasi hama umum", "Menerapkan pengendalian hama terpadu"],
    content: "Meskipun lebih bersih dari tanah, hidroponik tetap rentan...",
  },
];

// ─── MISSIONS ───────────────────────────────────────────────────
export const mockMissions: Mission[] = [
  {
    id: "misi-1",
    title: "Detektif Tanaman Sehat",
    objective: "Mengamati kondisi tanaman dan menggunakan data sensor sebagai bukti ilmiah untuk menjelaskan kondisi media tanam.",
    triggerQuestion: "Bagaimana cara membuktikan apakah tanaman tumbuh dalam kondisi yang optimal tanpa hanya mengandalkan penampilan luar?",
    steps: [
      "Amati tanaman dan media tanam tanpa mengubahnya terlebih dahulu.",
      "Catat waktu pengamatan dan kondisi yang terlihat secara visual.",
      "Buka Lab IoT, pilih perangkat Box yang bersangkutan.",
      "Catat nilai setiap sensor beserta waktu pembacaannya.",
      "Bandingkan data sensor dengan pengamatan langsungmu.",
      "Tulis kesimpulan berdasarkan bukti yang telah dikumpulkan.",
      "Rumuskan satu pertanyaan lanjutan yang ingin kamu selidiki.",
    ],
    tools: ["Alat tulis / buku catatan", "Kamera (bila diizinkan)", "Akses Lab IoT di website", "Penggaris (opsional)"],
    evidenceRequired: ["Catatan pengamatan visual", "Foto tanaman (bila diizinkan)", "Screenshot/catat nilai sensor + waktu pembacaan", "Kesimpulan tertulis", "Refleksi dan pertanyaan lanjutan"],
    completionCriteria: ["Minimal 3 aspek visual diamati dan dicatat", "Data sensor dari minimal 3 jenis sensor tercatat dengan waktu", "Kesimpulan didukung bukti (pengamatan + data)", "Refleksi ditulis minimal 2 kalimat"],
    deadline: new Date(Date.now() + 7 * 86400_000).toISOString(),
    classIds: ["kelas-1", "kelas-2"],
  },
  {
    id: "misi-2",
    title: "Perbandingan Media Tanam",
    objective: "Membandingkan pertumbuhan tanaman pada dua media tanam berbeda menggunakan data kuantitatif.",
    triggerQuestion: "Apakah jenis media tanam berpengaruh pada kelembapan yang diserap tanaman?",
    steps: [
      "Amati kedua box tanaman yang menggunakan media berbeda.",
      "Catat data sensor dari kedua box dalam waktu yang sama.",
      "Ukur dan catat pertumbuhan visual (tinggi, warna daun).",
      "Buat tabel perbandingan data dari kedua box.",
      "Analisis apakah ada perbedaan signifikan antar media.",
      "Simpulkan media mana yang lebih sesuai dan berikan alasannya.",
    ],
    tools: ["Alat tulis", "Penggaris", "Akses Lab IoT"],
    evidenceRequired: ["Tabel perbandingan data sensor", "Foto kedua box", "Analisis tertulis", "Kesimpulan dan rekomendasi"],
    completionCriteria: ["Data dari dua box dibandingkan", "Analisis menggunakan data bukan hanya opini", "Kesimpulan logis dan didukung bukti"],
    deadline: new Date(Date.now() + 14 * 86400_000).toISOString(),
    classIds: ["kelas-1"],
  },
];

// ─── SUBMISSIONS ─────────────────────────────────────────────────
export const mockSubmissions: Submission[] = [
  {
    id: "sub-1", missionId: "misi-1", studentId: "siswa-1",
    status: "terkirim", revision: 0,
    observation: "Tanaman kangkung terlihat segar dengan daun berwarna hijau tua. Batang tegak dan tidak ada tanda-tanda layu.",
    sensorRefs: ["s1-temp", "s1-hum", "s1-soil"],
    conclusion: "Berdasarkan data sensor (suhu 28.4°C, kelembapan tanah 45%) dan pengamatan visual, kondisi media tanam terlihat optimal.",
    reflection: "Saya belajar bahwa data angka harus selalu dikombinasikan dengan pengamatan langsung. Saya ingin tahu bagaimana suhu mempengaruhi laju penyerapan air.",
    attachments: [],
    submittedAt: MINS_AGO(120),
  },
];

// ─── QUIZZES ────────────────────────────────────────────────────
export const mockQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    moduleId: "mod-3",
    title: "Kuis: Sensor IoT dalam Pertanian",
    questions: [
      {
        id: "q1", text: "Sensor DHT22 digunakan untuk mengukur apa?",
        options: ["Kelembapan tanah", "Suhu dan kelembapan udara", "Intensitas cahaya", "Kadar CO2"],
        correctIndex: 1,
        explanation: "DHT22 adalah sensor suhu dan kelembapan udara yang umum digunakan dalam sistem IoT pertanian.",
      },
      {
        id: "q2", text: "Mengapa data sensor perlu disertai timestamp (waktu pembacaan)?",
        options: ["Agar data lebih banyak", "Untuk mengetahui kapan data diambil dan memvalidasi kebaruan data", "Agar grafik terlihat bagus", "Karena diwajibkan oleh ESP32"],
        correctIndex: 1,
        explanation: "Timestamp penting untuk memastikan data yang ditampilkan benar-benar baru dan bukan data lama yang menyesatkan.",
      },
      {
        id: "q3", text: "Jika sensor menampilkan status 'offline', apa yang harus dilakukan?",
        options: ["Langsung simpulkan tanaman dalam bahaya", "Menggunakan angka terakhir sebagai data aktual", "Periksa koneksi perangkat dan jangan menggunakan angka lama sebagai data terkini", "Hapus data dan mulai ulang"],
        correctIndex: 2,
        explanation: "Status offline berarti data tidak diperbarui. Jangan gunakan angka lama seolah-olah data saat ini.",
      },
      {
        id: "q4", text: "Apa yang dimaksud dengan kalibrasi sensor?",
        options: ["Mengganti baterai sensor", "Menyesuaikan pembacaan sensor agar akurat sesuai kondisi nyata", "Memperbarui firmware ESP32", "Mengubah satuan pengukuran"],
        correctIndex: 1,
        explanation: "Kalibrasi adalah proses menyesuaikan nilai sensor dengan nilai referensi yang terukur, agar data yang ditampilkan akurat.",
      },
      {
        id: "q5", text: "Nilai kelembapan tanah 45% pada sensor SELALU berarti tanah...",
        options: ["Terlalu kering", "Optimal untuk semua tanaman", "Perlu dievaluasi berdasarkan jenis tanaman dan media", "Terlalu basah"],
        correctIndex: 2,
        explanation: "Angka sensor tidak bisa langsung dinilai baik/buruk tanpa konteks. Ambang batas harus dikalibrasi per tanaman, media, dan tahap tumbuh.",
      },
    ],
  },
];

// ─── RUBRIC ──────────────────────────────────────────────────────
export const missionRubric: RubricRow[] = [
  { criteria: "Pengamatan", needsGuidance: "Catatan sangat terbatas atau tidak relevan", developing: "Mencatat beberapa kondisi tanaman", good: "Catatan pengamatan jelas, terperinci, dan relevan" },
  { criteria: "Penggunaan Data", needsGuidance: "Data sensor tidak dicantumkan atau keliru", developing: "Data ada tetapi hubungan dengan pengamatan belum jelas", good: "Data sensor & timestamp dipakai sebagai bukti yang mendukung kesimpulan" },
  { criteria: "Kesimpulan", needsGuidance: "Tidak didukung bukti yang dikumpulkan", developing: "Sebagian didukung bukti", good: "Kesimpulan logis dan sepenuhnya sesuai bukti yang dikumpulkan" },
  { criteria: "Refleksi", needsGuidance: "Belum menyebut pembelajaran yang diperoleh", developing: "Menyebut hal yang dipelajari secara umum", good: "Menjelaskan pembelajaran konkret dan menyebutkan langkah lanjut" },
];

// ─── ACTIVITIES ──────────────────────────────────────────────────
export const mockActivities: ActivityItem[] = [
  { id: "act-1", type: "tugas", title: "Misi 'Detektif Tanaman Sehat' terkirim", time: MINS_AGO(120), detail: "Menunggu penilaian guru" },
  { id: "act-2", type: "data", title: "Data Box 1 diperbarui", time: MINS_AGO(2), detail: "Suhu 28.4°C · Kelembapan 62%" },
  { id: "act-3", type: "materi", title: "Modul 'Sensor IoT dalam Pertanian' selesai", time: MINS_AGO(200), detail: "Durasi: 50 menit" },
  { id: "act-4", type: "umpan_balik", title: "Komentar guru pada Misi #1", time: MINS_AGO(300), detail: "Pengamatan sangat baik! Tambahkan lebih banyak data sensor." },
];

// ─── GURU STATS ──────────────────────────────────────────────────
export const mockGuruStats = {
  totalSiswa: 78,
  totalKelas: 3,
  totalMisi: 12,
  perluDinilai: 5,
};
