"use client";

import Link from "next/link";
import { Product, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-stone-950 border border-stone-800 hover:border-amber-800 transition-colors rounded-sm overflow-hidden">
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10 bg-amber-400 text-black text-xs font-bold px-2 py-1 tracking-wider">
          {product.badgeKo}
        </div>
      )}

      {/* Image Placeholder */}
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative h-64 bg-gradient-to-br from-stone-900 to-stone-800 overflow-hidden">
          {/* Decorative hematite-inspired graphic */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-stone-600 via-stone-500 to-stone-700 shadow-2xl opacity-80 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tl from-stone-400 to-stone-600 opacity-60" />
            <div className="absolute w-8 h-8 rounded-full bg-white/20 top-16 left-[calc(50%+10px)]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-stone-500 text-xs tracking-wider uppercase mb-1">
          {product.categoryKo}
        </p>
        <Link href={`/shop/${product.id}`}>
          <h3 className="text-stone-100 font-medium text-sm leading-snug mb-1 hover:text-amber-400 transition-colors">
            {product.nameKo}
          </h3>
          <p className="text-stone-500 text-xs mb-3">{product.name}</p>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-amber-400 font-semibold text-base">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="text-xs bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-black border border-amber-800 hover:border-amber-400 px-3 py-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {product.inStock ? "담기" : "품절"}
          </button>
        </div>
      </div>
    </div>
  );
}
