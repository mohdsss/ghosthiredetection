import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.aws_service import aws_service

client = TestClient(app)

def test_community_radar_keyword_submission_and_detection():
    # 1. Submit a community report with a custom keyword
    test_keyword = "PhantomHiringCorp"
    report_payload = {
        "domain": test_keyword,
        "keywords": ["phantomhiring", "phantom token task"],
        "opportunity_title": "Web3 Junior Intern",
        "notes": "Asks students to buy phantom tokens for job verification.",
        "user_consent": True,
        "reporter_alias": "Security Club Lead"
    }
    
    rep_res = client.post("/api/report", json=report_payload)
    assert rep_res.status_code == 200
    rep_data = rep_res.json()
    assert rep_data["status"] == "success"
    assert "report" in rep_data
    assert rep_data["report"]["domain"] == test_keyword.lower()

    # 2. Search community radar by that keyword
    search_res = client.get(f"/api/community/{test_keyword}")
    assert search_res.status_code == 200
    summary = search_res.json()
    assert summary["total_reports"] >= 1
    assert summary["risk_indicator"] in ["COMMUNITY_FLAGGED_KEYWORD", "HIGH_COMMUNITY_ALERTS"]
    assert any(test_keyword.lower() in r["domain"] or any("phantom" in k for k in r.get("keywords", [])) for r in summary["reports"])

    # 3. Analyze an offer text containing this keyword
    scan_payload = {
        "text": f"Congratulations! You are selected for Web3 position at {test_keyword}. Check details."
    }
    scan_res = client.post("/api/analyze", json=scan_payload)
    assert scan_res.status_code == 200
    scan_data = scan_res.json()
    
    # Assert community keyword flag was triggered and contributed to risk
    community_findings = [f for f in scan_data["findings"] if f["signal"] == "COMMUNITY_KEYWORD_FLAG"]
    assert len(community_findings) >= 1
    assert "PhantomHiring" in community_findings[0]["evidence"] or "phantomhiring" in community_findings[0]["evidence"].lower()
    assert scan_data["risk_score"] >= 35
