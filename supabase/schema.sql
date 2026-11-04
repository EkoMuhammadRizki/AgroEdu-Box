-- Agro-Edu Box: skema kelas & siswa.
-- Jalankan di Supabase Dashboard > SQL Editor, lalu jalankan supabase/seed.sql.
-- Aman dijalankan ulang.

create table if not exists public.kelas (
  id         text primary key,
  nama       text not null unique,
  kode       text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.siswa (
  id            uuid primary key default gen_random_uuid(),
  kelas_id      text not null references public.kelas (id) on update cascade,
  nama          text not null,
  -- NISN disimpan sebagai teks agar angka 0 di depan tidak hilang.
  nisn          text not null unique check (nisn ~ '^[0-9]{10}$'),
  -- Tidak unique: data sumber memuat No. Induk yang sama pada dua siswa.
  no_induk      text not null,
  jenis_kelamin text not null check (jenis_kelamin in ('L', 'P')),
  karakter      text not null default 'original' check (karakter in ('original', 'girl')),
  bintang       integer not null default 120 check (bintang >= 0),
  created_at    timestamptz not null default now()
);

create index if not exists siswa_kelas_id_idx on public.siswa (kelas_id);

-- Data anak di bawah umur: browser tidak boleh mengakses tabel ini secara langsung.
-- RLS aktif tanpa policy, jadi anon/authenticated ditolak. Hanya API route Next.js
-- (memakai secret key) yang bisa membaca, dan API hanya mengirim kolom yang perlu.
alter table public.kelas enable row level security;
alter table public.siswa enable row level security;

revoke all on public.kelas, public.siswa from anon, authenticated;

-- Secret key melewati RLS tetapi tetap butuh GRANT.
grant select on public.kelas to service_role;
grant select, update on public.siswa to service_role;
