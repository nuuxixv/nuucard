"use client";

import { POSTCARDS } from "@/lib/constants";
import MagnifierImage from "./MagnifierImage";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";

export default function Gallery() {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="w-full flex flex-col items-center bg-background">
      {POSTCARDS.map((card, index) => (
        <div key={card.id} className="w-full min-h-screen flex flex-col items-center justify-center py-20 sticky top-0 bg-background z-0">

          {/* Image Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-md aspect-[3/4] overflow-hidden mb-8"
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
