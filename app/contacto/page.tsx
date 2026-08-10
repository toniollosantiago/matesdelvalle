"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, MapPin, Send } from "lucide-react";

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !mensaje.trim()) {
      alert("Por favor completá tu nombre y mensaje.");
      return;
    }

    const text = encodeURIComponent(
      `Hola Mates del Valle!\nMi nombre es: ${nombre}\nTeléfono: ${telefono || "No especificado"}\n\nConsulta: ${mensaje}`
    );
    window.open(`https://wa.me/5493571315093?text=${text}`, "_blank");
  };

  return (
    <div className="bg-background text-on-surface font-sans antialiased min-h-screen">
      <main className="pt-20 pb-20 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto space-y-10">
        {/* Volver */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#5C663D] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al inicio
        </Link>

        {/* Encabezado */}
        <div className="text-center space-y-4 mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5C663D] bg-secondary-container px-3 py-1 rounded-full">
              Atención Personalizada
            </span>
          </div>

          <h1 className="font-sans font-bold text-3xl sm:text-5xl text-earth-brown uppercase tracking-tight my-3">
            Contacto
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant max-w-lg mx-auto leading-relaxed pt-1">
            Escribinos tu consulta y te responderemos directamente por WhatsApp al instante.
          </p>
        </div>

        {/* Grid de Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Tarjetas de Acceso Rápido — WhatsApp (Verde Oliva Pastel Cohesivo) e Instagram (Azul Lago Pastel Cohesivo) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white border border-washed-sky rounded-2xl p-6 rustic-shadow space-y-4">
              <h2 className="font-sans font-bold text-xs text-earth-brown uppercase tracking-widest">
                Canales Directos
              </h2>

              {/* WhatsApp — Verde Oliva Pastel de la Estética Mates del Valle */}
              <a
                href="https://wa.me/5493571315093?text=Hola!%20Quisiera%20consultar%20sobre%20sus%20mates."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-[#697552]/10 border border-[#697552]/30 text-[#4A5330] hover:bg-[#697552]/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#697552] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider block">WhatsApp Directo</span>
                  <span className="text-xs opacity-80">+54 9 3571 315093</span>
                </div>
              </a>

              {/* Instagram — Azul Lago Pastel Cohesivo */}
              <a
                href="https://www.instagram.com/matesdelvalle_emb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-[#2E5266]/10 border border-[#2E5266]/30 text-[#2E5266] hover:bg-[#2E5266]/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#2E5266] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider block">Instagram</span>
                  <span className="text-xs opacity-80">@matesdelvalle_emb</span>
                </div>
              </a>

              {/* Ubicación */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700">
                <MapPin className="w-5 h-5 text-[#5C663D] shrink-0" />
                <span className="text-xs">Embalse, Calamuchita, Córdoba</span>
              </div>
            </div>
          </div>

          {/* Formulario de Mensaje */}
          <div className="md:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white border border-washed-sky rounded-2xl p-6 sm:p-8 rustic-shadow space-y-4">
              <h2 className="font-sans font-bold text-base text-earth-brown uppercase">
                Enviar mensaje directo a WhatsApp
              </h2>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-earth-brown uppercase">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-gray-50 border border-washed-sky rounded-lg px-4 py-2.5 text-xs text-clay-text outline-none focus:ring-2 focus:ring-[#5C663D] transition-shadow"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-earth-brown uppercase">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-gray-50 border border-washed-sky rounded-lg px-4 py-2.5 text-xs text-clay-text outline-none focus:ring-2 focus:ring-[#5C663D] transition-shadow"
                  placeholder="Tu número con código de área"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-earth-brown uppercase">Mensaje o Consulta</label>
                <textarea
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="w-full bg-gray-50 border border-washed-sky rounded-lg px-4 py-2.5 text-xs text-clay-text outline-none focus:ring-2 focus:ring-[#5C663D] transition-shadow resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#5D4B3E] hover:bg-[#4A3B32] text-white font-sans font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                Enviar Consulta por WhatsApp
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
