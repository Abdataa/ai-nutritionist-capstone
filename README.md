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


## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows (PowerShell): `.\venv\Scripts\Activate.ps1`
   - Windows (CMD): `venv\Scripts\activate`
   - Unix/macOS: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Create a `.env` file based on `.env.example` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
6. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   Coution: The --reload option is only for development purposes. It consumes more resources and can be less stable, so it should not be used in a production environment.
   
   The backend will be available at `http://localhost:8000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

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

