import os
import sys

# Ensure UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.aws_service import aws_service
from app.engine.risk_engine import risk_engine

img_path = os.path.join(os.path.dirname(__file__), "data", "google_internship_scam.png")
with open(img_path, "rb") as f:
    img_bytes = f.read()

text, source = aws_service.extract_text_from_bytes(img_bytes, filename="google_internship_scam.png")
print("==================================================")
print("  EXTRACTED TEXT FROM GOOGLE WHATSAPP SCREENSHOT")
print("==================================================")
print(text)
print(f"\n[Extraction Source: {source}]")

report = risk_engine.analyze(text, source="whatsapp_screenshot")
print("\n==================================================")
print("         GHOSTHIRE RISK ANALYSIS REPORT")
print("==================================================")
print(f"Risk Score:     {report.risk_score}/100 [{report.risk_level}]")
print(f"Recommendation: {report.recommendation}")
print("\nDetected Red Flags & Evidence:")
for f in report.findings:
    print(f"  • {f.signal} (+{f.points} pts)")
    print(f"    Quoted Evidence: \"{f.evidence}\"")
    print(f"    Guidance: {f.recommendation}\n")
