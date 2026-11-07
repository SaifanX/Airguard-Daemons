import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from '../store';
import { Activity, Mountain, CheckCircle2, Loader2 } from 'lucide-react';
import CountUp from './reactbits/CountUp';

const TerrainProfile: React.FC = () => {
  const { flightPath, droneSettings, simProgress, isSimulating } = useStore();
  const [elevationData, setElevationData] = useState<number[]>([]);
  const [isLoadingElevation, setIsLoadingElevation] = useState<boolean>(false);
  const [isLiveSRTM, setIsLiveSRTM] = useState<boolean>(false);

  // Fetch real elevation from Open-Meteo API when flightPath changes
  useEffect(() => {
    if (!flightPath || flightPath.length < 2) {
      setElevationData([]);
      setIsLiveSRTM(false);
      return;
    }

    // Sample up to 15 points along the path for elevation lookup
    const samplePoints: { lat: number; lng: number }[] = [];
    const step = Math.max(1, Math.floor(flightPath.length / 15));
    for (let i = 0; i < flightPath.length; i += step) {
      samplePoints.push(flightPath[i]);
    }
    if (samplePoints[samplePoints.length - 1] !== flightPath[flightPath.length - 1]) {
      samplePoints.push(flightPath[flightPath.length - 1]);
    }

    const fetchElevations = async () => {
      setIsLoadingElevation(true);
      try {
        const lats = samplePoints.map(p => p.lat.toFixed(4)).join(',');
        const lngs = samplePoints.map(p => p.lng.toFixed(4)).join(',');
        const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lngs}`);
        const data = await res.json();
        if (data && Array.isArray(data.elevation) && data.elevation.length > 0) {
          setElevationData(data.elevation);
          setIsLiveSRTM(true);
          return;
        }
      } catch (err) {
        console.warn('Open-Meteo elevation lookup failed, falling back to model', err);
      } finally {
        setIsLoadingElevation(false);
      }

      // Fallback synthetic baseline
      setIsLiveSRTM(false);
    };

    fetchElevations();
  }, [flightPath]);

  // Derived display points (either real SRTM elevation or smooth profile)
  const displayPoints = useMemo(() => {
    if (elevationData.length > 0) return elevationData;
    return Array.from({ length: 20 }).map((_, i) => {
      const noise = Math.sin(i * 0.8) * 15 + Math.cos(i * 1.5) * 10;
      return 910 + noise; // Bangalore baseline elevation ~910m
    });
  }, [elevationData]);

  if (!flightPath || flightPath.length === 0) return null;

  const minElev = Math.min(...displayPoints);
  const maxElev = Math.max(...displayPoints);
  const currentElev = displayPoints[Math.min(Math.floor(simProgress * displayPoints.length), displayPoints.length - 1)] || minElev;

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[900] w-full max-w-2xl px-6 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-4 overflow-hidden backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="flex items-center gap-2">
            <Mountain size={15} className="text-aviation-orange" />
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              Terrain Profile
              {isLiveSRTM ? (
                <span className="flex items-center gap-1 text-[8px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 size={10} /> Live SRTM Elevation
                </span>
              ) : (
                <span className="text-[8px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                  {isLoadingElevation ? 'Fetching SRTM...' : 'Estimated Bangalore Terrain'}
                </span>
              )}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="text-slate-400">
              MSL: <span className="text-white font-bold"><CountUp to={currentElev} decimals={0} suffix="m" /></span>
            </span>
            <span className="text-aviation-orange">
              AGL Clearance: <span className="text-white font-bold">{droneSettings.altitude}m</span>
            </span>
          </div>
        </div>

        {/* The Bar Chart */}
        <div className="relative h-20 flex items-end gap-[2px] px-2 pt-2 bg-slate-950/40 rounded-xl border border-slate-800/60 overflow-hidden">
          {/* Simulation Marker (Vertical Line) */}
          {isSimulating && (
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-aviation-orange z-20 transition-all duration-100 ease-linear shadow-[0_0_12px_#f97316]"
              style={{ left: `${Math.max(2, Math.min(98, simProgress * 100))}%` }}
            >
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-aviation-orange rounded-full border border-white"></div>
            </div>
          )}

          {displayPoints.map((elevation, idx) => {
            const range = Math.max(1, maxElev - minElev);
            const normalizedHeight = ((elevation - minElev) / range) * 35 + 15; // 15px to 50px
            const droneAltitudeHeight = (droneSettings.altitude / 100) * 15 + 8;

            return (
              <div key={idx} className="flex-1 flex flex-col justify-end gap-[1px] group relative h-full">
                {/* Drone Clearance Bar */}
                <div 
                  className="w-full bg-aviation-orange/70 rounded-t-sm transition-all duration-300 group-hover:bg-aviation-orange"
                  style={{ height: `${droneAltitudeHeight}px` }}
                />
                {/* Terrain Elevation Bar */}
                <div 
                  className="w-full bg-slate-700/80 rounded-t-sm transition-all duration-300 group-hover:bg-slate-600"
                  style={{ height: `${normalizedHeight}px` }}
                />
              </div>
            );
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between mt-2 px-2 text-[8px] font-black text-slate-500 font-mono tracking-widest">
           <span>LAUNCH [WP1]</span>
           <span className="text-aviation-orange/70">ORBITAL CORRIDOR</span>
           <span>TOUCHDOWN [WP{flightPath.length}]</span>
        </div>
        <p className="text-[7px] text-slate-600 font-mono text-center uppercase tracking-widest mt-1">
           Data Stream: Open-Meteo SRTM Global Elevation Model (100% Client-Side)
        </p>
      </div>
    </div>
  );
};

export default TerrainProfile;
