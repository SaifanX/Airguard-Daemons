import React, { useRef, useEffect, useMemo } from 'react';
import { useStore } from '../store';
import { RESTRICTED_ZONES } from '../data/zones';
import { Activity, ShieldAlert, Navigation, Bot, Radio, Wind, RefreshCw } from 'lucide-react';

const TacticalHUD: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    telemetry, 
    simPosition, 
    flightPath, 
    isSimulating, 
    violations, 
    riskLevel,
    uiElements,
    weather,
    refreshWeather
  } = useStore();

  const currentPos = isSimulating ? simPosition : (flightPath.length > 0 ? flightPath[flightPath.length - 1] : null);
  const heading = telemetry.heading;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentPos) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    
    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Radial Grid
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.15)';
    ctx.lineWidth = 1;
    for (let r = 1; r <= 3; r++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius / 3) * r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.stroke();

    // Rotate context for Track-Up mode
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((-heading * Math.PI) / 180);

    // Scaling: 1px = ~10 meters (rough estimate for 2km radar)
    const scale = 0.05; 

    // Draw Zones
    RESTRICTED_ZONES.forEach(zone => {
      ctx.beginPath();
      ctx.strokeStyle = zone.type === 'CRITICAL' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(249, 115, 22, 0.4)';
      ctx.fillStyle = zone.type === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.05)';
      ctx.lineWidth = 2;

      zone.coordinates.forEach((coord, i) => {
        // Simple planar projection relative to drone
        const dx = (coord.lng - currentPos.lng) * 111320 * Math.cos(currentPos.lat * Math.PI / 180);
        const dy = (coord.lat - currentPos.lat) * 111320;
        
        const px = dx * scale;
        const py = -dy * scale; // Canvas Y is inverted

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    ctx.restore();

    // Static Radar Sweep Effect
    const time = Date.now() / 1000;
    const sweepAngle = (time % 4) / 4 * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, sweepAngle, sweepAngle + 0.2);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
    ctx.fill();

    // Drone at center
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();

  }, [currentPos, heading]);

  if (!uiElements.tacticalHud) return null;

  const latestWarning = violations.length > 0 ? violations[0] : "AIRSPACE NOMINAL. PROCEED.";

  return (
    <div className="absolute top-24 right-6 z-[1000] w-64 space-y-4 pointer-events-none">
      {/* Radar Section */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl p-4 overflow-hidden relative group pointer-events-auto">
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-aviation-orange animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tactical Radar</span>
          </div>
          <span className="text-[8px] font-mono text-slate-600">SCALE: 2.0KM</span>
        </div>

        <div className="relative flex justify-center py-2">
          <canvas 
            ref={canvasRef} 
            width={200} 
            height={200} 
            className="rounded-full bg-slate-950/50 shadow-inner"
          />
          
          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1">
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <span className="text-[7px] font-bold text-slate-500">NFZ</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-aviation-orange"></div>
                <span className="text-[7px] font-bold text-slate-500">WARN</span>
             </div>
          </div>
        </div>
      </div>

      {/* 3D Drone & Heading Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl p-4 flex items-center justify-between group pointer-events-auto">
        <div className="space-y-1">
           <p className="text-[9px] font-black text-slate-500 uppercase">Vector Heading</p>
           <p className="text-2xl font-black text-white font-mono">{Math.round(heading)}° <span className="text-xs text-aviation-orange uppercase">TRK</span></p>
        </div>

        <div className="relative" style={{ perspective: '500px' }}>
          <div 
            className="transition-transform duration-300"
            style={{ 
              transform: `rotateX(60deg) rotateZ(${-heading}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <Navigation className="text-aviation-orange drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" size={48} />
          </div>
          {/* Depth effect circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-slate-700/50 rounded-full"></div>
        </div>
      </div>

      {/* Mini Weather Widget */}
      <div className="bg-slate-900/90 backdrop-blur-xl border-l-4 rounded-r-2xl shadow-2xl p-3 transition-all duration-300 pointer-events-auto border-blue-400/50">
         <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
               <Wind size={12} className="text-blue-400" />
               <span className="text-[9px] font-black uppercase text-slate-400">Local Weather</span>
            </div>
            <button onClick={refreshWeather} className="text-slate-600 hover:text-white transition-all" title="Refresh Weather"><RefreshCw size={10} /></button>
         </div>
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <p className="text-xl font-black text-white font-mono">{weather.temp}°<span className="text-xs text-slate-500">C</span></p>
               <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-500 uppercase">{weather.condition}</span>
                  <span className="text-[10px] font-mono text-slate-300">{weather.windSpeed} km/h wind</span>
               </div>
            </div>
            <p className={`text-[7px] font-black px-1.5 py-0.5 rounded border ${weather.isFlyable ? 'text-emerald-400 border-emerald-500/30' : 'text-red-400 border-red-500/30'}`}>
              {weather.isFlyable ? 'SAFE' : 'NO FLY'}
            </p>
         </div>
      </div>
    </div>
  );
};

export default TacticalHUD;