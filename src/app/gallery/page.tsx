
'use client';

import { useState, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import photosData from '@/data/photos.json';
import Link from 'next/link';

// Define Photo type
interface Photo {
    id: string;
    src: string;
    title: string;
    description: string;
    location: string;
    tags: string[];
    exif: string;
    width: number;
    height: number;
    dateTaken: string;
}

const photos = photosData as Photo[];

// Extract unique tags
const allTags = Array.from(new Set(photos.flatMap(photo => photo.tags)));
const categories = ['All', ...allTags];

export default function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewingPhotoId, setViewingPhotoId] = useState<string | null>(null);

    const filteredPhotos = useMemo(() => {
        if (selectedCategory === 'All') return photos;
        return photos.filter(photo => photo.tags.includes(selectedCategory));
    }, [selectedCategory]);

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 2
    };

    return (
        <div className="min-h-screen bg-[#F9F6F0] text-[#3E3A36] font-sans">
            {/* Header */}
            <header className="pt-20 pb-10 px-4 text-center">
                <h1 className="text-3xl md:text-4xl font-medium mb-4">Gallery</h1>
                <p className="text-gray-500 mb-8">순간을 기록한 시선들</p>

                {/* Filter Chips */}
                <div className="flex justify-center gap-2 overflow-x-auto pb-4 px-4 no-scrollbar">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                    ? 'bg-[#3E3A36] text-white shadow-md'
                                    : 'bg-white border border-[#3E3A36]/10 text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </header>

            {/* Gallery Grid */}
            <main className="px-4 pb-20 max-w-[1600px] mx-auto">
                <LayoutGroup>
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        <AnimatePresence>
                            {filteredPhotos.map((photo) => (
                                <motion.div
                                    layout
                                    key={photo.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="mb-4 md:mb-8"
                                >
                                    <motion.div
                                        layoutId={`photo-${photo.id}`}
                                        onClick={() => setViewingPhotoId(photo.id)}
                                        className="relative rounded-lg overflow-hidden cursor-pointer group bg-gray-100"
                                    >
                                        <motion.img
                                            src={photo.src}
                                            alt={photo.title}
                                            className="w-full h-auto block"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent">
                                            <p className="font-medium text-sm">{photo.title}</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Masonry>
                </LayoutGroup>
            </main>

            {/* Detailed View Modal */}
            <AnimatePresence>
                {viewingPhotoId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setViewingPhotoId(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />

                        {photos.map((photo) => {
                            if (photo.id !== viewingPhotoId) return null;
                            return (
                                <motion.div
                                    key={photo.id}
                                    layoutId={`photo-${photo.id}`}
                                    className="relative w-full max-w-6xl bg-[#F9F6F0] rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Image Section */}
                                    <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative overflow-hidden">
                                        <motion.img
                                            src={photo.src}
                                            alt={photo.title}
                                            className="w-full h-full object-contain max-h-[50vh] md:max-h-full"
                                        />
                                    </div>

                                    {/* Content Section */}
                                    <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col bg-white overflow-y-auto">
                                        <div className="flex-1">
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="mb-6 border-b border-[#3E3A36]/10 pb-4"
                                            >
                                                <h2 className="text-2xl font-medium mb-1 text-[#3E3A36]">{photo.title}</h2>
                                                <div className="flex items-center gap-2 text-sm text-[#C43E38]">
                                                    <span>📍 {photo.location}</span>
                                                </div>
                                            </motion.div>

                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="text-gray-600 leading-relaxed mb-8 text-base whitespace-pre-wrap"
                                            >
                                                {photo.description}
                                            </motion.p>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="text-xs text-gray-400 space-y-1 font-mono bg-gray-50 p-3 rounded-lg mb-6"
                                            >
                                                <p className="font-bold text-gray-500 mb-1">PHOTO INFO</p>
                                                <p>{photo.exif}</p>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="flex flex-wrap gap-2"
                                            >
                                                {photo.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">#{tag}</span>
                                                ))}
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="flex gap-3 mt-8 pt-4 border-t border-gray-100"
                                        >
                                            <Link
                                                href="/write"
                                                className="flex-1 py-3 bg-[#C43E38] text-white text-center rounded-full font-medium hover:bg-[#A0302B] transition-colors shadow-lg"
                                            >
                                                이 엽서 쓰기
                                            </Link>
                                            <button
                                                onClick={() => setViewingPhotoId(null)}
                                                className="px-6 py-3 border border-[#3E3A36]/20 rounded-full hover:bg-[#3E3A36]/5 transition-colors"
                                            >
                                                닫기
                                            </button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        .my-masonry-grid {
          display: flex;
          margin-left: -16px; /* gutter size offset */
          width: auto;
        }
        .my-masonry-grid_column {
          padding-left: 16px; /* gutter size */
          background-clip: padding-box;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}
