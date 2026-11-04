-- Agro-Edu Box: Kartu Investigasi. Jalankan setelah misi-harian.sql.
-- Tiap kartu cukup diselesaikan sekali per siswa, statusnya permanen, dan hanya
-- selesai lewat laporan kartu. Aman dijalankan ulang.

alter table public.misi_harian add column if not exists laporan jsonb;

-- Centang manual versi lama tidak punya laporan: hapus, beserta bintang yang diberikannya.
with dihapus as (
  delete from public.misi_harian where laporan is null returning siswa_id
), jumlah as (
  select siswa_id, count(*) as baris from dihapus group by siswa_id
)
update public.siswa s
set bintang = greatest(0, s.bintang - 10 * j.baris)
from jumlah j
where s.id = j.siswa_id;

-- Status tidak lagi per hari: satu baris per siswa per pot, sisakan yang paling awal.
delete from public.misi_harian a
using public.misi_harian b
where a.siswa_id = b.siswa_id
  and a.pot = b.pot
  and (a.selesai_at, a.ctid) > (b.selesai_at, b.ctid);

alter table public.misi_harian drop constraint if exists misi_harian_pkey;
alter table public.misi_harian drop column if exists tanggal;
alter table public.misi_harian add primary key (siswa_id, pot);

drop function if exists public.selesaikan_misi_harian(uuid, date, text, integer);
drop function if exists public.selesaikan_misi_harian(uuid, date, text, integer, jsonb);

-- Mengembalikan total bintang baru, atau NULL bila pot bukan giliran berikutnya
-- (melompati urutan, atau sudah selesai), sehingga bintang tidak bisa dobel.
create or replace function public.selesaikan_misi_harian(
  p_siswa_id uuid,
  p_pot      text,
  p_bintang  integer,
  p_laporan  jsonb
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
  where siswa_id = p_siswa_id;

  if p_pot is distinct from (array['A', 'B', 'C', 'D'])[v_selesai + 1] then
    return null;
  end if;

  insert into public.misi_harian (siswa_id, pot, laporan)
  values (p_siswa_id, p_pot, p_laporan)
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

revoke execute on function public.selesaikan_misi_harian(uuid, text, integer, jsonb)
  from public, anon, authenticated;
grant execute on function public.selesaikan_misi_harian(uuid, text, integer, jsonb)
  to service_role;

notify pgrst, 'reload schema';
