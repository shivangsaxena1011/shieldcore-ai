'use client';

import React, { useState } from 'react';
import { useCyberStore } from '@/store/cyberStore';
import { Shield } from 'lucide-react';

export default function LoginView() {
  const login = useCyberStore(state => state.login);
  const [username, setUsername] = useState('admin_shiva');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 z-10">
      <div className="w-full max-w-md bg-[#070c1f]/85 border border-cyan-500/20 rounded-xl p-8 shadow-2xl shadow-cyan-500/5 backdrop-blur-md">
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center shadow-lg shadow-cyan-500/10 mb-3">
            <Shield className="h-9 w-9 text-cyan-400 animate-pulse" />
          </div>
          <h1 className="font-mono text-xl font-bold tracking-widest text-white glow-text-cyan">
            SHIELDCORE AI
          </h1>
          <span className="font-mono text-[9px] text-cyan-500/70 tracking-widest uppercase mt-1">
            Autonomous Cyber Defense Operating System
          </span>
          <span className="font-mono text-[9px] text-amber-400/80 tracking-widest uppercase mt-2 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
            DEMO PROTOTYPE MODE
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-cyan-500/70 uppercase tracking-widest mb-1.5">Authorized Identity</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#040815] border border-cyan-500/30 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-cyan-500/70 uppercase tracking-widest mb-1.5">Cryptographic Keycode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#040815] border border-cyan-500/30 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded transition duration-200 uppercase tracking-wider text-xs shadow-lg shadow-cyan-600/20 mt-2"
          >
            Authenticate Identity
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-cyan-500/10 text-center font-mono text-[9px] text-gray-500">
          ShieldCore OS v16.2 // Prototype Environment // Non-production authentication
        </div>
      </div>
    </div>
  );
}
