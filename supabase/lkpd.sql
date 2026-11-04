-- Agro-Edu Box: Lembar Kerja Peserta Didik (LKPD) versi digital.
-- Jalankan setelah kartu-misi.sql. Aman dijalankan ulang.
--
-- Isian Misi dikerjakan bersama satu kelompok, sedangkan halaman Refleksi
-- diisi masing-masing siswa, sesuai judul pada lembar cetaknya.

create table if not exists public.lkpd_kelompok (
  kelompok_id     text primary key references public.kelompok (id) on delete cascade,
  jawaban         jsonb not null default '{}'::jsonb,
  diperbarui_at   timestamptz not null default now(),
  diperbarui_oleh uuid references public.siswa (id),
  nilai           integer check (nilai between 0 and 100),
  umpan_balik     text,
  dinilai_at      timestamptz,
  dinilai_oleh    uuid references public.guru (id)
);

create table if not exists public.lkpd_refleksi (
  siswa_id      uuid primary key references public.siswa (id) on delete cascade,
  jawaban       jsonb not null default '{}'::jsonb,
  diperbarui_at timestamptz not null default now()
);

alter table public.lkpd_kelompok enable row level security;
alter table public.lkpd_refleksi enable row level security;
revoke all on public.lkpd_kelompok, public.lkpd_refleksi from anon, authenticated;

grant select on public.lkpd_kelompok, public.lkpd_refleksi to service_role;
-- Dari luar fungsi, hanya kolom penilaian yang boleh diubah. Isian siswa cuma
-- bisa ditulis lewat kedua fungsi di bawah, yang menentukan sendiri baris mana
-- yang boleh disentuh. Jadi kesalahan di API tidak bisa menimpa jawaban siswa.
grant update (nilai, umpan_balik, dinilai_at, dinilai_oleh) on public.lkpd_kelompok to service_role;

-- Kelompok tujuan diambil dari data siswa, bukan dari kiriman browser, supaya
-- siswa tidak bisa menulis ke LKPD kelompok lain.
--
-- Jawaban digabung (||), bukan ditimpa seluruhnya, agar dua anggota yang
-- mengetik bersamaan di perangkat berbeda tidak saling menghapus jawaban.
create or replace function public.simpan_lkpd_kelompok(p_siswa_id uuid, p_jawaban jsonb)
returns text
language plpgsql
-- security definer: fungsi berjalan sebagai pemiliknya, sehingga bisa menulis
-- kolom jawaban walau pemanggilnya tidak diberi hak update kolom itu.
security definer
set search_path = ''
as $$
declare
  v_kelompok text;
begin
  select kelompok_id into v_kelompok from public.siswa where id = p_siswa_id;
  if v_kelompok is null then
    raise exception 'tanpa_kelompok';
  end if;

  insert into public.lkpd_kelompok (kelompok_id, jawaban, diperbarui_at, diperbarui_oleh)
  values (v_kelompok, p_jawaban, now(), p_siswa_id)
  on conflict (kelompok_id) do update
    set jawaban         = public.lkpd_kelompok.jawaban || excluded.jawaban,
        diperbarui_at   = now(),
        diperbarui_oleh = excluded.diperbarui_oleh;

  return v_kelompok;
end;
$$;

create or replace function public.simpan_lkpd_refleksi(p_siswa_id uuid, p_jawaban jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.siswa where id = p_siswa_id) then
    raise exception 'siswa_tidak_ada';
  end if;

  insert into public.lkpd_refleksi (siswa_id, jawaban, diperbarui_at)
  values (p_siswa_id, p_jawaban, now())
  on conflict (siswa_id) do update
    set jawaban = public.lkpd_refleksi.jawaban || excluded.jawaban,
        diperbarui_at = now();
end;
$$;

revoke execute on function public.simpan_lkpd_kelompok(uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.simpan_lkpd_refleksi(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.simpan_lkpd_kelompok(uuid, jsonb) to service_role;
grant execute on function public.simpan_lkpd_refleksi(uuid, jsonb) to service_role;

notify pgrst, 'reload schema';
