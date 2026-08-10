import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — Mates del Valle",
  description: "Información sobre cómo tratamos y protegemos tus datos en Mates del Valle.",
};

export default function PoliticaDePrivacidadPage() {
  return (
    <div className="bg-background text-on-surface font-sans antialiased min-h-screen">
      <main className="pt-24 pb-20 px-4 md:px-16 max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5C663D] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#5C663D]">
            <Shield className="w-8 h-8" />
            <h1 className="font-sans font-bold text-3xl md:text-4xl text-earth-brown uppercase">
              Política de Privacidad
            </h1>
          </div>
          <p className="text-xs text-on-surface-variant">Última actualización: Agosto 2026</p>
        </div>

        <div className="bg-white border border-washed-sky rounded-2xl p-6 md:p-10 rustic-shadow space-y-6 text-sm sm:text-base text-on-surface-variant leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-earth-brown uppercase">
              1. Responsable del Tratamiento
            </h2>
            <p>
              Mates del Valle, con domicilio en Embalse, Calamuchita, Provincia de Córdoba, Argentina, es responsable del tratamiento de los datos personales facilitados a través de esta plataforma de comercio electrónico.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-earth-brown uppercase">
              2. Datos Recabados y Finalidad
            </h2>
            <p>
              Recopilamos únicamente la información estrictamente necesaria para procesar tus consultas y pedidos de productos artesanales (mates, bombillas y combos):
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nombre completo y número de teléfono (para coordinación vía WhatsApp).</li>
              <li>Dirección de entrega e información de envío (para envíos locales o nacionales).</li>
              <li>Datos de facturación o pago cuando coordinás transferencia bancaria o efectivo.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-earth-brown uppercase">
              3. Uso de Cookies
            </h2>
            <p>
              Utilizamos cookies técnicas para recordar el estado de tu carrito de compras (vía almacenamiento local) y mejorar el rendimiento de la navegación. No vendemos ni compartimos información con anunciantes de terceros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-earth-brown uppercase">
              4. Protección de Datos (Ley 25.326 Argentina)
            </h2>
            <p>
              Cumplimos con la Ley de Protección de Datos Personales N° 25.326 de la República Argentina. Tenés derecho a acceder, rectificar o solicitar la supresión de tus datos en cualquier momento contactándonos por WhatsApp o correo electrónico.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-earth-brown uppercase">
              5. Contacto
            </h2>
            <p>
              Ante cualquier duda o consulta sobre esta política, podés escribirnos por WhatsApp al{" "}
              <a href="https://wa.me/5493571315093" target="_blank" rel="noopener noreferrer" className="font-bold underline text-[#5C663D]">
                +54 9 3571 315093
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
