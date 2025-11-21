"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            // 애니메이션이 끝나는 시간(exit duration)에 맞춰 onComplete 호출
            setTimeout(onComplete, 800);
        }, 2500); // 2.5초 동안 보여줌

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F5F0] text-[#1A1A1A]"
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // 커스텀 베지어 곡선으로 고급스러운 느낌
        >
            <motion.h1
                className="text-4xl md:text-6xl font-bold tracking-widest uppercase"
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                nuucard
            </motion.h1>
        </motion.div>
    );
}
