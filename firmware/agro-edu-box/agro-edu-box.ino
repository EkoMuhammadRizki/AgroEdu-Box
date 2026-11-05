#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <DIYables_LCD_I2C.h>
#include <DHT.h>
#include "secrets.h"

// 1. Konfigurasi Jaringan Wi-Fi
// Nama WiFi, kata sandi, dan token ada di secrets.h, karena file ini ikut masuk
// ke GitHub yang terbuka untuk umum.
const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;

// 2. Konfigurasi LCD I2C (Alamat 0x27, ukuran 16x2)
DIYables_LCD_I2C lcd(0x27, 16, 2);

// 3. Pemetaan Pin Input & Output ESP32
#define PIN_DHT      14    // Input: Pin DATA DHT22 ke D14
#define DHTTYPE      DHT22
DHT dht(PIN_DHT, DHTTYPE);

const int PIN_SOIL   = 34; // Input: Pin A0 Sensor Tanah ke D34
const int PIN_BUZZER = 15; // Output: Buzzer ke D15
const int PIN_LED1   = 26; // Output: LED 1 (Kering / Terlalu Basah) ke D26
const int PIN_LED2   = 27; // Output: LED 2 (Normal / Nyaman) ke D27

// 4. Kalibrasi Sensor Tanah (Kering = Nilai Tinggi, Basah = Nilai Rendah)
const int BATAS_KERING = 4095;
const int BATAS_BASAH  = 1200;

// Batas pemicu alarm & indikator
const int ALARM_KERING_MAKS = 50;   // Di bawah 50% (0 - 49%) = Tanah Kering
const int ALARM_BASAH_MIN   = 80;   // 80% ke atas (80 - 100%) = Terlalu Basah
const float ALARM_SUHU_MAKS = 35.0; // Suhu maksimal aman

// 5. Pengiriman data ke website
const unsigned long JEDA_KIRIM = 10000;  // kirim tiap 10 detik
const unsigned long JEDA_WIFI  = 20000;  // coba sambung ulang WiFi tiap 20 detik
const int BATAS_TUNGGU_WEBSITE = 15000;  // hotspot HP bisa lambat saat jabat tangan HTTPS
unsigned long waktuKirim = 0;
unsigned long waktuWifi = 0;

// Satu sensor tanah dipindah dengan tangan dari pot ke pot, jadi alat tidak tahu
// sensornya sedang di pot mana. Angkanya dikirim ke keempat pot, lalu siswa
// membaca tab pot tempat sensor sedang ditancapkan.
void kirimKeWebsite(int persenTanah, float suhuC, bool suhuTerbaca) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Belum kirim: WiFi belum tersambung.");
    return;
  }

  // Suhu gagal dibaca dikirim kosong, bukan 0, supaya website tidak menampilkan "Dingin".
  String suhu = suhuTerbaca ? String(suhuC, 1) : "null";
  String tanah = String(persenTanah);
  String pesan = "{\"suhu\":" + suhu + ",\"pot\":{\"a\":" + tanah + ",\"b\":" + tanah +
                 ",\"c\":" + tanah + ",\"d\":" + tanah + "}}";

  WiFiClientSecure klien;
  klien.setInsecure();  // isinya hanya angka sensor; koneksinya tetap terenkripsi

  HTTPClient http;
  if (!http.begin(klien, INGEST_URL)) {
    Serial.println("Gagal kirim: alamat website tidak bisa dibuka. Periksa INGEST_URL.");
    return;
  }
  http.setConnectTimeout(BATAS_TUNGGU_WEBSITE);
  http.setTimeout(BATAS_TUNGGU_WEBSITE);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-iot-token", INGEST_TOKEN);

  int kode = http.POST(pesan);
  if (kode == 200) {
    Serial.print("Terkirim: ");
    Serial.println(pesan);
  } else {
    Serial.print("Gagal kirim, kode ");
    Serial.print(kode);
    Serial.print(": ");
    Serial.println(kode > 0 ? http.getString() : HTTPClient::errorToString(kode));
  }
  http.end();
}

void jagaWifi() {
  if (WiFi.status() == WL_CONNECTED) return;
  if (millis() - waktuWifi < JEDA_WIFI) return;
  waktuWifi = millis();
  Serial.println("WiFi putus, mencoba menyambung ulang...");
  WiFi.disconnect();
  WiFi.begin(ssid, password);
}

void setup() {
  Serial.begin(115200);

  // Mengatur mode pin Output
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED1, OUTPUT);
  pinMode(PIN_LED2, OUTPUT);

  // Pastikan semua indikator mati saat baru dinyalakan
  digitalWrite(PIN_BUZZER, LOW);
  digitalWrite(PIN_LED1, LOW);
  digitalWrite(PIN_LED2, LOW);

  // Pengaturan akurasi ADC ESP32
  analogReadResolution(12);
  analogSetPinAttenuation(PIN_SOIL, ADC_11db);

  dht.begin();
  Wire.begin(21, 22);

  lcd.begin(16, 2);
  lcd.backlight();

  // Tampilan awal & Koneksi Wi-Fi
  lcd.setCursor(0, 0);
  lcd.print("Menghubungkan");
  lcd.setCursor(0, 1);
  lcd.print("WiFi...");

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  int percobaan = 0;

  while (WiFi.status() != WL_CONNECTED && percobaan < 40) {
    delay(500);
    Serial.print(".");
    percobaan++;
  }
  Serial.println();

  lcd.clear();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi tersambung. Alamat IP: ");
    Serial.println(WiFi.localIP());
    lcd.setCursor(0, 0);
    lcd.print("WiFi Terhubung!");
    // Tes bunyi buzzer & nyala LED bersamaan saat konek
    digitalWrite(PIN_BUZZER, HIGH); digitalWrite(PIN_LED2, HIGH); delay(100);
    digitalWrite(PIN_BUZZER, LOW);  digitalWrite(PIN_LED2, LOW);  delay(100);
    digitalWrite(PIN_BUZZER, HIGH); digitalWrite(PIN_LED2, HIGH); delay(100);
    digitalWrite(PIN_BUZZER, LOW);  digitalWrite(PIN_LED2, LOW);
  } else {
    Serial.println("WiFi belum tersambung. Periksa hotspot dan secrets.h.");
    lcd.setCursor(0, 0);
    lcd.print("Mode Offline");
  }
  delay(2000);
  lcd.clear();
}

void loop() {
  jagaWifi();

  // --- A. MEMBACA SENSOR KELEMBAPAN TANAH ---
  long totalADC = 0;
  for (int i = 0; i < 10; i++) {
    totalADC += analogRead(PIN_SOIL);
    delay(10);
  }
  int nilaiMentahTanah = totalADC / 10;

  int persenTanah = map(nilaiMentahTanah, BATAS_KERING, BATAS_BASAH, 0, 100);
  persenTanah = constrain(persenTanah, 0, 100);

  // --- B. MEMBACA SUHU & KELEMBAPAN UDARA DARI DHT22 ---
  float suhuC = dht.readTemperature();
  float kelembapanUdara = dht.readHumidity();

  bool suhuTerbaca = !(isnan(suhuC) || isnan(kelembapanUdara));
  if (!suhuTerbaca) {
    suhuC = 0.0;
  }

  // --- C. MENENTUKAN STATUS KELEMBAPAN TANAH ---
  String statusTanah = "";
  if (persenTanah >= ALARM_BASAH_MIN) {
    statusTanah = "Terlalu Basah"; // 80 - 100%
  } else if (persenTanah >= ALARM_KERING_MAKS) {
    statusTanah = "Normal/Nyaman"; // 50 - 79%
  } else {
    statusTanah = "Tanah Kering "; // 0 - 49%
  }

  // --- D. MENAMPILKAN DATA DI SERIAL MONITOR ---
  Serial.print("ADC: "); Serial.print(nilaiMentahTanah);
  Serial.print(" | Tanah: "); Serial.print(persenTanah); Serial.print("%");
  Serial.print(" ["); Serial.print(statusTanah); Serial.print("]");
  Serial.print(" | Suhu: "); Serial.print(suhuC, 1); Serial.println("C");

  // --- E. MENAMPILKAN DATA DI LAYAR LCD 16x2 ---
  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print(persenTanah);
  lcd.print("% ");
  lcd.print("S:");
  lcd.print(suhuC, 1);
  lcd.print("C  ");

  lcd.setCursor(0, 1);
  lcd.print(statusTanah);
  lcd.print("    ");

  // --- F. MENGIRIM DATA KE WEBSITE ---
  if (millis() - waktuKirim >= JEDA_KIRIM) {
    waktuKirim = millis();
    kirimKeWebsite(persenTanah, suhuC, suhuTerbaca);
  }

  // --- G. LOGIKA INDIKATOR LED & ALARM BUZZER ---
  // Kondisi 1: Tanah Kering (< 50%) ATAU Terlalu Basah (>= 80%) ATAU Suhu Panas (> 35 C)
  if (persenTanah < ALARM_KERING_MAKS || persenTanah >= ALARM_BASAH_MIN || suhuC > ALARM_SUHU_MAKS) {
    digitalWrite(PIN_LED2, LOW);  // Matikan LED 2 (Normal)

    // Buzzer dan LED 1 menyala & mati bersamaan sebanyak 3 kali (sekitar 1.8 detik)
    for (int k = 0; k < 3; k++) {
      digitalWrite(PIN_BUZZER, HIGH);
      digitalWrite(PIN_LED1, HIGH);
      delay(300);
      digitalWrite(PIN_BUZZER, LOW);
      digitalWrite(PIN_LED1, LOW);
      delay(300);
    }
  }
  // Kondisi 2: Tanah Normal/Nyaman (50% - 79%) dan Suhu Aman
  else {
    digitalWrite(PIN_BUZZER, LOW); // Pastikan Buzzer mati
    digitalWrite(PIN_LED1, LOW);   // Pastikan LED 1 (Bahaya) mati
    digitalWrite(PIN_LED2, HIGH);  // Nyalakan LED 2 (Normal) secara stabil
    delay(1900);
  }
}
