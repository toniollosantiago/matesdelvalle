"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import LogoOutlineSVG from "./LogoOutlineSVG";
import LottieCartAnimation from "../cart/LottieCartAnimation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartTriggered, setCartTriggered] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    setMounted(true);

    const handleCartItemAdded = () => {
      setCartTriggered(true);
      setTimeout(() => setCartTriggered(false), 1300);
    };

    window.addEventListener("cart-item-added", handleCartItemAdded);
    return () => window.removeEventListener("cart-item-added", handleCartItemAdded);
  }, []);

  useEffect(() => {
    if (totalItems > 0) {
      setCartTriggered(true);
      const timer = setTimeout(() => setCartTriggered(false), 1300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 h-16 bg-[#5C663D]/85 backdrop-blur-md text-white border-b border-white/15 transition-all duration-300 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          {/* Logo Outline Vector (White) */}
          <Link
            href="/"
            onClick={handleLogoClick}
            aria-label="Inicio - Mates del Valle"
            className="shrink-0 pl-1 group select-none"
          >
            <div className="transition-transform duration-300 group-hover:scale-110 group-active:scale-125 group-active:rotate-12 active:scale-125 active:rotate-12 cursor-pointer">
              <LogoOutlineSVG className="w-10 h-10 text-white" />
            </div>
          </Link>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 mx-auto">
            {[
              { href: "/", label: "Inicio" },
              { href: "/tienda", label: "Tienda" },
              { href: "/como-curar-tu-mate", label: "Cómo Curar tu Mate" },
              { href: "/sobre-nosotros", label: "Sobre Nosotros" },
              { href: "/contacto", label: "Contacto" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-sans font-semibold text-xs uppercase tracking-widest text-white/95 hover:text-white transition-colors duration-200 py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions: Lottie Loop Animated Cart Icon & Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/carrito"
              aria-label="Carrito de compras"
              className="relative p-1.5 text-white hover:text-white/80 transition-all duration-300 group"
            >
              {/* Lottie Loop Animated Cart Component */}
              <LottieCartAnimation trigger={cartTriggered} className="w-7 h-7" />

              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center bg-[#5D4B3E] text-white border border-[#5C663D] shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú de navegación"
              className="md:hidden relative w-9 h-9 flex items-center justify-center text-white focus:outline-none"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 transform origin-left ${
                    menuOpen ? "rotate-45 translate-x-0.5 -translate-y-0.5" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-white rounded-full transition-all duration-200 ${
                    menuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 transform origin-left ${
                    menuOpen ? "-rotate-45 translate-x-0.5 translate-y-0.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-16 bg-[#5C663D] text-white animate-slideDown flex flex-col justify-between pb-12">
          <nav className="flex flex-col items-center gap-6 pt-10 px-6">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="font-sans font-bold text-xl uppercase tracking-wider text-white hover:text-white/80 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/tienda"
              onClick={() => setMenuOpen(false)}
              className="font-sans font-bold text-xl uppercase tracking-wider text-white hover:text-white/80 transition-colors"
            >
              Tienda
            </Link>
            <Link
              href="/como-curar-tu-mate"
              onClick={() => setMenuOpen(false)}
              className="font-sans font-bold text-xl uppercase tracking-wider text-white hover:text-white/80 transition-colors"
            >
              Cómo Curar tu Mate
            </Link>
            <Link
              href="/sobre-nosotros"
              onClick={() => setMenuOpen(false)}
              className="font-sans font-bold text-xl uppercase tracking-wider text-white hover:text-white/80 transition-colors"
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/contacto"
              onClick={() => setMenuOpen(false)}
              className="font-sans font-bold text-xl uppercase tracking-wider text-white hover:text-white/80 transition-colors"
            >
              Contacto
            </Link>
          </nav>

          <div className="text-center text-xs text-white/80">
            Mates del Valle · Embalse, Córdoba
          </div>
        </div>
      )}
    </>
  );
}
