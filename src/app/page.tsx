"use client"

import React, { useState } from 'react';
import { BackgroundGrid } from '@/components/terminal/BackgroundGrid';
import { TerminalWindow } from '@/components/terminal/TerminalWindow';
import { SettingsPanel } from '@/components/terminal/SettingsPanel';
import { CRTOverlay } from '@/components/terminal/CRTOverlay';

export default function Home() {
  const [theme, setTheme] = useState<'green' | 'amber'>('green');
  const [volume, setVolume] = useState(0.3);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 overflow-hidden bg-background">
      <BackgroundGrid />
      <SettingsPanel
        currentTheme={theme}
        onThemeChange={setTheme}
        volume={volume}
        onVolumeChange={setVolume}
      />
      <TerminalWindow theme={theme} volume={volume} />

      <div className="fixed bottom-8 left-8 z-50 pointer-events-none">
        <div className="flex flex-col gap-1 opacity-20">
          <div className="text-xs font-code tracking-[0.5em] text-secondary">STREAMGLASS</div>
          <div className="h-[2px] w-full bg-accent" />
          <div className="text-[8px] font-code text-primary uppercase">Quantum Transcoder v1.0.4</div>
        </div>
      </div>

      <CRTOverlay />
    </main>
  );
}
