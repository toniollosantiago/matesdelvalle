import { ProductCard } from "@/components/catalog/ProductCard";
import CategoryFilterMobile from "@/components/catalog/CategoryFilterMobile";
import { prisma } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Tienda — Mates, Bombillas y Combos",
  description:
    "Explorá el catálogo completo de Mates del Valle: mates artesanales, bombillas y combos a precios accesibles.",
};

const INITIAL_CATALOG = [
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

interface PageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function TiendaPage({ searchParams }: PageProps) {
  const { categoria } = await searchParams;

  let products = INITIAL_CATALOG;
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        inStock: true,
        ...(categoria ? { categorySlug: categoria } : {}),
      },
      orderBy: { createdAt: "asc" },
    });
    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        images: typeof p.images === 'string' ? p.images : JSON.stringify(p.images),
        categorySlug: p.categorySlug,
        slug: p.slug,
        description: p.description || '',
        inStock: p.inStock,
      }));
    }
  } catch (e) {
    console.error("Fallback a catálogo local en TiendaPage:", e);
  }

  if (categoria) {
    products = products.filter((p) => p.categorySlug === categoria);
  }

  const totalCount = products.length;
  const SIDEBAR_CATS = [
    { slug: "", label: "Todos", href: "/tienda", count: totalCount },
    { slug: "mates", label: "Mates", href: "/tienda/mates", count: products.filter(p => p.categorySlug === "mates").length },
    { slug: "bombillas", label: "Bombillas", href: "/tienda/bombillas", count: products.filter(p => p.categorySlug === "bombillas").length },
    { slug: "combos", label: "Combos", href: "/tienda/combos", count: products.filter(p => p.categorySlug === "combos").length },
  ];

  return (
    <div className="bg-background text-on-background font-sans antialiased min-h-screen flex flex-col">
      <main className="flex-grow pt-20 pb-16 px-3 sm:px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 text-center md:text-left">
          <h1 className="font-sans font-bold text-2xl md:text-4xl text-earth-brown uppercase tracking-tight mb-1">
            Mates y Accesorios
          </h1>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-2xl">
            Colección de mates artesanales, bombillas y combos para tu día a día.
          </p>
        </div>

        <div className="lg:hidden mb-4">
          <CategoryFilterMobile categories={SIDEBAR_CATS} currentCategory={categoria ?? ""} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="hidden lg:block w-60 flex-shrink-0 bg-white p-5 rounded-xl border border-washed-sky rustic-shadow">
            <h3 className="font-sans font-bold text-xs text-earth-brown mb-3 uppercase tracking-widest">
              Categorías
            </h3>
            <ul className="space-y-2 font-sans text-xs text-on-surface-variant">
              {SIDEBAR_CATS.map((cat) => {
                const isActive = (categoria ?? "") === cat.slug;
                return (
                  <li key={cat.slug}>
                    <Link
                      href={cat.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#697552] text-white font-bold"
                          : "hover:bg-gray-100 text-on-surface-variant"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-current">
                        {cat.count}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="w-full">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-washed-sky/50">
              <span className="font-sans text-xs text-on-surface-variant">
                Mostrando {products.length} producto{products.length !== 1 ? "s" : ""}
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-sans text-sm text-on-surface-variant">
                  No hay productos en esta categoría por el momento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      images: product.images,
                      categorySlug: product.categorySlug,
                      slug: product.slug,
                      description: product.description || "",
                      inStock: product.inStock,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
