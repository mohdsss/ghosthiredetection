import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

def create_human_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Human-centric Dark Theme Palette
    BG_COLOR = RGBColor(16, 13, 25)         # #100D19 (Deep near-black purple)
    CARD_BG = RGBColor(33, 26, 45)          # #211A2D (Dark plum card)
    ORANGE = RGBColor(255, 138, 61)         # #FF8A3D (Halloween orange accent)
    LAVENDER = RGBColor(155, 123, 255)      # #9B7BFF (Electric lavender accent)
    WHITE = RGBColor(235, 232, 245)         # High-contrast readable off-white
    MUTED = RGBColor(150, 140, 172)         # Muted subtitle grey
    DANGER = RGBColor(255, 91, 102)         # #FF5B66 (Coral red alert)
    GREEN = RGBColor(16, 185, 129)          # Emerald green

    def set_bg(slide):
        bg = slide.background
        fill = bg.fill
        fill.solid()
        fill.fore_color.rgb = BG_COLOR

    def add_header(slide, title, category="GHOSTHIRE • HACK-TO-WEEN 2026"):
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.4))
        tf_c = cat_box.text_frame
        tf_c.word_wrap = True
        p_c = tf_c.paragraphs[0]
        p_c.text = category.upper()
        p_c.font.size = Pt(11)
        p_c.font.bold = True
        p_c.font.color.rgb = ORANGE

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.5), Inches(0.8))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(28)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE

    blank_layout = prs.slide_layouts[6]

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)

    tbox1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.3), Inches(4.8))
    tf1 = tbox1.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "👻 HACK-TO-WEEN 2026 | OPEN INNOVATION"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = ORANGE

    p1 = tf1.add_paragraph()
    p1.text = "GhostHire"
    p1.font.size = Pt(58)
    p1.font.bold = True
    p1.font.color.rgb = WHITE

    p2 = tf1.add_paragraph()
    p2.text = "Expose fake opportunities before they ghost you."
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = LAVENDER

    p3 = tf1.add_paragraph()
    p3.text = "\nEvery fake opportunity begins with a message. Every student deserves a way to question it before trusting it."
    p3.font.size = Pt(16)
    p3.font.color.rgb = WHITE

    p4 = tf1.add_paragraph()
    p4.text = "\nBuilt with React • FastAPI • Amazon Textract • Amazon S3 • Amazon DynamoDB"
    p4.font.size = Pt(13)
    p4.font.bold = True
    p4.font.color.rgb = ORANGE

    # ==========================================
    # SLIDE 2: The Human Story & Problem
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_header(s2, "The Real Human Problem: The 11:30 PM WhatsApp Trap")

    box2 = s2.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(5.0))
    tf2 = box2.text_frame
    tf2.word_wrap = True

    story_points = [
        ("The Desperate Reality", "College students send 50+ job and internship applications every month with zero replies. When a recruiter finally messages back, emotions take over critical thinking."),
        ("The Crafted Trap", "'Congratulations! Selected for Web Development Intern. Stipend ₹30,000/month. Pay ₹999 laptop insurance fee before 12:00 AM to secure your seat.'"),
        ("The Panicked Payment", "Fearing they will lose a career breakthrough, the student transfers ₹999 on UPI without checking."),
        ("The Ghosting", "The next morning: WhatsApp number is blocked, the website vanishes, the recruiter is gone. The student is ghosted, embarrassed, and ₹999 poorer.")
    ]

    for title, desc in story_points:
        p_t = tf2.add_paragraph() if tf2.paragraphs[0].text else tf2.paragraphs[0]
        p_t.text = f"• {title}: "
        p_t.font.size = Pt(15)
        p_t.font.bold = True
        p_t.font.color.rgb = ORANGE if "Reality" in title or "Trap" in title else DANGER

        p_d = tf2.add_paragraph()
        p_d.text = desc + "\n"
        p_d.font.size = Pt(13)
        p_d.font.color.rgb = WHITE

    # ==========================================
    # SLIDE 3: The 4 Classic Scam Mechanisms
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3)
    add_header(s3, "How Scammers Target Students Today")

    cards = [
        ("1. Upfront Fee Extortion", "Demanding ₹999 to ₹5,000 for 'registration fees', 'training kit', 'exam fees', or 'refundable security deposit'.\nRule of thumb: Legitimate employers pay you. They never ask you to pay.", DANGER),
        ("2. Corporate Identity Theft", "Recruiters claiming to be from Google, Microsoft, or TCS, but contacting students from personal @gmail.com or Telegram handles.\nOfficial hiring only happens from verified company domains.", ORANGE),
        ("3. Artificial Urgency Tactics", "'Reply within 30 minutes or lose your seat'. Creating psychological panic so students don't talk to their parents or college placement officers.", LAVENDER),
        ("4. KYC & Credential Harvesting", "Asking students to submit Aadhaar cards, bank account details, and even OTPs under the pretext of 'direct onboarding without interview'.", DANGER)
    ]

    for idx, (title, desc, color) in enumerate(cards):
        col = idx % 2
        row = idx // 2
        left = Inches(1.0 + col * 5.8)
        top = Inches(1.8 + row * 2.5)

        box = s3.shapes.add_textbox(left, top, Inches(5.4), Inches(2.2))
        tf = box.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = WHITE

    # ==========================================
    # SLIDE 4: Why Generic Solutions Fail
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4)
    add_header(s4, "Why Existing Solutions Fail Students")

    box4 = s4.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(5.0))
    tf4 = box4.text_frame
    tf4.word_wrap = True

    fails = [
        ("Generic AI Chatbots (ChatGPT / Gemini wrappers)", "They hallucinate. They give vague answers like 'This seems suspicious, be careful' without showing mathematical proof, exact quotes, or actionable verification steps. Students still don't know whether to pay."),
        ("Campus Placement Cells", "Placement officers are overwhelmed with thousands of students. Getting a manual response takes 2 to 3 days—by then, the fake '30-minute deadline' has already scared the student into paying."),
        ("Black-Box Anti-Virus Scanners", "URL scanners only check if a link has known malware. They don't understand employment context, stipend numbers, registration fee traps, or recruiter domain mismatches.")
    ]

    for title, desc in fails:
        p_t = tf4.add_paragraph() if tf4.paragraphs[0].text else tf4.paragraphs[0]
        p_t.text = f"❌ {title}"
        p_t.font.size = Pt(16)
        p_t.font.bold = True
        p_t.font.color.rgb = DANGER

        p_d = tf4.add_paragraph()
        p_d.text = desc + "\n"
        p_d.font.size = Pt(13)
        p_d.font.color.rgb = WHITE

    # ==========================================
    # SLIDE 5: Meet GhostHire — Our Solution
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5)
    add_header(s5, "Meet GhostHire: Evidence-Based Verification in Seconds")

    box5 = s5.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(5.0))
    tf5 = box5.text_frame
    tf5.word_wrap = True

    p = tf5.paragraphs[0]
    p.text = "Our Core Differentiator: Explainable Evidence, Not Guesswork"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = ORANGE

    flow = [
        ("1. Drop WhatsApp Screenshot (or Ctrl + V)", "The student doesn't even need to type. They copy the screenshot from WhatsApp Web or phone and press Ctrl+V."),
        ("2. Machine Learning OCR (Amazon Textract)", "AWS Textract accurately reads chat bubbles, distorted fonts, and headers into structured plain text in sub-seconds."),
        ("3. Explainable Heuristic Rulebook", "Deterministic mathematical rules inspect upfront fees (+25), domain mismatch (+20), guaranteed hiring (+15), masked URLs (+15), and urgency (+10)."),
        ("4. Transparent Evidence Report", "The student sees their exact quote highlighted, the points contributed, and a clear defense action: 'DO NOT PAY; Verify on official careers site.'"),
        ("5. One-Click WhatsApp Share Alert", "Formats the findings into a ready-to-share message to warn classmates and campus groups instantly.")
    ]

    for title, desc in flow:
        p_t = tf5.add_paragraph()
        p_t.text = f"• {title}: "
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = LAVENDER

        p_d = tf5.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = WHITE

    # ==========================================
    # SLIDE 6: Live Case Study (Nexora Labs)
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6)
    add_header(s6, "Live Case Study: Nexora Labs Internship Scam")

    box6 = s6.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(5.0))
    tf6 = box6.text_frame
    tf6.word_wrap = True

    p_in = tf6.paragraphs[0]
    p_in.text = "Actual Suspicious Message Scanned:"
    p_in.font.size = Pt(15)
    p_in.font.bold = True
    p_in.font.color.rgb = ORANGE

    p_q = tf6.add_paragraph()
    p_q.text = '"Congratulations! You have been shortlisted for the Nexora Labs internship. Pay ₹999 registration fees today. Selection is guaranteed. Apply through bit.ly/example. Reply within 30 minutes to secure your seat."\n'
    p_q.font.size = Pt(13)
    p_q.font.color.rgb = WHITE

    signals = [
        ("UPFRONT_PAYMENT (+25 pts)", 'Evidence: "Pay ₹999 registration fees" ➔ Legitimate employers never charge candidates.'),
        ("GUARANTEED_SELECTION (+15 pts)", 'Evidence: "Selection is guaranteed" ➔ Bypasses interviews and technical assessment.'),
        ("SUSPICIOUS_URL (+15 pts)", 'Evidence: "bit.ly/example" ➔ Shortened link obscures malicious destination.'),
        ("ARTIFICIAL_URGENCY (+10 pts)", 'Evidence: "Reply within 30 minutes" ➔ Designed to panic student before verification.')
    ]

    for sig, ev in signals:
        p_s = tf6.add_paragraph()
        p_s.text = f"🚨 {sig}: {ev}"
        p_s.font.size = Pt(12)
        p_s.font.color.rgb = LAVENDER

    p_score = tf6.add_paragraph()
    p_score.text = "\nCalculated Score: 65 / 100 [HIGH RISK]\nActionable Advice: Do NOT pay; independently verify on official website."
    p_score.font.size = Pt(15)
    p_score.font.bold = True
    p_score.font.color.rgb = DANGER

    # ==========================================
    # SLIDE 7: Community Pattern Radar
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7)
    add_header(s7, "Community Radar: Crowdsourced Student Defense")

    box7 = s7.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(5.0))
    tf7 = box7.text_frame
    tf7.word_wrap = True

    radar_points = [
        ("Students Protecting Students", "Scammers don't target one student—they spam thousands. Community Radar lets students flag suspicious links and recruiter handles so others get warned in real-time."),
        ("Instant Domain Cross-Reference", "Any student can search a recruiter's domain or bit.ly link to see how many students have previously reported it across colleges."),
        ("Consent & Privacy-First", "Reports are anonymized and require explicit user consent. No student phone numbers or personal information is ever publicly shared."),
        ("DynamoDB Backed Intelligence", "Every report is stored with single-digit millisecond latency on Amazon DynamoDB, automatically raising risk scores whenever that domain appears in new scans.")
    ]

    for title, desc in radar_points:
        p_t = tf7.add_paragraph() if tf7.paragraphs[0].text else tf7.paragraphs[0]
        p_t.text = f"🛡️ {title}"
        p_t.font.size = Pt(15)
        p_t.font.bold = True
        p_t.font.color.rgb = ORANGE

        p_d = tf7.add_paragraph()
        p_d.text = desc + "\n"
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = WHITE

    # ==========================================
    # SLIDE 8: The AWS Cloud Architecture
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8)
    add_header(s8, "Under The Hood: AWS Cloud Architecture")

    box8 = s8.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(5.0))
    tf8 = box8.text_frame
    tf8.word_wrap = True

    p_arch_flow = tf8.paragraphs[0]
    p_arch_flow.text = "Data Flow: React Client ➔ S3 Presigned URL ➔ Textract OCR ➔ Lambda Risk Engine ➔ DynamoDB"
    p_arch_flow.font.size = Pt(14)
    p_arch_flow.font.bold = True
    p_arch_flow.font.color.rgb = LAVENDER

    aws_details = [
        ("Amazon Textract", "OCR engine extracting line blocks from messy WhatsApp screenshots."),
        ("Amazon S3 (ghost.hire)", "Temporary screenshot storage with 24-hour auto-deletion lifecycle policy for student privacy."),
        ("Amazon DynamoDB (GhostHireReports)", "Stores scan history and crowdsourced community intelligence."),
        ("AWS Lambda (Python 3.13 + Mangum)", "Executes the heuristic risk engine serverlessly with sub-second response times."),
        ("Zero-Secret Architecture", "Browser never sees AWS credentials. All uploads use short-lived presigned URLs.")
    ]

    for title, desc in aws_details:
        p_t = tf8.add_paragraph()
        p_t.text = f"\n☁️ {title}: "
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = ORANGE

        p_d = tf8.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = WHITE

    # ==========================================
    # SLIDE 9: Why GhostHire Wins
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_bg(s9)
    add_header(s9, "Why GhostHire Stands Out to Judges")

    box9 = s9.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(5.0))
    tf9 = box9.text_frame
    tf9.word_wrap = True

    wins = [
        ("Deterministic & Explainable", "Not a black box. Judges and students see the exact math and quoted phrases."),
        ("Responsible AI Guardrails", "We prioritize risk indicators rather than making legal allegations. Missing data is treated as unknown."),
        ("Dual-Mode Reliability", "Works with real AWS cloud services, and includes automated fallback so demos never fail during judging."),
        ("High Social Impact", "Directly saves students from financial loss, stolen KYC data, and emotional distress during career placement.")
    ]

    for title, desc in wins:
        p_t = tf9.add_paragraph() if tf9.paragraphs[0].text else tf9.paragraphs[0]
        p_t.text = f"🏆 {title}"
        p_t.font.size = Pt(15)
        p_t.font.bold = True
        p_t.font.color.rgb = GREEN

        p_d = tf9.add_paragraph()
        p_d.text = desc + "\n"
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = WHITE

    # Save PowerPoint file
    out_path = os.path.join(os.path.dirname(__file__), "GhostHire_Pitch_Deck.pptx")
    prs.save(out_path)
    print(f"[SUCCESS] Upgraded PowerPoint generated at: {out_path}")

if __name__ == "__main__":
    create_human_deck()
