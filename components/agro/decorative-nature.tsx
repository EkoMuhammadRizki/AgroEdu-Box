"use client";
import React from "react";

export function Butterfly({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`w-8 h-8 pointer-events-none select-none drop-shadow-sm ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Top Wing */}
      <path d="M 20 20 C 14 6, 2 8, 4 20 C 6 26, 16 23, 20 20 Z" fill="#FFD95A" stroke="#FFB81C" strokeWidth="1.5" />
      <circle cx="10" cy="16" r="2.5" fill="#FF85A2" />
      {/* Right Top Wing */}
      <path d="M 20 20 C 26 6, 38 8, 36 20 C 34 26, 24 23, 20 20 Z" fill="#FFD95A" stroke="#FFB81C" strokeWidth="1.5" />
      <circle cx="30" cy="16" r="2.5" fill="#FF85A2" />
      {/* Left Bottom Wing */}
      <path d="M 20 20 C 14 26, 6 30, 9 36 C 14 38, 18 28, 20 20 Z" fill="#FFAAA0" stroke="#FFB81C" strokeWidth="1.2" />
      {/* Right Bottom Wing */}
      <path d="M 20 20 C 26 26, 34 30, 31 36 C 26 38, 22 28, 20 20 Z" fill="#FFAAA0" stroke="#FFB81C" strokeWidth="1.2" />
      {/* Body */}
      <path d="M 20 12 L 20 28" stroke="#7A4B24" strokeWidth="2.5" strokeLinecap="round" />
      {/* Antennae */}
      <path d="M 19 12 Q 15 6 12 7 M 21 12 Q 25 6 28 7" stroke="#7A4B24" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Ladybug({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`w-6 h-6 pointer-events-none select-none drop-shadow-sm ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="16" cy="9" r="4.5" fill="#2F3B1F" />
      <circle cx="14" cy="8" r="1" fill="#FFFFFF" />
      <circle cx="18" cy="8" r="1" fill="#FFFFFF" />
      {/* Antennae */}
      <path d="M 14 6 Q 11 3 9 4 M 18 6 Q 21 3 23 4" stroke="#2F3B1F" strokeWidth="1.2" strokeLinecap="round" />
      {/* Red Shell */}
      <ellipse cx="16" cy="19" rx="10" ry="10" fill="#E5483B" stroke="#2F3B1F" strokeWidth="1.5" />
      {/* Shell Center Divider */}
      <line x1="16" y1="9" x2="16" y2="29" stroke="#2F3B1F" strokeWidth="1.5" />
      {/* Black Spots */}
      <circle cx="11" cy="15" r="1.8" fill="#2F3B1F" />
      <circle cx="21" cy="15" r="1.8" fill="#2F3B1F" />
      <circle cx="12" cy="22" r="1.8" fill="#2F3B1F" />
      <circle cx="20" cy="22" r="1.8" fill="#2F3B1F" />
      {/* Legs */}
      <path d="M 6 14 L 3 13 M 6 19 L 2 19 M 7 24 L 3 26" stroke="#2F3B1F" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 26 14 L 29 13 M 26 19 L 30 19 M 25 24 L 29 26" stroke="#2F3B1F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SoftCloud({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      className={`pointer-events-none select-none opacity-85 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 20 45 Q 10 45 10 35 Q 10 25 22 24 Q 28 10 48 12 Q 62 4 78 14 Q 94 8 102 22 Q 114 26 112 38 Q 110 46 100 46 Z"
        fill="#FFFFFF"
        stroke="#EAF6D9"
        strokeWidth="2"
      />
    </svg>
  );
}

export function HillBackdrop() {
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden h-36 md:h-48 z-0">
      <svg
        viewBox="0 0 1440 280"
        className="w-full h-full object-cover"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Back Hill */}
        <path
          d="M 0 160 Q 380 60 760 140 T 1440 100 L 1440 280 L 0 280 Z"
          fill="#CDEBB0"
          opacity="0.75"
        />
        {/* Front Hill */}
        <path
          d="M 0 200 Q 420 120 900 180 T 1440 160 L 1440 280 L 0 280 Z"
          fill="#8FD16A"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
