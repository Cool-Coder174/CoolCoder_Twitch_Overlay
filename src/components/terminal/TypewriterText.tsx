"use client"

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  delay?: number;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 50, 
  className, 
  onComplete,
  delay = 0,
  showCursor = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;
    
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [displayedText, text, speed, onComplete, isStarted]);

  return (
    <span className={cn("font-code transition-all duration-300", className)}>
      {displayedText}
      {showCursor && isStarted && (
        <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse align-middle" />
      )}
    </span>
  );
};
