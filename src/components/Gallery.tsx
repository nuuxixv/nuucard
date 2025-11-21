"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";

import { POSTCARDS, POSTCARD_BACK_IMAGE } from "@/lib/constants";
import MagnifierImage from "./MagnifierImage";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw } from "lucide-react";
import Image from "next/image";

export default function Gallery() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (cardId: string) => {
    setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <div className="w-full h-full flex items-center justify-center py-10">
      <Swiper
        modules={[Mousewheel, Keyboard, EffectCreative]}
        direction="horizontal"
        slidesPerView={1.2}
        centeredSlides={true}
        spaceBetween={20}
        mousewheel={{ forceToAxis: true }}
        keyboard={{ enabled: true }}
        speed={800}
        effect="creative"
        creativeEffect={{
          prev: {
            translate: ["-20%", 0, -1],
            opacity: 0.5,
            scale: 0.9,
          },
          next: {
            translate: ["100%", 0, 0],
            opacity: 1,
            scale: 1,
          },
        }}
        breakpoints={{
          640: {
            slidesPerView: 1.5,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2.2,
            spaceBetween: 60,
            creativeEffect: {
                prev: {
                    translate: ["-30%", 0, -1],
                    opacity: 0.6,
                    scale: 0.85,
                },
                next: {
                    translate: ["100%", 0, 0],
                }
            }
          },
        }}
        className="w-full max-w-6xl h-[60vh] md:h-[70vh]"
      >
        {POSTCARDS.map((card) => (
          <SwiperSlide key={card.id} className="flex flex-col items-center justify-center relative">
            {({ isActive }) => (
              <motion.div
                animate={{
                  scale: isActive ? 1 : 0.9,
                  opacity: isActive ? 1 : 0.5,
                  filter: isActive ? "blur(0px)" : "blur(2px)",
                }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md aspect-[3/4] bg-white shadow-xl p-4 rotate-1"
                style={{ perspective: "1000px" }}
              >
                {/* Flip Container */}
                <motion.div
                  className="relative w-full h-full"
                  animate={{ rotateY: flippedCards[card.id] ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front Side */}
                  <div
                    className="absolute inset-0 overflow-hidden bg-gray-100"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <MagnifierImage
                      src={card.image}
                      highResSrc={card.highResImage}
                      alt={card.title}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Back Side */}
                  <div
                    className="absolute inset-0 overflow-hidden bg-gray-100"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <Image
                      src={POSTCARD_BACK_IMAGE}
                      alt="Postcard Back"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                {/* Flip Button */}
                {isActive && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => toggleFlip(card.id)}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                    aria-label="Flip card"
                  >
                    <RotateCcw size={18} className="text-[#1A1A1A]" />
                  </motion.button>
                )}

                {/* Card Info (활성화될 때만 표시) */}
                {isActive && !flippedCards[card.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -bottom-24 left-0 right-0 text-center"
                  >
                    <h3 className="text-2xl font-heading italic mb-1">{card.title}</h3>
                    <p className="text-muted mb-4 text-sm">{card.description}</p>
                    
                    <div className="flex items-center justify-center gap-4">
                        <span className="text-lg font-medium">{card.price.toLocaleString()}원</span>
                        <button
                        onClick={() => addToCart(card)}
                        className="bg-accent text-white p-3 rounded-full hover:bg-[#C08E5E] transition-colors shadow-lg active:scale-95"
                        aria-label="Add to cart"
                        >
                        <Plus size={20} />
                        </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
