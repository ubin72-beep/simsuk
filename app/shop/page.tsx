"use client";

import { useState, useMemo } from "react";
import { products, categories, getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const filtered = useMemo(() => {
    const base = getProductsByCategory(activeCategory);
    if (sortBy === "price-asc") return [...base].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return [...base].sort((a, b) => b.price - a.price);
    return base;
  }, [activeCategory, sortBy]);

  return (
    <>
      {/* Page Header */}
      <div className="bg-stone-950 border-b border-stone-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-amber-400 text-xs tracking-[0.5em] uppercase mb-3">
            Collection
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-100">
            쇼핑 <span className="text-stone-500 text-2xl font-normal ml-2">Shop</span>
          </h1>
          <p className="text-stone-500 mt-3 text-sm">
            {products.length}개의 천연 헤마타이트 액세서리 · {products.length} natural hematite pieces
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs tracking-wider border transition-colors ${
                  activeCategory === cat.id
                    ? "bg-amber-400 text-black border-amber-400 font-bold"
                    : "bg-transparent text-stone-400 border-stone-700 hover:border-amber-700 hover:text-amber-400"
                }`}
              >
                {cat.nameKo}
                {cat.id !== "all" && (
                  <span className="ml-1 text-xs opacity-60">
                    ({getProductsByCategory(cat.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-stone-950 border border-stone-700 text-stone-400 text-xs px-3 py-2 focus:outline-none focus:border-amber-700"
          >
            <option value="default">기본 순 · Default</option>
            <option value="price-asc">낮은 가격순 · Price: Low</option>
            <option value="price-desc">높은 가격순 · Price: High</option>
          </select>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-500 text-lg">상품이 없습니다</p>
            <p className="text-stone-600 text-sm mt-2">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-500">로딩 중...</div>}>
      <ShopContent />
    </Suspense>
  );
}
