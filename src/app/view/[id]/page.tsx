
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { decrypt } from '@/lib/crypto';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { POSTCARDS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function ViewPage() {
    const params = useParams();
    const id = params?.id as string;

    const [content, setContent] = useState('');
    const [senderName, setSenderName] = useState('');
    const [isSecret, setIsSecret] = useState(false);
    const [backgroundId, setBackgroundId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [isOpened, setIsOpened] = useState(false);

    useEffect(() => {
        const fetchAndDecrypt = async () => {
            try {
                const key = window.location.hash.replace('#', '');

                if (!key) {
                    setIsLocked(true);
                    setLoading(false);
                    return;
                }

                const { data, error: dbError } = await supabase
                    .from('letters')
                    .select('content')
                    .eq('id', id)
                    .single();

                if (dbError) throw dbError;
                if (!data) throw new Error('Letter not found');

                const decryptedString = decrypt(data.content, key);

                if (!decryptedString) {
                    setError('편지를 해독할 수 없습니다. 키가 올바르지 않습니다.');
                } else {
                    try {
                        const parsedData = JSON.parse(decryptedString);
                        setContent(parsedData.content);
                        setBackgroundId(parsedData.backgroundId);
                        setSenderName(parsedData.senderName || '누군가');
                        setIsSecret(parsedData.isSecret || false);
                    } catch {
                        setContent(decryptedString);
                        setSenderName('누군가');
                        setIsSecret(false);
                    }
                }
            } catch (err) {
                console.error(err);
                setError('편지를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAndDecrypt();
        }
    }, [id]);

    const backgroundSrc = POSTCARDS.find(c => c.id === backgroundId)?.src;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0]">
                <div className="animate-pulse text-[#C43E38]">편지를 찾는 중...</div>
            </div>
        );
    }

    if (isLocked) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F6F0] p-4 text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h2 className="text-xl mb-2">편지가 잠겨있습니다.</h2>
                <p className="text-gray-600 mb-6">올바른 링크로 접속했는지 확인해주세요.<br />(URL 뒤에 #Key가 포함되어야 합니다)</p>
                <Link href="/" className="text-[#C43E38] hover:underline">홈으로 가기</Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F6F0] p-4 text-center">
                <h2 className="text-xl mb-2 text-red-600">오류 발생</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link href="/" className="text-[#C43E38] hover:underline">홈으로 가기</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F9F6F0] text-[#3E3A36] relative overflow-hidden font-sans">
            <AnimatePresence mode="wait">
                {!isOpened ? (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center z-10"
                    >
                        <div className="text-6xl mb-8">💌</div>
                        <h1 className="text-2xl md:text-3xl font-medium mb-4">
                            {isSecret ? (
                                <span>누군가<br />편지를 보냈어요.</span>
                            ) : (
                                <span>
                                    <span className="text-[#C43E38] font-bold">{senderName}</span>님이<br />
                                    편지를 보냈어요.
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-500 mb-12">
                            어떤 마음이 담겨있을까요?
                        </p>

                        <button
                            onClick={() => setIsOpened(true)}
                            className="px-10 py-4 bg-[#3E3A36] text-white text-lg rounded-full hover:bg-black transition-all shadow-lg hover:scale-105"
                        >
                            편지 열기
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="letter"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-full flex flex-col items-center justify-center"
                    >
                        {/* Background Image */}
                        {backgroundSrc && (
                            <div
                                className="absolute inset-0 z-0 opacity-20 blur-sm"
                                style={{
                                    backgroundImage: `url(${backgroundSrc})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        )}

                        <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-sm border border-[#3E3A36]/10 relative z-10">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#C43E38] rounded-t-lg" />
                            {!isSecret && (
                                <div className="mb-6 text-sm text-gray-400">From. {senderName}</div>
                            )}
                            <div className="prose prose-stone whitespace-pre-wrap break-words max-w-full leading-relaxed text-lg">
                                {content}
                            </div>
                        </div>

                        <div className="mt-8 space-x-4 relative z-10">
                            <Link href="/write" className="text-[#C43E38] hover:underline font-medium bg-white/50 px-4 py-2 rounded-full">
                                나도 답장 쓰기
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
