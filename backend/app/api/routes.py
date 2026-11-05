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

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_opportunity(payload: AnalyzeRequest):
    """Analyze opportunity from pasted text or S3 key reference."""
    text_to_analyze = payload.text
    source = "pasted_text"

    if not text_to_analyze or not text_to_analyze.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty for analysis.")

    # Check for domain matches in community database
    urls = risk_engine.extract_urls(text_to_analyze)
    domains = risk_engine.extract_domains(urls)
    community_flags = 0
    for domain in domains:
        reports = aws_service.get_community_reports_for_domain(domain)
        community_flags += len(reports)

    # Execute explainable risk analysis
    result = risk_engine.analyze(
        text=text_to_analyze,
        source=source,
        community_matches=community_flags
    )

    # Persist scan in DynamoDB / local history
    aws_service.save_analysis_record(result.model_dump())

    return result

@router.post("/analyze/upload", response_model=AnalyzeResponse)
async def analyze_uploaded_screenshot(file: UploadFile = File(...)):
    """Accept screenshot image upload, perform Textract OCR, and run risk engine."""
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Perform OCR via AWS Textract or fallback simulation
    extracted_text, ocr_source = aws_service.extract_text_from_bytes(contents, file.filename or "screenshot.png")

    # Check for community flags on any extracted domains
    urls = risk_engine.extract_urls(extracted_text)
    domains = risk_engine.extract_domains(urls)
    community_flags = 0
    for domain in domains:
        reports = aws_service.get_community_reports_for_domain(domain)
        community_flags += len(reports)

    # Analyze extracted text
    result = risk_engine.analyze(
        text=extracted_text,
        source=f"screenshot_{ocr_source}",
        community_matches=community_flags
    )

    # Persist scan result
    aws_service.save_analysis_record(result.model_dump())

    return result

@router.post("/report")
def submit_community_report(report_data: CommunityReportCreate):
    """Submit a suspicious domain or pattern report with student consent."""
    if not report_data.domain or not report_data.domain.strip():
        raise HTTPException(status_code=400, detail="Domain cannot be blank.")
    
    saved_report = aws_service.add_community_report(report_data.model_dump())
    return {
        "status": "success",
        "message": "Report submitted for community protection.",
        "report": saved_report
    }

@router.get("/community/{domain}", response_model=CommunityDomainSummary)
def get_community_domain_intelligence(domain: str):
    """Retrieve verified community warning signals for a given domain."""
    reports = aws_service.get_community_reports_for_domain(domain)
    count = len(reports)
    if count >= 3:
        risk_indicator = "HIGH_COMMUNITY_ALERTS"
    elif count >= 1:
        risk_indicator = "KNOWN_SUSPICIOUS_PATTERN"
    else:
        risk_indicator = "NO_COMMUNITY_REPORTS"

    return CommunityDomainSummary(
        domain=domain,
        total_reports=count,
        risk_indicator=risk_indicator,
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
