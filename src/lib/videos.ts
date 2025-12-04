import fs from 'fs';
import path from 'path';

export interface HeroVideoData {
  id: string;
  src: string;
  poster: string;
}

export function getHeroVideos(): HeroVideoData[] {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    
    if (!fs.existsSync(imagesDir)) {
      console.warn('Images directory not found:', imagesDir);
      return [];
    }

    const files = fs.readdirSync(imagesDir);
    
    // Filter for video files starting with 'vid_hero' and ending with '.mp4'
    const videoFiles = files.filter(file => 
      file.startsWith('vid_hero') && file.endsWith('.mp4')
    );

    return videoFiles.map(file => {
      const id = file.replace('.mp4', '');
      const posterFile = `${id}_poster.webp`;
      // Check if poster exists, otherwise fallback or leave empty? 
      // For now, we assume the naming convention implies the poster path.
      // If we want to be strict, we could check fs.existsSync for the poster too.
      
      return {
        id,
        src: `/images/${file}`,
        poster: `/images/${posterFile}`,
      };
    }).sort((a, b) => a.id.localeCompare(b.id)); // Sort by filename (01, 02, ...)
    
  } catch (error) {
    console.error('Error reading hero videos:', error);
    return [];
  }
}
