"""
PDF generation for meal plans.
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import json
from datetime import datetime 


def create_meal_plan_pdf(plan_data: dict, output_path: str):
    """Create a professional PDF document for a meal plan."""
    
    # Create document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Get styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        alignment=TA_CENTER,
        spaceAfter=30
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=14,
        alignment=TA_CENTER,
        textColor=colors.gray,
        spaceAfter=20
    )
    
    section_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=16,
        spaceBefore=20,
        spaceAfter=10
    )
    
    normal_style = styles['Normal']
    
    # Build story
    story = []
    
    # Title
    story.append(Paragraph("AI Nutritionist - Personalized Meal Plan", title_style))
    story.append(Paragraph(f"Generated for: {plan_data['client_name']}", subtitle_style))
    story.append(Spacer(1, 20))
    
    # Client info table
    client_info = [
        ["Goal:", plan_data['goal']],
        ["Target Calories:", str(plan_data['target_calories'])],
        ["Diet Type:", plan_data['diet_type']],
        ["Generated:", plan_data.get('created_at', datetime.now().strftime('%Y-%m-%d'))]
    ]
    
    client_table = Table(client_info, colWidths=[2*inch, 3*inch])
    client_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(client_table)
    story.append(Spacer(1, 30))
    
    # Meal plan by day
    story.append(Paragraph("7-Day Meal Plan", section_style))
    
    meal_plan = plan_data.get('meal_plan', {})
    days = meal_plan.get('days', [])
    
    for day in days:
        story.append(Paragraph(f"<b>{day.get('day', 'Day')}</b> - Total Calories: {day.get('total_calories', 0)}", normal_style))
        
        meals = day.get('meals', [])
        meal_data = [["Time", "Meal", "Description", "Calories"]]
        
        for meal in meals:
            meal_data.append([
                meal.get('time', ''),
                meal.get('meal', ''),
                meal.get('description', '')[:50] + '...' if len(meal.get('description', '')) > 50 else meal.get('description', ''),
                str(meal.get('calories', 0))
            ])
        
        meal_table = Table(meal_data, colWidths=[0.8*inch, 1*inch, 3*inch, 0.8*inch])
        meal_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#4CAF50")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
        ]))
        
        story.append(meal_table)
        story.append(Spacer(1, 15))
    
    # Grocery list
    if plan_data.get('grocery_list'):
        story.append(Paragraph("Grocery Shopping List", section_style))
        
        grocery_items = list(plan_data['grocery_list'].items())
        grocery_data = [["Item", "Quantity"]]
        
        for item, quantity in grocery_items[:20]:  # Limit to 20 items
            grocery_data.append([item, str(quantity)])
        
        grocery_table = Table(grocery_data, colWidths=[4*inch, 1*inch])
        grocery_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#2196F3")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ]))
        
        story.append(grocery_table)
    
    # Footer note
    story.append(Spacer(1, 30))
    story.append(Paragraph(
        "<i>Note: This meal plan is generated by AI and should be used as a guideline. "
        "Consult with a healthcare professional for medical advice.</i>",
        ParagraphStyle('Footer', parent=styles['Italic'], fontSize=9, textColor=colors.grey)
    ))
    
    # Build PDF
    doc.build(story)