"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Gallery from "@/components/Gallery";
import CartButton from "@/components/CartButton";
import CartModal from "@/components/CartModal";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <main className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] overflow-hidden">
      <CartButton />
      <CartModal />
      
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      
      {/* Main Content */}
      <div className="relative w-full min-h-screen flex flex-col">
        {!showSplash && (
          <div className="animate-fade-in flex-1 flex items-center justify-center">
            <Gallery />
          </div>
        )}
      </div>
    </main>
  );
}
