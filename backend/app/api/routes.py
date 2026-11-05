from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from fastapi.responses import FileResponse
from typing import Optional, List, Dict, Any
from app.models.schemas import (
    AnalyzeRequest, AnalyzeResponse, CommunityReportCreate,
    CommunityReportItem, CommunityDomainSummary, PresignedUrlResponse
)
from app.engine.risk_engine import risk_engine
from app.services.aws_service import aws_service
import os

router = APIRouter(prefix="/api", tags=["GhostHire API"])

@router.get("/config")
def get_service_config():
    """Return backend status, AWS integration flags and version."""
    return {
        "service": "GhostHire Risk Analysis Engine",
        "version": "1.0.0",
        "aws_connected": aws_service.has_aws_credentials,
        "aws_region": aws_service.aws_region,
        "s3_bucket": aws_service.s3_bucket,
        "dynamodb_table": aws_service.dynamodb_table,
        "features": {
            "textract_ocr": True,
            "explainable_risk_engine": True,
            "community_intelligence": True,
            "s3_presigned_upload": True
        }
    }

@router.get("/samples")
def get_sample_opportunities():
    """Pre-loaded sample messages for easy judging and live demonstration."""
    return [
        {
            "id": "sample-google-scam",
            "title": "Fake Google Summer Internship Scam (WhatsApp)",
            "risk_expected": "HIGH (65/100)",
            "text": "Congratulations! You have been selected for the Google Summer Internship 2026 (SWE Intern). Stipend: ₹1,25,000/month. Direct selection is guaranteed without interview. Pay ₹1,499 registration fee for Google Cloud assessment voucher today. Apply through: bit.ly/google-careers-portal. Confirm within 30 minutes to secure your seat!"
        },
        {
            "id": "sample-high-risk",
            "title": "Nexora Labs WhatsApp Scam (High Risk)",
            "risk_expected": "HIGH (65/100)",
            "text": "Congratulations! You have been shortlisted for the Nexora Labs internship. Pay ₹999 registration fees today. Selection is guaranteed. Apply through bit.ly/example. Reply within 30 minutes to secure your seat."
        }
    ]

@router.get("/sample-whatsapp-image")
def get_sample_whatsapp_image():
    """Returns a realistic WhatsApp scam chat screenshot image for testing."""
    sample_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "sample_whatsapp_scam.png")
    if os.path.exists(sample_path):
        return FileResponse(sample_path, media_type="image/png", filename="sample_whatsapp_scam.png")
    raise HTTPException(status_code=404, detail="Sample image not found")

@router.get("/download-architecture-pdf")
def download_architecture_pdf():
    """Download the official System Architecture PDF document."""
    pdf_path = os.path.join(os.path.dirname(__file__), "..", "..", "GhostHire_System_Architecture.pdf")
    if os.path.exists(pdf_path):
        return FileResponse(pdf_path, media_type="application/pdf", filename="GhostHire_System_Architecture.pdf")
    raise HTTPException(status_code=404, detail="Architecture PDF not found")

@router.get("/download-documentation-pdf")
def download_documentation_pdf():
    """Download the official Project Documentation PDF document."""
    pdf_path = os.path.join(os.path.dirname(__file__), "..", "..", "GhostHire_Project_Documentation.pdf")
    if os.path.exists(pdf_path):
        return FileResponse(pdf_path, media_type="application/pdf", filename="GhostHire_Project_Documentation.pdf")
    raise HTTPException(status_code=404, detail="Documentation PDF not found")

@router.get("/download-zip")
def download_clean_zip():
    """Download the clean project zip archive without PPT, PDFs, venv or node_modules."""
    candidates = [
        os.path.join(os.path.dirname(__file__), "..", "..", "GhostHire_Clean_Codebase.zip"),
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "GhostHire_Clean_Codebase.zip"),
    ]
    for path in candidates:
        if os.path.exists(path):
            return FileResponse(path, media_type="application/zip", filename="GhostHire_Clean_Codebase.zip")
    raise HTTPException(status_code=404, detail="Clean ZIP archive not found")

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_opportunity(payload: AnalyzeRequest):
    """Analyze opportunity from pasted text or S3 key reference with automatic community threat radar detection."""
    text_to_analyze = payload.text
    source = "pasted_text"

    if not text_to_analyze or not text_to_analyze.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty for analysis.")

    # 1. Scan text for any student-reported community threat keywords or domains
    community_threats = aws_service.check_community_threats_in_text(text_to_analyze)

    # 2. Extract URLs and check domains as well
    urls = risk_engine.extract_urls(text_to_analyze)
    domains = risk_engine.extract_domains(urls)
    for domain in domains:
        dom_reports = aws_service.get_community_reports_for_domain(domain)
        for dr in dom_reports:
            if not any(t.get("report_id") == dr.get("id") for t in community_threats):
                community_threats.append({
                    "report_id": dr.get("id"),
                    "matched_keyword": domain,
                    "domain": dr.get("domain", domain),
                    "opportunity_title": dr.get("opportunity_title", "Flagged Scam"),
                    "notes": dr.get("notes", ""),
                    "reporter_alias": dr.get("reporter_alias", "Student")
                })

    community_flags = len(community_threats)

    # 3. Execute explainable risk analysis with direct community threat injection
    result = risk_engine.analyze(
        text=text_to_analyze,
        source=source,
        community_matches=community_flags,
        community_threat_details=community_threats if community_threats else None
    )

    # Persist scan in DynamoDB / local history
    aws_service.save_analysis_record(result.model_dump())

    return result

@router.post("/analyze/upload", response_model=AnalyzeResponse)
async def analyze_uploaded_screenshot(file: UploadFile = File(...)):
    """Accept screenshot image upload, perform Textract OCR, and run risk engine with community radar check."""
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Perform OCR via AWS Textract or fallback simulation
    extracted_text, ocr_source = aws_service.extract_text_from_bytes(contents, file.filename or "screenshot.png")

    # 1. Scan extracted text for any student-reported community threat keywords
    community_threats = aws_service.check_community_threats_in_text(extracted_text)

    # 2. Check for community flags on any extracted domains
    urls = risk_engine.extract_urls(extracted_text)
    domains = risk_engine.extract_domains(urls)
    for domain in domains:
        dom_reports = aws_service.get_community_reports_for_domain(domain)
        for dr in dom_reports:
            if not any(t.get("report_id") == dr.get("id") for t in community_threats):
                community_threats.append({
                    "report_id": dr.get("id"),
                    "matched_keyword": domain,
                    "domain": dr.get("domain", domain),
                    "opportunity_title": dr.get("opportunity_title", "Flagged Scam"),
                    "notes": dr.get("notes", ""),
                    "reporter_alias": dr.get("reporter_alias", "Student")
                })

    community_flags = len(community_threats)

    # 3. Analyze extracted text
    result = risk_engine.analyze(
        text=extracted_text,
        source=f"screenshot_{ocr_source}",
        community_matches=community_flags,
        community_threat_details=community_threats if community_threats else None
    )

    # Persist scan result
    aws_service.save_analysis_record(result.model_dump())

    return result

@router.post("/report")
def submit_community_report(report_data: CommunityReportCreate):
    """Submit a suspicious domain or keyword report with student consent to update the risk engine."""
    if not report_data.domain or not report_data.domain.strip():
        raise HTTPException(status_code=400, detail="Domain or keyword cannot be blank.")
    
    saved_report = aws_service.add_community_report(report_data.model_dump())
    return {
        "status": "success",
        "message": "Report submitted and community threat keywords synced to Risk Engine.",
        "report": saved_report
    }

@router.get("/community/{domain}", response_model=CommunityDomainSummary)
def get_community_domain_intelligence(domain: str):
    """Retrieve verified community warning signals for a given domain, keyword, or organization."""
    reports = aws_service.search_community_reports(domain)
    count = len(reports)
    if count >= 3:
        risk_indicator = "HIGH_COMMUNITY_ALERTS"
    elif count >= 1:
        risk_indicator = "COMMUNITY_FLAGGED_KEYWORD"
    else:
        risk_indicator = "NO_COMMUNITY_REPORTS"

    return CommunityDomainSummary(
        domain=domain,
        total_reports=count,
        risk_indicator=risk_indicator,
        matched_keyword=domain if count > 0 else None,
        reports=[CommunityReportItem(**r) for r in reports]
    )

@router.get("/history")
def get_recent_scans(limit: int = Query(10, ge=1, le=50)):
    """Fetch recent scans for the dashboard history."""
    return aws_service.get_analysis_history(limit=limit)

@router.get("/upload/presigned", response_model=PresignedUrlResponse)
def get_presigned_upload_url(ext: str = Query("png", pattern="^(png|jpe?g|webp)$")):
    """Get presigned S3 URL for browser-to-S3 direct screenshot upload."""
    return aws_service.create_presigned_upload_url(file_ext=ext)
