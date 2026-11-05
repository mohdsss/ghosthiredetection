import os
import zipfile
from pathlib import Path

# Paths & exclusions
ROOT_DIR = Path(__file__).resolve().parent
OUTPUT_ZIP = ROOT_DIR / "GhostHire_Clean_Codebase.zip"

# Exact directories to exclude entirely
EXCLUDE_DIRS = {
    ".git",
    "node_modules",
    "venv",
    ".venv",
    "env",
    "__pycache__",
    ".pytest_cache",
    ".idea",
    ".vscode",
}

# Exact file extensions or names to exclude
EXCLUDE_EXTENSIONS = {
    ".pdf",   # Exclude all PDFs (architecture, documentation, hackathon brief)
    ".pptx",  # Exclude all presentations
    ".pyc",
    ".zip",   # Don't include other or existing zip files
}

EXCLUDE_FILES = {
    ".env",               # Exclude live secrets / credentials
    ".DS_Store",
    "Thumbs.db",
    "GhostHire_Pitch_Deck.pptx",
    "GhostHire_System_Architecture.pdf",
    "GhostHire_Project_Documentation.pdf",
    "GhostHire_Hackathon_Project_Brief.pdf",
}

def should_exclude(path: Path) -> bool:
    # Check directory parts
    for part in path.parts:
        if part in EXCLUDE_DIRS:
            return True
            
    # Check filename
    if path.name in EXCLUDE_FILES:
        return True
    if path.name.startswith(".env") and path.name != ".env.example":
        return True
        
    # Check extension
    if path.suffix.lower() in EXCLUDE_EXTENSIONS:
        return True
        
    return False

def create_zip():
    print(f"Creating clean archive at: {OUTPUT_ZIP.name}")
    included_files = 0
    excluded_files = 0
    
    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(ROOT_DIR):
            # Modify dirs in-place to avoid traversing into excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            
            for file in files:
                file_path = Path(root) / file
                
                # Never include the zip file being written
                if file_path == OUTPUT_ZIP:
                    continue
                    
                if should_exclude(file_path):
                    excluded_files += 1
                    # print(f"Excluded: {file_path.relative_to(ROOT_DIR)}")
                    continue
                    
                arcname = file_path.relative_to(ROOT_DIR)
                zipf.write(file_path, arcname)
                included_files += 1
                
    zip_size_mb = OUTPUT_ZIP.stat().st_size / (1024 * 1024)
    print("\n--- ZIP CREATION COMPLETE ---")
    print(f"File Path: {OUTPUT_ZIP}")
    print(f"Total Files Included: {included_files}")
    print(f"Total Files Excluded: {excluded_files}")
    print(f"Archive Size: {zip_size_mb:.2f} MB")

if __name__ == "__main__":
    create_zip()
