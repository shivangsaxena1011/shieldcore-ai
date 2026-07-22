'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCyberStore, CyberLog, Incident, Asset, Vulnerability, AgentMessage, SigmaRule } from '@/store/cyberStore';
import CyberGlobe from '@/components/CyberGlobe';
import ThreeDigitalTwin from '@/components/ThreeDigitalTwin';
import CopilotPanel from '@/components/CopilotPanel';
import { 
  Shield, ShieldAlert, ShieldCheck, Terminal, Activity, Database, Server, Cloud, Cpu, 
  Zap, Train, Hospital, Building2, Network, Brain, Clock, Lock, User, Users, Settings, 
  Play, Pause, RotateCcw, FileText, AlertTriangle, Search, Share2, Sliders, Download, 
  Mic, Volume2, Key, Check, RefreshCw, Bell, FileDown, X, Info, ChevronRight, Eye, PlaySquare
} from 'lucide-react';

export default function CyberOS() {
  const store = useCyberStore();
  const [username, setUsername] = useState('admin_shiva');
  const [password, setPassword] = useState('••••••••');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState('Awaiting command...');
  const [systemTime, setSystemTime] = useState('');
  
  // Search and filter states
  const [assetSearch, setAssetSearch] = useState('');
  const [assetFilter, setAssetFilter] = useState('all');
  const [incidentFilter, setIncidentFilter] = useState('all');
  const [cveSearch, setCveSearch] = useState('');
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [commandInput, setCommandInput] = useState('');

  // Local notification banner state
  const [notif, setNotif] = useState<string | null>(null);

  // Graph traversal highlights
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>(null);
  const [shortestPathActive, setShortestPathActive] = useState(false);

  // Time machine interval ref
  const timeMachineInterval = useRef<NodeJS.Timeout | null>(null);

  // Live telemetry stream and system clock
  useEffect(() => {
    // Clock
    const timer = setInterval(() => {
      const d = new Date();
      setSystemTime(d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    }, 1000);

    // Kafka stream ticks
    const stream = setInterval(() => {
      store.tickSimulatedStreams();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(stream);
    };
  }, [store]);

  // Cyber Time Machine Playback Logic
  useEffect(() => {
    if (store.timeMachinePlaying) {
      timeMachineInterval.current = setInterval(() => {
        const nextTime = store.timeMachineTime + (0.5 * store.timeMachineSpeed);
        if (nextTime >= 100) {
          store.setTimeMachinePlaying(false);
          store.setTimeMachineTime(100);
          setNotif("Forensic Playback completed. All timeline nodes analysed.");
        } else {
          store.setTimeMachineTime(nextTime);
        }
      }, 300);
    } else {
      if (timeMachineInterval.current) {
        clearInterval(timeMachineInterval.current);
      }
    }

    return () => {
      if (timeMachineInterval.current) clearInterval(timeMachineInterval.current);
    };
  }, [store.timeMachinePlaying, store.timeMachineTime, store.timeMachineSpeed, store.setTimeMachinePlaying, store.setTimeMachineTime]);

  const handleFingerprintScan = () => {
    setMfaLoading(true);
    setTimeout(() => {
      setMfaLoading(false);
      store.verifyMfa();
    }, 1500);
  };

  const handleVoiceCommand = () => {
    setVoiceActive(true);
    setVoiceText('Listening for command...');
    setTimeout(() => {
      setVoiceText('Recognized: "Status of power grid?"');
      setTimeout(() => {
        setVoiceActive(false);
        store.setActiveTab('dashboard');
        store.sendCopilotMessage('Status of power grid?');
        setNotif('Security Copilot responded to voice command.');
      }, 1000);
    }, 2000);
  };

  const triggerPDFDownload = () => {
    setNotif("Generating ShieldCore AI Executive Briefing PDF report...");
    setTimeout(() => {
      setNotif("Report downloaded successfully: ShieldCore_Briefing_Report.pdf");
    }, 2000);
  };

  const handleCommandCenterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    store.executeCommandCenterWorkflow(commandInput);
    setCommandInput('');
  };

  const handleLinkIncident = (inc: Incident) => {
    store.setActiveTab('digital-twin');
    setNotif(`Digital Twin focused on affected nodes: ${inc.affectedNodes.join(', ')}`);
  };

  // Traversal path logic on knowledge graph
  const getLinksForNode = (nodeId: string | null) => {
    if (!nodeId) return store.graphLinks;
    if (shortestPathActive) {
      // Highlight direct path from malicious IP to database records
      const pathNodes = ['ip-vpn', 'u-shiva', 'srv-aiims', 'db-scada'];
      return store.graphLinks.map(l => ({
        ...l,
        active: pathNodes.includes(l.source) && pathNodes.includes(l.target)
      }));
    }
    return store.graphLinks.map(l => ({
      ...l,
      active: l.source === nodeId || l.target === nodeId
    }));
  };

  const activeGraphLinks = getLinksForNode(selectedGraphNode);

  return (
    <div className="min-h-screen bg-[#030712] text-gray-300 flex flex-col relative select-none">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0"></div>

      {/* Futuristic Scanline effect */}
      <div className="absolute inset-0 pointer-events-none z-50 scanlines opacity-[0.03]"></div>

      {/* Notification Banner */}
      {notif && (
        <div className="absolute top-4 right-4 z-50 max-w-sm bg-cyan-950/90 border border-cyan-400 text-cyan-300 px-4 py-3 rounded shadow-lg shadow-cyan-500/10 flex items-center justify-between font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 animate-bounce" />
            <span>{notif}</span>
          </div>
          <button onClick={() => setNotif(null)} className="text-cyan-400 hover:text-white pl-2">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: LOGIN PAGE
          ========================================================================= */}
      {store.activeTab === 'login' && (
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
            </div>

            <div className="space-y-4 font-mono text-xs">
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

              <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
                <Lock className="h-3.5 w-3.5 text-cyan-500/50" />
                <span>Standard military-grade CNI operations credentials.</span>
              </div>

              <button
                onClick={store.login}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded transition duration-200 mt-6 tracking-widest uppercase border border-cyan-400/40 shadow-lg shadow-cyan-500/20"
              >
                Authenticate Session
              </button>
            </div>
            
            <div className="mt-8 text-center text-[8px] font-mono text-cyan-500/30">
              SECURE SECTOR ACCESS // DECLASSIFIED UNDER LAW OF NATIONAL RESILIENCE
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: MULTI-FACTOR AUTHENTICATION
          ========================================================================= */}
      {store.activeTab === 'mfa' && (
        <div className="flex-grow flex items-center justify-center p-4 z-10">
          <div className="w-full max-w-sm bg-[#070c1f]/85 border border-cyan-500/20 rounded-xl p-8 text-center shadow-2xl backdrop-blur-md">
            <h2 className="font-mono text-md font-bold tracking-widest text-white mb-2 uppercase">
              MFA Verification Required
            </h2>
            <p className="font-mono text-[10px] text-gray-400 mb-6">
              Biometric verification loop triggered for ID: <span className="text-cyan-400">{username}</span>
            </p>

            <div className="flex flex-col items-center justify-center my-6">
              <button 
                onClick={handleFingerprintScan}
                disabled={mfaLoading}
                className={`relative h-24 w-24 rounded-full border-2 ${
                  mfaLoading ? 'border-cyan-500 animate-pulse' : 'border-cyan-500/30 hover:border-cyan-400'
                } bg-[#040815] flex items-center justify-center transition cursor-pointer group`}
              >
                <div className="absolute inset-x-2 h-[2px] bg-cyan-400 opacity-60 animate-bounce" style={{ animationDuration: '2.5s' }} />
                <Cpu className="h-10 w-10 text-cyan-400 group-hover:scale-110 transition duration-300" />
              </button>
              
              <span className="font-mono text-[9px] text-cyan-400/70 tracking-wider uppercase mt-4">
                {mfaLoading ? 'Scanning biometric markers...' : 'Press scanner to authorize'}
              </span>
            </div>

            <div className="text-[9px] font-mono text-gray-500 mt-6 leading-relaxed">
              Provides Hardware Key validation & behavioral token recognition.
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: ORGANIZATION ONBOARDING
          ========================================================================= */}
      {store.activeTab === 'onboarding' && (
        <div className="flex-grow flex items-center justify-center p-4 z-10">
          <div className="w-full max-w-2xl bg-[#070c1f]/85 border border-cyan-500/20 rounded-xl p-8 shadow-2xl backdrop-blur-md">
            <h2 className="font-mono text-lg font-bold tracking-widest text-white mb-2 uppercase text-center">
              Critical Sector Onboarding Grid
            </h2>
            <p className="font-mono text-[11px] text-gray-400 text-center mb-8">
              Select the primary critical national infrastructure sector to route through ShieldCore AI sensors.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <button 
                onClick={() => store.onboard('power_grid')}
                className="p-4 border border-cyan-500/10 hover:border-cyan-400/50 bg-[#040815]/60 hover:bg-cyan-950/20 rounded-lg text-left transition duration-200"
              >
                <div className="flex items-center gap-3 mb-2 text-cyan-400">
                  <Zap className="h-5 w-5" />
                  <span className="font-bold">National Power Grid Command</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  Defend SCADA telemetry, PLC firmware integrity, substations, and local hydro/nuclear distributions.
                </p>
              </button>

              <button 
                onClick={() => store.onboard('railways')}
                className="p-4 border border-cyan-500/10 hover:border-cyan-400/50 bg-[#040815]/60 hover:bg-cyan-950/20 rounded-lg text-left transition duration-200"
              >
                <div className="flex items-center gap-3 mb-2 text-indigo-400">
                  <Train className="h-5 w-5" />
                  <span className="font-bold">Indian Railways Signaling Network</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  Secure rail network traffic gateways, inter-station train signaling networks, and ticketing databases.
                </p>
              </button>

              <button 
                onClick={() => store.onboard('healthcare')}
                className="p-4 border border-cyan-500/10 hover:border-cyan-400/50 bg-[#040815]/60 hover:bg-cyan-950/20 rounded-lg text-left transition duration-200"
              >
                <div className="flex items-center gap-3 mb-2 text-emerald-400">
                  <Hospital className="h-5 w-5" />
                  <span className="font-bold">AIIMS & Healthcare Systems</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  Shield central medical records database, IoT devices, and hospital enclave trust domains.
                </p>
              </button>

              <button 
                onClick={() => store.onboard('all')}
                className="p-4 border border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/10 hover:bg-cyan-950/30 rounded-lg text-left transition duration-200 col-span-1 md:col-span-2"
              >
                <div className="flex items-center gap-3 mb-2 text-white">
                  <Network className="h-5 w-5 text-cyan-400" />
                  <span className="font-bold text-cyan-300">Defend All CNI Sectors (NIC Unified Cloud Enclave)</span>
                </div>
                <p className="text-[10px] text-gray-300">
                  Route telemetry from Power, Railways, Healthcare, CBSE, Smart Cities, and local ministries through a single centralized multi-agent system.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN APPLICATION SHELL (ACTIVE FOR ALL OTHER TABS)
          ========================================================================= */}
      {store.isAuthenticated && store.mfaVerified && store.onboarded && (
        <div className="flex-grow flex flex-col z-10">
          
          {/* HEADER WITH REAL-TIME STATUS AND COMMAND CENTER */}
          <header className="border-b border-cyan-500/10 bg-[#070c1f]/80 backdrop-blur-md px-6 py-3 flex flex-wrap items-center justify-between font-mono text-[10px] gap-4">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-7 w-7 rounded bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="h-4.5 w-4.5 text-cyan-400" />
              </div>
              <div>
                <span className="text-white font-bold tracking-widest text-xs">SHIELDCORE AI</span>
                <span className="text-cyan-500/80 pl-2 border-l border-cyan-500/20 uppercase">Autonomous Cyber OS</span>
              </div>
            </div>

            {/* AI Security Command Center (Natural Language Operations Console) */}
            <form 
              onSubmit={handleCommandCenterSubmit}
              className="flex-grow max-w-lg relative"
            >
              <Terminal className="absolute left-3 top-2.5 h-3.5 w-3.5 text-cyan-500/50" />
              <input
                type="text"
                placeholder="Enter Security Command (e.g. 'Protect AIIMS from ransomware')..."
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                disabled={store.supervisorWorkflowActive}
                className="w-full bg-[#040815] border border-cyan-500/30 rounded pl-9 pr-20 py-2 text-[10px] text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
              <button
                type="submit"
                disabled={store.supervisorWorkflowActive || !commandInput.trim()}
                className="absolute right-1.5 top-1.5 bg-cyan-950 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded text-[8px] hover:bg-cyan-900 transition"
              >
                EXECUTE
              </button>
            </form>

            {/* Quick Metrics */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">RESILIENCE (ARS):</span>
                <span className={`font-bold text-xs ${store.globalArs > 80 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {store.globalArs}/100
                </span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400/80">
                <Clock className="h-3.5 w-3.5" />
                <span>{systemTime}</span>
              </div>
              <button 
                onClick={store.logout} 
                className="text-gray-500 hover:text-red-400 font-bold border border-transparent hover:border-red-400/20 px-2 py-0.5 rounded transition"
              >
                Logout
              </button>
            </div>
          </header>

          {/* MAIN PAGE INTERFACE LAYOUT (SIDEBAR + CONTENT + COPILOT SIDE PANEL) */}
          <div className="flex-grow flex h-[calc(100vh-100px)] overflow-hidden">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-56 border-r border-cyan-500/10 bg-[#040815]/95 flex flex-col justify-between shrink-0 font-mono text-[10px]">
              <div className="flex-grow overflow-y-auto py-4 space-y-4">
                
                {/* Telemetry Ingest */}
                <div className="px-3">
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1.5 px-2 font-bold">
                    Telemetry Ingest
                  </div>
                  <nav className="space-y-0.5">
                    <button
                      onClick={() => store.setActiveTab('dashboard')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'dashboard' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Activity className="h-3.5 w-3.5 text-cyan-400" />
                      SOC Command Center
                    </button>
                    <button
                      onClick={() => store.setActiveTab('agents')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'agents' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Brain className="h-3.5 w-3.5 text-cyan-400" />
                      Agent Mesh Monitor
                    </button>
                    <button
                      onClick={() => store.setActiveTab('assets')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'assets' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Server className="h-3.5 w-3.5 text-cyan-400" />
                      Asset Inventory
                    </button>
                  </nav>
                </div>

                {/* Intel & Correlation */}
                <div className="px-3">
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1.5 px-2 font-bold">
                    Intel & Correlation
                  </div>
                  <nav className="space-y-0.5">
                    <button
                      onClick={() => store.setActiveTab('threat-intel')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'threat-intel' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Shield className="h-3.5 w-3.5 text-cyan-400" />
                      Threat Intel Center
                    </button>
                    <button
                      onClick={() => store.setActiveTab('mitre')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'mitre' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Network className="h-3.5 w-3.5 text-cyan-400" />
                      MITRE ATT&CK Matrix
                    </button>
                    <button
                      onClick={() => store.setActiveTab('knowledge-graph')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'knowledge-graph' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Database className="h-3.5 w-3.5 text-cyan-400" />
                      Knowledge Graph Explorer
                    </button>
                    <button
                      onClick={() => store.setActiveTab('threat-hunter')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'threat-hunter' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Search className="h-3.5 w-3.5 text-cyan-400" />
                      AI Threat Hunting
                    </button>
                  </nav>
                </div>

                {/* Digital Twin */}
                <div className="px-3">
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1.5 px-2 font-bold">
                    Digital Twin
                  </div>
                  <nav className="space-y-0.5">
                    <button
                      onClick={() => store.setActiveTab('digital-twin')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'digital-twin' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                      3D Digital Twin
                    </button>
                    <button
                      onClick={() => store.setActiveTab('time-machine')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'time-machine' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5 text-cyan-400" />
                      Cyber Time Machine
                    </button>
                  </nav>
                </div>

                {/* Defense Orchestrator */}
                <div className="px-3">
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1.5 px-2 font-bold">
                    Defense Orchestrator
                  </div>
                  <nav className="space-y-0.5">
                    <button
                      onClick={() => store.setActiveTab('incidents')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'incidents' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <ShieldAlert className="h-3.5 w-3.5 text-cyan-400" />
                      Incident Containment
                    </button>
                    <button
                      onClick={() => store.setActiveTab('vulnerabilities')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'vulnerabilities' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                      AI Patch Prioritizer
                    </button>
                    <button
                      onClick={() => store.setActiveTab('recovery')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'recovery' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                      Recovery Center
                    </button>
                  </nav>
                </div>

                {/* Federation & Governance */}
                <div className="px-3">
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1.5 px-2 font-bold">
                    Federation & Governance
                  </div>
                  <nav className="space-y-0.5">
                    <button
                      onClick={() => store.setActiveTab('parliament')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'parliament' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Share2 className="h-3.5 w-3.5 text-cyan-400" />
                      Parliament Mode
                    </button>
                    <button
                      onClick={() => store.setActiveTab('heatmaps')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'heatmaps' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Activity className="h-3.5 w-3.5 text-cyan-400" />
                      Risk Heatmaps
                    </button>
                    <button
                      onClick={() => store.setActiveTab('compliance')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'compliance' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5 text-cyan-400" />
                      Compliance Matrix
                    </button>
                    <button
                      onClick={() => store.setActiveTab('executive')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded transition ${
                        store.activeTab === 'executive' ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white font-bold' : 'text-gray-400 hover:bg-[#070b19] hover:text-white'
                      }`}
                    >
                      <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                      Executive Posture
                    </button>
                  </nav>
                </div>

              </div>

              {/* Sidebar bottom panel */}
              <div className="p-3 border-t border-cyan-500/10 bg-[#030611] space-y-2">
                <button
                  onClick={() => store.setActiveTab('copilot')}
                  className="w-full bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/25 text-cyan-400 py-1.5 rounded flex items-center justify-center gap-2 transition duration-200"
                >
                  <Brain className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                  Copilot Workspace
                </button>

                <div className="border border-cyan-500/10 rounded p-2 text-center bg-[#070b19]/60">
                  <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1.5">Voice Command</div>
                  <button
                    onClick={handleVoiceCommand}
                    className={`h-7 w-7 rounded-full ${
                      voiceActive ? 'bg-red-600 animate-ping' : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30'
                    } flex items-center justify-center mx-auto transition`}
                  >
                    <Mic className={`h-3.5 w-3.5 ${voiceActive ? 'text-white' : 'text-cyan-400'}`} />
                  </button>
                  <div className="text-[8px] text-gray-400 truncate mt-1.5 italic font-sans">{voiceText}</div>
                </div>
              </div>
            </aside>

            {/* MAIN WORKING CONTENT AREA */}
            <main className="flex-grow overflow-y-auto bg-[#040815]/40 p-6 flex flex-col justify-between min-w-0">
              
              {/* =========================================================================
                  SUB-VIEW: SOC command dashboard
                  ========================================================================= */}
              {store.activeTab === 'dashboard' && (
                <div className="space-y-6 h-full flex flex-col">
                  
                  {/* Coordinated Supervisor Agent Action Logs Overlay */}
                  {store.supervisorWorkflowActive && (
                    <div className="bg-cyan-950/20 border border-cyan-400/30 p-4 rounded-xl font-mono text-[10px] space-y-2">
                      <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-wider">
                        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                        Supervisor Agent: Active Command Planning Loop
                      </div>
                      <div className="bg-[#030611] p-2.5 rounded border border-cyan-500/10 text-gray-400 h-24 overflow-y-auto space-y-1">
                        {store.supervisorLogs.map((log, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="text-cyan-400 font-sans">[{idx + 1}]</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Red / Blue / Purple Team Simulation Logs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#070c1f]/60 border border-cyan-500/10 rounded-xl p-4 font-mono text-[9px] space-y-2">
                      <div className="flex justify-between border-b border-cyan-500/10 pb-1.5">
                        <span className="text-red-400 font-bold uppercase tracking-wider">AI Red Team</span>
                        <button 
                          onClick={store.runRedTeamSimulation}
                          className="bg-red-950/40 border border-red-500/30 text-red-400 px-2 py-0.5 rounded text-[8px] hover:bg-red-900 transition"
                        >
                          Trigger Attack
                        </button>
                      </div>
                      <div className="h-16 overflow-y-auto space-y-1 text-gray-400">
                        {store.redTeamLogs.length ? store.redTeamLogs.map((l, i) => <div key={i}>{l}</div>) : <div className="italic text-gray-600">Awaiting Red Team sweep...</div>}
                      </div>
                    </div>

                    <div className="bg-[#070c1f]/60 border border-cyan-500/10 rounded-xl p-4 font-mono text-[9px] space-y-2">
                      <div className="flex justify-between border-b border-cyan-500/10 pb-1.5">
                        <span className="text-cyan-400 font-bold uppercase tracking-wider">AI Blue Team</span>
                        <button 
                          onClick={store.runBlueTeamMitigation}
                          className="bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded text-[8px] hover:bg-cyan-900 transition"
                        >
                          Apply Defense
                        </button>
                      </div>
                      <div className="h-16 overflow-y-auto space-y-1 text-gray-400">
                        {store.blueTeamLogs.length ? store.blueTeamLogs.map((l, i) => <div key={i}>{l}</div>) : <div className="italic text-gray-600">Awaiting Blue Team rules...</div>}
                      </div>
                    </div>

                    <div className="bg-[#070c1f]/60 border border-cyan-500/10 rounded-xl p-4 font-mono text-[9px] space-y-2">
                      <div className="flex justify-between border-b border-cyan-500/10 pb-1.5">
                        <span className="text-indigo-400 font-bold uppercase tracking-wider">AI Purple Team</span>
                        <button 
                          onClick={store.runPurpleTeamAudit}
                          className="bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded text-[8px] hover:bg-indigo-900 transition"
                        >
                          Run Audit
                        </button>
                      </div>
                      <div className="h-16 overflow-y-auto space-y-1 text-gray-400">
                        {store.purpleTeamLogs.length ? store.purpleTeamLogs.map((l, i) => <div key={i}>{l}</div>) : <div className="italic text-gray-600">Awaiting Purple Audit...</div>}
                      </div>
                    </div>
                  </div>

                  {/* Core layout maps */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
                    <div className="lg:col-span-2 min-h-[300px]">
                      <CyberGlobe />
                    </div>

                    {/* Behavioral Pipeline UEBA logs */}
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 flex flex-col justify-between">
                      <div className="border-b border-cyan-500/10 pb-2 mb-3 flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                          Behavioral Pipeline UEBA Streams
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      </div>
                      
                      <div className="flex-grow overflow-y-auto space-y-2 h-[220px] font-mono text-[9.5px] leading-normal">
                        {store.logs.map((log) => (
                          <div key={log.id} className="border-b border-cyan-500/5 pb-1 space-y-0.5">
                            <div className="flex gap-2">
                              <span className="text-cyan-500 shrink-0 font-sans">[{log.timestamp.substring(11, 19)}]</span>
                              <span className="text-white font-bold">{log.source.split(' ')[0]}</span>
                              <span className="text-gray-400">{log.message}</span>
                            </div>
                            {log.anomalyScore !== undefined && log.anomalyScore > 0 && (
                              <div className="pl-4 text-orange-400 font-bold text-[8.5px] flex gap-3">
                                <span>Anomaly Score: {log.anomalyScore}/100</span>
                                <span>False Positive: {log.falsePositiveProb}%</span>
                                <span>Class: Isolation Forest</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Incident List */}
                  <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 font-mono text-xs">
                    <div className="border-b border-cyan-500/10 pb-2 mb-3 text-cyan-400 font-bold uppercase tracking-wider">
                      Incident Command Queue
                    </div>
                    <div className="space-y-3">
                      {store.incidents.map((inc) => (
                        <div 
                          key={inc.id}
                          className="p-3 border border-red-500/20 bg-red-950/5 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-white text-xs">{inc.title}</div>
                            <div className="text-[10px] text-gray-400">Target: {inc.source} | Associated CVE: {inc.cveAssociated}</div>
                          </div>
                          <button
                            onClick={() => handleLinkIncident(inc)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-1 rounded text-[10px]"
                          >
                            Investigate
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: AI Security Copilot Workspace
                  ========================================================================= */}
              {store.activeTab === 'copilot' && (
                <div className="h-full flex flex-col justify-between">
                  <div className="mb-4">
                    <h2 className="font-mono text-sm text-cyan-400 font-semibold uppercase tracking-wider">
                      CyberGPT Operations Workspace
                    </h2>
                    <p className="text-[10px] text-gray-400 font-mono">
                      Query active threat intelligence vector nodes using natural language.
                    </p>
                  </div>
                  <div className="flex-grow">
                    <CopilotPanel />
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Agent Mesh Monitor
                  ========================================================================= */}
              {store.activeTab === 'agents' && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                      Autonomous Multi-Agent Mesh Monitor
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Check execution histories and message communication logs of the CNI enclaves.
                    </p>
                  </div>

                  {/* Agent message logs */}
                  <div className="bg-[#070b19]/65 border border-cyan-500/10 p-4 rounded-xl space-y-3">
                    <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold uppercase text-xs tracking-wider">
                      Agent-to-Agent Communication Message Bus
                    </div>
                    <div className="h-44 overflow-y-auto space-y-2 text-[9.5px]">
                      {store.agentMessages.length ? store.agentMessages.map((m) => (
                        <div key={m.id} className="border-b border-cyan-500/5 pb-1 flex gap-2">
                          <span className="text-cyan-500 font-sans">[{m.timestamp.substring(11, 19)}]</span>
                          <span className="text-white font-bold">{m.sender}</span>
                          <span className="text-cyan-400">➔</span>
                          <span className="text-indigo-400 font-bold">{m.recipient}:</span>
                          <span className="text-gray-400">{m.content}</span>
                        </div>
                      )) : <div className="text-gray-600 italic py-12 text-center">No active communications on message bus. Awaiting delegation events...</div>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {store.agents.map((agent) => (
                      <div key={agent.id} className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-cyan-500/10 pb-1.5">
                          <div className="font-bold text-white">{agent.name}</div>
                          <span className="text-[9px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-300 uppercase">{agent.status}</span>
                        </div>
                        <div className="space-y-1 text-[9px] text-gray-400 leading-normal">
                          <div>Role: <span className="text-white">{agent.role}</span></div>
                          <div>Health: <span className="text-emerald-400">{agent.health}%</span></div>
                          <div>Load: <span className="text-indigo-400">{agent.load}%</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Digital Twin Network (Three.js)
                  ========================================================================= */}
              {store.activeTab === 'digital-twin' && (
                <div className="h-full flex flex-col justify-between">
                  <div className="mb-4">
                    <h2 className="font-mono text-sm text-cyan-400 font-semibold uppercase tracking-wider">
                      WebGL Infrastructure Digital Twin Simulator
                    </h2>
                    <p className="text-[10px] text-gray-400 font-mono">
                      Drag mouse to rotate 3D nodes. Inject ransomware simulations to monitor node cascade propagation pathways.
                    </p>
                  </div>
                  <div className="flex-grow">
                    <ThreeDigitalTwin />
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Asset Inventory
                  ========================================================================= */}
              {store.activeTab === 'assets' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                        CNI Asset Inventory Database
                      </h2>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Verify status, IP mapping, vulnerabilities, and individual Resilience score.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11px] leading-relaxed">
                      <thead className="bg-[#060a17]/90 text-cyan-400 uppercase tracking-widest border-b border-cyan-500/10 text-[9px]">
                        <tr>
                          <th className="p-3">Asset</th>
                          <th className="p-3">IP Address</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Sector</th>
                          <th className="p-3">Resilience</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cyan-500/5">
                        {store.assets.map((a) => (
                          <tr key={a.id} className="hover:bg-cyan-950/10 transition">
                            <td className="p-3 font-bold text-white">{a.name}</td>
                            <td className="p-3 text-cyan-300 font-bold">{a.ip}</td>
                            <td className="p-3 uppercase text-[9px] text-gray-400 font-bold">{a.type}</td>
                            <td className="p-3 uppercase text-[9px] text-gray-400 font-bold">{a.sector.replace('_', ' ')}</td>
                            <td className="p-3 font-bold text-emerald-400">{a.ars}/100 ARS</td>
                            <td className="p-3 uppercase text-[9px] text-gray-300 font-bold">{a.status}</td>
                            <td className="p-3 text-right">
                              {a.status === 'online' ? (
                                <button
                                  onClick={() => store.isolateAsset(a.id)}
                                  className="bg-orange-950/60 hover:bg-orange-900 border border-orange-500/30 text-orange-400 font-bold px-2 py-1 rounded text-[9px] transition"
                                >
                                  Quarantine
                                </button>
                              ) : (
                                <span className="text-gray-500 italic text-[9px]">LOCKED</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Threat Intel Center
                  ========================================================================= */}
              {store.activeTab === 'threat-intel' && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                      National Threat Intelligence Command
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Verify auto-generated Sigma detection rules and CERT-In advisories.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 md:col-span-2 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                        Auto-Generated Sigma Detection Rules
                      </div>
                      
                      <div className="space-y-3 font-mono text-[9px] leading-normal text-cyan-400">
                        {store.sigmaRulesGenerated.map((sig) => (
                          <div key={sig.id} className="p-3 bg-[#0b1426] border border-cyan-500/5 rounded">
                            <div className="font-bold text-white mb-2">{sig.name} (Generated: {sig.date})</div>
                            <pre className="text-gray-400 whitespace-pre">{sig.rule}</pre>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                        Threat advisories
                      </div>
                      <div className="space-y-2 text-[10px] text-gray-400 leading-normal">
                        <div>CIV-2026-0041 // Phishing Government DC</div>
                        <div>CIV-2026-0039 // SCADA PLC firmware write</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: MITRE ATT&CK Matrix
                  ========================================================================= */}
              {store.activeTab === 'mitre' && (
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                      MITRE ATT&CK CNI Operations Matrix
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Visualizing active threat execution patterns across standard tactics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-[#070b19]/60 border border-cyan-500/10 p-4 rounded-xl">
                    <div className="space-y-2">
                      <div className="bg-[#0b1426] p-2 border-b border-cyan-500/20 text-center font-bold text-white text-[9px] uppercase tracking-wider">Initial Access</div>
                      <div className="bg-red-950/20 border border-red-500/30 p-2 rounded text-[10px]">T1190<div className="text-[8px] text-gray-500">Exploit Public-Facing App</div></div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-[#0b1426] p-2 border-b border-cyan-500/20 text-center font-bold text-white text-[9px] uppercase tracking-wider">Execution</div>
                      <div className="bg-[#040815] border border-cyan-500/5 p-2 rounded text-[10px] text-gray-500">T1059.001<div className="text-[8px] text-gray-600">PowerShell Scripting</div></div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-[#0b1426] p-2 border-b border-cyan-500/20 text-center font-bold text-white text-[9px] uppercase tracking-wider">Privilege Esc</div>
                      <div className="bg-red-950/20 border border-red-500/30 p-2 rounded text-[10px]">T1068<div className="text-[8px] text-gray-500">Exploitation for Privilege Esc</div></div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-[#0b1426] p-2 border-b border-cyan-500/20 text-center font-bold text-white text-[9px] uppercase tracking-wider">Lateral Move</div>
                      <div className="bg-red-950/20 border border-red-500/30 p-2 rounded text-[10px]">T1021.002<div className="text-[8px] text-gray-500">Remote SMB Shares</div></div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-[#0b1426] p-2 border-b border-cyan-500/20 text-center font-bold text-white text-[9px] uppercase tracking-wider">Exfiltration</div>
                      <div className="bg-red-950/20 border border-red-500/30 p-2 rounded text-[10px]">T1041<div className="text-[8px] text-gray-500">Exfiltration over C2 (DNS)</div></div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Knowledge Graph Explorer
                  ========================================================================= */}
              {store.activeTab === 'knowledge-graph' && (
                <div className="space-y-6 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                        Knowledge Graph Explorer (Neo4j Schema Map)
                      </h2>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Model relationship traversals. Select nodes to evaluate shortest attack path or blast radius.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShortestPathActive(!shortestPathActive);
                          setSelectedGraphNode(null);
                        }}
                        className={`px-3 py-1 rounded text-[10px] font-bold border transition ${
                          shortestPathActive 
                            ? 'bg-red-950 border-red-500 text-red-400' 
                            : 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400'
                        }`}
                      >
                        {shortestPathActive ? 'Disable Shortest Path' : 'Show Shortest Attack Path'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Details Panel */}
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
                        Entity Attributes
                      </div>
                      
                      {selectedGraphNode ? (
                        <div className="space-y-2 text-xs font-mono">
                          <div>
                            <span className="text-[9px] text-gray-500">Entity ID:</span>
                            <div className="text-white font-bold">{selectedGraphNode}</div>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500">Status:</span>
                            <div className="text-red-400 font-bold uppercase">Compromised</div>
                          </div>
                          <div className="p-2 bg-red-950/20 border border-red-500/30 text-[10px] text-red-400 rounded leading-normal">
                            Graph Traversal detected privilege escalation link to AIIMS mainframe.
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 italic text-[10px] text-center py-12">
                          Select any node on the graph to audit relationships.
                        </div>
                      )}
                    </div>

                    {/* SVG Map rendering active links */}
                    <div className="lg:col-span-3 bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 flex items-center justify-center min-h-[350px]">
                      <svg className="w-full h-full max-w-[650px]" viewBox="0 0 600 350">
                        {/* Define arrows */}
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                          </marker>
                          <marker id="arrow-red" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                          </marker>
                        </defs>

                        {/* Link lines */}
                        {activeGraphLinks.map((link, idx) => {
                          // Coordinates lookup
                          const nodePositions: { [key: string]: { x: number; y: number } } = {
                            'ip-vpn': { x: 80, y: 175 },
                            'u-shiva': { x: 200, y: 100 },
                            'srv-aiims': { x: 350, y: 100 },
                            'srv-nic': { x: 480, y: 175 },
                            'db-scada': { x: 350, y: 250 },
                            'cve-esc': { x: 200, y: 250 },
                            'mal-mimi': { x: 350, y: 20 },
                            'actor-apt': { x: 520, y: 50 }
                          };

                          const start = nodePositions[link.source];
                          const end = nodePositions[link.target];

                          if (!start || !end) return null;

                          return (
                            <g key={idx}>
                              <line
                                x1={start.x}
                                y1={start.y}
                                x2={end.x}
                                y2={end.y}
                                stroke={link.active ? '#ef4444' : 'rgba(6, 182, 212, 0.2)'}
                                strokeWidth={link.active ? 2.5 : 1}
                                strokeDasharray={link.type === 'EXPLOITED_VIA' ? '4,4' : 'none'}
                                markerEnd={`url(#${link.active ? 'arrow-red' : 'arrow'})`}
                              />
                            </g>
                          );
                        })}

                        {/* Nodes */}
                        {[
                          { id: 'ip-vpn', x: 80, y: 175, label: '198.51.100.41', color: '#ef4444' },
                          { id: 'u-shiva', x: 200, y: 100, label: 'u: admin_shiva', color: '#ef4444' },
                          { id: 'srv-aiims', x: 350, y: 100, label: 'med-rec-1', color: '#ef4444' },
                          { id: 'srv-nic', x: 480, y: 175, label: 'cld-edge-1', color: '#10b981' },
                          { id: 'db-scada', x: 350, y: 250, label: 'pwr-db-1', color: '#10b981' },
                          { id: 'cve-esc', x: 200, y: 250, label: 'CVE-2024-38193', color: '#a855f7' },
                          { id: 'mal-mimi', x: 350, y: 20, label: 'Mimikatz', color: '#f97316' },
                          { id: 'actor-apt', x: 520, y: 50, label: 'APT29', color: '#ec4899' }
                        ].map((node) => (
                          <g 
                            key={node.id} 
                            transform={`translate(${node.x}, ${node.y})`}
                            className="cursor-pointer"
                            onClick={() => setSelectedGraphNode(node.id)}
                          >
                            <circle r="14" fill="#080d21" stroke={node.color} strokeWidth={selectedGraphNode === node.id ? 3 : 1.5} />
                            <text y="24" textAnchor="middle" fill="#fff" className="text-[8.5px] font-mono select-none">{node.label}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Incident Containment SOAR
                  ========================================================================= */}
              {store.activeTab === 'incidents' && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                      Autonomous Incident Containment Queue (SOAR Engine)
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Review threat events, view forensic evidence trail, and execute automated playbooks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      {store.incidents.map((inc) => (
                        <div key={inc.id} className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2">
                            <div>
                              <span className="font-bold text-white text-xs">{inc.title}</span>
                              <div className="text-[9px] text-gray-500 mt-0.5">ID: {inc.id} | Timestamp: {inc.timestamp}</div>
                            </div>
                            <span className="px-2 bg-red-950 text-red-400 border border-red-500/20 text-[8px] rounded uppercase font-bold">{inc.severity}</span>
                          </div>
                          
                          <p className="text-gray-400 text-[10.5px] leading-relaxed">{inc.explanation}</p>

                          <div className="bg-[#040815] border border-cyan-500/5 rounded p-3">
                            <div className="text-[8.5px] text-cyan-400 uppercase tracking-wider mb-2 font-bold">Process execution tree</div>
                            <div className="space-y-1 font-mono text-[9px] text-cyan-500">
                              {inc.processTree ? inc.processTree.map((p, idx) => <div key={idx}>{p}</div>) : <div>No process tree logged.</div>}
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-cyan-500/10 pt-3">
                            <span className="text-gray-500 text-[10px]">Confidence: {inc.confidenceScore}%</span>
                            <div className="flex gap-2">
                              {inc.status === 'active' ? (
                                <button
                                  onClick={() => store.triggerSOARPlaybook(inc.id, 'CNI-ENCLAVE-CONTAINMENT')}
                                  className="bg-orange-950 border border-orange-500/30 text-orange-400 px-3 py-1.5 rounded text-[10px]"
                                >
                                  Execute SOAR isolation
                                </button>
                              ) : (
                                <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1.5">
                                  <ShieldCheck className="h-4 w-4" />
                                  MITIGATED & CONTAINERIZED
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                        SOAR Active Playbooks
                      </div>
                      <div className="p-3 bg-[#0b1426] border border-cyan-500/5 rounded space-y-1">
                        <div className="font-bold text-white">CNI-ENCLAVE-CONTAINMENT</div>
                        <p className="text-[10px] text-gray-400">Isolates hosts, kills executing processes, rotates VPN access keys, and triggers snapshot backups.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: AI Patch Prioritizer
                  ========================================================================= */}
              {store.activeTab === 'vulnerabilities' && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                      Vulnerability Intelligence Center
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Prioritises patches based on Asset Criticality + Exploit Maturity + Active threat campaigns.
                    </p>
                  </div>

                  <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11px] leading-relaxed">
                      <thead className="bg-[#060a17]/90 text-cyan-400 uppercase tracking-widest border-b border-cyan-500/10 text-[9px]">
                        <tr>
                          <th className="p-3">CVE ID</th>
                          <th className="p-3">Title</th>
                          <th className="p-3">CVSS</th>
                          <th className="p-3">AI Priority</th>
                          <th className="p-3">Exploit Maturity</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cyan-500/5">
                        {store.vulnerabilities.map((v) => (
                          <tr key={v.cve} className="hover:bg-cyan-950/10 transition">
                            <td className="p-3 text-white font-bold">{v.cve}</td>
                            <td className="p-3">{v.title}</td>
                            <td className="p-3 font-semibold text-gray-400">{v.severity}</td>
                            <td className="p-3">
                              <span className={`font-bold ${v.aiPriority > 90 ? 'text-red-400' : 'text-amber-400'}`}>
                                {v.aiPriority}/100
                              </span>
                            </td>
                            <td className="p-3 text-[10px] text-gray-400 font-bold uppercase">{v.exploitMaturity}</td>
                            <td className="p-3 text-right">
                              {v.status === 'unpatched' ? (
                                <button
                                  onClick={() => store.runVulnerabilityPatch(v.cve)}
                                  className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-400 font-bold px-2 py-1 rounded text-[9px] transition"
                                >
                                  Apply Patch
                                </button>
                              ) : (
                                <span className="text-emerald-400 font-bold text-[9px]">PATCHED</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Recovery Center
                  ========================================================================= */}
              {store.activeTab === 'recovery' && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                      AI Post-Incident Recovery Manager
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Verify snapshot integrity, detect missing telemetry data, and schedule clean system rollbacks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 md:col-span-2 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                        Storage Snapshot Integrity Checks
                      </div>
                      <div className="space-y-2.5">
                        <div className="p-3 bg-[#0b1426] border border-cyan-500/5 rounded flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white">AIIMS_BACKUP_492.sn</div>
                            <span className="text-[9px] text-gray-500">Hash match: SHA256 verified | Size: 1.2 TB</span>
                          </div>
                          <span className="text-emerald-400 font-bold text-[10px]">INTEGRITY VALID</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                        Sequence prioritized recovery order
                      </div>
                      <div className="space-y-2 text-[10.5px]">
                        <div className="p-2 bg-cyan-950/20 border border-cyan-500/20 rounded text-cyan-300">
                          1. Restore Core OS templates (quarantined enclaves)
                        </div>
                      </div>
                      <button
                        onClick={() => setNotif("Coordinated system rollback completed.")}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded text-xs transition"
                      >
                        Restore backups
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Parliament Mode
                  ========================================================================= */}
              {store.activeTab === 'parliament' && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-cyan-400 animate-pulse" />
                      AI Parliament Mode: Federated Threat Intel sharing
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Federated Threat intelligence sharing between CNI organizations. Shares behavioral threat indicators anonymously.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 md:col-span-2 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                        Federated CNI Network Threat Map
                      </div>

                      <div className="flex items-center justify-center min-h-[280px] bg-[#030611] rounded border border-cyan-500/5 relative overflow-hidden">
                        <svg className="w-full h-full max-w-[500px]" viewBox="0 0 400 250">
                          <line x1="200" y1="125" x2="80" y2="70" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1.5" />
                          <line x1="200" y1="125" x2="320" y2="70" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1.5" />
                          <line x1="200" y1="125" x2="100" y2="200" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" strokeDasharray="3,3" />

                          <g transform="translate(200, 125)">
                            <circle r="12" fill="#080d21" stroke="#00f0ff" strokeWidth="2" />
                            <text y="20" textAnchor="middle" fill="#00f0ff" className="text-[7px] font-mono uppercase font-bold">NIC central hub</text>
                          </g>

                          <g transform="translate(80, 70)">
                            <circle r="8" fill="#080d21" stroke="#10b981" strokeWidth="1.5" />
                            <text y="-12" textAnchor="middle" fill="#aaa" className="text-[7.5px] font-mono">AIIMS Hospital</text>
                          </g>
                          <g transform="translate(320, 70)">
                            <circle r="8" fill="#080d21" stroke="#10b981" strokeWidth="1.5" />
                            <text y="-12" textAnchor="middle" fill="#aaa" className="text-[7.5px] font-mono">Power Grid</text>
                          </g>
                          <g transform="translate(100, 200)">
                            <circle r="8" fill="#080d21" stroke="#ef4444" strokeWidth="2" />
                            <text y="16" textAnchor="middle" fill="#ef4444" className="text-[7.5px] font-mono">Railways</text>
                          </g>
                        </svg>
                      </div>
                    </div>

                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                        Anonymous shared indicators
                      </div>
                      <div className="space-y-3 text-[10px] leading-relaxed text-gray-400">
                        <div className="p-2.5 bg-[#0b1426] border-l-2 border-red-500 rounded">
                          <strong>Source: [Anonymized Hospital Sector]</strong>
                          <div className="text-cyan-400 text-[8px] mt-0.5">Indicator: DNS Tunneling pattern over port 53</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Cyber Time Machine
                  ========================================================================= */}
              {store.activeTab === 'time-machine' && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                      <Clock className="h-5 w-5 text-cyan-400 animate-pulse" />
                      AI Cyber Time Machine Replay
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Rewind and replay historical cyber attacks frame-by-frame with synchronized telemetry & process trees.
                    </p>
                  </div>

                  <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-6 space-y-6">
                    <div className="relative aspect-video max-h-[300px] bg-[#030611] rounded border border-cyan-500/10 flex flex-col justify-between p-4 overflow-hidden mx-auto w-full">
                      <div className="flex justify-between items-center text-cyan-400 text-[9px] uppercase tracking-wider">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={`h-2.5 w-2.5 rounded-full ${store.timeMachinePlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
                          {store.timeMachinePlaying ? 'PLAYBACK ACTIVE' : 'PAUSED'}
                        </div>
                        <div>TIME SCALE: {store.timeMachineSpeed}x</div>
                      </div>

                      <div className="flex-grow flex flex-col items-center justify-center text-center space-y-2">
                        {store.timeMachineTime < 25 ? (
                          <>
                            <User className="h-10 w-10 text-cyan-400 animate-bounce" />
                            <div className="text-xs font-bold text-white">09:01 // User admin_shiva Authenticated</div>
                            <p className="text-[9px] text-gray-500 max-w-xs">Login initiated from external VPN server: 198.51.100.41.</p>
                          </>
                        ) : store.timeMachineTime < 55 ? (
                          <>
                            <ShieldAlert className="h-10 w-10 text-orange-400 animate-pulse" />
                            <div className="text-xs font-bold text-orange-400">09:04 // PowerShell Mimikatz Command Executed</div>
                            <p className="text-[9px] text-gray-500 max-w-xs">System privilege credentials dump attempted on AIIMS mainframe.</p>
                          </>
                        ) : store.timeMachineTime < 85 ? (
                          <>
                            <Database className="h-10 w-10 text-red-500 animate-ping" />
                            <div className="text-xs font-bold text-red-400">09:08 // 4.2 GB Data Transfer Detected</div>
                            <p className="text-[9px] text-gray-500 max-w-xs">DNS Tunneling established. Active database exfiltration.</p>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-10 w-10 text-emerald-400" />
                            <div className="text-xs font-bold text-emerald-400">09:18 // Auto SOAR Enclave Quarantine Applied</div>
                            <p className="text-[9px] text-gray-500 max-w-xs">Host isolated successfully. Lateral propagation blocked.</p>
                          </>
                        )}
                      </div>

                      <div className="border-t border-cyan-500/10 pt-3 flex items-center justify-between gap-4 font-mono text-[9px]">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => store.setTimeMachinePlaying(!store.timeMachinePlaying)}
                            className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-400 p-1 rounded"
                          >
                            {store.timeMachinePlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                          </button>
                          <button 
                            onClick={() => store.setTimeMachineTime(0)}
                            className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-400 p-1 rounded"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex-grow flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={store.timeMachineTime}
                            onChange={(e) => store.setTimeMachineTime(Number(e.target.value))}
                            className="w-full accent-cyan-500 bg-cyan-950/60 rounded h-1 cursor-pointer"
                          />
                          <span className="text-[8px] text-cyan-400 shrink-0 font-bold">{Math.round(store.timeMachineTime)}%</span>
                        </div>

                        <div className="flex gap-1">
                          {[1, 2, 4].map((s) => (
                            <button
                              key={s}
                              onClick={() => store.setTimeMachineSpeed(s)}
                              className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                                store.timeMachineSpeed === s 
                                  ? 'bg-cyan-400 border-cyan-400 text-[#030712]' 
                                  : 'bg-cyan-950 border-cyan-500/30 text-cyan-400'
                              }`}
                            >
                              {s}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Executive Posture Dashboard
                  ========================================================================= */}
              {store.activeTab === 'executive' && (
                <div className="space-y-6 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-4">
                    <div>
                      <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                        National Cyber Posture Executive Command Center
                      </h2>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        High-level cyber resilience indices designed specifically for non-technical government officials.
                      </p>
                    </div>
                    <button
                      onClick={triggerPDFDownload}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded text-xs transition flex items-center gap-1.5"
                    >
                      <Download className="h-4.5 w-4.5" />
                      Export Briefing Pack
                    </button>
                  </div>

                  {/* National Disruption indices */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold">Power grid Disruption</span>
                      <div className="text-2xl font-extrabold text-white mt-1">{store.nationalDisruptionIndex.power}%</div>
                    </div>
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold">Hospital services Disruption</span>
                      <div className="text-2xl font-extrabold text-red-400 mt-1">{store.nationalDisruptionIndex.medical}%</div>
                    </div>
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold">Transportation Disruption</span>
                      <div className="text-2xl font-extrabold text-white mt-1">{store.nationalDisruptionIndex.transport}%</div>
                    </div>
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold">Water Supply Disruption</span>
                      <div className="text-2xl font-extrabold text-white mt-1">{store.nationalDisruptionIndex.water}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-5 space-y-2">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold font-bold">Resilience index</span>
                      <div className="text-3xl font-extrabold text-emerald-400">{store.globalArs}%</div>
                      <p className="text-[10px] text-gray-400 leading-normal">Optimal posture index. Cyber Segment controls running at peak mitigation levels.</p>
                    </div>
                    
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-5 space-y-2">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold font-bold">Avoided Financial Loss</span>
                      <div className="text-3xl font-extrabold text-white">₹14 Crore</div>
                      <p className="text-[10px] text-gray-400 leading-normal">Estimated ransomware recovery, system downtime, and regulatory fine savings.</p>
                    </div>

                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-5 space-y-2">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold font-bold">Prevented Downtime</span>
                      <div className="text-3xl font-extrabold text-indigo-400">4.5 Days</div>
                      <p className="text-[10px] text-gray-400 leading-normal">Simulated railway command & hospital database outages completely averted.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Risk Heatmaps
                  ========================================================================= */}
              {store.activeTab === 'heatmaps' && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                      National Infrastructure Risk Heatmap
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Live risk indices by building, sector, and Ministry enclaves.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 md:col-span-2 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                        Ministry Risk Indexes
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-cyan-500/5 pb-2">
                          <div>
                            <span className="font-semibold text-white">Ministry of Health (AIIMS enclave)</span>
                            <div className="text-[9px] text-gray-500">Anomaly Index: High UEBA deviation</div>
                          </div>
                          <span className="text-red-400 font-bold text-xs">Risk Index: 88 (CRITICAL)</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-cyan-500/5 pb-2">
                          <div>
                            <span className="font-semibold text-white">Ministry of Power (SCADA grid controller)</span>
                            <div className="text-[9px] text-gray-500">Anomaly Index: Baseline normal</div>
                          </div>
                          <span className="text-emerald-400 font-bold text-xs">Risk Index: 12 (LOW)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: Compliance Matrix
                  ========================================================================= */}
              {store.activeTab === 'compliance' && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                      National Security Compliance Matrix
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Real-time assessment against ISO 27001 and CERT-In compliance protocols.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 md:col-span-2 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                        Compliance Guidelines
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-[#0b1426] border border-cyan-500/5 rounded flex justify-between items-center">
                          <div>
                            <div className="font-bold text-white">CERT-In incident reporting rule (6-hour window)</div>
                            <span className="text-[9px] text-gray-500">Report status: Submitted automatically within 4 minutes.</span>
                          </div>
                          <span className="text-emerald-400 font-bold">COMPLIANT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: AI Threat Hunting Console
                  ========================================================================= */}
              {store.activeTab === 'threat-hunter' && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                      Autonomous Threat Hunter Control Console
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Hourly RAG search sweeps mapping active attacks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#070b19]/60 border border-cyan-500/10 rounded-xl p-4 md:col-span-2 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                        Active Threat Hunt Loops
                      </div>
                      <div className="space-y-3 font-mono text-[10px] text-gray-300">
                        <div className="p-3 bg-[#0b1426] border border-cyan-500/5 rounded">
                          <div className="font-bold text-white">Loop #492 // Target: Modbus controllers</div>
                          <p className="text-gray-400 mt-1 leading-normal">Sentinel checked 14,000 PLC register uploads. Result: 0 anomalies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW: settings / system config
                  ========================================================================= */}
              {store.activeTab === 'settings' && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
                      ShieldCore AI System settings & RBAC
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Configure integrations, set Multi-Agent collaboration constraints, and manage security keys.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#070b19]/60 border border-cyan-500/10 p-6 rounded-xl">
                    <div className="space-y-4">
                      <h3 className="font-bold text-white text-xs border-b border-cyan-500/10 pb-2 uppercase tracking-wider">
                        Autonomous containment thresholds
                      </h3>
                      <div>
                        <label className="block text-gray-400 mb-1">Auto-Isolate Confidence Margin</label>
                        <select className="bg-[#040815] border border-cyan-500/20 rounded px-2 py-1 text-cyan-400 text-xs w-full">
                          <option>90% Confidence (Strict Security)</option>
                          <option>95% Confidence (Optimal)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FOOTER BAR */}
              <footer className="border-t border-cyan-500/10 pt-3 mt-6 flex flex-wrap items-center justify-between text-[8.5px] font-mono text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Central Apache Kafka broker: healthy (lag 4ms)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Neo4j knowledge DB: connected
                  </div>
                </div>
                <div>
                  SHIELDCORE AI OS // SESSION ACTIVE
                </div>
              </footer>

            </main>

            {/* COLLAPSIBLE RIGHT PANEL: COPILOT CONVERSATION DRAWER */}
            {store.activeTab !== 'copilot' && (
              <aside className="w-80 border-l border-cyan-500/10 shrink-0 hidden xl:block">
                <CopilotPanel />
              </aside>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
