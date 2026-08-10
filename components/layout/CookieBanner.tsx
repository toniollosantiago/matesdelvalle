"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("mates_cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mates_cookie_consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-[#5C663D] text-white p-5 rounded-2xl shadow-2xl border border-white/20 animate-slideUp">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 font-sans font-bold text-sm uppercase tracking-wide">
          <Cookie className="w-5 h-5 text-[#D1DBE0]" />
          <span>Uso de Cookies</span>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-white/70 hover:text-white p-1"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-white/90 leading-relaxed mb-4">
        Utilizamos cookies propias y de terceros para brindarte la mejor experiencia en nuestra tienda online y coordinar tus pedidos de forma segura. Podés consultar más en nuestra{" "}
        <Link href="/politica-de-privacidad" className="underline font-semibold hover:text-white">
          Política de Privacidad
        </Link>.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={handleAccept}
          className="flex-1 py-2.5 px-4 bg-white text-[#5C663D] font-sans font-bold text-xs uppercase tracking-wider rounded hover:bg-gray-100 transition-colors text-center"
        >
          Aceptar todas
        </button>
        <Link
          href="/politica-de-privacidad"
          className="py-2.5 px-4 bg-black/20 text-white font-sans font-bold text-xs uppercase tracking-wider rounded hover:bg-black/30 transition-colors text-center"
        >
          Más info
        </Link>
      </div>
    </div>
  );
}
