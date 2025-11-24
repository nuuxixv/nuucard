"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function Header() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll ranges
    const scrollRange = [0, 300];

    // Transformations
    const headerBg = useTransform(
        scrollY,
        scrollRange,
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
    );

    const textColor = useTransform(
        scrollY,
        scrollRange,
        ["#FFFFFF", "#111111"]
    );

    const fontSize = useTransform(
        scrollY,
        scrollRange,
        ["6rem", "1.5rem"]
    );

    const paddingTop = useTransform(
        scrollY,
        scrollRange,
        ["40vh", "1.5rem"]
    );

    const paddingBottom = useTransform(
        scrollY,
        scrollRange,
        ["40vh", "1.5rem"]
    );

    const letterSpacing = useTransform(
        scrollY,
        scrollRange,
        ["-0.05em", "0.05em"]
    );

    // Update state for pointer events or other logic if needed
    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    return (
        <motion.header
            style={{ backgroundColor: headerBg }}
            className="fixed top-0 left-0 w-full z-50 flex justify-center items-start pointer-events-none"
        >
            <motion.h1
                style={{
                    color: textColor,
                    fontSize: fontSize,
                    paddingTop: paddingTop,
                    paddingBottom: paddingBottom,
                    letterSpacing: letterSpacing
                }}
                className="font-editorial font-bold uppercase whitespace-nowrap leading-none pointer-events-auto transition-all"
            >
                NUUCARD
            </motion.h1>
        </motion.header>
    );
}
