from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_config():
    response = client.get("/api/config")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "GhostHire Risk Analysis Engine"
    assert data["features"]["textract_ocr"] is True

def test_api_analyze_nexora_demo():
    payload = {
        "text": "Congratulations! You have been shortlisted for the Nexora Labs internship. Pay ₹999 registration fees today. Selection is guaranteed. Apply through bit.ly/example. Reply within 30 minutes to secure your seat."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] == 65
    assert data["risk_level"] == "HIGH"
    assert len(data["findings"]) == 4

def test_api_community_check():
    response = client.get("/api/community/nexoralabs-careers.xyz")
    assert response.status_code == 200
    data = response.json()
    assert data["domain"] == "nexoralabs-careers.xyz"
    assert data["total_reports"] >= 1

def test_api_report_submission():
    payload = {
        "domain": "fake-scam-internships.xyz",
        "opportunity_title": "Frontend React Remote",
        "notes": "Asked for upfront Rs 500 processing charge and immediate UPI transfer",
        "user_consent": True,
        "reporter_alias": "Placement Team"
    }
    response = client.post("/api/report", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # Query domain right after
    lookup = client.get("/api/community/fake-scam-internships.xyz")
    assert lookup.status_code == 200
    assert lookup.json()["total_reports"] >= 1
