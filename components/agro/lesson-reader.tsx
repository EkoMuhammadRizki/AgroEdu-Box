"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import type { LessonSection } from "@/lib/types";

function YoutubeVideo({
  video,
  active,
  onPlay,
}: {
  video: NonNullable<LessonSection["video"]>;
  active: boolean;
  onPlay: () => void;
}) {
  return (
    <figure className="space-y-2">
      <figcaption className="flex items-center gap-1.5 font-heading font-extrabold text-xs sm:text-sm text-blue-500">
        <Play className="w-3.5 h-3.5 fill-blue-500 flex-shrink-0" />
        Video Animasi: {video.title}
      </figcaption>
      <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl bg-ink-900 border-4 border-white shadow-card overflow-hidden">
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          // Gambar sampul dulu; pemutar YouTube baru dimuat saat ditekan, agar hemat kuota.
          <button
            type="button"
            onClick={onPlay}
            aria-label={`Putar video ${video.title}`}
            className="group absolute inset-0 w-full h-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={video.poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <span className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/95 shadow-lg group-hover:scale-105 transition-transform">
                <Play className="h-7 w-7 sm:h-9 sm:w-9 fill-green-600 text-green-600 ml-1" />
              </span>
            </span>
          </button>
        )}
      </div>
    </figure>
  );
}

export function LessonReader({ lessons }: { lessons: LessonSection[] }) {
  // Satu suara saja: memutar video lain mengganti video yang sedang berjalan.
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {lessons.map((lesson) => (
        <section key={lesson.heading} className="space-y-3">
          {lesson.video && (
            <YoutubeVideo
              video={lesson.video}
              active={activeVideo === lesson.video.youtubeId}
              onPlay={() => setActiveVideo(lesson.video!.youtubeId)}
            />
          )}

          <div className="card space-y-3">
            {lesson.label && (
              <span className="inline-block text-[11px] font-heading font-extrabold uppercase tracking-wider text-green-700 bg-green-100 rounded-pill px-2.5 py-0.5 border border-green-300">
                {lesson.label}
              </span>
            )}
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-green-700 leading-snug">
              {lesson.heading}
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lesson.image.src}
              alt={lesson.image.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-2xl border-2 border-green-200 bg-white"
            />
          </div>
        </section>
      ))}

      <p className="text-center text-xs sm:text-sm italic text-ink-600 pt-1">
        Agro Edu Box: Selamat Belajar dan Menjadi Petani Muda Hebat! 🌟
      </p>
    </div>
  );
}
