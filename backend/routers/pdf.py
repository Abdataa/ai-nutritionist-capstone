"""
PDF export router.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
import tempfile
import os

from core.security import get_current_user
from database.models import User

router = APIRouter(
    prefix="/pdf",
    tags=["pdf"]
)

@router.get("/test")
async def test_pdf(current_user: User = Depends(get_current_user)):
    """Test PDF generation."""
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        filename = tmp.name
    
    # Create PDF
    c = canvas.Canvas(filename, pagesize=letter)
    c.drawString(100, 750, f"AI Nutritionist - Test PDF")
    c.drawString(100, 730, f"Generated for: {current_user.name}")
    c.drawString(100, 710, f"User ID: {current_user.id}")
    c.drawString(100, 690, "This is a test PDF document.")
    c.save()
    
    return FileResponse(
        filename,
        media_type="application/pdf",
        filename="test_document.pdf"
    )