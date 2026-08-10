"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Las 5 fotos del hero — fondo idéntico, solo cambia el producto central
const HERO_IMAGES = [
  "/images/fondo/8Dy6e8SNNIs4GHcIrzD41l.png",
  "/images/fondo/9RUGxUKn3_K7dLaHAD_k5E.png",
  "/images/fondo/9aKUPDLH2861gyi4gzPOUi.png",
  "/images/fondo/aJD_BLpOtqBffrvKdBq4Nh.png",
  "/images/fondo/b218nIHdORF3UnFBi5Ek27.png",
];

const INTERVAL_MS = 500; // Hard cut cada 500ms — efecto stop-motion real

export default function StopMotionHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Detectar prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    // Precargar todas las imágenes antes de arrancar la animación
    let loadedCount = 0;
    HERO_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === HERO_IMAGES.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === HERO_IMAGES.length) {
          setImagesLoaded(true);
        }
      };
      img.src = src;
    });

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Solo arrancar la animación si las imágenes cargaron y no hay reducedMotion
    if (!imagesLoaded || reducedMotion) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [imagesLoaded, reducedMotion]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "100svh",
        minHeight: "600px",
        backgroundColor: "#656B4A", // Verde oliva — fallback mientras cargan las imágenes
      }}
    >
      {/* Capa de imágenes — swap instantáneo sin transición (stop-motion real) */}
      {HERO_IMAGES.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            // SIN transition — corte seco para el efecto stop-motion
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          <Image
            src={src}
            alt={`Mates del Valle — producto ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Indicador de scroll — sutil, en la parte inferior */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white"
        style={{ animation: "bounce 2s infinite" }}
      >
        <span
          className="text-sm font-sans font-medium tracking-widest uppercase"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
        >
          Ver catálogo
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
