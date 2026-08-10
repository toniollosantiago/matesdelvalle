import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3D2E24] text-white border-t border-[#5D4B3E]/40 w-full py-12 px-4 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Brand Name Only (No Image Logo, No Long Description) */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="font-sans font-bold text-xl text-white uppercase tracking-tight">
            Mates del Valle
          </Link>
          <p className="font-sans text-xs text-[#D1DBE0]">
            Embalse · Calamuchita · Provincia de Córdoba
          </p>
          <p className="font-sans text-xs text-[#D1DBE0]/70 mt-1">
            © {new Date().getFullYear()} Mates del Valle. Todos los derechos reservados.
          </p>
        </div>

        {/* Links Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          <div className="flex flex-col gap-2.5">
            <span className="font-sans font-bold text-[#EFECE6] uppercase tracking-widest mb-0.5">
              Tienda
            </span>
            <Link href="/tienda" className="text-[#D1DBE0] hover:text-white transition-colors">
              Todos los productos
            </Link>
            <Link href="/tienda/mates" className="text-[#D1DBE0] hover:text-white transition-colors">
              Mates
            </Link>
            <Link href="/tienda/bombillas" className="text-[#D1DBE0] hover:text-white transition-colors">
              Bombillas
            </Link>
            <Link href="/tienda/combos" className="text-[#D1DBE0] hover:text-white transition-colors">
              Combos
            </Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-sans font-bold text-[#EFECE6] uppercase tracking-widest mb-0.5">
              Guías e Info
            </span>
            <Link href="/como-curar-tu-mate" className="text-[#D1DBE0] hover:text-white transition-colors">
              Cómo Curar tu Mate
            </Link>
            <Link href="/sobre-nosotros" className="text-[#D1DBE0] hover:text-white transition-colors">
              Sobre Nosotros
            </Link>
            <Link href="/contacto" className="text-[#D1DBE0] hover:text-white transition-colors">
              Contacto
            </Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-sans font-bold text-[#EFECE6] uppercase tracking-widest mb-0.5">
              Legales
            </span>
            <Link href="/politica-de-privacidad" className="text-[#D1DBE0] hover:text-white transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos-y-condiciones" className="text-[#D1DBE0] hover:text-white transition-colors">
              Términos y Condiciones
            </Link>
            <a
              href="https://wa.me/5493571315093"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D1DBE0] hover:text-white transition-colors"
            >
              Atención por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
