import React, { useState, useEffect, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover' | 'mount';
  revealDirection?: 'start' | 'end' | 'center';
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=~<>[]{}|:;';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 70,
  maxIterations = 24,
  characters = DEFAULT_CHARS,
  className = '',
  encryptedClassName = 'text-aviation-orange/70 font-mono',
  parentClassName = '',
  animateOn = 'mount',
  revealDirection = 'start',
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const intervalRef = useRef<any>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  const startAnimation = () => {
    let iteration = 0;
    const length = text.length;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            const progress = (iteration / maxIterations) * length;
            
            let isRevealed = false;
            if (revealDirection === 'start') {
              isRevealed = index < progress;
            } else if (revealDirection === 'end') {
              isRevealed = index >= length - progress;
            } else {
              const mid = length / 2;
              isRevealed = Math.abs(index - mid) <= progress / 2;
            }

            if (isRevealed) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      iteration += 1;
      if (iteration > maxIterations + 4) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'mount') {
      startAnimation();
    }
    return () => clearInterval(intervalRef.current);
  }, [text, speed, maxIterations]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (animateOn === 'hover') {
      startAnimation();
    }
  };

  return (
    <span
      ref={containerRef}
      className={`inline-block select-none ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={className}>
        {displayText.split('').map((char, i) => {
          const isDecrypted = char === text[i];
          return (
            <span
              key={i}
              className={isDecrypted ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
};

export default DecryptedText;
