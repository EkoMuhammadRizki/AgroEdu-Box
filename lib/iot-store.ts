// lib/iot-store.ts
import { Device, SensorReading, SensorHistoryPoint, IotStatus } from "./types";
import { POT_DEVICES, mockDevices, mockSensorHistory } from "./mock-data";

interface IotStoreState {
  devices: Device[];
  history: Record<string, SensorHistoryPoint[]>;
  lastIngestTime?: string;
  totalPacketsReceived: number;
}

// Global in-memory storage to survive hot reloads and serverless invocations within the instance
const globalRef = globalThis as unknown as { __agroIotStore?: IotStoreState };

function getInitialStore(): IotStoreState {
  return {
    devices: JSON.parse(JSON.stringify(mockDevices)),
    history: JSON.parse(JSON.stringify(mockSensorHistory)),
    totalPacketsReceived: 0,
  };
}

export function getStore(): IotStoreState {
  if (!globalRef.__agroIotStore) {
    globalRef.__agroIotStore = getInitialStore();
  }
  return globalRef.__agroIotStore;
}

/** Menerima "pot-a", "Pot A", "POT_A", atau "a". Mengembalikan null bila bukan salah satu dari empat pot. */
export function resolvePotId(raw: string): string | null {
  const key = raw.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/^pot/, "");
  return POT_DEVICES.find((pot) => pot.id === `pot-${key}`)?.id ?? null;
}

export interface IngestReadingInput {
  sensorType: "soil_moisture" | "air_temp" | string;
  value: number;
  unit?: string;
  sensorId?: string;
  valid?: boolean;
}

export interface IngestPayload {
  deviceId: string;
  firmwareVersion?: string;
  measuredAt?: string;
  readings: IngestReadingInput[];
}

export function ingestTelemetryData(payload: IngestPayload) {
  const store = getStore();
  const nowIso = new Date().toISOString();
  const timeLabel = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const targetDevice = store.devices.find((d) => d.id === payload.deviceId);
  if (!targetDevice) throw new Error(`Perangkat ${payload.deviceId} tidak dikenal`);

  targetDevice.status = "online";
  targetDevice.lastDataAt = nowIso;
  store.lastIngestTime = nowIso;
  store.totalPacketsReceived += 1;

  for (const item of payload.readings) {
    const val = typeof item.value === "number" ? item.value : parseFloat(String(item.value));
    const sType = item.sensorType as SensorReading["sensorType"];
    const sensorId = item.sensorId || `${payload.deviceId}-${sType}`;

    // Update or add sensor in device
    let existingSensor = targetDevice.sensors.find((s) => s.sensorType === sType || s.sensorId === sensorId);
    if (existingSensor) {
      existingSensor.value = val;
      existingSensor.unit = item.unit || existingSensor.unit;
      existingSensor.measuredAt = payload.measuredAt || nowIso;
      existingSensor.receivedAt = nowIso;
      existingSensor.valid = item.valid !== false;
      existingSensor.connectionStatus = "online";
    } else {
      existingSensor = {
        deviceId: payload.deviceId,
        sensorId,
        sensorType: sType,
        value: val,
        unit: item.unit || (sType === "soil_moisture" ? "%" : "°C"),
        measuredAt: payload.measuredAt || nowIso,
        receivedAt: nowIso,
        valid: item.valid !== false,
        connectionStatus: "online",
      };
      targetDevice.sensors.push(existingSensor);
    }

    // Update history for graphs
    const historyKey = existingSensor.sensorId;
    if (!store.history[historyKey]) {
      store.history[historyKey] = [];
    }
    store.history[historyKey].push({
      time: timeLabel,
      value: val,
    });

    // Keep history at reasonable length (last 48 points)
    if (store.history[historyKey].length > 48) {
      store.history[historyKey] = store.history[historyKey].slice(-48);
    }
  }

  return {
    success: true,
    deviceId: payload.deviceId,
    readingsProcessed: payload.readings.length,
    receivedAt: nowIso,
  };
}

