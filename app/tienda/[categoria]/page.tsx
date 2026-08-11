import { ProductCard } from "@/components/catalog/ProductCard";
import { getCatalogProducts } from "@/lib/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const VALID_CATEGORIES = ["mates", "bombillas", "combos"] as const;
type ValidCategory = (typeof VALID_CATEGORIES)[number];
const CATEGORY_LABELS: Record<ValidCategory, string> = {
  mates: "Mates",
  bombillas: "Bombillas",
  combos: "Combos",
};

export const revalidate = 300; // Cachear categoría por 5 minutos (ISR)

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((cat) => ({ categoria: cat }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const label = CATEGORY_LABELS[categoria as ValidCategory] ?? categoria;
  return {
    title: `${label} — Mates del Valle`,
    description: `Comprá ${label.toLowerCase()} artesanales a buen precio. Mates del Valle — Embalse, Córdoba.`,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  if (!VALID_CATEGORIES.includes(categoria as ValidCategory)) notFound();

  const products = await getCatalogProducts(categoria);

  const label = CATEGORY_LABELS[categoria as ValidCategory];

  const SIDEBAR_CATS = [
    { slug: "", label: "Todos", href: "/tienda" },
    { slug: "mates", label: "Mates", href: "/tienda/mates" },
    { slug: "bombillas", label: "Bombillas", href: "/tienda/bombillas" },
    { slug: "combos", label: "Combos", href: "/tienda/combos" },
  ];

  return (
    <div className="bg-background text-on-background font-sans antialiased min-h-screen flex flex-col">
      <main className="flex-grow pt-20 pb-16 px-3 sm:px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="mb-8 text-center md:text-left">
          <h1 className="font-sans font-bold text-3xl md:text-4xl text-earth-brown uppercase tracking-tight mb-2">
            {label}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant">
            {products.length} producto{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="w-full lg:w-60 flex-shrink-0 bg-white p-5 rounded-xl border border-washed-sky">
            <h3 className="font-sans font-bold text-xs text-earth-brown mb-3 uppercase tracking-widest">
              Categorías
            </h3>
            <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 font-sans text-xs text-on-surface-variant">
              {SIDEBAR_CATS.map((cat) => (
                <li key={cat.slug} className="shrink-0">
                  <Link
                    href={cat.href}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg border lg:border-none transition-colors ${
                      categoria === cat.slug
                        ? "bg-[#6c7a52] text-white lg:bg-transparent lg:text-[#6c7a52] lg:font-bold"
                        : "bg-gray-50 border-gray-200 lg:bg-transparent hover:text-[#6c7a52]"
                    }`}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="w-full">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-washed-sky/50">
              <span className="font-sans text-xs text-on-surface-variant">
                Mostrando {products.length} productos
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
                      description: product.description,
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
