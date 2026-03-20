
import React, { useState } from 'react';
import { useStore } from '../store';
import { AlertTriangle, CheckCircle, ShieldAlert, ChevronDown, ChevronUp, Scale } from 'lucide-react';

const RiskMeter: React.FC = () => {
  const { riskLevel, violations, setSidebarTab, uiElements } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = () => {
    if (riskLevel === 0) return 'text-emerald-400 border-emerald-500 bg-slate-900';
    if (riskLevel < 50) return 'text-yellow-400 border-yellow-500 bg-slate-900';
    return 'text-red-400 border-red-500 bg-slate-900';
  };

  const getBarColor = () => {
    if (riskLevel === 0) return 'bg-emerald-500';
    if (riskLevel < 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (riskLevel === 0) return 'SAFE';
    if (riskLevel < 50) return 'CAUTION';
    return 'UNSAFE';
  };

  const Icon = riskLevel === 0 ? CheckCircle : (riskLevel < 50 ? AlertTriangle : ShieldAlert);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center">
      <div 
        className={`flex items-center gap-4 px-6 py-3 rounded-full border-2 transition-all cursor-pointer ${getStatusColor()}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Icon size={20} className={riskLevel > 0 ? "animate-pulse" : ""} />
          <span className="font-black text-sm tracking-widest">{getStatusText()}</span>
        </div>
        <div className="h-6 w-[1px] bg-slate-700"></div>
        <div className="flex flex-col min-w-[60px]">
          <span className="text-[10px] font-bold">{riskLevel}% RISK</span>
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

      {isExpanded && violations.length > 0 && (
        <div className="mt-3 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300">
           <p className="text-[10px] font-bold text-slate-500 uppercase mb-3 px-1">Issues Found</p>
           <ul className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
             {violations.map((v, i) => (
               <li key={i} className="flex items-start gap-2 text-[10px] text-slate-300 italic border-l-2 border-red-500/50 pl-3">
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
             className="w-full mt-4 py-3 bg-aviation-orange/10 border border-aviation-orange/30 rounded-xl text-[10px] font-bold uppercase text-aviation-orange hover:bg-aviation-orange hover:text-white transition-all"
           >
              Fix Safety Issues
           </button>
        </div>
      )}
    </div>
  );
};

export default RiskMeter;
