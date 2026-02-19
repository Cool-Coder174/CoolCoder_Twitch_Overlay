import React from 'react';

export const BackgroundGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Noise Layer */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Primary Grid */}
      <div 
        className="absolute inset-0 animate-grid-scroll opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #4B0082 1px, transparent 1px),
            linear-gradient(to bottom, #4B0082 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Wireframe Accents */}
      <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-secondary" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
      
      {/* Depth Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-40" />
    </div>
  );
};
