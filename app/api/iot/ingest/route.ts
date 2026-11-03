import { NextResponse } from "next/server";
import { ingestTelemetryData, getStore } from "@/lib/iot-store";

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

    const result = ingestTelemetryData({
      deviceId: String(body.deviceId),
      firmwareVersion: body.firmwareVersion,
      measuredAt: body.measuredAt,
      readings: body.readings,
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
    registeredDevices: store.devices.map((d) => ({
      id: d.id,
      name: d.name,
      status: d.status,
      lastDataAt: d.lastDataAt,
      sensorCount: d.sensors.length,
    })),
    docs: {
      method: "POST",
      endpoint: "/api/iot/ingest",
      headers: { "Content-Type": "application/json" },
      examplePayload: {
        deviceId: "device-1",
        readings: [
          { sensorType: "soil_moisture", value: 45.0, unit: "%" },
          { sensorType: "air_temp", value: 28.5, unit: "°C" },
          { sensorType: "air_humidity", value: 62.0, unit: "%" },
        ],
      },
    },
  });
}
