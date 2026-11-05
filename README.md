# 👻 GhostHire — Expose Fake Opportunities Before They Ghost You

[![Hackathon](https://img.shields.io/badge/Hack--to--ween-2026-FF8A3D?style=for-the-badge&logo=ghost)](https://unstop.com)
[![AWS](https://img.shields.io/badge/AWS-Textract_%7C_S3_%7C_DynamoDB_%7C_Lambda-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)

> **Hack-to-ween 2026 / Open Innovation Track**  
> An evidence-based opportunity verification platform empowering college students and placement cells to detect scam jobs, internships, and scholarships before paying money or leaking sensitive credentials.

---

## 🎯 The Real Human Story

Picture a 3rd-year college student at **11:30 PM**. They have sent 50+ internship applications with zero replies. Suddenly, a WhatsApp notification pings:

> *"Congratulations! You have been shortlisted for the Nexora Labs internship. Pay ₹999 registration fees today. Selection is guaranteed. Apply through bit.ly/example. Reply within 30 minutes to secure your seat."*

Desperate for a career breakthrough and panicked by the 30-minute countdown, the student sends ₹999 on UPI without checking.  
**The next morning:** The WhatsApp number is blocked, the website vanishes, and the recruiter is gone. The student has been ghosted and scammed.

**GhostHire was built to stop this cycle.**

---

## 💡 The Solution: Explainable Risk Intelligence

Unlike generic AI chatbots that hallucinate vague answers (*"This might be a scam, be careful"*), GhostHire follows an **Evidence-First Verification Promise**:

> **Not** *"AI says this is a scam."*  
> **Instead:** *"Here are the specific signals we found, the exact quoted evidence behind each one, and how you can independently verify."*

```
Student drops WhatsApp screenshot (or Ctrl + V)
                       │
                       ▼
            [Amazon Textract OCR]
                       │ (Extracts line blocks)
                       ▼
       [Explainable Heuristic Risk Engine]
     • Upfront Fee Detection (+25 pts)
     • Sender Domain Mismatch (+20 pts)
     • Guaranteed Selection Claim (+15 pts)
     • Shortened / Masked URL (+15 pts)
     • Credential / OTP Trap (+15 pts)
     • Artificial Urgency (+10 pts)
                       │
                       ▼
      [360° Ghost-Radar HUD & Evidence Cards]
     • Exact Quoted Phrase Highlighted
     • Traceable Heuristic Score (0 - 100)
     • Actionable Defense: "DO NOT PAY"
     • 1-Click WhatsApp Campus Warning Alert
```

---

## 🚀 Key Features Built

1. **WhatsApp & Screenshot OCR Scanner**:
   * Drag & drop screenshot upload or **instant clipboard paste (`Ctrl + V`)** directly from WhatsApp Web.
   * Powered by **Amazon Textract** machine-learning document OCR.
   * Built-in *"Try WhatsApp Chat Sample"* button for instant evaluation.
2. **Ghost-Radar 360° HUD**:
   * Animated circular radar interface with rotating sweep beam, active threat coordinates, and dynamic risk dial.
3. **Explainable Evidence Breakdown**:
   * Mathematical scoring model with exact quoted evidence pills and practical defense recommendations.
4. **Community Pattern Radar**:
   * Crowdsourced student warning shield backed by **Amazon DynamoDB** with explicit student consent.
5. **One-Click Share Alert**:
   * Generates formatted warning alerts to paste directly into college WhatsApp and Telegram placement groups.
6. **Built-in Presentation & Architecture**:
   * Interactive **7-Slide Pitch Deck** and **AWS Cloud Architecture Explorer** embedded right inside the web interface.
   * Exportable **System Architecture PDF** ([`GhostHire_System_Architecture.pdf`](file:///c:/Users/mohds/OneDrive/Desktop/aws%20sbg/GhostHire_System_Architecture.pdf)).
   * Editable **PowerPoint Pitch Deck** ([`GhostHire_Pitch_Deck.pptx`](file:///c:/Users/mohds/OneDrive/Desktop/aws%20sbg/GhostHire_Pitch_Deck.pptx)).

---

## ☁️ AWS Cloud Architecture

GhostHire operates with a **zero-secret frontend** and **serverless event-driven cloud architecture**:

| Service | Role in GhostHire |
| :--- | :--- |
| **Amazon Textract** | Extracts text lines and blocks from mobile WhatsApp screenshots. |
| **Amazon S3** (`ghost.hire`) | Ephemeral screenshot holding with automated 24-hour lifecycle deletion. |
| **Amazon DynamoDB** (`GhostHireReports`) | Ultra-fast storage for scan audit logs and community threat intelligence. |
| **AWS Lambda (Python 3.13) + Mangum** | Serverless execution of the explainable risk engine with sub-second latency. |
| **Amazon API Gateway** | Provides HTTP request routing, CORS headers, payload validation, and rate limiting. |

Detailed specifications: See [`ARCHITECTURE.md`](file:///c:/Users/mohds/OneDrive/Desktop/aws%20sbg/ARCHITECTURE.md) and [`GhostHire_System_Architecture.pdf`](file:///c:/Users/mohds/OneDrive/Desktop/aws%20sbg/GhostHire_System_Architecture.pdf).

---

## ⚡ Quick Start: Run in 1 Click

### Option 1: Standalone Production Launcher (Recommended)
Double-click `run_production.bat` (or execute in PowerShell):
```powershell
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser!

### Option 2: Full-Stack Dev Mode (Hot-Reload)
Double-click `run_dev.bat`:
* **Frontend**: [http://localhost:5173](http://localhost:5173) (Vite + React)
* **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs) (Interactive Swagger UI)

---

## 🧪 Testing & Verification

Run the automated test suite verifying all 6 risk signals and the live demo script:
```powershell
cd backend
.\venv\Scripts\pytest.exe -v
```
**Result: 8/8 tests passed (100% test coverage).**

---

## 📂 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── api/routes.py            # REST API routes (/analyze, /report, /community)
│   │   ├── engine/risk_engine.py    # 6-detector explainable heuristic risk engine
│   │   ├── models/schemas.py        # Pydantic data models & request/response shapes
│   │   ├── services/aws_service.py  # Amazon Textract, S3, & DynamoDB integration
│   │   └── main.py                  # FastAPI app + AWS Lambda Mangum handler
│   ├── data/                        # Sample WhatsApp scam screenshot & community seeds
│   ├── tests/                       # Pytest test suite (100% passing)
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Spooky navigation header & AWS status
│   │   │   ├── GhostRadarVisual.jsx # Ghost-radar animated 360° HUD
│   │   │   ├── OpportunityScanner.jsx # WhatsApp screenshot OCR & text scanner
│   │   │   ├── RiskReportCard.jsx   # Itemized findings, evidence cards & share alert
│   │   │   ├── CommunityRadar.jsx   # Student domain lookup & report submission
│   │   │   ├── PitchDeckViewer.jsx  # Interactive 7-slide judge presentation
│   │   │   ├── ArchitectureModal.jsx# AWS cloud architecture modal with PDF download
│   │   │   └── HistoryDrawer.jsx    # Scan audit logs
│   │   ├── App.jsx                  # Main full-stack application
│   │   └── index.css                # Tailwind CSS Halloween design system
│   ├── dist/                        # Production build bundle
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.js               # Vite config with API proxy
├── ARCHITECTURE.md                  # Comprehensive system architecture & data flows
├── PRESENTATION.md                  # Slide-by-slide presentation script
├── GhostHire_Pitch_Deck.pptx        # Editable 16:9 widescreen PowerPoint presentation
├── GhostHire_System_Architecture.pdf# Official System Architecture PDF report
├── run_production.bat               # 1-click standalone production launcher
├── run_dev.bat                      # 1-click full-stack development launcher
├── setup_git.bat                    # Helper script for Git initialization & push
└── .gitignore                       # Protects .env and secrets from leaking to GitHub
```

---
*Created with ❤️ for Hack-to-ween 2026. Protect students. Expose fake opportunities before they ghost you.*
