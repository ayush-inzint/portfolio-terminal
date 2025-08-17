'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Terminal from '@/components/Terminal';
import { commands } from '@/lib/commands';

// Dynamically import Card3D to avoid SSR issues with Three.js
const Card3D = dynamic(() => import('@/components/Card3DBasic'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-green-500 font-mono">Loading 3D Card...</div>
    </div>
  ),
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    
    // Check for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col w-full h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-green-700 text-center md:text-left">
        <h1 className="text-2xl font-bold text-green-500 font-mono">
          Mark Gatere
        </h1>
        <p className="text-sm text-gray-400 font-mono">
          Software Engineer
        </p>
      </header>

      {/* Main Content */}
      <div className={`flex flex-1 overflow-hidden ${isMobile ? 'flex-col' : 'flex-row'}`}>
        {/* 3D Card Section */}
        <div className={`${isMobile ? 'h-1/3 w-full hidden' : 'w-2/5 h-full'} border-green-700 ${isMobile ? 'border-b' : 'border-r'} relative z-10`}>
          <div className="relative w-full h-full">
            <Card3D />
            <div className="absolute bottom-2 right-2 text-xs text-green-500 font-mono bg-black bg-opacity-70 p-1 rounded z-20">
              [Interactive 3D Card]
            </div>
          </div>
        </div>

        {/* Terminal Section */}
        <div className={`${isMobile ? ' w-full' : 'w-3/5 h-full'} overflow-auto relative`}>
          <Terminal commands={commands} />
        </div>
      </div>

      {/* Footer */}
      <footer className="p-2 border-t border-green-700 bg-black text-xs text-green-500 font-mono flex justify-between items-center">
        <span>gatere@portfolio:~$</span>
        <span>
          {currentTime.toLocaleString('en-US', {
            timeZone: 'Africa/Nairobi',
          })}
        </span>
      </footer>
    </div>
  );
}
