"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Zap, Sun, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  currentTheme: 'green' | 'amber';
  onThemeChange: (theme: 'green' | 'amber') => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  currentTheme,
  onThemeChange,
  volume,
  onVolumeChange,
}) => {
  const [open, setOpen] = useState(false);

  const accentColor = currentTheme === 'green' ? '#00FF00' : '#FFB000';

  return (
    <div className="fixed top-8 right-8 z-50 flex flex-col items-end gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-12 h-12 rounded-full transition-all border-2",
          open
            ? `border-[${accentColor}] bg-[${accentColor}]/10`
            : "border-white/10 bg-white/5"
        )}
        style={open ? { borderColor: accentColor, backgroundColor: `${accentColor}1a`, color: accentColor } : { color: 'rgba(255,255,255,0.5)' }}
      >
        <Settings className={cn("w-5 h-5 transition-transform duration-300", open && "rotate-90")} />
      </Button>

      {open && (
        <div
          className="flex flex-col gap-4 p-5 rounded-2xl border border-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="text-[10px] font-code uppercase tracking-[0.3em] opacity-40 font-bold">
            Theme
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onThemeChange('green')}
              className={cn(
                "w-10 h-10 rounded-full transition-all border-2",
                currentTheme === 'green'
                  ? "border-[#00FF00] bg-[#00FF00]/10 text-[#00FF00]"
                  : "border-white/10 bg-white/5 text-white/50"
              )}
            >
              <Zap className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onThemeChange('amber')}
              className={cn(
                "w-10 h-10 rounded-full transition-all border-2",
                currentTheme === 'amber'
                  ? "border-[#FFB000] bg-[#FFB000]/10 text-[#FFB000]"
                  : "border-white/10 bg-white/5 text-white/50"
              )}
            >
              <Sun className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-[10px] font-code uppercase tracking-[0.3em] opacity-40 font-bold mt-1">
            Volume
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onVolumeChange(volume > 0 ? 0 : 0.5)}
              className="opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: accentColor }}
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-28 h-1 appearance-none rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`,
                accentColor,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
