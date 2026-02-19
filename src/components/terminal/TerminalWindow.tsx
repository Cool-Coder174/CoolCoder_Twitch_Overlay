"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { TypewriterText } from './TypewriterText';
import { Axolotl } from './Axolotl';
import { ScanningTerminal } from './ScanningTerminal';
import { AudioVisualizer } from './AudioVisualizer';

interface TerminalWindowProps {
  theme: 'green' | 'amber';
  volume: number;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ theme, volume }) => {
  const [bootSequence, setBootSequence] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 1.5,
        y: (e.clientY / window.innerHeight - 0.5) * 1.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (bootSequence === 2) {
      const timer = setTimeout(() => setBootSequence(3), 1500);
      return () => clearTimeout(timer);
    }
  }, [bootSequence]);

  const handleBoot1 = useCallback(() => setBootSequence(1), []);
  const handleBoot2 = useCallback(() => setBootSequence(2), []);

  const themeClass = theme === 'green' ? 'terminal-green' : 'terminal-amber';
  const glowBorder = theme === 'green' ? 'shadow-[0_0_60px_rgba(0,255,0,0.1)]' : 'shadow-[0_0_60px_rgba(255,176,0,0.1)]';

  const broadcastMessage = "// WELCOME COOTERS! grab your snacks, grab your work, and lock the f*ck in, Starting soon...";

  return (
    <div 
      className="w-full max-w-6xl z-10 transition-transform duration-[3000ms] ease-out animate-float px-4"
      style={{
        transform: `perspective(2000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`
      }}
    >
      <div className={cn(
        "relative glass-morphism rounded-[3rem] overflow-hidden p-8 sm:p-12 transition-all duration-1000 min-h-[800px] flex flex-col",
        glowBorder
      )}>
        {/* Visual FX Layers */}
        <div className="absolute inset-0 crt-scanline z-50 opacity-10 pointer-events-none" />
        <div className="absolute inset-0 sheen-effect z-40 opacity-10 pointer-events-none" />
        <div className="absolute inset-0 w-full h-[1px] bg-white/5 z-30 animate-scanline pointer-events-none" />

        {/* Terminal Content Wrapper */}
        <div className={cn("flex flex-col flex-1 font-code text-sm sm:text-lg transition-colors duration-1000", themeClass)}>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-border pb-4 opacity-40 shrink-0">
            <div className="flex gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
            <div className="text-sm uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="animate-pulse">●</span> System Idle
            </div>
          </div>

          {/* Main Body */}
          <div className="flex flex-col gap-8 flex-1">
            {/* Boot Sequence Lines */}
            <div className="flex flex-col gap-2 shrink-0 opacity-60">
              <TypewriterText 
                text="[BOOT SEQUENCE ENGAGED]" 
                delay={1000} 
                speed={40} 
                onComplete={handleBoot1} 
              />
              {bootSequence >= 1 && (
                <TypewriterText 
                  text="[CONNECTING TO NEURAL NET...]" 
                  delay={600} 
                  speed={30} 
                  onComplete={handleBoot2} 
                />
              )}
            </div>

            {/* Broadcast & Data Section */}
            {bootSequence >= 2 && (
              <div className="flex flex-col gap-8 border-t border-current/10 pt-6 flex-1">
                
                {/* News Ticker Bar */}
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="px-2 text-xs font-bold opacity-40 uppercase tracking-[0.4em]">
                    Broadcast
                  </div>
                  <div className="relative flex items-center h-16 sm:h-20 border border-current/10 rounded-2xl bg-current/5 shadow-inner overflow-hidden">
                    <div className="flex whitespace-nowrap animate-marquee">
                      <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold opacity-90 px-4 flex items-center">
                        {broadcastMessage}
                        <span className="inline-block w-3 h-6 ml-4 bg-current animate-blink align-middle" />
                      </span>
                      {/* Duplicate for seamless looping */}
                      <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold opacity-90 px-4 flex items-center">
                        {broadcastMessage}
                        <span className="inline-block w-3 h-6 ml-4 bg-current animate-blink align-middle" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Diagnostics Grid - Always visible if sequence >= 3 */}
                {bootSequence >= 3 && (
                  <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 flex-1">
                    {/* Left: Scanning Console + Audio */}
                    <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                      <ScanningTerminal />
                      <AudioVisualizer volume={volume} />
                    </div>

                    {/* Right: Axolotl Auxiliary */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col items-center justify-center p-6 border border-current/10 rounded-2xl bg-current/5 relative overflow-hidden group min-h-[350px]">
                      <div className="absolute top-4 left-4 text-xs opacity-40 uppercase tracking-[0.4em] font-bold">
                        &gt; AXOLOTL_BOOT: ONLINE
                      </div>
                      <div className="flex-1 flex items-center justify-center w-full h-full transform transition-transform duration-700 group-hover:scale-105">
                        <Axolotl className="text-current" />
                      </div>
                      <div className="absolute bottom-4 right-4 text-[10px] opacity-20 uppercase tracking-widest">
                        Bio-Logic Core v4.0
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="mt-8 flex justify-between items-center text-sm opacity-40 tracking-[0.3em] shrink-0 font-bold border-t border-current/10 pt-4">
            <div>LIVE on twitch.tv/CoolCoder_</div>
            <div className="flex items-center gap-6">
              <span>BETA_0.4.2</span>
              <div className="flex gap-1.5">
                <div className="w-2 h-4 bg-current" />
                <div className="w-2 h-4 bg-current opacity-30" />
                <div className="w-2 h-4 bg-current opacity-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
