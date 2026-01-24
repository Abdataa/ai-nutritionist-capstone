from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
import os

def generate_meal_plan_pdf(meal_plan_data: dict, file_path: str) -> str:
    """
    Generate a real PDF version of the meal plan using reportlab.
    """
    doc = SimpleDocTemplate(file_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.hexColor('#10b981'),  # Emerald-500
        spaceAfter=12
    )
    story.append(Paragraph(f"AI Nutritionist - 7-Day Meal Plan", title_style))
    story.append(Spacer(1, 12))

    # User Info
    story.append(Paragraph(f"<b>Client:</b> {meal_plan_data.get('user_name', 'User')}", styles['Normal']))
    story.append(Paragraph(f"<b>Goal:</b> {meal_plan_data.get('goal', 'Not set')}", styles['Normal']))
    story.append(Paragraph(f"<b>Diet Type:</b> {meal_plan_data.get('diet_type', 'Balanced')}", styles['Normal']))
    story.append(Paragraph(f"<b>Daily Calorie Target:</b> {meal_plan_data.get('daily_calories', 0)} cal/day", styles['Normal']))
    story.append(Spacer(1, 12))

    # Macros Table
    macros = meal_plan_data.get('macros', {})
    macro_data = [
        ['Nutrient', 'Amount (g)', '% of Calories'],
        ['Protein', f"{macros.get('protein', 0)}g", f"{Math_round(macros.get('protein', 0) * 400 / meal_plan_data.get('daily_calories', 1))}%"],
        ['Carbohydrates', f"{macros.get('carbs', 0)}g", f"{Math_round(macros.get('carbs', 0) * 400 / meal_plan_data.get('daily_calories', 1))}%"],
        ['Fats', f"{macros.get('fats', 0)}g", f"{Math_round(macros.get('fats', 0) * 900 / meal_plan_data.get('daily_calories', 1))}%"]
    ]
    
    # Helper for rounding in python
    def Math_round(val):
        return round(val)

    # Re-calculate with local helper
    macro_data = [
        ['Nutrient', 'Amount (g)', '% of Calories'],
        ['Protein', f"{macros.get('protein', 0)}g", f"{Math_round(macros.get('protein', 0) * 400 / meal_plan_data.get('daily_calories', 1))}%"],
        ['Carbohydrates', f"{macros.get('carbs', 0)}g", f"{Math_round(macros.get('carbs', 0) * 400 / meal_plan_data.get('daily_calories', 1))}%"],
        ['Fats', f"{macros.get('fats', 0)}g", f"{Math_round(macros.get('fats', 0) * 900 / meal_plan_data.get('daily_calories', 1))}%"]
    ]

    t = Table(macro_data, colWidths=[150, 100, 100])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.hexColor('#10b981')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ]))
    story.append(t)
    story.append(Spacer(1, 24))

    # Daily Meals
    history = meal_plan_data.get('history', [])
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    for hist in history:
        day_idx = hist.get('day_number', 0) - 1
        if day_idx < 0: continue # Skip day 0 (full plan summary)
        
        day_name = days[day_idx]
        story.append(Paragraph(f"{day_name}", styles['Heading2']))
        
        meals = hist.get('meals', {}).get('meals', [])
        if not meals:
            story.append(Paragraph("No meals recorded for this day.", styles['Italic']))
            continue
            
        meal_table_data = [['Meal', 'Name', 'Calories', 'P/C/F']]
        for m in meals:
            pcf = f"{m.get('protein', 0)}/{m.get('carbs', 0)}/{m.get('fats', 0)}"
            meal_table_data.append([
                m.get('meal', 'Meal'),
                m.get('name', 'N/A'),
                f"{m.get('calories', 0)}",
                pcf
            ])
            
        mt = Table(meal_table_data, colWidths=[80, 220, 60, 80])
        mt.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.hexColor('#f1f5f9')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(mt)
        story.append(Spacer(1, 12))

    # Build PDF
    doc.build(story)
    return file_path
