import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4">
      <AlertTriangle className="w-24 h-24 text-aviation-orange mb-6 animate-pulse" />
      <h1 className="text-6xl font-bold font-mono tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-aviation-orange to-red-500">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center font-serif italic text-white">
        Airspace Restricted: Page Not Found
      </h2>
      <p className="text-slate-400 max-w-md text-center mb-8">
        The given URL does not exist on this server. Please verify your URL path or return to the launch pad.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 bg-aviation-orange hover:bg-orange-600 text-white rounded-lg font-medium transition-colors border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
      >
        <Home className="w-5 h-5" />
        Return to Base
      </Link>
    </div>
  );
};

export default NotFound;
