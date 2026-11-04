# AGRO EDU BOX — Spesifikasi Fitur & Halaman

> Sumber: *Rancangan Lengkap Fitur, Alur, dan Wireframe Sistem Web AGRO EDU BOX* (versi rancangan awal).
> Dokumen ini dipecah per halaman agar mudah di-slicing ke Next.js (App Router).
> Visual & token: lihat `design.md`.

**Catatan penting dari sumber:** nama menu, contoh angka, teks UI, rancangan data, dan contoh rubrik adalah *usulan desain* yang perlu divalidasi dengan proposal final dan kebutuhan sekolah. Angka di wireframe (28,4°C, 62%, dst.) **bukan data aktual**.

---

## 1. Ringkasan Produk

- Satu web responsif (laptop + HP), dua peran utama: **Siswa** dan **Guru (AGRO EDU TRACK)**. Peran ketiga: **Administrator** (pengaturan perangkat & hak akses).
- Alur pembelajaran: materi → praktik → bukti → asesmen → refleksi → umpan balik.
- IoT: ESP32 + sensor fisik. Setiap data punya waktu pembacaan dan identitas perangkat.
- Ambang sensor **tidak boleh** dilabeli "baik/buruk" dari angka universal; harus dikalibrasi per tanaman, media, dan tahap tumbuh.

## 2. Peran & Navigasi

| Area Siswa | Area Guru | Tujuan |
|---|---|---|
| Beranda | Dashboard | Ringkasan aktivitas & tindak lanjut |
| Materi | Kelola materi | Mempelajari / mengelola modul |
| Lab IoT | Data tanaman & sensor | Lihat data & pantau perangkat |
| Misi & Tugas | Tugas dan penilaian | Kumpulkan bukti / nilai hasil |
| Kuis | Laporan & analitik | Ukur pemahaman & perkembangan |
| Profil | Kelola kelas / Pengaturan | Progres & akses |

Wireframe menu: Siswa = `Beranda, Materi, Lab IoT, Misi & Tugas, Kuis, Profil`. Guru = `Dashboard, Kelas, Data IoT, Materi, Tugas, Laporan`.

## 3. Peta Route (usulan Next.js App Router)

```
app/
├─ (public)/
│  ├─ page.tsx                       # 4.1 Landing + masuk siswa
│  └─ guru/login/page.tsx            # 5.1 Login guru
├─ (siswa)/
│  ├─ layout.tsx                     # Sidebar (lg) / Bottom nav (mobile)
│  ├─ beranda/page.tsx               # 4.2
│  ├─ materi/page.tsx                # 4.3
│  ├─ materi/[slug]/page.tsx         # 4.4
│  ├─ lab-iot/page.tsx               # 4.5
│  ├─ lab-iot/[sensorId]/page.tsx    # 4.6
│  ├─ misi/page.tsx                  # daftar misi
│  ├─ misi/[id]/page.tsx             # 4.7 Kartu Misi Digital
│  ├─ misi/[id]/kerjakan/page.tsx    # 4.8 Form pengerjaan
│  ├─ kuis/[id]/page.tsx             # 4.9
│  ├─ kuis/[id]/hasil/page.tsx       # 4.10
│  └─ profil/page.tsx                # 4.11
├─ (guru)/guru/
│  ├─ layout.tsx
│  ├─ dashboard/page.tsx             # 5.2
│  ├─ kelas/page.tsx                 # 5.3
│  ├─ kelas/[id]/page.tsx            # 5.4
│  ├─ kelas/[id]/siswa/[siswaId]/page.tsx  # 5.5
│  ├─ materi/page.tsx                # 5.6
│  ├─ materi/[id]/edit/page.tsx
│  ├─ tugas/page.tsx                 # 5.7
│  ├─ tugas/[id]/penilaian/page.tsx  # 5.8
│  ├─ iot/page.tsx                   # 5.9
│  ├─ laporan/page.tsx               # 5.10
│  └─ pengaturan/page.tsx            # 5.11
└─ api/
   └─ iot/ingest/route.ts            # endpoint penerima data ESP32
```

---

## 4. Halaman Siswa

### 4.1 Halaman Awal & Identitas Siswa — `/`
- **Fungsi:** memulai sesi dan mengaitkan aktivitas ke siswa & kelas.
- **Komponen:** nama siswa, kelas/kelompok, kode kelas (opsional), tombol "Mulai", penjelasan singkat AGRO EDU BOX.
- **Alur:** isi nama → pilih kelas → masuk dashboard.
- **Catatan sistem:** untuk riwayat lintas sesi/perangkat dibutuhkan identitas stabil. Nama saja bisa menyebabkan data ganda → lihat keputusan §13.

### 4.2 Dashboard Siswa — `/beranda`
- **Fungsi:** menunjukkan langkah berikutnya.
- **Komponen:** sapaan ("Halo, Andi!"), 2 kartu sensor (Suhu Udara, Kelembapan Tanah), kartu **Tanaman/Kelas** (status & ringkasan), **Aktivitas terbaru** (materi/tugas, data diperbarui, umpan balik), grafik **Riwayat sensor / progres belajar**, ringkasan materi selesai, misi, skor kuis terakhir, status perangkat, eksperimen aktif.
- **Catatan:** tampilkan hanya indikator yang membantu tindakan; hindari terlalu banyak grafik.

### 4.3 Daftar Materi — `/materi`
- **Komponen:** pencarian, filter topik, kartu modul, status selesai/belum, durasi/jenis aktivitas (jika sudah ditentukan).

### 4.4 Detail Modul — `/materi/[slug]`
- **Komponen:** tujuan pembelajaran, materi inti, gambar/video, aktivitas, pertanyaan, kuis/refleksi, status penyelesaian.

### 4.5 Lab IoT — `/lab-iot`
- **Komponen:** identitas perangkat, status koneksi, suhu udara, kelembapan tanah, waktu data terakhir, grafik, catatan pengamatan.
- **Aturan kritis:**
  - Pisahkan **real-time**, **data terakhir tersimpan**, dan **simulasi**.
  - Sensor terputus **tidak boleh** menampilkan angka lama seolah baru.
  - Jika tidak ada data: tampilkan "belum ada data" atau "data terakhir" (dengan timestamp).

### 4.6 Detail Sensor & Riwayat — `/lab-iot/[sensorId]`
- **Komponen:** pemilih sensor, rentang waktu, grafik historis, daftar pembacaan, catatan pengamatan, opsi ekspor.

### 4.7 Kartu Misi Digital — `/misi/[id]`
- **Komponen:** judul misi, tujuan, pertanyaan pemantik, langkah kerja, alat/bahan, bukti yang diperlukan, kriteria selesai, refleksi.
- **Contoh:** "Detektif Tanaman Sehat" (lihat §12).

### 4.8 Formulir Pengerjaan Misi — `/misi/[id]/kerjakan`
- **Komponen:** jawaban pengamatan, data sensor relevan (ambil dari Lab IoT), kesimpulan, unggah foto/dokumen, refleksi, status pengumpulan.
- **Status:** `draf` → `terkirim` → `perlu revisi` → `dinilai`. Simpan waktu kirim & versi revisi.

### 4.9 Kuis — `/kuis/[id]`
- **Komponen:** pertanyaan, pilihan jawaban, indikator kemajuan, navigasi soal, umpan balik, hasil akhir.

### 4.10 Hasil Kuis — `/kuis/[id]/hasil`
- **Komponen:** skor, ringkasan benar/salah, pembahasan, rekomendasi modul, tombol belajar ulang (jika diizinkan).

### 4.11 Profil & Perkembangan — `/profil`
- **Komponen:** identitas & kelas, modul selesai, misi terkumpul, riwayat kuis, komentar guru, aktivitas terbaru.

---

## 5. Halaman Guru — AGRO EDU TRACK

### 5.1 Login Guru — `/guru/login`
- Email/username, kata sandi, pemulihan akun (jika tersedia), sesi aman. Hak akses terpisah dari siswa.

### 5.2 Dashboard Guru — `/guru/dashboard`
- **Kartu indikator (wireframe):** Siswa (24), Kelas (3), Misi (18), Perlu dinilai (5).
- Kartu Tanaman/Kelas, Aktivitas terbaru, grafik riwayat sensor/progres, status perangkat.

### 5.3 Kelola Kelas — `/guru/kelas`
- Nama kelas, kode kelas, daftar siswa, tambah/edit kelas, status kelas.

### 5.4 Detail Kelas — `/guru/kelas/[id]`
- Cari siswa, filter progres, status misi, ringkasan modul, akses detail siswa.

### 5.5 Detail Perkembangan Siswa — `/guru/kelas/[id]/siswa/[siswaId]`
- Progres modul, hasil kuis, status misi, riwayat aktivitas, catatan & umpan balik guru.

### 5.6 Kelola Materi — `/guru/materi`
- Judul, tujuan, isi, gambar/video, aktivitas, kuis, status `draf/terbit/diarsipkan`, kelas sasaran.

### 5.7 Kelola Tugas & Kartu Misi — `/guru/tugas`
- Judul, instruksi, kelas sasaran, tanggal/tenggat, bukti diminta, rubrik, status tugas.

### 5.8 Penilaian & Rubrik — `/guru/tugas/[id]/penilaian`
- Daftar pengumpulan, rubrik, nilai per kriteria, komentar, status revisi, riwayat penilaian.

### 5.9 Pemantauan IoT — `/guru/iot`
- Daftar perangkat, status koneksi, waktu data terakhir, sensor, grafik, histori, indikasi data hilang.

### 5.10 Laporan & Analitik — `/guru/laporan`
- Filter kelas/periode, penyelesaian modul, hasil asesmen, status misi, siswa yang perlu dukungan, ekspor laporan.

### 5.11 Pengaturan — `/guru/pengaturan`
- Profil, kelas, hak akses, perangkat ESP32, jenis sensor, satuan, kalibrasi, frekuensi kirim, notifikasi.

---

## 6. Alur Pengguna

**Siswa:** Masuk → Belajar (modul) → Mengamati (Lab IoT) → Mengerjakan misi → Evaluasi (kuis) → Tindak lanjut (komentar guru / belajar ulang).

**Guru:** Masuk → Siapkan kelas → Siapkan pembelajaran (terbitkan modul & misi) → Pantau (progres & IoT) → Nilai (rubrik) → Evaluasi (laporan).

## 7. IoT: ESP32 & Sensor

| Komponen | Fungsi | Catatan |
|---|---|---|
| ESP32 | Baca sensor & kirim data | ID perangkat unik; tangani koneksi putus |
| Sensor kelembapan tanah | Ukur kelembapan media | Perlu kalibrasi; angka mentah ≠ persen akurat |
| Sensor suhu/kelembapan udara | Kondisi udara | Kandidat: DHT22 (verifikasi akurasi) |
| Sensor cahaya | Intensitas cahaya | Pilih sensor & satuan sesuai eksperimen |
| Catu daya & kabel | Daya & koneksi | Keamanan rangkaian, proteksi air |
| Layanan data/web | Terima, simpan, tampilkan | Simpan waktu, nilai, satuan, ID perangkat, status |

**Data minimum per pembacaan:**
- `deviceId`, `sensorId`
- `measuredAt` (waktu baca) dan `receivedAt` (waktu diterima server)
- `sensorType`, `value`, `unit`
- `validity` (valid/tidak valid) dan `connectionStatus`
- Relasi ke box / tanaman / kelas / kelompok
- `calibrationNote`, `configVersion`

**Status IoT:** `online` · `data terakhir` · `offline` · `data tidak valid` · `simulasi`

## 8. Model Data (usulan, bukan final)

```ts
type Role = "siswa" | "guru" | "admin";
type TaskStatus = "draf" | "terkirim" | "perlu_revisi" | "dinilai";
type ContentStatus = "draf" | "terbit" | "diarsipkan";
type IotStatus = "online" | "data_terakhir" | "offline" | "tidak_valid" | "simulasi";

interface SensorReading {
  deviceId: string;
  sensorId: string;
  sensorType: "soil_moisture" | "air_temp" | "air_humidity" | "light";
  value: number;
  unit: string;
  measuredAt: string;   // ISO
  receivedAt: string;   // ISO
  valid: boolean;
  calibrationNote?: string;
  configVersion?: string;
}

interface Submission {
  id: string;
  missionId: string;
  studentId: string;
  status: TaskStatus;
  observation: string;
  sensorRefs: string[];
  conclusion: string;
  reflection: string;
  attachments: string[];
  submittedAt?: string;
  revision: number;
}
```

## 9. Status, Validasi, Keamanan
- Validasi form: nama, kelas, jawaban wajib, berkas unggahan.
- Pemisahan hak akses siswa / guru / admin; siswa tidak boleh melihat data/nilai siswa lain.
- Riwayat perubahan nilai & komentar guru (akuntabilitas).
- Kebijakan penyimpanan foto, data siswa, dan masa retensi ditetapkan sekolah.

## 10. Tahapan Implementasi
| Tahap | Hasil | Kriteria selesai |
|---|---|---|
| 1. Validasi wireframe | Halaman & alur disepakati | Menu, konten, status disetujui guru |
| 2. Sistem inti | Login/peran, kelas, materi, misi, kuis, penilaian | Alur belajar jalan tanpa IoT |
| 3. IoT fisik | ESP32, sensor, kirim, simpan, grafik | Nilai & waktu tervalidasi; koneksi putus ditangani |
| 4. AGRO EDU TRACK | Analitik kelas | Data progres, nilai, misi konsisten |
| 5. Uji responsif | Laptop & HP + uji pengguna | Form, navigasi, grafik, akses aman |

## 11. Prioritas Fitur
- **Inti:** identitas siswa & akun guru · modul pembelajaran · Kartu Misi & pengumpulan · kuis & umpan balik · ESP32 & sensor · dashboard & pemantauan guru.
- **Lanjutan:** ekspor laporan lanjutan · notifikasi otomatis · mode offline · QR/AR/AI (hanya bila mendukung tujuan belajar).

## 12. Contoh Konten Misi: "Detektif Tanaman Sehat"

**Tujuan:** siswa mengamati tanaman dan memakai pembacaan sensor sebagai salah satu bukti untuk menjelaskan kondisi media tanam.

**Instruksi siswa:**
1. Amati tanaman dan media tanam tanpa mengubahnya dulu.
2. Catat waktu pengamatan dan kondisi yang terlihat.
3. Buka Lab IoT, pilih perangkat, catat nilai sensor + waktu pembacaan.
4. Bandingkan data dengan pengamatan langsung; jangan menyimpulkan dari satu angka.
5. Tulis kesimpulan, bukti yang dipakai, dan satu pertanyaan lanjutan.

**Bukti:** catatan pengamatan · foto tanaman (bila diizinkan) · nilai sensor + waktu · kesimpulan & refleksi.

**Contoh rubrik** (skala final perlu disepakati sekolah):

| Kriteria | Perlu bimbingan | Berkembang | Baik |
|---|---|---|---|
| Pengamatan | Catatan sangat terbatas | Mencatat beberapa kondisi | Catatan jelas dan relevan |
| Penggunaan data | Data tidak dicantumkan/keliru | Data ada, hubungan belum jelas | Data & waktu dipakai sebagai bukti |
| Kesimpulan | Tidak didukung bukti | Sebagian didukung bukti | Logis dan sesuai bukti |
| Refleksi | Belum menyebut pembelajaran | Menyebut hal yang dipelajari | Menjelaskan pembelajaran & langkah lanjut |

## 13. Keputusan yang Perlu Disahkan Sebelum Coding
- [ ] Siswa cukup nama + kode kelas, atau perlu akun individual?
- [ ] Topik & urutan modul final sesuai proposal.
- [ ] Format & jumlah Kartu Misi Digital.
- [ ] Jenis sensor, model ESP32, jumlah box, rancangan kalibrasi.
- [ ] Cara ESP32 kirim data ke server & kebutuhan jaringan sekolah.
- [ ] Kriteria rubrik & bobot nilai resmi.
- [ ] Siapa yang boleh akses, ubah, atau ekspor data.
- [ ] Mode offline perlu di versi awal?

## 14. Prinsip Penutup
Fitur yang dibangun harus mendukung pendekatan pembelajaran yang ditetapkan proposal, bukan menggantinya dengan fitur tambahan yang tidak diperlukan.
