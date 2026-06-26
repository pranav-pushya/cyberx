# CyberX (v4) — Hacker OS & Cybersecurity Platform

CyberX is an interactive, premium cybersecurity learning hub and helper web application designed in a futuristic, terminal-like retro-hacker aesthetic. It functions as both a quick-reference toolkit and an AI-powered study mentor for ethical hackers, pentesting students, and Capture the Flag (CTF) competitors.

---

## 🏴 Core Features

### 1. 📊 Progress Dashboard (`index.html`)
* **Hacker Stats**: Tracks topics learned, quizzes taken, correct answers, and AI mentor queries in real-time.
* **Accuracy Meter**: Color-coded accuracy tracking (Red < 50%, Yellow < 75%, Green ≥ 75%).
* **Achievements & Badges**: Unlockable hacker badges based on milestones (e.g., *Script Kiddie*, *Networker*, *Threat Analyst*, *Tool Master*, *Elite Hacker*).
* **Day Streak**: Tracks daily study habits using time-zone proof streak counting.
* **Daily Intel Drop**: Generates a random lesser-known cybersecurity fact or real-world cyberattack breakdown via AI.

### 2. 📖 Learn Engine (`learn.html`)
* **Knowledge Modules**: Categorized interactive learning cards (Web Security, Cryptography, Forensics, OSINT, Network Security, System Security).
* **Terminology Lookup**: Real-time search engine covering common terms, CVEs, and protocols.

### 3. 🛠️ Tools Engine
* **Tool Analyzer (`tools.html`)**: Deep-dive analysis and command helpers for core pentesting utilities (Nmap, Metasploit, Burp Suite).
* **Kali Commands (`commands.html`)**: Searchable database of essential Kali Linux command lines categorized by phase.
* **OSINT Toolkit (`osint.html`)**: Centralized directory and interactive how-to reference for Open Source Intelligence tools (ExifInfo, FotoForensics, BehindTheEmail, Hunter.io, Who.is, DNSChecker, IpInfo, MXToolbox, VirusTotal, Shodan, Censys, HaveIBeenPwned).
* **Port Reference (`ports.html`)**: Interactive database of common TCP/UDP ports and protocols featuring a custom **CEH Exam Mode** for study.

### 4. 🧠 Intelligence Modules
* **AI Chat Mentor (`ai-chat.html`)**: Live conversational interface powered by LLaMA-3.3-70B via the Groq API, offering instant explanations of cyber concepts.
* **CTF Helper (`ctf.html`)**: Automatic decoder textarea that analyzes strings and suggests decoding scripts (Base64, ROT13, Hex, Morse, Caesar, Hashes) or step-by-step solutions.
* **Hacker Notepad (`notes.html`)**: Interactive Markdown-compatible notepad to save command cheatsheets and study summaries.
* **Threat Analyzer (`attacks.html`)**: Phase-by-phase breakdown of major vulnerability classes (SQLi, XSS, CSRF, DDoS, Phishing) with active mitigation strategies.
* **AI Quizzer (`quiz.html`)**: Generates custom quizzes based on your study topics or provides interactive prep tests.

---

## 📂 Project Structure

```
cyberx/
│
├── index.html          # Homepage & Progress Dashboard
├── learn.html          # Interactive Cyber Curriculum
├── tools.html          # Pentest Tool Reference
├── attacks.html        # Attack Vector Database
├── commands.html       # Kali Command cheatsheet
├── quiz.html           # Interactive Quiz module
├── ai-chat.html        # Groq-powered AI Mentor
├── roadmap.html        # CEH certification roadmap
├── notes.html          # Local-storage notepad
├── ctf.html            # Auto decoder & CTF helper
├── osint.html          # OSINT directory & helper
└── ports.html          # TCP/UDP Port reference & study mode
│
├── css/
│   └── style.css       # Core typography, utility classes, and variables
│
└── js/
    ├── api.js          # API client for Groq LLaMA integration
    ├── hud.js          # Canvas radar animations, clock, and hardware simulator
    └── main.js         # Core application state, dashboard logic, and tracking
```

---

## ⚡ Setup & Installation

CyberX is built entirely as a static client-side web application. There are no server setup or database configurations required.

### 1. Configure the AI Mentor (Groq Key)
Open `js/api.js` and add your Groq API key:
```javascript
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE";
```
*You can get a free key from the [Groq Console](https://console.groq.com/).*

### 2. Launching the App
Simply open `index.html` in any modern web browser or serve it locally using a development server (e.g., Live Server extension in VS Code):
```bash
# Example using Python's built-in server
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

---

## 🛡️ Legal & Ethical Disclaimer

**IMPORTANT: CyberX is strictly for educational purposes.** 
All information, commands, tools, and scripts presented are intended to aid students preparing for professional security examinations (e.g., CEH, Security+, OSCP) and developers looking to secure their applications. Performing unauthorized security testing or port scanning on third-party networks without explicit consent is illegal and a violation of the Computer Fraud and Abuse Act (CFAA) and international cyber laws. Use this tool responsibly. Stay ethical. Stay legal.
