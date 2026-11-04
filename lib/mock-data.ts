// lib/mock-data.ts
import {
  Device,
  Module,
  Mission,
  Quiz,
  Class,
  Student,
  ActivityItem,
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

// Empat pot penelitian. Awalnya belum menyala: belum pernah ada data dari ESP32.
export const POT_DEVICES = [
  { id: "pot-a", name: "Pot A" },
  { id: "pot-b", name: "Pot B" },
  { id: "pot-c", name: "Pot C" },
  { id: "pot-d", name: "Pot D" },
] as const;

export const mockDevices: Device[] = POT_DEVICES.map(({ id, name }) => ({
  id,
  name,
  boxId: id,
  classId: "",
  status: "offline",
  lastDataAt: "",
  sensors: [],
}));

// ─── MODULES ────────────────────────────────────────────────────
// Materi nyata: satu modul berisi 4 frame storyboard. Video YouTube tampil sebelum
// storyboard. Video Seri 1 mencakup Frame 2 dan 3, jadi Frame 3 tidak punya video sendiri.
// Progres belajar belum dilacak di server, jadi semua modul dimulai dari 0%.
export const mockModuleProgress: Record<string, number> = {};

export const mockModules: Module[] = [
  {
    id: "mod-tanah-suhu", slug: "rahasia-tanah-dan-suhu", title: "Rahasia Tanah & Suhu Udara", topic: "Dasar-Dasar",
    description: "Tonton video animasi dan baca storyboard seru tentang tanah, kelembapan, dan suhu udara bagi tanaman.",
    durationMin: 20, status: "terbit", classIds: ["kelas-6a", "kelas-6b"],
    objectives: ["Menjelaskan penyebab tanah tandus", "Memahami pentingnya kelembapan tanah", "Menjelaskan pengaruh suhu udara terhadap tanaman"],
    content: "Tanah dan suhu udara sangat menentukan kehidupan tanaman.",
    quizId: "quiz-1",
    lessons: [
      {
        video: { title: "Video Awalan", youtubeId: "tLrV5XYyXMY", poster: "/video/poster/awalan.jpg" },
        label: "Frame 1",
        heading: "Indonesia, Negara Subur & Pahlawan Pangan Muda",
        image: {
          src: "/storyboard/frame1.jpeg",
          alt: "Storyboard Frame 1: Indonesia negara subur. Tanah yang subur menyediakan kebutuhan tanaman, dan kita belajar menjaga tanah serta air agar menjadi pahlawan pangan masa depan.",
        },
      },
      {
        video: { title: "Seri 1: Tanah Tandus & Tanaman Haus", youtubeId: "cmk-fukj0ko", poster: "/video/poster/seri-1.jpg" },
        label: "Frame 2",
        heading: "Misteri Tanah Tandus & Kehausan Tanaman",
        image: {
          src: "/storyboard/frame2.jpeg",
          alt: "Storyboard Frame 2: tanah tandus retak karena air menguap, akar tidak bisa menyerap air, sehingga daun tanaman layu dan meminta pertolongan.",
        },
      },
      {
        label: "Frame 3",
        heading: "Rahasia Kelembapan Tanah & Benda Biotik-Abiotik",
        image: {
          src: "/storyboard/frame3.jpeg",
          alt: "Storyboard Frame 3: kelembapan tanah adalah air di antara butiran tanah. Tumbuhan itu biotik, air dan tanah itu abiotik. Air terlalu sedikit membuat layu, terlalu banyak membuat akar busuk.",
        },
      },
      {
        video: { title: "Seri 2: Detektif Suhu", youtubeId: "mKQYi1ulMLg", poster: "/video/poster/seri-2.jpg" },
        label: "Frame 4",
        heading: "Pengaruh Suhu Udara Terhadap Tanaman",
        image: {
          src: "/storyboard/frame4.jpeg",
          alt: "Storyboard Frame 4: suhu udara yang terlalu panas membuat air cepat menguap dan tanaman cepat haus, sedangkan suhu yang pas membuat tanaman tumbuh sehat.",
        },
      },
    ],
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
// Naskah resmi: 10 soal pilihan ganda. Skor = benar / 10 × 100.
export const mockQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    moduleId: "mod-tanah-suhu",
    title: "Kuis Pintar: Rahasia Tanah & Suhu Udara",
    questions: [
      {
        id: "q1",
        text: "Di dalam ekosistem kebun pertanian, seluruh makhluk hidup saling bergantung pada lingkungan fisiknya. Contoh kelompok komponen biotik dan abiotik secara berurutan adalah ...",
        options: [
          "tanaman sayur dan cacing tanah (biotik); air, tanah, dan suhu udara (abiotik)",
          "cahaya matahari dan air (biotik); bakteri pengurai dan tanaman (abiotik)",
          "udara dan batu (biotik); cacing tanah dan manusia (abiotik)",
          "kelembapan tanah dan nutrisi (biotik); sayuran hijau (abiotik)",
        ],
        correctIndex: 0,
        explanation: "Biotik adalah makhluk hidup (tanaman, cacing tanah). Abiotik adalah benda tak hidup (air, tanah, suhu udara).",
      },
      {
        id: "q2",
        text: "Ketika musim kemarau berlangsung sangat panjang, suhu udara meningkat dan air di dalam tanah habis menguap. Kondisi lingkungan ini menyebabkan tanah menjadi tandus dan tanaman menjadi layu karena ...",
        options: [
          "tanaman tidak dapat menyerap air melalui akarnya",
          "tanaman mendapatkan terlalu banyak pasokan oksigen",
          "suhu udara yang panas membuat tanaman tidak membutuhkan cahaya",
          "akar tanaman bernapas terlalu cepat di dalam air",
        ],
        correctIndex: 0,
        explanation: "Pada tanah tandus air sudah habis, sehingga akar tidak bisa menyerap air dan daun menjadi layu.",
      },
      {
        id: "q3",
        text: "Banyak orang mengira jika tanaman diberi pupuk padat dalam jumlah banyak maka tanaman pasti langsung subur. Padahal, akar tanaman memerlukan zat cair untuk membantu proses penyerapan, yaitu ...",
        options: [
          "air berfungsi sebagai pelarut unsur hara kompos agar dapat diserap oleh rambut akar",
          "air berfungsi untuk mendinginkan daun agar tidak terkena cahaya matahari",
          "pupuk padat dapat langsung dicerna oleh gigi akar tanaman tanpa air",
          "air digunakan untuk membunuh mikroba pengurai di dalam tanah",
        ],
        correctIndex: 0,
        explanation: "Air melarutkan unsur hara dari pupuk atau kompos, sehingga bisa diserap oleh rambut akar.",
      },
      {
        id: "q4",
        text: "Sisa sampah daun kering di halaman sekolah atau kebun sering kali dibiarkan menumpuk atau dibakar. Berdasarkan prinsip sains lingkungan, tindakan yang paling tepat untuk mengolah limbah tersebut adalah ...",
        options: [
          "membuangnya langsung ke aliran sungai agar bersih",
          "membakar seluruh daun kering di dekat area tanaman",
          "mengolahnya menjadi pupuk kompos organik yang menyuburkan tanah",
          "mencampurnya dengan sampah plastik agar cepat hancur",
        ],
        correctIndex: 2,
        explanation: "Daun kering bisa diolah menjadi kompos organik yang menyuburkan tanah dan mengurangi sampah.",
      },
      {
        id: "q5",
        text: "Sekelompok siswa ingin menguji pengaruh jumlah volume penyiraman air terhadap pertumbuhan tinggi berbagai tanaman sayur di kebun sekolah. Dalam rancangan percobaan tersebut, faktor yang sengaja dibedakan (dibuat tidak sama) pada setiap pot adalah ...",
        options: [
          "jenis benih tanaman yang digunakan",
          "jumlah volume air yang disiramkan",
          "ukuran dan jenis wadah pot",
          "jenis media tanam dasar",
        ],
        correctIndex: 1,
        explanation: "Yang sengaja dibedakan adalah hal yang sedang diuji, yaitu jumlah air yang disiramkan. Itulah variabel bebas.",
      },
      {
        id: "q6",
        text: "Dalam sebuah eksperimen ilmiah perbandingan pertumbuhan tanaman, beberapa faktor seperti ukuran wadah, jumlah biji awal, dan jenis media tanam harus dibuat sama persis pada setiap kelompok perlakuan. Faktor-faktor yang dibuat sama ini disebut sebagai ...",
        options: [
          "variabel bebas perlakuan",
          "variabel terikat pengamatan",
          "variabel kontrol (pengendali)",
          "variabel sensor digital IoT",
        ],
        correctIndex: 2,
        explanation: "Faktor yang dibuat sama agar percobaan adil disebut variabel kontrol (pengendali).",
      },
      {
        id: "q7",
        text: "Siswa menggunakan modul sensor pintar IoT (Soil Moisture A0) untuk mendeteksi kondisi media tanam. Jika layar web menunjukkan indikator warna Merah dan Alarm Buzzer berbunyi, maka tafsiran data sensor tersebut adalah ...",
        options: [
          "kelembapan tanah sangat rendah (<30%) atau kering, sehingga tanaman kekurangan air",
          "kelembapan tanah berada pada tingkat ideal dan sangat subur (50%-80%)",
          "tanaman disiram terlalu banyak air hingga tergenang penuh (>95%)",
          "suhu udara di sekitar kebun menjadi sangat dingin dan sejuk",
        ],
        correctIndex: 0,
        explanation: "Merah dan buzzer berbunyi berarti kelembapan tanah di bawah 30%: tanah kering dan tanaman perlu disiram.",
      },
      {
        id: "q8",
        text: "Perhatikan data pengamatan dua kelompok tanaman: Tanaman di media tanah humus bercampur kompos tumbuh lebih tinggi dan berdaun lebat dibandingkan tanaman di media tanah pasir yang cepat kering. Kesimpulan yang paling valid dari data tersebut adalah ...",
        options: [
          "media tanah humus dan kompos lebih baik dalam menahan kelembapan dan menyediakan nutrisi bagi pertumbuhan tanaman",
          "tanah pasir merupakan media tanam terbaik untuk seluruh jenis tanaman sayur",
          "jenis media tanam tidak memberikan pengaruh apa pun terhadap kesehatan tanaman",
          "tanaman di media pasir tidak memerlukan bantuan cahaya matahari",
        ],
        correctIndex: 0,
        explanation: "Data menunjukkan tanaman di humus dan kompos tumbuh lebih baik, karena media itu menahan air dan kaya nutrisi.",
      },
      {
        id: "q9",
        text: "Ketika media tanam pot menunjukkan kelembapan yang sangat rendah (kering kerontang), daun tanaman akan berubah menjadi lunglai, menguning, dan terkulai lemas. Hubungan sebab-akibat dari kondisi tersebut adalah ...",
        options: [
          "kekurangan pasokan air di dalam tanah mengganggu proses metabolisme dan penyerapan nutrisi tanaman",
          "kelembapan yang terlalu rendah justru mempercepat pertumbuhan batang tanaman",
          "daun tanaman layu karena kelebihan cadangan air di dalam batangnya",
          "media yang kering membuat akar tanaman dapat bernapas dengan sangat bebas",
        ],
        correctIndex: 0,
        explanation: "Sebabnya tanah kekurangan air, akibatnya tanaman tidak bisa menyerap nutrisi dan daunnya layu.",
      },
      {
        id: "q10",
        text: "Sebagai wujud kepedulian terhadap lingkungan dan ketahanan pangan sekolah, siswa merancang proyek pembuatan produk \"Kompos Organik\" dari limbah daun. Manfaat utama dari inovasi sosial tersebut bagi ekosistem adalah ...",
        options: [
          "mengurangi volume sampah organik di lingkungan sekaligus menghasilkan nutrisi alami penyubur tanah",
          "menciptakan limbah baru yang mencemari sumber air tanah di sekitar sekolah",
          "menggantikan kebutuhan air bersih bagi tanaman secara permanen",
          "menghentikan seluruh aktivitas daur ulang sampah plastik di masyarakat",
        ],
        correctIndex: 0,
        explanation: "Kompos mengurangi sampah organik dan menghasilkan nutrisi alami untuk menyuburkan tanah.",
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
