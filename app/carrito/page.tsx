"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, total: getTotal } = useCartStore();
  const total = getTotal();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedWaUrl, setSavedWaUrl] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  if (items.length === 0 && !showSuccessModal) {
    return (
      <div className="bg-background text-on-surface font-sans antialiased min-h-screen flex flex-col pt-16">
        <main className="flex-grow max-w-xl mx-auto px-4 w-full py-16 flex flex-col items-center justify-center text-center space-y-4">
          <p className="font-sans text-sm sm:text-base text-on-surface-variant">
            Tu carrito de compras está vacío.
          </p>
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-[#5D4B3E] text-white font-sans font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#4A3B32] transition-colors shadow-md"
          >
            Ir a la tienda
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface font-sans antialiased min-h-screen flex flex-col pt-16">
      <main className="flex-grow max-w-2xl mx-auto px-3 sm:px-6 w-full py-2 sm:py-6 space-y-4">
        <div className="flex items-center justify-between border-b border-washed-sky/60 pb-3 pt-1">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#5C663D] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Seguir comprando
          </Link>
          <h1 className="font-sans font-bold text-base sm:text-xl text-earth-brown uppercase tracking-tight">
            Carrito de Compras
          </h1>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-washed-sky rounded-xl p-3 flex gap-3 items-center rustic-shadow"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#f5f3ef] border border-gray-200 shrink-0 relative">
                <Image
                  src={item.image || "/images/Mate Camionero criollo de Calabaza.png"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-grow min-w-0 space-y-1.5">
                <div className="flex justify-between items-start">
                  <h3 className="font-sans font-bold text-xs sm:text-sm text-earth-brown truncate pr-2">
                    {item.name}
                  </h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Eliminar ítem"
                    className="text-gray-400 hover:text-red-600 transition-colors p-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-300 rounded-full px-2 py-0.5 bg-gray-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-black font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-xs text-clay-text">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-black font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-sans font-bold text-xs sm:text-base text-clay-text">
                    {formatPrice(item.price * item.quantity)} ARS
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={clearCart}
              className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-earth-brown transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        <div className="bg-white border border-washed-sky rounded-2xl p-4 sm:p-6 space-y-4 rustic-shadow">
          <h2 className="font-sans font-bold text-sm sm:text-base text-earth-brown uppercase border-b border-washed-sky/60 pb-2">
            Datos de Envío y Contacto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Nombre y Apellido *
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5C663D] bg-[#fafaf9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Teléfono / WhatsApp *
              </label>
              <input
                type="tel"
                placeholder="Ej: 3571 123456"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5C663D] bg-[#fafaf9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Email de contacto *
            </label>
            <input
              type="email"
              placeholder="Ej: tuemail@gmail.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5C663D] bg-[#fafaf9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Nota o aclaración para el vendedor (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Prefiero mate de virola lisa / Entregar por la tarde"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5C663D] bg-[#fafaf9]"
            />
          </div>

          <div className="flex justify-between items-baseline pt-2">
            <span className="font-sans font-bold text-xs sm:text-sm text-earth-brown uppercase">
              Subtotal:
            </span>
            <span className="font-sans font-bold text-sm sm:text-base text-clay-text">
              {formatPrice(total)} ARS
            </span>
          </div>

          <div className="h-px bg-washed-sky/60 my-1" />

          <div className="flex justify-between items-baseline">
            <span className="font-sans font-bold text-lg sm:text-xl text-[#5D4B3E]">
              Total:
            </span>
            <span className="font-sans font-extrabold text-xl sm:text-2xl text-[#5D4B3E]">
              {formatPrice(total)} ARS
            </span>
          </div>

          <p className="text-[10px] sm:text-xs text-gray-500 text-right font-medium">
            Pago coordinado por transferencia bancaria o efectivo
          </p>

          <div className="pt-2 border-t border-washed-sky/40">
            <label className="flex items-start gap-2 cursor-pointer text-[11px] sm:text-xs text-on-surface-variant select-none">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#5D4B3E] focus:ring-[#5D4B3E] w-4 h-4 cursor-pointer"
              />
              <span>
                Acepto los{" "}
                <Link href="/terminos-y-condiciones" target="_blank" className="font-bold text-[#5D4B3E] underline">
                  Términos y Condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/politica-de-privacidad" target="_blank" className="font-bold text-[#5D4B3E] underline">
                  Política de Privacidad
                </Link>.
              </span>
            </label>
          </div>

          <div className="pt-1">
            <button
              disabled={!acceptedTerms || !customerName.trim() || !customerPhone.trim() || !customerEmail.trim() || isOrdering}
              onClick={async () => {
                if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
                  alert("Por favor, completá tu nombre, teléfono y email de contacto.");
                  return;
                }
                if (!acceptedTerms) {
                  alert("Por favor, aceptá los Términos y Condiciones para continuar.");
                  return;
                }
                setIsOrdering(true);

                const dynamicWaUrl = generateWhatsAppLink(items, total, "5493571315093", {
                  name: customerName,
                  phone: customerPhone,
                  email: customerEmail,
                  note: customerNote,
                });
                setSavedWaUrl(dynamicWaUrl);

                // Redirigir de inmediato al cliente a WhatsApp
                window.open(dynamicWaUrl, "_blank");

                // Enviar la notificación de pedido al servidor en segundo plano
                fetch("/api/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: customerName,
                    phone: customerPhone,
                    email: customerEmail,
                    note: customerNote,
                    items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
                  }),
                }).catch((e) => console.error("Error al registrar pedido:", e));

                setIsOrdering(false);
                setShowSuccessModal(true);
                clearCart();
              }}
              className={`w-full py-4 rounded-full font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                acceptedTerms && customerName.trim() && customerPhone.trim() && customerEmail.trim() && !isOrdering
                  ? "bg-[#5D4B3E] hover:bg-[#4A3B32] text-white cursor-pointer active:scale-98"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isOrdering ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
              ) : (
                "REALIZAR PEDIDO"
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 text-center pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5C663D]" />
            <span>Compra protegida · Mates del Valle</span>
          </div>
        </div>
      </main>

      {/* Cartel flotante tras realizar pedido */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#ede7dd] border border-[#d8d0c2] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5 relative overflow-hidden">
            {/* Contenido limpio */}
            <div className="space-y-3 py-2 text-[#2b251f]">
              <h3 className="font-extrabold text-2xl tracking-wide text-[#3b322a]">
                LISTO!!!
              </h3>
              <p className="font-semibold text-sm sm:text-base leading-relaxed">
                Su pedido ha sido realizado.
              </p>
              <p className="text-xs sm:text-sm text-[#4a4036] leading-snug font-medium px-2">
                Si no se abrió la pestaña de WhatsApp automáticamente, por favor comunicate a nuestro número tocando el botón de abajo para coordinar el pago y la entrega del producto:
              </p>

              {/* Botón WA.ME */}
              <div className="pt-3">
                <a
                  href={savedWaUrl || "https://wa.me/5493571315093"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#25D366] font-black text-sm px-6 py-3 rounded-xl border-2 border-[#25D366] shadow-md hover:bg-[#25D366] hover:text-white transition-all transform hover:scale-105 active:scale-95"
                >
                  🔗 WA.ME
                </a>
              </div>
            </div>

            {/* Botón Volver a la tienda */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                window.location.href = "/tienda";
              }}
              className="w-full py-3.5 bg-[#5D4B3E] hover:bg-[#4A3B32] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow cursor-pointer"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
