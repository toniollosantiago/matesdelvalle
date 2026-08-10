import AnimatedTitleHero from "@/components/hero/AnimatedTitleHero";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mates del Valle — Mates artesanales en Embalse, Córdoba",
  description:
    "Mates artesanales, bombillas y combos de calidad a buen precio. Directo desde Embalse, Calamuchita, Córdoba.",
};

const FEATURED = [
  {
    name: "Mate Camionero criollo de Calabaza",
    price: "13.000",
    image: "/images/Mate Camionero criollo de Calabaza.png",
    slug: "mate-camionero-criollo-calabaza",
    tag: "Calabaza Criolla",
  },
  {
    name: "Mate Camionero con Virola Cincelada",
    price: "18.000",
    image: "/images/Mate Camionero Calabaza Liso con Virola de Acero Cincelada.png",
    slug: "mate-camionero-virola-cincelada",
    tag: "Virola Cincelada",
  },
  {
    name: "Mate Camionero de Algarrobo",
    price: "12.000",
    image: "/images/Mate Camionero de Algarrobo Virola de Acero.png",
    slug: "mate-camionero-algarrobo",
    tag: "Algarrobo Macizo",
  },
  {
    name: "COMBO 1: Mate + Bombilla Pico de Loro",
    price: "22.000",
    image: "/images/Mate Camionero Calabaza Liso con Virola de Acero.png",
    slug: "combo-1",
    tag: "Combo Especial",
  },
];

export default function Home() {
  return (
    <div className="bg-background text-on-surface font-sans antialiased">
      {/* HERO ANIMADO CON VIDEO RECURTADO Y TÍTULO DESTACADO */}
      <AnimatedTitleHero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12 space-y-10">
        {/* PRODUCTOS DESTACADOS — BADGES UNIFICADOS DE UN SOLO COLOR CON ANIMACIÓN PULSE */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-5 gap-2">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#697552] block mb-1">
                Nuestra Selección
              </span>
              <h2 className="font-sans font-bold text-xl sm:text-3xl text-earth-brown uppercase tracking-tight">
                Mates Destacados
              </h2>
            </div>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-1.5 font-bold text-[11px] sm:text-xs uppercase tracking-widest text-[#697552] hover:text-earth-brown transition-colors group"
            >
              Ver catálogo completo
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {FEATURED.map((product) => (
              <article
                key={product.slug}
                className="bg-white border border-washed-sky rounded-xl overflow-hidden group hover:border-[#697552] transition-all duration-300 rustic-shadow flex flex-col h-full"
              >
                <Link
                  href={`/producto/${product.slug}`}
                  className="relative aspect-square overflow-hidden bg-surface-container-low block"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {/* BADGE UNIFICADO DE COLOR #697552 CON ANIMACIÓN DE PULSO SUAVE */}
                  <span className="absolute top-2 left-2 bg-[#697552] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm animate-pulse">
                    {product.tag}
                  </span>
                </Link>
                <div className="p-3 sm:p-5 flex flex-col flex-grow justify-between">
                  <Link href={`/producto/${product.slug}`}>
                    <h3 className="font-sans font-bold text-xs sm:text-base text-earth-brown leading-snug mb-2 group-hover:text-[#697552] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="pt-2 border-t border-washed-sky/40 flex items-center justify-between">
                    <span className="text-xs sm:text-base font-extrabold text-[#5D4B3E]">
                      ${product.price} ARS
                    </span>
                    <Link
                      href={`/producto/${product.slug}`}
                      className="text-[10px] sm:text-xs font-bold text-[#697552] uppercase tracking-wider hover:underline"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PUNTO 7 & FOTO 1: DOS TARJETAS GEMELAS DE IGUAL COLOR BEIGE/MARRÓN CÁLIDO CON MÁRGENES EN CELL */}
        <section className="px-1 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
            {/* Tarjeta 1: Guía de Curado (Color Warm Beige/Brown #EFECE6) */}
            <div className="bg-[#EFECE6] border border-[#5D4B3E]/15 rounded-2xl p-5 sm:p-8 flex flex-col justify-between space-y-4 h-full rustic-shadow">
              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#5D4B3E] bg-[#5D4B3E]/10 px-2.5 py-0.5 rounded-full inline-block">
                  Guía de Cuidado
                </span>
                <h2 className="font-sans font-bold text-lg sm:text-2xl text-[#5D4B3E] uppercase tracking-tight">
                  ¿Sabés cómo curar tu mate?
                </h2>
                <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  El curado adecuado alarga la vida útil de la calabaza y asegura el mejor sabor en cada cebada.
                </p>
              </div>
              <div>
                <Link
                  href="/como-curar-tu-mate"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4A3B32] hover:bg-[#3D2E24] text-white font-bold text-[11px] sm:text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-sm"
                >
                  Leer guía de curado
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Tarjeta 2: Consulta WhatsApp (EXACTAMENTE MISMO COLOR #EFECE6) */}
            <div className="bg-[#EFECE6] border border-[#5D4B3E]/15 rounded-2xl p-5 sm:p-8 flex flex-col justify-between space-y-4 h-full rustic-shadow">
              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#5D4B3E] bg-[#5D4B3E]/10 px-2.5 py-0.5 rounded-full inline-block">
                  Atención Directa
                </span>
                <h2 className="font-sans font-bold text-lg sm:text-2xl text-[#5D4B3E] uppercase tracking-tight">
                  ¿Tenés alguna consulta?
                </h2>
                <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Te asesoramos directamente por WhatsApp sobre disponibilidad de modelos, envíos y formas de pago.
                </p>
              </div>
              <div>
                <a
                  href="https://wa.me/5493571315093?text=Hola!%20Quisiera%20consultar%20sobre%20sus%20mates."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#697552] hover:bg-[#596544] text-white font-bold text-[11px] sm:text-xs uppercase tracking-widest rounded-full shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Escribir al WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
