/*
  Agro-Edu Box - Stasiun Kebun IoT
  ---------------------------------
  Satu ESP32 memantau empat pot sekaligus:
    - 4 sensor kelembapan tanah (satu per pot)
    - 1 sensor suhu udara DHT22 (dipakai bersama, karena keempat pot satu ruangan)
    - 1 LCD 16x2 yang menampilkan pot secara bergantian
    - 1 buzzer + 2 LED sebagai penanda kondisi

  Data dikirim langsung ke website Agro-Edu Box lewat HTTPS, tanpa perantara.
  Tidak ada layanan pihak ketiga, tidak ada akun tambahan yang harus diurus
  sekolah. Lihat firmware/README.md untuk langkah pengaturannya.

  Pustaka yang perlu dipasang lewat Library Manager Arduino IDE:
    - DHT sensor library (Adafruit) + Adafruit Unified Sensor
    - DIYables_LCD_I2C
  (WiFi dan HTTPClient sudah bawaan board ESP32.)

  Salin secrets.h.example menjadi secrets.h lalu isi. File secrets.h sengaja
  tidak ikut masuk ke GitHub karena berisi kata sandi dan token.
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <DIYables_LCD_I2C.h>
#include <DHT.h>
#include "secrets.h"

// ─── Pin ────────────────────────────────────────────────────────────────
// Keempat pin tanah memakai ADC1 (GPIO 32-39). Jangan pindah ke GPIO 0-27:
// itu ADC2, dan ADC2 tidak bisa dipakai bersamaan dengan WiFi di ESP32.
const int PIN_TANAH[4] = { 34, 35, 32, 33 };  // Pot A, B, C, D
const char* NAMA_POT[4] = { "Pot A", "Pot B", "Pot C", "Pot D" };

#define PIN_DHT   14
#define DHTTYPE   DHT22
const int PIN_BUZZER = 15;
const int PIN_LED_BAHAYA = 26;  // merah: ada pot yang bermasalah
const int PIN_LED_AMAN   = 27;  // hijau: semua pot sehat

// ─── Kalibrasi sensor tanah (kering = nilai ADC tinggi) ────────────────
// Ukur sendiri: celupkan sensor ke air untuk BATAS_BASAH, biarkan di udara
// kering untuk BATAS_KERING, lalu lihat angka ADC di Serial Monitor.
const int BATAS_KERING = 4095;
const int BATAS_BASAH  = 1200;

// ─── Batas kondisi ──────────────────────────────────────────────────────
// Angka ini HARUS sama dengan materi ajar: Kartu Investigasi, soal kuis
// nomor 7, dan maskot Si Tunas di Lab IoT (lihat lib/pot-mood.ts).
const int TANAH_KERING_DI_BAWAH = 30;   // < 30%  : kering, buzzer berbunyi
const int TANAH_IDEAL_DARI      = 50;   // 50-80% : ideal
const int TANAH_BASAH_DI_ATAS   = 80;   // > 80%  : terlalu basah
const float SUHU_PANAS_DI_ATAS  = 35.0; // alarm suhu

// ─── Jadwal (milidetik) ─────────────────────────────────────────────────
const unsigned long JEDA_BACA    = 5000;   // baca sensor tiap 5 detik
const unsigned long JEDA_KIRIM   = 10000;  // kirim ke website tiap 10 detik
const unsigned long JEDA_LCD     = 2500;   // ganti pot di layar tiap 2,5 detik
const unsigned long JEDA_ALARM   = 10000;  // bunyi pengingat tiap 10 detik
const unsigned long LAMA_BIP     = 180;    // panjang satu bunyi
const unsigned long JEDA_WIFI    = 15000;  // jeda antar percobaan sambung WiFi
const unsigned long BATAS_KIRIM  = 10000;  // berhenti menunggu balasan setelah ini

// ─── Objek ──────────────────────────────────────────────────────────────
DIYables_LCD_I2C lcd(0x27, 16, 2);
DHT dht(PIN_DHT, DHTTYPE);
WiFiClientSecure net;

// ─── Keadaan ────────────────────────────────────────────────────────────
float tanahPersen[4] = { 0, 0, 0, 0 };
float suhuC = 0.0;
bool  suhuTerbaca = false;
bool  adaAlarm = false;
bool  kirimBerhasil = false;

unsigned long tBaca = 0, tKirim = 0, tLcd = 0, tAlarm = 0, tWifi = 0;
int  gagalWifi = 0;
bool wifiSiap = false;
int potTampil = 0;
int bipTersisa = 0;
bool bipMenyala = false;
unsigned long tBip = 0;

// ─── Membaca sensor ─────────────────────────────────────────────────────
float bacaTanah(int pin) {
  long total = 0;
  for (int i = 0; i < 8; i++) {
    total += analogRead(pin);
    delay(2);
  }
  int mentah = total / 8;
  float persen = map(mentah, BATAS_KERING, BATAS_BASAH, 0, 100);
  return constrain(persen, 0.0f, 100.0f);
}

void bacaSemuaSensor() {
  for (int i = 0; i < 4; i++) {
    tanahPersen[i] = bacaTanah(PIN_TANAH[i]);
  }

  float bacaan = dht.readTemperature();
  // Sensor gagal dibaca TIDAK dilaporkan sebagai 0 derajat. Angka 0 akan
  // tampil di dashboard sebagai "Dingin" dengan maskot sedih, padahal yang
  // terjadi sebenarnya adalah sensornya lepas atau rusak.
  if (isnan(bacaan)) {
    suhuTerbaca = false;
  } else {
    suhuC = bacaan;
    suhuTerbaca = true;
  }

  adaAlarm = (suhuTerbaca && suhuC > SUHU_PANAS_DI_ATAS);
  for (int i = 0; i < 4; i++) {
    if (tanahPersen[i] < TANAH_KERING_DI_BAWAH || tanahPersen[i] > TANAH_BASAH_DI_ATAS) {
      adaAlarm = true;
    }
  }

  Serial.print("Tanah A/B/C/D: ");
  for (int i = 0; i < 4; i++) {
    Serial.print(tanahPersen[i], 0);
    Serial.print(i < 3 ? "% / " : "% | ");
  }
  Serial.print("Suhu: ");
  if (suhuTerbaca) { Serial.print(suhuC, 1); Serial.println(" C"); }
  else             { Serial.println("gagal dibaca"); }
}

const char* statusTanah(float persen) {
  if (persen < TANAH_KERING_DI_BAWAH) return "Tanah Kering!";
  if (persen < TANAH_IDEAL_DARI)      return "Agak Kering";
  if (persen > TANAH_BASAH_DI_ATAS)   return "Terlalu Basah";
  return "Tanah Ideal";
}

// ─── Layar ──────────────────────────────────────────────────────────────
void tampilkanPot(int i) {
  char baris1[17];
  char suhuTeks[8];
  if (suhuTerbaca) snprintf(suhuTeks, sizeof(suhuTeks), "%.0fC", suhuC);
  else             snprintf(suhuTeks, sizeof(suhuTeks), "--C");

  snprintf(baris1, sizeof(baris1), "%s %3.0f%% %s", NAMA_POT[i], tanahPersen[i], suhuTeks);

  lcd.setCursor(0, 0);
  lcd.print("                ");
  lcd.setCursor(0, 0);
  lcd.print(baris1);

  lcd.setCursor(0, 1);
  lcd.print("                ");
  lcd.setCursor(0, 1);
  if (WiFi.status() != WL_CONNECTED) lcd.print("WiFi putus");
  else if (!kirimBerhasil)           lcd.print("Gagal kirim");
  else                               lcd.print(statusTanah(tanahPersen[i]));
}

// ─── Buzzer & LED ───────────────────────────────────────────────────────
// Buzzer berbunyi dua kali singkat setiap 10 detik selama ada pot bermasalah,
// bukan terus-menerus. Dalam Kartu Investigasi, Pot A dan Pot C memang sengaja
// dibuat kering sepanjang pelajaran, jadi bunyi tanpa henti akan mengganggu
// satu kelas. LED merah tetap menyala supaya kondisinya tetap terlihat.
void urusAlarm() {
  unsigned long sekarang = millis();

  digitalWrite(PIN_LED_BAHAYA, adaAlarm ? HIGH : LOW);
  digitalWrite(PIN_LED_AMAN,   adaAlarm ? LOW  : HIGH);

  if (!adaAlarm) {
    digitalWrite(PIN_BUZZER, LOW);
    bipTersisa = 0;
    bipMenyala = false;
    return;
  }

  if (bipTersisa == 0 && sekarang - tAlarm >= JEDA_ALARM) {
    tAlarm = sekarang;
    bipTersisa = 2;
    bipMenyala = false;
    tBip = sekarang - LAMA_BIP;
  }

  if (bipTersisa > 0 && sekarang - tBip >= LAMA_BIP) {
    tBip = sekarang;
    bipMenyala = !bipMenyala;
    digitalWrite(PIN_BUZZER, bipMenyala ? HIGH : LOW);
    if (!bipMenyala) bipTersisa--;
  }
}

// ─── Jaringan ───────────────────────────────────────────────────────────
// Menjelaskan sebab kegagalan dengan kalimat biasa, bukan kode angka.
void jelaskanWifi() {
  switch (WiFi.status()) {
    case WL_NO_SSID_AVAIL:
      Serial.println("  Nama WiFi tidak ditemukan. Periksa WIFI_SSID di secrets.h");
      Serial.println("  (huruf besar-kecil harus sama persis), dan pastikan jaringannya menyala.");
      break;
    case WL_CONNECT_FAILED:
      Serial.println("  Kata sandi WiFi salah. Periksa WIFI_PASSWORD di secrets.h.");
      break;
    case WL_IDLE_STATUS:
    case WL_DISCONNECTED:
      Serial.println("  Belum tersambung, mencoba lagi...");
      break;
    default:
      Serial.print("  Status WiFi: ");
      Serial.println(WiFi.status());
  }
}

// Menampilkan jaringan yang benar-benar terlihat ESP32. Ini cara tercepat
// mengetahui apakah nama WiFi salah ketik atau jaringannya memang 5 GHz.
void daftarWifiTerlihat() {
  Serial.println();
  Serial.println("Jaringan WiFi 2,4 GHz yang terlihat ESP32:");
  int jumlah = WiFi.scanNetworks();
  if (jumlah <= 0) {
    Serial.println("  (tidak ada satu pun)");
  } else {
    for (int i = 0; i < jumlah; i++) {
      Serial.print("  - \"");
      Serial.print(WiFi.SSID(i));
      Serial.print("\"  kekuatan ");
      Serial.print(WiFi.RSSI(i));
      Serial.println(" dBm");
    }
  }
  WiFi.scanDelete();
  Serial.print("Yang dicari firmware: \"");
  Serial.print(WIFI_SSID);
  Serial.println("\"");
  Serial.println("Kalau nama itu tidak ada di daftar, berarti jaringannya belum menyala,");
  Serial.println("namanya beda, atau jaringannya 5 GHz (ESP32 hanya bisa 2,4 GHz).");
  Serial.println();
}

void sambungWifi() {
  if (WiFi.status() == WL_CONNECTED) {
    if (!wifiSiap) {
      wifiSiap = true;
      gagalWifi = 0;
      Serial.print("WiFi tersambung. Alamat IP: ");
      Serial.println(WiFi.localIP());
    }
    return;
  }

  wifiSiap = false;
  if (gagalWifi > 0) jelaskanWifi();
  gagalWifi++;

  // Jangan memanggil WiFi.begin() terlalu sering. Jabat tangan WiFi butuh
  // beberapa detik, dan memanggilnya lagi di tengah proses justru mengulang
  // dari awal sehingga sambungan tidak pernah selesai.
  Serial.print("Menyambung ke WiFi \"");
  Serial.print(WIFI_SSID);
  Serial.println("\"...");
  WiFi.disconnect();
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  if (gagalWifi == 3) daftarWifiTerlihat();
}

void kirimData() {
  if (WiFi.status() != WL_CONNECTED) {
    kirimBerhasil = false;
    return;
  }

  char suhuTeks[12];
  if (suhuTerbaca) snprintf(suhuTeks, sizeof(suhuTeks), "%.1f", suhuC);
  else             snprintf(suhuTeks, sizeof(suhuTeks), "null");

  char pesan[160];
  snprintf(pesan, sizeof(pesan),
    "{\"suhu\":%s,\"pot\":{\"a\":%.1f,\"b\":%.1f,\"c\":%.1f,\"d\":%.1f}}",
    suhuTeks, tanahPersen[0], tanahPersen[1], tanahPersen[2], tanahPersen[3]);

  HTTPClient http;
  if (!http.begin(net, INGEST_URL)) {
    Serial.println("Alamat website tidak bisa dibuka. Periksa INGEST_URL.");
    kirimBerhasil = false;
    return;
  }
  http.setTimeout(BATAS_KIRIM);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-iot-token", INGEST_TOKEN);

  int kode = http.POST((uint8_t*)pesan, strlen(pesan));
  kirimBerhasil = (kode == 200);

  if (kirimBerhasil) {
    Serial.print("Terkirim: ");
    Serial.println(pesan);
  } else {
    Serial.print("Gagal kirim, kode ");
    Serial.print(kode);
    if (kode == 401) {
      Serial.println(" (token salah)");
      Serial.println("  INGEST_TOKEN di secrets.h harus sama persis dengan IOT_INGEST_TOKEN di Vercel.");
    } else if (kode == 503) {
      Serial.println(" (server menolak)");
      Serial.println("  IOT_INGEST_TOKEN belum diisi di Vercel, atau belum Redeploy setelah diisi.");
    } else if (kode == 400) {
      Serial.println(" (angka sensor di luar batas wajar)");
      Serial.println("  Periksa kalibrasi BATAS_KERING dan BATAS_BASAH.");
    } else if (kode < 0) {
      Serial.print(" (");
      Serial.print(HTTPClient::errorToString(kode));
      Serial.println(")");
      Serial.println("  Paket tidak sampai ke website. Penyebab paling sering: hotspot menyala");
      Serial.println("  tetapi kuota data HP mati, jadi ada WiFi tanpa internet.");
      Serial.println("  Uji cepat: sambungkan laptop ke hotspot yang sama, lalu buka");
      Serial.println("  https://agro-edu-box.vercel.app di browser. Kalau laptop juga tidak bisa");
      Serial.println("  membukanya, berarti hotspotnya memang belum punya internet.");
    } else {
      Serial.println();
    }
  }
  http.end();
}

// ─── Setup ──────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);

  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED_BAHAYA, OUTPUT);
  pinMode(PIN_LED_AMAN, OUTPUT);
  digitalWrite(PIN_BUZZER, LOW);
  digitalWrite(PIN_LED_BAHAYA, LOW);
  digitalWrite(PIN_LED_AMAN, LOW);

  analogReadResolution(12);
  for (int i = 0; i < 4; i++) {
    analogSetPinAttenuation(PIN_TANAH[i], ADC_11db);
  }

  dht.begin();
  Wire.begin(21, 22);
  lcd.begin(16, 2);
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Agro-Edu Box");
  lcd.setCursor(0, 1);
  lcd.print("Menyalakan...");

  sambungWifi();

  // Sambungan tanpa pemeriksaan sertifikat website. Isi paketnya hanya angka
  // kelembapan dan suhu, bukan data pribadi siswa. Tokennya tetap terlindungi
  // karena pengirimannya tetap terenkripsi.
  net.setInsecure();

  bacaSemuaSensor();
  lcd.clear();
}

// ─── Loop ───────────────────────────────────────────────────────────────
void loop() {
  unsigned long sekarang = millis();

  if (sekarang - tWifi >= JEDA_WIFI) {
    tWifi = sekarang;
    sambungWifi();
  }

  if (sekarang - tBaca >= JEDA_BACA) {
    tBaca = sekarang;
    bacaSemuaSensor();
  }

  if (sekarang - tKirim >= JEDA_KIRIM) {
    tKirim = sekarang;
    kirimData();
  }

  if (sekarang - tLcd >= JEDA_LCD) {
    tLcd = sekarang;
    tampilkanPot(potTampil);
    potTampil = (potTampil + 1) % 4;
  }

  urusAlarm();
}
