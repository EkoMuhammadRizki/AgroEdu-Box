/**
 * Isi Lembar Kerja Peserta Didik (LKPD), disalin dari lembar cetak di
 * public/LKPD. Halaman web dibangun dari data ini, jadi kata-kata, urutan, dan
 * judulnya tetap sama dengan lembar aslinya.
 *
 * Satu sumber untuk tiga hal sekaligus: tampilan siswa, pemeriksaan di server,
 * dan tampilan guru. Menambah pertanyaan cukup di sini.
 */

export type LkpdLingkup = "kelompok" | "siswa";

export type LkpdFieldType = "teks" | "uraian" | "angka" | "pilihan" | "pilihanGanda";

export interface LkpdField {
  id: string;
  label?: string;
  type: LkpdFieldType;
  /** "%" atau "°C" untuk isian angka. */
  satuan?: string;
  opsi?: string[];
  placeholder?: string;
}

export type LkpdBlok =
  | { jenis: "catatan"; teks: string }
  | { jenis: "isian"; judul?: string; fields: LkpdField[] }
  | { jenis: "kolom"; judul: string; kolom: { judul: string; fields: LkpdField[] }[] }
  | {
      jenis: "tabel";
      judul: string;
      kepala: string[];
      baris: { label: string; sub?: string; pot?: string; fields: LkpdField[] }[];
    }
  | {
      jenis: "jodoh";
      judul: string;
      kiri: { id: string; teks: string }[];
      kanan: { kode: string; teks: string }[];
    };

export interface LkpdBagian {
  id: string;
  /** Nomor halaman pada lembar cetak, untuk tombol "Lihat lembar asli". */
  halaman: number;
  judul: string;
  subjudul?: string;
  aktivitas?: string[];
  lingkup: LkpdLingkup;
  blok: LkpdBlok[];
}

/** Halaman yang hanya dibaca: sampul, tujuan, bahan bacaan, sampul belakang. */
export const LKPD_HALAMAN_BACA = [
  { halaman: 2, judul: "Tujuan Pembelajaran & Petunjuk Pengerjaan" },
  { halaman: 3, judul: "Bahan Bacaan Petualang Sains bersama Si Tunas" },
];

export const LKPD_TOTAL_HALAMAN = 9;

const PILIHAN_JODOH = ["A", "B", "C", "D", "E"];

export const LKPD_BAGIAN: LkpdBagian[] = [
  {
    id: "identitas",
    halaman: 1,
    judul: "Identitas Kelompok Detektif",
    subjudul: "Isi bersama kelompokmu sebelum memulai Misi #1.",
    lingkup: "kelompok",
    blok: [
      {
        jenis: "isian",
        fields: [
          { id: "namaKelompok", label: "Nama Kelompok Detektif", type: "teks", placeholder: "Misalnya: Detektif Tanah Hebat" },
          { id: "tanggalPraktikum", label: "Tanggal Praktikum", type: "teks", placeholder: "Misalnya: 12 November 2026" },
        ],
      },
      {
        jenis: "isian",
        judul: "Pembagian Peran Anggota Kelompok (setiap anggota wajib memilih 1 peran utama)",
        fields: [
          { id: "peranKetua", label: "1. Ketua", type: "teks", placeholder: "Nama anggota" },
          { id: "peranAnggota1", label: "2. Anggota 1", type: "teks", placeholder: "Nama anggota" },
          { id: "peranAnggota2", label: "3. Anggota 2", type: "teks", placeholder: "Nama anggota" },
          { id: "peranAnggota3", label: "4. Anggota 3", type: "teks", placeholder: "Nama anggota" },
          { id: "peranAnggota4", label: "5. Anggota 4", type: "teks", placeholder: "Nama anggota (bila kelompokmu berisi 5 orang)" },
        ],
      },
    ],
  },

  {
    id: "misi-1",
    halaman: 4,
    judul: "Misi #1: Mulai Petualangan & Cari Tahu Masalahnya",
    aktivitas: [
      "Bukalah halaman pertama aplikasi 'Lab Belajar Si Tunas' pada AGRO EDU BOX dan amati gambar ekosistem pertanian lokal.",
      "Amati sampel nyata jenis-jenis tanah (Pasir, Liat, dan Kompos) pada Mini Farming Kit.",
    ],
    lingkup: "kelompok",
    blok: [
      {
        jenis: "kolom",
        judul:
          "1. Tuliskan tiga hal penting atau fenomena menarik yang kalian temukan dari pengamatan visualisasi Lab Belajar Si Tunas dan lingkungan kebun sekolah kita:",
        kolom: [
          {
            judul: "Temuan #1: Komponen Hidup (Biotik) di Kebun",
            fields: [
              { id: "biotik1", type: "teks", placeholder: "1) ..." },
              { id: "biotik2", type: "teks", placeholder: "2) ..." },
              { id: "biotik3", type: "teks", placeholder: "3) ..." },
            ],
          },
          {
            judul: "Temuan #2: Komponen Tak Hidup (Abiotik) di Kebun",
            fields: [
              { id: "abiotik1", type: "teks", placeholder: "1) ..." },
              { id: "abiotik2", type: "teks", placeholder: "2) ..." },
              { id: "abiotik3", type: "teks", placeholder: "3) ..." },
            ],
          },
          {
            judul: "Temuan #3: Masalah Tanaman / Sampah Daun di Sekolah",
            fields: [
              { id: "masalah1", type: "teks", placeholder: "1) ..." },
              { id: "masalah2", type: "teks", placeholder: "2) ..." },
              { id: "masalah3", type: "teks", placeholder: "3) ..." },
            ],
          },
        ],
      },
      {
        jenis: "tabel",
        judul:
          "2. Ayo Lengkapi! Berdasarkan pengamatan sampel tanah di Mini Farming Kit, lengkapilah ciri-ciri ketiga jenis media tanam di bawah ini:",
        kepala: ["Jenis Media Tanam", "Tekstur & Ukuran Butiran", "Kemampuan Menahan Air", "Dampak terhadap Pertumbuhan Tanaman"],
        baris: [
          {
            label: "a. Wilayah / Media Tanah Berpasir",
            fields: [
              { id: "pasirTekstur", type: "teks", placeholder: "Tekstur & ukuran butiran" },
              { id: "pasirAir", type: "teks", placeholder: "Kemampuan menahan air" },
              { id: "pasirTumbuhan", type: "teks", placeholder: "Kondisi tumbuhan" },
            ],
          },
          {
            label: "b. Wilayah / Media Tanah Liat Padat",
            fields: [
              { id: "liatTekstur", type: "teks", placeholder: "Tekstur & ukuran butiran" },
              { id: "liatAir", type: "teks", placeholder: "Kemampuan menahan air" },
              { id: "liatTumbuhan", type: "teks", placeholder: "Kondisi tumbuhan" },
            ],
          },
          {
            label: "c. Wilayah / Media Tanah Humus & Kompos Organik",
            fields: [
              { id: "humusTekstur", type: "teks", placeholder: "Tekstur & ukuran butiran" },
              { id: "humusAir", type: "teks", placeholder: "Kemampuan menahan air" },
              { id: "humusTumbuhan", type: "teks", placeholder: "Kondisi tumbuhan" },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "misi-2",
    halaman: 5,
    judul: "Misi #2: Cari Masalah & Rencanakan Proyek",
    aktivitas: [
      "Amati ke-4 Pot Eksperimen (Pot A, B, C, dan D) di meja kelompokmu, lalu susunlah rantai nutrisi dan hipotesis ilmiah bersama kelompokmu!",
    ],
    lingkup: "kelompok",
    blok: [
      {
        jenis: "isian",
        judul:
          "1. “Apa masalah yang terjadi pada tanaman saat musim kemarau panjang atau saat petani memberi pupuk tapi lupa menyiram air?”",
        fields: [
          {
            id: "identifikasiMasalah",
            label: "Jawaban hasil diskusi kelompok",
            type: "uraian",
            placeholder: "Tuliskan hasil identifikasi masalah kelompokmu di sini...",
          },
        ],
      },
      {
        jenis: "jodoh",
        judul: "2. Yuk, pasangkan! Pilih huruf yang cocok untuk menyatukan peran dan isi yang ada di kebun pertanian ini.",
        kiri: [
          { id: "jodoh1", teks: "1. Hewan pengurai" },
          { id: "jodoh2", teks: "2. Zat gizi alami dalam tanah" },
          { id: "jodoh3", teks: "3. Faktor Abiotik Pelarut & Energi" },
          { id: "jodoh4", teks: "4. Tumbuhan hijau penghasil makanan (produsen)" },
          { id: "jodoh5", teks: "5. Manusia" },
        ],
        kanan: [
          { kode: "A", teks: "Air Bersih (Pelarut Hara) & Cahaya Matahari" },
          { kode: "B", teks: "Tanaman Sayur Kangkung / Bayam (Produsen Hijau)" },
          { kode: "C", teks: "Cacing Tanah, Jamur, & Bakteri Pengurai Kompos" },
          { kode: "D", teks: "Memanen & Merawat Kebun" },
          { kode: "E", teks: "Pupuk Kompos Organik / Humus Kaya Mineral" },
        ],
      },
    ],
  },

  {
    id: "misi-3",
    halaman: 6,
    judul: "Misi #3: Praktikum Sensor IoT, Pengumpulan & Analisis Data",
    aktivitas: [
      "Nyalakan Modul IoT Smart Agro dan buka halaman Lab IoT pada AGRO EDU BOX.",
      "Tancapkan garpu Sensor Kelembapan Tanah (A0) secara bergantian ke Pot A, Pot B, Pot C, dan Pot D, serta amati Sensor Suhu Udara (DHT22) dan Alarm Buzzer (D8).",
      "Catat seluruh data pada tabel observasi, lakukan Uji Siram Penyelamatan (40 mL air), lalu jawab pertanyaan perbandingan di bawahnya!",
    ],
    lingkup: "kelompok",
    blok: [
      {
        jenis: "tabel",
        judul: "Ayo Rekam Data Sensor IoT! — Tabel Pengamatan Eksperimen 4 Pot",
        kepala: ["Kode Pot", "Kelembapan Tanah (A0)", "Suhu (DHT22)", "Warna Layar Web", "Alarm Buzzer (D8)"],
        baris: [
          {
            label: "Pot A",
            sub: "Tanah Biasa + Tanpa Air (0 mL)",
            pot: "A",
            fields: [
              { id: "potA_kelembapan", type: "angka", satuan: "%" },
              { id: "potA_suhu", type: "angka", satuan: "°C" },
              { id: "potA_warna", type: "pilihan", opsi: ["Merah", "Hijau"] },
              { id: "potA_buzzer", type: "pilihan", opsi: ["Bunyi", "Tenang"] },
            ],
          },
          {
            label: "Pot B",
            sub: "Tanah Biasa + Air Cukup (40 mL)",
            pot: "B",
            fields: [
              { id: "potB_kelembapan", type: "angka", satuan: "%" },
              { id: "potB_suhu", type: "angka", satuan: "°C" },
              { id: "potB_warna", type: "pilihan", opsi: ["Merah", "Hijau"] },
              { id: "potB_buzzer", type: "pilihan", opsi: ["Bunyi", "Tenang"] },
            ],
          },
          {
            label: "Pot C",
            sub: "Tanah Pupuk Kompos + Tanpa Air (0 mL)",
            pot: "C",
            fields: [
              { id: "potC_kelembapan", type: "angka", satuan: "%" },
              { id: "potC_suhu", type: "angka", satuan: "°C" },
              { id: "potC_warna", type: "pilihan", opsi: ["Merah", "Hijau"] },
              { id: "potC_buzzer", type: "pilihan", opsi: ["Bunyi", "Tenang"] },
            ],
          },
          {
            label: "Pot D",
            sub: "Tanah Pupuk Kompos + Air Cukup (40 mL)",
            pot: "D",
            fields: [
              { id: "potD_kelembapan", type: "angka", satuan: "%" },
              { id: "potD_suhu", type: "angka", satuan: "°C" },
              { id: "potD_warna", type: "pilihan", opsi: ["Merah", "Hijau"] },
              { id: "potD_buzzer", type: "pilihan", opsi: ["Bunyi", "Tenang"] },
            ],
          },
          {
            label: "Uji Siram Pot A",
            sub: "Pot A setelah disiram air 40 mL",
            pot: "A",
            fields: [
              { id: "siramA_kelembapan", type: "angka", satuan: "%" },
              { id: "siramA_suhu", type: "angka", satuan: "°C" },
              { id: "siramA_warna", type: "pilihan", opsi: ["Merah", "Hijau"] },
              { id: "siramA_buzzer", type: "pilihan", opsi: ["Bunyi", "Tenang"] },
            ],
          },
          {
            label: "Uji Siram Pot C",
            sub: "Pot C setelah disiram air 40 mL",
            pot: "C",
            fields: [
              { id: "siramC_kelembapan", type: "angka", satuan: "%" },
              { id: "siramC_suhu", type: "angka", satuan: "°C" },
              { id: "siramC_warna", type: "pilihan", opsi: ["Merah", "Hijau"] },
              { id: "siramC_buzzer", type: "pilihan", opsi: ["Bunyi", "Tenang"] },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "analisis",
    halaman: 7,
    judul: "Ayo Analisis Data! — Yuk, Bandingkan Hasil Percobaan Kita!",
    lingkup: "kelompok",
    blok: [
      {
        jenis: "isian",
        judul: "Investigasi 3A: Kasus Lahan Kering (Pot A & Pot C)",
        fields: [
          {
            id: "a3_sensorA",
            label: "1. Berapa angka kelembapan pada Pot A saat tanahnya kering?",
            type: "angka",
            satuan: "%",
          },
          { id: "a3_sensorC", label: "Angka Sensor A0 Pot C", type: "angka", satuan: "%" },
          {
            id: "a3_layu",
            label: "2. Meskipun jenis tanah Pot A dan Pot C berbeda, kenapa kedua tanaman ini tetap bisa layu?",
            type: "uraian",
            placeholder: "Jawaban kelompok...",
          },
          {
            id: "a3_pupukAir",
            label: "3. Menurut kelompokmu, kenapa pupuk di Pot C butuh air agar bisa diserap oleh akar tanaman?",
            type: "uraian",
            placeholder: "Jawaban kelompok...",
          },
        ],
      },
      {
        jenis: "isian",
        judul: "Investigasi 3B: Kasus Lahan Lembap (Pot B & Pot D)",
        fields: [
          {
            id: "b3_sensorB",
            label: "1. Berapa angka sensor pada Pot B saat tanaman tumbuh sehat?",
            type: "angka",
            satuan: "%",
          },
          { id: "b3_sensorD", label: "Angka Sensor A0 Pot D", type: "angka", satuan: "%" },
          { id: "b3_buzzerTenang", label: "Mengapa Buzzer D8 tenang?", type: "uraian", placeholder: "Jawaban kelompok..." },
          {
            id: "b3_potD",
            label:
              "2. Mengapa tanaman pada Pot D tumbuh jauh lebih tinggi dan berdaun hijau lebat dibandingkan Pot B padahal airnya sama?",
            type: "uraian",
            placeholder: "Jawaban kelompok...",
          },
          {
            id: "b3_pilihan",
            label:
              "3. Kalau ada teman yang menyiram Pot B sampai airnya tergenang becek setiap hari, kamu setuju atau tidak setuju?",
            type: "pilihan",
            opsi: ["Setuju", "Tidak Setuju"],
          },
          { id: "b3_alasan", label: "Alasan kelompok kami", type: "uraian", placeholder: "Tuliskan alasannya ya!" },
        ],
      },
    ],
  },

  {
    id: "refleksi",
    halaman: 8,
    judul: "Buku Catatan Hasil Percobaan",
    subjudul: "Yuk, ceritakan pengalaman dan perasaanmu setelah menyelesaikan misi seru hari ini!",
    lingkup: "siswa",
    blok: [
      {
        jenis: "catatan",
        teks: "Halaman ini diisi sendiri-sendiri, bukan bersama kelompok. Jawabanmu di sini hanya terlihat olehmu dan gurumu.",
      },
      {
        jenis: "isian",
        fields: [
          {
            id: "perasaan",
            label: "1. Bagaimana perasaanmu selama belajar dan bereksperimen menggunakan AGRO EDU BOX hari ini?",
            type: "pilihan",
            opsi: ["Sangat Senang & Antusias", "Senang", "Biasa Saja", "Masih Bingung"],
          },
          { id: "perasaanAlasan", label: "Alasanmu", type: "uraian", placeholder: "Ceritakan alasannya..." },
          {
            id: "kegiatanDisukai",
            label: "2. Kegiatan mana yang paling kamu sukai dalam petualangan hari ini? (boleh pilih lebih dari satu)",
            type: "pilihanGanda",
            opsi: [
              "Membaca cerita & animasi Si Tunas",
              "Menancapkan sensor IoT & mendengar alarm Buzzer",
              "Menyiram & mengamati 4 Pot Tanaman",
              "Merancang produk Kompos Organik bersama teman",
            ],
          },
          {
            id: "halBaru",
            label: "3. Satu hal baru paling berharga yang aku pahami hari ini adalah:",
            type: "uraian",
            placeholder: "Jawabanmu...",
          },
          {
            id: "halHebat",
            label: "4. Tuliskan satu hal hebat yang akan kamu lakukan di rumah atau sekolah mulai hari ini!",
            type: "uraian",
            placeholder: "Jawabanmu...",
          },
        ],
      },
    ],
  },
];

// ─── Pemeriksaan isi ────────────────────────────────────────────────────
export const MAKS_TEKS = 150;
export const MAKS_URAIAN = 800;

export function semuaField(bagian: LkpdBagian): LkpdField[] {
  return bagian.blok.flatMap((blok) => {
    if (blok.jenis === "isian") return blok.fields;
    if (blok.jenis === "kolom") return blok.kolom.flatMap((k) => k.fields);
    if (blok.jenis === "tabel") return blok.baris.flatMap((b) => b.fields);
    if (blok.jenis === "jodoh") {
      return blok.kiri.map((k): LkpdField => ({ id: k.id, type: "pilihan", opsi: PILIHAN_JODOH }));
    }
    return [];
  });
}

/** Semua field untuk satu lingkup, dipakai siswa dan server. */
export function fieldLingkup(lingkup: LkpdLingkup): Map<string, LkpdField> {
  const peta = new Map<string, LkpdField>();
  for (const bagian of LKPD_BAGIAN) {
    if (bagian.lingkup !== lingkup) continue;
    for (const field of semuaField(bagian)) peta.set(field.id, field);
  }
  return peta;
}

export type LkpdJawaban = Record<string, string | string[]>;

/**
 * Membuang isian yang tidak dikenal dan memotong teks yang kelewat panjang.
 * Dipakai di server: isi dari browser tidak pernah dipercaya apa adanya.
 */
export function bersihkanJawaban(lingkup: LkpdLingkup, masuk: unknown): LkpdJawaban {
  if (!masuk || typeof masuk !== "object" || Array.isArray(masuk)) return {};
  const dikenal = fieldLingkup(lingkup);
  const hasil: LkpdJawaban = {};

  for (const [id, nilai] of Object.entries(masuk as Record<string, unknown>)) {
    const field = dikenal.get(id);
    if (!field) continue;

    // Nilai kosong sengaja ikut disimpan: server menggabungkan jawaban baru ke
    // jawaban lama, jadi isian yang dihapus siswa harus bisa menimpa isi lama.
    if (field.type === "pilihanGanda") {
      if (!Array.isArray(nilai)) continue;
      const pilihan = nilai.filter((v): v is string => typeof v === "string" && (field.opsi ?? []).includes(v));
      hasil[id] = [...new Set(pilihan)];
      continue;
    }

    if (typeof nilai !== "string") continue;
    const teks = nilai.trim();
    if (!teks) {
      hasil[id] = "";
      continue;
    }

    if (field.type === "pilihan") {
      if ((field.opsi ?? []).includes(teks)) hasil[id] = teks;
      continue;
    }
    if (field.type === "angka") {
      const angka = Number(teks);
      if (!Number.isFinite(angka)) continue;
      const maks = field.satuan === "%" ? 100 : 60;
      if (angka < 0 || angka > maks) continue;
      hasil[id] = teks;
      continue;
    }
    hasil[id] = teks.slice(0, field.type === "uraian" ? MAKS_URAIAN : MAKS_TEKS);
  }
  return hasil;
}

/** Berapa isian yang sudah terisi, untuk bilah kemajuan. */
export function hitungKemajuan(lingkup: LkpdLingkup, jawaban: LkpdJawaban) {
  const semua = [...fieldLingkup(lingkup).keys()];
  const terisi = semua.filter((id) => {
    const nilai = jawaban[id];
    return Array.isArray(nilai) ? nilai.length > 0 : Boolean(nilai);
  });
  return { terisi: terisi.length, total: semua.length };
}
