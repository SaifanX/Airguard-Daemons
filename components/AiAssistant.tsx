
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, X, Bot, FileText, Loader2, Activity, ShieldAlert, Zap, Signal, SignalHigh, SignalLow } from 'lucide-react';
import { useStore } from '../store';
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { lineString, length, polygon, booleanIntersects } from '@turf/turf';
import { RESTRICTED_ZONES } from '../data/zones';
import { ZoneType } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: 'init',
    sender: 'ai',
    text: "Hey! I'm your flight assistant. I'll help check if your drone route is safe. What's the plan?"
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAutoTriggeredRisk, setLastAutoTriggeredRisk] = useState(0);
  
  const { riskLevel, violations, droneSettings, weather, flightPath, telemetry } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const askCaptain = useAction(api.ai.askCaptain);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (riskLevel > 60 && riskLevel > lastAutoTriggeredRisk + 10) {
        if (!isOpen) setIsOpen(true);
        handleSend("I noticed the risk is high. Can you help me check my route?");
        setLastAutoTriggeredRisk(riskLevel);
    } else if (riskLevel < 30) {
        setLastAutoTriggeredRisk(0);
    }
  }, [riskLevel]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!overrideText) setInput('');
    setIsLoading(true);

    let flightStats;
    try {
        if (flightPath.length >= 2) {
            const line = lineString(flightPath.map(p => [p.lng, p.lat]));
            flightStats = { 
                distance: parseFloat(length(line, { units: 'kilometers' }).toFixed(2)), 
                waypoints: flightPath.length 
            };
        }
    } catch (e) {}

    const weatherContext = weather
      ? `- Weather: ${weather.condition}, Wind: ${weather.windSpeed} km/h`
      : "- Weather telemetry not synced";

    let zoneContext = "Primary airspace is clear of active restrictions.";
    if (flightPath && flightPath.length >= 2) {
      try {
        const line = lineString(flightPath.map(p => [p.lng, p.lat]));
        const intersected = RESTRICTED_ZONES.filter(zone => {
          if (zone.type === ZoneType.CONTROLLED) return false;
          const polyCoords = [...zone.coordinates.map(c => [c.lng, c.lat]), [zone.coordinates[0].lng, zone.coordinates[0].lat]];
          const poly = polygon([polyCoords as any]);
          return booleanIntersects(line, poly);
        }).map(z => z.name);

        if (intersected.length > 0) zoneContext = `CRITICAL: Flight vector enters restricted zones: ${intersected.join(", ")}.`;
      } catch (e) {
        console.warn("Zone intersection check failed during AI context generation");
      }
    }

    let aiResponseText = "Relay Error: Could not connect to the AI Tactical Core. Check logs.";
    try {
      aiResponseText = await askCaptain({
        userMessage: textToSend,
        riskLevel,
        violations,
        droneModel: droneSettings.model,
        weatherContext,
        zoneContext,
        flightStats,
        telemetry
      });
    } catch (e) {
      console.error(e);
    }

    const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="relative pointer-events-none">
      
      {/* Chat Box */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[500px] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 pointer-events-auto">
          {/* Header */}
          <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center relative">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-aviation-orange/50 flex items-center justify-center bg-slate-950">
                <Bot size={18} className="text-aviation-orange" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 uppercase text-xs">Smart Helper</h3>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[8px] text-slate-400 font-mono tracking-widest uppercase">Online</span>
                </div>
              </div>
            </div>
            
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Quick Buttons */}
          <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800 flex gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => handleSend("Summary of my route?")} disabled={isLoading} className="flex-shrink-0 flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[9px] font-bold text-slate-300 uppercase">
                Route Summary
            </button>
            <button onClick={() => handleSend("Any safety warnings?")} disabled={isLoading} className="flex-shrink-0 flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[9px] font-bold text-slate-300 uppercase">
                Safety Check
            </button>
            <button onClick={() => handleSend("How's the drone status?")} disabled={isLoading} className="flex-shrink-0 flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[9px] font-bold text-slate-300 uppercase">
                Drone Status
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-aviation-orange text-white shadow-lg' 
                    : 'bg-slate-800/60 text-slate-200 border border-slate-700/40'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700 flex gap-3 items-center">
                  <Loader2 size={12} className="animate-spin text-aviation-orange" />
                  <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-800/60 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:border-aviation-orange outline-none"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-aviation-orange text-white rounded-lg hover:bg-orange-600 disabled:opacity-30 transition-all shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className={`pointer-events-auto flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl hover:bg-slate-800 text-white p-3 px-5 rounded-2xl shadow-2xl border-2 transition-all hover:scale-105 active:scale-95 ${
            riskLevel > 60 ? 'border-red-500 animate-pulse' : 'border-aviation-orange/80'
          }`}
        >
          <div className="relative">
             <MessageSquare size={20} className="text-aviation-orange" />
             {riskLevel > 60 && (
                 <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                 </span>
             )}
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-bold text-xs uppercase">Ask Assistant</span>
            <span className="text-[8px] font-mono text-slate-500 mt-0.5">Team Support</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default AiAssistant;
