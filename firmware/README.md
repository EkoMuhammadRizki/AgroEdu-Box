# Alat IoT Agro-Edu Box

Satu ESP32 memantau empat pot, lalu mengirim angkanya ke website lewat MQTT.

```
ESP32  ──MQTT──►  Broker EMQX  ──webhook──►  /api/iot/ingest  ──►  Supabase
                                                                      │
                            Lab IoT siswa & portal guru  ◄────────────┘
```

Broker yang meneruskan sendiri pesannya ke website, jadi tidak perlu ada laptop
yang menyala terus. Vercel tidak bisa berlangganan MQTT karena kodenya hanya
hidup sebentar setiap kali ada yang membuka halaman.

## 1. Rangkaian

| Komponen | Pin ESP32 | Catatan |
|---|---|---|
| Sensor tanah Pot A | GPIO 34 | pin A0 sensor |
| Sensor tanah Pot B | GPIO 35 | |
| Sensor tanah Pot C | GPIO 32 | |
| Sensor tanah Pot D | GPIO 33 | |
| DHT22 (suhu udara) | GPIO 14 | satu saja, dipakai keempat pot |
| Buzzer | GPIO 15 | |
| LED merah (bahaya) | GPIO 26 | lewat resistor 220Ω |
| LED hijau (aman) | GPIO 27 | lewat resistor 220Ω |
| LCD I2C SDA / SCL | GPIO 21 / 22 | alamat 0x27 |

Keempat pin sensor tanah **harus** GPIO 32–39. Pin ADC yang lain (GPIO 0–27)
tidak bisa membaca apa pun saat WiFi menyala di ESP32.

Suhu udara hanya diukur satu kali, jadi keempat pot menampilkan angka suhu yang
sama. Itu wajar karena keempat pot berada di ruangan yang sama.

## 2. Batas kondisi

Angka ini sama persis dengan Kartu Investigasi, soal kuis nomor 7, dan maskot
Si Tunas di Lab IoT. Kalau diubah, ubah juga `lib/pot-mood.ts` di website.

| Kelembapan tanah | Kondisi | Alat |
|---|---|---|
| di bawah 30% | Kering | LED merah, buzzer berbunyi |
| 30–49% | Agak kering | LED merah mati, belum alarm |
| 50–80% | Ideal | LED hijau |
| di atas 80% | Terlalu basah | LED merah, buzzer berbunyi |

Suhu di atas 35°C juga membunyikan buzzer.

Buzzer berbunyi **dua kali singkat setiap 10 detik**, bukan terus-menerus.
Dalam Kartu Investigasi, Pot A dan Pot C memang sengaja dibuat kering sepanjang
pelajaran, jadi bunyi tanpa henti akan mengganggu satu kelas. LED merah tetap
menyala supaya kondisinya tetap terlihat, dan buzzer tetap berhenti begitu pot
disiram, seperti yang diminta di Kartu Investigasi.

## 3. Menyiapkan database

Buka Supabase → SQL Editor, lalu jalankan isi `supabase/iot.sql`. Tanpa langkah
ini, data alat tidak bisa disimpan.

## 4. Menyiapkan broker EMQX

> **Urutannya penting.** Webhook EMQX hanya bisa menghubungi alamat yang
> terbuka di internet. Alamat `localhost` di komputermu tidak bisa dijangkau.
> Jadi website harus sudah ter-deploy ke Vercel lebih dulu, lengkap dengan
> `IOT_INGEST_TOKEN`, sebelum langkah ini dikerjakan.

1. Daftar di [EMQX Cloud Serverless](https://www.emqx.com/en/cloud/serverless-mqtt)
   dan buat satu deployment.
2. Catat **alamat broker** dan **port TLS** (8883) dari halaman **Overview**
   deployment itu.
3. Di menu **Access Control → Authentication**, klik **Add**, lalu buat satu
   pengguna MQTT, misalnya `agro-esp32`, beserta kata sandinya. Ini bukan email
   akun EMQX-mu. EMQX tidak mengizinkan sambungan tanpa nama pengguna.
4. Di menu **Data Integration**, tambahkan **HTTP Server** (Webhook):

   | Isian | Nilai |
   |---|---|
   | Topik | `agroedubox/kebun/#` |
   | URL | `https://agro-edu-box.vercel.app/api/iot/ingest` |
   | Method | `POST` |
   | Header | `x-iot-token` : isi dengan `IOT_INGEST_TOKEN` |
   | Header | `Content-Type` : `application/json` |
   | Body | `${payload}` |

   Kalau form-nya tidak menyediakan header tambahan, pakai
   `Authorization: Bearer <token>`. Kalau keduanya tidak bisa, boleh juga
   `...?token=<token>` di URL, tapi cara itu membuat token ikut tercatat di
   log server, jadi pakai header kalau bisa.

   Kalau isian Body dibiarkan kosong atau diisi template bawaan, tetap jalan:
   website sudah bisa membuka bungkus `{"payload":"..."}` sendiri.

   Paket Serverless membatasi Data Integration pada 2 connector, 4 rule, dan
   4 action. Kita hanya memakai 1 connector dan 1 rule, jadi muat. Jatah gratis
   sekitar 1 juta eksekusi per bulan; dengan pengiriman tiap 10 detik nonstop,
   pemakaian sekitar 260 ribu per bulan.

## 5. Token alat

`IOT_INGEST_TOKEN` sudah ada di `.env.local` untuk pengujian di komputer sendiri.
Isi juga di **Vercel → Settings → Environment Variables** (pilih Secret), lalu
redeploy.

Tanpa token ini, siapa pun yang tahu alamatnya bisa mengirim angka palsu ke
dashboard. Karena itu, di produksi website akan **menolak semua data** selama
`IOT_INGEST_TOKEN` belum diisi, bukan menerimanya diam-diam.

## 6. Mengunggah program

1. Di Arduino IDE, pasang board **esp32** (Boards Manager) dan pustaka berikut
   lewat Library Manager:
   - PubSubClient (Nick O'Leary)
   - DHT sensor library (Adafruit) + Adafruit Unified Sensor
   - DIYables_LCD_I2C
2. Salin `secrets.h.example` menjadi `secrets.h`, lalu isi nama WiFi, kata
   sandi, dan data broker. File `secrets.h` tidak ikut masuk ke GitHub.
3. ESP32 hanya bisa memakai WiFi **2,4 GHz**. Kalau router sekolah memisahkan
   2,4 GHz dan 5 GHz, pilih yang 2,4 GHz.
4. Pilih board *ESP32 Dev Module*, lalu Upload.
5. Buka Serial Monitor di 115200 baud. Kalau berhasil, muncul
   `Menyambung broker MQTT... berhasil.` lalu baris `Terkirim: {...}` tiap
   10 detik.

## 7. Menguji tanpa alat

Untuk memastikan jalur websitenya jalan sebelum alat siap:

```bash
curl -X POST http://localhost:3000/api/iot/ingest \
  -H "Content-Type: application/json" \
  -H "x-iot-token: ISI_TOKEN" \
  -d '{"suhu":28.4,"pot":{"a":45.2,"b":62,"c":21.5,"d":70.1}}'
```

Lalu buka `/lab-iot`. Si Tunas di Pot C harus sedih (21,5% = kering) dan Pot B
harus senang (62% = ideal).

Untuk menguji alat mati:

```bash
curl -X POST http://localhost:3000/api/iot/ingest \
  -H "Content-Type: application/json" \
  -H "x-iot-token: ISI_TOKEN" \
  -d '{"status":"mati"}'
```

## 8. Kalau angkanya aneh

| Gejala | Kemungkinan sebab |
|---|---|
| Suhu `--C` di LCD | DHT22 lepas atau rusak. Angka suhu sengaja tidak dikirim, bukan dikirim sebagai 0. |
| Semua pot 0% atau 100% | Kalibrasi salah. Lihat angka ADC di Serial Monitor, lalu sesuaikan `BATAS_KERING` dan `BATAS_BASAH`. |
| LCD kosong | Alamat I2C bukan 0x27. Coba 0x3F. |
| Si Tunas tidur padahal alat menyala | Data tidak sampai. Periksa webhook EMQX dan token. |
| `Menyambung broker MQTT... gagal, kode -2` | Alamat atau port broker salah. |
| `gagal, kode 5` | Nama pengguna atau kata sandi MQTT salah. |

Website menganggap alat mati bila tidak ada data lebih dari 2 menit. Kalau
ESP32 diatur mengirim lebih jarang, ubah `IOT_OFFLINE_AFTER_SECONDS` di Vercel.
