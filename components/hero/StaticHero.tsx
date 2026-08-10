import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StaticHero() {
  return (
    <section className="relative w-full h-[calc(100vh-80px)] min-h-[550px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Blur/Dim Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Mates del Valle Artesanal"
          fill
          priority
          className="object-cover scale-105 filter blur-[2px] brightness-[0.70]"
          sizes="100vw"
        />
        {/* Subtle Dark/Earthy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c331a]/80 via-black/40 to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        <span className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#D1DBE0] bg-[#5C663D]/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
          Embalse · Calamuchita · Córdoba
        </span>

        <h1 className="font-sans font-extrabold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight drop-shadow-md uppercase leading-tight">
          Mates del Valle
        </h1>

        <p className="font-sans font-medium text-base sm:text-xl text-white/90 max-w-2xl leading-relaxed drop-shadow">
          El verdadero ritual del mate. Piezas artesanales seleccionadas en calabaza, algarrobo y acero a precios accesibles.
        </p>

        {/* Primary CTA Button */}
        <div className="mt-4">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-3 px-8 py-4 font-sans font-bold text-sm md:text-base uppercase tracking-widest text-white bg-[#5C663D] hover:bg-[#4A5330] active:scale-95 transition-all duration-300 rounded shadow-lg border border-white/20 group"
          >
            Ir a los mates
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
