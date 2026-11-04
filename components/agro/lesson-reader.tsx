"use client";
import type { SyntheticEvent } from "react";
import { Play } from "lucide-react";
import type { LessonSection } from "@/lib/types";

export function LessonReader({ lessons }: { lessons: LessonSection[] }) {
  // Satu suara saja: memutar video lain menghentikan yang sedang berjalan.
  const pauseOtherVideos = (event: SyntheticEvent<HTMLVideoElement>) => {
    document.querySelectorAll("video").forEach((video) => {
      if (video !== event.currentTarget) video.pause();
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {lessons.map((lesson) => (
        <section key={lesson.heading} className="space-y-3">
          {lesson.video && (
            <figure className="space-y-2">
              <figcaption className="flex items-center gap-1.5 font-heading font-extrabold text-xs sm:text-sm text-blue-500">
                <Play className="w-3.5 h-3.5 fill-blue-500 flex-shrink-0" />
                Video Animasi: {lesson.video.title}
              </figcaption>
              {/* preload none: video baru diunduh saat siswa menekan play, agar hemat kuota. */}
              <video
                src={lesson.video.src}
                poster={lesson.video.poster}
                controls
                playsInline
                preload="none"
                onPlay={pauseOtherVideos}
                className="w-full aspect-video rounded-2xl sm:rounded-3xl bg-ink-900 border-4 border-white shadow-card"
              />
            </figure>
          )}

          <div className="card space-y-2.5">
            {lesson.label && (
              <span className="inline-block text-[11px] font-heading font-extrabold uppercase tracking-wider text-green-700 bg-green-100 rounded-pill px-2.5 py-0.5 border border-green-300">
                {lesson.label}
              </span>
            )}
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-green-700 leading-snug">
              {lesson.heading}
            </h2>
            {lesson.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm sm:text-base text-ink-900 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      <p className="text-center text-xs sm:text-sm italic text-ink-600 pt-1">
        Agro Edu Box: Selamat Belajar dan Menjadi Petani Muda Hebat! 🌟
      </p>
    </div>
  );
}
