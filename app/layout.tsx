import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";

export const metadata: Metadata = {
  title: "심석(SIMSUK) | 천연 헤마타이트 액세서리",
  description:
    "심석(SIMSUK) - 천연 헤마타이트 액세서리 쇼핑몰 | Natural Hematite Jewelry Online Store. 팔찌, 목걸이, 귀걸이, 반지, 발찌, 세트.",
  keywords: [
    "헤마타이트",
    "hematite",
    "액세서리",
    "jewelry",
    "팔찌",
    "목걸이",
    "귀걸이",
    "심석",
    "SIMSUK",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-black text-stone-100">
        <CartProvider>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
