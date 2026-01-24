#ai-model/inference/pdf_export.py
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import json

def export_meal_plan_pdf(meal_plan, filename="meal_plan.pdf"):
    """
    meal_plan: dict or list
    """
    if not isinstance(meal_plan, str):
        text = json.dumps(meal_plan, indent=2)
    else:
        text = meal_plan

    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    margin = 40
    y = height - margin

    for line in text.splitlines():
        c.drawString(margin, y, line)
        y -= 14
        if y < margin:
            c.showPage()
            y = height - margin

    c.save()
    print(f"PDF exported: {filename}")
