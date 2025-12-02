
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { POSTCARDS } from '@/lib/constants';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F9F6F0] text-[#3E3A36] overflow-x-hidden font-sans">

      {/* 1. Hero Section (감성 & 제안) */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Visual: Home Alone, Cinematic, Warm Tungsten Light */}
        <div className="absolute inset-0 z-0">
          <img
            src={POSTCARDS[0].src}
            alt="Background"
            className="w-full h-full object-contain md:object-cover opacity-70"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />

        <div className="relative z-20 text-center px-4 text-[#F9F6F0]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6 drop-shadow-2xl">
              선물보다 먼저 도착하는 마음
            </h1>
            <p className="text-lg md:text-xl font-light mb-10 text-[#F9F6F0]/90">
              연말 감사와 안부, 이제 nuucard로 전하세요.
            </p>
            <Link
              href="/write"
              className="inline-block"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-[#C43E38] text-white text-lg rounded-full hover:bg-[#A0302B] transition-colors shadow-[0_0_20px_rgba(196,62,56,0.4)] hover:shadow-[0_0_30px_rgba(196,62,56,0.6)]"
              >
                엽서 쓰기
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Introduction (본질 & 용도) */}
      <section className="py-32 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1 w-full aspect-square bg-gray-200 rounded-2xl overflow-hidden relative shadow-xl">
            {/* Visual: 스마트폰 화면(작성 중)과 실물 봉투가 나란히 놓인 깔끔한 누끼 컷 Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-[#EAE6DE]">
              [Image: Phone & Envelope]
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-medium mb-6 leading-tight">
              가장 사적인<br />안부의 방식
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              카톡으로는 너무 가볍고,<br className="md:hidden" /> 손편지는 부담스러울 때.<br />
              당신의 문장을 가장 감각적인 엽서에 담아 보냅니다.<br /><br />
              보내는 분은 링크로 전송하고,<br />
              받는 분은 실물로 소장할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Content & Community (사진 & 참여) */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">겨울을 닮은 시선들</h2>
          <p className="text-gray-600 mb-12">직접 촬영한 사진 중에서<br />전하실 마음과 닮은 장면을 골라보세요.</p>

          {/* Gallery Slide */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {POSTCARDS.map((card) => (
              <div key={card.id} className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-md group cursor-pointer">
                <img
                  src={card.src}
                  alt={card.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-medium">{card.title}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lead Magnet (Wallpaper & Insta) */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-24">
            <div className="flex-1 bg-[#F9F6F0] p-8 rounded-2xl text-left hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-medium mb-2">이 감성을 소장하세요</h3>
              <p className="text-gray-500 mb-6 text-sm">
                nuucard의 사진들을<br />
                모바일 배경화면으로 만나보세요.
              </p>
              <button
                onClick={() => alert('준비 중입니다!')}
                className="text-gray-500 font-bold hover:underline flex items-center gap-1 hover:text-[#3E3A36] transition-colors"
              >
                배경화면 다운로드 <span className="text-lg">↓</span>
              </button>
            </div>
            <div className="flex-1 bg-[#F9F6F0] p-8 rounded-2xl text-left hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-medium mb-2">더 많은 이야기</h3>
              <p className="text-gray-500 mb-6 text-sm">
                인스타그램에서<br />
                새로운 소식을 확인하세요.
              </p>
              <a
                href="https://instagram.com/nuucard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 font-bold hover:underline flex items-center gap-1 hover:text-[#3E3A36] transition-colors"
              >
                @nuucard 방문하기 <span className="text-lg">↗</span>
              </a>
            </div>
          </div>

          {/* Guest Photographer (Downgraded) */}
          <div className="w-full text-left border-t border-gray-200 pt-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h3 className="text-xl md:text-2xl font-medium mb-2 text-gray-400">Photographer</h3>
                <p className="text-gray-400 font-light text-sm">
                  당신의 시선이 누군가의 편지가 됩니다.<br />
                  nuucard와 함께 수익을 창출해보세요.
                </p>
              </div>
              <button
                onClick={() => alert('작가 지원 폼은 준비 중입니다!')}
                className="text-gray-400 underline hover:text-gray-600 transition-colors text-sm"
              >
                작가 지원하기 ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Safety (안심) */}
      <section className="py-24 px-4 text-center bg-[#F9F6F0]">
        <div className="flex flex-col items-center max-w-2xl mx-auto">
          {/* Visual: 실링 왁스 아이콘 */}
          <div className="w-16 h-16 bg-[#C43E38] rounded-full flex items-center justify-center text-white text-3xl shadow-lg mb-8">
            🔒
          </div>
          <h2 className="text-2xl md:text-3xl font-medium mb-4">모든 편지는 안전하게 전달됩니다.</h2>
          <p className="text-gray-600 leading-relaxed">
            로그인 없이도 완벽한 보안.<br />
            내용은 암호화되어 저장되지 않으며<br />
            오직 링크를 받은 사람만 열어볼 수 있습니다.
          </p>
        </div>
      </section>

      {/* 5. Closing & CTA (행동) */}
      <section className="py-32 px-4 text-center bg-[#F9F6F0] relative overflow-hidden">
        {/* Visual: 여백이 많은 Warm Ivory 배경에 덩그러니 놓인 봉투 하나 (Placeholder) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 bg-[#EAE6DE] rotate-12 -z-10 opacity-50 blur-xl rounded-lg" />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-medium mb-4 text-[#3E3A36]">지금 떠오르는 그 사람에게.</h2>
          <p className="text-xl text-[#3E3A36] font-medium mb-12">지금 전하지 않으면,<br className="md:hidden" /> 이 마음은 내년에나 도착할지도 몰라요.</p>

          <Link
            href="/write"
            className="inline-block px-12 py-5 bg-[#3E3A36] text-white text-xl rounded-full hover:bg-black transition-all shadow-xl hover:scale-105"
          >
            마음 전하기
          </Link>
        </div>
      </section>

      <footer className="py-12 text-center text-[#3E3A36]/40 text-xs bg-[#F9F6F0] border-t border-[#3E3A36]/5">
        <p className="mb-2">nuucard</p>
        <p>© 2025 All rights reserved.</p>
      </footer>
    </main>
  );
}
