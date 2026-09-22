'use client';

import React from 'react';
import { useCyberStore } from '@/store/cyberStore';
import { FileText, Download, Zap, Hospital, Train, Building2 } from 'lucide-react';

export default function ExecutiveView() {
  const globalArs = useCyberStore(state => state.globalArs);
  const nationalDisruptionIndex = useCyberStore(state => state.nationalDisruptionIndex);
  const incidents = useCyberStore(state => state.incidents);
  const vulnerabilities = useCyberStore(state => state.vulnerabilities);
  const assets = useCyberStore(state => state.assets);

  const handleExportReport = () => {
    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>ShieldCore AI - Executive Briefing Report</title>
  <style>
    body { font-family: monospace; background: #030712; color: #e5e7eb; padding: 40px; }
    h1 { color: #06b6d4; border-bottom: 2px solid #06b6d4; padding-bottom: 10px; }
    .metric { background: #0b1426; border: 1px solid #1e293b; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
    .highlight { color: #10b981; font-weight: bold; }
    .danger { color: #ef4444; font-weight: bold; }
  </style>
</head>
<body>
  <h1>SHIELDCORE AI - EXECUTIVE CYBER DEFENSE BRIEFING</h1>
  <p><strong>Generated Timestamp:</strong> ${new Date().toISOString()}</p>
  <p><strong>System Classification:</strong> Confidential / Critical National Infrastructure Posture</p>

  <div class="metric">
    <h2>Autonomous Resilience Score (ARS): <span class="${globalArs > 80 ? 'highlight' : 'danger'}">${globalArs}/100</span></h2>
    <p>Overall operational status across all 5 monitored CNI enclaves.</p>
  </div>

  <div class="metric">
    <h3>National Disruption Index Indicators</h3>
    <ul>
      <li>Power Grid: ${nationalDisruptionIndex.power}%</li>
      <li>Healthcare: ${nationalDisruptionIndex.medical}%</li>
      <li>Railways: ${nationalDisruptionIndex.transport}%</li>
      <li>Smart Cities: ${nationalDisruptionIndex.water}%</li>
    </ul>
  </div>

  <div class="metric">
    <h3>Active Incident Summary</h3>
    <p>Total Incidents Tracked: ${incidents.length}</p>
    <p>Patched Vulnerabilities: ${vulnerabilities.filter(v => v.status === 'patched').length}/${vulnerabilities.length}</p>
    <p>Online Assets: ${assets.filter(a => a.status === 'online').length}/${assets.length}</p>
  </div>
</body>
</html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShieldCore_Executive_Briefing_${new Date().toISOString().substring(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#070b19]/60 p-4 border border-cyan-500/10 rounded-xl backdrop-blur-md">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            Executive Intelligence Command & CNI Disruption Index
          </h2>
          <span className="text-[10px] text-gray-400">
            Translates multi-agent cyber telemetry into national financial and infrastructure risk metrics.
          </span>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded text-xs transition uppercase tracking-wider shadow-lg shadow-cyan-600/20 w-full sm:w-auto shrink-0"
        >
          <Download className="h-3.5 w-3.5" />
          Export Briefing Report
        </button>
      </div>

      {/* Disruption Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 backdrop-blur-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Power Sector</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{nationalDisruptionIndex.power}%</div>
          <span className="text-[9px] text-gray-400 mt-1 block">Grid Disruption Risk</span>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 backdrop-blur-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-rose-400 uppercase tracking-widest font-bold">Healthcare Sector</span>
            <Hospital className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white">{nationalDisruptionIndex.medical}%</div>
          <span className="text-[9px] text-gray-400 mt-1 block">Patient Record Impact</span>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Railways Sector</span>
            <Train className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{nationalDisruptionIndex.transport}%</div>
          <span className="text-[9px] text-gray-400 mt-1 block">Transit Disruption Index</span>
        </div>

        <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-950/10 backdrop-blur-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-sky-400 uppercase tracking-widest font-bold">Smart Cities</span>
            <Building2 className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">{nationalDisruptionIndex.water}%</div>
          <span className="text-[9px] text-gray-400 mt-1 block">Surveillance/Cloud Index</span>
        </div>
      </div>

      {/* ARS Overview Panel */}
      <div className="p-6 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4">
          Autonomous Resilience Score (ARS) Component Breakdown
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center shrink-0">
            <div className="text-4xl font-bold text-white glow-text-cyan">{globalArs}/100</div>
            <span className="text-[10px] text-gray-400 uppercase mt-1 block">Global ARS Index</span>
          </div>
          <div className="w-full flex-grow space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span>Anomalies Baseline (Max 30)</span>
                <span className="text-cyan-400 font-bold">30 pts</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[100%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span>VLAN Microsegmentation (Max 25)</span>
                <span className="text-cyan-400 font-bold">25 pts</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[100%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
