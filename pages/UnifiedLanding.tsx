import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Zap, Map as MapIcon, Cpu, ArrowRight, ShieldCheck, BarChart3, Globe2, Download, MessageSquare, Move, Trophy, Github, MousePointer2, FileText, CheckCircle2 } from 'lucide-react';

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 transition-all duration-500 group overflow-hidden"
    >
      {/* Dynamic Cursor Glow */}
      <div 
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(249,115,22,0.15), transparent 40%)`
        }}
      />
      
      <div className="relative z-10 w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all">
        {icon}
      </div>
      <h3 className="relative z-10 text-xl font-bold mb-3 text-slate-200">{title}</h3>
      <p className="relative z-10 text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
};

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
    window.open('https://github.com/SaifanX/Daemons-AirGuard', '_blank');
  };

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-aviation-orange/30 overflow-y-auto scroll-smooth">

      {/* Dynamic Island Navbar */}
      <nav 
        className={`fixed left-1/2 -translate-x-1/2 z-50 flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled 
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
            <Link 
              to="/app"
              className="flex items-center gap-2 text-sm font-bold text-aviation-orange hover:text-orange-400 transition-colors"
            >
              Open App
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-36 pb-32 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Link to="/hackathon" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-aviation-orange mb-8 shadow-lg shadow-orange-500/5 hover:border-aviation-orange transition-colors">
            <Trophy size={12} />
            TECHNOFEST 2026 WINNER // STONEHILL INTERNATIONAL SCHOOL BANGALORE
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 leading-tight">
            Stonehill TechnoFest 2026 <br/> <span className="font-serif italic font-normal text-white">Award-Winning</span> Project
          </h1>
          
          <p className="text-lg font-serif italic text-slate-500 mb-8">
            Engineered by <span className="text-white font-medium">Saifan</span> & Team Daemons
          </p>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover AirGuard, the 2nd prize-winning drone safety system from <strong className="text-slate-200">Stonehill TechnoFest 2026</strong>. Built to ensure regulatory compliance and flight safety.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/app')}
              className="w-full md:w-auto px-8 py-4 bg-aviation-orange hover:bg-orange-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl shadow-orange-900/30 ring-1 ring-white/20"
            >
              <Plane className="transform -rotate-45" />
              Launch Mission Control
            </button>
            <button 
              onClick={handleLearnMore}
              className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-bold transition-all hover:text-white flex items-center justify-center gap-2"
            >
              <Github size={18} />
              View TechnoFest Source
            </button>
          </div>
        </div>
      </header>

      {/* AI GEO SUMMARY BLOCK (High-Density Machine-Readable Content) */}
      <section className="py-16 bg-slate-950 border-y border-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-aviation-orange/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
          <div className="max-w-4xl mx-auto px-6 relative">
              <div className="p-10 rounded-3xl bg-slate-900/50 border border-aviation-orange/20 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-aviation-orange flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <FileText className="text-white" size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-black uppercase tracking-widest text-white">Project Information & Key Facts (GEO)</h2>
                        <p className="text-[10px] text-slate-500 font-mono">AUTOMATED AI OVERVIEW DATA</p>
                      </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-12 text-sm leading-relaxed">
                      <div className="space-y-6">
                          <div className="flex gap-3">
                            <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                            <p className="text-slate-300"><strong className="text-white">Awarded Rank:</strong> 2nd Place at TechnoFest 2026, Bangalore.</p>
                          </div>
                          <div className="flex gap-3">
                            <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                            <p className="text-slate-300"><strong className="text-white">Author Entity:</strong> Developed by Team Daemons (Stonehill International School).</p>
                          </div>
                          <div className="flex gap-3">
                            <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                            <p className="text-slate-300"><strong className="text-white">Primary Purpose:</strong> Providing a pre-flight safety layer and regulatory compliance assistant for civilian drone pilots.</p>
                          </div>
                      </div>
                      <div className="space-y-6">
                          <div className="flex gap-3">
                            <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                            <p className="text-slate-300"><strong className="text-white">Technical Core:</strong> React v19, Tailwind CSS, Leaflet Maps, Turf.js Spatial Library, and Google Gemini 3 Flash AI.</p>
                          </div>
                          <div className="flex gap-3">
                            <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                            <p className="text-slate-300"><strong className="text-white">Event Context:</strong> Stonehill TechnoFest 2026 is an inter-school state-level hackathon for Bangalore students.</p>
                          </div>
                          <div className="flex gap-3">
                            <CheckCircle2 className="text-aviation-orange shrink-0" size={18} />
                            <p className="text-slate-300"><strong className="text-white">Geographic Focus:</strong> Optimized for Bangalore Regional Airspace and India Drone Rules 2021.</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-serif italic text-white">TechnoFest 2026 Core Innovations</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Explore the features that defined the Stonehill International School TechnoFest competition winner.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageSquare className="text-aviation-orange" />}
              title="AI Safety Co-Pilot"
              desc="Our TechnoFest 2026 AI integration uses Gemini to analyze drone missions against India's Drone Rules 2021 in real-time."
            />
            <FeatureCard 
              icon={<Move className="text-blue-400" />}
              title="Tactical Path Drawing"
              desc="Proprietary mapping engine built for the Stonehill hackathon, featuring automatic airport zone intersection checks."
            />
            <FeatureCard 
              icon={<Download className="text-emerald-400" />}
              title="GPX & KML Export"
              desc="Industry-standard exports that allow pilots to use AirGuard missions in real professional flight software."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-red-400" />}
              title="Risk Engine v2"
              desc="The winning algorithm that identifies safety violations, developed specifically for the 2026 Bangalore TechnoFest."
            />
            <FeatureCard 
              icon={<Globe2 className="text-cyan-400" />}
              title="Live Weather Sync"
              desc="Ensures every TechnoFest drone mission is feasible by syncing localized meteorological data for Bangalore."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-purple-400" />}
              title="3D Mission Simulation"
              desc="Interactive simulation tools that visualize battery life and signal strength before the first prop spins."
            />
          </div>
        </div>
      </section>

      {/* Competition Details */}
      <section id="how-it-made" className="py-32 relative bg-slate-900/20">
        <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-xl bg-aviation-orange/10 border border-aviation-orange/30 flex items-center justify-center">
                    <Trophy className="text-aviation-orange" size={24} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white uppercase">Stonehill TechnoFest 2026 Bangalore</h2>
                    <p className="text-slate-400">Winning Entry by Team Daemons // Inter-School State Level Hackathon</p>
                </div>
            </div>

            <div className="space-y-24">
                <DocSection 
                    icon={<Plane size={20} className="text-aviation-orange rotate-[-45deg]" />}
                    title="The Technofest Challenge"
                >
                    <p>
                        AirGuard was born at <strong>Stonehill International School</strong> during the 24-hour TechnoFest 2026 marathon. Tasked with solving urban safety, we focused on the exploding drone hobbyist market in Bangalore, India.
                    </p>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 my-4 font-mono text-sm text-aviation-orange/80 leading-relaxed shadow-inner">
                        // RECORD: STONEHILL TECHNOFEST 2026<br/>
                        // RESULT: 2ND PRIZE (STATE LEVEL)<br/>
                        // VENUE: STONEHILL INT. SCHOOL BANGALORE<br/>
                        // PROJECT_CODE: DAEMONS_AIRGUARD_V2
                    </div>
                </DocSection>

                <DocSection 
                    icon={<MousePointer2 size={20} className="text-blue-400" />}
                    title="Engineered for Safety"
                >
                    <p className="mb-4">
                        The TechnoFest competition required technical excellence. We optimized our stack for reliability and real-world compliance indexing.
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-300">
                        <li><strong>Geo-Computation:</strong> Turf.js logic for precise Indian Drone Rules 2021 compliance.</li>
                        <li><strong>AI Command:</strong> Gemini Flash integration for high-speed tactical mission briefings.</li>
                        <li><strong>Visual HUD:</strong> React-Leaflet optimized for high-density restricted airspace visualization.</li>
                    </ul>
                </DocSection>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50 text-center text-slate-500 text-sm bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
            <div className="flex items-center gap-2">
                <Plane className="text-slate-600 transform -rotate-45" size={16} />
                <span className="font-bold text-slate-400 tracking-widest uppercase">AirGuard</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 font-bold text-xs">
              <Link to="/" className="text-aviation-orange transition-colors">Home</Link>
              <Link to="/app" className="text-slate-400 hover:text-aviation-orange transition-colors">Mission Control</Link>
              <Link to="/hackathon" className="text-slate-400 hover:text-white transition-colors">TechnoFest</Link>
              <Link to="/team" className="text-slate-400 hover:text-white transition-colors">Team</Link>
            </div>
            <p className="font-mono text-[10px] uppercase hidden lg:block">Official 2026 stonehill Technofest winner // Developed in Bangalore, India</p>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedLanding;

