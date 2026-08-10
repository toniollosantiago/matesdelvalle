"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, X, Check } from "lucide-react";

interface CategoryItem {
  slug: string;
  label: string;
  href: string;
  count: number;
}

export default function CategoryFilterMobile({
  categories,
  currentCategory,
}: {
  categories: CategoryItem[];
  currentCategory: string;
}) {
  const [open, setOpen] = useState(false);

  const activeLabel =
    categories.find((c) => c.slug === currentCategory)?.label || "Todas las categorías";

  return (
    <div className="w-full">
      {/* Botón de Filtro Mobile Limpio */}
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2.5 px-4 bg-white border border-washed-sky rounded-xl text-xs font-bold text-earth-brown uppercase tracking-wider flex items-center justify-between shadow-sm active:scale-98 transition-all"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#697552]" />
          <span>Filtrar: {activeLabel}</span>
        </div>
        <span className="text-[10px] bg-[#697552] text-white px-2 py-0.5 rounded-full">
          Cambiar
        </span>
      </button>

      {/* Modal / Accordion de Filtros en Celular */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-4 shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between border-b border-washed-sky pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#697552]" />
                <h3 className="font-sans font-bold text-sm text-earth-brown uppercase tracking-wider">
                  Filtrar por Categoría
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 py-2">
              {categories.map((cat) => {
                const isActive = currentCategory === cat.slug;
                return (
                  <Link
                    key={cat.slug}
                    href={cat.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? "bg-[#697552] text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-earth-brown"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isActive && <Check className="w-4 h-4" />}
                      <span>{cat.label}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
