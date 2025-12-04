'use client';

import { useState, useEffect, useRef } from 'react';

export interface HeroVideoData {
  id: string;
  src: string;
  poster: string;
}

interface HeroVideoProps {
  videos: HeroVideoData[];
}

export default function HeroVideo({ videos }: HeroVideoProps) {
  const [playlist, setPlaylist] = useState<HeroVideoData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videos.length === 0) return;

    // Fisher-Yates Shuffle
    const shuffled = [...videos];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPlaylist(shuffled);
  }, [videos]);

  const handleEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  if (playlist.length === 0) {
    // Fallback or loading state if no videos provided
    // Ideally we should have at least one video.
    // We can render nothing or a placeholder.
    return null; 
  }
  
  const currentVideo = playlist[currentIndex];
  
  // Only show poster for the very first video played in the session
  const showPoster = currentIndex === 0;

  return (
    <video
      ref={videoRef}
      autoPlay
      loop={false}
      muted
      playsInline
      poster={showPoster ? currentVideo.poster : undefined}
      className="w-full h-full object-cover md:object-contain scale-110"
      onEnded={handleEnded}
      key={currentVideo.src}
    >
      <source src={currentVideo.src} type="video/mp4" />
    </video>
  );
}
