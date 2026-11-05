# 🏛️ GhostHire — Complete System Architecture & Engineering Specifications

> **Hack-to-ween 2026 / Open Innovation Track**  
> Evidence-Based Opportunity Verification Platform for Students & Placement Cells

---

## 1. Executive Architecture Summary

GhostHire is designed to solve the campus employment fraud epidemic. The platform combines an **explainable heuristic risk engine**, **Amazon Textract document OCR**, **Amazon S3 ephemeral storage**, and **Amazon DynamoDB** into a decoupled, zero-secret serverless architecture.

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React + Vite + Tailwind)"]
        UI["Ghost-Radar Dashboard"]
        OCR_TAB["WhatsApp Screenshot Scanner (OCR)"]
        TEXT_TAB["Pasted Opportunity Text Scanner"]
        COMM_RADAR["Community Pattern Radar"]
        DECK["7-Slide Interactive Pitch Deck"]
    end

    subgraph Gateway["API Gateway Layer"]
        API["FastAPI / Amazon API Gateway"]
        CORS["CORS & Request Validation"]
        PRESIGN["Presigned S3 URL Generator"]
    end

    subgraph Compute["Serverless Compute Layer"]
        LAMBDA["AWS Lambda (Python 3.13 + Mangum)"]
        ENGINE["Explainable Heuristic Risk Engine"]
        RULES["6 Heuristic Detectors (+25, +20, +15, +10 pts)"]
    end

    subgraph AWS["AWS Cloud Managed Services"]
        S3[("Amazon S3 (ghost.hire)\nEphemeral Storage + 24h Lifecycle")]
        TEXTRACT["Amazon Textract\nDocument OCR Extraction"]
        DYNAMO[("Amazon DynamoDB (GhostHireReports)\nScan History & Community Radar")]
    end

    OCR_TAB -->|1. Direct Bytes or Presigned Upload| PRESIGN
    PRESIGN -->|2. PutObject| S3
    S3 -->|3. DetectDocumentText| TEXTRACT
    TEXTRACT -->|4. Extracted Text Lines| LAMBDA
    TEXT_TAB -->|Direct Text Payload| API
    API --> LAMBDA
    LAMBDA --> ENGINE
    ENGINE --> RULES
    RULES -->|Calculate 0-100 Score| LAMBDA
    LAMBDA -->|Save Record| DYNAMO
    LAMBDA -->|JSON Risk Report| UI
    COMM_RADAR <-->|Query & Submit Reports| API
    API <--> DYNAMO
```

---

## 2. Component Breakdown

### 2.1 Frontend Client (`frontend/`)
* **Framework**: React 18, Vite 5, Tailwind CSS 3.
* **Theme System**: Dedicated Halloween palette:
  * Background: Deep near-black purple (`#100D19`)
  * Cards: Dark plum (`#211A2D`)
  * Primary Accent: Halloween orange (`#FF8A3D`)
  * Secondary Accent: Electric lavender (`#9B7BFF`)
  * Danger: Coral red (`#FF5B66`)
* **Key Modules**:
  * `GhostRadarVisual.jsx`: Real-time radar scanning HUD with $360^\circ$ sweep beam and threat blips.
  * `OpportunityScanner.jsx`: Handles WhatsApp screenshots, clipboard paste (`Ctrl+V`), and pasted text.
  * `RiskReportCard.jsx`: Itemized findings breakdown, exact quoted evidence, and copyable WhatsApp alert formatter.
  * `CommunityRadar.jsx`: Anonymized student crowdsourced reporting and domain risk intelligence.
  * `PitchDeckViewer.jsx`: Embedded 7-slide pitch presentation for judges.
  * `ArchitectureModal.jsx`: In-app architecture and data-flow explorer.

---

### 2.2 Backend Application (`backend/`)
* **Framework**: Python 3.13 + FastAPI + Uvicorn + Mangum (ASGI adapter for AWS Lambda).
* **Endpoints**:
  | Method | Route | Description |
  | :--- | :--- | :--- |
  | `POST` | `/api/analyze` | Evaluates raw pasted opportunity text against heuristic rules. |
  | `POST` | `/api/analyze/upload` | Accepts screenshot image, runs Amazon Textract OCR, and evaluates extracted text. |
  | `POST` | `/api/report` | Submits student-flagged domain report with explicit consent metadata. |
  | `GET` | `/api/community/{domain}` | Returns verified community reports and threat indicator for a domain. |
  | `GET` | `/api/history` | Fetches recent scan audit history from DynamoDB. |
  | `GET` | `/api/config` | Reports AWS connectivity status and active regions. |
  | `GET` | `/api/upload/presigned` | Issues 5-minute presigned S3 URLs for direct client-to-S3 uploads. |
  | `GET` | `/api/sample-whatsapp-image`| Serves a realistic WhatsApp scam screenshot for one-click testing. |

---

## 3. Explainable Heuristic Risk Engine

Unlike generative AI chatbots that hallucinate fraud determinations, GhostHire's risk engine is **deterministic, mathematical, and auditable**.

```mermaid
graph TD
    IN[Extracted Opportunity Text] --> D1{Upfront Fee Request?}
    D1 -- Yes --> S1["UPFRONT_PAYMENT (+25 pts)"]
    D1 -- No --> D2{Sender Mismatch?}
    
    D2 -- Yes --> S2["SENDER_DOMAIN_MISMATCH (+20 pts)"]
    D2 -- No --> D3{Guaranteed Selection?}

    D3 -- Yes --> S3["GUARANTEED_SELECTION (+15 pts)"]
    D3 -- No --> D4{Suspicious / Short URL?}

    D4 -- Yes --> S4["SUSPICIOUS_URL (+15 pts)"]
    D4 -- No --> D5{Credential / OTP Trap?}

    D5 -- Yes --> S5["CREDENTIAL_REQUEST (+15 pts)"]
    D5 -- No --> D6{Urgency < 30 Mins?}

    D6 -- Yes --> S6["ARTIFICIAL_URGENCY (+10 pts)"]
    D6 -- No --> D7[Check Community Radar Database]

    D7 --> SUM[Sum Points - Cap at 100]
    
    SUM --> R1[0 - 29: LOW RISK]
    SUM --> R2[30 - 59: MEDIUM RISK]
    SUM --> R3[60 - 100: HIGH RISK]
```

### Scoring Matrix:
1. **`UPFRONT_PAYMENT` (+25 pts)**: Identifies registration, laptop, training, or refundable deposit fees (e.g. *"Pay ₹999 registration fee"*).
2. **`SENDER_DOMAIN_MISMATCH` (+20 pts)**: Detects recruiters claiming to represent Google, Microsoft, TCS, etc., but using free webmail (`@gmail.com`).
3. **`GUARANTEED_SELECTION` (+15 pts)**: Flags offers promising 100% selection without interviews or technical evaluations.
4. **`SUSPICIOUS_URL` (+15 pts)**: Flags shortened domains (`bit.ly`, `tinyurl`) and suspicious TLDs (`.xyz`, `.top`).
5. **`CREDENTIAL_REQUEST` (+15 pts)**: Identifies attempts to collect OTPs, UPI PINs, Aadhaar numbers, or bank passwords.
6. **`ARTIFICIAL_URGENCY` (+10 pts)**: Detects artificial countdowns (e.g. *"Reply within 30 minutes or lose your seat"*).
7. **`COMMUNITY_REPORTS` (+10 to +25 pts)**: Penalty applied if associated domains have prior verified student fraud reports.

---

## 4. End-to-End Data Flow Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Applicant
    participant UI as React Frontend
    participant API as FastAPI / API Gateway
    participant S3 as Amazon S3 (ghost.hire)
    participant OCR as Amazon Textract
    participant Engine as Python Risk Engine
    participant DB as Amazon DynamoDB

    Student->>UI: Drops WhatsApp Screenshot (or Ctrl+V)
    UI->>API: POST /api/analyze/upload (file bytes)
    API->>OCR: detect_document_text(Document={'Bytes': image})
    OCR-->>API: Returns Blocks (LINE, WORD, Confidence)
    API->>API: Reconstructs clean readable text
    API->>DB: Query community reports for extracted domains
    DB-->>API: Return matching community flags
    API->>Engine: analyze(text, community_matches)
    Engine->>Engine: Run 6 Heuristic Detectors
    Engine-->>API: Return AnalyzeResponse (Score: 65, Level: HIGH)
    API->>DB: PutItem (Scan ID, Findings, Risk Level, Timestamp)
    API-->>UI: Return Structured JSON Report
    UI->>Student: Display 360° Radar HUD + Evidence Cards + Share Alert
```

---

## 5. Security & Privacy Guardrails

1. **Zero Frontend Secrets**: No AWS IAM Access Keys or Secret Keys are ever bundled in client-side JavaScript.
2. **Short-Lived S3 Presigned URLs**: Direct browser uploads use cryptographically signed S3 URLs that expire after 300 seconds.
3. **Ephemeral Image Lifecycle**: Screenshots uploaded to Amazon S3 are configured with a 24-hour expiration lifecycle policy to protect user privacy.
4. **Non-Defamatory Prioritization**: GhostHire flags heuristic risk signals and recommends verification steps; it explicitly does not declare companies guilty of criminal fraud.
5. **Consensual Community Sharing**: Pattern sharing requires explicit opt-in consent from the student.

---

## 6. AWS Service Summary

| AWS Service | Resource / Target | Purpose in GhostHire |
| :--- | :--- | :--- |
| **Amazon S3** | `ghost.hire` | Ephemeral screenshot storage with automated 24h lifecycle deletion. |
| **Amazon Textract** | `detect_document_text` | Machine-learning OCR for extracting text lines from mobile screenshots. |
| **Amazon DynamoDB** | `GhostHireReports` | Low-latency storage of scan audit records and community domain reports. |
| **AWS Lambda** | Python 3.13 runtime via Mangum | Serverless hosting of the explainable risk engine. |
| **Amazon API Gateway** | HTTP API Routes | Routes client requests with CORS, rate-limiting, and payload validation. |
