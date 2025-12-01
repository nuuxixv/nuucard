
'use client';

import { useState } from 'react';
import { generateKey, encrypt } from '@/lib/crypto';
import Link from 'next/link';
import { Turnstile } from '@marsidev/react-turnstile';
import { POSTCARDS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '@/components/ui/Toast';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
    interface Window {
        Kakao: any;
    }
}

export default function WritePage() {
    const [step, setStep] = useState<'select' | 'write' | 'done'>('select');
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [viewingCardId, setViewingCardId] = useState<string | null>(null);
    const [content, setContent] = useState('');
    const [senderName, setSenderName] = useState('');
    const [isSecret, setIsSecret] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [token, setToken] = useState<string | null>(null);

    // Toast State
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
    };

    const handleSeal = async () => {
        if (!content.trim() || !senderName.trim() || !token || !selectedCardId) return;

        setLoading(true);
        try {
            const key = generateKey();

            const dataToEncrypt = JSON.stringify({
                content: content,
                backgroundId: selectedCardId,
                senderName: senderName.trim(),
                isSecret: isSecret
            });

            const encryptedContent = encrypt(dataToEncrypt, key);

            const res = await fetch('/api/seal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: encryptedContent, token: token }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to seal letter');

            const link = `${window.location.origin}/view/${data.id}#${key}`;
            setGeneratedLink(link);
            setStep('done');
        } catch (error) {
            console.error('Error sealing letter:', error);
            showToast('편지를 봉인하는 중 오류가 발생했습니다.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLink);
        showToast('링크가 복사되었습니다!');
    };

    const handleKakaoShare = () => {
        if (!window.Kakao || !window.Kakao.isInitialized()) {
            showToast('카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.', 'error');
            return;
        }

        window.Kakao.Share.sendCustom({
            templateId: 126455,
            templateArgs: {
                POSTCARD_URL: generatedLink,
                SENDER: senderName || '누군가',
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#F9F6F0] text-[#3E3A36] relative overflow-hidden font-sans">
            <AnimatePresence mode="wait">
                {/* Step 1: 사진 선택 */}
                {step === 'select' && (
                    <motion.div
                        key="select"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen p-4 flex flex-col items-center"
                    >
                        <h1 className="text-2xl md:text-3xl mt-8 mb-2 text-[#3E3A36] font-medium">어떤 엽서에 마음을 담을까요?</h1>
                        <p className="text-gray-500 mb-8 text-sm md:text-base">사진을 눌러 자세히 살펴보세요.</p>

                        {/* Mobile: 2 Columns, Tablet/Desktop: 3/4 Columns */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl w-full mb-24 px-2 md:px-4">
                            {POSTCARDS.map((card) => (
                                <motion.div
                                    key={card.id}
                                    layoutId={`card-${card.id}`}
                                    onClick={() => setViewingCardId(card.id)}
                                    className="relative rounded-lg overflow-hidden shadow-sm cursor-pointer group aspect-[3/4]"
                                    whileHover={{ y: -5 }}
                                >
                                    <motion.img
                                        src={card.src}
                                        alt={card.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Minimal Overlay for List View */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="font-medium text-sm truncate">{card.title}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Detailed View Overlay */}
                        <AnimatePresence>
                            {viewingCardId && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setViewingCardId(null)}
                                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                    />

                                    {POSTCARDS.map((card) => {
                                        if (card.id !== viewingCardId) return null;
                                        return (
                                            <motion.div
                                                key={card.id}
                                                layoutId={`card-${card.id}`}
                                                className="relative w-full max-w-5xl bg-[#F9F6F0] rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Image Section - Full Height/Width without crop */}
                                                <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden">
                                                    <motion.img
                                                        src={card.src}
                                                        alt={card.title}
                                                        className="w-full h-full object-contain max-h-[50vh] md:max-h-full"
                                                    />
                                                </div>

                                                {/* Content Section */}
                                                <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-white overflow-y-auto">
                                                    <div>
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.2 }}
                                                            className="mb-6 border-b border-[#3E3A36]/10 pb-4"
                                                        >
                                                            <h2 className="text-2xl font-medium mb-1 text-[#3E3A36]">{card.title}</h2>
                                                            <div className="flex items-center gap-2 text-sm text-[#C43E38]">
                                                                <span>📍 {card.location}</span>
                                                            </div>
                                                        </motion.div>

                                                        <motion.p
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.3 }}
                                                            className="text-gray-600 leading-relaxed mb-8 text-base md:text-lg whitespace-pre-wrap"
                                                        >
                                                            {card.description}
                                                        </motion.p>

                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.4 }}
                                                            className="text-xs text-gray-400 space-y-1 font-mono bg-gray-50 p-3 rounded-lg"
                                                        >
                                                            <p className="font-bold text-gray-500 mb-1">PHOTO INFO</p>
                                                            <p>{card.exif}</p>
                                                        </motion.div>
                                                    </div>

                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.5 }}
                                                        className="flex gap-3 mt-8"
                                                    >
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => {
                                                                setSelectedCardId(card.id);
                                                                setViewingCardId(null);
                                                                setStep('write');
                                                            }}
                                                            className="flex-1 py-4 bg-[#C43E38] text-white rounded-full font-medium hover:bg-[#A0302B] transition-colors shadow-lg"
                                                        >
                                                            이 엽서 선택하기
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(62, 58, 54, 0.05)' }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setViewingCardId(null)}
                                                            className="px-6 py-4 border border-[#3E3A36]/20 rounded-full transition-colors"
                                                        >
                                                            닫기
                                                        </motion.button>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Step 2: 편지 작성 */}
                {step === 'write' && (
                    <motion.div
                        key="write"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="min-h-screen flex flex-col items-center justify-center p-4 relative"
                    >
                        {/* Background Image (Blurred) */}
                        <div
                            className="absolute inset-0 z-0 opacity-30 blur-md transition-all duration-1000"
                            style={{
                                backgroundImage: `url(${POSTCARDS.find(c => c.id === selectedCardId)?.src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />

                        <div className="w-full max-w-lg z-10 space-y-6">
                            <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-lg border border-[#3E3A36]/10 space-y-4">
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        placeholder="보내는 사람 (예: 산타클로스)"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        className="w-full bg-transparent border-b border-[#3E3A36]/20 py-2 text-[#3E3A36] placeholder:text-gray-400 focus:outline-none focus:border-[#C43E38] transition-colors"
                                    />
                                    <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer w-fit">
                                        <input
                                            type="checkbox"
                                            checked={isSecret}
                                            onChange={(e) => setIsSecret(e.target.checked)}
                                            className="w-4 h-4 accent-[#C43E38] rounded cursor-pointer"
                                        />
                                        <span>비밀로 보내기 (이름 숨김)</span>
                                    </label>
                                </div>

                                <textarea
                                    className="w-full h-64 bg-transparent resize-none focus:outline-none text-[#3E3A36] text-lg leading-loose placeholder:text-gray-400"
                                    placeholder="여기에 마음을 적어주세요..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-center h-[70px]">
                                {SITE_KEY && (
                                    <Turnstile
                                        siteKey={SITE_KEY}
                                        onSuccess={setToken}
                                        options={{ size: 'invisible' }}
                                    />
                                )}
                            </div>

                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setStep('select')}
                                    className="flex-1 py-4 bg-white/80 backdrop-blur border border-[#3E3A36]/20 text-[#3E3A36] rounded-xl font-medium hover:bg-white transition-colors"
                                >
                                    이전
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSeal}
                                    disabled={loading || !content.trim() || !senderName.trim() || !token}
                                    className="flex-[2] py-4 bg-[#C43E38] text-white rounded-xl font-medium hover:bg-[#A0302B] disabled:opacity-50 shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    {loading ? '봉인 중...' : '편지 봉인하기'}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: 완료 (Done) */}
                {step === 'done' && (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="min-h-screen flex flex-col items-center justify-center p-4 relative"
                    >
                        <div className="w-full max-w-md space-y-6 text-center">
                            <div className="p-10 bg-white rounded-2xl shadow-xl border border-[#3E3A36]/10 mb-8">
                                <div className="text-6xl mb-6">💌</div>
                                <h2 className="text-2xl mb-3 text-[#3E3A36]">편지가 봉인되었습니다</h2>
                                <p className="text-gray-500">이제 소중한 사람에게<br />마음을 전하세요.</p>
                            </div>

                            <div className="space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleKakaoShare}
                                    className="w-full py-4 bg-[#FEE500] text-[#3E3A36] rounded-xl font-medium hover:bg-[#FDD835] transition-colors flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                                >
                                    <span className="font-bold text-xl">TALK</span> 카카오톡으로 보내기
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCopy}
                                    className="w-full py-4 bg-white border border-[#3E3A36]/20 text-[#3E3A36] rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    🔗 링크 복사하기
                                </motion.button>
                            </div>

                            <Link href="/" className="inline-block mt-12 text-gray-400 hover:text-[#3E3A36] underline decoration-1 underline-offset-4 transition-colors">
                                처음으로 돌아가기
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />
        </div>
    );
}
