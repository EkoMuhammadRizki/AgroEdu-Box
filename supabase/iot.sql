-- Agro-Edu Box: pembacaan alat IoT tersimpan di database.
-- Jalankan setelah schema.sql. Aman dijalankan ulang.
--
-- Sebelumnya data sensor hanya disimpan di memori server. Di Vercel server bisa
-- mati atau berganti kapan saja, jadi angkanya hilang dan Si Tunas tiba-tiba tidur
-- padahal alat menyala. Tabel ini membuat pembacaan terakhir bertahan.
--
-- Hanya pembacaan TERAKHIR yang disimpan, satu baris per pot. Riwayat tidak dicatat
-- karena grafik sudah dihapus dari tampilan siswa; kalau nanti perlu, tambahkan
-- tabel terpisah agar tabel ini tetap ringan.

create table if not exists public.iot_pot (
  id            text primary key,
  nama          text not null,
  -- Suhu udara dan waktunya dipisah dari kelembapan: DHT22 kadang gagal dibaca,
  -- dan angka suhu yang basi tidak boleh ikut ditampilkan sebagai data baru.
  suhu          numeric(5, 2),
  suhu_at       timestamptz,
  kelembapan    numeric(5, 2) check (kelembapan between 0 and 100),
  diperbarui_at timestamptz,
  -- Diisi saat alat dilaporkan mati lewat kiriman {"status":"mati"}.
  offline_at    timestamptz,
  paket         bigint not null default 0
);

insert into public.iot_pot (id, nama) values
  ('pot-a', 'Pot A'),
  ('pot-b', 'Pot B'),
  ('pot-c', 'Pot C'),
  ('pot-d', 'Pot D')
on conflict (id) do nothing;

alter table public.iot_pot enable row level security;
revoke all on public.iot_pot from anon, authenticated;
-- Butuh update juga: fungsi di bawah berjalan sebagai pemanggil (service_role),
-- dan service_role melewati RLS tetapi tetap memerlukan hak tabel.
-- Tanpa insert: keempat baris pot sudah tetap, tidak boleh ditambah dari luar.
grant select, update on public.iot_pot to service_role;

-- Menyimpan pembacaan beberapa pot sekaligus: satu paket dari ESP32 berisi 4 pot.
-- p_data contoh: [{"id":"pot-a","kelembapan":45.2,"suhu":28.4}, ...]
create or replace function public.simpan_pembacaan_iot(p_data jsonb)
returns integer
language plpgsql
set search_path = ''
as $$
declare
  v_item jsonb;
  v_jumlah integer := 0;
begin
  for v_item in select * from jsonb_array_elements(p_data) loop
    update public.iot_pot set
      kelembapan    = (v_item->>'kelembapan')::numeric,
      diperbarui_at = now(),
      offline_at    = null,
      -- Suhu kosong (sensor gagal dibaca) tidak menimpa angka lama, tetapi
      -- suhu_at juga tidak diperbarui, jadi angka basi berhenti ditampilkan.
      suhu          = coalesce((v_item->>'suhu')::numeric, suhu),
      suhu_at       = case when v_item->>'suhu' is null then suhu_at else now() end,
      paket         = paket + 1
    where id = v_item->>'id';
    if found then
      v_jumlah := v_jumlah + 1;
    end if;
  end loop;
  return v_jumlah;
end;
$$;

-- Dipanggil saat alat dilaporkan mati, supaya semua pot langsung tidur tanpa
-- menunggu batas 2 menit.
create or replace function public.tandai_iot_mati()
returns integer
language sql
set search_path = ''
as $$
  with diubah as (
    update public.iot_pot set offline_at = now() where offline_at is null returning 1
  )
  select count(*)::integer from diubah;
$$;

revoke execute on function public.simpan_pembacaan_iot(jsonb) from public, anon, authenticated;
revoke execute on function public.tandai_iot_mati() from public, anon, authenticated;
grant execute on function public.simpan_pembacaan_iot(jsonb) to service_role;
grant execute on function public.tandai_iot_mati() to service_role;

notify pgrst, 'reload schema';
