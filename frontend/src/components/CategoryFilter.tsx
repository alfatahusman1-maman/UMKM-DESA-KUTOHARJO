"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  function selectCategory(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button
        type="button"
        onClick={() => selectCategory(null)}
        className={`whitespace-nowrap px-4 py-2 rounded-md text-xs font-semibold transition-all ${
          !active
            ? "bg-slate-900 text-white shadow-2xs"
            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950"
        }`}
      >
        Semua Kategori
      </button>
      {(Array.isArray(categories) ? categories : []).map((cat) => (
        <button
          type="button"
          key={cat.slug}
          onClick={() => selectCategory(cat.slug)}
          className={`whitespace-nowrap px-4 py-2 rounded-md text-xs font-semibold transition-all ${
            active === cat.slug
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
