"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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
        <motion.header
            className={`fixed left-0 w-full z-50 flex justify-center items-center transition-colors duration-500 ${
                isScrolled ? "top-0 bg-background/80 backdrop-blur-md border-b border-foreground/5" : "top-[40%] bg-transparent"
            }`}
            initial={false}
            animate={{
                top: isScrolled ? "0%" : "40%",
                paddingTop: isScrolled ? "1.5rem" : "0rem",
                paddingBottom: isScrolled ? "1.5rem" : "0rem",
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }} // 부드러운 스프링 애니메이션
        >
            <motion.h1
                layout
                className="font-editorial font-bold uppercase tracking-tighter whitespace-nowrap leading-none pointer-events-auto"
                animate={{
                    fontSize: isScrolled ? "1.5rem" : "5rem", // 스크롤 시 작아짐
                    color: isScrolled ? "#111111" : "#FFFFFF", // 스크롤 시 검정색
                }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
            >
                nuuxixv
            </motion.h1>
        </motion.header>
    );
}
