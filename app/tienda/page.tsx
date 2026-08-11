import { ProductCard } from "@/components/catalog/ProductCard";
import CategoryFilterMobile from "@/components/catalog/CategoryFilterMobile";
import { getCatalogProducts } from "@/lib/catalog";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 300; // Cachear tienda por 5 minutos (ISR)

export const metadata: Metadata = {
  title: {
    absolute: "Mates del Valle",
  },
  description:
    "Explorá el catálogo completo de Mates del Valle: mates artesanales, bombillas y combos a precios accesibles.",
};

export default async function TiendaPage() {
  const products = await getCatalogProducts();

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
          <CategoryFilterMobile categories={SIDEBAR_CATS} currentCategory="" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="hidden lg:block w-60 flex-shrink-0 bg-white p-5 rounded-xl border border-washed-sky rustic-shadow">
            <h3 className="font-sans font-bold text-xs text-earth-brown mb-3 uppercase tracking-widest">
              Categorías
            </h3>
            <ul className="space-y-2 font-sans text-xs text-on-surface-variant">
              {SIDEBAR_CATS.map((cat) => {
                const isActive = "" === cat.slug;
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
