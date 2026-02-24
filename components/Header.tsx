"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const navLinks = [
  { href: "/", label: "홈", labelEn: "Home" },
  { href: "/shop", label: "쇼핑", labelEn: "Shop" },
  { href: "/about", label: "소개", labelEn: "About" },
  { href: "/contact", label: "문의", labelEn: "Contact" },
];

export default function Header() {
  const { totalItems, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-amber-400 font-bold text-xl tracking-widest">
              심석
            </span>
            <span className="text-stone-400 text-xs tracking-[0.3em] uppercase">
              SIMSUK
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-stone-300 hover:text-amber-400 transition-colors text-sm tracking-wider"
              >
                <span className="mr-1">{link.label}</span>
                <span className="text-stone-500 text-xs">{link.labelEn}</span>
              </Link>
            ))}
          </nav>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={openCart}
              className="relative text-stone-300 hover:text-amber-400 transition-colors"
              aria-label="장바구니 열기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.962-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-stone-300 hover:text-amber-400"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="메뉴 토글"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-stone-800">
          <nav className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-stone-300 hover:text-amber-400 transition-colors py-2 border-b border-stone-900"
              >
                <span className="mr-2">{link.label}</span>
                <span className="text-stone-500 text-sm">{link.labelEn}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
