-- Agro-Edu Box: nilai dan umpan balik guru pada laporan Kartu Investigasi.
-- Jalankan setelah kartu-misi.sql. Aman dijalankan ulang.

alter table public.misi_kelompok
  add column if not exists nilai integer check (nilai between 0 and 100),
  add column if not exists umpan_balik text,
  add column if not exists dinilai_at timestamptz;

-- Hanya kolom penilaian yang boleh diubah: isi laporan siswa tetap utuh.
grant update (nilai, umpan_balik, dinilai_at) on public.misi_kelompok to service_role;

notify pgrst, 'reload schema';
