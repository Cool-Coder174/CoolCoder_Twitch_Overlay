"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { TypewriterText } from './TypewriterText';
import { Axolotl } from './Axolotl';
import { ScanningTerminal } from './ScanningTerminal';

interface TerminalWindowProps {
  theme: 'green' | 'amber';
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ theme }) => {
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

  const themeClass = theme === 'green' ? 'terminal-green' : 'terminal-amber';
  const glowBorder = theme === 'green' ? 'shadow-[0_0_60px_rgba(0,255,0,0.1)]' : 'shadow-[0_0_60px_rgba(255,176,0,0.1)]';

  return (
    <div 
      className="relative w-full max-w-6xl aspect-[16/11] sm:aspect-[16/10] z-10 transition-transform duration-[3000ms] ease-out animate-float"
      style={{
        transform: `perspective(2000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`
      }}
    >
      <div className={cn(
        "absolute inset-0 glass-morphism rounded-[3rem] overflow-hidden p-8 sm:p-12 transition-all duration-1000",
        glowBorder
      )}>
        <div className="absolute inset-0 crt-scanline z-50 opacity-10 pointer-events-none" />
        <div className="absolute inset-0 sheen-effect z-40 opacity-10 pointer-events-none" />
        <div className="absolute inset-0 w-full h-[1px] bg-white/5 z-30 animate-scanline pointer-events-none" />

        <div className={cn("h-full flex flex-col font-code text-sm sm:text-lg overflow-hidden transition-colors duration-1000", themeClass)}>
          <div className="flex justify-between items-center mb-8 border-b border-current pb-4 opacity-40">
            <div className="flex gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
            <div className="text-xs uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="animate-pulse">●</span> System Idle
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            <div className="flex flex-col gap-2 shrink-0 opacity-60">
              <TypewriterText 
                text="[BOOT SEQUENCE ENGAGED]" 
                delay={1000} 
                speed={40} 
                onComplete={() => setBootSequence(1)} 
              />
              {bootSequence >= 1 && (
                <TypewriterText 
                  text="[CONNECTING TO NEURAL NET...]" 
                  delay={600} 
                  speed={30} 
                  onComplete={() => setBootSequence(2)} 
                />
              )}
            </div>

            {bootSequence >= 2 && (
              <div className="flex-1 flex flex-col gap-8 border-t border-current/10 pt-8 min-h-0 overflow-hidden">
                {/* Message Broadcast */}
                <div className="flex flex-col gap-6 p-8 sm:p-10 border border-current/10 rounded-2xl bg-current/5 shadow-inner shrink-0">
                  <div className="text-xs font-bold opacity-40 uppercase tracking-[0.4em]">Message Broadcast</div>
                  <TypewriterText 
                    text="// WELCOME COOTERS! grab your snacks, grab your work, and lock the f*ck in, Starting soon..." 
                    speed={20} 
                    className="text-2xl sm:text-4xl font-bold leading-tight opacity-90"
                    showCursor={true}
                    onComplete={() => setBootSequence(3)}
                  />
                </div>

                {/* Main Data Layout */}
                {bootSequence >= 3 && (
                  <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
                    {/* Left Column - Diagnostics & Scanning */}
                    <div className="col-span-7 flex flex-col gap-8 min-h-0">
                      <ScanningTerminal />
                      
                      <div className="flex flex-col gap-5 p-8 border border-current/10 rounded-2xl bg-current/5 shrink-0">
                        <div className="text-xs opacity-40 uppercase tracking-[0.3em] font-bold">Signal Integrity</div>
                        <div className="space-y-5 mt-2">
                          <div className="flex justify-between text-base font-bold tracking-widest">
                            <span className="opacity-60">UPLINK_STATUS</span>
                            <span className="opacity-90">STABLE</span>
                          </div>
                          <div className="w-full h-4 bg-current/10 rounded-full overflow-hidden p-1 border border-current/5">
                            <div className="h-full bg-current opacity-50 animate-pulse rounded-full transition-all duration-1000" style={{width: '92%'}} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Axolotl */}
                    <div className="col-span-5 flex flex-col items-center justify-center p-10 border border-current/10 rounded-2xl bg-current/5 relative overflow-hidden group">
                      <div className="absolute top-6 left-6 text-[10px] opacity-40 uppercase tracking-[0.4em] font-bold">
                        &gt; AXOLOTL_BOOT: ONLINE
                      </div>
                      <div className="flex-1 flex items-center justify-center overflow-hidden w-full h-full transition-transform duration-700 group-hover:scale-105">
                        <Axolotl className="text-current" />
                      </div>
                      <div className="absolute bottom-6 right-6 text-[8px] opacity-20 uppercase tracking-widest">
                        Bio-Logic Core v4.0
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-between items-center text-[10px] opacity-20 tracking-[0.5em] shrink-0 font-bold">
            <div>&copy; 2024 STREAMGLASS INTERACTIVE</div>
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
