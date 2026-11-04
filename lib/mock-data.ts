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
      { deviceId: "device-1", sensorId: "s1-soil", sensorType: "soil_moisture", value: 45, unit: "%", measuredAt: MINS_AGO(2), receivedAt: MINS_AGO(1), valid: true, connectionStatus: "online" },
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
      { deviceId: "device-2", sensorId: "s2-soil", sensorType: "soil_moisture", value: 38, unit: "%", measuredAt: MINS_AGO(47), receivedAt: MINS_AGO(46), valid: true, connectionStatus: "data_terakhir" },
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
  "s1-soil": genHistory(45, 8),
};

// ─── MODULES ────────────────────────────────────────────────────
export const mockModuleProgress: Record<string, number> = { "mod-1": 100, "mod-2": 100, "mod-3": 30 };

export const mockModules: Module[] = [
  {
    id: "mod-tanah-suhu", slug: "rahasia-tanah-dan-suhu", title: "Rahasia Tanah & Suhu Udara", topic: "Dasar-Dasar",
    description: "Tonton video animasi dan baca kisah seru tentang tanah, kelembapan, dan suhu udara bagi tanaman.",
    durationMin: 20, status: "terbit", classIds: ["kelas-6a", "kelas-6b"],
    objectives: ["Menjelaskan penyebab tanah tandus", "Memahami pentingnya kelembapan tanah", "Menjelaskan pengaruh suhu udara terhadap tanaman"],
    content: "Tanah dan suhu udara sangat menentukan kehidupan tanaman.",
    lessons: [
      {
        video: { title: "Awalan", src: "/video/Awalan.mp4", poster: "/video/poster/awalan.jpg" },
        heading: "Halo Petualang Cilik Agro!",
        paragraphs: [
          "Selamat datang di modul materi Agro Edu Box! Sebelum kalian memulai eksperimen langsung di kelas, yuk kita baca dan pelajari bersama kisah seru tentang bagaimana alam bekerja. Kalian akan menemukan rahasia penting mengapa tanah dan suhu udara sangat menentukan kehidupan tanaman kita!",
        ],
      },
      {
        label: "Frame 1",
        heading: "Indonesia Negeri Subur & Pahlawan Pangan Muda",
        paragraphs: [
          "Tahukah kamu bahwa Indonesia adalah salah satu negara tersubur di dunia? Tanah di negeri kita sangat kaya dan matahari bersinar sepanjang tahun. Kehebatan pertanian Indonesia tidak hanya datang dari tanahnya yang subur, tetapi juga dari anak-anak pintar seperti kalian yang mau belajar mencintai dan menjaga tanah air kita.",
          "Ketika kalian belajar tentang pertanian dan pertanahan sejak kecil, kalian sedang bersiap menjadi pahlawan pangan masa depan. Dengan memahami cara merawat tanah dan tanaman, kalian bisa membantu memastikan seluruh masyarakat Indonesia selalu memiliki makanan sehat yang cukup.",
        ],
      },
      {
        video: { title: "Seri 1: Tanaman Haus", src: "/video/SERI%201-TANAMAN%20HAUS.mp4", poster: "/video/poster/seri-1.jpg" },
        label: "Frame 2",
        heading: "Misteri Tanah Tandus & Kehausan Tanaman",
        paragraphs: [
          "Pernahkah kamu melihat tanah yang retak-retak dan kering di lapangan atau kebun? Tanah seperti itu disebut tanah tandus. Tanah tandus terjadi ketika air di dalam tanah habis menguap karena udara yang terlalu panas dan tidak ada hujan yang turun dalam waktu lama.",
          "Ketika tanah menjadi tandus, tanaman tidak bisa menyerap air melalui akarnya. Akibatnya, daun tanaman yang tadinya hijau dan segar akan berubah menjadi lunglai, menguning, dan akhirnya layu. Tanaman yang layu adalah cara alam memberi tahu kita bahwa mereka sedang meminta pertolongan.",
        ],
      },
      {
        label: "Frame 3",
        heading: "Rahasia Kelembapan Tanah (Kadar Air)",
        paragraphs: [
          "Kelembapan tanah adalah jumlah air yang tersimpan di antara butiran-butiran tanah. Kelembapan tanah sangat menentukan apakah tanaman bisa tumbuh dengan ceria atau malah kehausan. Jika kelembapan tanah terlalu rendah, tanah akan terasa keras dan tanaman akan layu karena kekurangan air.",
          "Namun, menyiram tanaman juga tidak boleh berlebihan. Jika tanah terlalu becek dan tergenang air, akar tanaman tidak bisa bernapas dengan baik dan bisa membusuk. Oleh karena itu, kita perlu menjaga kelembapan tanah agar berada di tingkat yang pas dan ideal bagi pertumbuhan tanaman.",
        ],
      },
      {
        video: { title: "Seri 2: Detektif Suhu", src: "/video/SERI%202-DETEKTIF%20SUHU.mp4", poster: "/video/poster/seri-2.jpg" },
        label: "Frame 4",
        heading: "Pengaruh Suhu Udara Terhadap Tanaman",
        paragraphs: [
          "Selain kelembapan tanah, suhu udara di sekitar tanaman juga sangat berpengaruh. Suhu udara menunjukkan seberapa panas atau dinginnya cuaca di lingkungan tempat tanaman tumbuh. Saat matahari terik dan suhu udara menjadi sangat tinggi, air dari tanah dan daun akan menguap lebih cepat ke udara.",
          "Suhu udara yang terlalu panas membuat tanah cepat mengering, sehingga tanaman menjadi lebih cepat haus dari biasanya. Sebaliknya, suhu udara yang pas dan sejuk akan membantu tanaman mengolah makanannya dengan tenang dan tumbuh menjadi pohon yang kuat dan berbuah lebat.",
        ],
      },
    ],
  },
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
    completionCriteria: ["Minimal 3 aspek visual diamati dan dicatat", "Data sensor suhu udara dan kelembapan tanah tercatat dengan waktu", "Kesimpulan didukung bukti (pengamatan + data)", "Refleksi ditulis minimal 2 kalimat"],
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
    sensorRefs: ["s1-temp", "s1-soil"],
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
        options: ["Kelembapan tanah", "Suhu udara", "Tinggi tanaman", "Kadar CO2"],
        correctIndex: 1,
        explanation: "DHT22 adalah sensor suhu udara presisi yang umum digunakan dalam sistem IoT pertanian.",
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
