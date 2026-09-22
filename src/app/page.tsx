'use client';

import React, { useState, useEffect } from 'react';
import { useCyberStore, Incident } from '@/store/cyberStore';

// View Imports
import LoginView from '@/components/views/LoginView';
import MfaView from '@/components/views/MfaView';
import OnboardingView from '@/components/views/OnboardingView';
import SocDashboardView from '@/components/views/SocDashboardView';
import KnowledgeGraphView from '@/components/views/KnowledgeGraphView';
import TimeMachineView from '@/components/views/TimeMachineView';
import ExecutiveView from '@/components/views/ExecutiveView';
import { 
  AgentsMonitorView, AssetInventoryView, VulnerabilitiesView, ParliamentView, IncidentsView 
} from '@/components/views/OtherViews';

import ThreeDigitalTwin from '@/components/ThreeDigitalTwin';
import CopilotPanel from '@/components/CopilotPanel';

import { 
  Shield, Activity, Database, Users, Network, Clock, FileText, Zap, LogOut, MessageSquare, Info, X, AlertTriangle 
} from 'lucide-react';

export default function CyberOS() {
  // Granular Zustand Selectors (Prevents re-renders on every telemetry tick)
  const activeTab = useCyberStore(state => state.activeTab);
  const isAuthenticated = useCyberStore(state => state.isAuthenticated);
  const mfaVerified = useCyberStore(state => state.mfaVerified);
  const onboarded = useCyberStore(state => state.onboarded);
  const setActiveTab = useCyberStore(state => state.setActiveTab);
  const logout = useCyberStore(state => state.logout);
  const tickSimulatedStreams = useCyberStore(state => state.tickSimulatedStreams);

  const [systemTime, setSystemTime] = useState('');
  const [showCopilot, setShowCopilot] = useState(true);
  const [notif, setNotif] = useState<string | null>(null);

  // System clock & controlled telemetry tick interval
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setSystemTime(d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    }, 1000);

    const stream = setInterval(() => {
      tickSimulatedStreams();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(stream);
    };
  }, [tickSimulatedStreams]);

  const handleLinkIncident = (inc: Incident) => {
    setActiveTab('digital-twin');
    setNotif(`Digital Twin focused on affected nodes: ${inc.affectedNodes.join(', ')}`);
  };

  const navItems = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: Activity },
    { id: 'incidents', label: 'Incidents Queue', icon: AlertTriangle },
    { id: 'digital-twin', label: '3D WebGL Twin', icon: Shield },
    { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Network },
    { id: 'time-machine', label: 'Time Machine', icon: Clock },
    { id: 'executive', label: 'Executive Intelligence', icon: FileText },
    { id: 'agents', label: 'AI Agents Grid', icon: Users },
    { id: 'assets', label: 'Asset Inventory', icon: Database },
    { id: 'vulnerabilities', label: 'CVE Vulnerabilities', icon: Zap },
    { id: 'parliament', label: 'Parliament Mode', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-gray-300 flex flex-col relative select-none font-mono">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0"></div>

      {/* Futuristic Scanline effect */}
      <div className="absolute inset-0 pointer-events-none z-50 scanlines opacity-[0.03]"></div>

      {/* Local Notification Banner */}
      {notif && (
        <div className="absolute top-4 right-4 z-50 max-w-sm bg-cyan-950/90 border border-cyan-400 text-cyan-300 px-4 py-3 rounded shadow-lg shadow-cyan-500/10 flex items-center justify-between font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 animate-bounce text-cyan-400" />
            <span>{notif}</span>
          </div>
          <button onClick={() => setNotif(null)} className="text-cyan-400 hover:text-white pl-2">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Router rendering based on Auth state */}
      {!isAuthenticated && <LoginView />}
      {isAuthenticated && !mfaVerified && <MfaView />}
      {isAuthenticated && mfaVerified && !onboarded && <OnboardingView />}

      {/* Main Authenticated OS Layout */}
      {isAuthenticated && mfaVerified && onboarded && (
        <div className="flex-grow flex flex-col h-screen z-10 overflow-hidden">
          
          {/* Top Operational Header */}
          <header className="h-14 bg-[#070c1f]/80 border-b border-cyan-500/20 px-6 flex items-center justify-between backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-cyan-950 border border-cyan-400/50 flex items-center justify-center">
                <Shield className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-widest uppercase glow-text-cyan">
                  SHIELDCORE AI
                </h1>
                <span className="text-[9px] text-cyan-400/70 uppercase tracking-wider block">
                  Autonomous Cyber Defense Operating System
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div className="text-gray-400">
                System Clock: <span className="text-cyan-300 font-bold">{systemTime}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>CNI Grid Shield Active</span>
              </div>
              <button
                onClick={() => setShowCopilot(!showCopilot)}
                className={`p-2 rounded border transition ${showCopilot ? 'bg-cyan-950 border-cyan-400 text-cyan-300' : 'bg-gray-900 border-gray-700 text-gray-400'}`}
                title="Toggle AI Security Copilot"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition text-[11px]"
              >
                <LogOut className="h-3.5 w-3.5" />
                Disconnect
              </button>
            </div>
          </header>

          {/* Main Content Body */}
          <div className="flex-grow flex overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-56 bg-[#040815]/90 border-r border-cyan-500/10 p-3 space-y-1 shrink-0 overflow-y-auto">
              <div className="text-[9px] text-gray-500 uppercase tracking-widest px-3 py-2 font-bold">
                Navigation Control
              </div>
              {navItems.map((item) => {
                const IconComp = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition duration-150 ${
                      active
                        ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold shadow-sm shadow-cyan-500/10'
                        : 'text-gray-400 hover:bg-cyan-950/30 hover:text-gray-200'
                    }`}
                  >
                    <IconComp className={`h-4 w-4 ${active ? 'text-cyan-400' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </aside>

            {/* Viewport View Content */}
            <main className="flex-grow p-6 overflow-y-auto bg-[#030712]/40">
              {activeTab === 'dashboard' && <SocDashboardView onLinkIncident={handleLinkIncident} />}
              {activeTab === 'incidents' && <IncidentsView onLinkIncident={handleLinkIncident} />}
              {activeTab === 'digital-twin' && (
                <div className="h-full min-h-[600px]">
                  <ThreeDigitalTwin />
                </div>
              )}
              {activeTab === 'knowledge-graph' && <KnowledgeGraphView />}
              {activeTab === 'time-machine' && <TimeMachineView />}
              {activeTab === 'executive' && <ExecutiveView />}
              {activeTab === 'agents' && <AgentsMonitorView />}
              {activeTab === 'assets' && <AssetInventoryView />}
              {activeTab === 'vulnerabilities' && <VulnerabilitiesView />}
              {activeTab === 'parliament' && <ParliamentView />}
            </main>

            {/* Right AI Security Copilot Panel */}
            {showCopilot && (
              <aside className="w-96 p-4 border-l border-cyan-500/10 bg-[#040815]/90 shrink-0 overflow-hidden">
                <CopilotPanel />
              </aside>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
