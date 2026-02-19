"use client"

import React, { useState, useEffect, useRef } from 'react';

const MESSAGES = [
  "> scanning for intelligent life...  ERROR: 404\n        - followers detected",
  "> intelligence not found. searching"
];

const SPINNER_FRAMES = ['⢎⡰', '⢎⡡', '⢎⡑', '⢎⠱', '⠎⡱', '⢊⡱', '⢌⡱', '⢆⡱'];
const TYPE_SPEED = 40;
const PAUSE_DURATION = 10000;
const SPINNER_INTERVAL = 120;

type Phase = 'typing' | 'paused' | 'flickering';

export const ScanningTerminal: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const [spinnerIndex, setSpinnerIndex] = useState(0);
  const [flickerOpacity, setFlickerOpacity] = useState(1);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const interval = setInterval(() => {
      setSpinnerIndex((prev) => (prev + 1) % SPINNER_FRAMES.length);
    }, SPINNER_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    clearTimeout(timerRef.current);
    const fullText = MESSAGES[msgIndex];

    if (phase === 'typing') {
      if (charIndex < fullText.length) {
        timerRef.current = setTimeout(() => setCharIndex((c) => c + 1), TYPE_SPEED);
      } else {
        timerRef.current = setTimeout(() => setPhase('flickering'), PAUSE_DURATION);
      }
    } else if (phase === 'flickering') {
      setFlickerOpacity(0);
      timerRef.current = setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setCharIndex(0);
        setFlickerOpacity(1);
        setPhase('typing');
      }, 150);
    }

    return () => clearTimeout(timerRef.current);
  }, [phase, charIndex, msgIndex]);

  const displayText = MESSAGES[msgIndex].slice(0, charIndex);
  const isDoneTyping = charIndex >= MESSAGES[msgIndex].length;
  const showSearchSpinner = msgIndex === 1 && isDoneTyping;

  return (
    <div className="flex flex-col gap-4 p-6 border border-current/10 rounded-xl bg-current/5 overflow-hidden animate-terminal-flicker min-h-[140px]">
      <div className="text-sm opacity-50 uppercase tracking-wider font-bold shrink-0 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
        Neural Scan In Progress
      </div>
      
      <div
        className="flex-1 font-code text-xs sm:text-sm md:text-lg leading-relaxed opacity-90 relative transition-opacity duration-150"
        style={{ opacity: flickerOpacity }}
      >
        <div className="whitespace-pre-wrap break-words">
          <span>{displayText}</span>
          {showSearchSpinner ? (
            <span className="text-primary inline min-w-[2ch]">
              {' '}({SPINNER_FRAMES[spinnerIndex]})
            </span>
          ) : (
            <span
              className="inline-block w-2.5 h-5 bg-current align-middle ml-1 animate-blink"
            />
          )}
        </div>
        
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-current/5 to-transparent opacity-20" />
      </div>
    </div>
  );
};
