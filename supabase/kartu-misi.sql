-- Agro-Edu Box: kelompok siswa & Kartu Investigasi per kelompok.
-- Jalankan setelah schema.sql. Aman dijalankan ulang.
--
-- Satu anggota mengirim kartu, misi tercentang permanen untuk seluruh kelompok,
-- dan semua anggota mendapat bintang.

create table if not exists public.kelompok (
  -- ID pendek agar mudah diketik di kolom siswa.kelompok_id, contoh: 6a-1
  id         text primary key check (id ~ '^[a-z0-9-]+$'),
  kelas_id   text not null references public.kelas (id) on update cascade,
  nama       text not null,
  created_at timestamptz not null default now(),
  unique (kelas_id, nama)
);

alter table public.siswa
  add column if not exists kelompok_id text
  references public.kelompok (id) on update cascade on delete set null;
create index if not exists siswa_kelompok_id_idx on public.siswa (kelompok_id);

create table if not exists public.misi_kelompok (
  kelompok_id text not null references public.kelompok (id) on update cascade on delete cascade,
  pot         text not null check (pot in ('A', 'B', 'C', 'D')),
  laporan     jsonb not null,
  pengirim_id uuid references public.siswa (id) on delete set null,
  selesai_at  timestamptz not null default now(),
  primary key (kelompok_id, pot)
);

alter table public.kelompok enable row level security;
alter table public.misi_kelompok enable row level security;
revoke all on public.kelompok, public.misi_kelompok from anon, authenticated;
grant select, insert, delete on public.kelompok to service_role;
grant select, insert on public.misi_kelompok to service_role;

-- Misi per siswa versi lama hanya berisi uji coba: hapus, beserta bintang yang diberikannya.
do $$
begin
  if to_regclass('public.misi_harian') is not null then
    update public.siswa s
    set bintang = greatest(0, s.bintang - 10 * j.baris)
    from (select siswa_id, count(*) as baris from public.misi_harian group by siswa_id) j
    where s.id = j.siswa_id;
    drop table public.misi_harian;
  end if;
end;
$$;

drop function if exists public.selesaikan_misi_harian(uuid, date, text, integer);
drop function if exists public.selesaikan_misi_harian(uuid, date, text, integer, jsonb);
drop function if exists public.selesaikan_misi_harian(uuid, text, integer, jsonb);

-- Mengembalikan total bintang pengirim, atau NULL bila siswa belum punya kelompok
-- atau pot bukan giliran berikutnya, sehingga bintang tidak bisa dobel.
create or replace function public.selesaikan_misi_kelompok(
  p_siswa_id uuid,
  p_pot      text,
  p_bintang  integer,
  p_laporan  jsonb
) returns integer
language plpgsql
set search_path = ''
as $$
declare
  v_kelompok text;
  v_selesai  integer;
  v_bintang  integer;
begin
  select kelompok_id into v_kelompok from public.siswa where id = p_siswa_id;
  if v_kelompok is null then
    return null;
  end if;

  select count(*) into v_selesai from public.misi_kelompok where kelompok_id = v_kelompok;
  if p_pot is distinct from (array['A', 'B', 'C', 'D'])[v_selesai + 1] then
    return null;
  end if;

  insert into public.misi_kelompok (kelompok_id, pot, laporan, pengirim_id)
  values (v_kelompok, p_pot, p_laporan, p_siswa_id)
  on conflict do nothing;
  if not found then
    return null;
  end if;

  update public.siswa set bintang = bintang + p_bintang where kelompok_id = v_kelompok;
  select bintang into v_bintang from public.siswa where id = p_siswa_id;
  return v_bintang;
end;
$$;

-- Bintang selalu ditambah di server, agar nilai lama di browser tidak menimpa
-- bintang yang masuk dari teman sekelompok.
create or replace function public.tambah_bintang(p_siswa_id uuid, p_tambah integer)
returns integer
language sql
set search_path = ''
as $$
  update public.siswa set bintang = bintang + p_tambah where id = p_siswa_id returning bintang;
$$;

revoke execute on function public.selesaikan_misi_kelompok(uuid, text, integer, jsonb)
  from public, anon, authenticated;
revoke execute on function public.tambah_bintang(uuid, integer)
  from public, anon, authenticated;
grant execute on function public.selesaikan_misi_kelompok(uuid, text, integer, jsonb) to service_role;
grant execute on function public.tambah_bintang(uuid, integer) to service_role;

-- Maksimal 5 siswa per kelompok: 6A (26 siswa) butuh 6 kelompok, 6B (24 siswa) butuh 5.
insert into public.kelompok (id, kelas_id, nama) values
  ('6a-1', 'kelas-6a', 'Kelompok 1'),
  ('6a-2', 'kelas-6a', 'Kelompok 2'),
  ('6a-3', 'kelas-6a', 'Kelompok 3'),
  ('6a-4', 'kelas-6a', 'Kelompok 4'),
  ('6a-5', 'kelas-6a', 'Kelompok 5'),
  ('6a-6', 'kelas-6a', 'Kelompok 6'),
  ('6b-1', 'kelas-6b', 'Kelompok 1'),
  ('6b-2', 'kelas-6b', 'Kelompok 2'),
  ('6b-3', 'kelas-6b', 'Kelompok 3'),
  ('6b-4', 'kelas-6b', 'Kelompok 4'),
  ('6b-5', 'kelas-6b', 'Kelompok 5')
on conflict (id) do nothing;

notify pgrst, 'reload schema';

-- Guru membentuk kelompok dari portal guru: Kelola Kelas > pilih kelas.
