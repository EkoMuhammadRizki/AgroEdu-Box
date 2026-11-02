# AGRO EDU BOX — Design System

Panduan visual agar seluruh halaman konsisten. Diturunkan dari wireframe pada dokumen rancangan.
Target stack: **Next.js (App Router) + Tailwind CSS**. Rekomendasi tambahan: `shadcn/ui` (komponen dasar), `lucide-react` (ikon), `recharts` (grafik), `next/font`.

---

## 1. Prinsip

1. **Dua identitas, satu sistem.** Siswa = **hijau**, Guru = **biru**. Struktur komponen identik; hanya warna aksen berbeda.
2. **Aksi dulu, dekorasi belakangan.** Dashboard hanya menampilkan indikator yang membantu tindakan.
3. **Jujur soal data.** Status sensor (online / data terakhir / offline / tidak valid / simulasi) selalu terlihat dengan timestamp. Jangan pernah tampilkan angka lama seolah baru.
4. **Mobile-first, thumb-friendly.** Target sentuh ≥ 44px.
5. **Bersih & ringan.** Kartu putih, border tipis, radius besar, bayangan minimal.

## 2. Color Tokens

Nilai hex adalah estimasi dari wireframe; sesuaikan bila ada brand guideline resmi.

### 2.1 Netral (bersama)
| Token | Hex | Pemakaian |
|---|---|---|
| `bg` | `#F5F8F5` | Latar halaman |
| `surface` | `#FFFFFF` | Kartu, panel |
| `surface-muted` | `#F7FAF8` | Sidebar, area sekunder |
| `border` | `#DCE5DF` | Border kartu/input |
| `ink` | `#17352A` | Judul, teks utama |
| `ink-muted` | `#5F7068` | Teks sekunder, label |

### 2.2 Aksen Siswa (hijau)
| Token | Hex |
|---|---|
| `siswa-600` | `#166A43` (teks angka, ikon, tombol utama) |
| `siswa-700` | `#0F5434` (hover) |
| `siswa-500` | `#4FA36B` (ilustrasi tanaman) |
| `siswa-100` | `#E5F2E9` (header panel, item menu aktif) |

### 2.3 Aksen Guru (biru)
| Token | Hex |
|---|---|
| `guru-600` | `#1F55B8` |
| `guru-700` | `#184493` |
| `guru-100` | `#E6EEFF` |

### 2.4 Status (semantik)
| Status | Warna teks | Latar | Catatan |
|---|---|---|---|
| online | `#166A43` | `#E5F2E9` | titik hijau |
| data terakhir | `#8A5A00` | `#FFF4D6` | tampilkan timestamp |
| offline | `#6B7280` | `#EEF0F2` | abu |
| data tidak valid | `#B42318` | `#FDECEA` | merah |
| simulasi | `#6941C6` | `#F1EBFF` | ungu, wajib label "Simulasi" |
| draf | `#6B7280` | `#EEF0F2` | tugas/materi |
| terkirim | `#1F55B8` | `#E6EEFF` | |
| perlu revisi | `#8A5A00` | `#FFF4D6` | |
| dinilai / terbit | `#166A43` | `#E5F2E9` | |

> Jangan pakai warna hijau/merah sebagai penilaian "baik/buruk" pada nilai sensor. Ambang harus dari kalibrasi (lihat spec).

## 3. Tipografi

- **Font:** `Plus Jakarta Sans` (heading + body) via `next/font/google`. Fallback: `system-ui, sans-serif`.
- **Angka sensor:** gunakan `font-variant-numeric: tabular-nums`.

| Peran | Ukuran / Berat | Tailwind |
|---|---|---|
| Display (judul halaman) | 28–32 / 800 | `text-3xl font-extrabold tracking-tight` |
| H2 (judul panel) | 18–20 / 700 | `text-lg font-bold` |
| Body | 14–16 / 400 | `text-sm md:text-base` |
| Label / caption | 12 / 500 | `text-xs font-medium text-ink-muted` |
| Nilai kartu sensor | 24–28 / 700 | `text-2xl font-bold tabular-nums` |

## 4. Spacing, Radius, Elevasi

- Skala spasi 4px (`1 = 4px`). Padding kartu `p-4` (HP) / `p-5` (laptop). Gap grid `gap-3` / `gap-4`.
- Radius: kartu `rounded-2xl` (16px), tombol/input `rounded-xl` (12px), badge `rounded-full`.
- Elevasi: border 1px `border`, bayangan `shadow-sm` hanya saat hover/fokus.
- Container konten maksimum: `max-w-6xl`.

## 5. Tailwind Config

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5F8F5",
        surface: { DEFAULT: "#FFFFFF", muted: "#F7FAF8" },
        line: "#DCE5DF",
        ink: { DEFAULT: "#17352A", muted: "#5F7068" },
        siswa: { 100: "#E5F2E9", 500: "#4FA36B", 600: "#166A43", 700: "#0F5434" },
        guru: { 100: "#E6EEFF", 600: "#1F55B8", 700: "#184493" },
      },
      fontFamily: { sans: ["var(--font-jakarta)", "system-ui", "sans-serif"] },
      borderRadius: { card: "16px", ctl: "12px" },
    },
  },
  plugins: [],
} satisfies Config;
```

```tsx
// app/layout.tsx
import { Plus_Jakarta_Sans } from "next/font/google";
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
```

**Theme per peran** — set atribut pada layout agar komponen bersama otomatis berganti aksen:

```css
/* globals.css */
[data-role="siswa"] { --accent: #166A43; --accent-hover: #0F5434; --accent-soft: #E5F2E9; }
[data-role="guru"]  { --accent: #1F55B8; --accent-hover: #184493; --accent-soft: #E6EEFF; }
```
```tsx
// app/(siswa)/layout.tsx → <div data-role="siswa" className="min-h-dvh bg-bg">
// app/(guru)/guru/layout.tsx → <div data-role="guru" className="min-h-dvh bg-bg">
```
Pakai `bg-[var(--accent)]`, `text-[var(--accent)]`, `bg-[var(--accent-soft)]` pada komponen bersama.

## 5b. Breakpoint

| Nama | Lebar | Mode |
|---|---|---|
| default | < 768px | HP |
| `md` | ≥ 768px | Tablet |
| `lg` | ≥ 1024px | Laptop (sidebar tampil) |

## 6. Layout

### 6.1 Shell Aplikasi
- **Laptop (`lg`+):** sidebar kiri lebar 208px (`w-52`), konten kanan, grid 12 kolom.
- **HP:** top bar (logo "AGRO EDU BOX" + tombol menu ☰) dan **bottom navigation** 4–5 item. Sisanya masuk drawer.
- Sidebar: latar `surface-muted`, border `line`, radius `rounded-2xl`; item aktif latar `accent-soft` + teks `accent`.

### 6.2 Grid Dashboard
```
HP:      grid-cols-2 gap-3         (kartu sensor 2 kolom)
Laptop:  grid-cols-4 gap-4         (4 kartu indikator)
Panel:   grid-cols-1 lg:grid-cols-2 (Tanaman/Kelas + Aktivitas terbaru)
Grafik:  full width di bawah panel
```

### 6.3 Aturan Responsif per Elemen
| Elemen | Laptop | HP |
|---|---|---|
| Navigasi | Sidebar kiri | Bottom nav / menu ringkas |
| Dashboard | Kartu multi-kolom | Kartu vertikal, 2 kolom bila cukup |
| Tabel | Tabel + filter + sortir | **Daftar kartu** (info penting dulu) |
| Grafik | Lebar, pilih rentang waktu | Adaptif, legenda ringkas, bisa digeser |
| Formulir | Kolom berdampingan | 1 kolom, label jelas |
| Tombol aksi | Dekat judul / akhir form | Besar, `h-11`+, sticky bawah bila perlu |

## 7. Komponen

Letakkan di `components/ui/` (generik) dan `components/agro/` (domain).

### 7.1 `PanelHeader`
Header panel berlatar `accent-soft`, teks `accent` uppercase `text-sm font-bold tracking-wide` (mis. "HALAMAN SISWA").

### 7.2 `StatCard`
- Props: `label`, `value`, `unit?`, `status?`, `updatedAt?`.
- Gaya: `rounded-2xl border border-line bg-surface p-4`; label `text-xs text-ink-muted`; nilai `text-2xl font-bold text-[var(--accent)] tabular-nums`.
- Untuk sensor: tampilkan `StatusBadge` + "diperbarui HH:mm" di bawah nilai. Jika offline: nilai diganti "—" dan teks "belum ada data" / "data terakhir: …".

### 7.3 `StatusBadge`
Pil kecil `rounded-full px-2.5 py-0.5 text-xs font-medium` dengan titik berwarna; warna sesuai tabel §2.4. Satu komponen untuk status IoT, tugas, dan materi.

### 7.4 `SensorChart`
- `recharts` `LineChart`, garis `accent` 2px, titik 3px, grid horizontal tipis `line`.
- Rentang waktu: segmented control (`24 jam · 7 hari · 30 hari`).
- Sumbu menyertakan satuan. Data terputus → garis putus-putus, jangan diinterpolasi.
- Badge "Simulasi" di pojok bila data simulasi.

### 7.5 `PlantCard` (Tanaman/Kelas)
Ilustrasi tanaman (lingkaran `accent-soft` + ikon daun `siswa-500`) di kiri, "Status dan ringkasan" di kanan.

### 7.6 `ActivityList`
Item dengan titik `accent` 10px + teks; jenis: materi/tugas, data diperbarui, umpan balik.

### 7.7 `ModuleCard`
Judul, durasi/jenis, progress bar tipis (`accent`), `StatusBadge` selesai/belum.

### 7.8 `MissionCard` (Kartu Misi Digital)
Header berjudul misi + chip tenggat; bagian: Tujuan, Pertanyaan pemantik, Langkah kerja (numbered), Alat/bahan, Bukti, Kriteria selesai. CTA utama "Kerjakan misi".

### 7.9 `SubmissionForm`
Field: pengamatan (textarea), pilih data sensor (picker dari pembacaan), kesimpulan, refleksi, unggah foto/dokumen. Footer: "Simpan draf" (secondary) + "Kirim" (primary). Validasi inline di bawah field.

### 7.10 `QuizQuestion` & `QuizResult`
Progress bar atas, pilihan jawaban berupa kartu radio besar, navigasi soal, hasil berisi skor besar + pembahasan + rekomendasi modul.

### 7.11 `RubricTable`
Tabel kriteria × level (Perlu bimbingan / Berkembang / Baik). Di HP berubah menjadi accordion per kriteria.

### 7.12 `DataTable` → `CardList`
Satu komponen yang merender tabel di `md+` dan daftar kartu di bawahnya.

### 7.13 `Button`
| Varian | Gaya |
|---|---|
| primary | `bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]` |
| secondary | `bg-surface border border-line text-ink` |
| ghost | transparan, hover `accent-soft` |
Ukuran: `h-10` (laptop), `h-11` (HP). Radius `rounded-xl`. Fokus: ring 2px `accent` offset 2px.

### 7.14 `Input / Select / Textarea`
`h-11 rounded-xl border border-line bg-surface px-3`, fokus ring `accent`. Label di atas, bantuan `text-xs text-ink-muted`, error `text-xs text-[#B42318]`.

### 7.15 `EmptyState` & `Skeleton`
Ikon + teks pendek + aksi. Semua daftar & grafik punya skeleton loading dan empty state ("belum ada data").

## 8. Ikonografi
`lucide-react`, stroke 1.75, ukuran 18–20px. Saran: Beranda `Home`, Materi `BookOpen`, Lab IoT `Cpu`/`Activity`, Misi `ClipboardCheck`, Kuis `HelpCircle`, Profil `User`, Kelas `Users`, Laporan `BarChart3`, Pengaturan `Settings`.

## 9. Gerak & Interaksi
- Transisi 150–200ms `ease-out` untuk hover/fokus. Hindari animasi berat.
- Hormati `prefers-reduced-motion`.
- Pembaruan data live: ubah angka tanpa kedip; tampilkan "diperbarui x detik lalu".

## 10. Aksesibilitas
- Kontras teks ≥ 4.5:1 (cek `ink-muted` di atas `bg`).
- Status **tidak** hanya lewat warna: selalu ada label teks/ikon.
- Fokus keyboard terlihat; semua kontrol bisa dioperasikan keyboard.
- Grafik punya ringkasan teks/tabel alternatif.
- `lang="id"` pada `<html>`.

## 11. Voice & Konten UI
- Bahasa Indonesia, ramah, singkat, memakai kata kerja ("Kerjakan misi", "Kirim", "Simpan draf").
- Sapaan siswa: "Halo, {nama}!".
- Pesan data kosong: "Belum ada data dari perangkat." Jangan menebak nilai.
- Data contoh di mockup harus diberi tanda "contoh" atau "simulasi".

## 12. Struktur Folder Komponen (usulan)
```
components/
├─ ui/        Button, Input, Select, Textarea, Badge, Tabs, Dialog, Skeleton
├─ layout/    AppShell, Sidebar, BottomNav, TopBar, PageHeader
├─ agro/      StatCard, StatusBadge, SensorChart, PlantCard, ActivityList,
│             ModuleCard, MissionCard, SubmissionForm, QuizQuestion,
│             QuizResult, RubricTable, DataTable
└─ charts/    ChartFrame, RangeTabs
lib/
├─ iot.ts     util status (online/offline/data terakhir), format waktu
└─ types.ts   SensorReading, Submission, status enum
```

## 13. Checklist Slicing per Halaman
- [ ] Gunakan `AppShell` sesuai peran (`data-role`).
- [ ] Judul halaman memakai `PageHeader` (Display + deskripsi singkat).
- [ ] Semua angka sensor lewat `StatCard` / `SensorChart` + `StatusBadge`.
- [ ] Tabel memakai `DataTable` (otomatis jadi kartu di HP).
- [ ] Ada loading (skeleton), kosong (empty state), dan error state.
- [ ] Diuji di 360px, 768px, dan 1280px.
