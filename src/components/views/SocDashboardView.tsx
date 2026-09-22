'use client';

import React, { useState } from 'react';
import { useCyberStore, Incident } from '@/store/cyberStore';
import ThreeDigitalTwin from '@/components/ThreeDigitalTwin';
import CyberGlobe from '@/components/CyberGlobe';
import { Terminal, PlaySquare, AlertTriangle, Activity, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface SocDashboardViewProps {
  onLinkIncident: (inc: Incident) => void;
}

export default function SocDashboardView({ onLinkIncident }: SocDashboardViewProps) {
  // Zustand Granular Selectors
  const incidents = useCyberStore(state => state.incidents);
  const logs = useCyberStore(state => state.logs);
  const agentMessages = useCyberStore(state => state.agentMessages);
  const supervisorWorkflowActive = useCyberStore(state => state.supervisorWorkflowActive);
  const supervisorStatus = useCyberStore(state => state.supervisorStatus);
  const supervisorLogs = useCyberStore(state => state.supervisorLogs);
  const globalArs = useCyberStore(state => state.globalArs);
  const executeCommandCenterWorkflow = useCyberStore(state => state.executeCommandCenterWorkflow);
  const setActiveTab = useCyberStore(state => state.setActiveTab);

  const [commandInput, setCommandInput] = useState('');
  const [viewMode, setViewMode] = useState<'twin' | 'globe'>('twin');

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || supervisorWorkflowActive) return;
    executeCommandCenterWorkflow(commandInput);
    setCommandInput('');
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* Natural Language Command Center Bar */}
      <div className="bg-[#070b19]/80 border border-cyan-500/20 rounded-xl p-4 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              AI Security Command Center (Multi-Agent Supervisor Loop)
            </span>
          </div>
          {supervisorWorkflowActive && (
            <span className="text-[10px] text-amber-400 animate-pulse flex items-center gap-1 font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              {supervisorStatus}
            </span>
          )}
        </div>

        <form onSubmit={handleCommandSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Execute Natural Language SOAR Command (e.g. 'Protect AIIMS from ransomware')..."
            disabled={supervisorWorkflowActive}
            className="flex-grow bg-[#040815] border border-cyan-500/30 rounded px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
          />
          <button
            type="submit"
            disabled={supervisorWorkflowActive || !commandInput.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-950 disabled:text-gray-600 text-white font-bold px-5 py-2.5 rounded text-xs transition uppercase tracking-wider flex items-center justify-center gap-2 shrink-0"
          >
            Dispatch Agents
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {supervisorLogs.length > 0 && (
          <div className="mt-3 p-3 bg-[#040815] border border-cyan-500/10 rounded max-h-28 overflow-y-auto text-[10px] text-cyan-300 space-y-1">
            {supervisorLogs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-cyan-500">❯</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Viewport & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: 3D Twin or Globe Switcher */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#070b19]/60 p-3 border border-cyan-500/10 rounded-xl backdrop-blur-md">
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">
              CNI Digital Twin & Telemetry Viewport
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('twin')}
                className={`flex-1 sm:flex-none px-3 py-1 rounded text-[10px] font-bold transition uppercase ${viewMode === 'twin' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                3D WebGL Twin
              </button>
              <button
                onClick={() => setViewMode('globe')}
                className={`flex-1 sm:flex-none px-3 py-1 rounded text-[10px] font-bold transition uppercase ${viewMode === 'globe' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                2D Cyber Globe
              </button>
            </div>
          </div>

          <div className="min-h-[400px] h-[420px]">
            {viewMode === 'twin' ? <ThreeDigitalTwin /> : <CyberGlobe />}
          </div>
        </div>

        {/* Right 1 Column: Agent Message Bus & ARS Index */}
        <div className="space-y-4">
          
          {/* ARS Widget */}
          <div className="p-4 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Global Resilience Index</span>
              <div className="text-3xl font-bold text-white glow-text-cyan mt-1">{globalArs}/100</div>
              <span className="text-[9px] text-emerald-400">Autonomous Defense Active</span>
            </div>
            <div className="h-12 w-12 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
            </div>
          </div>

          {/* Multi-Agent Live Message Stream */}
          <div className="p-4 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md flex flex-col h-[330px]">
            <div className="flex justify-between items-center pb-2 border-b border-cyan-500/10 mb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Multi-Agent Message Bus
              </span>
              <span className="text-[9px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-300">
                {agentMessages.length} Messages
              </span>
            </div>

            <div className="flex-grow overflow-y-auto space-y-2.5 text-[10px]">
              {agentMessages.length === 0 ? (
                <div className="text-gray-500 italic text-center pt-8">
                  Awaiting agent message broadcasts...
                </div>
              ) : (
                agentMessages.map((msg) => (
                  <div key={msg.id} className="p-2.5 rounded bg-[#040815] border border-cyan-500/10 space-y-1">
                    <div className="flex justify-between text-gray-400 text-[9px]">
                      <span className="text-cyan-400 font-bold">{msg.sender} → {msg.recipient}</span>
                      <span>{msg.timestamp.substring(11, 19)}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{msg.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Incidents & Telemetry Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Incidents */}
        <div className="p-4 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md font-mono">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Active CNI Incidents Queue
            </h3>
            <button 
              onClick={() => setActiveTab('incidents')} 
              className="text-[10px] text-cyan-400 hover:underline"
            >
              View All ({incidents.length})
            </button>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 2).map((inc) => (
              <div key={inc.id} className="p-3 bg-[#040815] border border-red-500/20 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-white">{inc.title}</div>
                  <span className="text-[9px] text-gray-400">{inc.source} • {inc.mitreTechnique}</span>
                </div>
                <button
                  onClick={() => onLinkIncident(inc)}
                  className="bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1"
                >
                  <PlaySquare className="h-3 w-3" />
                  Investigate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Kafka Telemetry Stream */}
        <div className="p-4 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md font-mono">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              Kafka Real-Time Telemetry Stream
            </h3>
            <span className="text-[9px] text-emerald-400 animate-pulse">● LIVE STREAM</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto text-[10px]">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-2 bg-[#040815] border border-cyan-500/10 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-gray-400">{log.timestamp.substring(11, 19)}</span>
                  <span className="text-cyan-300 font-bold max-w-[160px] truncate">{log.source}</span>
                </div>
                <span className="text-gray-300 truncate text-[9px] sm:text-[10px]">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
