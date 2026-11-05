# 🎃 GhostHire — Hackathon Pitch Deck & Feature Presentation

> **Hack-to-ween 2026 / Open Innovation Track**  
> *"Expose fake opportunities before they ghost you."*

---

## Slide 1: Title & Vision
* **Product Name**: GhostHire
* **Tagline**: Expose fake opportunities before they ghost you.
* **Track**: Hack-to-ween 2026 / Open Innovation
* **Vision**: An evidence-based verification platform empowering college students and early-career jobseekers to detect scam offers before paying money or leaking sensitive credentials.
* **Core Philosophy**: Not *"AI says this is a scam."* Instead: *"Here are the specific signals we found, the exact evidence behind each one, and how you can independently verify."*

---

## Slide 2: The Problem — The Campus Employment Scam Pandemic
* **Target Victims**: College students, fresh graduates, and placement cell applicants.
* **Channels**: WhatsApp groups, Telegram channels, Instagram DMs, unverified job portals, spoofed emails.
* **The Traps**:
  1. **Upfront Fee Requests**: Asking ₹999 to ₹5,000 for "document verification", "training materials", or "refundable laptop security deposits".
  2. **Brand Impersonation**: Recruiters using `@gmail.com` claiming to represent Microsoft, Google, or TCS.
  3. **Guaranteed Placement**: 100% selection promises without interviews or technical rounds.
  4. **Shortened Masked Links**: Directing students to malicious phishing destinations via `bit.ly`.
  5. **Artificial Urgency**: "Reply within 30 minutes to secure your seat", provoking panicked payments.
  6. **Credential Harvesting**: Requesting Aadhaar OTPs, UPI PINs, or netbanking credentials under the guise of onboarding.

---

## Slide 3: The Solution — Explainable Verification Architecture
* **Direct Input**: Paste raw messages or upload WhatsApp/Telegram chat screenshots.
* **Smart OCR Pipeline**: Amazon Textract extracts clean lines and text blocks from messy mobile screenshots.
* **Explainable Heuristic Risk Engine**: A deterministic mathematical scoring rulebook (0 – 100 score).
* **Transparent Evidence**: Every score contribution displays the exact quoted sentence and point contribution.
* **Actionable Defense**: Provides safe, immediate next-step instructions (e.g. *"Check official company careers portal"*).

---

## Slide 4: Every Feature Deep-Dive

### Feature 1: WhatsApp & Screenshot Scanner (OCR)
* Drag & drop screenshot upload or **instant clipboard paste (`Ctrl + V`)**.
* Powered by Amazon Textract for high-accuracy document parsing.
* "Try WhatsApp Chat Sample" button for one-click instant evaluation.

### Feature 2: Message Text Scanner
* Direct text evaluation with real-time character count and input sanitization.
* Handles emails, LinkedIn DMs, and campus placement notices.

### Feature 3: Ghost-Radar 360° Visual HUD
* Custom Halloween-themed circular radar HUD with rotating sweep beam.
* Visual threat blips plotted around distance rings (Low, Medium, High).
* Dynamic central score dial with color transitions (Green ➔ Orange ➔ Coral Red).

### Feature 4: Explainable Evidence Breakdown Cards
* Identifies 6 high-confidence signals: `UPFRONT_PAYMENT` (+25), `SENDER_DOMAIN_MISMATCH` (+20), `GUARANTEED_SELECTION` (+15), `SUSPICIOUS_URL` (+15), `CREDENTIAL_REQUEST` (+15), `ARTIFICIAL_URGENCY` (+10).
* Itemized cards showing the exact quoted phrase from the applicant's offer.

### Feature 5: One-Click WhatsApp Alert Formatter ("Share Alert")
* Converts the risk findings into a beautifully formatted, copyable message to paste into campus WhatsApp & Telegram groups to warn fellow students.

### Feature 6: Community Pattern Radar (Crowdsourced Defense)
* Search domain threat history (e.g. `bit.ly`, `nexora-careers.xyz`).
* Consensual student reporting mechanism to flag new suspicious links.
* Automatically increases risk penalty if a domain has prior verified community reports.

### Feature 7: Built-in Pitch Deck & Cloud Architecture Explorer
* Interactive 7-slide presentation viewer embedded right inside the web app for judges.
* Interactive AWS Serverless Architecture diagram modal.

---

## Slide 5: AWS Cloud Architecture
* **Amazon Textract**: Performs machine learning document OCR on screenshots.
* **Amazon S3 (`ghost.hire`)**: Secure temporary screenshot storage with automated 24-hour lifecycle cleanup.
* **Amazon DynamoDB (`GhostHireReports`)**: Ultra-fast storage of scan audit history and community pattern reports.
* **AWS Lambda (Python 3.13 + Mangum)**: Serverless execution of the explainable risk engine with sub-second execution.
* **Amazon API Gateway**: Request routing, payload validation, and CORS handling.
* **Zero Frontend Secrets**: Presigned URLs eliminate the need to expose AWS credentials to client browsers.

---

## Slide 6: Live Demo Walkthrough (Nexora Labs Scenario)
* **Input**:
  > *"Congratulations! You have been shortlisted for the Nexora Labs internship. Pay ₹999 registration fees today. Selection is guaranteed. Apply through bit.ly/example. Reply within 30 minutes to secure your seat."*
* **Detections**:
  * Upfront payment (`+25 pts`): *"Pay ₹999 registration fees"*
  * Guaranteed selection (`+15 pts`): *"Selection is guaranteed"*
  * Suspicious URL (`+15 pts`): *"bit.ly/example"*
  * Artificial urgency (`+10 pts`): *"Reply within 30 minutes"*
* **Result**: **`65 / 100` [HIGH RISK]**
* **Recommendation**: *"Do NOT pay; independently verify the organization's official website."*

---

## Slide 7: Innovation & Hackathon Defense
* **Why not just a ChatGPT/LLM wrapper?**
  * LLMs hallucinate and cannot guarantee deterministic evidence.
  * GhostHire uses an auditable heuristic rules engine with sub-millisecond execution.
* **Responsible AI & Scope Guardrails**:
  * We flag risk indicators to prioritize caution; we do not make defamatory or criminal accusations.
* **Social Impact**:
  * Protects vulnerable students from losing hard-earned family money and sensitive KYC documents.

---

## Slide 8: Future Roadmap
* **Placement Cell Gateway**: College placement boards can integrate GhostHire as an automated vetting gateway for incoming company drives.
* **Vernacular Languages**: Multi-language support for regional job messages (Hindi, Tamil, Telugu) via Amazon Translate.
* **Corporate Registry API**: Partnerships with verified ATS platforms (Workday, Greenhouse) to confirm authorized recruitment domains.
