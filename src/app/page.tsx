import { getHeroVideos } from '@/lib/videos';
import LandingPageClient from '@/components/LandingPageClient';

export const dynamic = 'force-dynamic'; // Ensure we always check for new files on request (or use revalidate)

export default function Home() {
  const heroVideos = getHeroVideos();

  return <LandingPageClient heroVideos={heroVideos} />;
}
