"use client"

/**
 * WebGL CRT overlay — renders scanlines, RGB dot mask, static noise,
 * animated scan beam, vignette, and phosphor flicker as a transparent
 * full-screen layer. Shader approach adapted from CRTFilter by Ichiaka
 * (MIT): https://github.com/Ichiaka/CRTFilter
 */

import React, { useRef, useEffect } from 'react';

const VERTEX_SRC = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SRC = `
  precision mediump float;

  uniform float u_time;
  uniform vec2  u_resolution;

  // CRT parameters (tuned for subtle streaming-overlay use)
  const float SCANLINE_WEIGHT   = 0.22;
  const float NOISE_AMOUNT      = 0.045;
  const float BEAM_INTENSITY    = 0.12;
  const float BEAM_SPEED        = 0.125;   // full sweep every 8s
  const float BEAM_WIDTH        = 0.045;
  const float VIGNETTE_STRENGTH = 0.7;
  const float FLICKER_AMOUNT    = 0.015;
  const float DOT_MASK_STRENGTH = 0.10;

  // Deterministic noise (from CRTFilter's noise function)
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 centered = uv - 0.5;
    float alpha = 0.0;
    vec3 color = vec3(0.0);

    // ── Scanlines ──
    // Darken every other pair of pixel rows (CRT shadow mask)
    float scanline = sin(gl_FragCoord.y * 3.14159265) * 0.5 + 0.5;
    scanline = pow(scanline, 0.6);
    alpha += (1.0 - scanline) * SCANLINE_WEIGHT;

    // ── RGB dot mask (sub-pixel columns) ──
    float col = mod(gl_FragCoord.x, 3.0);
    vec3 mask = vec3(DOT_MASK_STRENGTH);
    if (col < 1.0)      mask.r *= 2.0;
    else if (col < 2.0) mask.g *= 2.0;
    else                 mask.b *= 2.0;
    color += mask * 0.5;
    alpha += DOT_MASK_STRENGTH * 0.3;

    // ── Static noise ──
    float noise = hash(uv * 1000.0 + u_time * 3.7);
    float noiseAlpha = noise * NOISE_AMOUNT;
    alpha += noiseAlpha;

    // ── Animated scan beam ──
    float beamPos = fract(u_time * BEAM_SPEED);
    float beamDist = abs(uv.y - beamPos);
    float beam = smoothstep(BEAM_WIDTH, 0.0, beamDist);
    color += vec3(1.0, 1.0, 1.0) * beam * BEAM_INTENSITY * 0.5;
    alpha += beam * BEAM_INTENSITY;

    // ── Vignette ──
    float dist = length(centered * vec2(1.4, 1.1));
    float vignette = smoothstep(0.35, 0.85, dist);
    alpha += vignette * VIGNETTE_STRENGTH;

    // ── Phosphor flicker ──
    float flicker = 1.0 + sin(u_time * 47.0) * FLICKER_AMOUNT
                       + sin(u_time * 113.0) * FLICKER_AMOUNT * 0.5;
    alpha *= flicker;

    gl_FragColor = vec4(color, alpha);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('CRT shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('CRT program link error:', gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

export const CRTOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) {
      console.warn('WebGL not available — CRT overlay disabled');
      return;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    if (!program) return;

    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1,
    ]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes  = gl.getUniformLocation(program, 'u_resolution');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width  = window.innerWidth  * dpr;
      canvas!.height = window.innerHeight * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    resize();
    window.addEventListener('resize', resize);

    function render() {
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(uTime, performance.now() / 1000.0);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
