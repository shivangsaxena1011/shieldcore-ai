'use client';

import React, { useState } from 'react';
import { useCyberStore, Asset } from '@/store/cyberStore';
import { 
  Server, Shield, Database, Cloud, Cpu, Activity, Play, RefreshCw, AlertTriangle
} from 'lucide-react';

interface NodeCoords {
  [key: string]: { x: number; y: number };
}

// Fixed positions for standard, stable SVG layout
const nodeCoords: NodeCoords = {
  'pwr-gen-1': { x: 150, y: 120 },
  'pwr-sw-1': { x: 300, y: 180 },
  'pwr-db-1': { x: 150, y: 260 },
  'pwr-fw-1': { x: 450, y: 180 },
  
  'rly-sig-1': { x: 150, y: 380 },
  'rly-sw-1': { x: 300, y: 380 },
  
  'med-rec-1': { x: 650, y: 120 },
  'med-fw-1': { x: 500, y: 120 },
  
  'smrt-cam-1': { x: 650, y: 280 },
  'cld-edge-1': { x: 500, y: 280 }
};

export default function DigitalTwinNetwork() {
  const { assets, simulateRansomwareOutbreak, resetSimulation, isolateAsset } = useCyberStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const selectedNode = assets.find((a) => a.id === selectedNodeId);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'server': return <Server className="h-5 w-5" />;
      case 'firewall': return <Shield className="h-5 w-5" />;
      case 'database': return <Database className="h-5 w-5" />;
      case 'cloud': return <Cloud className="h-5 w-5" />;
      case 'ot_device': return <Cpu className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'compromised') return '#ef4444'; // Red
    if (status === 'isolated') return '#f97316'; // Orange
    return '#10b981'; // Green
  };

  const getSectorName = (sec: string) => {
    return sec.toUpperCase().replace('_', ' ');
  };

  const handleSimulate = (id: string) => {
    setIsSimulating(true);
    simulateRansomwareOutbreak(id);
    setTimeout(() => {
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-[500px]">
      {/* Interactive Visual Network Topology */}
      <div className="lg:col-span-3 relative rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md p-4 flex flex-col justify-between overflow-hidden">
        
        {/* Top bar controls */}
        <div className="flex justify-between items-center z-10">
          <div>
            <h3 className="font-mono text-sm text-cyan-400 font-semibold tracking-wider uppercase">
              Critical Infrastructure Digital Twin View
            </h3>
            <p className="text-[10px] text-gray-400">
              Interactive 2D Topology. Click nodes to inspect, isolate, or inject attacks.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                resetSimulation();
                setSelectedNodeId(null);
              }}
              className="flex items-center gap-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-400 px-2 py-1 rounded text-xs transition duration-200"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Twin
            </button>
          </div>
        </div>

        {/* CNI Sector Bounds Labels in background */}
        <div className="absolute top-[25%] left-[10%] pointer-events-none font-mono text-[9px] text-cyan-500/20 uppercase tracking-widest border border-cyan-500/5 px-2 py-1 rounded">
          OT Power Grid Segment
        </div>
        <div className="absolute top-[80%] left-[10%] pointer-events-none font-mono text-[9px] text-indigo-500/20 uppercase tracking-widest border border-indigo-500/5 px-2 py-1 rounded">
          Railways Traffic Command
        </div>
        <div className="absolute top-[25%] right-[10%] pointer-events-none font-mono text-[9px] text-emerald-500/20 uppercase tracking-widest border border-emerald-500/5 px-2 py-1 rounded">
          Healthcare (AIIMS Network)
        </div>
        <div className="absolute top-[60%] right-[10%] pointer-events-none font-mono text-[9px] text-amber-500/20 uppercase tracking-widest border border-amber-500/5 px-2 py-1 rounded">
          Smart City Integration
        </div>

        {/* SVG Network Map */}
        <div className="flex-grow flex items-center justify-center my-4 relative" style={{ minHeight: '380px' }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450">
            {/* Defs for gradients & filters */}
            <defs>
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="cyber-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Connection Lines */}
            {assets.map((asset) => {
              const startCoords = nodeCoords[asset.id];
              if (!startCoords) return null;

              return asset.dependencies.map((depId) => {
                const endCoords = nodeCoords[depId];
                if (!endCoords) return null;

                const isLineCompromised = asset.status === 'compromised' || assets.find(a => a.id === depId)?.status === 'compromised';
                const isLineIsolated = asset.status === 'isolated' || assets.find(a => a.id === depId)?.status === 'isolated';

                let strokeColor = 'url(#cyber-line-grad)';
                let strokeDash = 'none';
                let strokeWidth = 1.5;

                if (isLineCompromised) {
                  strokeColor = '#ef4444';
                  strokeWidth = 2.5;
                } else if (isLineIsolated) {
                  strokeColor = '#f97316';
                  strokeDash = '5,5';
                  strokeWidth = 1;
                }

                return (
                  <g key={`${asset.id}-${depId}`}>
                    {/* Glowing background line */}
                    <line
                      x1={startCoords.x}
                      y1={startCoords.y}
                      x2={endCoords.x}
                      y2={endCoords.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth * 3}
                      strokeOpacity="0.1"
                    />
                    {/* Core visible connection line */}
                    <line
                      x1={startCoords.x}
                      y1={startCoords.y}
                      x2={endCoords.x}
                      y2={endCoords.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDash}
                      className={isSimulating && isLineCompromised ? 'animate-pulse' : ''}
                    />
                    {/* Animated Telemetry Packets */}
                    {!isLineIsolated && (
                      <circle r="3" fill={isLineCompromised ? '#ef4444' : '#00f0ff'}>
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          path={`M ${startCoords.x} ${startCoords.y} L ${endCoords.x} ${endCoords.y}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              });
            })}

            {/* Device Nodes */}
            {assets.map((asset) => {
              const coords = nodeCoords[asset.id];
              if (!coords) return null;

              const isSelected = selectedNodeId === asset.id;
              const statusColor = getStatusColor(asset.status);
              const nodeGlowClass = asset.status === 'compromised' ? 'glow-red' : 'glow-cyan';

              return (
                <g 
                  key={asset.id} 
                  transform={`translate(${coords.x}, ${coords.y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedNodeId(asset.id)}
                >
                  {/* Glowing border ring */}
                  <circle
                    r={isSelected ? 26 : 22}
                    fill="#080d21"
                    stroke={statusColor}
                    strokeWidth={isSelected ? 3 : 1.5}
                    strokeOpacity={isSelected ? 0.9 : 0.4}
                    style={{ filter: isSelected || asset.status === 'compromised' ? `url(#${nodeGlowClass})` : 'none' }}
                  />

                  {/* Secondary Sector colored ring */}
                  <circle
                    r={isSelected ? 29 : 25}
                    fill="none"
                    stroke={isSelected ? '#00f0ff' : 'rgba(6,182,212,0.1)'}
                    strokeWidth={1}
                    strokeDasharray="4,4"
                    className="group-hover:rotate-45 transition-transform duration-700"
                  />

                  {/* HTML/React node inside foreignObject (React Icons) */}
                  <foreignObject x="-10" y="-10" width="20" height="20" className="pointer-events-none">
                    <div style={{ color: statusColor }}>
                      {getNodeIcon(asset.type)}
                    </div>
                  </foreignObject>

                  {/* Asset Label Text */}
                  <text
                    y="40"
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#9ca3af'}
                    className="text-[10px] font-mono select-none"
                  >
                    {asset.name.split(' ')[0]}
                  </text>
                  <text
                    y="50"
                    textAnchor="middle"
                    fill="rgba(6, 182, 212, 0.6)"
                    className="text-[8px] font-mono select-none font-bold"
                  >
                    {asset.ip}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="border-t border-cyan-500/10 pt-3 flex flex-wrap gap-4 text-[10px] font-mono text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
            Online / Resilient
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>
            Compromised (Threat Propagating)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-orange-500 inline-block"></span>
            Isolated (Quarantined)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-cyan-400/80 inline-block rounded-full animate-ping" style={{ width: 6, height: 6 }}></span>
            Packet Telemetry
          </div>
        </div>

      </div>

      {/* Selected Node Details & Simulation Controls */}
      <div className="rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md p-4 flex flex-col justify-between">
        {selectedNode ? (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/10 pb-2">
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">
                  Asset Details
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 uppercase">
                  {selectedNode.type}
                </span>
              </div>

              {/* Basic Info */}
              <div className="space-y-2 font-mono">
                <div>
                  <div className="text-[9px] text-gray-400">Asset Name:</div>
                  <div className="text-xs text-white font-semibold">{selectedNode.name}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400">IP Address:</div>
                  <div className="text-xs text-cyan-300">{selectedNode.ip}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400">Critical Infrastructure Sector:</div>
                  <div className="text-xs text-indigo-400 font-semibold">
                    {getSectorName(selectedNode.sector)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-[#0b1426] p-2 rounded border border-cyan-500/5">
                    <div className="text-[8px] text-gray-400">Vulnerabilities:</div>
                    <div className="text-sm font-bold text-red-400">{selectedNode.vulnerabilitiesCount} CVEs</div>
                  </div>
                  <div className="bg-[#0b1426] p-2 rounded border border-cyan-500/5">
                    <div className="text-[8px] text-gray-400">Resilience (ARS):</div>
                    <div className={`text-sm font-bold ${selectedNode.ars > 80 ? 'text-emerald-400' : selectedNode.ars > 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {selectedNode.ars}/100
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Alert */}
              <div className="mt-4">
                <div className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                  Current Status
                </div>
                {selectedNode.status === 'compromised' ? (
                  <div className="bg-red-950/20 border border-red-500/30 rounded p-2.5 flex items-start gap-2 text-xs font-mono text-red-400">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <strong>COMPROMISED!</strong> Ransomware payload actively propagating through CNI.
                    </div>
                  </div>
                ) : selectedNode.status === 'isolated' ? (
                  <div className="bg-orange-950/20 border border-orange-500/30 rounded p-2.5 flex items-start gap-2 text-xs font-mono text-orange-400">
                    <Shield className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <strong>ISOLATED.</strong> Coordinated SOAR response blocked network flow to prevent lateral movement.
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-950/20 border border-emerald-500/30 rounded p-2.5 flex items-start gap-2 text-xs font-mono text-emerald-400">
                    <Shield className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <strong>ONLINE.</strong> Monitoring logs. Local firewall configuration secure.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="space-y-2 mt-6 pt-4 border-t border-cyan-500/10 font-mono">
              {selectedNode.status === 'online' && (
                <>
                  <button
                    onClick={() => handleSimulate(selectedNode.id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-400 py-2 rounded text-xs transition duration-200"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Inject Ransomware Simulation
                  </button>
                  <button
                    onClick={() => isolateAsset(selectedNode.id)}
                    className="w-full flex items-center justify-center gap-2 bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/40 text-orange-400 py-2 rounded text-xs transition duration-200"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Coordinated SOAR Isolation
                  </button>
                </>
              )}

              {selectedNode.status === 'compromised' && (
                <button
                  onClick={() => isolateAsset(selectedNode.id)}
                  className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded text-xs font-bold transition duration-200 shadow-lg shadow-orange-600/20"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Isolate Host Now
                </button>
              )}

              {selectedNode.status === 'isolated' && (
                <div className="text-[10px] text-center text-gray-500 italic">
                  Host is locked down. Initiate Recovery module to re-verify backups and clean system files before unblocking.
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full py-12 text-gray-500 font-mono">
            <Cpu className="h-10 w-10 text-cyan-500/20 mb-3 animate-pulse" />
            <span className="text-xs uppercase tracking-wider">No Node Selected</span>
            <p className="text-[10px] text-gray-600 mt-1 max-w-[200px]">
              Select any device node on the topology map to execute simulation injects or trigger containment.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
