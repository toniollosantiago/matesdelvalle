"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingCart, Check, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [flying, setFlying] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });

    setFlying(true);
    setTimeout(() => setFlying(false), 850);

    window.dispatchEvent(new CustomEvent("cart-item-added"));

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="space-y-3 relative">
      {flying && (
        <div className="fixed z-50 pointer-events-none w-9 h-9 bg-[#5D4B3E] text-white rounded-full flex items-center justify-center shadow-2xl animate-flyToCart top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white">
          <ShoppingCart className="w-4 h-4" />
        </div>
      )}

      <div className="flex gap-2 sm:gap-3">
        <div className="flex items-center border border-washed-sky rounded bg-white">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 sm:w-10 h-10 sm:h-12 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 text-sm sm:text-base"
          >
            -
          </button>
          <span className="w-8 sm:w-10 text-center font-bold text-xs sm:text-sm text-clay-text">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 sm:w-10 h-10 sm:h-12 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 text-sm sm:text-base"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 font-sans font-bold text-[11px] sm:text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
            added
              ? "bg-green-700 text-white"
              : "bg-[#5D4B3E] hover:bg-[#4A3B32] text-white active:scale-95"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              ¡Agregado!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Agregar al carrito
            </>
          )}
        </button>
      </div>

      {added && (
        <div className="p-2.5 bg-green-50 border border-green-200 rounded flex items-center justify-between text-xs text-green-900 animate-fadeIn">
          <span>Producto agregado al carrito.</span>
          <Link
            href="/carrito"
            className="font-bold underline flex items-center gap-1 hover:text-green-950"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Ver Carrito
          </Link>
        </div>
      )}
    </div>
  );
}
