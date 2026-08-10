import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros — Mates del Valle",
  description: "Conocé la historia de Mates del Valle desde Embalse, Calamuchita, Córdoba.",
};

export default function SobreNosotrosPage() {
  return (
    <div className="bg-background text-on-surface font-sans antialiased min-h-screen">
      <main className="pt-20 pb-20 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto space-y-10">
        {/* Volver */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5C663D] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        {/* Encabezado Principal Manteniendo la Estructura Deseada */}
        <div className="text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#5C663D] bg-secondary-container px-3 py-1 rounded-full">
            Nuestra Historia
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-5xl text-earth-brown uppercase tracking-tight">
            Sobre Mates del Valle
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Un emprendimiento nacido en el corazón del Valle de Calamuchita, guiado por el respeto a las tradiciones y la pasión por el diseño artesanal.
          </p>
        </div>

        {/* Tarjeta de Historia Principal con Párrafos Bien Separados y Foto Circular del Logo a la Derecha */}
        <div className="bg-white border border-washed-sky rounded-2xl p-6 md:p-10 rustic-shadow grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6 text-sm sm:text-base text-on-surface-variant leading-relaxed">
            <h2 className="font-sans font-bold text-xl text-earth-brown uppercase">
              El ritual que nos une
            </h2>

            <p>
              En <strong>Mates del Valle</strong> creemos que el mate es mucho más que una infusión. Es una pausa necesaria en el día, un compañero de charlas y trabajo, y un símbolo de encuentro que trasciende generaciones.
            </p>

            <p>
              Desde nuestra sede en Embalse, Córdoba, seleccionamos meticulosamente calabazas, maderas de algarrobo y trabajos en acero para ofrecer piezas duraderas y accesibles.
            </p>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[#5C663D]/20 shadow-md">
              <Image
                src="/logo.jpg"
                alt="Logo Mates del Valle"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
