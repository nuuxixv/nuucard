"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagnifierImageProps {
  src: string;
  highResSrc: string; // 돋보기에 사용할 고화질 이미지
  alt: string;
  className?: string;
}

export default function MagnifierImage({ src, highResSrc, alt, className }: MagnifierImageProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
  };

  return (
    <div
      ref={imageRef}
      className={cn("relative overflow-hidden cursor-none group", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {/* 원본 이미지 */}
      <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 돋보기 효과 오버레이 */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute pointer-events-none z-20 w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-white/50 shadow-2xl bg-no-repeat"
            style={{
              left: `calc(${position.x}% - 6rem)`, // w-48(12rem)의 절반인 6rem (모바일 w-32는 조정 필요하지만 일단 데스크탑 기준)
              top: `calc(${position.y}% - 6rem)`,
              backgroundImage: `url(${highResSrc})`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundSize: "250%", // 2.5배 확대
            }}
          />
        )}
      </AnimatePresence>
      
      {/* 커스텀 커서 가이드 (선택 사항) */}
      {isHovering && (
        <div 
            className="absolute pointer-events-none z-30 text-white text-xs font-medium drop-shadow-md"
            style={{
                left: `calc(${position.x}% + 4rem)`,
                top: `calc(${position.y}% + 4rem)`,
            }}
        >
            ZOOM
        </div>
      )}
    </div>
  );
}
