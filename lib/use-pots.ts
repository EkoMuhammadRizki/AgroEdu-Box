"use client";
import { useEffect, useState } from "react";
import { mockDevices } from "./mock-data";
import type { Device } from "./types";

/**
 * Status empat pot, diperbarui berkala. Selama data belum tiba, atau server tidak
 * terjangkau, semua pot dianggap belum menyala (angka 0).
 */
export function usePots(intervalMs = 5000) {
  const [devices, setDevices] = useState<Device[]>(mockDevices);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/iot/data");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (active && Array.isArray(json.devices) && json.devices.length > 0) setDevices(json.devices);
      } catch {
        if (active) setDevices(mockDevices);
      }
    };
    load();
    const timer = setInterval(load, intervalMs);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [intervalMs]);

  return devices;
}
