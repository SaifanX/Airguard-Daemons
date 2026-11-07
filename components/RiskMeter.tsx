import React, { useState } from 'react';
import { useStore } from '../store';
import { AlertTriangle, CheckCircle, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import CountUp from './reactbits/CountUp';
import DecryptedText from './reactbits/DecryptedText';
import ElectricBorder from './reactbits/ElectricBorder';

const RiskMeter: React.FC = () => {
  const { riskLevel, violations, setSidebarTab, uiElements } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const isCritical = riskLevel >= 50;
  const isCaution = riskLevel > 0 && riskLevel < 50;

  const getStatusColor = () => {
    if (riskLevel === 0) return 'text-emerald-400 border-emerald-500 bg-slate-900/90';
    if (riskLevel < 50) return 'text-yellow-400 border-yellow-500 bg-slate-900/90';
    return 'text-red-400 border-red-500 bg-slate-900/95';
  };

  const getBarColor = () => {
    if (riskLevel === 0) return 'bg-emerald-500';
    if (riskLevel < 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (riskLevel === 0) return 'SAFE AIRSPACE';
    if (riskLevel < 50) return 'CAUTION ZONE';
    return 'CRITICAL BREACH';
  };

  const Icon = riskLevel === 0 ? CheckCircle : (riskLevel < 50 ? AlertTriangle : ShieldAlert);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center">
      <ElectricBorder active={isCritical} color="#ef4444" className="rounded-full">
        <div 
          className={`flex items-center gap-4 px-6 py-2.5 rounded-full border-2 transition-all cursor-pointer backdrop-blur-xl shadow-2xl ${getStatusColor()}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Icon size={18} className={riskLevel > 0 ? "animate-pulse" : ""} />
            <DecryptedText 
              text={getStatusText()} 
              speed={60}
              maxIterations={18}
              className="font-black text-xs tracking-widest font-mono"
            />
          </div>
          <div className="h-5 w-[1px] bg-slate-700"></div>
          <div className="flex flex-col min-w-[75px]">
            <span className="text-[10px] font-bold font-mono">
              <CountUp to={riskLevel} suffix="% RISK" duration={0.8} />
            </span>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div className={`h-full transition-all duration-500 ${getBarColor()}`} style={{ width: `${riskLevel}%` }} />
            </div>
          </div>
          {violations.length > 0 && (
             <div className="flex items-center opacity-70">
               {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
             </div>
          )}
        </div>
      </ElectricBorder>

      {isExpanded && violations.length > 0 && (
        <div className="mt-3 w-80 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300 backdrop-blur-2xl">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Issues Found</p>
           <ul className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
             {violations.map((v, i) => (
               <li key={i} className="flex items-start gap-2 text-[10px] text-slate-300 italic border-l-2 border-red-500/70 pl-3">
                 {v}
               </li>
             ))}
           </ul>
           <button 
             onClick={() => {
               setSidebarTab('SAFETY');
               if (!uiElements.sidebar) useStore.getState().toggleUiElement('sidebar');
               setIsExpanded(false);
             }}
             className="w-full mt-4 py-2.5 bg-aviation-orange/10 border border-aviation-orange/40 rounded-xl text-[10px] font-bold uppercase tracking-wider text-aviation-orange hover:bg-aviation-orange hover:text-white transition-all shadow-lg"
           >
              Fix Safety Issues
           </button>
        </div>
      )}
    </div>
  );
};

export default RiskMeter;
