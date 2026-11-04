-- Agro-Edu Box: akun guru/admin.
-- Jalankan di Supabase Dashboard > SQL Editor. Aman dijalankan ulang.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.guru (
  id            uuid primary key default gen_random_uuid(),
  nama          text not null,
  email         text not null unique check (email = lower(email)),
  -- Hash bcrypt. Jangan pernah menyimpan password apa adanya di kolom ini.
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- Sama seperti tabel siswa: browser tidak boleh mengakses tabel ini secara langsung.
alter table public.guru enable row level security;
revoke all on public.guru from anon, authenticated;
grant select on public.guru to service_role;

-- Menambah guru asli (jalankan di SQL Editor, email wajib huruf kecil):
--
--   insert into public.guru (nama, email, password_hash) values
--     ('Nama Guru', 'email.guru@gmail.com', extensions.crypt('password-guru', extensions.gen_salt('bf', 10)));
--
-- Mengganti password:
--
--   update public.guru
--   set password_hash = extensions.crypt('password-baru', extensions.gen_salt('bf', 10))
--   where email = 'email.guru@gmail.com';
--
-- Menghapus akun dummy setelah guru asli ada:
--
--   delete from public.guru where email = 'email.akun.dummy@gmail.com';
