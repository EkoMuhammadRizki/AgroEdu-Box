"use client";
import React from "react";

export type BibooMood =
  | "happy" | "wave" | "thinking" | "trophy" | "celebrating" | "watering"
  | "sad" | "sleepy" | "hot" | "cold" | "soggy";

interface BibooMascotProps {
  mood?: BibooMood;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  character?: "original" | "girl";
  bubbleText?: string;
  className?: string;
  animated?: boolean;
}

export function BibooMascot({
  mood = "happy",
  size = "md",
  character = "original",
  bubbleText,
  className = "",
  animated = true,
}: BibooMascotProps) {
  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-44 h-44",
    "2xl": "w-60 h-60",
  };

  const isGirl = character === "girl";
  // Nama warna harus unik per maskot: bila ada maskot lain yang tersembunyi di halaman
  // (misalnya sidebar desktop), warna yang dipakai bisa hilang dan badan jadi pucat.
  const uid = React.useId().replace(/:/g, "");
  // Sedih dan kedinginan: daun layu terkulai. Tidur: daun miring sedikit.
  const wilted = mood === "sad" || mood === "cold";
  const leafTilt = wilted ? 72 : mood === "sleepy" ? 28 : 0;
  const leafFill = `url(#${uid}-${wilted ? "bibooLeafWilt" : "bibooLeaf"})`;
  const leafStroke = wilted ? "#9A8A3A" : "#3F9B2E";
  const cheekFill = `url(#${uid}-${mood === "cold" ? "blushCold" : "blush"})`;
  const bodyTint = mood === "hot" ? "#FF6B4A" : mood === "cold" ? "#6EC6F5" : null;

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble if provided */}
      {bubbleText && (
        <div className="relative mb-2 max-w-xs px-4 py-2 bg-white text-ink-900 rounded-2xl shadow-card border-2 border-green-200 text-xs md:text-sm font-heading font-bold animate-pulse text-center">
          {bubbleText}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-green-200 transform rotate-45" />
        </div>
      )}

      {/* SVG Cartoon BiBoo */}
      <div className={`${sizeMap[size]} ${animated ? "animate-biboo" : ""} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Body Gradient */}
            <linearGradient id={`${uid}-bibooBody`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8FD16A" />
              <stop offset="50%" stopColor="#6CC04A" />
              <stop offset="100%" stopColor="#3F9B2E" />
            </linearGradient>

            {/* Leaf Gradient */}
            <linearGradient id={`${uid}-bibooLeaf`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A8E27A" />
              <stop offset="100%" stopColor="#55B033" />
            </linearGradient>

            {/* Daun layu */}
            <linearGradient id={`${uid}-bibooLeafWilt`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D9D07A" />
              <stop offset="100%" stopColor="#B59A3A" />
            </linearGradient>

            {/* Pipi kedinginan */}
            <radialGradient id={`${uid}-blushCold`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8FD3F7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8FD3F7" stopOpacity="0" />
            </radialGradient>

            {/* Cheek Glow */}
            <radialGradient id={`${uid}-blush`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFAAA0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFAAA0" stopOpacity="0" />
            </radialGradient>

            {/* Eye Highlight */}
            <radialGradient id={`${uid}-eyeHighlight`} cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#2F3B1F" />
            </radialGradient>

            {/* Gold Trophy Gradient */}
            <linearGradient id={`${uid}-goldTrophy`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE27A" />
              <stop offset="50%" stopColor="#FFB81C" />
              <stop offset="100%" stopColor="#E69500" />
            </linearGradient>
          </defs>

          {/* Shadow underneath */}
          <ellipse cx="100" cy="186" rx="55" ry="10" fill="#2F3B1F" opacity="0.12" />

          {/* ── Sprout Leaves on Head ── */}
          <g className="animate-leaf">
            <g transform={leafTilt ? `rotate(${-leafTilt} 100 55)` : undefined}>
            {/* Left Leaf */}
            <path
              d="M 100 55 C 75 35, 55 45, 62 18 C 82 20, 95 38, 100 55 Z"
              fill={leafFill}
              stroke={leafStroke}
              strokeWidth="2.5"
            />
            {/* Left Leaf Center Vein */}
            <path d="M 100 55 C 85 40, 72 32, 65 24" stroke="#8FD16A" strokeWidth="1.5" fill="none" />
            </g>

            <g transform={leafTilt ? `rotate(${leafTilt} 100 55)` : undefined}>
            {/* Right Leaf */}
            <path
              d="M 100 55 C 125 35, 145 45, 138 18 C 118 20, 105 38, 100 55 Z"
              fill={leafFill}
              stroke={leafStroke}
              strokeWidth="2.5"
            />
            {/* Right Leaf Center Vein */}
            <path d="M 100 55 C 115 40, 128 32, 135 24" stroke="#8FD16A" strokeWidth="1.5" fill="none" />
            </g>

            {/* Sprout Stem */}
            <path
              d="M 100 50 Q 100 62 100 70"
              stroke="#3F9B2E"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>

          {/* Girl Character: Cute Flower or Pink Bow on Head */}
          {isGirl && (
            <g transform="translate(112, 45) scale(0.9)">
              <circle cx="-6" cy="0" r="5" fill="#FF85A2" />
              <circle cx="6" cy="0" r="5" fill="#FF85A2" />
              <circle cx="0" cy="-6" r="5" fill="#FF85A2" />
              <circle cx="0" cy="6" r="5" fill="#FF85A2" />
              <circle cx="0" cy="0" r="4" fill="#FFD95A" />
            </g>
          )}

          {/* ── Body (Cute round seed/sprout shape) ── */}
          <path
            d="M 100 60
               C 145 60, 168 85, 168 125
               C 168 165, 140 182, 100 182
               C 60 182, 32 165, 32 125
               C 32 85, 55 60, 100 60 Z"
            fill={`url(#${uid}-bibooBody)`}
            stroke="#FFFFFF"
            strokeWidth="3.5"
          />

          {bodyTint && (
            <path
              d="M 100 60 C 145 60, 168 85, 168 125 C 168 165, 140 182, 100 182 C 60 182, 32 165, 32 125 C 32 85, 55 60, 100 60 Z"
              fill={bodyTint}
              opacity="0.22"
            />
          )}

          {/* Belly Highlight (lighter cream-green patch) */}
          <ellipse cx="100" cy="142" rx="42" ry="32" fill="#EAF6D9" opacity="0.4" />

          {/* ── Cheeks Blush ── */}
          <ellipse cx="58" cy="132" rx="13" ry="8" fill={cheekFill} />
          <ellipse cx="142" cy="132" rx="13" ry="8" fill={cheekFill} />

          {/* ── Big Sparkly Eyes ── */}
          {mood === "sleepy" ? (
            <g stroke="#2F3B1F" strokeWidth="4" strokeLinecap="round" fill="none">
              <path d="M 61 114 Q 74 126 87 114" />
              <path d="M 113 114 Q 126 126 139 114" />
            </g>
          ) : (
          <>
          {/* Left Eye */}
          <g>
            <ellipse cx="74" cy="112" rx="13" ry="17" fill="#2F3B1F" />
            <circle cx="70" cy="106" r="5.5" fill="#FFFFFF" />
            <circle cx="78" cy="119" r="2.5" fill="#FFFFFF" />
            {isGirl && (
              <path d="M 64 100 Q 61 95 58 98 M 68 97 Q 68 92 66 91" stroke="#2F3B1F" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>

          {/* Right Eye */}
          <g>
            <ellipse cx="126" cy="112" rx="13" ry="17" fill="#2F3B1F" />
            <circle cx="122" cy="106" r="5.5" fill="#FFFFFF" />
            <circle cx="130" cy="119" r="2.5" fill="#FFFFFF" />
            {isGirl && (
              <path d="M 136 100 Q 139 95 142 98 M 132 97 Q 132 92 134 91" stroke="#2F3B1F" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>

          </>
          )}

          {(mood === "sad" || mood === "cold") && (
            <g>
              <path d="M 58 98 L 88 88" stroke="#2F3B1F" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 142 98 L 112 88" stroke="#2F3B1F" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 62 128 Q 56 140 62 146 Q 68 140 62 128 Z" fill="#7CC8F2" stroke="#3FA7E0" strokeWidth="1.5" />
            </g>
          )}

          {mood === "cold" && (
            <g fontSize="22" textAnchor="middle">
              <text x="26" y="78">❄</text>
              <text x="176" y="96">❄</text>
              <text x="172" y="50" fontSize="16">❄</text>
            </g>
          )}

          {mood === "hot" && (
            <g fill="#7CC8F2" stroke="#3FA7E0" strokeWidth="1.5">
              <path d="M 44 92 Q 36 106 44 114 Q 52 106 44 92 Z" />
              <path d="M 158 80 Q 150 94 158 102 Q 166 94 158 80 Z" />
            </g>
          )}

          {mood === "soggy" && (
            <g fill="#7CC8F2" stroke="#3FA7E0" strokeWidth="1.5">
              <path d="M 40 40 Q 32 54 40 62 Q 48 54 40 40 Z" />
              <path d="M 160 30 Q 152 44 160 52 Q 168 44 160 30 Z" />
              <path d="M 178 70 Q 172 80 178 86 Q 184 80 178 70 Z" />
            </g>
          )}

          {mood === "sleepy" && (
            <g fill="#6B7A55" fontWeight="800">
              <text x="150" y="74" fontSize="20">z</text>
              <text x="164" y="52" fontSize="26">Z</text>
            </g>
          )}

          {/* ── Mouth by Mood ── */}
          {mood === "thinking" ? (
            <path d="M 94 138 Q 102 133 108 138" stroke="#2F3B1F" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : mood === "sad" || mood === "cold" ? (
            <path d="M 86 144 Q 100 126 114 144" stroke="#2F3B1F" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          ) : mood === "sleepy" ? (
            <path d="M 92 138 Q 100 145 108 138" stroke="#2F3B1F" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : mood === "hot" ? (
            <g>
              <path d="M 86 132 Q 100 156 114 132 Z" stroke="#2F3B1F" strokeWidth="3.2" strokeLinejoin="round" fill="#E5483B" />
              <ellipse cx="100" cy="146" rx="7" ry="5" fill="#FF8C8C" />
            </g>
          ) : mood === "soggy" ? (
            <ellipse cx="100" cy="141" rx="7" ry="9" fill="#E5483B" stroke="#2F3B1F" strokeWidth="3" />
          ) : (
            <path
              d="M 88 132 Q 100 148 112 132"
              stroke="#2F3B1F"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="#E5483B"
            />
          )}

          {/* ── Arms & Hands by Mood ── */}
          {mood === "wave" && (
            <g>
              {/* Left hand waving high */}
              <path d="M 40 120 Q 22 105 18 85 Q 26 80 34 96" fill="#6CC04A" stroke="#3F9B2E" strokeWidth="2.5" />
              {/* Right hand on hip */}
              <path d="M 160 125 Q 175 135 168 145" fill="#6CC04A" stroke="#3F9B2E" strokeWidth="2.5" />
            </g>
          )}

          {mood === "trophy" && (
            <g>
              {/* Holding Trophy in center */}
              <path d="M 85 110 L 115 110 L 110 135 Q 100 145 90 135 Z" fill={`url(#${uid}-goldTrophy)`} stroke="#D98F00" strokeWidth="2" />
              {/* Trophy handles */}
              <path d="M 85 115 Q 75 120 85 130" fill="none" stroke="#D98F00" strokeWidth="2.5" />
              <path d="M 115 115 Q 125 120 115 130" fill="none" stroke="#D98F00" strokeWidth="2.5" />
              {/* Trophy Base */}
              <rect x="92" y="140" width="16" height="8" rx="2" fill="#7A4B24" />
              <polygon points="100,118 102,124 108,124 103,127 105,133 100,129 95,133 97,127 92,124 98,124" fill="#FFFFFF" />
            </g>
          )}

          {mood === "watering" && (
            <g transform="translate(130, 95) scale(0.65)">
              {/* Watering Can */}
              <path d="M 10 30 Q 30 10 50 30 L 45 70 L 15 70 Z" fill="#3FA7E0" stroke="#2A82B8" strokeWidth="3" />
              <path d="M 5 40 Q -15 35 5 60" fill="none" stroke="#3FA7E0" strokeWidth="5" strokeLinecap="round" />
              <path d="M 45 35 L 65 25" stroke="#3FA7E0" strokeWidth="4" strokeLinecap="round" />
              {/* Water drops */}
              <circle cx="75" cy="35" r="3" fill="#BFE6F7" />
              <circle cx="85" cy="45" r="2.5" fill="#BFE6F7" />
            </g>
          )}

          {(mood === "happy" || mood === "celebrating" || mood === "sad" || mood === "sleepy" || mood === "hot" || mood === "cold" || mood === "soggy") && (
            <g>
              {/* Left hand cute stubby */}
              <path d="M 40 128 Q 24 125 30 138 Q 40 142 45 136" fill="#6CC04A" stroke="#3F9B2E" strokeWidth="2" />
              {/* Right hand cute stubby */}
              <path d="M 160 128 Q 176 125 170 138 Q 160 142 155 136" fill="#6CC04A" stroke="#3F9B2E" strokeWidth="2" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
