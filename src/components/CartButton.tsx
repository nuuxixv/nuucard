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
      className="fixed top-6 right-6 z-50 text-foreground text-xs font-editorial uppercase tracking-widest group mix-blend-difference"
    >
      <span className="relative">
        BAG ({totalItems})
        <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </span>
    </button>
  );
}
