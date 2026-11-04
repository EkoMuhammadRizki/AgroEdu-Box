import { BibooMascot } from "@/components/agro/biboo-mascot";
import type { MoodTone, PotMood } from "@/lib/pot-mood";

const TONE_STYLE: Record<MoodTone, string> = {
  ok: "bg-green-100 text-green-700 border-green-300",
  warn: "bg-yellow-300/50 text-brown-600 border-yellow-400",
  bad: "bg-[#FEECEB] text-red-500 border-red-200",
  off: "bg-[#EAEFE6] text-ink-600 border-ink-300/40",
};

interface PotMoodCardProps {
  title: string;
  emoji: string;
  value: number;
  unit: string;
  mood: PotMood;
  /** Tiga emoji: kurang, pas, berlebih. */
  scale: [string, string, string];
  character: "original" | "girl";
}

/** Si Tunas bereaksi pada angka sensor: senang, sedih, kepanasan, atau tidur. */
export function PotMoodCard({ title, emoji, value, unit, mood, scale, character }: PotMoodCardProps) {
  const active = mood.tone !== "off";
  return (
    <article className="card-cream p-4 sm:p-5 text-center space-y-2.5" data-mood={mood.mood}>
      <h3 className="font-heading font-extrabold text-sm sm:text-base text-ink-900">
        {emoji} {title}
      </h3>

      <BibooMascot
        mood={mood.mood}
        size="xl"
        character={character}
        bubbleText={mood.say}
        animated={mood.mood !== "sleepy"}
        className="mx-auto"
      />

      <p className="font-heading font-extrabold text-4xl sm:text-5xl text-ink-900 tabular-nums leading-none">
        {Number(value.toFixed(1))}
        <span className="text-xl sm:text-2xl text-ink-600">{unit}</span>
      </p>

      <span className={`inline-flex items-center px-3 py-1 rounded-pill border-2 text-xs sm:text-sm font-heading font-extrabold ${TONE_STYLE[mood.tone]}`}>
        {mood.label}
      </span>

      <p className="text-xs sm:text-sm text-ink-600 leading-relaxed max-w-xs mx-auto">{mood.hint}</p>

      <div className="flex justify-center gap-4 pt-1" role="img" aria-label={`Skala ${title}: ${mood.label}`}>
        {scale.map((face, index) => (
          <span
            key={face}
            className={`text-2xl sm:text-3xl transition-all duration-300 ${
              active && index === mood.step ? "scale-125 opacity-100" : "opacity-25 grayscale"
            }`}
          >
            {face}
          </span>
        ))}
      </div>
    </article>
  );
}
