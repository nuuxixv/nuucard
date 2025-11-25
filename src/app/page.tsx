"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Gallery from "@/components/Gallery";
import CartButton from "@/components/CartButton";
import CartModal from "@/components/CartModal";

import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <CartButton />
      <CartModal />

      {/* Main Content */}
      <div className="relative w-full min-h-screen flex flex-col">
        <div className="animate-fade-in w-full">
          {/* Hero Section */}
          <div className="relative w-full h-screen">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/postcards/original/card-01.jpg')" }}
            >
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>

          <Gallery />
        </div>
      </div>
    </main>
  );
}
