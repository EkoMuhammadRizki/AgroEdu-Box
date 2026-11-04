/*
  Agro-Edu Box - Stasiun Kebun IoT
  ---------------------------------
  Satu ESP32 memantau empat pot sekaligus:
    - 4 sensor kelembapan tanah (satu per pot)
    - 1 sensor suhu udara DHT22 (dipakai bersama, karena keempat pot satu ruangan)
    - 1 LCD 16x2 yang menampilkan pot secara bergantian
    - 1 buzzer + 2 LED sebagai penanda kondisi

  Data dikirim lewat MQTT ke broker, lalu broker meneruskannya ke website
  Agro-Edu Box. Lihat firmware/README.md untuk langkah pengaturannya.

  Pustaka yang perlu dipasang lewat Library Manager Arduino IDE:
    - PubSubClient (Nick O'Leary)
    - DHT sensor library (Adafruit) + Adafruit Unified Sensor
    - DIYables_LCD_I2C

  Salin secrets.h.example menjadi secrets.h lalu isi. File secrets.h sengaja
  tidak ikut masuk ke GitHub karena berisi kata sandi.
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
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
const unsigned long JEDA_BACA     = 5000;   // baca sensor tiap 5 detik
const unsigned long JEDA_KIRIM    = 10000;  // kirim ke broker tiap 10 detik
const unsigned long JEDA_LCD      = 2500;   // ganti pot di layar tiap 2,5 detik
const unsigned long JEDA_ALARM    = 10000;  // bunyi pengingat tiap 10 detik
const unsigned long LAMA_BIP      = 180;    // panjang satu bunyi
const unsigned long JEDA_SAMBUNG  = 5000;   // coba sambung ulang tiap 5 detik

// ─── Objek ──────────────────────────────────────────────────────────────
DIYables_LCD_I2C lcd(0x27, 16, 2);
DHT dht(PIN_DHT, DHTTYPE);
WiFiClientSecure net;
PubSubClient mqtt(net);

// ─── Keadaan ────────────────────────────────────────────────────────────
float tanahPersen[4] = { 0, 0, 0, 0 };
float suhuC = 0.0;
bool  suhuTerbaca = false;
bool  adaAlarm = false;

unsigned long tBaca = 0, tKirim = 0, tLcd = 0, tAlarm = 0, tSambung = 0;
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
  lcd.print(mqtt.connected() ? statusTanah(tanahPersen[i]) : "Tanpa koneksi");
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
void sambungWifi() {
  if (WiFi.status() == WL_CONNECTED) return;
  Serial.println("Menyambung WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void sambungMqtt() {
  if (mqtt.connected() || WiFi.status() != WL_CONNECTED) return;

  char clientId[40];
  snprintf(clientId, sizeof(clientId), "agro-kebun-%llX", ESP.getEfuseMac());

  Serial.print("Menyambung broker MQTT... ");
  // Pesan Last Will: kalau alat mati mendadak (kabel dicabut, listrik padam),
  // broker sendiri yang mengirim pesan ini, dan keempat pot langsung tidur di
  // dashboard tanpa menunggu batas waktu dua menit.
  bool ok = mqtt.connect(
    clientId, MQTT_USERNAME, MQTT_PASSWORD,
    MQTT_TOPIC_STATUS, 1, true, "{\"status\":\"mati\"}"
  );

  if (ok) {
    Serial.println("berhasil.");
    mqtt.publish(MQTT_TOPIC_STATUS, "{\"status\":\"hidup\"}", true);
  } else {
    Serial.print("gagal, kode ");
    Serial.println(mqtt.state());
  }
}

void kirimData() {
  if (!mqtt.connected()) return;

  char suhuTeks[12];
  if (suhuTerbaca) snprintf(suhuTeks, sizeof(suhuTeks), "%.1f", suhuC);
  else             snprintf(suhuTeks, sizeof(suhuTeks), "null");

  char pesan[160];
  snprintf(pesan, sizeof(pesan),
    "{\"suhu\":%s,\"pot\":{\"a\":%.1f,\"b\":%.1f,\"c\":%.1f,\"d\":%.1f}}",
    suhuTeks, tanahPersen[0], tanahPersen[1], tanahPersen[2], tanahPersen[3]);

  if (mqtt.publish(MQTT_TOPIC_DATA, pesan, true)) {
    Serial.print("Terkirim: ");
    Serial.println(pesan);
  } else {
    Serial.println("Gagal mengirim (pesan terlalu panjang atau koneksi putus).");
  }
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

  // Sambungan tanpa pemeriksaan sertifikat broker. Isi paketnya hanya angka
  // kelembapan dan suhu, bukan data pribadi siswa. Kalau sekolah memakai WiFi
  // umum dan kamu ingin lebih aman, ganti dengan net.setCACert(...).
  net.setInsecure();
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
  mqtt.setBufferSize(512);

  bacaSemuaSensor();
  lcd.clear();
}

// ─── Loop ───────────────────────────────────────────────────────────────
void loop() {
  unsigned long sekarang = millis();

  if (sekarang - tSambung >= JEDA_SAMBUNG) {
    tSambung = sekarang;
    sambungWifi();
    sambungMqtt();
  }
  mqtt.loop();

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
