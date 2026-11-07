import React from 'react';

interface ElectricBorderProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  color?: string;
}

export const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  active = true,
  className = '',
  color = '#F97316',
}) => {
  if (!active) return <div className={className}>{children}</div>;

  return (
    <div className={`relative p-[1px] rounded-2xl overflow-hidden group ${className}`}>
      <div 
        className="absolute -inset-[100%] animate-[spin_3s_linear_infinite] opacity-75 blur-sm"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg 340deg, ${color} 360deg)`,
        }}
      />
      <div className="relative rounded-2xl bg-slate-900 h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default ElectricBorder;
