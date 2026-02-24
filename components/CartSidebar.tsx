"use client";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-stone-950 border-l border-stone-800 z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-800">
          <div>
            <h2 className="text-stone-100 font-semibold tracking-wider">장바구니</h2>
            <p className="text-stone-500 text-xs">Shopping Cart</p>
          </div>
          <button
            onClick={closeCart}
            className="text-stone-400 hover:text-amber-400 transition-colors"
            aria-label="닫기"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-stone-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.962-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </div>
              <p className="text-stone-400 text-sm">장바구니가 비어 있습니다</p>
              <p className="text-stone-600 text-xs mt-1">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 bg-stone-900 border border-stone-800"
              >
                {/* Product visual */}
                <div className="w-16 h-16 bg-gradient-to-br from-stone-700 to-stone-600 flex-shrink-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-400 to-stone-600 opacity-80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-stone-200 text-sm font-medium truncate">
                    {item.product.nameKo}
                  </p>
                  <p className="text-amber-400 text-sm font-semibold mt-1">
                    {formatPrice(item.product.price)}
                  </p>
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 border border-stone-700 text-stone-400 hover:text-amber-400 hover:border-amber-700 text-xs flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-stone-300 text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 border border-stone-700 text-stone-400 hover:text-amber-400 hover:border-amber-700 text-xs flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-stone-600 hover:text-red-400 transition-colors flex-shrink-0 self-start"
                  aria-label="삭제"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-stone-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-400 text-sm">합계 Total</span>
              <span className="text-amber-400 font-bold text-lg">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <button className="w-full bg-amber-400 text-black font-bold py-3 hover:bg-amber-300 transition-colors tracking-wider text-sm">
              주문하기 · Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full text-stone-500 hover:text-stone-300 text-xs py-1 transition-colors"
            >
              장바구니 비우기 · Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
