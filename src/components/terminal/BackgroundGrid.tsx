import React from 'react';

export const BackgroundGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Noise Layer - Slightly reduced opacity for cleaner look */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Primary Grid - Slowed down significantly */}
      <div 
        className="absolute inset-0 animate-grid-scroll opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #4B0082 1px, transparent 1px),
            linear-gradient(to bottom, #4B0082 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Wireframe Accents */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M60 0 L120 30 L120 90 L60 120 L0 90 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-secondary" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
      
      {/* Depth Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-40" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-30" />
    </div>
  );
};