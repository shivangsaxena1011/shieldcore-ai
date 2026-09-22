'use client';

import React, { useState } from 'react';
import { useCyberStore } from '@/store/cyberStore';
import { 
  Users, Database, Shield, Zap, Search, Check, AlertTriangle, PlaySquare, ShieldAlert, CheckCircle
} from 'lucide-react';
import { Incident } from '@/store/cyberStore';

export function AgentsMonitorView() {
  const agents = useCyberStore(state => state.agents);

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center bg-[#070b19]/60 p-4 border border-cyan-500/10 rounded-xl backdrop-blur-md">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4 text-cyan-400" />
            Autonomous AI Agents Grid (9 Core Defenders)
          </h2>
          <span className="text-[10px] text-gray-400">
            Independent AI agents responsible for collection, UEBA, correlation, hunting, & recovery.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="p-4 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white">{agent.name}</span>
              <span className="text-[9px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-300 uppercase font-bold">{agent.status}</span>
            </div>
            <p className="text-[10px] text-gray-400">{agent.role}</p>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between text-gray-400">
                <span>Health: <strong className="text-emerald-400">{agent.health}%</strong></span>
                <span>Load: <strong className="text-cyan-400">{agent.load}%</strong></span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full" style={{ width: `${agent.load}%` }}></div>
              </div>
            </div>
            <div className="p-2 bg-[#040815] border border-cyan-500/10 rounded text-[9px] text-cyan-300 italic truncate">
              {agent.lastAction}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AssetInventoryView() {
  const assets = useCyberStore(state => state.assets);
  const isolateAsset = useCyberStore(state => state.isolateAsset);
  const simulateRansomwareOutbreak = useCyberStore(state => state.simulateRansomwareOutbreak);
  const [search, setSearch] = useState('');

  const filtered = assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.ip.includes(search));

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center bg-[#070b19]/60 p-4 border border-cyan-500/10 rounded-xl backdrop-blur-md">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-400" />
            CNI Asset Inventory & Dependency Graph Matrix
          </h2>
          <span className="text-[10px] text-gray-400">
            Real-time tracking of critical SCADA PLCs, Database mainframes, & Firewalls.
          </span>
        </div>

        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets or IPs..."
            className="bg-[#040815] border border-cyan-500/30 text-white rounded pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#040815] text-cyan-400 border-b border-cyan-500/10 text-[10px] uppercase">
            <tr>
              <th className="p-3">Asset Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">IP Address</th>
              <th className="p-3">Sector</th>
              <th className="p-3">Status</th>
              <th className="p-3">ARS Score</th>
              <th className="p-3 text-right">SOAR Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10 text-[11px]">
            {filtered.map((asset) => (
              <tr key={asset.id} className="hover:bg-cyan-950/20">
                <td className="p-3 font-bold text-white">{asset.name}</td>
                <td className="p-3 text-gray-400 uppercase text-[9px]">{asset.type}</td>
                <td className="p-3 text-cyan-300">{asset.ip}</td>
                <td className="p-3 text-gray-400">{asset.sector}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    asset.status === 'online' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                    asset.status === 'compromised' ? 'bg-red-950 text-red-400 border border-red-500/30' :
                    'bg-orange-950 text-orange-400 border border-orange-500/30'
                  }`}>
                    {asset.status}
                  </span>
                </td>
                <td className="p-3 font-bold text-cyan-400">{asset.ars}/100</td>
                <td className="p-3 text-right space-x-2">
                  {asset.status === 'online' && (
                    <button
                      onClick={() => isolateAsset(asset.id)}
                      className="bg-orange-950/60 hover:bg-orange-900 border border-orange-500/30 text-orange-400 px-2 py-1 rounded text-[10px]"
                    >
                      Isolate
                    </button>
                  )}
                  {asset.status === 'online' && (
                    <button
                      onClick={() => simulateRansomwareOutbreak(asset.id)}
                      className="bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-400 px-2 py-1 rounded text-[10px]"
                    >
                      Ransomware
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function VulnerabilitiesView() {
  const vulnerabilities = useCyberStore(state => state.vulnerabilities);
  const runVulnerabilityPatch = useCyberStore(state => state.runVulnerabilityPatch);

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center bg-[#070b19]/60 p-4 border border-cyan-500/10 rounded-xl backdrop-blur-md">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            Autonomous Patching & CVE Vulnerability Matrix
          </h2>
          <span className="text-[10px] text-gray-400">
            Prioritized by AI Priority score (0-100) based on exploit maturity and asset criticality.
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {vulnerabilities.map((vuln) => (
          <div key={vuln.cve} className="p-4 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white">{vuln.cve}</span>
                <span className="text-xs text-cyan-300 font-bold">{vuln.title}</span>
                <span className="text-[9px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-bold">CVSS {vuln.severity}</span>
              </div>
              <p className="text-[10px] text-gray-400">{vuln.remediation} • Position: {vuln.networkPosition}</p>
            </div>

            <div>
              {vuln.status === 'patched' ? (
                <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-950 px-3 py-1.5 rounded border border-emerald-500/30">
                  <Check className="h-3.5 w-3.5" />
                  Patched
                </span>
              ) : (
                <button
                  onClick={() => runVulnerabilityPatch(vuln.cve)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-1.5 rounded text-xs transition"
                >
                  Apply AI Patch
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ParliamentView() {
  return (
    <div className="space-y-6 font-mono">
      <div className="bg-[#070b19]/60 p-4 border border-cyan-500/10 rounded-xl backdrop-blur-md">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyan-400" />
          Parliament Mode (Federated Cross-Agency Threat Sharing)
        </h2>
        <span className="text-[10px] text-gray-400">
          Anonymous zero-knowledge indicator vectors shared across Indian CNI organizations.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase">AIIMS Healthcare Enclave</span>
          <p className="text-[11px] text-gray-300">Shared vector: Mimikatz LSASS process memory hash via SMB admin shares.</p>
        </div>
        <div className="p-4 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase">Western Power Grid SCADA</span>
          <p className="text-[11px] text-gray-300">Shared vector: Modbus TCP register polling peak anomalies.</p>
        </div>
      </div>
    </div>
  );
}

export function IncidentsView({ onLinkIncident }: { onLinkIncident?: (inc: Incident) => void }) {
  const incidents = useCyberStore(state => state.incidents);
  const mitigateIncident = useCyberStore(state => state.mitigateIncident);
  const triggerSOARPlaybook = useCyberStore(state => state.triggerSOARPlaybook);
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filtered = incidents.filter(i => filterSeverity === 'all' || i.severity === filterSeverity);

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center bg-[#070b19]/60 p-4 border border-cyan-500/10 rounded-xl backdrop-blur-md">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            Active CNI Threat Incidents & SOAR Quarantine Queue
          </h2>
          <span className="text-[10px] text-gray-400">
            Real-time multi-agent correlated attack chains and MITRE ATT&CK technique classifications.
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 text-[10px]">Filter Severity:</span>
          {['all', 'critical', 'high', 'medium'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition ${filterSeverity === sev ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((inc) => (
          <div key={inc.id} className="p-5 rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                    inc.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-500/30' :
                    inc.severity === 'high' ? 'bg-orange-950 text-orange-400 border border-orange-500/30' :
                    'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {inc.severity}
                  </span>
                  <span className="text-xs text-white font-bold">{inc.title}</span>
                  <span className="text-[9px] text-gray-400">({inc.id})</span>
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-4">
                  <span>Source: <strong className="text-cyan-300">{inc.source}</strong></span>
                  <span>MITRE: <strong className="text-white">{inc.mitreTechnique}</strong></span>
                  <span>Confidence: <strong className="text-emerald-400">{inc.confidenceScore}%</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                  inc.status === 'active' ? 'bg-red-950 text-red-400 animate-pulse' :
                  inc.status === 'isolated' ? 'bg-orange-950 text-orange-400' :
                  'bg-emerald-950 text-emerald-400'
                }`}>
                  Status: {inc.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-[#040815] p-3 rounded border border-cyan-500/10">
              {inc.explanation}
            </p>

            {/* Evidence & Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 uppercase font-bold flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  Forensic Evidence Points
                </span>
                <ul className="space-y-1 text-[10px] text-gray-400 list-disc pl-4">
                  {inc.evidence.map((ev, idx) => (
                    <li key={idx}>{ev}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 bg-[#040815] p-3 rounded border border-cyan-500/10">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Projected Financial Risk:</span>
                  <span className="text-red-400 font-bold">₹{inc.financialImpact} Crores</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Estimated Service Downtime:</span>
                  <span className="text-amber-400 font-bold">{inc.estimatedDowntime} Days</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Affected CNI Enclaves:</span>
                  <span className="text-cyan-300 font-bold">{inc.affectedNodes.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-cyan-500/10">
              <div className="text-[10px] text-gray-500">
                CVE Associated: <strong className="text-white">{inc.cveAssociated}</strong>
              </div>

              <div className="flex gap-2">
                {onLinkIncident && (
                  <button
                    onClick={() => onLinkIncident(inc)}
                    className="flex items-center gap-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 px-3 py-1.5 rounded text-[10px] font-bold transition"
                  >
                    <PlaySquare className="h-3 w-3" />
                    Focus 3D Twin
                  </button>
                )}
                {inc.status === 'active' && (
                  <button
                    onClick={() => triggerSOARPlaybook(inc.id, 'Host Isolation & Microsegmentation')}
                    className="flex items-center gap-1 bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded text-[10px] font-bold transition"
                  >
                    <Shield className="h-3 w-3" />
                    SOAR Quarantine
                  </button>
                )}
                {inc.status !== 'mitigated' && (
                  <button
                    onClick={() => mitigateIncident(inc.id)}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-[10px] font-bold transition"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Mitigate Alert
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
