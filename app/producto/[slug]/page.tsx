import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseImages, formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/catalog/AddToCartButton";
import ProductGallery from "@/components/catalog/ProductGallery";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: `${product.name} — Mates del Valle`,
    description:
      product.description ||
      `Comprá ${product.name} en Mates del Valle. Embalse, Calamuchita, Córdoba.`,
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const images = parseImages(product!.images);
  const mainImage = images[0] || "/images/Mate Camionero criollo de Calabaza.png";

  return (
    <div className="bg-background text-on-surface font-sans antialiased min-h-screen">
      <main className="pt-20 pb-16 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto">
        {/* Volver */}
        <Link
          href="/tienda"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#5C663D] hover:underline mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a la tienda
        </Link>

        {/* Product Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
          {/* Gallery */}
          <div className="col-span-1 md:col-span-7">
            <ProductGallery images={images} productName={product!.name} />
          </div>

          {/* Details Column */}
          <div className="col-span-1 md:col-span-5 flex flex-col justify-start space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#5C663D] block mb-1">
                {product!.categorySlug}
              </span>
              <h1 className="font-sans font-bold text-xl sm:text-3xl text-earth-brown leading-tight">
                {product!.name}
              </h1>
            </div>

            <div className="py-2.5 border-y border-washed-sky/60 flex items-center justify-between">
              <span className="text-2xl font-extrabold text-[#2B2B2B]">
                {formatPrice(product!.price)} ARS
              </span>
              <span className="text-xs font-bold text-[#5C663D] bg-secondary-container px-3 py-1 rounded-full uppercase tracking-wider">
                Disponible
              </span>
            </div>

            {product!.description && (
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {product!.description}
              </p>
            )}

            {/* BOTÓN PRINCIPAL: AGREGAR AL CARRITO (Marrón #5D4B3E) */}
            <div className="pt-2">
              <AddToCartButton
                product={{
                  id: product!.id,
                  name: product!.name,
                  price: product!.price,
                  image: mainImage,
                  slug: product!.slug,
                }}
              />
            </div>

            {/* Ventajas sin la oración removida (Punto 4) */}
            <div className="pt-4 border-t border-washed-sky/60 space-y-2.5 text-xs font-medium text-on-surface-variant">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#5C663D] shrink-0" />
                <span>Envíos coordinados a todo el país vía WhatsApp al finalizar.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#5C663D] shrink-0" />
                <span>Pago por transferencia o efectivo al coordinar.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
