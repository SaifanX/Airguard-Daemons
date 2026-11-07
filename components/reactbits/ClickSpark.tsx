import React, { useRef, useEffect } from 'react';

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#f97316',
  sparkSize = 6,
  sparkRadius = 25,
  sparkCount = 8,
  duration = 400,
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let sparks: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
    }> = [];

    const updateSize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    updateSize();

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparks.forEach((s, idx) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 1 / (duration / 16);

        if (s.alpha <= 0) {
          sparks.splice(idx, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.alpha, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      if (sparks.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5);
        const speed = (Math.random() * 2 + 1) * (sparkRadius / 15);
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: sparkColor,
          size: sparkSize,
        });
      }

      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(animate);
    };

    container.addEventListener('click', handleClick);
    window.addEventListener('resize', updateSize);

    return () => {
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationId);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-50 h-full w-full"
      />
      {children}
    </div>
  );
};

export default ClickSpark;
