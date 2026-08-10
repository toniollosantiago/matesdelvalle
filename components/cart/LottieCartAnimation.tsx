"use client";

import { useEffect, useState } from "react";

export default function LottieCartAnimation({
  trigger,
  className = "w-6 h-6",
}: {
  trigger?: boolean;
  className?: string;
}) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full transition-transform duration-300 ${
          animating ? "scale-115" : ""
        }`}
      >
        {/* Carrito Main Body Line (White contour) */}
        <path
          d="M6 10H14L21.2 42.4C21.6 44.2 23.2 45.5 25 45.5H50.5C52.3 45.5 53.9 44.2 54.3 42.4L58 20H18"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Item dropping inside animation (Animated Box / Heart) */}
        <g
          className={`transition-all duration-500 ease-out origin-top ${
            animating
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-4 scale-50"
          }`}
        >
          <rect
            x="26"
            y="16"
            width="20"
            height="18"
            rx="4"
            fill="#5D4B3E"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <path
            d="M36 21V29M32 25H40"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Left Wheel (Spin animation on trigger) */}
        <circle
          cx="26"
          cy="53"
          r="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={animating ? "animate-spin origin-[26px_53px]" : ""}
        />

        {/* Right Wheel (Spin animation on trigger) */}
        <circle
          cx="48"
          cy="53"
          r="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={animating ? "animate-spin origin-[48px_53px]" : ""}
        />

        {/* Speed motion trails under cart when triggered */}
        {animating && (
          <g className="animate-pulse">
            <line x1="8" y1="57" x2="16" y2="57" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="4" y1="52" x2="10" y2="52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          </g>
        )}
      </svg>
    </div>
  );
}
