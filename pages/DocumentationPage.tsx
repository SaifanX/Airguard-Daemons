
import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Book, AlertTriangle, Cpu, Map as MapIcon, ChevronRight, MessageSquare, Download, MousePointer2 } from 'lucide-react';

const DocumentationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex animate-in fade-in duration-700">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 h-screen sticky top-0 overflow-y-auto hidden md:block shrink-0 animate-in slide-in-from-left duration-700">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 mb-1 group">
            <div className="w-6 h-6 rounded bg-aviation-orange flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Plane className="text-white transform -rotate-45" size={14} />
            </div>
            <span className="font-bold tracking-tight uppercase">AirGuard</span>
          </Link>
          <span className="text-xs text-slate-500 font-mono">DOCS v2.6</span>
        </div>
        
        <nav className="p-4 space-y-8">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Getting Started</h4>
            <ul className="space-y-1">
              <li><a href="#introduction" className="block px-2 py-1.5 text-sm rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Introduction</a></li>
              <li><a href="#quick-start" className="block px-2 py-1.5 text-sm rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Tactical Start</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Core Systems</h4>
            <ul className="space-y-1">
              <li><a href="#mission-control" className="block px-2 py-1.5 text-sm rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Dynamic Map</a></li>
              <li><a href="#waypoint-ops" className="block px-2 py-1.5 text-sm rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Waypoint Ops</a></li>
              <li><a href="#export-ops" className="block px-2 py-1.5 text-sm rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Data Export</a></li>
              <li><a href="#captain-arjun" className="block px-2 py-1.5 text-sm rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">AI Co-Pilot</a></li>
            </ul>
          </div>

           <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Compliance</h4>
            <ul className="space-y-1">
              <li><a href="#risk-engine" className="block px-2 py-1.5 text-sm rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Risk Scoring</a></li>
              <li><a href="#disclaimer" className="block px-2 py-1.5 text-sm rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            <div className="mb-12 border-b border-slate-800 pb-8">
                <Link to="/" className="md:hidden flex items-center gap-2 mb-6 text-slate-500">
                    <ChevronRight size={16} className="rotate-180" /> Back to Base
                </Link>
                <h1 className="text-4xl font-bold mb-4 text-white">Tactical Operations Manual</h1>
                <p className="text-xl text-slate-400 font-light">Comprehensive guidelines for operating the AirGuard Safety Layer.</p>
            </div>

            <section id="introduction" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <Book className="text-aviation-orange" size={24} />
                    <h2 className="text-2xl font-bold text-white">Project Scope</h2>
                </div>
                <div className="prose prose-invert prose-slate max-w-none">
                    <p>
                        AirGuard is a mission-critical situational awareness tool. It aggregates global airspace restrictions, local weather telemetry, and terrain data to provide a "single pane of glass" for drone operations.
                    </p>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 my-4 font-mono text-sm text-aviation-orange/80 leading-relaxed">
                        // INITIALIZING TACTICAL LINK...<br/>
                        // SYNCING RESTRICTED_ZONES[KIA, YELAHANKA, CITY_CENTER]<br/>
                        // AI_CORE: GEMINI_3_PRO_ACTIVE
                    </div>
                </div>
            </section>

            <section id="waypoint-ops" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <MousePointer2 className="text-blue-400" size={24} />
                    <h2 className="text-2xl font-bold text-white">Tactical Waypoint Ops</h2>
                </div>
                <p className="text-slate-400 mb-4">
                    AirGuard supports high-precision path manipulation. Pilots can interact with markers directly:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-slate-300 mb-6">
                    <li><strong>Path Definition:</strong> Place points sequentially in DRAW mode.</li>
                    <li><strong>Drag-and-Drop:</strong> Any waypoint (including START) can be dragged to a new coordinate. The Risk Engine recalculates intersections in real-time.</li>
                    <li><strong>Highlighting:</strong> Selecting a waypoint provides focused telemetry and risk data for that specific vector.</li>
                </ul>
            </section>

            <section id="export-ops" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <Download className="text-emerald-400" size={24} />
                    <h2 className="text-2xl font-bold text-white">Mission Portability</h2>
                </div>
                <p className="text-slate-400 mb-6">
                    Missions designed in AirGuard are standard-compliant. We support industry-leading data exports:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                        <h4 className="font-bold text-blue-400 text-sm mb-2">GPX (GPS Exchange Format)</h4>
                        <p className="text-xs text-slate-500">Compatible with Garmin and open-source flight controllers like ArduPilot/PX4.</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                        <h4 className="font-bold text-emerald-400 text-sm mb-2">KML (Keyhole Markup Language)</h4>
                        <p className="text-xs text-slate-500">Optimized for Google Earth Pro and advanced 3D mission planning in DJI Terra.</p>
                    </div>
                </div>
            </section>

            <section id="captain-arjun" className="mb-16">
                 <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="text-aviation-orange" size={24} />
                    <h2 className="text-2xl font-bold text-white">Captain Arjun (AI Co-Pilot)</h2>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Powered by <strong>Gemini 3</strong>, Captain Arjun provides tactical critiques and safety briefings through the command console.
                </p>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-aviation-orange/20 shadow-lg shadow-orange-950/10">
                    <h4 className="font-bold text-aviation-orange mb-4 flex items-center gap-2"><Cpu size={16}/> Operating Procedures:</h4>
                    <ol className="list-decimal pl-6 space-y-4 text-slate-300 text-sm">
                        <li><strong>Briefing:</strong> Click the "Briefing" button in the AI Assistant for a comprehensive vector analysis.</li>
                        <li><strong>Auto-Trigger:</strong> The AI Console will automatically deploy if your risk level exceeds 50%.</li>
                        <li><strong>Real-time Critique:</strong> The co-pilot monitors telemetry (Battery, Speed, Altitude) and issues warnings if safety thresholds are breached.</li>
                    </ol>
                </div>
            </section>

            <section id="risk-engine" className="mb-16">
                 <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="text-red-400" size={24} />
                    <h2 className="text-2xl font-bold text-white">Risk Heuristics</h2>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-800">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900 text-slate-200 uppercase font-bold text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Metric</th>
                                <th className="px-6 py-4">Trigger</th>
                                <th className="px-6 py-4">Penalty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/30">
                            <tr>
                                <td className="px-6 py-4 font-bold text-white">Altitude</td>
                                <td className="px-6 py-4">&gt; 120m (AGL)</td>
                                <td className="px-6 py-4 text-red-400">+50 points</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-bold text-white">NFZ Conflict</td>
                                <td className="px-6 py-4">Polygon Intersection</td>
                                <td className="px-6 py-4 text-red-500">GROUNDED (100)</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-bold text-white">Weather</td>
                                <td className="px-6 py-4">Wind &gt; 20km/h</td>
                                <td className="px-6 py-4 text-yellow-400">RESTRICTED</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

             <section id="disclaimer" className="mb-24 pt-8 border-t border-slate-800 animate-in fade-in duration-1000 delay-500">
                <h2 className="text-xl font-bold text-white mb-4">Regulatory Disclaimer</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-light italic">
                    AirGuard is for simulation and educational planning only. It does not replace Digital Sky or official ATC communication. The pilot-in-command (PIC) remains 100% liable for flight safety. AI guidance from "Captain Arjun" is suggestive and should never override professional judgment or legal requirements.
                </p>
            </section>

        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;
