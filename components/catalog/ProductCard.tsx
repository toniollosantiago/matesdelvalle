"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { parseImages, formatPrice } from "@/lib/format";
import { ShoppingCart } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  images: unknown;
  categorySlug: string;
  slug: string;
  description?: string | null;
  inStock?: boolean;
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const imageList = parseImages(product.images);
  const image = imageList[0] || "/images/Mate Camionero criollo de Calabaza.png";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    window.dispatchEvent(new CustomEvent("cart-item-added"));
  };

  return (
    <article className="bg-white border border-washed-sky rounded-xl overflow-hidden group hover:border-[#5C663D] transition-all duration-300 rustic-shadow flex flex-col h-full">
      <Link
        href={`/producto/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-[#f5f3ef] block"
      >
        <Image
          src={image}
          alt={product.name}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.inStock === false && (
          <span className="absolute top-2 left-2 bg-[#5D4B3E] text-white font-sans text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10">
            Sin stock
          </span>
        )}
      </Link>

      <div className="p-3 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-[9px] sm:text-[10px] font-bold text-[#5C663D] uppercase tracking-widest block mb-1">
            {product.categorySlug}
          </span>
          <Link href={`/producto/${product.slug}`}>
            <h2 className="font-sans font-bold text-xs sm:text-base text-earth-brown leading-snug mb-2 group-hover:text-[#5C663D] transition-colors line-clamp-2">
              {product.name}
            </h2>
          </Link>
        </div>

        <div className="pt-2.5 mt-auto border-t border-washed-sky/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <p className="font-sans text-xs sm:text-base font-extrabold text-[#2B2B2B]">
            {formatPrice(product.price)} ARS
          </p>
          <button
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            className={`font-sans text-[10px] sm:text-xs font-bold py-2 px-3 rounded transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider shadow-sm cursor-pointer ${
              added
                ? "bg-emerald-600 text-white scale-105"
                : "bg-[#5D4B3E] text-white hover:bg-[#4A3B32]"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {added ? "✓ Agregado" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}
