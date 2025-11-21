"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { useState } from "react";
import CheckoutForm from "./CheckoutForm";
import Receipt from "./Receipt";

type ModalMode = "cart" | "checkout" | "receipt";

export default function CartModal() {
  const { items, isOpen, toggleCart, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const [mode, setMode] = useState<ModalMode>("cart");
  const [orderData, setOrderData] = useState<any>(null);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleClose = () => {
    toggleCart();
    // 모달이 완전히 닫힌 후 상태 초기화
    setTimeout(() => {
      setMode("cart");
      setOrderData(null);
    }, 300);
  };

  const handleCheckoutComplete = async (data: any) => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      setOrderData(data);
      setMode("receipt");
      clearCart();
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("주문 처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#F5F5F0] rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white/50">
              <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                {mode === "cart" && <ShoppingBag size={20} />}
                {mode === "cart" && "Your Cart"}
                {mode === "checkout" && "Checkout"}
                {mode === "receipt" && "Order Complete"}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content based on Mode */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {mode === "cart" && (
                <>
                  <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-muted">
                        <ShoppingBag size={48} className="mb-4 opacity-20" />
                        <p>장바구니가 비어있습니다.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {items.map((item) => (
                          <motion.div
                            layout
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex gap-4 bg-white p-4 rounded-xl shadow-sm"
                          >
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-medium text-lg">{item.title}</h3>
                                <p className="text-sm text-muted">{item.price.toLocaleString()}원</p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 hover:bg-white rounded-full transition-colors"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 hover:bg-white rounded-full transition-colors"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-muted hover:text-red-500 transition-colors p-1"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {items.length > 0 && (
                    <div className="p-6 border-t border-gray-200 bg-white/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-muted">Total</span>
                        <span className="text-2xl font-bold">{totalAmount.toLocaleString()}원</span>
                      </div>
                      <button
                        onClick={() => setMode("checkout")}
                        className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-[#C08E5E] transition-colors shadow-lg active:scale-[0.98]"
                      >
                        주문하기
                      </button>
                    </div>
                  )}
                </>
              )}

              {mode === "checkout" && (
                <CheckoutForm
                  onCancel={() => setMode("cart")}
                  onComplete={handleCheckoutComplete}
                />
              )}

              {mode === "receipt" && orderData && (
                <Receipt
                  orderData={orderData}
                  onClose={handleClose}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
