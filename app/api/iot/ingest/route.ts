import { NextResponse } from "next/server";

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

    const { deviceId, readings, firmwareVersion, measuredAt } = body;
    const receivedAt = new Date().toISOString();

    // Validasi format tiap reading
    const processedReadings = readings.map((r: any) => ({
      sensorType: r.sensorType,
      value: typeof r.value === "number" ? r.value : parseFloat(r.value),
      unit: r.unit || "",
      valid: r.valid !== false,
      measuredAt: r.measuredAt || measuredAt || receivedAt,
      receivedAt,
    }));

    return NextResponse.json({
      success: true,
      deviceId,
      receivedAt,
      firmwareVersion: firmwareVersion || "unknown",
      readingsProcessed: processedReadings.length,
      status: "acknowledged",
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
  return NextResponse.json({
    status: "online",
    service: "AGRO EDU BOX IoT Telemetry Ingest API",
    version: "1.0.0",
    docs: "Kirim data menggunakan HTTP POST dengan JSON payload { deviceId, readings: [...] }",
  });
}
