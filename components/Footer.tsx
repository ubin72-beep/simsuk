import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-stone-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="text-amber-400 font-bold text-2xl tracking-widest block">
                심석
              </span>
              <span className="text-stone-400 text-sm tracking-[0.4em] uppercase">
                SIMSUK
              </span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">
              천연 헤마타이트의 자연적인 아름다움을 담은 액세서리 전문 쇼핑몰.
            </p>
            <p className="text-stone-600 text-xs mt-2">
              Natural Hematite Jewelry Online Store
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-stone-300 font-semibold mb-4 tracking-wider uppercase text-sm">
              바로가기
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/shop", label: "쇼핑 Shop" },
                { href: "/about", label: "소개 About" },
                { href: "/contact", label: "문의 Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-500 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-stone-300 font-semibold mb-4 tracking-wider uppercase text-sm">
              연락처
            </h3>
            <ul className="space-y-2 text-sm text-stone-500">
              <li>이메일: hello@simsuk.kr</li>
              <li>카카오: @심석SIMSUK</li>
              <li>운영시간: 평일 10:00–18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone-600 text-xs">
            © 2024 심석(SIMSUK). All rights reserved.
          </p>
          <p className="text-stone-700 text-xs">
            천연 헤마타이트 액세서리 | Natural Hematite Jewelry
          </p>
        </div>
      </div>
    </footer>
  );
}
