import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  currentTheme: 'green' | 'amber';
  onThemeChange: (theme: 'green' | 'amber') => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="fixed top-8 right-8 z-50 flex gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onThemeChange('green')}
        className={cn(
          "w-12 h-12 rounded-full transition-all border-2",
          currentTheme === 'green' ? "border-[#00FF00] bg-[#00FF00]/10 text-[#00FF00]" : "border-white/10 bg-white/5 text-white/50"
        )}
      >
        <Zap className="w-5 h-5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onThemeChange('amber')}
        className={cn(
          "w-12 h-12 rounded-full transition-all border-2",
          currentTheme === 'amber' ? "border-[#FFB000] bg-[#FFB000]/10 text-[#FFB000]" : "border-white/10 bg-white/5 text-white/50"
        )}
      >
        <Sun className="w-5 h-5" />
      </Button>
    </div>
  );
};
