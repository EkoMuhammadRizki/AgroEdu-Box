import { DAILY_POTS, type DailyPot } from "@/lib/daily-missions";

export function GuruDataState({ failed, reload }: { failed: boolean; reload: () => void }) {
  if (!failed) return <p className="text-sm text-ink-muted text-center py-10">Memuat data kelas...</p>;
  return (
    <div className="card text-center space-y-2">
      <p className="text-sm text-ink-muted">Data belum bisa dimuat.</p>
      <button type="button" onClick={reload} className="btn-secondary text-xs">Coba Lagi</button>
    </div>
  );
}

/** Empat lingkaran A-D: hijau untuk kartu yang sudah dilaporkan kelompok. */
export function PotProgress({ selesai }: { selesai: DailyPot[] }) {
  return (
    <span className="inline-flex gap-1" aria-label={`${selesai.length} dari ${DAILY_POTS.length} kartu selesai`}>
      {DAILY_POTS.map((pot) => (
        <span
          key={pot}
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            selesai.includes(pot) ? "bg-emerald-600 text-white" : "bg-surface-muted text-ink-muted border border-line"
          }`}
        >
          {pot}
        </span>
      ))}
    </span>
  );
}
