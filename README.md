# AI Nutritionist Capstone Project

An AI-powered nutrition assistant that generates personalized 7-day meal plans
based on user goals, calorie targets, diet preferences, and macro distribution.
The project is built as a full-stack application with an AI-driven backend.

---

## 🌐 Project Overview  🌐
This capstone project combines:
- A **FastAPI backend** for business logic and APIs
- A **React frontend** for user interaction
- **Large Language Models (LLMs)** for intelligent meal plan generation
- A modular architecture designed for scalability and experimentation

---

## 🛠️ Tech Stack
- **Backend:** Python, FastAPI
- **Frontend:** React
- **AI / LLMs:** TinyLLaMA / GPT-based models
- **Database:** SQL-based (via SQLAlchemy)
- **Docs & Guidelines:** Capstone project standards

---

## 📁 Folder Structure


## Folder Structure
ai-nutritionist-capstone/
│
├── backend/
│   ├── main.py
│   │
│   ├── routers/
│   │     ├── auth.py
│   │     ├── mealplan.py
│   │     └── pdf.py
│   │
│   ├── core/
│   │     ├── security.py
│   │     └── config.py
│   │
│   ├── database/
│   │     ├── database.py   
│   │     ├── models.py       
│   │     └── schemas.py      
│   │
│   ├── ai/
│   │     └── generator.py
│   │
│   └── requirements.txt
│
├── frontend/
│
├── ai-model/
│   ├── dataset/
│   ├── training/
│   └── inference/
│
└── docs/







---

## 📌 Notes
- Meal plans are generated dynamically using LLM prompts
- Outputs are structured as valid JSON for easy parsing
- The project follows clean code and modular design principles

