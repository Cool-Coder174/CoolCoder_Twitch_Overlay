"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { TypewriterText } from './TypewriterText';
import { generateRetroIdleAnimations } from '@/ai/flows/generate-retro-idle-animations';

interface TerminalWindowProps {
  theme: 'green' | 'amber';
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ theme }) => {
  const [bootSequence, setBootSequence] = useState(0);
  const [idleDescription, setIdleDescription] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const fetchIdleAnimation = useCallback(async () => {
    try {
      const desc = await generateRetroIdleAnimations({});
      setIdleDescription(desc);
    } catch (error) {
      setIdleDescription("Background sync protocols stable.");
    }
  }, []);

  useEffect(() => {
    fetchIdleAnimation();
  }, [fetchIdleAnimation]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Extremely dampened rotation for a heavy, slow feel
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 4,
        y: (e.clientY / window.innerHeight - 0.5) * 4,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const themeClass = theme === 'green' ? 'terminal-green' : 'terminal-amber';
  const glowBorder = theme === 'green' ? 'shadow-[0_0_40px_rgba(0,255,0,0.15)]' : 'shadow-[0_0_40px_rgba(255,176,0,0.15)]';

  return (
    <div 
      className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-video z-10 transition-transform duration-[2000ms] ease-out animate-float"
      style={{
        transform: `perspective(1200px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`
      }}
    >
      {/* 80s Mac Style Outer Shell */}
      <div className={cn(
        "absolute inset-0 glass-morphism rounded-[2.5rem] overflow-hidden p-6 sm:p-10 transition-shadow duration-1000",
        glowBorder
      )}>
        {/* Ambient CRT Effects */}
        <div className="absolute inset-0 crt-scanline z-50 opacity-15 pointer-events-none" />
        <div className="absolute inset-0 sheen-effect z-40 opacity-15 pointer-events-none" />
        
        {/* Ultra Slow Scanline Animation */}
        <div className="absolute inset-0 w-full h-[1px] bg-white/5 z-30 animate-scanline pointer-events-none" />

        <div className={cn("h-full flex flex-col font-code text-sm sm:text-lg overflow-hidden transition-colors duration-1000", themeClass)}>
          {/* Status Header */}
          <div className="flex justify-between items-center mb-6 border-b border-current pb-2 opacity-60">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>
            <div className="text-[10px] uppercase tracking-widest flex items-center gap-2">
              <span className="opacity-30">●</span> System Idle
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <TypewriterText 
                text="[BOOT SEQUENCE ENGAGED]" 
                delay={800} 
                speed={30} 
                onComplete={() => setBootSequence(1)} 
              />
              {bootSequence >= 1 && (
                <TypewriterText 
                  text="[CONNECTING TO NEURAL NET...]" 
                  delay={400} 
                  speed={25} 
                  onComplete={() => setBootSequence(2)} 
                />
              )}
              {bootSequence >= 2 && (
                <div className="mt-8 text-center py-10">
                  <h1 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tighter uppercase italic">
                    <TypewriterText 
                      text="Stand By" 
                      delay={400} 
                      speed={120} 
                      className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      onComplete={() => setBootSequence(3)}
                    />
                  </h1>
                </div>
              )}
            </div>

            {bootSequence >= 3 && (
              <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-current/10 pt-6">
                <div className="flex flex-col gap-2 p-3 border border-current/10 rounded-lg bg-current/5">
                  <div className="text-[10px] opacity-40 uppercase mb-1">Environmental Scan</div>
                  <TypewriterText 
                    text={idleDescription || "Syncing background threads..."} 
                    speed={15} 
                    className="text-[11px] leading-relaxed opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-2 p-3 border border-current/10 rounded-lg bg-current/5">
                  <div className="text-[10px] opacity-40 uppercase mb-1">Signal Integrity</div>
                  <div className="space-y-1.5 mt-1">
                    <div className="flex justify-between text-[9px]">
                      <span className="opacity-70">UPLINK_STATUS</span>
                      <span className="opacity-50">STABLE</span>
                    </div>
                    <div className="w-full h-1 bg-current/5 rounded-full overflow-hidden">
                      <div className="h-full bg-current opacity-20" style={{width: '45%'}} />
                    </div>
                    <div className="flex justify-between text-[9px] opacity-50">
                      <span>LATENCY</span>
                      <span>12ms</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="mt-6 flex justify-between items-center text-[9px] opacity-30 tracking-wider">
            <div>&copy; 2024 STREAMGLASS INTERACTIVE</div>
            <div className="flex items-center gap-4">
              <span>BETA_0.4.2</span>
              <div className="flex gap-1">
                <div className="w-1 h-2.5 bg-current" />
                <div className="w-1 h-2.5 bg-current opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};