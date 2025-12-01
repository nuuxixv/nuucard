
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    type?: 'success' | 'error';
    duration?: number;
}

export default function Toast({
    message,
    isVisible,
    onClose,
    type = 'success',
    duration = 3000
}: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100 min-w-[300px] justify-center"
                >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                        {type === 'success' ? '✓' : '!'}
                    </div>
                    <p className="font-medium text-[#3E3A36]">{message}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
