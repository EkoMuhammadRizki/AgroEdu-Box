# SPEC.md — Penyesuaian Fitur Website AGRO EDU BOX

> Dokumen ini ditujukan untuk **AI coding agent (Antigravity)**. Website AGRO EDU BOX **sudah ada** (Next.js). Tugasmu bukan membangun dari nol, melainkan **menyesuaikan** website yang ada: menambah, mengubah, dan (setelah konfirmasi) menghapus fitur sesuai spesifikasi ini.
> Tampilan visual mengikuti **`DESIGN.md`** (tema Situnas: hijau ceria, pil, rounded). Dokumen ini hanya mengatur **fitur, alur, data, dan perilaku**.

---

## 0. Instruksi untuk Agent (WAJIB dibaca dulu)

1. **Audit dulu, jangan langsung menulis kode.** Baca struktur project (`app/`, `components/`, API routes, model/skema data, env). Buat ringkasan singkat: fitur apa yang sudah ada, di file mana, dan bagaimana datanya disimpan.
2. **Cocokkan dengan Bagian 2 (Matriks Perubahan).** Tandai tiap baris: sudah ada / sebagian / belum ada. Jangan membuat ulang fitur yang sudah ada; cukup ubah.
3. **Jangan menghapus fitur atau data apa pun tanpa konfirmasi pengguna.** Fitur berlabel `REVIEW` harus ditanyakan dulu. Untuk label `REMOVE`, hapus hanya setelah pengguna setuju.
4. **Pertahankan stack yang sudah dipakai** (Next.js). Jangan mengganti framework, library UI, atau database tanpa izin. Gunakan pola yang sudah ada di project.
5. **Kerjakan bertahap sesuai Bagian 11 (Tahapan)**, satu tahap per sesi/commit. Setelah tiap tahap, jelaskan apa yang berubah dan cara mengujinya.
6. **Data contoh bukan data aktual.** Jangan menampilkan angka sensor palsu sebagai data nyata (lihat Bagian 7).
7. Bila ada keputusan yang belum ditetapkan (Bagian 12), **ambil asumsi paling sederhana yang mudah diubah**, tulis asumsinya di ringkasan, lalu lanjut.

---

## 1. Ringkasan Produk

AGRO EDU BOX adalah platform pembelajaran agrikultur berbasis IoT untuk siswa dan guru.

- **Dua peran utama:** Siswa dan Guru (+ Administrator untuk pengaturan perangkat/akses).
- **Siklus belajar:** materi → praktik → bukti → asesmen → refleksi → umpan balik.
- **IoT:** Arduino/ESP + sensor fisik (kelembapan tanah A0 & suhu udara DHT22). Setiap data punya waktu pembacaan dan identitas perangkat.
- **Satu web responsif** untuk laptop dan HP.
- **AGRO EDU TRACK:** area guru untuk memantau kelas, menilai, dan menindaklanjuti.

> Catatan: nama menu, contoh angka, dan contoh rubrik adalah usulan desain dan perlu divalidasi dengan naskah proposal final dan kebutuhan sekolah.

---

## 2. Matriks Perubahan (Inti Dokumen)

Legenda: `ADD` tambah · `MODIFY` ubah yang sudah ada · `KEEP` pertahankan · `REVIEW` tanyakan ke pengguna sebelum diubah/dihapus · `REMOVE` hapus setelah konfirmasi

### 2.1 Area Siswa

| # | Fitur | Aksi | Catatan |
|---|---|---|---|
| S1 | Layar pembuka & sambutan Situnas | KEEP | Sesuai `DESIGN.md` |
| S2 | Input nama + pilih karakter (Original/Girl) | MODIFY | Tambah **pilih kelas / kode kelas** dan identitas stabil (lihat 4.1) |
| S3 | Dashboard siswa | MODIFY | Fokus ke "langkah berikutnya": materi, misi belum dikumpulkan, skor kuis terakhir, status perangkat, eksperimen aktif |
| S4 | Daftar materi (katalog) | ADD/MODIFY | Pencarian, filter topik, status selesai/belum |
| S5 | Detail modul pembelajaran (Learning Lab) | MODIFY | Tujuan belajar → materi → media → aktivitas → pertanyaan → kuis/refleksi → status selesai |
| S6 | Lab IoT / dashboard sensor | MODIFY | Dari satu sensor (kelembapan tanah A0) menjadi multi-sensor + status data (lihat 4.5 & Bagian 7) |
| S7 | Detail sensor & riwayat | ADD | Grafik historis, rentang waktu, daftar pembacaan, catatan pengamatan |
| S8 | Kartu Misi Digital | MODIFY | Ubah "Misi Harian: Siram!" menjadi Kartu Misi lengkap (tujuan, langkah, bukti, kriteria selesai, refleksi) |
| S9 | Formulir pengerjaan & pengumpulan misi | ADD | Jawaban, data sensor, foto/dokumen, refleksi, status draf/terkirim/revisi/dinilai |
| S10 | Kuis & evaluasi | MODIFY | Simpan hasil ke database; navigasi soal; umpan balik |
| S11 | Hasil kuis & umpan balik | MODIFY | Tambah ringkasan benar/salah, pembahasan, rekomendasi modul, belajar ulang |
| S12 | Profil & perkembangan siswa | ADD | Modul selesai, misi terkumpul, riwayat kuis, komentar guru |
| S13 | Bioskop Agro (video mekanisme sensor) | REVIEW | Tidak disebut di dokumen rancangan; kemungkinan dilebur ke media dalam modul (S5) |
| S14 | Bintang/poin, piala, sertifikat | REVIEW | Tidak disebut di dokumen rancangan; tanyakan apakah dipertahankan sebagai lapisan gamifikasi |
| S15 | Misi Harian (checklist di dashboard) | REVIEW | Pastikan selaras dengan Kartu Misi (S8) agar tidak ada dua sistem misi |

### 2.2 Area Guru — AGRO EDU TRACK (semua baru)

| # | Fitur | Aksi |
|---|---|---|
| G1 | Login guru (terpisah dari siswa) | ADD |
| G2 | Dashboard guru | ADD |
| G3 | Kelola kelas (buat kelas, kode kelas, daftar siswa) | ADD |
| G4 | Detail kelas & daftar siswa (cari, filter progres) | ADD |
| G5 | Detail perkembangan siswa | ADD |
| G6 | Kelola materi (draf/terbit/arsip, kelas sasaran) | ADD |
| G7 | Kelola tugas & Kartu Misi (instruksi, tenggat, rubrik) | ADD |
| G8 | Penilaian & rubrik (nilai per kriteria, komentar, revisi) | ADD |
| G9 | Pemantauan IoT (perangkat, koneksi, histori, data hilang) | ADD |
| G10 | Laporan & analitik (filter kelas/periode, ekspor) | ADD |
| G11 | Pengaturan (perangkat ESP32, sensor, satuan, kalibrasi, frekuensi, hak akses) | ADD |

### 2.3 Lintas Sistem

| # | Fitur | Aksi |
|---|---|---|
| X1 | Peran & hak akses (siswa / guru / admin) | ADD |
| X2 | Penyimpanan data persisten (progres, submission, nilai, kuis) | ADD/MODIFY |
| X3 | Penyimpanan data sensor + status validitas | ADD/MODIFY |
| X4 | Riwayat perubahan nilai & komentar guru | ADD |
| X5 | Layout responsif laptop (sidebar) & HP (bottom nav) | MODIFY |

### 2.4 Fitur Lanjutan (jangan dikerjakan di tahap awal)

Ekspor laporan lanjutan · Notifikasi otomatis · Mode offline/penyimpanan sementara · QR/AR/AI. Tambahkan hanya bila diminta dan tujuan belajarnya jelas.

---

## 3. Struktur Peran & Navigasi

| Area Siswa | Area Guru | Tujuan |
|---|---|---|
| Beranda | Dashboard | Ringkasan aktivitas & tindak lanjut |
| Materi pembelajaran | Kelola materi | Mempelajari / mengelola modul |
| Lab IoT / Data tanaman | Data tanaman & sensor | Melihat data & memantau perangkat |
| Kartu Misi / Tugas | Tugas & penilaian | Mengumpulkan bukti / menilai |
| Kuis & evaluasi | Laporan & analitik | Mengukur pemahaman & perkembangan |
| Perkembangan belajar / Profil | Kelola kelas / Pengaturan | Progres / mengelola akses |

Rute yang disarankan (sesuaikan dengan struktur yang sudah ada):

```
/                      Pembuka
/masuk                 Identitas siswa (nama + kelas)
/siswa/beranda
/siswa/materi          /siswa/materi/[id]
/siswa/lab-iot         /siswa/lab-iot/[sensorId]
/siswa/misi            /siswa/misi/[id]        /siswa/misi/[id]/kumpul
/siswa/kuis            /siswa/kuis/[id]        /siswa/kuis/[id]/hasil
/siswa/profil
/guru/masuk
/guru/dashboard
/guru/kelas            /guru/kelas/[id]        /guru/kelas/[id]/siswa/[siswaId]
/guru/materi           /guru/materi/[id]/edit
/guru/tugas            /guru/tugas/[id]/edit
/guru/penilaian        /guru/penilaian/[submissionId]
/guru/iot
/guru/laporan
/guru/pengaturan
```

---

## 4. Spesifikasi Fitur Siswa

### 4.1 Halaman awal & identitas
- **Fungsi:** memulai sesi dan mengaitkan aktivitas dengan siswa + kelas yang tepat.
- **Komponen:** nama, kelas/kelompok, kode kelas (bila dipakai), pilihan karakter, tombol mulai.
- **Perilaku:** nama saja bisa menyebabkan **data ganda**. Gunakan identitas stabil (mis. `studentId` dari kode kelas + nama, disimpan di database dan token sesi). Jika nama yang sama sudah ada di kelas itu, tampilkan konfirmasi "Apakah ini kamu?" alih-alih membuat siswa baru.
- Keputusan akun individual vs nama + kode kelas: lihat Bagian 12. Asumsi awal: **nama + kode kelas**.

### 4.2 Dashboard siswa
- Tampilkan hanya yang membantu tindakan: modul selesai, misi belum dikumpulkan, skor kuis terakhir, status perangkat IoT, eksperimen aktif, aktivitas terbaru.
- Hindari banyak grafik di halaman awal.
- Pertahankan maskot Situnas dan panel Live IoT / Daily Missions / Quiz Corner / Learning Lab dari desain, tetapi datanya harus berasal dari database, bukan statis.

### 4.3 Daftar materi
Pencarian, filter topik, kartu modul, status selesai/belum, durasi/jenis aktivitas bila ada.

### 4.4 Detail modul
Urutan: **tujuan pembelajaran → materi inti → gambar/video → aktivitas → pertanyaan → kuis/refleksi → status selesai.** Catat status & waktu penyelesaian per siswa.

### 4.5 Lab IoT & dashboard sensor
- **Komponen:** identitas perangkat, status koneksi, suhu udara, kelembapan tanah, waktu data terakhir, grafik, catatan pengamatan.
- **Aturan penting:**
  - Pisahkan tampilan **real-time**, **data terakhir tersimpan**, dan **data simulasi**.
  - Sensor terputus **tidak boleh** menampilkan angka lama seolah baru. Tampilkan "Data terakhir • {waktu}" atau "Belum ada data".
  - Jangan memberi label "baik/buruk" dari ambang universal (lihat Bagian 7).
- Jika sebelumnya hanya ada sensor kelembapan tanah (A0), pertahankan tampilannya sebagai salah satu kartu sensor.

### 4.6 Detail sensor & riwayat
Pilih sensor, rentang waktu, grafik historis, daftar pembacaan, catatan pengamatan, opsi ekspor (opsional). Tujuannya membantu siswa membaca **tren**, bukan angka sesaat.

### 4.7 Kartu Misi Digital
Judul, tujuan, pertanyaan pemantik, langkah kerja, alat/bahan, bukti yang diperlukan, kriteria selesai, refleksi. Contoh lengkap ada di Bagian 10.

### 4.8 Formulir pengerjaan & pengumpulan
- **Isi:** jawaban pengamatan, data sensor relevan (bisa "lampirkan pembacaan" dari Lab IoT), kesimpulan, unggah foto/dokumen, refleksi.
- **Status:** `draf → terkirim → perlu_revisi → dinilai`.
- Simpan waktu pengiriman dan **versi revisi**.
- Validasi: jawaban wajib, tipe & ukuran berkas.

### 4.9–4.10 Kuis & hasil
- Soal, pilihan jawaban, indikator kemajuan, navigasi soal, umpan balik per soal.
- Hasil: skor, ringkasan benar/salah, pembahasan, **rekomendasi modul untuk ditinjau**, kesempatan ulang bila diizinkan guru.
- Simpan setiap percobaan (`attempt`) beserta jawaban.

### 4.11 Profil & perkembangan
Identitas & kelas, modul selesai, misi terkumpul, riwayat kuis, komentar guru, aktivitas terbaru. Siswa **hanya** melihat data dirinya.

---

## 5. Spesifikasi Fitur Guru (AGRO EDU TRACK)

| # | Halaman | Isi inti | Catatan perilaku |
|---|---|---|---|
| 5.1 | Login guru | Email/username, kata sandi, sesi aman, pemulihan akun bila ada | Hak akses guru terpisah dari siswa |
| 5.2 | Dashboard | Jumlah siswa/kelas, misi terkumpul, tugas menunggu penilaian, status perangkat, ringkasan progres | Pintasan ke daftar pengumpulan |
| 5.3 | Kelola kelas | Nama kelas, **kode kelas**, daftar siswa, tambah/edit, status | Kode kelas dibagikan ke siswa |
| 5.4 | Detail kelas | Cari siswa, filter progres, status misi, ringkasan modul | Filter "belum selesai modul X" |
| 5.5 | Detail siswa | Progres modul, hasil kuis, status misi, riwayat aktivitas, catatan guru | Lihat siswa kuis bagus tapi laporan belum masuk |
| 5.6 | Kelola materi | Judul, tujuan, isi, media, aktivitas, kuis, status `draf/terbit/diarsipkan`, kelas sasaran | Terbit hanya ke kelas sasaran |
| 5.7 | Kelola tugas & misi | Judul, instruksi, kelas sasaran, tanggal/tenggat, bukti diminta, rubrik, status | |
| 5.8 | Penilaian & rubrik | Daftar pengumpulan, nilai per kriteria, komentar, status revisi, riwayat penilaian | Simpan riwayat perubahan nilai |
| 5.9 | Pemantauan IoT | Daftar perangkat, status koneksi, waktu data terakhir, sensor, grafik, histori, indikasi data hilang | Cek sebelum meminta siswa menyimpulkan |
| 5.10 | Laporan & analitik | Filter kelas/periode, penyelesaian modul, hasil asesmen, status misi, siswa perlu dukungan, ekspor | Tampilkan materi yang paling banyak belum selesai |
| 5.11 | Pengaturan | Profil, kelas, hak akses, perangkat ESP32, jenis sensor, satuan, kalibrasi, frekuensi kirim, notifikasi | Admin-only untuk perangkat |

> Tampilan guru memakai token warna & font yang sama dengan `DESIGN.md`, tetapi **lebih padat dan informatif** (tabel, filter, sidebar) dibanding area siswa yang lebih bermain.

---

## 6. Alur Penggunaan

**Siswa:** Masuk (nama + kelas) → Belajar (modul) → Mengamati (Lab IoT) → Mengerjakan misi (catatan, bukti, refleksi) → Kuis → Tindak lanjut (baca komentar guru / belajar ulang). Sistem mencatat status & riwayat di tiap langkah.

**Guru:** Masuk → Siapkan kelas (kode kelas, siswa) → Terbitkan modul & misi → Pantau progres & data IoT → Nilai dengan rubrik → Tinjau laporan untuk tindak lanjut.

---

## 7. IoT: ESP32 & Sensor

### 7.1 Komponen
| Komponen | Fungsi | Catatan |
|---|---|---|
| ESP32 | Baca sensor & kirim data | ID perangkat unik, tangani koneksi putus |
| Sensor kelembapan tanah | Kelembapan media | **Perlu kalibrasi**; angka mentah ≠ persen akurat |
| Sensor suhu/kelembapan udara | Kondisi udara | Kandidat: DHT22 (verifikasi) |
| Sensor cahaya | Intensitas cahaya | Pilih sensor & satuan sesuai eksperimen |
| Layanan data/web | Terima, simpan, tampilkan | Simpan waktu, nilai, satuan, ID perangkat, status |

### 7.2 Data minimum per pembacaan
```ts
type SensorReading = {
  deviceId: string;
  sensorId: string;
  sensorType: "soil_moisture" | "air_temp" | "air_humidity" | "light";
  value: number;
  unit: string;                 // "%", "°C", "lux", dll.
  measuredAt: string;           // waktu pembacaan (ISO)
  receivedAt: string;           // waktu diterima server (ISO)
  validity: "valid" | "invalid" | "simulated";
  connection: "online" | "last_known" | "offline";
  boxId?: string;               // kaitan ke box/tanaman/kelas/kelompok
  classId?: string;
  calibrationNote?: string;
  configVersion?: string;
};
```

### 7.3 Aturan tampilan
- Status IoT: `online`, `data terakhir`, `offline`, `data tidak valid`, `simulasi`.
- Tidak ada data → tulis **"Belum ada data"**, jangan angka 0 atau angka lama.
- **Jangan** memberi label baik/buruk dari ambang universal. Ambang harus dapat dikonfigurasi (per tanaman, media, tahap tumbuh, hasil kalibrasi) di Pengaturan.
- Jika ada mode demo, beri penanda **"SIMULASI"** yang jelas.

---

## 8. Prinsip Visual & Responsif

Visual mengikuti `DESIGN.md`. Penyesuaian perilaku layout:

| Aspek | Laptop | HP |
|---|---|---|
| Navigasi | Sidebar kiri (submenu bila perlu) | Menu ringkas / bottom nav |
| Dashboard | Kartu indikator multi-kolom | Kartu vertikal, 2 kolom bila cukup |
| Tabel | Filter + sortir | Diubah jadi daftar kartu, info penting dulu |
| Grafik | Lebar, pilihan rentang waktu | Adaptif, legenda ringkas, bisa digeser |
| Formulir | Kolom berdampingan | Satu kolom, label jelas |
| Tombol aksi | Dekat judul / akhir form | Besar, mudah disentuh (min 44px) |

---

## 9. Status, Validasi, Keamanan

**Status**
- Tugas: `draf`, `terkirim`, `perlu_revisi`, `dinilai`
- Materi: `draf`, `terbit`, `diarsipkan`
- IoT: `online`, `data_terakhir`, `offline`, `data_tidak_valid`, `simulasi`

**Validasi:** nama, kelas, jawaban wajib, berkas unggahan (tipe & ukuran).

**Keamanan & akses**
- Pisahkan hak akses **siswa / guru / administrator** (cek di server, bukan hanya di UI).
- Siswa tidak boleh melihat data pribadi atau nilai siswa lain.
- Guru hanya melihat kelas miliknya.
- Simpan riwayat perubahan nilai & komentar guru.
- Kebijakan penyimpanan foto, data siswa, dan masa retensi ditetapkan sekolah; sediakan konfigurasi, jangan di-hardcode.
- Endpoint penerima data ESP32 harus diautentikasi (mis. token per perangkat) dan memvalidasi payload.

---

## 10. Contoh Isi Misi: "Detektif Tanaman Sehat"

**Tujuan:** siswa mengamati tanaman dan memakai pembacaan sensor sebagai salah satu bukti untuk menjelaskan kondisi media tanam.

**Instruksi siswa**
1. Amati kondisi tanaman & media tanam tanpa mengubahnya dulu.
2. Catat waktu pengamatan dan kondisi yang terlihat.
3. Buka Lab IoT, pilih perangkat yang sesuai, catat nilai sensor + waktu pembacaan.
4. Bandingkan data dengan pengamatan langsung; jangan menyimpulkan dari satu angka.
5. Tulis kesimpulan, bukti yang dipakai, dan satu pertanyaan lanjutan.

**Bukti dikumpulkan:** catatan pengamatan · foto tanaman (bila diizinkan) · nilai sensor + waktu · kesimpulan & refleksi.

**Contoh rubrik (data awal, bobot final ditetapkan sekolah)**

| Kriteria | Perlu bimbingan | Berkembang | Baik |
|---|---|---|---|
| Pengamatan | Catatan sangat terbatas | Mencatat beberapa kondisi | Catatan jelas & relevan |
| Penggunaan data | Data tidak ada/keliru | Data ada, hubungan belum jelas | Data & waktu dipakai sebagai bukti |
| Kesimpulan | Tidak didukung bukti | Sebagian didukung bukti | Logis & sesuai bukti |
| Refleksi | Belum menyebut pembelajaran | Menyebut yang dipelajari | Menjelaskan pembelajaran & langkah lanjut |

Gunakan sebagai **seed data** contoh; jangan dianggap rubrik resmi.

---

## 11. Tahapan Implementasi

| Tahap | Hasil | Kriteria selesai |
|---|---|---|
| 0. Audit | Ringkasan fitur & kode yang ada + pemetaan ke Bagian 2 | Daftar `ada / sebagian / belum` disetujui pengguna |
| 1. Fondasi | Peran (siswa/guru/admin), kelas, identitas stabil, skema database | Login/peran jalan; siswa bisa masuk dengan kode kelas |
| 2. Sistem inti | Materi, Kartu Misi, pengumpulan, kuis, penilaian | Alur belajar berjalan **tanpa IoT** |
| 3. IoT | Penerimaan data ESP32, penyimpanan, grafik, status koneksi | Nilai & waktu valid; koneksi putus tertangani |
| 4. AGRO EDU TRACK | Dashboard guru, laporan, tindak lanjut | Progres, nilai, misi konsisten |
| 5. Responsif & uji | Uji laptop & HP, aksesibilitas, hak akses | Form, navigasi, grafik, dan akses aman lolos |
| 6. Gamifikasi (bila dipertahankan) | Bintang, piala, sertifikat terhubung ke data nyata | Poin berasal dari progres, bukan statis |

---

## 12. Keputusan yang Belum Ditetapkan (Asumsi Awal)

| Pertanyaan | Asumsi sementara agent |
|---|---|
| Siswa cukup nama + kode kelas, atau akun individual? | Nama + kode kelas |
| Topik & urutan modul final? | Pakai modul yang sudah ada; urutan bisa diubah guru |
| Format & jumlah Kartu Misi? | Satu template (Bagian 4.7), jumlah dinamis dari database |
| Jenis sensor, model ESP32, jumlah box, kalibrasi? | Tiga jenis sensor (tanah, suhu/udara, cahaya); ambang dapat dikonfigurasi |
| Cara ESP32 kirim data ke server? | HTTP POST ke endpoint dengan token perangkat |
| Rubrik & bobot resmi? | Gunakan contoh di Bagian 10 sebagai seed |
| Siapa boleh akses/ubah/ekspor data? | Guru: kelas sendiri; Admin: semua; Siswa: data sendiri |
| Perlu mode offline di versi awal? | Tidak |
| Bintang/piala/sertifikat/Bioskop Agro dipertahankan? | **Tanyakan ke pengguna** (REVIEW S13–S15) |

---

## 13. Kriteria Penerimaan (Checklist Akhir)

- [ ] Semua baris `ADD` & `MODIFY` di Bagian 2 sudah diimplementasikan atau dicatat alasan ditunda
- [ ] Tidak ada fitur/data yang dihapus tanpa konfirmasi pengguna
- [ ] Siswa tidak dapat membuka data siswa lain; siswa tidak dapat membuka halaman `/guru/*` (diuji di server)
- [ ] Data sensor menampilkan waktu pembacaan dan status; sensor terputus tidak menampilkan angka lama sebagai baru
- [ ] Tidak ada label baik/buruk dari ambang tetap yang tidak dapat dikonfigurasi
- [ ] Pengumpulan misi menyimpan status & versi revisi; nilai menyimpan riwayat perubahan
- [ ] Tampilan sesuai `DESIGN.md` (warna, font, pil, radius) dan responsif laptop/HP
- [ ] Ringkasan perubahan per tahap ditulis oleh agent setelah selesai
