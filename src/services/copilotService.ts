export interface CopilotEvidence {
  mitre?: string;
  cve?: string;
  score?: number;
  actionsTaken?: string[];
}

export interface CopilotResponse {
  content: string;
  evidence?: CopilotEvidence;
}

export interface CopilotProvider {
  respond(message: string): Promise<CopilotResponse>;
}

export class DemoCopilotProvider implements CopilotProvider {
  async respond(message: string): Promise<CopilotResponse> {
    const lower = message.toLowerCase();

    return new Promise((resolve) => {
      setTimeout(() => {
        if (lower.includes('why was') || lower.includes('isolate')) {
          resolve({
            content: `### CyberGPT Assessment (Demo Provider) // Incident Containment
Our **Supervisor Agent** orchestrated a multi-agent validation that resulted in the isolation of **AIIMS Mainframe DB (172.16.50.88)**:
1. **Behavioral Agent (Agent 2)** caught an anomalous SSH session timing (2:14 AM vs 9:00 AM baseline).
2. **Threat Correlation Agent (Agent 3)** mapped the events on the **Neo4j Knowledge Graph** linking: \`admin_shiva\` -> VPN IP \`198.51.100.41\` -> executed \`Mimikatz\` payload.
3. RAG lookup on **MITRE ATT&CK** database flagged technique **T1021.002 (Remote Services: SMB)**.
4. **Planner Agent** delegated containment rules to **Auto Response AI (Agent 7)**, which isolated the host in **6.4 seconds**.

**Citations**:
*   *MITRE ATT&CK*: [T1021.002](https://attack.mitre.org/techniques/T1021/002)
*   *CERT-In Bulletin*: CIV-2026-0041
*   *CVE Database*: CVE-2024-38193 (Windows privilege escalation)`,
            evidence: { mitre: 'T1021.002', cve: 'CVE-2024-38193', score: 94 }
          });
        } else if (lower.includes('predict') || lower.includes('next attack')) {
          resolve({
            content: `### Attack Path Forecasting // Sankey Node Probability
The **Predictive Attack Intelligence Engine (Agent 5)** has forecast future attacker decisions with a **96% Confidence Level**:
*   **Path A (88% Probability)**: Privilege Escalation via Windows MSHTML kernel bypass -> traversal to **NIC Cloud Node (203.0.113.50)**.
*   **Path B (12% Probability)**: Persistence via registry key modifications -> exfiltration over DNS tunnels.

**Suggested Mitigations**:
*   Ensure **OT Firewalls** are segmented.
*   Apply Cumulative Update KB5040437 (remedies CVE-2024-38193).`
          });
        } else if (lower.includes('report') || lower.includes('executive')) {
          resolve({
            content: `### ShieldCore AI Coordinated Briefing // CNI Posture
**Incident ID**: INC-001 | **Classification**: Espionage Campaign APT29
**Avoided Loss**: ₹14 Crore | **Downtime Prevented**: 4.5 Days

Our autonomous agents intercepted a credential-theft campaign aiming to deploy ransomware across the AIIMS network. The intrusion was neutralized by the multi-agent mesh without causing power, railway, or hospital service degradation.`
          });
        } else if (lower.includes('power grid') || lower.includes('status')) {
          resolve({
            content: `### CNI Power Grid Posture Review
*   **SCADA Controllers**: Online, polling Modbus commands correctly.
*   **Integrity Hash**: Golden Master verified.
*   **Threat Hunter loop**: 0 vulnerabilities exploited.
*   **Resilience score**: 89/100 (Optimal).`
          });
        } else {
          resolve({
            content: `I have received your prompt. Currently monitoring the **Federated Threat Intel Network (Parliament Mode)**. 
*   **AI agents status**: 9 active, Supervisor Agent online.
*   **Knowledge Graph**: 8 active entities, 7 relationships.
*   **Global ARS**: 82/100.
How would you like the multi-agent supervisor to coordinate the enclaves?`
          });
        }
      }, 1000);
    });
  }
}

export const copilotService: CopilotProvider = new DemoCopilotProvider();
