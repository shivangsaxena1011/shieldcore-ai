'use client';

import React, { useState } from 'react';
import { useCyberStore } from '@/store/cyberStore';
import { Key } from 'lucide-react';

export default function MfaView() {
  const verifyMfa = useCyberStore(state => state.verifyMfa);
  const [mfaLoading, setMfaLoading] = useState(false);

  const handleFingerprintScan = () => {
    setMfaLoading(true);
    setTimeout(() => {
      setMfaLoading(false);
      verifyMfa();
    }, 1500);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 z-10">
      <div className="w-full max-w-md bg-[#070c1f]/85 border border-cyan-500/20 rounded-xl p-8 shadow-2xl shadow-cyan-500/5 backdrop-blur-md text-center">
        <div className="h-16 w-16 mx-auto rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center mb-4">
          <Key className="h-8 w-8 text-cyan-400 animate-pulse" />
        </div>
        
        <h2 className="font-mono text-lg font-bold text-white uppercase tracking-wider mb-1">
          Zero-Trust MFA Authorization
        </h2>
        <p className="font-mono text-[10px] text-gray-400 mb-6">
          Biometric Scanning Required (Simulation Demo Mode)
        </p>

        <div className="py-8 border-y border-cyan-500/10 mb-6">
          <button
            onClick={handleFingerprintScan}
            disabled={mfaLoading}
            className="group relative inline-flex items-center justify-center p-6 rounded-full bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 transition duration-300 shadow-inner"
          >
            <span className={`h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center ${mfaLoading ? 'animate-ping' : 'group-hover:scale-110 transition'}`}>
              <Key className="h-6 w-6 text-cyan-400" />
            </span>
          </button>
          <div className="font-mono text-[10px] text-cyan-400/80 mt-3">
            {mfaLoading ? 'Verifying biometric signature...' : 'Touch sensor to simulate MFA authentication'}
          </div>
        </div>

        <div className="font-mono text-[9px] text-gray-500">
          Hardware Security Token: FIPS-140-3 Compliant (Simulated)
        </div>
      </div>
    </div>
  );
}
