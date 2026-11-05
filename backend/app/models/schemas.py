from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone

class Finding(BaseModel):
    signal: str = Field(..., description="Stable machine-readable identifier, e.g. UPFRONT_PAYMENT")
    points: int = Field(..., description="Contribution to illustrative risk score")
    evidence: str = Field(..., description="The exact text snippet, domain, or pattern observed")
    recommendation: str = Field(..., description="Safe and practical next step for the applicant")

class AnalyzeRequest(BaseModel):
    text: Optional[str] = Field(None, description="Pasted opportunity text")
    s3_key: Optional[str] = Field(None, description="S3 object key if pre-uploaded")
    filename: Optional[str] = Field(None, description="Original filename")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class AnalyzeResponse(BaseModel):
    id: str = Field(..., description="Unique analysis scan ID")
    risk_score: int = Field(..., ge=0, le=100, description="Composite illustrative score 0-100")
    risk_level: str = Field(..., description="LOW, MEDIUM, or HIGH")
    findings: List[Finding] = Field(default_factory=list)
    recommendation: str = Field(..., description="Primary recommendation banner")
    extracted_text: Optional[str] = Field(None, description="Text parsed or extracted via OCR")
    detected_domains: List[str] = Field(default_factory=list)
    community_flags: int = Field(0, description="Number of matching community reports")
    source: str = Field("text_input", description="Input source: direct_text or aws_textract")
    analyzed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CommunityReportCreate(BaseModel):
    domain: str = Field(..., description="Target domain, organization name, or scam keyword")
    keywords: Optional[List[str]] = Field(default_factory=list, description="Specific threat keywords to flag")
    opportunity_title: Optional[str] = Field(None, description="Job or internship title")
    notes: str = Field(..., description="Student experience or suspicious reason")
    user_consent: bool = Field(True, description="Explicit user consent to share anonymized pattern")
    evidence_text: Optional[str] = Field(None, description="Excerpt of the suspicious message")
    reporter_alias: Optional[str] = Field("Anonymous Student", description="Optional display alias")

class CommunityReportItem(BaseModel):
    id: str
    domain: str
    keywords: List[str] = Field(default_factory=list)
    opportunity_title: Optional[str]
    notes: str
    reporter_alias: str
    created_at: str
    status: str = "approved"

class CommunityDomainSummary(BaseModel):
    domain: str
    total_reports: int
    risk_indicator: str
    matched_keyword: Optional[str] = None
    reports: List[CommunityReportItem] = Field(default_factory=list)

class PresignedUrlResponse(BaseModel):
    upload_url: str
    s3_key: str
    bucket: str
    expires_in: int
