import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseImages, formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/catalog/AddToCartButton";
import ProductGallery from "@/components/catalog/ProductGallery";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Mate Camionero criollo de Calabaza",
    price: 13000,
    images: JSON.stringify(["/images/Mate Camionero criollo de Calabaza.png"]),
    categorySlug: "mates",
    slug: "mate-camionero-criollo-calabaza",
    description: "Mate camionero de calabaza seleccionada con virola lisa de acero.",
    inStock: true,
  },
  {
    id: "prod-2",
    name: "Mate Camionero Calabaza Liso con Virola de Acero",
    price: 18000,
    images: JSON.stringify(["/images/Mate Camionero Calabaza Liso con Virola de Acero.png"]),
    categorySlug: "mates",
    slug: "mate-camionero-calabaza-virola-acero",
    description: "Mate camionero clásico de calabaza con virola lisa de acero.",
    inStock: true,
  },
  {
    id: "prod-3",
    name: "Mate Camionero chico Calabaza Liso con Virola de Acero",
    price: 12000,
    images: JSON.stringify(["/images/Mate Camionero chico Calabaza Liso con Virola de Acero.png"]),
    categorySlug: "mates",
    slug: "mate-camionero-chico-calabaza",
    description: "Mate camionero chico ideal para uso diario.",
    inStock: true,
  },
  {
    id: "prod-4",
    name: "Mate Camionero Calabaza Liso con Virola de Acero Cincelada",
    price: 18000,
    images: JSON.stringify(["/images/Mate Camionero Calabaza Liso con Virola de Acero Cincelada.png"]),
    categorySlug: "mates",
    slug: "mate-camionero-virola-cincelada",
    description: "Mate camionero con virola trabajada y cincelada.",
    inStock: true,
  },
  {
    id: "prod-5",
    name: "Mate Camionero de Algarrobo Virola de Acero",
    price: 12000,
    images: JSON.stringify(["/images/Mate Camionero de Algarrobo Virola de Acero.png"]),
    categorySlug: "mates",
    slug: "mate-camionero-algarrobo",
    description: "Mate de algarrobo macizo con virola de acero.",
    inStock: true,
  },
  {
    id: "prod-6",
    name: "Bombillas (surtido de modelos)",
    price: 4000,
    images: JSON.stringify(["/images/Bombillas.png"]),
    categorySlug: "bombillas",
    slug: "bombillas-surtido",
    description: "Bombillas de alpaca y acero inoxidable surtidas.",
    inStock: true,
  },
  {
    id: "prod-7",
    name: "COMBO 1: Mate Camionero Calabaza Liso + Bombilla Pico de Loro",
    price: 22000,
    images: JSON.stringify(["/images/Mate Camionero Calabaza Liso con Virola de Acero.png"]),
    categorySlug: "combos",
    slug: "combo-1",
    description: "Combo listo para usar con bombilla pico de loro.",
    inStock: true,
  },
  {
    id: "prod-8",
    name: "COMBO 2: Mate Imperial Liso + Bombilla Pico de Loro de Acero",
    price: 22000,
    images: JSON.stringify(["/images/Mate Camionero Calabaza Liso con Virola de Acero Cincelada.png"]),
    categorySlug: "combos",
    slug: "combo-2",
    description: "Combo premium con mate imperial.",
    inStock: true,
  },
  {
    id: "prod-9",
    name: "COMBO 3: Mate Camionero de Algarrobo + Bombilla Chata simple",
    price: 13500,
    images: JSON.stringify(["/images/Mate Camionero de Algarrobo Virola de Acero.png"]),
    categorySlug: "combos",
    slug: "combo-3",
    description: "Combo rústico de algarrobo.",
    inStock: true,
  },
  {
    id: "prod-10",
    name: "COMBO 4: Mate Camionero chico + Bombilla Chata simple",
    price: 14000,
    images: JSON.stringify(["/images/Mate Camionero chico Calabaza Liso con Virola de Acero.png"]),
    categorySlug: "combos",
    slug: "combo-4",
    description: "Combo práctico mate chico.",
    inStock: true,
  },
  {
    id: "prod-11",
    name: "COMBO 5: Mate Camionero criollo de Calabaza + Bombilla Pico de Loro",
    price: 16000,
    images: JSON.stringify(["/images/Mate Camionero criollo de Calabaza.png"]),
    categorySlug: "combos",
    slug: "combo-5",
    description: "Combo tradicional criollo.",
    inStock: true,
  },
];

async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (product) return product;
  } catch (e) {
    console.error("Error consultando producto en DB:", e);
  }
  const found = INITIAL_PRODUCTS.find((p) => p.slug === slug);
  if (found) {
    return {
      ...found,
      description: found.description || null,
      stockQuantity: 10,
      isFeatured: false,
      inHeroLoop: false,
      createdAt: new Date(),
    };
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
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
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = parseImages(product.images);
  const mainImage = images[0] || "/images/Mate Camionero criollo de Calabaza.png";

  return (
    <div className="bg-background text-on-surface font-sans antialiased min-h-screen">
      <main className="pt-20 pb-16 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#5C663D] hover:underline mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a la tienda
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
          <div className="col-span-1 md:col-span-7">
            <ProductGallery images={images} productName={product.name} />
          </div>

          <div className="col-span-1 md:col-span-5 flex flex-col justify-start space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#5C663D] block mb-1">
                {product.categorySlug}
              </span>
              <h1 className="font-sans font-bold text-xl sm:text-3xl text-earth-brown leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="py-2.5 border-y border-washed-sky/60 flex items-center justify-between">
              <span className="text-2xl font-extrabold text-[#2B2B2B]">
                {formatPrice(product.price)} ARS
              </span>
              <span className="text-xs font-bold text-[#5C663D] bg-secondary-container px-3 py-1 rounded-full uppercase tracking-wider">
                Disponible
              </span>
            </div>

            {product.description && (
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="pt-2">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: mainImage,
                  slug: product.slug,
                }}
              />
            </div>

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
