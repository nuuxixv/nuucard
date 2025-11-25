"use client";

import { POSTCARDS } from "@/lib/constants";
import MagnifierImage from "./MagnifierImage";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";

export default function Gallery() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (imageSrc: string) => {
    timerRef.current = setTimeout(() => {
      setZoomedImage(imageSrc);
    }, 300); // 0.3초 롱프레스
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setZoomedImage(null);
  };

  return (
    <div className="w-full flex flex-col items-center bg-background">
      {/* Mobile Zoom Overlay */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center pointer-events-none"
          >
            <div className="relative w-full h-full">
              <Image
                src={zoomedImage}
                alt="Zoomed"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {POSTCARDS.map((card, index) => (
        <div key={card.id} className="w-full min-h-screen flex flex-col items-center justify-center py-20 sticky top-0 bg-background z-0">

          {/* Image Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full md:w-[80vw] lg:w-[60vw] aspect-[3/4] overflow-hidden mb-8"
            onTouchStart={() => handleTouchStart(card.highResImage)}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchEnd} // 스크롤 시 취소
          >
            <MagnifierImage
              src={card.image}
              highResSrc={card.highResImage}
              alt={card.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Editorial Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center space-y-3"
          >
            <h3 className="text-sm font-editorial font-medium uppercase tracking-widest text-foreground">
              {card.title}
            </h3>
            <p className="text-xs text-muted font-light uppercase tracking-wider">
              KRW {card.price.toLocaleString()}
            </p>

            <button
              onClick={() => addToCart(card)}
              className="mt-4 text-xs font-light border-b border-foreground/50 pb-0.5 hover:border-foreground hover:opacity-70 transition-all uppercase tracking-widest"
            >
              Add to Bag
            </button>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
