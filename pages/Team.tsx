import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plane, ArrowLeft, Trophy, Users, Star, Github, Globe } from 'lucide-react';

const TeamCard = ({ imageSrc, name, role, isAward = false, onClick }: { imageSrc: string, name: string, role: string, isAward?: boolean, onClick?: () => void }) => {
  return (
    <div 
      className={`relative group rounded-3xl overflow-hidden bg-slate-900 shadow-xl ${isAward ? 'ring-2 ring-aviation-orange/50 shadow-orange-500/10' : 'border border-slate-800'} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="aspect-[3/4] overflow-hidden bg-slate-800 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
        <img 
          src={imageSrc} 
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
           {isAward && (
              <div className="flex items-center gap-2 mb-3 text-aviation-orange">
                 <Star className="fill-aviation-orange" size={16} />
                 <span className="text-[10px] font-bold tracking-widest uppercase">Special Recognition</span>
              </div>
           )}
           <h3 className={`text-2xl font-bold text-white mb-1 ${isAward ? 'font-serif italic' : ''}`}>{name}</h3>
           <p className="text-sm font-medium text-slate-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Team: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Team | AirGuard";
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-aviation-orange/30">
      
      {/* Simple Navbar */}
      <nav className={`fixed z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm font-bold tracking-tight uppercase">Return to Base</span>
          </Link>
          <div className="flex items-center gap-2">
            <Plane className="text-aviation-orange transform -rotate-45" size={18} />
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative">
         <div className="absolute top-0 right-1/4 w-96 h-96 bg-aviation-orange/5 blur-3xl rounded-full -z-10 animate-pulse-fast"></div>
         
         {/* Header */}
         <div className="mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400 mb-6">
               <Users size={12} className="text-blue-400" />
               DEVELOPED BY TEAM DAEMONS
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
               The Creators of <br className="hidden md:block"/> 
               <span className="font-serif italic font-normal text-slate-300">AirGuard</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
               Meet the young innovators behind the breakthrough urban drone safety system that secured the 2nd prize at the Stonehill International School TechnoFest 2026 Hackathon.
            </p>
         </div>

         {/* Gallery Grid */}
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
            <TeamCard 
               imageSrc="/team/saifan.jpg"
               name="Saifan"
               role="Lead Developer & Architect"
               onClick={() => setSelectedMember('Saifan')}
            />
            <TeamCard 
               imageSrc="/team/friend.jpg"
               name="Faiz"
               role="Systems Engineer"
            />
            <TeamCard 
               imageSrc="/team/award.jpg"
               name="TechnoFest 2nd Prize"
               role="Awarded at Stonehill Int. School"
               isAward={true}
            />
         </div>
      </main>

      {/* Member Detail Modal */}
      {selectedMember === 'Saifan' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            onClick={() => setSelectedMember(null)}
          ></div>
          <div className="relative bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-lg w-full animate-in zoom-in-95 duration-200 shadow-2xl">
            <h3 className="text-4xl font-serif font-bold italic text-white mb-2">Saifan</h3>
            <p className="text-aviation-orange mb-6 font-mono text-sm tracking-tight uppercase">Lead Developer & Architect</p>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Passionate young developer specializing in React, TypeScript, and AI integrations. Engineered the core risk assessment algorithms and mapping interfaces for AirGuard, bringing home the 2nd prize at TechnoFest 2026.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://github.com/SaifanX" 
                target="_blank" 
                rel="noreferrer" 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-bold"
              >
                <Github size={18} /> My GitHub
              </a>
              <a 
                href="https://github.com/SaifanX/Daemons-AirGuard" 
                target="_blank" 
                rel="noreferrer" 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-aviation-orange hover:bg-orange-600 text-white rounded-xl transition-colors font-bold"
              >
                <Globe size={18} /> Project Source
              </a>
            </div>
            <button 
              onClick={() => setSelectedMember(null)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <footer className="py-12 border-t border-slate-800/50 bg-slate-950 mt-12 relative z-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
            <div className="flex items-center gap-2">
                <Plane className="text-slate-600 transform -rotate-45" size={16} />
                <span className="font-bold text-slate-400 tracking-widest uppercase">AirGuard</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 font-bold text-xs">
              <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              <Link to="/app" className="text-slate-400 hover:text-aviation-orange transition-colors">Mission Control</Link>
              <Link to="/hackathon" className="text-slate-400 hover:text-white transition-colors">TechnoFest</Link>
              <Link to="/team" className="text-aviation-orange transition-colors">Team</Link>
            </div>
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest hidden lg:block">Team Daemons</p>
        </div>
      </footer>

    </div>
  );
};

export default Team;
