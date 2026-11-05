import re
from typing import List, Dict, Any, Tuple, Optional
from app.models.schemas import Finding, AnalyzeResponse
import uuid

# URL Shorteners often used to hide destination
SHORTENED_DOMAINS = {
    "bit.ly", "tinyurl.com", "rb.gy", "is.gd", "t.co", "cutt.ly",
    "ow.ly", "buff.ly", "goo.gl", "rebrand.ly", "shorturl.at"
}

# Suspicious TLDs frequently abused in phishing campaigns
SUSPICIOUS_TLDS = {
    ".xyz", ".top", ".club", ".work", ".buzz", ".icu", ".online", ".surf"
}

# Free Webmail providers - suspicious when claiming to be corporate recruiting
FREE_WEBMAILS = {
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "rediffmail.com", "mail.com", "proton.me", "protonmail.com"
}

# Reputable Brand Names frequently spoofed in campus scam messages
REPUTABLE_COMPANIES = [
    "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Infosys",
    "TCS", "Tata Consultancy", "Wipro", "Cognizant", "Accenture", "Deloitte",
    "Nexora Labs", "IBM", "Capgemini", "Cisco", "Oracle", "Goldman Sachs"
]

class RiskEngine:
    def __init__(self):
        pass

    def extract_urls(self, text: str) -> List[str]:
        """Extract URLs and link-like patterns from raw text."""
        url_regex = r'(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9][-a-zA-Z0-9]*(?:\.[a-zA-Z0-9][-a-zA-Z0-9]*)+(?:\/[^\s,)]*)?)'
        matches = re.findall(url_regex, text)
        clean_urls = []
        for match in matches:
            clean = match.strip()
            if "." in clean and len(clean) > 4:
                clean_urls.append(clean)
        return clean_urls

    def extract_domains(self, urls: List[str]) -> List[str]:
        """Extract root/host domains from a list of URLs."""
        domains = set()
        for u in urls:
            domain_part = u.split('/')[0].split('?')[0].lower()
            if domain_part.startswith("http://"):
                domain_part = domain_part[7:]
            elif domain_part.startswith("https://"):
                domain_part = domain_part[8:]
            if domain_part.startswith("www."):
                domain_part = domain_part[4:]
            if domain_part:
                domains.add(domain_part)
        return list(domains)

    def extract_emails(self, text: str) -> List[str]:
        """Extract email addresses from text."""
        email_regex = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        return re.findall(email_regex, text)

    def check_upfront_payment(self, text: str) -> Optional[Finding]:
        """Look for payment requests, registration fees, security deposits."""
        patterns = [
            r'(?:pay|deposit|transfer|send|charge|fee|fees)\s*(?:of\s*)?(?:₹|\$|rs\.?|inr|usd)?\s*(\d+[\d,]*)',
            r'(?:registration|processing|exam|training|laptop|onboarding|verification|security)\s*(?:fee|fees|charges?|deposit|amount)',
            r'refundable\s*(?:deposit|security|amount|fee)',
            r'pay\s*(?:₹|\$|rs\.?|inr|usd)?\s*\d+',
            r'upfront\s*(?:fee|charges?|cost|payment)'
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                evidence = match.group(0).strip()
                return Finding(
                    signal="UPFRONT_PAYMENT",
                    points=25,
                    evidence=evidence,
                    recommendation="Never pay upfront fees for a job or internship. Legitimate employers pay employees, not the reverse."
                )
        return None

    def check_guaranteed_selection(self, text: str) -> Optional[Finding]:
        """Look for unrealistic guaranteed selection claims."""
        patterns = [
            r'selection\s+is\s+guaranteed',
            r'100%\s*(?:selection|placement|job|guarantee|hiring)',
            r'guaranteed\s+(?:selection|placement|job|internship|seat|offer)',
            r'direct\s+selection\s+(?:without|no)\s+interview',
            r'offer\s+letter\s+(?:guaranteed|direct|ready)',
            r'no\s+interview\s+(?:required|needed)'
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return Finding(
                    signal="GUARANTEED_SELECTION",
                    points=15,
                    evidence=match.group(0).strip(),
                    recommendation="Be skeptical of offers promising 100% selection or bypassing technical evaluation and merit checks."
                )
        return None

    def check_suspicious_or_shortened_url(self, text: str, urls: List[str]) -> Optional[Finding]:
        """Check for shortened links, suspicious TLDs, or masking."""
        for u in urls:
            domain = u.split('/')[0].lower()
            if domain in SHORTENED_DOMAINS or any(domain.endswith(s) for s in SHORTENED_DOMAINS):
                return Finding(
                    signal="SUSPICIOUS_URL",
                    points=15,
                    evidence=u,
                    recommendation="Shortened links obscure the final destination. Always navigate directly through the employer's official website."
                )
            for tld in SUSPICIOUS_TLDS:
                if domain.endswith(tld):
                    return Finding(
                        signal="SUSPICIOUS_URL",
                        points=15,
                        evidence=u,
                        recommendation=f"The link uses an uncommon TLD ({tld}) frequently associated with spoofed domain campaigns."
                    )
        return None

    def check_artificial_urgency(self, text: str) -> Optional[Finding]:
        """Detect artificial urgency tactics forcing hasty decisions."""
        patterns = [
            r'reply\s+within\s+\d+\s*(?:minutes?|mins?|hours?|hrs?)',
            r'within\s+\d+\s*(?:minutes?|mins?|hours?|hrs?)\s+(?:or|to)',
            r'offer\s+(?:expires|valid)\s+(?:in|within)\s+\d+',
            r'urgent(?:ly)?\s+required',
            r'act\s+fast|limited\s+seats?\s+(?:remaining|left|available)',
            r'last\s+(?:chance|opportunity|call)\s+to\s+claim',
            r'immediate\s+(?:joining|action|reply|response)'
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return Finding(
                    signal="ARTIFICIAL_URGENCY",
                    points=10,
                    evidence=match.group(0).strip(),
                    recommendation="Scammers leverage short deadlines to provoke hasty decisions. Take pause and independently verify."
                )
        return None

    def check_credential_request(self, text: str) -> Optional[Finding]:
        """Check for OTP, bank account, PIN, Aadhaar, or sensitive credential requests."""
        patterns = [
            r'(?:share|send|provide|enter)\s*(?:your\s*)?(?:otp|one\s*time\s*password|pin|upi\s*pin|cvv|password)',
            r'(?:netbanking|bank\s*account|credit\s*card|debit\s*card)\s*details',
            r'aadhaar\s*(?:card|number)?\s*otp',
            r'google\s*pay|phonepe|paytm\s*upi\s*pin'
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return Finding(
                    signal="CREDENTIAL_REQUEST",
                    points=15,
                    evidence=match.group(0).strip(),
                    recommendation="Never share OTPs, passwords, or UPI/banking PINs. No legitimate recruiter will ever ask for payment credentials."
                )
        return None

    def check_sender_domain_mismatch(self, text: str, emails: List[str]) -> Optional[Finding]:
        """Check if an email from a free webmail claims to represent a recognized company."""
        # 1. Check emails for free webmails used alongside brand mentions
        for brand in REPUTABLE_COMPANIES:
            brand_in_text = re.search(r'\b' + re.escape(brand) + r'\b', text, re.IGNORECASE)
            if brand_in_text:
                for email in emails:
                    domain = email.split('@')[-1].lower()
                    if domain in FREE_WEBMAILS:
                        return Finding(
                            signal="SENDER_DOMAIN_MISMATCH",
                            points=20,
                            evidence=f"Claimed company '{brand}' but contact address is '{email}'",
                            recommendation=f"Official communications from {brand} come from their registered corporate domain, not free webmail ({domain})."
                        )

        # 2. Free webmail alone for official hiring
        for email in emails:
            domain = email.split('@')[-1].lower()
            if domain in FREE_WEBMAILS and any(kw in text.lower() for kw in ["hr team", "hiring manager", "official offer", "appointment letter", "corporate recruitment"]):
                return Finding(
                    signal="SENDER_DOMAIN_MISMATCH",
                    points=15,
                    evidence=f"Recruitment inquiry sent from free webmail '{email}'",
                    recommendation="Corporate recruiters communicate via company domain emails, not personal public webmail accounts."
                )
        return None

    def check_unofficial_channel(self, text: str) -> Optional[Finding]:
        """Detect recruitment insisting purely on Telegram or personal WhatsApp."""
        patterns = [
            r'(?:contact|message|dm|reach)\s*(?:us|me)?\s*on\s*telegram',
            r'telegram\s*(?:channel|id|link|group|@\w+)',
            r'whatsapp\s+(?:only|chat\s+link|me\s+at)',
            r't\.me\/\w+'
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return Finding(
                    signal="UNOFFICIAL_CHANNEL",
                    points=10,
                    evidence=match.group(0).strip(),
                    recommendation="Be cautious when opportunities mandate untraceable messenger apps (Telegram/WhatsApp) instead of established platforms."
                )
        return None

    def check_unrealistic_compensation(self, text: str) -> Optional[Finding]:
        """Check for unrealistic work-from-home claims (e.g. 1 hour daily, earn ₹50,000)."""
        pattern = r'(?:earn|salary|stipend)\s*(?:₹|\$|rs\.?|inr)?\s*(\d{2,}[\d,]*)\s*(?:per\s*(?:day|hour|week|month))?'
        # Check if work from home / easy copy paste is mentioned with high pay
        if any(w in text.lower() for w in ["copy paste", "simple data entry", "work 1 hour", "work 2 hours", "daily payout", "earn daily"]):
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return Finding(
                    signal="UNREALISTIC_COMPENSATION",
                    points=15,
                    evidence=f"{match.group(0).strip()} with minimal effort claim",
                    recommendation="Unusually high pay promised for trivial or low-effort tasks is a primary indicator of task scams."
                )
        return None

    def analyze(
        self, 
        text: str, 
        source: str = "text_input", 
        community_matches: int = 0,
        community_threat_details: Optional[List[Dict[str, Any]]] = None
    ) -> AnalyzeResponse:
        """Run all explainable risk detectors over the submitted text."""
        findings: List[Finding] = []
        urls = self.extract_urls(text)
        domains = self.extract_domains(urls)
        emails = self.extract_emails(text)

        # Run individual detector rules
        checkers = [
            lambda: self.check_upfront_payment(text),
            lambda: self.check_guaranteed_selection(text),
            lambda: self.check_suspicious_or_shortened_url(text, urls),
            lambda: self.check_sender_domain_mismatch(text, emails),
            lambda: self.check_artificial_urgency(text),
            lambda: self.check_credential_request(text),
            lambda: self.check_unofficial_channel(text),
            lambda: self.check_unrealistic_compensation(text),
        ]

        for check in checkers:
            res = check()
            if res:
                findings.append(res)

        # Include specific community threat keyword detections
        if community_threat_details:
            for threat in community_threat_details:
                kw = threat.get("matched_keyword", "suspicious_keyword")
                notes_snip = threat.get("notes", "").strip()
                if len(notes_snip) > 85:
                    notes_snip = notes_snip[:85] + "..."
                evidence_text = f"Flagged by Community Radar: '{kw}'"
                if notes_snip:
                    evidence_text += f" — Student report: \"{notes_snip}\""
                findings.append(Finding(
                    signal="COMMUNITY_KEYWORD_FLAG",
                    points=35,
                    evidence=evidence_text,
                    recommendation=f"The keyword, recruiter, or domain '{kw}' was actively reported by peer students on Community Threat Radar. Do not proceed or send funds."
                ))
        elif community_matches > 0:
            # Fallback general community penalty if no specific threat detail dicts
            findings.append(Finding(
                signal="COMMUNITY_REPORTS",
                points=min(30, community_matches * 10),
                evidence=f"{community_matches} user report(s) flagged against associated domains in Community Radar",
                recommendation="This domain or pattern has previously been flagged by fellow students in the community."
            ))

        # Calculate illustrative risk score (capped at 100)
        total_score = min(100, sum(f.points for f in findings))

        # Derive risk level according to project brief thresholds
        if total_score >= 60:
            risk_level = "HIGH"
            recommendation = "DO NOT PAY or share credentials. High risk of fraud identified. Independently verify the employer through their official careers portal."
        elif total_score >= 30:
            risk_level = "MEDIUM"
            recommendation = "Elevated risk signals detected. Conduct thorough background checks before taking any action or submitting documents."
        else:
            risk_level = "LOW"
            if len(findings) == 0:
                recommendation = "No prominent high-risk red flags detected. Always conduct standard due diligence on the official company careers portal."
            else:
                recommendation = "Minor risk signals noted. Proceed with normal precautions."

        scan_id = f"gh-{uuid.uuid4().hex[:10]}"

        return AnalyzeResponse(
            id=scan_id,
            risk_score=total_score,
            risk_level=risk_level,
            findings=findings,
            recommendation=recommendation,
            extracted_text=text,
            detected_domains=domains,
            community_flags=community_matches,
            source=source
        )

# Global singleton instance
risk_engine = RiskEngine()
