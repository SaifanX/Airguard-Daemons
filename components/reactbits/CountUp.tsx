import React, { useEffect, useState, useRef } from 'react';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to,
  duration = 1.2,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
}) => {
  const [current, setCurrent] = useState<number>(from);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef<number>(from);
  const toRef = useRef<number>(to);

  useEffect(() => {
    fromRef.current = current;
    toRef.current = to;
    startRef.current = null;

    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = (timestamp - startRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = fromRef.current + (toRef.current - fromRef.current) * easeOut;

      setCurrent(value);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrent(toRef.current);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [to, duration]);

  return (
    <span className={className}>
      {prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default CountUp;
