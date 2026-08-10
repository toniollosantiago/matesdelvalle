"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const WORD1 = "MATES";
const WORD2 = "DEL VALLE";

const FONT_CLASSES = [
  "font-sans font-extrabold", // Base Montserrat
  "font-caslon-family font-serif italic font-normal", // Libre Caslon
  "font-playfair-family font-serif font-bold", // Playfair Display
  "font-cormorant-family font-serif font-light", // Cormorant Garamond
];

export default function AnimatedTitleHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [word1Fonts, setWord1Fonts] = useState<number[]>(new Array(WORD1.length).fill(0));
  const [word2Fonts, setWord2Fonts] = useState<number[]>(new Array(WORD2.length).fill(0));

  // Loop video strictly between 0s and 9s
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 9.0) {
      videoRef.current.currentTime = 0.0;
      videoRef.current.play().catch(() => {});
    }
  };

  // Per-letter font jitter animation
  useEffect(() => {
    const triggerWaveAnimation = () => {
      WORD1.split("").forEach((_, charIdx) => {
        setTimeout(() => {
          setWord1Fonts((prev) => {
            const next = [...prev];
            next[charIdx] = (charIdx % 3) + 1;
            return next;
          });
        }, charIdx * 50);

        setTimeout(() => {
          setWord1Fonts((prev) => {
            const next = [...prev];
            next[charIdx] = 0;
            return next;
          });
        }, charIdx * 50 + 350);
      });

      WORD2.split("").forEach((_, charIdx) => {
        if (WORD2[charIdx] === " ") return;
        setTimeout(() => {
          setWord2Fonts((prev) => {
            const next = [...prev];
            next[charIdx] = ((charIdx + 1) % 3) + 1;
            return next;
          });
        }, charIdx * 50 + 200);

        setTimeout(() => {
          setWord2Fonts((prev) => {
            const next = [...prev];
            next[charIdx] = 0;
            return next;
          });
        }, charIdx * 50 + 550);
      });
    };

    const interval = setInterval(triggerWaveAnimation, 3500);
    const initialTimer = setTimeout(triggerWaveAnimation, 600);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  return (
    <section className="relative w-full h-[calc(100svh-64px)] min-h-[calc(100svh-64px)] flex items-center justify-center overflow-hidden bg-[#697552]">
      {/* Background Video (00:00 to 00:09 loop with blur & dark overlay) */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="/videos/hero-video.mp4"
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover scale-105 filter blur-[2px] brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
      </div>

      {/* Hero Content — Dominant Text Title on Mobile */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center gap-6 sm:gap-10">
        {/* Dominant Text: text-5xl on mobile so it dominates over video */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight drop-shadow-2xl uppercase select-none leading-none">
          {/* WORD 1: MATES */}
          <span className="inline-flex whitespace-nowrap">
            {WORD1.split("").map((char, index) => (
              <span
                key={index}
                className={`transition-all duration-300 inline-block ${
                  FONT_CLASSES[word1Fonts[index] || 0]
                }`}
              >
                {char}
              </span>
            ))}
          </span>

          {/* WORD 2: DEL VALLE */}
          <span className="inline-flex whitespace-nowrap">
            {WORD2.split("").map((char, index) => (
              <span
                key={index}
                className={`transition-all duration-300 inline-block ${
                  char === " " ? "w-2 sm:w-5" : ""
                } ${FONT_CLASSES[word2Fonts[index] || 0]}`}
              >
                {char}
              </span>
            ))}
          </span>
        </div>

        {/* Semi-transparent Pill CTA Button */}
        <div className="mt-2">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 font-sans font-semibold text-xs sm:text-sm uppercase tracking-widest text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 rounded-full transition-all duration-300 shadow-xl active:scale-95 group"
          >
            Ir a los mates
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
