import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_footer(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#7A7289"))
        self.drawString(54, 36, "GhostHire — System Architecture Document | Hack-to-ween 2026")
        self.drawRightString(612 - 54, 36, f"Page {self._pageNumber} of {page_count}")
        self.setStrokeColor(colors.HexColor("#E0DCE6"))
        self.setLineWidth(0.5)
        self.line(54, 48, 612 - 54, 48)
        self.restoreState()

def build_pdf():
    pdf_path = os.path.join(os.path.dirname(__file__), "GhostHire_System_Architecture.pdf")
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#E65C00")     # Bold burnt orange
    SECONDARY = colors.HexColor("#5E35B1")   # Deep purple / lavender
    DARK_TEXT = colors.HexColor("#1A1523")   # Near black
    MUTED_TEXT = colors.HexColor("#5A5266")  # Muted grey
    BG_LIGHT = colors.HexColor("#F9F8FB")    # Clean light purple background
    BORDER_LIGHT = colors.HexColor("#D8D2E2")
    ACCENT_RED = colors.HexColor("#D32F2F")  # High risk coral

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=SECONDARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=PRIMARY,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=DARK_TEXT,
        spaceAfter=6
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1
    )

    table_body = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=DARK_TEXT
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    story = []

    # ==========================================
    # HEADER SECTION
    # ==========================================
    story.append(Paragraph("GhostHire — System Architecture", title_style))
    story.append(Paragraph("Evidence-Based Opportunity Verification Platform • Hack-to-ween 2026 / Open Innovation", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=0, spaceAfter=12))

    # ==========================================
    # SECTION 1: EXECUTIVE SUMMARY
    # ==========================================
    story.append(Paragraph("1. Executive Summary & Design Philosophy", h1_style))
    story.append(Paragraph(
        "GhostHire is an explainable opportunity risk intelligence platform designed to protect students and campus placement cell applicants from employment, internship, and scholarship fraud. The platform evaluates suspicious messages and mobile screenshots (WhatsApp, Telegram, email, and offer letters), extracts readable text via machine-learning OCR, runs a deterministic heuristic risk engine, and delivers an itemized evidence report with safe next-step defense actions.",
        body_style
    ))
    story.append(Paragraph(
        "<b>The Product Promise:</b> Not <i>'AI says this is a scam'</i>. Instead: <i>'Here are the specific signals we found, the exact quoted evidence behind each one, and how you can independently verify the opportunity.'</i>",
        body_style
    ))

    story.append(Spacer(1, 6))

    # ==========================================
    # SECTION 2: SYSTEM ARCHITECTURE & AWS STACK
    # ==========================================
    story.append(Paragraph("2. AWS Cloud Architecture & Component Breakdown", h1_style))
    story.append(Paragraph(
        "GhostHire utilizes a fully serverless, event-driven cloud architecture adhering to zero-secret frontend standards, short-lived presigned uploads, and low-latency storage:",
        body_style
    ))

    # Architecture Table
    arch_data = [
        [
            Paragraph("Component / Service", table_header),
            Paragraph("Technology", table_header),
            Paragraph("Architectural Role & Responsibility", table_header)
        ],
        [
            Paragraph("<b>Frontend Client</b>", table_body),
            Paragraph("React 18 + Vite 5 + Tailwind CSS", table_body),
            Paragraph("Ghost-radar HUD with 360° sweep beam, WhatsApp screenshot OCR uploader, clipboard paste (Ctrl+V), and interactive 7-slide pitch deck.", table_body)
        ],
        [
            Paragraph("<b>API Gateway Layer</b>", table_body),
            Paragraph("FastAPI / Amazon API Gateway", table_body),
            Paragraph("Request routing, CORS management, payload schema validation, and secure presigned URL minting.", table_body)
        ],
        [
            Paragraph("<b>Serverless Compute</b>", table_body),
            Paragraph("AWS Lambda (Python 3.13) + Mangum", table_body),
            Paragraph("Executes the explainable heuristic risk rules engine with sub-second execution latency and auto-scaling.", table_body)
        ],
        [
            Paragraph("<b>Document OCR Engine</b>", table_body),
            Paragraph("Amazon Textract", table_body),
            Paragraph("High-accuracy machine learning OCR extracting line and block structures from mobile screenshots and documents.", table_body)
        ],
        [
            Paragraph("<b>Ephemeral Storage</b>", table_body),
            Paragraph("Amazon S3 (<code>ghost.hire</code>)", table_body),
            Paragraph("Temporary holding of screenshot uploads with automated 24-hour lifecycle deletion for student privacy.", table_body)
        ],
        [
            Paragraph("<b>NoSQL Database</b>", table_body),
            Paragraph("Amazon DynamoDB (<code>GhostHireReports</code>)", table_body),
            Paragraph("Low-latency storage of scan audit records, risk findings, and crowdsourced student community intelligence.", table_body)
        ]
    ]

    arch_table = Table(arch_data, colWidths=[1.4 * inch, 1.6 * inch, 4.0 * inch])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
    ]))
    story.append(arch_table)

    story.append(Spacer(1, 10))

    # ==========================================
    # SECTION 3: EXPLAINABLE HEURISTIC RISK ENGINE
    # ==========================================
    story.append(Paragraph("3. Explainable Heuristic Risk Engine", h1_style))
    story.append(Paragraph(
        "The risk engine is GhostHire's core intellectual differentiator. It bypasses the probabilistic hallucinations of black-box LLMs in favor of a deterministic, auditable heuristic rulebook. Every score contribution is linked to exact textual evidence:",
        body_style
    ))

    rules_data = [
        [
            Paragraph("Signal Identifier", table_header),
            Paragraph("Points", table_header),
            Paragraph("Detection Pattern / Regex Criteria", table_header),
            Paragraph("Defense Recommendation", table_header)
        ],
        [
            Paragraph("<b>UPFRONT_PAYMENT</b>", table_body),
            Paragraph("<b>+25 pts</b>", table_body),
            Paragraph("Currency terms (₹, $, Rs), registration fees, laptop charges, security deposit demands.", table_body),
            Paragraph("Never pay upfront fees for employment; legitimate companies pay employees.", table_body)
        ],
        [
            Paragraph("<b>SENDER_DOMAIN_MISMATCH</b>", table_body),
            Paragraph("<b>+20 pts</b>", table_body),
            Paragraph("Corporate recruiter claims using free public webmails (@gmail.com, @yahoo.com).", table_body),
            Paragraph("Verify sender domain directly against the corporate careers portal.", table_body)
        ],
        [
            Paragraph("<b>GUARANTEED_SELECTION</b>", table_body),
            Paragraph("<b>+15 pts</b>", table_body),
            Paragraph("Promises of 100% direct placement or appointment letters without merit review.", table_body),
            Paragraph("Be skeptical of offers bypassing technical interviews and portfolios.", table_body)
        ],
        [
            Paragraph("<b>SUSPICIOUS_URL</b>", table_body),
            Paragraph("<b>+15 pts</b>", table_body),
            Paragraph("URL shorteners (bit.ly, tinyurl) or suspicious TLDs (.xyz, .top, .icu) obscuring destinations.", table_body),
            Paragraph("Do not click shortened links; navigate to the official portal directly.", table_body)
        ],
        [
            Paragraph("<b>CREDENTIAL_REQUEST</b>", table_body),
            Paragraph("<b>+15 pts</b>", table_body),
            Paragraph("Demands for Aadhaar OTP, UPI PIN, passwords, or netbanking credentials.", table_body),
            Paragraph("Never share banking credentials or OTPs under any recruitment pretext.", table_body)
        ],
        [
            Paragraph("<b>ARTIFICIAL_URGENCY</b>", table_body),
            Paragraph("<b>+10 pts</b>", table_body),
            Paragraph("Aggressive deadlines (< 30 minutes, 'reply immediately or lose seat').", table_body),
            Paragraph("Urgency tactics force panic; pause and conduct independent verification.", table_body)
        ]
    ]

    rules_table = Table(rules_data, colWidths=[1.8 * inch, 0.7 * inch, 2.3 * inch, 2.2 * inch])
    rules_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
    ]))
    story.append(rules_table)

    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Risk Thresholds:</b> <b>LOW RISK (0–29)</b>: Standard due diligence; <b>MEDIUM RISK (30–59)</b>: Elevated caution advised; <b>HIGH RISK (60–100)</b>: Multiple critical scam flags detected.",
        body_style
    ))

    # ==========================================
    # SECTION 4: DATA FLOW SEQUENCE
    # ==========================================
    story.append(Spacer(1, 4))
    story.append(Paragraph("4. End-to-End Execution Sequence", h1_style))
    story.append(Paragraph(
        "1. <b>Student Submission:</b> Student uploads a screenshot (or presses Ctrl+V from WhatsApp Web) or pastes message text.<br/>"
        "2. <b>OCR Extraction:</b> The file payload is sent to Amazon Textract (<code>detect_document_text</code>), which returns structural line blocks.<br/>"
        "3. <b>Domain Identification:</b> URLs and domains are parsed from the extracted text using regular expression extractors.<br/>"
        "4. <b>Community Cross-Referencing:</b> The backend queries Amazon DynamoDB to verify if detected domains have prior student fraud flags.<br/>"
        "5. <b>Risk Scoring:</b> The Python heuristic engine checks each signal, calculates the score (capped at 100), and compiles evidence.<br/>"
        "6. <b>Audit Persistence:</b> The complete report is recorded in DynamoDB under the scan ID.<br/>"
        "7. <b>Visual Reporting:</b> The frontend renders the 360° radar HUD, point badges, highlighted evidence, and WhatsApp share alert.",
        body_style
    ))

    # ==========================================
    # SECTION 5: SECURITY & REPUTATION GUARDRAILS
    # ==========================================
    story.append(Spacer(1, 4))
    story.append(Paragraph("5. Security, Privacy & Scope Guardrails", h1_style))
    story.append(Paragraph(
        "• <b>Zero Client Secrets:</b> IAM access keys are never bundled into client JS; backend roles govern cloud access.<br/>"
        "• <b>24-Hour Ephemeral Storage:</b> Uploaded screenshots are stored with a 24-hour expiration lifecycle policy.<br/>"
        "• <b>Scope Guardrail:</b> GhostHire flags risk indicators as a prioritization aid; it explicitly avoids defamatory criminal accusations.<br/>"
        "• <b>Consensual Crowdsourcing:</b> Community pattern sharing mandates explicit opt-in consent from the student applicant.",
        body_style
    ))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF generated successfully at: {pdf_path}")

if __name__ == "__main__":
    build_pdf()
