-- Agro-Edu Box: misi harian 4 pot (A -> B -> C -> D), progres per siswa per hari.
-- Jalankan di Supabase Dashboard > SQL Editor. Aman dijalankan ulang.

create table if not exists public.misi_harian (
  siswa_id   uuid not null references public.siswa (id) on delete cascade,
  tanggal    date not null,
  pot        text not null check (pot in ('A', 'B', 'C', 'D')),
  selesai_at timestamptz not null default now(),
  primary key (siswa_id, tanggal, pot)
);

alter table public.misi_harian enable row level security;
revoke all on public.misi_harian from anon, authenticated;
grant select, insert on public.misi_harian to service_role;

-- Menyelesaikan satu pot dan menambah bintang dalam satu transaksi.
-- Mengembalikan total bintang baru, atau NULL bila pot bukan giliran berikutnya
-- (melompati urutan, atau sudah selesai hari ini), sehingga bintang tidak bisa dobel.
create or replace function public.selesaikan_misi_harian(
  p_siswa_id uuid,
  p_tanggal  date,
  p_pot      text,
  p_bintang  integer
) returns integer
language plpgsql
set search_path = ''
as $$
declare
  v_selesai integer;
  v_bintang integer;
begin
  select count(*) into v_selesai
  from public.misi_harian
  where siswa_id = p_siswa_id and tanggal = p_tanggal;

  if p_pot is distinct from (array['A', 'B', 'C', 'D'])[v_selesai + 1] then
    return null;
  end if;

  insert into public.misi_harian (siswa_id, tanggal, pot)
  values (p_siswa_id, p_tanggal, p_pot)
  on conflict do nothing;
  if not found then
    return null;
  end if;

  update public.siswa
  set bintang = bintang + p_bintang
  where id = p_siswa_id
  returning bintang into v_bintang;

  return v_bintang;
end;
$$;

revoke execute on function public.selesaikan_misi_harian(uuid, date, text, integer)
  from public, anon, authenticated;
grant execute on function public.selesaikan_misi_harian(uuid, date, text, integer)
  to service_role;

-- Fungsi baru perlu dimuat ulang agar terbaca oleh API Supabase.
notify pgrst, 'reload schema';
