import pytest
from app.engine.risk_engine import risk_engine

def test_demo_script_nexora_labs():
    """
    Test the exact live demo script specified in section 05 of the hackathon brief.
    Expected signals:
    - UPFRONT_PAYMENT (+25)
    - GUARANTEED_SELECTION (+15)
    - SUSPICIOUS_URL (+15)
    - ARTIFICIAL_URGENCY (+10)
    Total expected: 65 / 100, classified as HIGH.
    """
    text = (
        "Congratulations! You have been shortlisted for the Nexora Labs internship. "
        "Pay ₹999 registration fees today. Selection is guaranteed. "
        "Apply through bit.ly/example. Reply within 30 minutes to secure your seat."
    )
    result = risk_engine.analyze(text)

    # Check score and risk level
    assert result.risk_score == 65
    assert result.risk_level == "HIGH"

    signals = {f.signal: f.points for f in result.findings}
    assert "UPFRONT_PAYMENT" in signals
    assert signals["UPFRONT_PAYMENT"] == 25

    assert "GUARANTEED_SELECTION" in signals
    assert signals["GUARANTEED_SELECTION"] == 15

    assert "SUSPICIOUS_URL" in signals
    assert signals["SUSPICIOUS_URL"] == 15

    assert "ARTIFICIAL_URGENCY" in signals
    assert signals["ARTIFICIAL_URGENCY"] == 10

def test_legitimate_job_offer():
    """Verify that a standard legitimate job offer produces a LOW risk score."""
    text = (
        "Dear Candidate, Thank you for applying for the Junior Software Engineer position at Acme Corp. "
        "We invite you to schedule your technical interview round on our careers portal at "
        "https://careers.acme.com/interviews using your applicant ID."
    )
    result = risk_engine.analyze(text)
    assert result.risk_score <= 25
    assert result.risk_level == "LOW"

def test_free_webmail_impersonation():
    """Verify sender domain mismatch when an email claims to be Google HR but uses @gmail.com."""
    text = (
        "Official Google campus placement drive. Selection is guaranteed. "
        "Please send your resume to google.recruiter.official@gmail.com immediately."
    )
    result = risk_engine.analyze(text)
    signals = {f.signal for f in result.findings}
    assert "SENDER_DOMAIN_MISMATCH" in signals
    assert "GUARANTEED_SELECTION" in signals
    assert result.risk_score >= 35

def test_credential_phishing():
    """Verify OTP / Bank PIN harvesting triggers CREDENTIAL_REQUEST signal."""
    text = (
        "Urgent: Share your Aadhaar OTP and UPI PIN to complete onboarding verification."
    )
    result = risk_engine.analyze(text)
    signals = {f.signal for f in result.findings}
    assert "CREDENTIAL_REQUEST" in signals
