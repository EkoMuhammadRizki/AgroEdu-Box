"use client";
import { useCallback, useEffect, useState } from "react";
import type { GuruData } from "./guru-data";

export function useGuruData() {
  const [data, setData] = useState<GuruData | null>(null);
  const [failed, setFailed] = useState(false);

  const reload = useCallback(async () => {
    setFailed(false);
    try {
      const res = await fetch("/api/guru/data");
      if (res.status === 401) {
        window.location.assign("/guru/login");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, failed, reload };
}

/** Mengirim perubahan ke API guru. Mengembalikan pesan error, atau null bila berhasil. */
export async function sendGuruChange(url: string, method: "POST" | "DELETE", body?: unknown) {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status === 401) {
      window.location.assign("/guru/login");
      return "Sesi guru berakhir.";
    }
    if (res.ok) return null;
    return (await res.json()).error ?? "Perubahan belum tersimpan.";
  } catch {
    return "Perubahan belum tersimpan. Periksa koneksi lalu coba lagi.";
  }
}
