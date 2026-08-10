import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles, AlertTriangle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo Curar tu Mate — Guía Paso a Paso | Mates del Valle",
  description:
    "Aprende cómo curar tu mate de calabaza o madera de forma correcta. Evita hongos, sella los poros y mejora el sabor de tus cebadas.",
};

const STEPS = [
  {
    number: "1",
    title: "Llenar con yerba usada o húmeda",
    description:
      "Llená el mate hasta 3/4 partes con yerba previamente usada. Evitá que la yerba toque la virola de metal para prevenir manchas en el borde.",
  },
  {
    number: "2",
    title: "Humedecer con agua tibia (70°C)",
    description:
      "Agregá un poco de agua tibia para que la yerba absorba la humedad uniformemente. No uses agua hirviendo para no agrietar la calabaza.",
  },
  {
    number: "3",
    title: "Dejar reposar 24 horas",
    description:
      "Dejá descansar el mate en un lugar seco y ventilado durante un día entero. La calabaza absorberá el sabor y sellará sus poros de forma natural.",
  },
  {
    number: "4",
    title: "Raspar suavemente el interior",
    description:
      "Retirá la yerba y, con una cucharita de té, raspá suavemente las paredes internas para quitar el hollejo suelto sin lastimar la madera.",
  },
  {
    number: "5",
    title: "Repetir 2 a 3 días",
    description:
      "Para un curado óptimo, repetí este proceso durante 2 o 3 días consecutivos cambiando la yerba cada día.",
  },
];

export default function ComoCurarTuMatePage() {
  return (
    <div className="bg-background text-on-surface font-sans antialiased min-h-screen">
      <main className="pt-20 pb-20 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto space-y-10">
        {/* Volver */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6c7a52] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        {/* Header en tono marrón cálido semitransparente */}
        <div className="bg-[#5D4B3E]/10 backdrop-blur-sm border border-[#5D4B3E]/20 rounded-2xl p-8 text-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D4B3E]">
            Guía de Curado Artesanal
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-earth-brown uppercase tracking-tight">
            Cómo Curar tu Mate
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            El curado es el proceso fundamental para sellar los poros de la calabaza, prevenir la formación de hongos y garantizar el sabor característico del buen mate.
          </p>
        </div>

        {/* Pasos */}
        <div className="space-y-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-white border border-washed-sky rounded-xl p-6 rustic-shadow flex flex-col sm:flex-row items-start gap-5 hover:border-[#6c7a52] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#5D4B3E] text-white flex items-center justify-center font-bold text-base shrink-0">
                {step.number}
              </div>
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-base text-earth-brown">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recomendaciones */}
        <div className="bg-[#6c7a52]/10 border border-[#6c7a52]/20 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#6c7a52]">
            <Sparkles className="w-5 h-5 shrink-0" />
            <h3 className="font-sans font-bold text-sm text-earth-brown uppercase tracking-wide">
              Recomendaciones de Mantenimiento
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-on-surface-variant">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6c7a52] shrink-0 mt-0.5" />
              <span><strong>Secado posterior:</strong> Luego de enjuagar, secá el interior con servilleta de papel y dejalo inclinado a 45° en un lugar ventilado.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span><strong>Sin detergente ni sol directo:</strong> Nunca uses jabón ni seques el mate directo al sol para evitar grietas en la madera.</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6c7a52] hover:bg-[#5d6a45] text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors shadow-sm"
          >
            Explorar Catálogo de Mates
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
