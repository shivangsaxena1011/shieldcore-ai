# ShieldCore AI – Autonomous Cyber Defense Operating System (Cyber Defense OS)

ShieldCore AI is a next-generation, agentic cyber resilience platform designed specifically for **Critical National Infrastructure (CNI)** such as Power Grids, Railways, Healthcare (AIIMS), Smart Cities, Defense networks, and Oil & Gas.

By going beyond a traditional SIEM/SOC, ShieldCore AI integrates 9 specialized AI agents into an autonomous defense loop: Observe → Learn → Predict → Simulate → Prevent → Respond → Recover → Learn Again.

---

## 🚀 Multi-Agent AI Architecture

The system coordinates 9 distinct, active AI agents:

1.  **Sentinel Agent (Data Ingestion)**: Continuous log, endpoint, network packet, Active Directory, and OT (SCADA/Modbus) telemetry ingestion.
2.  **Behavioral Intelligence Agent (UEBA Anomaly Detection)**: Learns baselines for every user/host/OT device and flags deviations using online unsupervised ML.
3.  **Threat Correlation Agent (Graph-based Brain)**: Connects weak signals across multiple segments (e.g. VPN anomaly + USB copy + DNS Tunnel) using a Neo4j Knowledge Graph.
4.  **AI Threat Hunter (Proactive RAG sweeps)**: Periodic proactive hunts based on CISA, CERT-In, and MITRE ATT&CK vectors.
5.  **Predictive Attack Planner (Attack Chain Forecasting)**: Models future attack propagation timelines and probabilities (e.g., Privilege Escalation -> DC Compromise -> Ransomware).
6.  **Cyber Digital Twin (Network Simulator)**: Simulates hypothetical infections (such as ransomware outbreaks) and measures projected downtime and ₹ Crore financial impact.
7.  **Auto Response AI (SOAR Containment)**: Rapidly executes playbooks (e.g. host isolation, credential revocation, firewall blocks) in under 6 seconds.
8.  **Executive Intelligence Agent (Official Briefing Engine)**: Translates highly technical events into clear India CNI posture reports for non-technical government officials.
9.  **Recovery Agent (Integrity & Restore)**: Verifies snapshot backups, checks shadow volume integrity, and outlines prioritized system restoration order.

---

## 📊 Core Metric: Autonomous Resilience Score (ARS)

Unlike static vulnerability metrics, **ARS (0-100)** is a live, dynamic score calculated organization-wide and per-asset. It factors in:
*   Real-time behavioral anomaly scores
*   Vulnerability patch prioritization index
*   Network segmentation & isolation state
*   Backup verification status
*   Active threat campaign proximity

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, HTML5 Canvas, Zustand |
| **Backend (Optional)** | FastAPI (Python 3.12+), Uvicorn |
| **Data Streaming** | Apache Kafka |
| **Databases** | Neo4j (Knowledge Graph), PostgreSQL (Assets/Audit logs), Redis (Cache/WebSockets) |
| **Search / SIEM** | Elasticsearch / OpenSearch |

---

## 🏃 Getting Started (Next.js Frontend Prototype)

### Prerequisites
*   Node.js v20+
*   npm v10+

### Installation
1.  Navigate to the project root directory:
    ```bash
    cd C:\Users\shiva\.gemini\antigravity\scratch\shieldcore-ai
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the local dev server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🛡️ Operations Commands Guide

*   **Login Credentials**: Use Username: `admin_shiva`, Password: `password`
*   **MFA Bypass**: Click the fingerprint biometric sensor to verify the TOTP loop.
*   **Onboard Sectors**: Choose a specific infrastructure sector or select the "NIC Unified Cloud" to view all enclaves.
*   **Ransomware Simulation**: Go to **Digital Twin** or **Asset Inventory**, select any online node (e.g. `AIIMS Mainframe DB`), and click **Inject Ransomware Simulation** to watch the virus propagate.
*   **Auto Containment**: Trigger **Execute SOAR Isolation** to lock down the node and stop the spread, instantly updating the global ARS.
*   **AI Security Copilot**: Open the side drawer on any view or go to the **Copilot Workspace** to ask natural language questions (e.g. *"Why was this endpoint isolated?"*).
*   **Cyber Time Machine**: Go to **Cyber Time Machine**, click **Play**, and adjust the scrubber timeline to replay the forensic CCTV attack sequence.
