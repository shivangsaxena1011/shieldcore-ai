'use client';

import React from 'react';
import { useCyberStore } from '@/store/cyberStore';
import { Zap, Train, Hospital, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function OnboardingView() {
  const onboard = useCyberStore(state => state.onboard);

  const sectors = [
    { id: 'power_grid', name: 'Power & Energy Grid', icon: Zap, color: 'text-amber-400', desc: 'SCADA, PLCs, & High-voltage transmission substations' },
    { id: 'railways', name: 'Railways & Transport', icon: Train, color: 'text-emerald-400', desc: 'Signaling servers & Automated traffic control gateways' },
    { id: 'healthcare', name: 'National Healthcare', icon: Hospital, color: 'text-rose-400', desc: 'AIIMS Mainframe DBs & Hospital network trust enclaves' },
    { id: 'smart_cities', name: 'Smart Cities & Telecom', icon: Building2, color: 'text-sky-400', desc: 'Surveillance grids & NIC edge cloud gateways' }
  ];

  return (
    <div className="flex-grow flex items-center justify-center p-4 z-10">
      <div className="w-full max-w-4xl bg-[#070c1f]/85 border border-cyan-500/20 rounded-xl p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 mx-auto rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center mb-3">
            <ShieldCheck className="h-6 w-6 text-cyan-400" />
          </div>
          <h2 className="font-mono text-xl font-bold text-white uppercase tracking-widest">
            Select CNI Sector Enclave
          </h2>
          <p className="font-mono text-xs text-gray-400 mt-1">
            Choose Critical Infrastructure Sector for AI Autonomous Defense Monitoring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {sectors.map((sec) => {
            const IconComp = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => onboard(sec.id)}
                className="group p-5 rounded-xl border border-cyan-500/20 bg-[#040815]/60 hover:bg-cyan-950/40 hover:border-cyan-400/60 text-left transition duration-300 flex items-start gap-4"
              >
                <div className="p-3 rounded-lg bg-cyan-950/50 border border-cyan-500/20 shrink-0">
                  <IconComp className={`h-6 w-6 ${sec.color}`} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-mono text-sm font-bold text-white group-hover:text-cyan-400 transition flex items-center justify-between">
                    {sec.name}
                    <ArrowRight className="h-4 w-4 text-cyan-500/50 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="font-mono text-[11px] text-gray-400 mt-1">
                    {sec.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={() => onboard('all')}
            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold px-6 py-2.5 rounded uppercase tracking-wider transition shadow-lg shadow-cyan-600/20"
          >
            Monitor All CNI Sectors (Unified National Command)
          </button>
        </div>
      </div>
    </div>
  );
}
