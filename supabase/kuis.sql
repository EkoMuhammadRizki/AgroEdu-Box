-- Agro-Edu Box: hasil Kuis Pintar tersimpan di database.
-- Jalankan setelah kartu-misi.sql. Aman dijalankan ulang.
--
-- Skor dihitung di server (bukan di browser), dan bintang hanya diberikan pada
-- percobaan pertama setiap siswa untuk setiap kuis. Percobaan berikutnya tetap
-- dicatat sebagai riwayat, tetapi tidak menambah bintang.

create table if not exists public.hasil_kuis (
  id         bigint generated always as identity primary key,
  siswa_id   uuid not null references public.siswa (id) on delete cascade,
  kuis_id    text not null,
  benar      integer not null,
  total      integer not null check (total > 0),
  skor       integer not null check (skor between 0 and 100),
  jawaban    jsonb not null,
  bintang    integer not null default 0 check (bintang >= 0),
  created_at timestamptz not null default now(),
  check (benar between 0 and total)
);

create index if not exists hasil_kuis_siswa_idx on public.hasil_kuis (siswa_id, kuis_id);

alter table public.hasil_kuis enable row level security;
revoke all on public.hasil_kuis from anon, authenticated;
grant select, insert on public.hasil_kuis to service_role;

create or replace function public.kirim_kuis(
  p_siswa_id uuid,
  p_kuis_id text,
  p_benar integer,
  p_total integer,
  p_jawaban jsonb,
  p_bintang_pertama integer
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_percobaan integer;
  v_beri integer := 0;
  v_bintang integer;
begin
  -- Kunci baris siswa agar dua pengiriman bersamaan tidak sama-sama dianggap "pertama".
  perform 1 from public.siswa where id = p_siswa_id for update;
  if not found then
    raise exception 'siswa_tidak_ada';
  end if;

  select count(*) into v_percobaan
    from public.hasil_kuis where siswa_id = p_siswa_id and kuis_id = p_kuis_id;

  if v_percobaan = 0 then
    v_beri := p_bintang_pertama;
    update public.siswa set bintang = bintang + v_beri where id = p_siswa_id;
  end if;

  insert into public.hasil_kuis (siswa_id, kuis_id, benar, total, skor, jawaban, bintang)
  values (p_siswa_id, p_kuis_id, p_benar, p_total, round(p_benar * 100.0 / p_total), p_jawaban, v_beri);

  select bintang into v_bintang from public.siswa where id = p_siswa_id;

  return jsonb_build_object('bintangDiberikan', v_beri, 'bintang', v_bintang, 'percobaan', v_percobaan + 1);
end;
$$;

revoke execute on function public.kirim_kuis(uuid, text, integer, integer, jsonb, integer)
  from public, anon, authenticated;
grant execute on function public.kirim_kuis(uuid, text, integer, integer, jsonb, integer) to service_role;

notify pgrst, 'reload schema';
