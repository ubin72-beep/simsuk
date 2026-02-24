import Link from "next/link";

const story = [
  {
    year: "2020",
    title: "심석의 시작",
    titleEn: "The Beginning of SIMSUK",
    desc: "창업자 김민준은 한국 여행 중 우연히 만난 헤마타이트의 아름다움에 매료되어 심석을 시작했습니다.",
  },
  {
    year: "2021",
    title: "첫 컬렉션 출시",
    titleEn: "First Collection Launch",
    desc: "클래식 팔찌 컬렉션으로 시작한 심석은 첫 달 500개를 판매하며 큰 호응을 얻었습니다.",
  },
  {
    year: "2022",
    title: "온라인 스토어 오픈",
    titleEn: "Online Store Opens",
    desc: "온라인 스토어를 오픈하며 전국 고객에게 심석의 헤마타이트 액세서리를 선보이기 시작했습니다.",
  },
  {
    year: "2023",
    title: "프리미엄 라인 출시",
    titleEn: "Premium Line Launch",
    desc: "스털링 실버와 헤마타이트의 조합으로 프리미엄 라인을 출시, 더 높은 완성도를 추구합니다.",
  },
];

const values = [
  {
    title: "자연 존중",
    titleEn: "Respect for Nature",
    desc: "지속 가능한 채굴 방식으로 수집된 천연 헤마타이트만을 사용합니다.",
    icon: "🌿",
  },
  {
    title: "장인 정신",
    titleEn: "Artisan Spirit",
    desc: "모든 제품은 숙련된 장인이 직접 손으로 제작합니다.",
    icon: "🔨",
  },
  {
    title: "정직한 가격",
    titleEn: "Fair Pricing",
    desc: "중간 유통 없이 직접 판매하여 합리적인 가격을 제공합니다.",
    icon: "💎",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-stone-950 border-b border-stone-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 text-xs tracking-[0.5em] uppercase mb-4">
            Our Story
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-100 mb-6">
            심석 소개
          </h1>
          <p className="text-stone-400 text-lg leading-relaxed max-w-2xl mx-auto">
            천연 헤마타이트의 아름다움을 더 많은 사람들과 나누기 위해 시작된 이야기.
          </p>
          <p className="text-stone-600 text-sm mt-3">
            A story born from a passion for sharing the beauty of natural hematite.
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Visual */}
            <div className="relative">
              <div className="aspect-square max-w-sm mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-stone-800 to-stone-950 border border-stone-700" />
                <div className="absolute inset-6 rounded-full bg-gradient-to-tl from-stone-600 via-stone-700 to-stone-900 opacity-80" />
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-stone-500 to-stone-700 opacity-70" />
                <div className="absolute inset-28 rounded-full bg-gradient-to-tl from-stone-400 to-stone-600 opacity-60" />
                <div className="absolute top-1/3 left-1/3 w-16 h-16 rounded-full bg-white/10 blur-md" />
              </div>
            </div>
            <div>
              <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-4">
                Brand Philosophy
              </p>
              <h2 className="text-3xl font-bold text-stone-100 mb-6">
                심(深)·석(石)의 의미
              </h2>
              <div className="space-y-4 text-stone-400 leading-relaxed">
                <p>
                  <strong className="text-amber-400">심(深)</strong>은 깊음을, <strong className="text-amber-400">석(石)</strong>은 돌을 의미합니다.
                  심석은 땅 깊숙이 묻혀 있던 헤마타이트 원석이 세상 밖으로 나와
                  아름다운 액세서리가 되는 여정을 담고 있습니다.
                </p>
                <p>
                  우리는 단순한 장신구를 파는 것이 아닌, 수억 년의 지구 역사를 담은
                  천연 광물의 가치를 전합니다.
                </p>
                <p className="text-stone-500 text-sm">
                  <em>Sim (深)</em> means deep, and <em>Seok (石)</em> means stone.
                  SIMSUK embodies the journey of hematite — from deep within the earth
                  to becoming a piece of art you wear every day.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-2xl font-bold text-stone-100 mb-12 text-center">
              브랜드 여정 <span className="text-stone-500 text-lg font-normal ml-2">Our Journey</span>
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-800 hidden md:block" />
              <div className="space-y-12">
                {story.map((item, i) => (
                  <div
                    key={item.year}
                    className={`relative flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className={`md:w-1/2 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div className="text-amber-400 text-3xl font-bold mb-1">{item.year}</div>
                      <h3 className="text-stone-200 font-semibold mb-1">{item.title}</h3>
                      <p className="text-stone-500 text-xs mb-2">{item.titleEn}</p>
                      <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 border-4 border-black" />
                    <div className="md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-xs tracking-[0.5em] uppercase mb-3">
              Our Values
            </p>
            <h2 className="text-3xl font-bold text-stone-100">심석의 가치</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-stone-900 border border-stone-800 p-8 text-center hover:border-amber-800 transition-colors"
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-stone-200 font-semibold mb-1">{v.title}</h3>
                <p className="text-stone-600 text-xs mb-4">{v.titleEn}</p>
                <p className="text-stone-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-stone-100 mb-4">
            심석의 헤마타이트를 만나보세요
          </h2>
          <p className="text-stone-500 mb-8">
            Discover the timeless beauty of SIMSUK hematite jewelry.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-amber-400 text-black font-bold px-8 py-4 hover:bg-amber-300 transition-colors tracking-widest text-sm uppercase"
          >
            쇼핑하기 · Shop Now
          </Link>
        </div>
      </section>
    </>
  );
}
