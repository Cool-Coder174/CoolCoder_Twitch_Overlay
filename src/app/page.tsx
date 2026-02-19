"use client"

import React, { useState } from 'react';
import { BackgroundGrid } from '@/components/terminal/BackgroundGrid';
import { TerminalWindow } from '@/components/terminal/TerminalWindow';
import { ThemeToggle } from '@/components/terminal/ThemeToggle';

export default function Home() {
  const [theme, setTheme] = useState<'green' | 'amber'>('green');

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-end p-4 sm:p-24 pb-12 sm:pb-32 overflow-hidden bg-background">
      {/* Visual FX Engine Layers */}
      <BackgroundGrid />
      
      {/* UI Elements */}
      <ThemeToggle currentTheme={theme} onThemeChange={setTheme} />
      
      {/* Central Terminal Window */}
      <TerminalWindow theme={theme} />
      
      {/* Branding Overlay */}
      <div className="fixed bottom-8 left-8 z-50 pointer-events-none">
        <div className="flex flex-col gap-1 opacity-20">
          <div className="text-xs font-code tracking-[0.5em] text-secondary">STREAMGLASS</div>
          <div className="h-[2px] w-full bg-accent" />
          <div className="text-[8px] font-code text-primary uppercase">Quantum Transcoder v1.0.4</div>
        </div>
      </div>
    </main>
  );
}
