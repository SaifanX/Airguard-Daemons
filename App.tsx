import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

const MissionControl = lazy(() => import('./components/MissionControl'));
const UnifiedLanding = lazy(() => import('./pages/UnifiedLanding'));
const HackathonInfo = lazy(() => import('./pages/HackathonInfo'));
const Team = lazy(() => import('./pages/Team'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loader component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="w-16 h-16 border-4 border-slate-800 border-t-aviation-orange rounded-full animate-spin"></div>
  </div>
);

const SEOManager = () => {
  const location = useLocation();

  useEffect(() => {
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateCanonical = (path: string) => {
      let element = document.querySelector(`link[rel="canonical"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', `https://airguard-mission-control.app${path}`);
    };

    let title = "AirGuard | Home - Award-Winning Drone Safety Assistant";
    let desc = "Official 2nd Place Winner of Stonehill International School TechnoFest 2026. AirGuard is the definitive AI drone safety tool for the Bangalore TechnoFest Hackathon.";

    switch (location.pathname) {
      case "/app":
      case "/mission-control":
        title = "Mission Control | AirGuard - AI Drone Risk Assessment";
        desc = "Plan your drone flights with real-time AI risk assessments, restricted airspace checking, and live flight simulations.";
        break;
      case "/hackathon":
        title = "TechnoFest 2026 | AirGuard - Stonehill Hackathon Winner";
        desc = "Learn about Team Daemons and our journey to winning the 2nd Prize at the Stonehill International School TechnoFest 2026 Hackathon in Bangalore.";
        break;
      case "/":
        break;
      default:
        title = "404 Not Found | AirGuard";
        desc = "The requested drone flight path or page could not be found.";
    }

    document.title = title;
    updateMetaTag('description', desc);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', desc, true);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', desc);
    updateCanonical(location.pathname);

  }, [location]);

  return null;
};

const DesktopOnlyOverlay = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) return null;
  if (!['/app', '/mission-control'].includes(location.pathname)) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-slate-200">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 shadow-2xl">
        <svg className="w-8 h-8 text-aviation-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Desktop Required</h2>
      <p className="text-slate-400 font-mono text-xs leading-relaxed max-w-sm">
        Mission Control is a highly detailed tactical interface. For flight safety and precision, please access AirGuard via a desktop or tablet device.
      </p>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <SEOManager />
      <DesktopOnlyOverlay />
      <div className="bg-slate-950 min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<UnifiedLanding />} />
            <Route path="/app" element={<MissionControl />} />
            <Route path="/hackathon" element={<HackathonInfo />} />
            <Route path="/team" element={<Team />} />
            <Route path="/mission-control" element={<MissionControl />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
