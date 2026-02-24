"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, products, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { use, useState } from "react";
import ProductCard from "@/components/ProductCard";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params);
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}

function ProductDetail({ product }: { product: NonNullable<ReturnType<typeof getProductById>> }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-stone-950 border-b border-stone-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              홈
            </Link>
            <span>›</span>
            <Link href="/shop" className="hover:text-amber-400 transition-colors">
              쇼핑
            </Link>
            <span>›</span>
            <span className="text-stone-300">{product.nameKo}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Product Visual */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-stone-900 to-stone-800 border border-stone-800 flex items-center justify-center relative overflow-hidden">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-stone-600 via-stone-500 to-stone-700 shadow-2xl opacity-80" />
              <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tl from-stone-400 to-stone-600 opacity-60" />
              <div className="absolute w-12 h-12 rounded-full bg-white/20 top-1/3 left-[45%]" />
              {product.badge && (
                <div className="absolute top-6 left-6 bg-amber-400 text-black text-sm font-bold px-3 py-1.5 tracking-wider">
                  {product.badgeKo}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-2">
              {product.categoryKo} · {product.category}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-100 mb-1">
              {product.nameKo}
            </h1>
            <p className="text-stone-500 text-sm mb-6">{product.name}</p>

            <div className="text-3xl font-bold text-amber-400 mb-8">
              {formatPrice(product.price)}
            </div>

            <p className="text-stone-400 leading-relaxed mb-4">
              {product.descriptionKo}
            </p>
            <p className="text-stone-600 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Details */}
            <div className="border-t border-stone-800 pt-6 mb-8">
              <h3 className="text-stone-300 font-semibold text-sm mb-4 tracking-wider uppercase">
                상세 정보 · Details
              </h3>
              <ul className="space-y-2">
                {product.detailsKo.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-400">
                    <span className="text-amber-600 mt-0.5">✦</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart */}
            {product.inStock ? (
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 font-bold tracking-widest text-sm uppercase transition-all ${
                  added
                    ? "bg-stone-800 text-amber-400 border border-amber-800"
                    : "bg-amber-400 text-black hover:bg-amber-300"
                }`}
              >
                {added ? "✓ 담겼습니다 · Added!" : "장바구니에 담기 · Add to Cart"}
              </button>
            ) : (
              <button
                disabled
                className="w-full py-4 bg-stone-900 text-stone-600 font-bold tracking-widest text-sm cursor-not-allowed"
              >
                품절 · Out of Stock
              </button>
            )}

            <p className="text-stone-600 text-xs text-center mt-4">
              무료 배송 (5만원 이상) · Free shipping on orders over ₩50,000
            </p>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-stone-100 mb-8">
              같은 카테고리 상품{" "}
              <span className="text-stone-500 text-lg font-normal ml-2">
                More {product.categoryKo}
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
