"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { TypewriterText } from './TypewriterText';
import { Axolotl } from './Axolotl';
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
      className="relative w-full max-w-7xl aspect-[16/10] sm:aspect-video z-10 transition-transform duration-[2000ms] ease-out animate-float mt-20"
      style={{
        transform: `perspective(1200px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`
      }}
    >
      <div className={cn(
        "absolute inset-0 glass-morphism rounded-[2.5rem] overflow-hidden p-6 sm:p-10 transition-shadow duration-1000",
        glowBorder
      )}>
        <div className="absolute inset-0 crt-scanline z-50 opacity-15 pointer-events-none" />
        <div className="absolute inset-0 sheen-effect z-40 opacity-15 pointer-events-none" />
        <div className="absolute inset-0 w-full h-[1px] bg-white/5 z-30 animate-scanline pointer-events-none" />

        <div className={cn("h-full flex flex-col font-code text-sm sm:text-lg overflow-hidden transition-colors duration-1000", themeClass)}>
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

          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex flex-col gap-1 shrink-0">
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
            </div>

            {bootSequence >= 2 && (
              <div className="flex-1 flex flex-col gap-6 border-t border-current/10 pt-6 min-h-0 overflow-hidden">
                {/* Message Broadcast */}
                <div className="flex flex-col gap-4 p-6 sm:p-8 border border-current/10 rounded-xl bg-current/5 shadow-inner shrink-0">
                  <div className="text-xs font-bold opacity-50 uppercase tracking-widest">Message Broadcast</div>
                  <TypewriterText 
                    text="// WELCOME COOTERS! grab your snacks, grab your work, and lock the f*ck in, Starting soon..." 
                    speed={15} 
                    className="text-2xl sm:text-4xl font-bold leading-tight opacity-90"
                    showCursor={true}
                    onComplete={() => setBootSequence(3)}
                  />
                </div>

                {/* Main Data Layout */}
                {bootSequence >= 3 && (
                  <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
                    {/* Left Column - System Diagnostics */}
                    <div className="col-span-7 flex flex-col gap-6 min-h-0">
                      <div className="flex-1 flex flex-col gap-4 p-6 border border-current/10 rounded-xl bg-current/5 overflow-hidden">
                        <div className="text-xs opacity-50 uppercase tracking-wider font-bold shrink-0">Environmental Scan</div>
                        <div className="flex-1 overflow-auto scrollbar-hide">
                          <TypewriterText 
                            text={idleDescription || "Background sync protocols stable."} 
                            speed={10} 
                            className="text-base leading-relaxed opacity-70"
                            showCursor={false}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 p-6 border border-current/10 rounded-xl bg-current/5 shrink-0">
                        <div className="text-xs opacity-50 uppercase tracking-wider font-bold">Signal Integrity</div>
                        <div className="space-y-4 mt-1">
                          <div className="flex justify-between text-sm font-bold">
                            <span className="opacity-70">UPLINK_STATUS</span>
                            <span className="opacity-90">STABLE</span>
                          </div>
                          <div className="w-full h-3 bg-current/10 rounded-full overflow-hidden">
                            <div className="h-full bg-current opacity-40 animate-pulse" style={{width: '88%'}} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Stand By & Axolotl */}
                    <div className="col-span-5 flex flex-col items-center justify-center p-6 border border-current/10 rounded-xl bg-current/5 relative overflow-hidden">
                      <div className="absolute top-4 left-4 text-xs opacity-50 uppercase tracking-widest font-bold">Auxiliary Port</div>
                      <div className="text-center mb-4">
                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                          <TypewriterText 
                            text="Stand By" 
                            delay={400} 
                            speed={120} 
                            showCursor={false}
                          />
                        </h1>
                      </div>
                      <div className="scale-75 sm:scale-100 flex items-center justify-center">
                        <Axolotl />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center text-[10px] opacity-30 tracking-wider shrink-0">
            <div>&copy; 2024 STREAMGLASS INTERACTIVE</div>
            <div className="flex items-center gap-4">
              <span>BETA_0.4.2</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-3 bg-current" />
                <div className="w-1.5 h-3 bg-current opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
