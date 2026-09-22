# ShieldCore AI – Autonomous Cyber Defense Operating System (Cyber Defense OS)

ShieldCore AI is a next-generation, agentic cyber resilience platform designed specifically for **Critical National Infrastructure (CNI)** such as Power Grids, Railways, Healthcare (AIIMS), Smart Cities, Defense networks, and Oil & Gas.

By going beyond a traditional SIEM/SOC, ShieldCore AI integrates 9 specialized AI agents into an autonomous defense loop: **Observe → Learn → Predict → Simulate → Prevent → Respond → Recover → Learn Again**.

---

> [!CAUTION]
> **Security Notice & Prototype Disclaimer**
> 
> ShieldCore AI is currently a **prototype/simulation environment** for Critical National Infrastructure (CNI) demonstration.
> Authentication, MFA, telemetry, AI agents, SOAR actions, attack simulations, and threat intelligence shown in this demo are simulated for evaluation purposes.
> 
> Demo authentication credentials (`admin_shiva`) are used solely for prototype simulation and are not production security controls. Do not connect this prototype directly to live critical infrastructure or production networks without certified backend integrations.

---

## 🛠️ Architecture Breakdown

### Current Implemented Prototype (Frontend Stack)
- **Framework**: Next.js 16.2.11 (App Router & Turbopack)
- **UI & Styling**: React 19.2.4, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons
- **State Management**: Zustand 5 (Granular Selectors & Unweighted BFS Graph Pathfinder)
- **3D Visualization**: Vanilla Three.js WebGL Engine (Single Mount Lifecycle & Persistent NodeMesh Refs)
- **AI Copilot**: Provider Pattern (`CopilotProvider` Interface & `DemoCopilotProvider`)
- **Simulation Engines**:
  - **BFS Ransomware Outbreak Engine**: Cycle-safe Breadth-First Search dependency traversal
  - **Neo4j Knowledge Graph Engine**: BFS shortest path finder
  - **Dynamic ARS Calculator**: Deterministic 0–100 Autonomous Resilience Score
  - **Executive Exporter**: Client-side HTML/PDF briefing report generator

### Planned Production Architecture
- **Backend Services**: FastAPI / Python 3.12 microservices
- **Data Streaming**: Apache Kafka (Real-time CNI telemetry streams)
- **Databases**: Neo4j (Knowledge Graph), PostgreSQL (Asset inventory & Audit trails), Redis (Cache & WebSocket bus)
- **Search & Analytics**: OpenSearch / Elasticsearch SIEM

---

## 🚀 Multi-Agent AI Architecture

The system coordinates 9 distinct, active AI agents:

1.  **Sentinel Agent (Data Ingestion)**: Continuous log, endpoint, network packet, Active Directory, and OT (SCADA/Modbus) telemetry ingestion.
2.  **Behavioral Intelligence Agent (UEBA Anomaly Detection)**: Learns baselines for every user/host/OT device and flags deviations using online unsupervised ML.
3.  **Threat Correlation Agent (Graph-based Brain)**: Connects weak signals across multiple segments using a Neo4j Knowledge Graph.
4.  **AI Threat Hunter (Proactive RAG sweeps)**: Periodic proactive sweeps based on CISA, CERT-In, and MITRE ATT&CK vectors.
5.  **Predictive Attack Planner (Attack Chain Forecasting)**: Models future attack propagation timelines and probabilities.
6.  **Cyber Digital Twin (Network Simulator)**: Simulates hypothetical infections (such as ransomware outbreaks) and measures projected downtime and ₹ Crore financial impact.
7.  **Auto Response AI (SOAR Containment)**: Rapidly executes playbooks (e.g. host isolation, credential revocation, firewall blocks) in under 6 seconds.
8.  **Executive Intelligence Agent (Official Briefing Engine)**: Translates highly technical events into clear India CNI posture reports for non-technical government officials.
9.  **Recovery Agent (Integrity & Restore)**: Verifies snapshot backups, checks shadow volume integrity, and outlines prioritized system restoration order.

---

## 📊 Core Metric: Autonomous Resilience Score (ARS)

Unlike static vulnerability metrics, **ARS (0-100)** is a live, dynamic score calculated organization-wide and per-asset using `ARS_WEIGHTS`:
*   **Anomalies Baseline (30%)**: Uncompromised online asset ratio
*   **VLAN Microsegmentation (25%)**: Ratio of isolated host containment
*   **Patch Prioritization (25%)**: Ratio of remediated CVE vulnerabilities
*   **Verified Backups (20%)**: Snapshot integrity constant

---

## 🏃 Getting Started

### Prerequisites
*   Node.js v20+
*   npm v10+

### Installation & Run
1.  Navigate to the project root directory:
    ```bash
    cd C:\Users\shiva\.gemini\antigravity\scratch\shieldcore-ai
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the local development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🛡️ Prototype Guide

*   **Demo Authentication**: Username `admin_shiva` (Demo mode).
*   **MFA Verification**: Click the biometric sensor to complete the simulated TOTP check.
*   **AI Command Center**: Enter commands like `"Protect AIIMS from ransomware"` in the top SOC bar to launch Supervisor Agent planning routines.
*   **3D WebGL Digital Twin**: Click and drag to orbit the 3D network topology; select nodes to inject BFS ransomware or trigger SOAR isolation.
*   **BFS Knowledge Graph**: Select Start and Target nodes to compute dynamic shortest attack paths.
*   **Executive Briefing Export**: Click "Export Briefing Report" in Executive Intelligence to download an HTML summary report.
