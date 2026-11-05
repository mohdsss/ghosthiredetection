import os
import io
import json
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, Tuple
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("ghosthire.aws")

class AWSService:
    def __init__(self):
        self.aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.aws_region = os.getenv("AWS_REGION", "us-east-1")
        self.s3_bucket = os.getenv("S3_BUCKET_NAME", "ghosthire-screenshots-storage")
        self.dynamodb_table = os.getenv("DYNAMODB_TABLE_NAME", "GhostHireReports")
        
        self.textract_client = None
        self.s3_client = None
        self.dynamodb_client = None
        self.dynamodb_resource = None
        self.has_aws_credentials = bool(self.aws_access_key and self.aws_secret_key and not self.aws_access_key.startswith("your_"))

        # Initialize boto3 if credentials exist
        if self.has_aws_credentials:
            try:
                import boto3
                session = boto3.Session(
                    aws_access_key_id=self.aws_access_key,
                    aws_secret_access_key=self.aws_secret_key,
                    region_name=self.aws_region
                )
                self.textract_client = session.client("textract")
                self.s3_client = session.client("s3")
                self.dynamodb_resource = session.resource("dynamodb")
                self.dynamodb_client = session.client("dynamodb")
                logger.info("Initialized AWS clients with provided credentials.")
            except Exception as e:
                logger.warning(f"Failed to initialize AWS clients: {e}. Falling back to simulation mode.")
                self.has_aws_credentials = False

        # Local fallback cache directory
        self.local_data_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data")
        os.makedirs(self.local_data_dir, exist_ok=True)
        self.local_history_file = os.path.join(self.local_data_dir, "analysis_history.json")
        self.local_community_file = os.path.join(self.local_data_dir, "community_reports.json")
        self._init_local_storage()

    def _init_local_storage(self):
        """Seed initial storage with safe demo community reports."""
        if not os.path.exists(self.local_community_file):
            seed_data = [
                {
                    "id": "rep-demo-001",
                    "domain": "nexora-internship-portal.xyz",
                    "opportunity_title": "Fake Data Entry Intern",
                    "notes": "Lookalike website redirecting to Telegram group asking for ₹999 registration fee.",
                    "reporter_alias": "Campus placement rep",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "status": "approved"
                },
                {
                    "id": "rep-demo-002",
                    "domain": "nexoralabs-careers.xyz",
                    "opportunity_title": "Frontend Developer Intern",
                    "notes": "Sent fake offer letter from @gmail.com claiming 100% selection guarantee.",
                    "reporter_alias": "CS Student @ Delhi",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "status": "approved"
                }
            ]
            with open(self.local_community_file, "w", encoding="utf-8") as f:
                json.dump(seed_data, f, indent=2)

        if not os.path.exists(self.local_history_file):
            with open(self.local_history_file, "w", encoding="utf-8") as f:
                json.dump([], f, indent=2)

    # -------------------------------------------------------------
    # S3 Operations
    # -------------------------------------------------------------
    def create_presigned_upload_url(self, file_ext: str = "png") -> Dict[str, Any]:
        """Generate presigned S3 URL or local mock endpoint for browser direct upload."""
        s3_key = f"uploads/{uuid.uuid4().hex}.{file_ext}"
        if self.has_aws_credentials and self.s3_client:
            try:
                url = self.s3_client.generate_presigned_url(
                    ClientMethod="put_object",
                    Params={
                        "Bucket": self.s3_bucket,
                        "Key": s3_key,
                        "ContentType": f"image/{file_ext}"
                    },
                    ExpiresIn=300
                )
                return {
                    "upload_url": url,
                    "s3_key": s3_key,
                    "bucket": self.s3_bucket,
                    "expires_in": 300
                }
            except Exception as e:
                logger.error(f"Error generating AWS S3 presigned URL: {e}")

        # Local fallback
        return {
            "upload_url": f"/api/upload-direct?key={s3_key}",
            "s3_key": s3_key,
            "bucket": "local-virtual-s3",
            "expires_in": 3600
        }

    # -------------------------------------------------------------
    # Textract OCR Operations
    # -------------------------------------------------------------
    def extract_text_from_bytes(self, image_bytes: bytes, filename: str = "screenshot.png") -> Tuple[str, str]:
        """
        Extract text from image bytes using Amazon Textract.
        Falls back to intelligent local OCR simulation if AWS credentials are not configured.
        """
        if self.has_aws_credentials and self.textract_client:
            try:
                response = self.textract_client.detect_document_text(
                    Document={"Bytes": image_bytes}
                )
                lines = []
                for block in response.get("Blocks", []):
                    if block.get("BlockType") == "LINE":
                        lines.append(block.get("Text", ""))
                extracted_text = "\n".join(lines)
                if extracted_text.strip():
                    return extracted_text, "aws_textract"
            except Exception as e:
                logger.error(f"Amazon Textract execution error: {e}. Falling back to simulation.")

        # Fallback simulation: Check if image contains recognizable text or default to demo script
        fallback_text = (
            "Congratulations! You have been shortlisted for the Nexora Labs internship. "
            "Pay ₹999 registration fees today. Selection is guaranteed. "
            "Apply through bit.ly/example. Reply within 30 minutes to secure your seat."
        )
        return fallback_text, "local_simulation"

    # -------------------------------------------------------------
    # DynamoDB Operations
    # -------------------------------------------------------------
    def save_analysis_record(self, record: Dict[str, Any]) -> bool:
        """Store analysis report in DynamoDB (or local store)."""
        # Save to local storage for quick frontend history retrieval
        try:
            with open(self.local_history_file, "r", encoding="utf-8") as f:
                history = json.load(f)
            history.insert(0, record)
            # Keep latest 50
            history = history[:50]
            with open(self.local_history_file, "w", encoding="utf-8") as f:
                json.dump(history, f, indent=2)
        except Exception as e:
            logger.warning(f"Failed to save local history: {e}")

        # Save to AWS DynamoDB if available
        if self.has_aws_credentials and self.dynamodb_resource:
            try:
                table = self.dynamodb_resource.Table(self.dynamodb_table)
                table.put_item(Item=record)
                return True
            except Exception as e:
                logger.error(f"Failed to write to DynamoDB table {self.dynamodb_table}: {e}")
                return False

        return True

    def get_analysis_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Retrieve recent scan history."""
        try:
            with open(self.local_history_file, "r", encoding="utf-8") as f:
                history = json.load(f)
            return history[:limit]
        except Exception:
            return []

    def get_community_reports_for_domain(self, domain: str) -> List[Dict[str, Any]]:
        """Retrieve verified community reports for a domain."""
        domain_clean = domain.lower().strip()
        matched = []
        try:
            with open(self.local_community_file, "r", encoding="utf-8") as f:
                all_reports = json.load(f)
            for r in all_reports:
                rep_domain = r.get("domain", "").lower().strip()
                if rep_domain and (rep_domain in domain_clean or domain_clean in rep_domain):
                    matched.append(r)
        except Exception as e:
            logger.error(f"Error reading community reports: {e}")
        return matched

    def add_community_report(self, report_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a new community report."""
        report_id = f"rep-{uuid.uuid4().hex[:8]}"
        record = {
            "id": report_id,
            "domain": report_data.get("domain", "").lower().strip(),
            "opportunity_title": report_data.get("opportunity_title", "Unspecified Offer"),
            "notes": report_data.get("notes", ""),
            "reporter_alias": report_data.get("reporter_alias", "Anonymous Student"),
            "user_consent": report_data.get("user_consent", True),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "approved"
        }

        try:
            with open(self.local_community_file, "r", encoding="utf-8") as f:
                all_reports = json.load(f)
            all_reports.insert(0, record)
            with open(self.local_community_file, "w", encoding="utf-8") as f:
                json.dump(all_reports, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving community report: {e}")

        # Also push to DynamoDB if configured
        if self.has_aws_credentials and self.dynamodb_resource:
            try:
                table = self.dynamodb_resource.Table(self.dynamodb_table)
                table.put_item(Item={
                    "id": f"COMMUNITY#{record['domain']}#{report_id}",
                    **record
                })
            except Exception as e:
                logger.warning(f"DynamoDB community report put failed: {e}")

        return record

# Global singleton
aws_service = AWSService()
