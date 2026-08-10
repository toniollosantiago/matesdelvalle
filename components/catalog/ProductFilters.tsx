"use client";

import Link from "next/link";

interface Category {
  slug: string;
  label: string;
}

interface ProductFiltersProps {
  categories: Category[];
  activeCategory: string;
}

export function ProductFilters({ categories, activeCategory }: ProductFiltersProps) {
  return (
    <div className="flex gap-2 py-3 overflow-x-auto scrollbar-none">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        const href = cat.slug ? `/tienda/${cat.slug}` : "/tienda";

        return (
          <Link
            key={cat.slug}
            href={href}
            className="shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border"
            style={{
              backgroundColor: isActive ? "#2E5266" : "transparent",
              color: isActive ? "#EDE4D3" : "#8C8478",
              borderColor: isActive ? "#2E5266" : "#D4C9B0",
            }}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
