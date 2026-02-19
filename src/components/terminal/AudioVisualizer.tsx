"use client"

import React, { useEffect, useRef, useState } from 'react';

const BARS = 16;
const BLOCK_CHARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
const FFT_SIZE = 64;

interface AudioVisualizerProps {
  volume: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ volume }) => {
  const [levels, setLevels] = useState<number[]>(() => new Array(BARS).fill(0));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const rafRef = useRef<number>(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const audio = new Audio();
    audio.src = '/assets/lofi-mexicano.mp3';
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    let ctx: AudioContext;
    let analyser: AnalyserNode;
    let gain: GainNode;
    let source: MediaElementAudioSourceNode;
    let dataArray: Uint8Array;

    function initAudioGraph() {
      if (ctxRef.current) return;
      ctx = new AudioContext();
      ctxRef.current = ctx;

      analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyserRef.current = analyser;

      gain = ctx.createGain();
      gain.gain.value = gainRef.current?.gain.value ?? volume;
      gainRef.current = gain;

      source = ctx.createMediaElementSource(audio);
      sourceRef.current = source;
      source.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);

      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    function tick() {
      if (!mountedRef.current) return;
      if (analyserRef.current && dataArray) {
        analyserRef.current.getByteFrequencyData(dataArray);

        const binCount = analyserRef.current.frequencyBinCount;
        const binsPerBar = Math.max(1, Math.floor(binCount / BARS));
        const newLevels: number[] = [];

        for (let i = 0; i < BARS; i++) {
          let sum = 0;
          const start = i * binsPerBar;
          for (let j = start; j < start + binsPerBar && j < binCount; j++) {
            sum += dataArray[j];
          }
          newLevels.push(sum / binsPerBar / 255);
        }
        setLevels(newLevels);
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    async function tryPlay() {
      try {
        initAudioGraph();
        if (ctxRef.current?.state === 'suspended') await ctxRef.current.resume();
        await audio.play();
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        const resume = async () => {
          try {
            initAudioGraph();
            if (ctxRef.current?.state === 'suspended') await ctxRef.current.resume();
            await audio.play();
            rafRef.current = requestAnimationFrame(tick);
          } catch (e) {
            console.warn('Audio playback failed:', e);
          }
        };
        document.addEventListener('click', resume, { once: true });
        document.addEventListener('keydown', resume, { once: true });
      }
    }

    audio.addEventListener('canplaythrough', () => tryPlay(), { once: true });

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(rafRef.current);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      if (sourceRef.current) sourceRef.current.disconnect();
      if (gainRef.current) gainRef.current.disconnect();
      if (analyserRef.current) analyserRef.current.disconnect();
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
  }, [volume]);

  return (
    <div className="flex flex-col gap-3 p-6 border border-current/10 rounded-xl bg-current/5 overflow-hidden">
      <div className="text-sm opacity-50 uppercase tracking-wider font-bold shrink-0 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
        Audio Stream Active
      </div>
      <div className="font-code text-lg sm:text-xl md:text-2xl leading-none flex items-end justify-center gap-[2px] h-8 opacity-90 select-none">
        {levels.map((level, i) => {
          const idx = Math.min(
            BLOCK_CHARS.length - 1,
            Math.round(level * (BLOCK_CHARS.length - 1))
          );
          return (
            <span
              key={i}
              className="inline-block transition-all duration-75"
              style={{ opacity: 0.5 + level * 0.5 }}
            >
              {BLOCK_CHARS[idx]}
            </span>
          );
        })}
      </div>
    </div>
  );
};
