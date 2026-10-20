import React, { useEffect, useRef } from 'react';
import { particleEngine } from '../utils/particleEngine';

interface ParticleCanvasProps {
  className?: string;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particleEngine.init(canvas);

    const handleResize = () => {
      particleEngine.resize();
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      if (canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
      }
      resizeObserver.observe(canvas);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      particleEngine.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-30 ${className}`}
    />
  );
};
