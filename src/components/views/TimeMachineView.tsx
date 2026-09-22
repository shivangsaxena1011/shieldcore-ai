'use client';

import React from 'react';
import { useCyberStore } from '@/store/cyberStore';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

export default function TimeMachineView() {
  const timeMachinePlaying = useCyberStore(state => state.timeMachinePlaying);
  const timeMachineTime = useCyberStore(state => state.timeMachineTime);
  const timeMachineSpeed = useCyberStore(state => state.timeMachineSpeed);
  const setTimeMachinePlaying = useCyberStore(state => state.setTimeMachinePlaying);
  const setTimeMachineTime = useCyberStore(state => state.setTimeMachineTime);
  const setTimeMachineSpeed = useCyberStore(state => state.setTimeMachineSpeed);

  return (
    <div className="space-y-6 font-mono">
      <div className="bg-[#070b19]/60 p-4 border border-cyan-500/10 rounded-xl backdrop-blur-md flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            Cyber Time Machine (Forensic Replay Timeline)
          </h2>
          <span className="text-[10px] text-gray-400">
            Scrub back in time frame-by-frame to inspect lateral process trees, command lines, and network snapshots.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeMachinePlaying(!timeMachinePlaying)}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded text-xs transition uppercase tracking-wider"
          >
            {timeMachinePlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {timeMachinePlaying ? 'Pause Replay' : 'Play Timeline'}
          </button>
          <button
            onClick={() => { setTimeMachineTime(0); setTimeMachinePlaying(false); }}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrub Controls */}
      <div className="p-6 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md space-y-4">
        <div className="flex justify-between text-xs text-cyan-400">
          <span>T-0 (2:00 AM Incident Start)</span>
          <span className="font-bold text-white">Timeline Scrub Position: {Math.round(timeMachineTime)}%</span>
          <span>T+2h (2:14 AM Isolation)</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={timeMachineTime}
          onChange={(e) => setTimeMachineTime(Number(e.target.value))}
          className="w-full accent-cyan-400 bg-gray-800 h-2 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between items-center text-xs text-gray-400">
          <div className="flex gap-2 items-center">
            <span>Playback Speed:</span>
            {[0.5, 1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setTimeMachineSpeed(speed)}
                className={`px-2 py-0.5 rounded text-[10px] ${timeMachineSpeed === speed ? 'bg-cyan-500 text-black font-bold' : 'bg-gray-800 text-gray-400'}`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <span className="text-[10px] text-gray-500">
            Frame {Math.round(timeMachineTime * 1.4)} / 140
          </span>
        </div>
      </div>

      {/* Frame Details */}
      <div className="p-6 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Process Execution Tree Frame at {Math.round(timeMachineTime)}% Timeline
        </h3>
        <div className="bg-[#040815] p-4 rounded border border-cyan-500/20 text-xs text-gray-300 font-mono space-y-2">
          <div><span className="text-cyan-400">02:14:02.120</span> - wininit.exe (PID 620) -&gt; services.exe (PID 688)</div>
          <div><span className="text-cyan-400">02:14:02.450</span> - services.exe (PID 688) -&gt; svchost.exe (PID 840)</div>
          <div><span className="text-cyan-400">02:14:03.110</span> - svchost.exe (PID 840) -&gt; cmd.exe (PID 4012)</div>
          <div className="text-red-400 font-bold"><span className="text-cyan-400">02:14:04.990</span> - cmd.exe (PID 4012) -&gt; powershell.exe (PID 4124) -enc R2V0LUFEQ29tcHV0ZXI...</div>
        </div>
      </div>
    </div>
  );
}
