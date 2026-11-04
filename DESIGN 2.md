# DESIGN.md — Agro-Edu Box

Panduan desain untuk merevisi tampilan web agar sesuai dengan referensi UI (alur Opening → Input Nama → Profil Karakter → Dashboard → Kuis → Hasil & Sertifikat).
Stack: **Next.js**. Token di bawah ditulis sebagai CSS variables (bisa langsung dipakai di `globals.css`) dan dipetakan ke Tailwind jika project memakainya.

---

## 1. Karakter Visual

- **Tema:** Pertanian ceria untuk anak/remaja, gamified, ramah, "soft 3D cartoon".
- **Maskot:** Tunas hijau bermata besar bernama **Situnas** (dua daun di atas kepala). Muncul di hampir semua layar sebagai pemandu.
- **Suasana:** Cerah, segar, organik. Latar langit biru muda + bukit hijau + awan, dihiasi kupu-kupu dan kumbang (ladybug) kecil.
- **Bentuk:** Sangat membulat (rounded), tombol berbentuk pil, kartu seperti "bubble", bayangan lembut. Tidak ada sudut tajam.
- **Nada bahasa:** Menyapa langsung, semangat, bahasa Indonesia santai. Contoh: "Halo, Petani Muda!", "Ayo Mulai!", "Siap Uji Pengetahuan?".

---

## 2. Color Tokens

### 2.1 Palet Utama

| Token | Hex | Kegunaan |
|---|---|---|
| `--green-600` | `#3F9B2E` | Tombol primer (gradien bawah), teks judul aksen, ikon aktif |
| `--green-500` | `#6CC04A` | Warna utama brand, tombol primer (gradien atas), border kartu |
| `--green-400` | `#8FD16A` | Daun maskot, progress, highlight |
| `--green-200` | `#CDEBB0` | Latar kartu hijau muda, chip, panel |
| `--green-100` | `#EAF6D9` | Latar section / kartu paling terang |
| `--yellow-500` | `#FFB81C` | Tombol sekunder/CTA kuning ("Masuk!", "Cek Sensor") |
| `--yellow-300` | `#FFD95A` | Gradien atas tombol kuning, bintang, piala |
| `--blue-500` | `#3FA7E0` | Air / siram, opsi kuis A, tombol "Tampilkan di Kelas!" |
| `--blue-200` | `#BFE6F7` | Langit, latar bioskop agro |
| `--brown-600` | `#7A4B24` | Tanah, border gelap, teks pada panel tanah |
| `--brown-400` | `#A9703A` | Tanah terang, aksen kayu |
| `--orange-400` | `#F59A3B` | Sensor suhu, aksen hangat |
| `--red-500` | `#E5483B` | Kumbang/ladybug, error, jawaban salah |

### 2.2 Netral

| Token | Hex | Kegunaan |
|---|---|---|
| `--cream-50` | `#FFFBEA` | Latar kartu putih-krem (form, kartu utama) |
| `--white` | `#FFFFFF` | Input, panel dalam |
| `--ink-900` | `#2F3B1F` | Teks utama (hijau tua kecoklatan, bukan hitam murni) |
| `--ink-600` | `#5B6B45` | Teks sekunder, label |
| `--ink-300` | `#A9B596` | Placeholder, border pasif |

### 2.3 Gradien

```css
--grad-bg-sky: linear-gradient(180deg, #BFE6F7 0%, #EAF6D9 60%, #CDEBB0 100%);
--grad-btn-green: linear-gradient(180deg, #8FD16A 0%, #3F9B2E 100%);
--grad-btn-yellow: linear-gradient(180deg, #FFD95A 0%, #FFB81C 100%);
--grad-btn-blue: linear-gradient(180deg, #6CC4F0 0%, #3FA7E0 100%);
--grad-trophy: linear-gradient(180deg, #FFE27A 0%, #F5A623 100%);
```

### 2.4 Warna Semantik Kuis

| Opsi | Warna | Catatan |
|---|---|---|
| A | `--blue-500` | Lingkaran huruf biru |
| B | `--green-500` | Lingkaran huruf hijau (jawaban benar ditandai border + centang hijau) |
| C | `--yellow-500` | Lingkaran huruf kuning |
| Benar | `--green-500` | Feedback + animasi maskot senang |
| Salah | `--red-500` | Feedback lembut, maskot menyemangati |

### 2.5 CSS Variables

```css
:root {
  --green-600: #3F9B2E;
  --green-500: #6CC04A;
  --green-400: #8FD16A;
  --green-200: #CDEBB0;
  --green-100: #EAF6D9;
  --yellow-500: #FFB81C;
  --yellow-300: #FFD95A;
  --blue-500: #3FA7E0;
  --blue-200: #BFE6F7;
  --brown-600: #7A4B24;
  --brown-400: #A9703A;
  --orange-400: #F59A3B;
  --red-500: #E5483B;
  --cream-50: #FFFBEA;
  --white: #FFFFFF;
  --ink-900: #2F3B1F;
  --ink-600: #5B6B45;
  --ink-300: #A9B596;
}
```

---

## 3. Tipografi

Font bulat, tebal, dan ramah. Gunakan `next/font/google`.

| Peran | Font | Fallback |
|---|---|---|
| Heading / Judul / Tombol | **Baloo 2** (600–800) | `Nunito`, system-ui, sans-serif |
| Body / Label / Input | **Nunito** (400–700) | system-ui, sans-serif |

```tsx
// app/layout.tsx
import { Baloo_2, Nunito } from "next/font/google";
const baloo = Baloo_2({ subsets: ["latin"], weight: ["600","700","800"], variable: "--font-heading" });
const nunito = Nunito({ subsets: ["latin"], weight: ["400","600","700"], variable: "--font-body" });
```

| Level | Ukuran (mobile / desktop) | Weight | Contoh |
|---|---|---|---|
| Display | 28 / 40 px | 800 | "Selamat Datang di Agro-Edu Box!" |
| H1 | 24 / 32 px | 700 | "Pilih Karaktermu!" |
| H2 | 20 / 24 px | 700 | "Kuis Agro-Pintar" |
| H3 | 16 / 18 px | 700 | Judul panel (Live IoT Sensor Status) |
| Body | 14 / 16 px | 400–600 | Deskripsi tugas |
| Caption | 12 px | 600 | Label sensor, badge |
| Button | 14–16 px | 700 | "Mulai Petualangku!" |

Teks judul memakai `--ink-900`; judul besar di layar pembuka boleh `--green-600` dengan stroke/shadow tipis putih agar menonjol di atas ilustrasi.

---

## 4. Bentuk, Radius, Bayangan, Spacing

### 4.1 Radius

| Token | Nilai | Dipakai pada |
|---|---|---|
| `--radius-sm` | `12px` | Input, chip kecil |
| `--radius-md` | `18px` | Panel dalam, opsi kuis |
| `--radius-lg` | `28px` | Kartu utama, modal |
| `--radius-xl` | `36px` | Frame layar/phone card, hero card |
| `--radius-pill` | `999px` | Semua tombol, badge, tab navbar |

### 4.2 Bayangan (lembut, kehijauan)

```css
--shadow-card: 0 8px 20px rgba(63, 155, 46, 0.18);
--shadow-btn: 0 4px 0 #2F7A22, 0 8px 14px rgba(63, 155, 46, 0.25);       /* efek tombol "3D" */
--shadow-btn-yellow: 0 4px 0 #D98F00, 0 8px 14px rgba(255, 184, 28, 0.3);
--shadow-btn-blue: 0 4px 0 #2A82B8, 0 8px 14px rgba(63, 167, 224, 0.3);
--shadow-float: 0 12px 28px rgba(47, 59, 31, 0.15);
```

### 4.3 Border

- Kartu utama: `3px solid #FFFFFF` + `--shadow-card` (kesan stiker/bubble).
- Panel dalam: `2px solid var(--green-200)`.
- Input: `2px solid var(--green-200)`, fokus: `2px solid var(--green-500)` + ring `0 0 0 4px rgba(108,192,74,.25)`.

### 4.4 Spacing (skala 4px)

`4, 8, 12, 16, 20, 24, 32, 40, 56`. Padding kartu: 20–24px. Jarak antar elemen vertikal: 12–16px. Tombol penuh lebar di dalam kartu.

---

## 5. Komponen

### 5.1 Tombol

Selalu pil, teks tebal, efek "pressable 3D" (bayangan bawah solid).

| Varian | Latar | Teks | Kegunaan |
|---|---|---|---|
| Primary | `--grad-btn-green` | putih | "Mulai Petualangku!", "Mulai Kuis!", "Pahami! Coba Misi Siram!" |
| Secondary (CTA) | `--grad-btn-yellow` | `--ink-900` | "Masuk!", "Cek Sensor", "Saya Sudah Selesai!" |
| Info | `--grad-btn-blue` | putih | "Tampilkan di Kelas!" |
| Ghost | transparan + border hijau | `--green-600` | Aksi tersier |

```css
.btn {
  border-radius: var(--radius-pill);
  padding: 12px 24px;
  font-family: var(--font-heading);
  font-weight: 700;
  transition: transform .12s ease, box-shadow .12s ease;
}
.btn:active { transform: translateY(3px); box-shadow: 0 1px 0 rgba(0,0,0,.15); }
.btn:hover { filter: brightness(1.05); }
.btn:focus-visible { outline: 3px solid var(--blue-500); outline-offset: 2px; }
```

### 5.2 Kartu

- Latar `--cream-50` atau `--green-100`, radius `--radius-lg`, border putih 3px, `--shadow-card`.
- Kartu hero/opening: radius `--radius-xl`, latar ilustrasi langit + bukit di bagian belakang.

### 5.3 Input (Nama)

- Latar putih, radius `--radius-sm`, placeholder `--ink-300` ("Nama", "Masukkan Nama Panggilanmu!").
- Label di atas input, `--ink-600`, weight 600.

### 5.4 Pemilih Karakter (Profil Karakter)

- Dua kartu avatar sejajar: **Original** dan **Girl**, masing-masing lingkaran/rounded-square dengan ilustrasi.
- Terpilih: border `--green-500` 3px + badge centang + sedikit scale (1.05).
- Tombol bawah: "Karakter Dipilih: {Girl/Ori}" (hijau).

### 5.5 Navbar Dashboard

- Bar pil di atas: logo Agro-Edu kecil, tab **Home · About Us · Pasyara · Contact**, tab aktif = pil hijau terisi.
- Kanan: badge **"0 Bintang"** (ikon bintang kuning) dan badge **Sensor** (indikator status hijau/merah).

### 5.5.1 Badge Bintang & Sensor

- Pil kecil, latar putih, border `--green-200`, ikon di kiri, teks caption bold.
- Sensor aktif: titik hijau berdenyut; tidak aktif: titik abu `--ink-300`.

### 5.6 Panel Dashboard Live IoT

Grid 2 kolom (desktop) / 1 kolom (mobile):

1. **Live IoT Sensor Status** — kartu hijau muda dengan maskot di tengah, ikon sensor: termometer (suhu, `--orange-400`, contoh 29°C) dan tetesan (kelembapan tanah, `--blue-500`, contoh 65%).
2. **Daily Missions** — daftar misi bergaya checklist pil (Water the sprout!, Check the sun!, Learn about roots), ikon bulat di kiri, status centang.
3. **Quiz Corner** — kartu dengan piala emas dan tombol kuning "Win points!".
4. **Interactive Learning Lab** — baris kartu ikon (Seed Sprouting Gen 1, Photosynthesis Fun, Ecological Solutions, Wikoo Learning), masing-masing kartu persegi membulat dengan ilustrasi di atas dan judul di bawah.

### 5.7 Lab Materi Pembelajaran (Learning Lab)

- Header judul bernomor ("1. Kelembapan Tanah (A0)").
- Blok "Tugas:" dengan kotak kutipan hijau muda.
- Diagram perbandingan 3 kolom: **kering · lembap · basah** dengan ilustrasi tanah makin gelap.
- CTA bawah: "Tonton Video & Lanjut Misi!" (primary).

### 5.8 Bioskop Agro & Cek IoT

- Bingkai "layar TV/tablet" tebal berwarna gelap dengan sudut membulat, isi video mekanisme sensor.
- Overlay data sensor (mis. `A0 Live: 15% → 85%`) sebagai pil kecil di pojok video.
- Tombol bawah: "Pahami! Coba Misi Siram!".

### 5.9 Misi Harian: Siram!

- Kartu tugas dengan ilustrasi besar (ember/penyiram air biru), judul "Chisis: Water the sprout!".
- Teks tugas: "Siram tanamanmu sampai kelembapan naik!".
- Dua tombol bertumpuk: "Saya Sudah Selesai!" (kuning) dan "Cek Sensor" (hijau).

### 5.10 Kuis (Detail Soal)

- Kartu soal dengan judul "Kuis Agro-Pintar" dan teks pertanyaan.
- Opsi jawaban sebagai baris pil putih dengan **lingkaran huruf berwarna** (A biru, B hijau, C kuning) di kiri.
- Hover: latar `--green-100`. Terpilih: border `--green-500`. Benar: latar hijau muda + centang. Salah: border `--red-500` + goyang ringan.
- Maskot kecil di pojok bawah dengan balon teks umpan balik (mis. "After area, animation from Agro!").

### 5.11 Hasil Kuis & Sertifikat

- Piala emas besar dengan bintang di tengah, confetti/kembang api latar, kupu-kupu & ladybug.
- Teks: "Selamat [Nama]! Petani Muda IoT: Skor 100%".
- Tiga tombol bertumpuk: **Klaim Sertifikat!** (hijau), **Tantangan Berikutnya** (kuning), **Tampilkan di Kelas!** (biru).

### 5.12 Layar Pembuka & Alur Awal

| Layar | Isi utama |
|---|---|
| Pembuka | Logo "Agro Edu Box" (daun + kotak), judul sambutan, tombol "Mulai Petualangku!" |
| Input Nama | Maskot Situnas besar di tengah, form nama |
| Profil Karakter | Pilih Original / Girl, input nama, tombol "Masuk!" (kuning) |
| Character Profile | Maskot + sapaan "Halo, Petani Muda!" |
| Dashboard Sukses | "Registrasi Sukses, [Nama]! Ayo Mulai!" + preview dashboard |
| Portal Kuis | Gerbang lengkung dengan tanda tanya, "Siap Uji Pengetahuan?", tombol "Mulai Kuis!" |
| Ending | Piala + "Tantangan Berikutnya" / "Tampilkan di Kelas!" |

---

## 6. Ilustrasi & Aset

- **Gaya:** Vektor/3D kartun lembut, outline minim, highlight putih di permukaan, bayangan hijau.
- **Maskot Situnas:** Disediakan dalam beberapa pose (netral, senang, menunjuk, memegang piala, menyemangati). Ekspor PNG/WebP transparan atau SVG; ukuran 2x untuk retina.
- **Latar:** Langit gradien + 2–3 lapis bukit hijau (SVG) di bagian bawah; awan putih lembut.
- **Dekorasi:** Kupu-kupu kuning, kumbang merah (ladybug), daun, bintang. Letakkan di sudut, ukuran kecil, `pointer-events: none`.
- **Ikon:** Rounded, tebal 2–2.5px, isian berwarna (bukan outline tipis). Rekomendasi: Lucide atau Phosphor (duotone) dengan warna token di atas.
- Gunakan `next/image` dengan `priority` untuk maskot di layar pertama.

---

## 7. Layout & Responsif

| Breakpoint | Lebar | Perilaku |
|---|---|---|
| Mobile | < 640px | Satu kolom, kartu penuh lebar (maks 420px), tombol full-width |
| Tablet | 640–1024px | Dashboard 2 kolom |
| Desktop | > 1024px | Dashboard grid lebar (maks 1200px), navbar horizontal penuh |

- Alur onboarding & kuis ditampilkan sebagai **kartu tunggal di tengah layar** (maks 420px) dengan latar langit/bukit.
- Dashboard & Lab menggunakan **grid kartu** dengan jarak 16–24px.
- Area sentuh minimum 44×44px.

---

## 8. Motion & Interaksi

| Elemen | Animasi |
|---|---|
| Maskot Situnas | Mengambang naik-turun halus (3s ease-in-out infinite), daun bergoyang |
| Tombol | Tekan turun 3px, hover cerah |
| Pindah layar | Fade + slide-up 250ms |
| Jawaban benar | Maskot melompat, confetti, bintang +1 beranimasi menuju badge "Bintang" |
| Jawaban salah | Goyang kiri-kanan 300ms, warna merah lembut |
| Sensor live | Angka berubah dengan transisi count, titik status berdenyut |
| Hasil kuis | Piala scale-in + kilau, kembang api latar |

Hormati `prefers-reduced-motion`: matikan animasi mengambang dan confetti.

---

## 9. Aksesibilitas

- Kontras teks `--ink-900` di atas `--cream-50`/`--green-100` sudah memenuhi AA. **Teks putih pada tombol hijau**: pakai `--green-600` sebagai warna dasar (atau tambah teks tebal ≥ 16px) agar kontras cukup.
- Tombol kuning memakai teks gelap (`--ink-900`), bukan putih.
- Jangan mengandalkan warna saja untuk benar/salah: tambahkan ikon centang/silang dan teks.
- Semua gambar maskot punya `alt` bermakna; dekorasi diberi `alt=""`.
- Fokus keyboard jelas (outline biru 3px).

---

## 10. Implementasi di Next.js

### 10.1 Struktur yang disarankan

```
app/
  (onboarding)/
    page.tsx            # Pembuka
    nama/page.tsx       # Input nama
    karakter/page.tsx   # Profil karakter
  dashboard/page.tsx
  belajar/[materi]/page.tsx
  bioskop/page.tsx
  misi/[id]/page.tsx
  kuis/page.tsx
  kuis/[soal]/page.tsx
  hasil/page.tsx
components/ui/
  Button.tsx  Card.tsx  Input.tsx  Badge.tsx  Navbar.tsx
  Mascot.tsx  SensorCard.tsx  MissionList.tsx  QuizOption.tsx  Trophy.tsx
styles/
  tokens.css            # variabel di bagian 2.5 & 4
public/
  mascot/  bg/  icons/
```

### 10.2 Tailwind (jika dipakai)

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        green: { 100:"#EAF6D9", 200:"#CDEBB0", 400:"#8FD16A", 500:"#6CC04A", 600:"#3F9B2E" },
        yellow: { 300:"#FFD95A", 500:"#FFB81C" },
        blue: { 200:"#BFE6F7", 500:"#3FA7E0" },
        brown: { 400:"#A9703A", 600:"#7A4B24" },
        cream: { 50:"#FFFBEA" },
        ink: { 300:"#A9B596", 600:"#5B6B45", 900:"#2F3B1F" },
      },
      borderRadius: { sm:"12px", md:"18px", lg:"28px", xl:"36px" },
      fontFamily: { heading:["var(--font-heading)"], body:["var(--font-body)"] },
      boxShadow: {
        card:"0 8px 20px rgba(63,155,46,.18)",
        btn:"0 4px 0 #2F7A22, 0 8px 14px rgba(63,155,46,.25)",
      },
    },
  },
};
```

### 10.3 Contoh komponen Button

```tsx
// components/ui/Button.tsx
type Variant = "primary" | "secondary" | "info";
const styles: Record<Variant, string> = {
  primary: "bg-[image:var(--grad-btn-green)] text-white shadow-[var(--shadow-btn)]",
  secondary: "bg-[image:var(--grad-btn-yellow)] text-[var(--ink-900)] shadow-[var(--shadow-btn-yellow)]",
  info: "bg-[image:var(--grad-btn-blue)] text-white shadow-[var(--shadow-btn-blue)]",
};

export function Button({ variant = "primary", className = "", ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={`w-full rounded-full px-6 py-3 font-heading font-bold transition active:translate-y-[3px] hover:brightness-105 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--blue-500)] ${styles[variant]} ${className}`}
    />
  );
}
```

---

## 11. Checklist Revisi

- [ ] Ganti semua warna lama dengan token di bagian 2
- [ ] Terapkan font Baloo 2 + Nunito
- [ ] Semua tombol jadi pil + efek 3D, 3 varian warna
- [ ] Semua kartu radius besar + border putih + bayangan hijau lembut
- [ ] Latar langit + bukit + dekorasi kupu-kupu/ladybug di layar onboarding & hasil
- [ ] Maskot Situnas tampil di tiap layar utama dengan pose sesuai konteks
- [ ] Opsi kuis dengan lingkaran huruf A (biru) / B (hijau) / C (kuning)
- [ ] Badge "Bintang" & "Sensor" di header setiap layar setelah login
- [ ] Dashboard 4 panel: Live IoT, Daily Missions, Quiz Corner, Interactive Learning Lab
- [ ] Animasi feedback benar/salah + reduced-motion
- [ ] Uji kontras & ukuran sentuh di mobile
