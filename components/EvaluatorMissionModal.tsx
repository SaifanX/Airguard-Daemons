import React from 'react';
import { useStore } from '../store';
import { 
  Trophy, Play, Bot, Wand2, X, Download, ShieldCheck, 
  MapPin, CheckCircle2, ChevronRight, Sparkles, Navigation 
} from 'lucide-react';
import DecryptedText from './reactbits/DecryptedText';
import SpotlightCard from './reactbits/SpotlightCard';

export const EvaluatorMissionModal: React.FC = () => {
  const { 
    showJudgeModal, 
    setShowJudgeModal, 
    loadJudgeDemoMission, 
    isSimulating, 
    startSimulation, 
    stopSimulation,
    autoFixPath,
    riskLevel,
    uiElements,
    toggleUiElement
  } = useStore();

  if (!showJudgeModal) return null;

  const handleLaunchSimulation = () => {
    setShowJudgeModal(false);
    if (!isSimulating) {
      startSimulation();
    }
  };

  const handleAskAI = () => {
    setShowJudgeModal(false);
    if (!uiElements.aiAssistant) {
      toggleUiElement('aiAssistant');
    }
  };

  const handleAutoFix = () => {
    autoFixPath();
    setShowJudgeModal(false);
  };

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <SpotlightCard 
        spotlightColor="rgba(249, 115, 22, 0.25)"
        className="w-full max-w-2xl border-2 border-aviation-orange/60 shadow-[0_0_60px_rgba(249,115,22,0.25)] rounded-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-aviation-orange/20 border-2 border-aviation-orange flex items-center justify-center text-aviation-orange shadow-lg shadow-aviation-orange/20 animate-pulse">
              <Trophy size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-aviation-orange bg-aviation-orange/10 px-2.5 py-0.5 rounded-full border border-aviation-orange/30">
                  Judges & Evaluators Showcase
                </span>
                <span className="text-[10px] font-mono text-slate-400">TechnoFest 2026</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <DecryptedText text="AirGuard Mission Simulator" speed={70} maxIterations={22} />
              </h2>
            </div>
          </div>
          <button 
            onClick={() => setShowJudgeModal(false)}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Mission Details Banner */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="text-aviation-orange shrink-0" size={24} />
              <div>
                <p className="text-xs font-bold text-white uppercase">Evaluation Corridor</p>
                <p className="text-[11px] text-slate-400 font-mono">Stonehill Intl. School ➔ Yelahanka ➔ HAL Perimeter</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <div className="text-right">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">Vector Status</span>
                <span className="text-xs font-black font-mono text-aviation-orange">7 WAYPOINTS LOADED</span>
              </div>
            </div>
          </div>

          {/* Key Features Validated Grid */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Core Capabilities On Display</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Turf.js Geofence Checks</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Spatial intersection calculations against Bangalore military and commercial airspaces.</p>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Gemini 3.8 Flash AI Co-Pilot</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Direct connection to Google AI Studio for automated pre-flight compliance critique.</p>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Live OpenWeather Telemetry</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Real-time Bengaluru wind speed and flyability metrics streamed into risk analysis.</p>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Live SRTM Elevation Profile</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Dynamic terrain elevation profile chart calculated along the entire flight vector.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-800 flex flex-col md:flex-row gap-3">
            <button
              onClick={handleLaunchSimulation}
              className="flex-1 py-3 px-4 rounded-xl bg-aviation-orange hover:bg-aviation-orange/90 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-aviation-orange/30 transition-all hover:scale-[1.02]"
            >
              <Play size={16} /> Run Flight Simulation
            </button>

            <button
              onClick={handleAskAI}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-600 transition-all"
            >
              <Bot size={16} className="text-aviation-orange" /> Open Guard-1 AI
            </button>

            <button
              onClick={handleAutoFix}
              className="py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-all"
              title="Test Automatic Obstacle Avoidance Rerouting"
            >
              <Wand2 size={16} className="text-emerald-400" /> Auto-Fix Path
            </button>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default EvaluatorMissionModal;
