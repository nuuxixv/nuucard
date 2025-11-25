"use client";

import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Header() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        return scrollY.onChange((latest) => {
            const shouldBeScrolled = latest > 100; // 100px 이상 스크롤 시 이동
            if (isScrolled !== shouldBeScrolled) {
                setIsScrolled(shouldBeScrolled);
            }
        });
    }, [scrollY, isScrolled]);

    return (
        <>
            {/* 1. Background Bar - 스크롤 시 위에서 내려옴 */}
            <AnimatePresence>
                {isScrolled && (
                    <motion.div
                        className="fixed top-0 left-0 w-full h-[80px] bg-background/80 backdrop-blur-md border-b border-foreground/5 z-40"
                        initial={{ y: "-100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    />
                )}
            </AnimatePresence>

            {/* 2. Logo Text - Fixed Position, Animates Top/Size/Color */}
            <motion.header
                className="fixed left-0 w-full z-50 flex justify-center items-center pointer-events-none"
                initial={false}
                animate={{
                    top: isScrolled ? "0%" : "40%", // 상단 0% (중앙 정렬을 위해 padding으로 조절) vs 화면 중앙 40%
                    height: isScrolled ? "80px" : "auto", // 헤더 높이 맞춤
                }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
            >
                <motion.h1
                    layout
                    className="font-editorial font-bold uppercase tracking-tighter whitespace-nowrap leading-none pointer-events-auto"
                    animate={{
                        fontSize: isScrolled ? "1.5rem" : "5rem",
                        color: isScrolled ? "#111111" : "#FFFFFF",
                    }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                    nuuxixv
                </motion.h1>
            </motion.header>
        </>
    );
}
