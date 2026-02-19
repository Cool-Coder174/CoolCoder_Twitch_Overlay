"use client"

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const ScanningTerminal: React.FC = () => {
  const messages = [
    "> scanning for intelligent life... followers detected",
    "> intelligence not found. searching "
  ];
  
  // Spinner frames from the prompt sequence
  const spinnerFrames = ['⢎⡰', '⢎⡡', '⢎⡑', '⢎⠱', '⠎⡱', '⢊⡱', '⢌⡱', '⢆⡱'];
  
  const [msgIndex, setMsgIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [spinnerIndex, setSpinnerIndex] = useState(0);

  // Typewriter and Cycling Logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentFullText = messages[msgIndex];

    if (isTyping) {
      if (displayText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, 40);
      } else {
        setIsTyping(false);
        // Pause at the end of the message before switching
        timeout = setTimeout(() => {
          setIsTyping(true);
          setDisplayText('');
          setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 4000);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, msgIndex]);

  // Spinner Animation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setSpinnerIndex((prev) => (prev + 1) % spinnerFrames.length);
    }, 120);
    return () => clearInterval(interval);
  }, [spinnerFrames.length]);

  return (
    <div className="flex flex-col gap-4 p-6 border border-current/10 rounded-xl bg-current/5 overflow-hidden animate-terminal-flicker min-h-[140px]">
      <div className="text-xs opacity-50 uppercase tracking-wider font-bold shrink-0 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
        Neural Scan In Progress
      </div>
      
      <div className="flex-1 font-code text-lg sm:text-xl leading-relaxed opacity-90 relative">
        <div className="flex flex-wrap items-center gap-x-2">
          <span>{displayText}</span>
          
          {/* Show spinner only on the second message when typing is done */}
          {msgIndex === 1 && !isTyping && (
            <span className="text-primary inline-block min-w-[2ch] animate-pulse">
              ({spinnerFrames[spinnerIndex]})
            </span>
          )}
          
          {/* Blinking Cursor */}
          <span className="inline-block w-2.5 h-5 bg-current animate-blink align-middle" />
        </div>
        
        {/* Subtle Phosphor Glow Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-current/5 to-transparent opacity-20" />
      </div>
    </div>
  );
};
