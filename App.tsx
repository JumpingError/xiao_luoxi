import React from 'react';
import { Scene } from './components/Scene';

export default function App() {
  return (
    <div className="relative w-full h-full bg-slate-900 text-white overflow-hidden">
      {/* Background Gradient - slightly softer for the new aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black pointer-events-none" />
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-10">
        <Scene />
      </div>
    </div>
  );
}