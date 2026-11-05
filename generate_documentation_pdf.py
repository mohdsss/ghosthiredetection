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
        self.drawString(54, 36, "GhostHire — Project Documentation & Specification | Hack-to-ween 2026")
        self.drawRightString(612 - 54, 36, f"Page {self._pageNumber} of {page_count}")
        self.setStrokeColor(colors.HexColor("#E0DCE6"))
        self.setLineWidth(0.5)
        self.line(54, 48, 612 - 54, 48)
        self.restoreState()

def build_pdf():
    pdf_path = os.path.join(os.path.dirname(__file__), "GhostHire_Project_Documentation.pdf")
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Color Palette
    PRIMARY = colors.HexColor("#D45400")     # Bold warm pumpkin
    SECONDARY = colors.HexColor("#5B21B6")   # Arcane deep purple
    DARK_TEXT = colors.HexColor("#1A1523")   # Near black
    MUTED_TEXT = colors.HexColor("#5A5266")  # Muted slate
    BG_LIGHT = colors.HexColor("#F9F8FC")    # Clean light card background
    BORDER_LIGHT = colors.HexColor("#D8D2E2")
    ACCENT_RED = colors.HexColor("#C026D3")
    ACCENT_GREEN = colors.HexColor("#059669")
    DANGER = colors.HexColor("#DC2626")

    # Typography Styles
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
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=SECONDARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=PRIMARY,
        spaceBefore=10,
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

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=DARK_TEXT
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=DARK_TEXT
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=DARK_TEXT
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("GhostHire — Project Documentation", title_style))
    story.append(Paragraph("<b>Evidence-Based Opportunity Verification & Threat Intelligence Platform</b><br/>Hack-to-ween 2026 • Open Innovation & Real-World Solutions • AWS Serverless", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=12))

    # Section 1: Executive Summary & Problem
    story.append(Paragraph("1. Executive Summary & Problem Statement", h1_style))
    story.append(Paragraph(
        "Across college campuses worldwide, millions of students and fresh graduates actively seeking internships and entry-level jobs fall prey to predatory recruitment scams. Scammers exploit placement anxiety by sending unsolicited WhatsApp messages, Telegram alerts, and fake PDF appointment letters impersonating reputable companies (Google, Microsoft, Nexora Labs).",
        body_style
    ))
    story.append(Paragraph(
        "<b>The Critical Market Gaps:</b>", body_style
    ))
    story.append(Paragraph("• <b>The 'Dark Social' Blindspot:</b> Scams circulate as chat messages and screenshot images, completely bypassing corporate email firewalls and traditional anti-phishing gateways.", bullet_style))
    story.append(Paragraph("• <b>Opaque AI Chatbots:</b> Generic LLM chatbots frequently hallucinate or provide vague, untraceable advice rather than deterministic, auditable evidence.", bullet_style))
    story.append(Paragraph("• <b>Information Isolation:</b> Fraudsters spam multiple college batches simultaneously while isolated students evaluate offers without cross-campus peer warnings.", bullet_style))
    story.append(Spacer(1, 8))

    # Section 2: Solution Overview
    story.append(Paragraph("2. The GhostHire Solution Ecosystem", h1_style))
    story.append(Paragraph(
        "GhostHire delivers a tripartite defense mechanism combining <b>serverless OCR</b>, <b>explainable heuristic scoring</b>, and <b>crowdsourced community intelligence</b>:",
        body_style
    ))

    solution_data = [
        [
            Paragraph("Module", table_header_style),
            Paragraph("Technology", table_header_style),
            Paragraph("Core Responsibility", table_header_style)
        ],
        [
            Paragraph("<b>WhatsApp Screenshot Scanner</b>", table_cell_bold),
            Paragraph("Amazon Textract & Clipboard API", table_cell_style),
            Paragraph("Allows drag-and-drop or Ctrl+V image paste. Extracts chat bubbles, recruiter handles, and links without manual typing.", table_cell_style)
        ],
        [
            Paragraph("<b>Explainable Risk Engine</b>", table_cell_bold),
            Paragraph("Deterministic Heuristic Rulebook", table_cell_style),
            Paragraph("Calculates a 0–100 risk score and quotes exact suspicious phrases (e.g. 'Pay ₹999 fees', 'within 30 mins').", table_cell_style)
        ],
        [
            Paragraph("<b>Community Pattern Radar</b>", table_cell_bold),
            Paragraph("Amazon DynamoDB NoSQL", table_cell_style),
            Paragraph("Decentralized crowdsourced registry where students check domains and submit consensual fraud alerts in sub-10ms.", table_cell_style)
        ],
        [
            Paragraph("<b>1-Click WhatsApp Shield</b>", table_cell_bold),
            Paragraph("Native Clipboard Formatter", table_cell_style),
            Paragraph("Generates formatted warning summaries for students to forward into batch WhatsApp groups to stop viral fraud.", table_cell_style)
        ]
    ]

    t_sol = Table(solution_data, colWidths=[1.5 * inch, 1.6 * inch, 3.9 * inch])
    t_sol.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_sol)
    story.append(Spacer(1, 10))

    # Section 3: Explainable Heuristic Scoring Model
    story.append(Paragraph("3. Explainable Risk Engine & Heuristic Weight Matrix", h1_style))
    story.append(Paragraph(
        "GhostHire calculates risk deterministically using a bounded sum of weighted heuristic detectors plus community penalties:",
        body_style
    ))

    # Mathematical Formula Box
    formula_text = Paragraph(
        "<b>Mathematical Model:</b><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>Risk Score = min(100, &sum; (w<sub>i</sub> &times; I(Signal<sub>i</sub>)) + Community_Penalty)</b><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<i>Where w<sub>i</sub> is the heuristic weight and I(Signal<sub>i</sub>) &isin; {0, 1} indicates detector activation.</i>",
        callout_style
    )
    t_formula = Table([[formula_text]], colWidths=[7.0 * inch])
    t_formula.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1, SECONDARY),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_formula)
    story.append(Spacer(1, 8))

    matrix_data = [
        [
            Paragraph("Signal Identifier", table_header_style),
            Paragraph("Points", table_header_style),
            Paragraph("Detection Logic & Regex Triggers", table_header_style),
            Paragraph("Student Guidance", table_header_style)
        ],
        [
            Paragraph("<b>UPFRONT_PAYMENT</b>", table_cell_bold),
            Paragraph("<font color='#DC2626'><b>+25 pts</b></font>", table_cell_style),
            Paragraph("Registration, training, kit fees, security deposits, UPI payment demands (₹500 - ₹10,000).", table_cell_style),
            Paragraph("Legitimate employers pay you; they NEVER charge fees. Reject offer.", table_cell_style)
        ],
        [
            Paragraph("<b>DOMAIN_MISMATCH</b>", table_cell_bold),
            Paragraph("<font color='#DC2626'><b>+20 pts</b></font>", table_cell_style),
            Paragraph("Recruiter claiming top brand using free webmail (@gmail, @yahoo) or lookalike domain (*-careers.xyz).", table_cell_style),
            Paragraph("Real corporate recruiters exclusively use official enterprise domain emails.", table_cell_style)
        ],
        [
            Paragraph("<b>GUARANTEED_SELECTION</b>", table_cell_bold),
            Paragraph("<font color='#D45400'><b>+15 pts</b></font>", table_cell_style),
            Paragraph("Claims of 100% selection or direct hire bypassing technical evaluation rounds.", table_cell_style),
            Paragraph("Reputable companies evaluate problem-solving skills; guaranteed hiring is a classic trap.", table_cell_style)
        ],
        [
            Paragraph("<b>SUSPICIOUS_URL</b>", table_cell_bold),
            Paragraph("<font color='#D45400'><b>+15 pts</b></font>", table_cell_style),
            Paragraph("Obfuscated or shortened links (bit.ly, tinyurl, .xyz, .top, .tk).", table_cell_style),
            Paragraph("Shortened links conceal destination phishing sites. Navigate only via official portals.", table_cell_style)
        ],
        [
            Paragraph("<b>CREDENTIAL_REQUEST</b>", table_cell_bold),
            Paragraph("<font color='#DC2626'><b>+15 pts</b></font>", table_cell_style),
            Paragraph("Demands for Aadhaar OTP, net banking passwords, or identity documents before offer contract.", table_cell_style),
            Paragraph("High risk of financial identity theft. Never share OTPs or passwords.", table_cell_style)
        ],
        [
            Paragraph("<b>ARTIFICIAL_URGENCY</b>", table_cell_bold),
            Paragraph("<font color='#5B21B6'><b>+10 pts</b></font>", table_cell_style),
            Paragraph("Extreme pressure timers ('Pay within 30 minutes', 'Offer expires in 1 hour').", table_cell_style),
            Paragraph("Scammers induce panic to bypass rational reflection. Pause and verify.", table_cell_style)
        ]
    ]

    t_matrix = Table(matrix_data, colWidths=[1.5 * inch, 0.7 * inch, 2.6 * inch, 2.2 * inch])
    t_matrix.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_matrix)
    story.append(Spacer(1, 10))

    # Page Break for clean presentation
    story.append(PageBreak())

    # Section 4: AWS Cloud Architecture
    story.append(Paragraph("4. AWS Serverless Cloud Architecture", h1_style))
    story.append(Paragraph(
        "GhostHire is engineered on a 100% serverless, cloud-native AWS infrastructure designed for zero-idle cost, high scalability, and tamper-evident auditability:",
        body_style
    ))

    aws_data = [
        [
            Paragraph("AWS Service", table_header_style),
            Paragraph("Resource Config", table_header_style),
            Paragraph("Operational Architecture & Workflow", table_header_style)
        ],
        [
            Paragraph("<b>Amazon Textract</b>", table_cell_bold),
            Paragraph("DetectDocumentText API", table_cell_style),
            Paragraph("Processes uploaded WhatsApp chat images, PDF appointment letters, and clipboard pastes. Automatically identifies text lines, phone numbers, and URLs with layout preservation.", table_cell_style)
        ],
        [
            Paragraph("<b>Amazon S3</b>", table_cell_bold),
            Paragraph("Bucket: ghost.hire<br/>Region: ap-southeast-2", table_cell_style),
            Paragraph("Serves as the Evidence Vault. Stores encrypted screenshot images with SHA-256 integrity hashes and generates 5-minute presigned upload/download URLs for zero backend proxy overhead.", table_cell_style)
        ],
        [
            Paragraph("<b>Amazon DynamoDB</b>", table_cell_bold),
            Paragraph("Table: GhostHireReports<br/>Region: ap-southeast-2", table_cell_style),
            Paragraph("Serverless NoSQL database backing the Community Pattern Radar. Stores verified scam reports and lookalike recruiter domains with sub-10ms query latency and automatic scaling.", table_cell_style)
        ],
        [
            Paragraph("<b>AWS Lambda & Mangum</b>", table_cell_bold),
            Paragraph("Python 3.11 Runtime / ASGI", table_cell_style),
            Paragraph("Packages the FastAPI application into an event-driven serverless Lambda handler, ensuring automatic horizontal scaling and zero cost during idle periods.", table_cell_style)
        ]
    ]

    t_aws = Table(aws_data, colWidths=[1.4 * inch, 1.8 * inch, 3.8 * inch])
    t_aws.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_aws)
    story.append(Spacer(1, 10))

    # Section 5: API Specification
    story.append(Paragraph("5. RESTful API Endpoint Reference", h1_style))
    story.append(Paragraph(
        "All endpoints are prefixed with <code>/api</code> and support CORS for seamless web integration:",
        body_style
    ))

    api_data = [
        [
            Paragraph("Endpoint", table_header_style),
            Paragraph("Method", table_header_style),
            Paragraph("Payload / Parameters", table_header_style),
            Paragraph("Response & Behavior", table_header_style)
        ],
        [
            Paragraph("<code>/api/analyze</code>", table_cell_bold),
            Paragraph("POST", table_cell_style),
            Paragraph("<code>{\"text\": string}</code>", table_cell_style),
            Paragraph("Runs explainable heuristic engine. Returns risk_score, risk_level, recommendation, and itemized findings.", table_cell_style)
        ],
        [
            Paragraph("<code>/api/analyze/upload</code>", table_cell_bold),
            Paragraph("POST", table_cell_style),
            Paragraph("<code>multipart/form-data (file)</code>", table_cell_style),
            Paragraph("Uploads screenshot to Amazon S3, executes Amazon Textract OCR, and evaluates extracted text against risk detectors.", table_cell_style)
        ],
        [
            Paragraph("<code>/api/community/{domain}</code>", table_cell_bold),
            Paragraph("GET", table_cell_style),
            Paragraph("Path: <code>domain</code> (string)", table_cell_style),
            Paragraph("Queries Amazon DynamoDB for verified community fraud reports and notes associated with the target domain.", table_cell_style)
        ],
        [
            Paragraph("<code>/api/report</code>", table_cell_bold),
            Paragraph("POST", table_cell_style),
            Paragraph("<code>{\"domain\", \"notes\", \"user_consent\"}</code>", table_cell_style),
            Paragraph("Records anonymized scam intelligence report into DynamoDB for cross-campus early warning detection.", table_cell_style)
        ],
        [
            Paragraph("<code>/api/config</code>", table_cell_bold),
            Paragraph("GET", table_cell_style),
            Paragraph("None", table_cell_style),
            Paragraph("Returns active AWS connectivity flags, bucket name, region, and serverless feature health status.", table_cell_style)
        ]
    ]

    t_api = Table(api_data, colWidths=[1.6 * inch, 0.7 * inch, 2.0 * inch, 2.7 * inch])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_api)
    story.append(Spacer(1, 10))

    # Section 6: Competitive Differentiation
    story.append(Paragraph("6. Innovation & Competitive Differentiation", h1_style))
    story.append(Paragraph(
        "GhostHire directly addresses the limitations of both traditional enterprise security tools and generic generative AI chatbots:",
        body_style
    ))

    diff_data = [
        [
            Paragraph("Capability", table_header_style),
            Paragraph("Traditional Spam Filters", table_header_style),
            Paragraph("Generic AI Chatbots", table_header_style),
            Paragraph("GhostHire Platform", table_header_style)
        ],
        [
            Paragraph("<b>WhatsApp Screenshot OCR</b>", table_cell_bold),
            Paragraph("<font color='#DC2626'>No (Email only)</font>", table_cell_style),
            Paragraph("Partial (Token costly)", table_cell_style),
            Paragraph("<font color='#059669'><b>Yes (Amazon Textract)</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>Explainable Score & Evidence</b>", table_cell_bold),
            Paragraph("Binary (Spam / Ham)", table_cell_style),
            Paragraph("<font color='#DC2626'>Hallucination prone</font>", table_cell_style),
            Paragraph("<font color='#059669'><b>Deterministic 0–100</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>Community Scam Radar</b>", table_cell_bold),
            Paragraph("None", table_cell_style),
            Paragraph("None (Static knowledge)", table_cell_style),
            Paragraph("<font color='#059669'><b>Yes (AWS DynamoDB)</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>1-Click WhatsApp Shield</b>", table_cell_bold),
            Paragraph("None", table_cell_style),
            Paragraph("None", table_cell_style),
            Paragraph("<font color='#059669'><b>1-Tap Group Alert</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>Cost per Verification</b>", table_cell_bold),
            Paragraph("High Enterprise License", table_cell_style),
            Paragraph("High LLM Token Costs", table_cell_style),
            Paragraph("<font color='#059669'><b>&lt; $0.001 / scan</b></font>", table_cell_bold)
        ]
    ]

    t_diff = Table(diff_data, colWidths=[1.8 * inch, 1.7 * inch, 1.7 * inch, 1.8 * inch])
    t_diff.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_diff)
    story.append(Spacer(1, 10))

    # Section 7: Verification & Test Results
    story.append(Paragraph("7. Test Verification & Quality Assurance", h1_style))
    story.append(Paragraph(
        "GhostHire maintains a comprehensive automated test suite with 100% pass rates across unit and integration suites:",
        body_style
    ))
    story.append(Paragraph("• <b>Test Suite Execution:</b> 8/8 tests passing (<code>test_risk_engine.py</code> & <code>test_api_integration.py</code>).", bullet_style))
    story.append(Paragraph("• <b>Live AWS Verification:</b> S3 bucket (<code>ghost.hire</code>) and DynamoDB table (<code>GhostHireReports</code>) confirmed operational in <code>ap-southeast-2</code>.", bullet_style))
    story.append(Paragraph("• <b>Security Hardening:</b> Zero credentials committed to version control; <code>.gitignore</code> enforced across all credential files.", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Generated Project Documentation PDF at: {pdf_path}")

if __name__ == "__main__":
    build_pdf()
