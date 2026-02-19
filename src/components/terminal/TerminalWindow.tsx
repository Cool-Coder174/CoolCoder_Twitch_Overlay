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
    const desc = await generateRetroIdleAnimations({});
    setIdleDescription(desc);
  }, []);

  useEffect(() => {
    fetchIdleAnimation();
  }, [fetchIdleAnimation]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const themeClass = theme === 'green' ? 'terminal-green' : 'terminal-amber';
  const glowBorder = theme === 'green' ? 'shadow-[0_0_20px_rgba(0,255,0,0.3)]' : 'shadow-[0_0_20px_rgba(255,176,0,0.3)]';

  return (
    <div 
      className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-video z-10 transition-transform duration-200 ease-out animate-float"
      style={{
        transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`
      }}
    >
      {/* 80s Mac Style Outer Shell */}
      <div className={cn(
        "absolute inset-0 glass-morphism rounded-[2.5rem] overflow-hidden p-6 sm:p-10",
        glowBorder
      )}>
        {/* Ambient CRT Effects */}
        <div className="absolute inset-0 crt-scanline z-50 animate-flicker opacity-40" />
        <div className="absolute inset-0 sheen-effect z-40 opacity-30" />
        
        {/* Scanline Animation */}
        <div className="absolute inset-0 w-full h-[2px] bg-white/10 z-30 animate-scanline" />

        <div className={cn("h-full flex flex-col font-code text-sm sm:text-lg overflow-hidden", themeClass)}>
          {/* Status Header */}
          <div className="flex justify-between items-center mb-6 border-b border-current pb-2 opacity-80">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="animate-pulse">●</span> System Live
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <TypewriterText 
                text="[SYSTEM INITIALIZING...]" 
                delay={500} 
                speed={30} 
                onComplete={() => setBootSequence(1)} 
              />
              {bootSequence >= 1 && (
                <TypewriterText 
                  text="[LOADING STREAM PROTOCOLS...]" 
                  delay={100} 
                  speed={20} 
                  onComplete={() => setBootSequence(2)} 
                />
              )}
              {bootSequence >= 2 && (
                <div className="mt-8 text-center py-10">
                  <h1 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tighter uppercase italic">
                    <TypewriterText 
                      text="Starting Soon" 
                      delay={200} 
                      speed={100} 
                      className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      onComplete={() => setBootSequence(3)}
                    />
                  </h1>
                </div>
              )}
            </div>

            {bootSequence >= 3 && (
              <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-current/30 pt-6">
                <div className="flex flex-col gap-2 p-3 border border-current/20 rounded-lg bg-current/5">
                  <div className="text-xs opacity-60 uppercase mb-1">Status Report</div>
                  <TypewriterText 
                    text={idleDescription || "Calculating idle vectors..."} 
                    speed={10} 
                    className="text-xs leading-relaxed"
                  />
                </div>
                <div className="flex flex-col gap-2 p-3 border border-current/20 rounded-lg bg-current/5">
                  <div className="text-xs opacity-60 uppercase mb-1">Terminal Activity</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>BUFFER_SYNC</span>
                      <span className="animate-pulse">OK</span>
                    </div>
                    <div className="w-full h-1 bg-current/10 rounded-full overflow-hidden">
                      <div className="h-full bg-current animate-[progress_2s_ease-in-out_infinite]" style={{width: '75%'}} />
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>LATENCY_STAB</span>
                      <span>0.04ms</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>STREAM_GLS</span>
                      <span>v1.0.4-rc</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="mt-6 flex justify-between items-center text-[10px] opacity-60">
            <div>&copy; 1984 STREAMGLASS INTERACTIVE</div>
            <div className="flex items-center gap-4">
              <span>512KB VRAM</span>
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-current" />
                <div className="w-1 h-3 bg-current opacity-50" />
                <div className="w-1 h-3 bg-current opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
