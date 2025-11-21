"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CartButton() {
  const { items, toggleCart } = useCartStore();
  const [isBumping, setIsBumping] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // 아이템이 추가될 때마다 뱃지 애니메이션 트리거
  useEffect(() => {
    if (totalItems > 0) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <button
      onClick={toggleCart}
      className="fixed top-6 right-6 z-30 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow group"
    >
      <ShoppingBag size={24} className="text-[#1A1A1A] group-hover:text-accent transition-colors" />
      
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={{ scale: 0 }}
            animate={{ scale: isBumping ? 1.3 : 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm"
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
