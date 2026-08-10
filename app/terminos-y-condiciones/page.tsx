import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones — Mates del Valle",
  description: "Términos y condiciones de compra, envíos y devoluciones en Mates del Valle.",
};

export default function TerminosYCondicionesPage() {
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
            <FileText className="w-8 h-8" />
            <h1 className="font-sans font-bold text-3xl md:text-4xl text-earth-brown uppercase">
              Términos y Condiciones
            </h1>
          </div>
          <p className="text-xs text-on-surface-variant">Última actualización: Agosto 2026</p>
        </div>

        <div className="bg-white border border-washed-sky rounded-2xl p-6 md:p-10 rustic-shadow space-y-6 text-sm sm:text-base text-on-surface-variant leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-earth-brown uppercase">
              1. Generalidades
            </h2>
            <p>
              Bienvenido a Mates del Valle. Al utilizar nuestro sitio web y realizar pedidos de mates, bombillas o combos artesanales, aceptás los siguientes términos y condiciones de compra.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-earth-brown uppercase">
              2. Proceso de Pedido y Pagos
            </h2>
            <p>
              Los pedidos se arman en el sitio web agregando productos al carrito y se finalizan enviando la solicitud vía WhatsApp. Por el momento, los pagos se coordinan directamente por transferencia bancaria o en efectivo en Embalse, Córdoba.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-earth-brown uppercase">
              3. Envíos y Entregas
            </h2>
            <p>
              Los costos y plazos de envío varían según la ubicación del cliente y el medio de transporte elegido. Se cotizarán e informarán por WhatsApp al momento de confirmar el pedido.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-earth-brown uppercase">
              4. Naturaleza de los Productos Artesanales
            </h2>
            <p>
              Al tratarse de productos elaborados con calabaza natural, madera de algarrobo y trabajo manual, cada pieza es única. Pueden existir sutiles variaciones de forma, tonalidad o tamaño respecto a las fotos exhibidas, lo que constituye la marca distintiva del producto artesanal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-earth-brown uppercase">
              5. Cambios y Devoluciones
            </h2>
            <p>
              En caso de recibir un producto con fallas de fabricación, disponés de 10 días corridos a partir de la recepción para solicitar el cambio o reparación comunicándote por WhatsApp.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
