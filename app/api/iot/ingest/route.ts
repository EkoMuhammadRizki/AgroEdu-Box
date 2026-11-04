import { NextResponse } from "next/server";
import { ingestTelemetryData, getStore, resolvePotId } from "@/lib/iot-store";
import { toLiveDevice } from "@/lib/iot";

const SUPPORTED_SENSORS = ["soil_moisture", "air_temp"];

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Format body bukan JSON yang valid.",
        },
        { status: 400 }
      );
    }

    // Validasi minimum payload
    if (!body || !body.deviceId || !Array.isArray(body.readings)) {
      return NextResponse.json(
        {
          success: false,
          error: "Payload tidak valid. Membutuhkan 'deviceId' dan array 'readings'.",
        },
        { status: 400 }
      );
    }

    const deviceId = resolvePotId(String(body.deviceId));
    if (!deviceId) {
      return NextResponse.json(
        { success: false, error: "deviceId tidak dikenal. Gunakan pot-a, pot-b, pot-c, atau pot-d." },
        { status: 400 }
      );
    }

    // Angka yang bukan angka tidak boleh masuk, supaya siswa tidak melihat "NaN".
    const readings = body.readings
      .map((item: any) => ({ ...item, value: Number(item?.value) }))
      .filter((item: any) => SUPPORTED_SENSORS.includes(item.sensorType) && Number.isFinite(item.value));
    if (readings.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tidak ada pembacaan valid. Gunakan sensorType soil_moisture atau air_temp dengan value berupa angka." },
        { status: 400 }
      );
    }

    const result = ingestTelemetryData({
      deviceId,
      firmwareVersion: body.firmwareVersion,
      measuredAt: body.measuredAt,
      readings,
    });

    return NextResponse.json({
      success: true,
      deviceId: result.deviceId,
      receivedAt: result.receivedAt,
      readingsProcessed: result.readingsProcessed,
      status: "recorded",
      message: "Data sensor Arduino berhasil dicatat ke sistem telemetri.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memproses telemetri: " + (error?.message || "Internal server error"),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    status: "online",
    service: "AGRO EDU BOX IoT Telemetry Ingest API",
    version: "1.1.0",
    lastIngestTime: store.lastIngestTime || "Belum ada pengiriman sejak server restart",
    totalPacketsReceived: store.totalPacketsReceived,
    registeredDevices: store.devices.map((device) => toLiveDevice(device)).map((d) => ({
      id: d.id,
      name: d.name,
      status: d.status,
      lastDataAt: d.lastDataAt || null,
      sensorCount: d.sensors.length,
    })),
    docs: {
      method: "POST",
      endpoint: "/api/iot/ingest",
      headers: { "Content-Type": "application/json" },
      examplePayload: {
        deviceId: "pot-a",
        readings: [
          { sensorType: "soil_moisture", value: 45.0, unit: "%" },
          { sensorType: "air_temp", value: 28.5, unit: "°C" },
        ],
      },
    },
  });
}
