
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import KakaoScript from '@/components/KakaoScript';

import Analytics from '@/components/Analytics';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "nuucard",
  description: "Share your moments with our premium postcards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Analytics />
        <KakaoScript />
        {children}
      </body>
    </html>
  );
}
