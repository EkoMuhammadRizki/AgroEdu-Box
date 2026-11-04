import { getInvestigationCard } from "@/lib/investigation-cards";
import { formatTimestamp } from "@/lib/iot";
import type { GuruLaporan } from "@/lib/guru-data";

export function GuruReportDetail({ item }: { item: GuruLaporan }) {
  const card = getInvestigationCard(item.pot);
  if (!card) return null;
  const { laporan } = item;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-ink">Kartu #{card.number}: Misi Pot {card.pot}</h3>
        <p className="text-xs text-ink-muted mt-0.5">
          Dikirim oleh {item.pengirim ?? "-"} · {formatTimestamp(item.selesaiAt)}
        </p>
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-surface-muted">
          <dt className="text-ink-muted">Kelembapan</dt>
          <dd className="font-bold text-ink mt-0.5">{laporan.moisture}%</dd>
        </div>
        {laporan.moistureAfter !== undefined && (
          <div className="p-2.5 rounded-xl bg-surface-muted">
            <dt className="text-ink-muted">Setelah Disiram</dt>
            <dd className="font-bold text-ink mt-0.5">{laporan.moistureAfter}%</dd>
          </div>
        )}
        <div className="p-2.5 rounded-xl bg-surface-muted">
          <dt className="text-ink-muted">Suhu Udara</dt>
          <dd className="font-bold text-ink mt-0.5">{laporan.temperature}°C</dd>
        </div>
        <div className="p-2.5 rounded-xl bg-surface-muted">
          <dt className="text-ink-muted">Buzzer D8</dt>
          <dd className="font-bold text-ink mt-0.5">{laporan.buzzer === "berbunyi" ? "Berbunyi" : "Tenang"}</dd>
        </div>
      </dl>

      {card.questions.map((question, index) => (
        <div key={question.title} className="space-y-1">
          <p className="text-xs font-bold text-ink">{question.title}</p>
          <p className="text-xs text-ink-muted leading-relaxed">{question.text}</p>
          <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap p-2.5 rounded-xl bg-surface-muted">
            {laporan.answers[index]}
          </p>
        </div>
      ))}

      {item.nilai !== null && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-ink">
          <p className="font-bold">Nilai guru: {item.nilai}</p>
          {item.umpanBalik && <p className="mt-1 leading-relaxed whitespace-pre-wrap">{item.umpanBalik}</p>}
        </div>
      )}
    </div>
  );
}
