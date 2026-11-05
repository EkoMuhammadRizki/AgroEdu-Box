# Alat IoT Agro-Edu Box

Satu ESP32 dengan satu sensor tanah. Sensor dipindahkan dengan tangan dari pot ke
pot, lalu angkanya dikirim langsung ke website.

```
ESP32  ──HTTPS──►  /api/iot/ingest  ──►  Supabase
                                           │
                 Lab IoT siswa & portal guru  ◄──┘
```

Alat tidak tahu sensornya sedang di pot mana, jadi angka yang sama dikirim ke
keempat pot. Siswa membuka tab pot tempat sensor sedang ditancapkan.

## 1. Rangkaian

| Komponen | Pin ESP32 |
|---|---|
| Sensor tanah (A0) | GPIO 34 |
| DHT22 (suhu udara) | GPIO 14 |
| Buzzer | GPIO 15 |
| LED 1 (kering / terlalu basah) | GPIO 26 |
| LED 2 (normal) | GPIO 27 |
| LCD I2C SDA / SCL | GPIO 21 / 22, alamat 0x27 |

## 2. Batas kondisi pada alat

| Kelembapan tanah | Tulisan LCD | Alat |
|---|---|---|
| di bawah 50% | Tanah Kering | LED 1 dan buzzer |
| 50–79% | Normal/Nyaman | LED 2 |
| 80% ke atas | Terlalu Basah | LED 1 dan buzzer |

Suhu di atas 35°C juga membunyikan buzzer. Batas kering pada Kartu Investigasi,
soal kuis nomor 7, dan maskot di website adalah 30%. Untuk menyamakannya, ubah
`ALARM_KERING_MAKS` di firmware.

## 3. Menyiapkan database

Buka Supabase → SQL Editor, lalu jalankan isi `supabase/iot.sql`. Tanpa langkah
ini, data alat tidak bisa disimpan. Aman dijalankan ulang.

## 4. Token alat

Token membuat hanya alat sekolah yang boleh mengirim data. Tanpa itu, siapa pun
yang tahu alamat websitenya bisa mengirim angka palsu ke dashboard siswa.

1. Buat token acak:

   ```bash
   node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
   ```

2. Simpan di tiga tempat, **nilainya harus sama persis**:

   | Tempat | Nama |
   |---|---|
   | `.env.local` di komputer | `IOT_INGEST_TOKEN` |
   | Vercel → Settings → Environment Variables (pilih Secret) | `IOT_INGEST_TOKEN` |
   | `firmware/agro-edu-box/secrets.h` | `INGEST_TOKEN` |

3. Setelah mengisi di Vercel, lakukan **Redeploy** agar terbaca.

Di produksi, website **menolak semua data sensor** selama `IOT_INGEST_TOKEN`
belum diisi, bukan menerimanya diam-diam.

Jangan memotret layar yang menampilkan token ini. Kalau token terlanjur
tersebar, buat yang baru dengan perintah di atas dan ganti di ketiga tempat.

## 5. Mengunggah program

1. Di Arduino IDE, pasang board **esp32** (Boards Manager) dan dua pustaka ini
   lewat Library Manager:
   - DHT sensor library (Adafruit) + Adafruit Unified Sensor
   - DIYables_LCD_I2C

   WiFi dan HTTPClient sudah bawaan board ESP32, tidak perlu dipasang.
2. Salin `secrets.h.example` menjadi `secrets.h`, lalu isi nama WiFi, kata
   sandi, dan token. File `secrets.h` tidak ikut masuk ke GitHub.
3. ESP32 hanya bisa memakai WiFi **2,4 GHz**. Kalau router sekolah memisahkan
   2,4 GHz dan 5 GHz, pilih yang 2,4 GHz.
4. Pilih board *ESP32 Dev Module*, lalu Upload.
5. Buka Serial Monitor di 115200 baud. Kalau berhasil, tiap 10 detik muncul:

   ```
   Terkirim: {"suhu":28.4,"pot":{"a":45,"b":45,"c":45,"d":45}}
   ```

6. Buka `/lab-iot` di website. Keempat tab pot menampilkan angka yang sama.

## 6. Menguji tanpa alat

Untuk memastikan jalur websitenya jalan sebelum alat siap:

```bash
curl -X POST https://agro-edu-box.vercel.app/api/iot/ingest \
  -H "Content-Type: application/json" \
  -H "x-iot-token: ISI_TOKEN" \
  -d '{"suhu":28.4,"pot":{"a":45.2,"b":62,"c":21.5,"d":70.1}}'
```

Lalu buka `/lab-iot`. Si Tunas di Pot C harus sedih (21,5% = kering) dan Pot B
harus senang (62% = ideal).

Untuk mengembalikan semua pot ke keadaan tidur:

```bash
curl -X POST https://agro-edu-box.vercel.app/api/iot/ingest \
  -H "Content-Type: application/json" \
  -H "x-iot-token: ISI_TOKEN" \
  -d '{"status":"mati"}'
```

## 7. Kalau ada yang aneh

Pesan di Serial Monitor sudah menjelaskan sendiri sebagian besar masalah.

| Yang terlihat | Sebab |
|---|---|
| `Gagal kirim, kode 401` | Token di `secrets.h` tidak sama dengan di Vercel |
| `Gagal kirim, kode 503` | `IOT_INGEST_TOKEN` belum diisi di Vercel, atau belum redeploy |
| `Gagal kirim, kode 400` | Angka sensor di luar batas wajar; cek kalibrasi |
| `Gagal kirim, kode -1` | Tidak sampai ke website; cek WiFi sekolah |
| LCD: `Mode Offline` | Nama atau kata sandi WiFi salah, atau jaringannya 5 GHz. Alat terus mencoba menyambung |
| Suhu `0.0C` di LCD | DHT22 lepas atau rusak. Website tidak menerima angka 0 itu, suhunya dikirim kosong |
| Semua pot 0% atau 100% | Kalibrasi salah. Lihat angka ADC di Serial Monitor, lalu sesuaikan `BATAS_KERING` dan `BATAS_BASAH` |
| LCD kosong | Alamat I2C bukan 0x27. Coba 0x3F |
| Si Tunas tidur padahal alat menyala | Data tidak sampai. Lihat Serial Monitor |

Website menganggap alat mati bila tidak ada data lebih dari 2 menit. Kalau
ESP32 diatur mengirim lebih jarang, ubah `IOT_OFFLINE_AFTER_SECONDS` di Vercel.

## 8. Catatan untuk sekolah

- **Matikan alat di luar jam pelajaran.** Selain hemat listrik, ini menjaga
  pemakaian website tetap jauh di bawah jatah gratis Vercel.
- **Tidak ada langganan apa pun.** Website berjalan di jatah gratis Vercel dan
  Supabase. Tidak ada akun pihak ketiga yang bisa kedaluwarsa.
- **Kalau WiFi sekolah berganti kata sandi**, ubah `secrets.h` lalu unggah
  ulang programnya. Hanya itu yang perlu diubah.
