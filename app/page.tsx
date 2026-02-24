import Link from "next/link";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const featuredIds = [
  "hematite-bracelet-classic",
  "hematite-necklace-pendant",
  "hematite-earrings-drop",
  "hematite-set-premium",
];

const featuredProducts = products.filter((p) => featuredIds.includes(p.id));

const features = [
  {
    icon: "🪨",
    title: "100% 천연 원석",
    titleEn: "100% Natural Stone",
    desc: "엄선된 천연 헤마타이트 원석만을 사용합니다.",
  },
  {
    icon: "✦",
    title: "정교한 세공",
    titleEn: "Fine Craftsmanship",
    desc: "숙련된 장인의 손길로 완성된 정교한 액세서리.",
  },
  {
    icon: "🎁",
    title: "선물 포장",
    titleEn: "Gift Packaging",
    desc: "특별한 선물을 위한 프리미엄 패키징 서비스.",
  },
  {
    icon: "🛡",
    title: "품질 보증",
    titleEn: "Quality Guarantee",
    desc: "모든 제품에 대한 진품 인증 및 품질 보증서 제공.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-stone-900 opacity-40 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-stone-800 opacity-30 blur-3xl" />
        </div>

        {/* Decorative hematite sphere */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
          <div className="relative w-[380px] h-[380px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-stone-700 via-stone-500 to-stone-800 shadow-2xl opacity-70" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-tl from-stone-400 via-stone-600 to-stone-700 shadow-inner opacity-60" />
            <div className="absolute inset-20 rounded-full bg-gradient-to-br from-stone-300 to-stone-600 opacity-50" />
            <div className="absolute top-16 left-24 w-12 h-12 rounded-full bg-white/15 blur-sm" />
            <div className="absolute bottom-24 right-20 w-8 h-8 rounded-full bg-white/10 blur-sm" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <p className="text-amber-400 text-sm tracking-[0.5em] uppercase mb-6">
            Natural Hematite Jewelry
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-stone-100">자연의 힘을</span>
            <br />
            <span className="text-amber-400">담다</span>
          </h1>
          <p className="text-stone-400 text-lg sm:text-xl max-w-lg mb-4 leading-relaxed">
            천연 헤마타이트 원석의 고귀한 아름다움을 일상 속 액세서리로.
          </p>
          <p className="text-stone-600 text-sm mb-10">
            Wear the timeless elegance of natural hematite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/shop"
              className="bg-amber-400 text-black font-bold px-8 py-4 hover:bg-amber-300 transition-colors tracking-widest text-sm uppercase"
            >
              쇼핑하기 · Shop Now
            </Link>
            <Link
              href="/about"
              className="border border-stone-700 text-stone-300 font-medium px-8 py-4 hover:border-amber-700 hover:text-amber-400 transition-colors tracking-wide text-sm"
            >
              브랜드 소개 · Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-y border-stone-900 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-stone-200 font-semibold text-sm mb-1">
                  {f.title}
                </h3>
                <p className="text-stone-600 text-xs mb-2">{f.titleEn}</p>
                <p className="text-stone-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Hematite */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-stone-800 to-stone-950 border border-stone-700" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-stone-600 via-stone-700 to-stone-900 opacity-80" />
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-stone-500 to-stone-700 opacity-70" />
                <div className="absolute inset-24 rounded-full bg-gradient-to-tl from-stone-400 to-stone-600 opacity-60" />
                <div className="absolute top-1/3 left-1/3 w-16 h-16 rounded-full bg-white/10 blur-md" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-amber-400 text-black p-4 text-center">
                <p className="text-2xl font-bold">Fe₂O₃</p>
                <p className="text-xs mt-1 tracking-wider">HEMATITE</p>
              </div>
            </div>
            <div>
              <p className="text-amber-400 text-xs tracking-[0.5em] uppercase mb-4">
                About Hematite
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-100 mb-6 leading-tight">
                헤마타이트란?
              </h2>
              <div className="space-y-4 text-stone-400 leading-relaxed">
                <p>
                  헤마타이트(Hematite)는 산화철(Fe₂O₃)로 이루어진 천연 광물로,
                  그리스어로 &#39;피의 돌&#39;을 의미합니다. 깊고 어두운 금속 광택이 특징이며
                  수천 년 전부터 장신구와 예술품에 활용되어 왔습니다.
                </p>
                <p>
                  심석(SIMSUK)은 이 아름다운 천연 광물을 섬세하게 가공하여
                  현대적 감각의 액세서리로 재탄생시킵니다.
                </p>
                <p className="text-stone-500 text-sm">
                  Hematite is a natural iron oxide mineral known for its deep metallic luster.
                  Revered for centuries, it is now reborn as refined everyday jewelry by SIMSUK.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-block mt-8 text-amber-400 hover:text-amber-300 text-sm tracking-wider border-b border-amber-800 hover:border-amber-400 pb-1 transition-colors"
              >
                더 알아보기 · Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-xs tracking-[0.5em] uppercase mb-3">
              Featured Collection
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-100">
              추천 상품
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-block border border-stone-700 text-stone-300 hover:border-amber-700 hover:text-amber-400 px-8 py-3 text-sm tracking-wider transition-colors"
            >
              전체 보기 · View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-amber-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            특별한 선물을 찾으시나요?
          </h2>
          <p className="text-amber-900 mb-2">Looking for the perfect gift?</p>
          <p className="text-amber-800 text-sm mb-8">
            심석의 선물 세트는 소중한 사람에게 특별한 감동을 드립니다.
          </p>
          <Link
            href="/shop?category=set"
            className="bg-black text-amber-400 font-bold px-8 py-4 hover:bg-stone-900 transition-colors tracking-widest text-sm uppercase"
          >
            선물 세트 보기 · Gift Sets
          </Link>
        </div>
      </section>
    </>
  );
}
