"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, Lock, Radio, Send } from "lucide-react";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { showSuccessAlert, showWarningAlert } from "@/lib/swal";
import { getStudentProfile, saveStudentProfile } from "@/lib/student-session";
import { DAILY_POTS, STARS_PER_POT, type DailyPot } from "@/lib/daily-missions";
import {
  checkCardReport, getPreviousPot,
  type BuzzerStatus, type CardReport, type InvestigationCard,
} from "@/lib/investigation-cards";

type Reports = Partial<Record<DailyPot, CardReport>>;

interface FormState {
  steps: boolean[];
  moisture: string;
  moistureAfter: string;
  temperature: string;
  buzzer: BuzzerStatus | "";
  answers: string[];
}

const toNumber = (value: string) => (value.trim() === "" ? NaN : Number(value.replace(",", ".")));

export function InvestigationCardView({ card }: { card: InvestigationCard }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [completed, setCompleted] = useState<DailyPot[]>([]);
  const [reports, setReports] = useState<Reports>({});
  const [form, setForm] = useState<FormState>({
    steps: card.steps.map(() => false),
    moisture: "",
    moistureAfter: "",
    temperature: "",
    buzzer: "",
    answers: card.questions.map(() => ""),
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const draftKey = useCallback(() => {
    const profile = getStudentProfile();
    return profile ? `agro_kartu_draft_${profile.id}_${card.pot}` : null;
  }, [card.pot]);

  const load = useCallback(async () => {
    const profile = getStudentProfile();
    if (!profile) return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/siswa/misi-harian?siswaId=${profile.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setCompleted(json.selesai);
      setReports(json.laporan);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
    try {
      const key = draftKey();
      const draft = key && localStorage.getItem(key);
      if (draft) setForm(JSON.parse(draft));
    } catch {
      // ignore
    }
  }, [load, draftKey]);

  // Draf menjaga jawaban panjang siswa kalau halaman ter-refresh di tengah percobaan.
  const updateForm = (changes: Partial<FormState>) => {
    const next = { ...form, ...changes };
    setForm(next);
    setErrors([]);
    try {
      const key = draftKey();
      if (key) localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const profile = getStudentProfile();
    if (!profile || submitting) return;

    const laporan = {
      steps: form.steps,
      moisture: toNumber(form.moisture),
      moistureAfter: toNumber(form.moistureAfter),
      temperature: toNumber(form.temperature),
      buzzer: form.buzzer,
      answers: form.answers,
    };
    const check = checkCardReport(card, laporan);
    if (check.errors.length > 0) {
      setErrors(check.errors);
      await showWarningAlert("Laporan Belum Lengkap", "Lengkapi dulu bagian yang ditandai ya!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/siswa/misi-harian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siswaId: profile.id, pot: card.pot, laporan }),
      });
      if (res.status === 409) {
        await load();
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      saveStudentProfile({ ...profile, stars: json.bintang });
      setCompleted((done) => [...done, card.pot]);
      setReports((all) => ({ ...all, [card.pot]: json.laporan }));
      const key = draftKey();
      if (key) localStorage.removeItem(key);
      await showSuccessAlert(
        `Kartu Investigasi #${card.number} Selesai! 🎉`,
        `Misi Pot Tanaman ${card.pot} di Beranda otomatis tercentang, +${STARS_PER_POT} Bintang!`,
        1800
      );
    } catch {
      await showWarningAlert("Belum Terkirim", "Periksa internetmu lalu tekan kirim sekali lagi ya!");
    } finally {
      setSubmitting(false);
    }
  };

  const isDone = completed.includes(card.pot);
  const isNext = DAILY_POTS[completed.length] === card.pot;
  const previousPot = getPreviousPot(card.pot);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Link href="/misi" className="btn-ghost text-xs gap-1.5 inline-flex items-center">
        <ArrowLeft className="h-4 w-4" />
        Semua Kartu Misi
      </Link>

      <header className="rounded-3xl p-4 sm:p-6 text-white shadow-card space-y-1.5" style={{ backgroundColor: card.color }}>
        <p className="font-heading font-extrabold text-[11px] sm:text-xs tracking-wider text-yellow-200">
          KARTU INVESTIGASI #{card.number} | {card.code}
        </p>
        <h2 className="font-heading font-extrabold text-lg sm:text-xl leading-snug">
          Misi Pot {card.pot}: {card.title}
        </h2>
        <p className="text-xs sm:text-sm italic text-white/90">Fokus Penyelidikan: {card.focus}</p>
      </header>

      <section className="card space-y-2.5">
        <h3 className="font-heading font-extrabold text-sm sm:text-base text-green-700">Sapaan & Tantangan Si Tunas</h3>
        <div className="flex items-start gap-3">
          <BibooMascot mood="happy" size="sm" animated={false} className="flex-shrink-0" />
          <p className="text-sm italic text-ink-900 leading-relaxed">“{card.greeting}”</p>
        </div>
      </section>

      <section className="card space-y-2.5">
        <h3 className="font-heading font-extrabold text-sm sm:text-base text-green-700">
          Spesifikasi Media & Parameter Target Sensor IoT
        </h3>
        <ul className="space-y-2">
          {card.specs.map((spec) => (
            <li key={spec.label} className="text-xs sm:text-sm text-ink-900 leading-relaxed">
              <strong>{spec.label}:</strong> {spec.value}
            </li>
          ))}
        </ul>
      </section>

      {status === "loading" && <p className="text-center text-sm text-ink-600 py-6">Memuat status misi...</p>}

      {status === "error" && (
        <div className="card text-center space-y-2">
          <p className="text-sm text-ink-600">Status misi belum bisa dimuat.</p>
          <button type="button" onClick={load} className="btn-ghost text-xs px-4 py-1.5">Coba Lagi</button>
        </div>
      )}

      {status === "ready" && !isDone && !isNext && previousPot && (
        <section className="card text-center space-y-2.5">
          <Lock className="w-6 h-6 text-ink-600 mx-auto" />
          <p className="text-sm font-bold text-ink-900">Kartu ini masih terkunci</p>
          <p className="text-xs text-ink-600">Selesaikan dulu Kartu Pot {previousPot} ya!</p>
          <Link href={`/misi/pot/${previousPot.toLowerCase()}`} className="btn-primary text-xs h-10 px-5 inline-flex items-center justify-center">
            Buka Kartu Pot {previousPot}
          </Link>
        </section>
      )}

      {status === "ready" && isDone && reports[card.pot] && (
        <CompletedReport card={card} report={reports[card.pot] as CardReport} reports={reports} />
      )}

      {status === "ready" && isNext && (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <section className="card space-y-2.5">
            <h3 className="font-heading font-extrabold text-sm sm:text-base text-green-700">Langkah Kerja Eksperimen & Investigasi IoT</h3>
            <p className="text-xs text-ink-600">Centang setiap langkah setelah kamu mengerjakannya.</p>
            {card.steps.map((step, index) => (
              <label
                key={step.title}
                className={`flex items-start gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                  form.steps[index] ? "border-green-400 bg-green-100/60" : "border-green-200 bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.steps[index]}
                  onChange={(e) => updateForm({ steps: form.steps.map((done, i) => (i === index ? e.target.checked : done)) })}
                  className="mt-0.5 w-5 h-5 flex-shrink-0 accent-green-600"
                />
                <span className="text-xs sm:text-sm text-ink-900 leading-relaxed">
                  <strong>{index + 1}. {step.title}:</strong> {step.detail}
                </span>
              </label>
            ))}
          </section>

          <section className="card space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-green-700">Catat Data Sensor</h3>
              <Link href="/lab-iot" className="text-xs font-heading font-bold text-green-700 hover:underline flex-shrink-0">
                Buka Lab IoT →
              </Link>
            </div>
            <p className="text-xs text-ink-600">
              Tulis angka asli yang terbaca sensor. Angka acuan di kartu hanya panduan, tidak harus sama persis.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberField
                id="moisture"
                label={card.wateringTest ? "Kelembapan sebelum disiram (%)" : "Kelembapan tanah (%)"}
                value={form.moisture}
                onChange={(moisture) => updateForm({ moisture })}
              />
              {card.wateringTest && (
                <NumberField
                  id="moisture-after"
                  label="Kelembapan setelah disiram (%)"
                  value={form.moistureAfter}
                  onChange={(moistureAfter) => updateForm({ moistureAfter })}
                />
              )}
              <NumberField
                id="temperature"
                label="Suhu udara (°C)"
                value={form.temperature}
                onChange={(temperature) => updateForm({ temperature })}
              />
            </div>
            <fieldset>
              <legend className="block text-xs font-heading font-bold text-ink-600 mb-1">
                Status Buzzer D8{card.wateringTest ? " (sebelum disiram)" : ""}
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {(["berbunyi", "tenang"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={form.buzzer === option}
                    onClick={() => updateForm({ buzzer: option })}
                    className={`h-11 rounded-2xl border-2 text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
                      form.buzzer === option ? "border-green-500 bg-green-100 text-green-800" : "border-green-200 bg-white text-ink-900"
                    }`}
                  >
                    {option === "berbunyi" ? "Berbunyi" : "Tenang"}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>

          {card.pot === "D" && <ComparisonTable reports={reports} />}

          <section className="card space-y-3">
            <h3 className="font-heading font-extrabold text-sm sm:text-base text-green-700">Pertanyaan Diskusi & Refleksi Kritis (HOTS)</h3>
            {card.questions.map((question, index) => (
              <div key={question.title}>
                <label htmlFor={`answer-${index}`} className="block text-xs sm:text-sm text-ink-900 leading-relaxed mb-1.5">
                  <strong>{index + 1}. {question.title}:</strong> {question.text}
                </label>
                <textarea
                  id={`answer-${index}`}
                  rows={3}
                  value={form.answers[index]}
                  onChange={(e) => updateForm({ answers: form.answers.map((a, i) => (i === index ? e.target.value : a)) })}
                  placeholder="Tulis jawabanmu di sini..."
                  className="input-field h-auto py-3 leading-relaxed text-sm"
                />
              </div>
            ))}
          </section>

          <SuccessIndicator card={card} />

          {errors.length > 0 && (
            <ul role="alert" className="rounded-2xl border-2 border-red-200 bg-[#FEECEB] p-3.5 space-y-1 text-xs sm:text-sm font-bold text-red-500">
              {errors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full text-sm h-12 inline-flex items-center justify-center gap-2 cursor-pointer">
            <Send className="w-4 h-4" />
            {submitting ? "Mengirim..." : "Kirim ke Guru (AGRO EDU TRACK)"}
          </button>
        </form>
      )}
    </div>
  );
}

function NumberField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-heading font-bold text-ink-600 mb-1">{label}</label>
      <input id={id} type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
    </div>
  );
}

function SuccessIndicator({ card }: { card: InvestigationCard }) {
  return (
    <section className="card space-y-2">
      <h3 className="font-heading font-extrabold text-sm sm:text-base text-green-700">Indikator Keberhasilan</h3>
      <p className="text-xs sm:text-sm text-ink-900 leading-relaxed">{card.successIndicator}</p>
    </section>
  );
}

function CompletedReport({ card, report, reports }: { card: InvestigationCard; report: CardReport; reports: Reports }) {
  const nextPot = DAILY_POTS[DAILY_POTS.indexOf(card.pot) + 1];
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border-2 border-green-300 bg-green-100/70 p-4 flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
        <p className="text-sm font-bold text-green-800">
          Kartu selesai! Misi Pot Tanaman {card.pot} di Beranda sudah tercentang.
        </p>
      </section>

      <section className="card space-y-2">
        <h3 className="font-heading font-extrabold text-sm sm:text-base text-green-700 flex items-center gap-1.5">
          <Radio className="w-4 h-4" /> Laporanmu
        </h3>
        <ul className="text-xs sm:text-sm text-ink-900 space-y-1">
          <li>Kelembapan tanah: <strong>{report.moisture}%</strong></li>
          {report.moistureAfter !== undefined && <li>Setelah disiram: <strong>{report.moistureAfter}%</strong></li>}
          <li>Suhu udara: <strong>{report.temperature}°C</strong></li>
          <li>Buzzer D8: <strong>{report.buzzer === "berbunyi" ? "Berbunyi" : "Tenang"}</strong></li>
        </ul>
        {card.questions.map((question, index) => (
          <div key={question.title} className="pt-1">
            <p className="text-xs font-bold text-ink-600">{question.title}</p>
            <p className="text-xs sm:text-sm text-ink-900 leading-relaxed whitespace-pre-wrap">{report.answers[index]}</p>
          </div>
        ))}
      </section>

      {card.pot === "D" && <ComparisonTable reports={reports} />}
      <SuccessIndicator card={card} />

      {nextPot && (
        <Link href={`/misi/pot/${nextPot.toLowerCase()}`} className="btn-primary w-full text-sm h-12 inline-flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          Lanjut ke Kartu Pot {nextPot}
        </Link>
      )}
    </div>
  );
}

function ComparisonTable({ reports }: { reports: Reports }) {
  return (
    <section className="card space-y-2">
      <h3 className="font-heading font-extrabold text-sm sm:text-base text-green-700">Tabel Perbandingan 4 Pot</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-ink-900">
          <thead>
            <tr className="text-left text-ink-600">
              <th className="py-1.5 pr-3">Pot</th>
              <th className="py-1.5 pr-3">Kelembapan</th>
              <th className="py-1.5 pr-3">Setelah Siram</th>
              <th className="py-1.5 pr-3">Suhu</th>
              <th className="py-1.5">Buzzer</th>
            </tr>
          </thead>
          <tbody>
            {DAILY_POTS.map((pot) => {
              const report = reports[pot];
              return (
                <tr key={pot} className="border-t border-green-200">
                  <td className="py-1.5 pr-3 font-bold">Pot {pot}</td>
                  <td className="py-1.5 pr-3">{report ? `${report.moisture}%` : "-"}</td>
                  <td className="py-1.5 pr-3">{report?.moistureAfter !== undefined ? `${report.moistureAfter}%` : "-"}</td>
                  <td className="py-1.5 pr-3">{report ? `${report.temperature}°C` : "-"}</td>
                  <td className="py-1.5">{report ? (report.buzzer === "berbunyi" ? "Berbunyi" : "Tenang") : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
