# ⚡ CyberX — Terminal-Grade Cybersecurity Intelligence Platform

[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-FFA611?style=for-the-badge&logo=firebase&logoColor=black)](https://cyb-erx.web.app)
[![Cloud Firestore](https://img.shields.io/badge/Firestore-Realtime_Sync-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Groq API](https://img.shields.io/badge/AI_Engine-Groq_120B-F05032?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable_%26_Offline-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-00ff41?style=for-the-badge)](LICENSE)

> **CyberX** is a client-side retro-hacker cybersecurity suite and interactive learning operations center. Engineered for aspiring penetration testers, ethical hackers, and CTF competitors, CyberX delivers instant command intelligence, an AI-powered mentor, capture-the-flag cryptanalysis, study tracking, and real-time cross-device synchronization between mobile and desktop devices.

🌐 **Live Production App:** [https://cyb-erx.web.app](https://cyb-erx.web.app)

---

## 🏛️ System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │          CyberX Client Application           │
                    │   (PWA / Vanilla ES6 / Hardware HUD Canvas)  │
                    └───────┬──────────────────────────────┬───────┘
                            │                              │
         State & Notes Push │ Real-Time Sync               │ Inference Requests
         (Firestore SDK)    │ (onSnapshot Listener)        │
                            ▼                              ▼
                 ┌────────────────────┐         ┌────────────────────┐
                 │  Cloud Firestore   │         │ Groq AI API Proxy  │
                 │  (Multi-Device DB) │         │ (gpt-oss-120b)     │
                 └────────────────────┘         └────────────────────┘
                            ▲                              │
                            │ Synchronized Data            │ Streaming Output
                            │                              │
                    ┌───────┴──────────────────────────────┴───────┐
                    │               Mobile / Desktop Node          │
                    │         (PWA Offline Cache / IndexedDB)      │
                    └──────────────────────────────────────────────┘
```

---

## 🚀 Key Architectural Innovations

### 1. 📲 Progressive Web App (PWA) & Offline-First Engine
* **Standalone Native App**: Installable directly on Android, iOS, Windows, macOS, and Linux via a native Web App Manifest (`manifest.json`) and high-resolution icons (`icon-192.png`, `icon-512.png`).
* **Service Worker Cache (v3)**: Employs a network-first caching strategy with offline fallback, keeping assets readily available in low-connectivity or air-gapped lab environments.

### 2. 🔄 Firestore Real-Time Cloud Sync
* **Cross-Device Continuity**: Study notes, CEH roadmap milestones, study streaks, and quiz statistics automatically sync in real-time between your workstation and smartphone.
* **Offline Resilience**: Offline actions are queued locally via IndexedDB and synchronized to the cloud when network connectivity is restored.

### 3. 🧠 Ultra-Fast AI Intelligence (Groq 120B Model)
* **Flagship Model**: Powered by Groq's high-throughput `openai/gpt-oss-120b` reasoning engine.
* **Context-Calibrated Responses**: Calibrated specifically for practical cybersecurity, offensive security techniques, defensible architectures, and ethical testing workflows.

### 4. 🧩 DRY Modular Navigation & HUD Engine
* **Centralized Popups**: Navigation overlays (`#cx-tools-overlay`, `#cx-more-overlay`) are dynamically injected via `js/main.js` with responsive glassmorphism styles in `css/style.css`, eliminating thousands of lines of duplicate markup.
* **Hardware HUD**: Real-time simulated system metrics, tactical radar canvas, sound waveform visualizers, and digital clocks.

---

## 📂 Modules & Capabilities

| Module | File | Core Functionality |
| :--- | :--- | :--- |
| **Progress Ops** | `index.html` | Real-time mastery analytics, accuracy gauges, unlockable hacker achievements, and visit streak tracker. |
| **Curriculum** | `pages/learn/learn.html` | Interactive curriculum covering OSINT, Network Scanning, Web Hacking, PrivEsc, and Cryptography with AI Knowledge Bursts. |
| **Certification Roadmap** | `pages/learn/roadmap.html` | Structured milestone tracker covering Foundations, Network Security, CEH, Pentesting, and Cloud Security. |
| **AI Quizzer** | `pages/learn/quiz.html` | Adaptive difficulty multiple-choice quiz engine with robust answer parsing and automated progress tracking. |
| **Tool Analyzer** | `pages/tools/tools.html` | Deep architectural breakdowns, essential command flags, and attack chain recipes for Nmap, Burp Suite, Metasploit, and Wireshark. |
| **Terminal Cheats** | `pages/tools/commands.html` | Categorized Kali Linux commands cheat sheet with syntax explanations and powerful one-liner command chains. |
| **OSINT Suite** | `pages/tools/osint.html` | Categorized directory and dynamic cheat sheets for open-source intelligence tools across domains, emails, IPs, and images. |
| **Port Reference** | `pages/tools/ports.html` | Interactive TCP/UDP protocol database featuring CEH exam prep mode, vulnerability analysis, and port deep dives. |
| **Threat Matrix** | `pages/security/attacks.html` | Detailed attack vector profiles (SQLi, XSS, CSRF, Buffer Overflow, Ransomware) with threat meters, detection, and countermeasures. |
| **CTF Assistant** | `pages/security/ctf.html` | Client-side decoders (Base64, Hex, Binary, URL, ROT13) and AI crypto-analysis for identifying obscure ciphers and hashes. |
| **AI Mentor** | `pages/ai/ai-chat.html` | Interactive conversational terminal for scenario walkthroughs, payload analysis, and instant technical mentoring. |
| **Hacker Notepad** | `pages/ai/notes.html` | Persistent local & cloud-synced notes editor with one-click AI Markdown enhancement and auto-tagging. |

---

## 📁 Repository Structure

```
cyberx/
├── 📄 index.html                  # Main operations dashboard & telemetry
│
├── 📂 pages/                      # Categorized application modules
│   ├── 📂 learn/                  # Curriculum & Certifications
│   │   ├── 📄 learn.html          # Interactive topic curriculum
│   │   ├── 📄 roadmap.html        # Certification roadmap tracker
│   │   └── 📄 quiz.html           # AI-powered adaptive quiz arena
│   │
│   ├── 📂 tools/                  # Pentesting & Analysis Toolkits
│   │   ├── 📄 tools.html          # Pentest tool analyzer & chain generator
│   │   ├── 📄 commands.html       # Kali Linux command cheat sheets
│   │   ├── 📄 osint.html          # OSINT directory & helper toolkit
│   │   └── 📄 ports.html          # Protocol registry & CEH study mode
│   │
│   ├── 📂 security/               # Threats & CTF Cryptanalysis
│   │   ├── 📄 attacks.html        # Attack breakdown & defense matrix
│   │   └── 📄 ctf.html            # Auto decoder & CTF cryptography cracker
│   │
│   └── 📂 ai/                     # AI Mentorship & Notes
│       ├── 📄 ai-chat.html        # Real-time Groq 120B AI mentor chat
│       └── 📄 notes.html          # Cloud-synced research notepad
│
├── 📂 assets/                     # Media & PWA icons
│   └── 📂 icons/
│       ├── 🖼️ icon-192.png        # Native PWA icon (192x192)
│       └── 🖼️ icon-512.png        # Native splash icon (512x512)
│
├── 📂 css/
│   └── 🎨 style.css               # Global hacker palette, glassmorphism, & layout
│
├── 📂 js/
│   ├── ⚙️ api.js                  # Groq Cloud API integration & proxy client
│   ├── 🕹️ hud.js                  # Canvas radar, audio waveform, & clock telemetry
│   ├── 🌐 main.js                 # State management, stats engine, & navigation popups
│   └── ☁️ sync.js                 # Real-time Firestore cloud synchronization
│
├── 📂 scripts/                    # Build & automation scripts
│   └── ⚙️ sync-env.js             # Environment synchronization pre-deploy hook
│
├── 📄 manifest.json               # Web App Manifest for PWA installation
├── 📄 sw.js                       # Service Worker cache management (v4)
├── ⚙️ server.js                   # Local Node.js development server with API proxy
├── ⚙️ firebase.json               # Firebase Hosting & Firestore configuration
├── ⚙️ firestore.rules             # Security rules for Firestore cloud sync
├── ⚙️ firestore.indexes.json      # Database indexes for Firestore
├── 📄 package.json                # Scripts & project metadata
├── 📄 .env.example                # Environment template for Groq API configuration
└── 📄 Readme.md                   # Platform documentation
```

---

## 🛠️ Local Development & Deployment

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)
* A free [Groq API Key](https://console.groq.com/keys)

### 2. Environment Setup
Clone the repository and create your local environment file:
```bash
git clone https://github.com/pranav-pushya/cyberx.git
cd cyberx
cp .env.example .env
```
Open `.env` and supply your credentials:
```env
GROQ_API_KEY="gsk_your_api_key_here"
GROQ_MODEL="openai/gpt-oss-120b"
PORT=5501
```

### 3. Running Locally
Launch the local development server:
```bash
npm start
```
Open your browser at `http://localhost:5501`. The local server automatically proxies Groq API requests via `/api/groq`, keeping your API key secure without exposing it in client storage.

### 4. Deploying to Firebase Hosting
Deploy both Firestore security rules and Hosting assets in a single step:
```bash
npm run deploy
```
*(The `predeploy` hook automatically triggers `sync-env.js` to synchronize the active environment configuration into `js/env.json` prior to deployment).*

---

## 🔒 Security & Privacy Practices
* **No Hardcoded Keys**: API keys are strictly excluded from version control (`.gitignore`).
* **Firestore Access Control**: Strict Firestore security rules restrict write operations to permitted namespaces.
* **Encrypted Data in Transit**: All AI interactions and database transactions utilize TLS 1.3 encryption.

---

## ⚖️ Legal & Ethical Disclaimer

**CyberX is developed exclusively for educational and defensive learning purposes.**
All materials, tools, command syntax, and vulnerability demonstrations are designed to prepare cybersecurity students for professional security credentials (e.g., CEH, CompTIA Security+, OSCP) and assist defensive practitioners in securing web applications. Performing unauthorized security testing, exploitation, or port scanning against targets without explicit, written authorization is strictly illegal under national and international law (e.g., Computer Fraud and Abuse Act). **Always act ethically and legally.**

---

*Engineered with precision for the next generation of ethical security engineers.*
