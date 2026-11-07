import React, { useState } from 'react';
import { useStore } from '../store';
import DecryptedText from '../components/reactbits/DecryptedText';
import CountUp from '../components/reactbits/CountUp';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import ClickSpark from '../components/reactbits/ClickSpark';
import AnimatedContent from '../components/reactbits/AnimatedContent';
import Magnet from '../components/reactbits/Magnet';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plane, Zap, Map as MapIcon, Cpu, ArrowRight, ShieldCheck,
  BarChart3, Globe2, Download, MessageSquare, Move, Trophy,
  Github, MousePointer2, FileText, CheckCircle2, Mountain, Radar
} from 'lucide-react';

const DocSection = ({ icon, title, children }: { icon: React.ReactNode, title: string, children?: React.ReactNode }) => (
  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-slate-800 rounded-lg text-aviation-orange">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h2>
    </div>
    <div className="text-slate-400 leading-relaxed space-y-4">
      {children}
    </div>
  </div>
);

const UnifiedLanding: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLearnMore = () => {
    window.open('https://github.com/SaifanX/Airguard-Daemons', '_blank');
  };

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-aviation-orange/30 overflow-y-auto scroll-smooth relative" style={{ backgroundColor: '#020617' }}>

      {/* Dynamic Island Navbar */}
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-50 flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled
            ? 'top-4 w-[95%] max-w-3xl bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] h-14 px-6'
            : 'top-0 w-full max-w-full bg-slate-950/70 backdrop-blur-md border-b border-slate-800/60 rounded-none shadow-none h-16 px-6 md:px-12'
          }`}
      >
        <div className={`w-full flex items-center justify-between mx-auto transition-all duration-500 ${isScrolled ? 'max-w-3xl' : 'max-w-7xl'}`}>
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`rounded bg-gradient-to-tr from-aviation-orange to-orange-600 flex items-center justify-center transition-all duration-500 group-hover:rotate-12 ${isScrolled ? 'w-8 h-8' : 'w-9 h-9'}`}>
              <Plane className="text-white transform -rotate-45" size={isScrolled ? 18 : 20} />
            </div>
            <span className={`font-bold tracking-tight uppercase transition-all duration-500 ${isScrolled ? 'text-base' : 'text-lg'}`}>AirGuard</span>
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              onClick={scrollToFeatures}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block"
            >
              Features
            </a>
            <Link
              to="/hackathon"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block"
            >
              TechnoFest Results
            </Link>
            <Link
              to="/team"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block"
            >
              Team
            </Link>
            <Magnet padding={25} magnetStrength={3}>
              <Link
                to="/app"
                className="flex items-center gap-2 text-sm font-bold text-aviation-orange hover:text-orange-400 transition-colors"
              >
                Open App
                <ArrowRight size={16} />
              </Link>
            </Magnet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-36 pb-24 flex flex-col items-center justify-center min-h-[85vh] bg-slate-950/80 backdrop-blur-sm overflow-hidden z-10" style={{ backgroundColor: "rgba(2, 6, 23, 0.85)" }}>

        {/* Deep Orange Backdrop Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-aviation-orange/15 blur-[140px] rounded-full pointer-events-none"></div>

        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={0.7}
          initialOpacity={0.3}
          ease="power2.out"
          trigger="mount"
          className="max-w-5xl mx-auto px-6 relative z-10 text-center"
        >
          <Link to="/hackathon" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-aviation-orange/50 text-xs font-mono text-aviation-orange mb-8 shadow-xl hover:border-aviation-orange hover:scale-105 transition-all">
            <Trophy size={14} className="text-yellow-400" />
            <DecryptedText
              text="TECHNOFEST 2026 2ND PRIZE // STONEHILL INTERNATIONAL SCHOOL"
              speed={70}
              maxIterations={25}
            />
          </Link>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-white leading-tight drop-shadow-2xl">
            AirGuard Drone Intelligence
          </h1>

          <p className="text-lg md:text-xl font-serif italic text-slate-200 mb-6">
            Engineered by <span className="text-aviation-orange font-semibold">Saifan</span> & Team Daemons &bull; Stonehill TechnoFest 2026 Winner
          </p>

          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Real-time civilian drone flight corridors with OpenStreetMap airspace geofencing, Google Gemini AI flight advice, and live Open-Meteo elevation clearance.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Magnet padding={40} magnetStrength={2.5}>
              <ClickSpark sparkColor="#f59e0b" sparkCount={12}>
                <button
                  onClick={() => {
                    useStore.getState().loadJudgeDemoMission();
                    navigate('/app');
                  }}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-2xl shadow-amber-900/40 ring-2 ring-amber-400/50 cursor-pointer"
                >
                  <Trophy size={18} className="text-yellow-200 animate-bounce" />
                  Launch Evaluator Demo Mission
                </button>
              </ClickSpark>
            </Magnet>

            <Magnet padding={35} magnetStrength={2.5}>
              <ClickSpark sparkColor="#f97316" sparkCount={8}>
                <button
                  onClick={() => navigate('/app')}
                  className="w-full md:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:text-white backdrop-blur-md cursor-pointer"
                >
                  <Plane className="transform -rotate-45" size={18} />
                  Free Flight Sandbox
                </button>
              </ClickSpark>
            </Magnet>

            <Magnet padding={30} magnetStrength={3}>
              <button
                onClick={handleLearnMore}
                className="w-full md:w-auto px-6 py-4 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 text-slate-400 rounded-xl font-bold transition-all hover:text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <Github size={18} />
                GitHub Source
              </button>
            </Magnet>
          </div>
        </AnimatedContent>
      </header>

      {/* Animated Live Stats Counter Strip */}
      <section className="py-12 bg-slate-900/60 border-y border-slate-800/80 backdrop-blur-md relative z-10">
        <AnimatedContent
          distance={35}
          direction="vertical"
          duration={0.8}
          stagger={0.12}
          trigger="mount"
          className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="p-4 border-r border-slate-800/60 last:border-none">
            <p className="text-3xl md:text-4xl font-black text-aviation-orange font-mono">
              <CountUp to={2} suffix="nd Place" />
            </p>
            <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-bold">TechnoFest 2026 Winner</p>
          </div>
          <div className="p-4 border-r border-slate-800/60 last:border-none">
            <p className="text-3xl md:text-4xl font-black text-white font-mono">
              <CountUp to={24} suffix=" Hours" />
            </p>
            <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-bold">Hackathon Build Sprint</p>
          </div>
          <div className="p-4 border-r border-slate-800/60 last:border-none">
            <p className="text-3xl md:text-4xl font-black text-emerald-400 font-mono">
              <CountUp to={100} suffix="%" />
            </p>
            <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-bold">Client-Side Geofencing</p>
          </div>
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-black text-cyan-400 font-mono">
              <CountUp to={4} suffix=" Airspaces" />
            </p>
            <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-bold">Bangalore Defense Corridors</p>
          </div>
        </AnimatedContent>
      </section>

      {/* AI GEO SUMMARY BLOCK */}
      <section className="py-16 bg-slate-950/60 backdrop-blur-sm relative z-10 overflow-hidden border-t border-slate-900">
        <AnimatedContent
          distance={45}
          direction="vertical"
          duration={0.8}
          trigger="scroll"
          className="max-w-4xl mx-auto px-6 relative"
        >
          <SpotlightCard
            spotlightColor="rgba(249, 115, 22, 0.18)"
            className="p-8 md:p-10 border-aviation-orange/30 shadow-2xl bg-slate-900/40"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-aviation-orange flex items-center justify-center shadow-lg shadow-orange-500/20">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-widest text-white">Project Information & Key Facts</h2>
                <p className="text-[10px] text-slate-500 font-mono">STONEHILL TECHNOFEST 2026 OFFICIAL ENTRY</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 text-sm leading-relaxed">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                  <p className="text-slate-300"><strong className="text-white">Awarded Rank:</strong> 2nd Place at TechnoFest 2026, Bangalore.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                  <p className="text-slate-300"><strong className="text-white">Lead Architect:</strong> Saifan Mohammad & Team Daemons.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                  <p className="text-slate-300"><strong className="text-white">Primary Purpose:</strong> Pre-flight safety layer & regulatory compliance assistant for civilian UAV pilots.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                  <p className="text-slate-300"><strong className="text-white">Technical Core:</strong> React 19, OpenStreetMap, Turf.js Spatial Engine, Google Gemini AI, and Open-Meteo SRTM.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                  <p className="text-slate-300"><strong className="text-white">Host Venue:</strong> Stonehill International School, Bangalore, India.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                  <p className="text-slate-300"><strong className="text-white">Geographic Focus:</strong> Bangalore regional airspace and India Drone Rules 2021.</p>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </AnimatedContent>
      </section>

      {/* Features Grid with React Bits SpotlightCard & AnimatedContent */}
      <section id="features" className="py-24 relative z-10 border-b border-slate-800 bg-slate-950/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedContent
            distance={40}
            direction="vertical"
            duration={0.7}
            trigger="scroll"
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 font-serif italic text-white">TechnoFest 2026 Core Innovations</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Explore the interactive technologies engineered for the Stonehill International School competition.</p>
          </AnimatedContent>

          <AnimatedContent
            distance={40}
            direction="vertical"
            duration={0.8}
            stagger={0.1}
            trigger="scroll"
            className="grid md:grid-cols-3 gap-6"
          >
            <SpotlightCard className="p-6">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
                <MessageSquare className="text-aviation-orange" size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">AI Safety Co-Pilot</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Powered by Google Gemini to evaluate flight corridors against India Drone Rules 2021 with instant tactical advice.</p>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
                <MapIcon className="text-blue-400" size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">OpenStreetMap Tactical Dark</h3>
              <p className="text-xs text-slate-400 leading-relaxed">High-contrast tactical dark mapping with Bangalore airport NFZ polygons and interactive waypoint vector drawing.</p>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
                <Mountain className="text-emerald-400" size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Open-Meteo SRTM Terrain</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Live elevation clearance profiles queried in real-time along your drone's flight path via Open-Meteo elevation data.</p>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
                <ShieldCheck className="text-red-400" size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Turf.js Risk Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Calculates polygon intersections and safety buffers around Yelahanka Air Force Station, KIA, and Bangalore Central.</p>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
                <Globe2 className="text-cyan-400" size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Live Weather Telemetry</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Streams localized Bengaluru wind speeds and visibility via OpenWeather API to assess safe take-off conditions.</p>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
                <Download className="text-purple-400" size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">GPX & KML Mission Export</h3>
              <p className="text-xs text-slate-400 leading-relaxed">One-click mission vector downloads ready for loading directly into professional drone flight controllers.</p>
            </SpotlightCard>
          </AnimatedContent>
        </div>
      </section>

      {/* Competition Details */}
      <section id="how-it-made" className="py-24 relative z-10 bg-slate-900/40 backdrop-blur-sm">
        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={0.8}
          trigger="scroll"
          className="max-w-4xl mx-auto px-6"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-xl bg-aviation-orange/10 border border-aviation-orange/30 flex items-center justify-center">
              <Trophy className="text-aviation-orange" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white uppercase">Stonehill TechnoFest 2026 Bangalore</h2>
              <p className="text-slate-400">Winning Entry by Team Daemons // Inter-School State Level Hackathon</p>
            </div>
          </div>

          <div className="space-y-16">
            <DocSection
              icon={<Plane size={20} className="text-aviation-orange rotate-[-45deg]" />}
              title="The Technofest Challenge"
            >
              <p>
                AirGuard was created at <strong>Stonehill International School</strong> during the 24-hour TechnoFest 2026 marathon. Tasked with solving civilian airspace safety, we designed a client-side risk assessment layer for Bengaluru drone operators.
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 my-4 font-mono text-xs text-aviation-orange/90 leading-relaxed shadow-inner">
                        // RECORD: STONEHILL TECHNOFEST 2026<br />
                        // RESULT: 2ND PRIZE (STATE LEVEL)<br />
                        // VENUE: STONEHILL INT. SCHOOL BANGALORE<br />
                        // PROJECT_CODE: DAEMONS_AIRGUARD_V2
              </div>
            </DocSection>

            <DocSection
              icon={<MousePointer2 size={20} className="text-blue-400" />}
              title="Engineered for Production"
            >
              <p className="mb-4">
                The competition required structural integrity and zero fragile mockups. AirGuard operates with live APIs:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-300 text-sm">
                <li><strong>Mapping:</strong> OpenStreetMap dark tiles with reactive vector drawing.</li>
                <li><strong>Geo-Computation:</strong> Turf.js polygon intersections against India Drone Rules 2021.</li>
                <li><strong>AI Command:</strong> Google Gemini via `@google/genai` SDK with auto-failover.</li>
                <li><strong>Terrain SRTM:</strong> Open-Meteo elevation queries along waypoint coordinates.</li>
              </ul>
            </DocSection>
          </div>
        </AnimatedContent>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50 text-center text-slate-500 text-sm bg-slate-950/90 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          <div className="flex items-center gap-2">
            <Plane className="text-aviation-orange transform -rotate-45" size={18} />
            <span className="font-bold text-slate-200 tracking-widest uppercase">AirGuard</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-bold text-xs">
            <Link to="/" className="text-aviation-orange transition-colors">Home</Link>
            <Link to="/app" className="text-slate-400 hover:text-aviation-orange transition-colors">Mission Control</Link>
            <Link to="/hackathon" className="text-slate-400 hover:text-white transition-colors">TechnoFest</Link>
            <Link to="/team" className="text-slate-400 hover:text-white transition-colors">Team</Link>
          </div>
          <p className="font-mono text-[10px] uppercase hidden lg:block">Official 2026 Stonehill TechnoFest Winner // Bangalore, India</p>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedLanding;
