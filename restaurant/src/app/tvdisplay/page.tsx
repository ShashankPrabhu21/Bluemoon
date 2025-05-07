'use client';
import { useEffect } from 'react';

export default function TVDisplay() {
  useEffect(() => {
    const scrollStep = 700; // pixels per scroll
    const pauseBetweenScrolls = 3000; // 3 seconds

    let interval: NodeJS.Timeout;
    const scroll = () => {
      const scrollHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;

      interval = setInterval(() => {
        const currentScroll = window.scrollY;

        if (currentScroll + viewportHeight < scrollHeight) {
          window.scrollBy({ top: scrollStep, behavior: 'smooth' });
        } else {
          clearInterval(interval);

          // Pause at bottom for 3 seconds then scroll back to top
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, pauseBetweenScrolls);
        }
      }, pauseBetweenScrolls);
    };

    scroll();

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* You can include your components or static content here */}
      <Home />
      <Menu />
      <Gallery />
    </div>
  );
}

// Import or paste in the actual content of your three pages
import Home from '../page';       // Adjust based on your actual file paths
import Menu from '../menu/page';
import Gallery from '../gallery/page';
