import { NextResponse } from "next/server";
import { getStore } from "@/lib/iot-store";
import { toLiveDevice } from "@/lib/iot";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");
    const sensorId = searchParams.get("sensorId");
    const store = getStore();

    if (deviceId) {
      const device = store.devices.find((d) => d.id === deviceId);
      if (!device) {
        return NextResponse.json({ success: false, error: "Perangkat tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        device: toLiveDevice(device),
        history: store.history,
      });
    }

    if (sensorId) {
      return NextResponse.json({
        success: true,
        history: store.history[sensorId] || [],
      });
    }

    return NextResponse.json({
      success: true,
      devices: store.devices.map((device) => toLiveDevice(device)),
      history: store.history,
      lastIngestTime: store.lastIngestTime,
      totalPacketsReceived: store.totalPacketsReceived,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to retrieve IoT data" },
      { status: 500 }
    );
  }
}

