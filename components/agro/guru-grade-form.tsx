"use client";
import { useState } from "react";
import { Save } from "lucide-react";
import { showToast, showWarningAlert } from "@/lib/swal";
import { sendGuruChange } from "@/lib/use-guru-data";
import type { GuruLaporan } from "@/lib/guru-data";

export function GuruGradeForm({ item, onSaved }: { item: GuruLaporan; onSaved: () => Promise<void> }) {
  const [nilai, setNilai] = useState(item.nilai?.toString() ?? "");
  const [umpanBalik, setUmpanBalik] = useState(item.umpanBalik ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const error = await sendGuruChange("/api/guru/penilaian", "POST", {
      kelompokId: item.kelompokId,
      pot: item.pot,
      nilai: nilai.trim() === "" ? null : Number(nilai),
      umpanBalik,
    });
    if (error) {
      await showWarningAlert("Nilai Belum Tersimpan", error);
    } else {
      showToast("Nilai terkirim ke kelompok siswa", "success", 1600);
      await onSaved();
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 pt-3 border-t border-line">
      <h3 className="text-sm font-bold text-ink">Penilaian Guru</h3>
      <div>
        <label htmlFor="nilai" className="text-xs font-semibold text-ink block mb-1">Nilai (0–100)</label>
        <input
          id="nilai"
          type="text"
          inputMode="numeric"
          value={nilai}
          onChange={(e) => setNilai(e.target.value)}
          className="input-field text-sm max-w-32"
        />
      </div>
      <div>
        <label htmlFor="umpan-balik" className="text-xs font-semibold text-ink block mb-1">Umpan Balik untuk Kelompok</label>
        <textarea
          id="umpan-balik"
          rows={3}
          value={umpanBalik}
          onChange={(e) => setUmpanBalik(e.target.value)}
          placeholder="Tulis apresiasi atau saran untuk kelompok ini..."
          className="input-field h-auto py-2.5 leading-relaxed text-sm"
        />
      </div>
      <button type="submit" disabled={saving} className="btn-primary text-xs gap-1.5 inline-flex items-center">
        <Save className="h-3.5 w-3.5" />
        {saving ? "Menyimpan..." : item.nilai === null ? "Simpan Nilai" : "Perbarui Nilai"}
      </button>
    </form>
  );
}
