import { prisma } from "@/lib/db";

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  images: string;
  categorySlug: string;
  slug: string;
  description: string | null;
  inStock: boolean;
}

export const INITIAL_CATALOG: CatalogProduct[] = [
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

export async function getCatalogProducts(categorySlug?: string): Promise<CatalogProduct[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        inStock: true,
        ...(categorySlug ? { categorySlug } : {}),
      },
      orderBy: { createdAt: "asc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        images: typeof p.images === "string" ? p.images : JSON.stringify(p.images),
        categorySlug: p.categorySlug,
        slug: p.slug,
        description: p.description ?? null,
        inStock: p.inStock,
      }));
    }
  } catch (e) {
    console.error("Error consultando catálogo en DB, usando catálogo local:", e);
  }

  return categorySlug
    ? INITIAL_CATALOG.filter((p) => p.categorySlug === categorySlug)
    : INITIAL_CATALOG;
}
