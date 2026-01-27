🥗 AI Nutritionist – Capstone Project

An AI-powered nutrition assistant that generates personalized 7-day meal plans based on user goals, calorie targets, dietary preferences, and macronutrient distribution. This project is designed as a production-ready full-stack application with an AI-driven backend, emphasizing clean architecture, scalability, and real-world usability.


---

🌟 Why This Project Stands Out

🎯 Highly Personalized meal planning powered by AI

🤖 LLM-driven intelligence with structured JSON outputs

🧱 Modular, scalable architecture suitable for future expansion

🌐 End-to-end full-stack implementation (Backend + Frontend + AI)

📊 Designed to meet capstone project standards and industry best practices



---

🌐 Project Overview

This capstone project seamlessly integrates modern web technologies with artificial intelligence:

FastAPI Backend – Handles business logic, authentication, and APIs

React Frontend – Provides an intuitive and responsive user experience

LLMs (TinyLLaMA / GPT-based models) – Generate intelligent, goal-aware meal plans

SQL Database (SQLAlchemy) – Stores users, preferences, and generated plans

Clean Architecture – Encourages maintainability and experimentation



---

🛠️ Tech Stack

Backend

Python

FastAPI

SQLAlchemy

JWT-based Authentication


Frontend

React

Modern JavaScript (ES6+)


AI / Machine Learning

TinyLLaMA / GPT-based models

Prompt-engineered meal generation

JSON-structured AI outputs


Database

SQL-based relational database



---

📁 Project Structure

ai-nutritionist-capstone/
│
├── backend/                       # FastAPI Backend
│   ├── main.py                    # Entry point
│   ├── .env                       #Secrets (API keys,DBURL)
│   ├── requirements.txt           # Python dependencies
│   ├── routers/                   # API Endpoints
│   │   ├── auth.py                # Login/Signup logic
│   │   ├── mealplan.py            # CRUD for meal plans
│   │   └── pdf.py                 # Export endpoints
│   ├── schemas/                   # Pydantic models (Request/Response)
│   │   ├── mealplan.py
│   │   └── user.py
│   ├── core/                      # Core logic
│   │   ├── security.py            # JWT and Hashing
│   │   └── config.py              # Settings management
│   ├── database/                  # SQLAlchemy/DB setup
│   │   ├── database.py            # Connection setup
│   │   ├── models.py              # DB Tables
│   │   └── schemas.py             # Internal DB schemas
│   └── ai/                        # AI Logic
│       ├── generator.py           # LLM Interaction logic
│       ├── prompt_template.py     # System & User prompts
│       ├── validator.py           # AI output verification
│       ├── pdf_generator.py       # Report generation
│       ├── evaluation.py          # Quality metrics
│       ├── fallback.py            # Logic for AI failures
│       └── AI_README.md
│
├── frontend/                      # React (Vite) Frontend
│   ├── public/                    # Static assets (logos, favicon)
│   ├── src/
│   │   ├── App.jsx                # The merged version we created
│   │   ├── main.jsx               # React entry point
│   │   ├── index.css              # Tailwind directives
│   │   ├── components/            # UI Building blocks
│   │   │   ├── ui/                # Shadcn components (Button, Card, etc.)
│   │   │   └── ProtectedRoute.jsx # Auth guard component
│   │   ├── pages/                 # Full Page views
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Dashboard.jsx      # Coach Dashboard
│   │   │   ├── UserDashboard.jsx  # Client Dashboard
│   │   │   ├── CreateMealPlan.jsx
│   │   │   ├── MealPlanView.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Sidebar.jsx        # Navigation component
│   │   ├── services/              # API Call logic
│   │   │   ├── api.js             # Axios instance setup
│   │   │   ├── auth.service.js    # Login/Register methods
│   │   │   └── meal.service.js    # Meal plan fetching/creation
│   │   ├── providers/             # Context Providers
│   │   │   └── ThemeProvider.jsx  # Light/Dark mode logic
│   │   └── hooks/                 # Custom React hooks
│   │       └── useAuth.js         # To access user state easily
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── ai-model/                      # Model Training & Data
│   ├── fine-tuned/                # Saved weights/checkpoints
│   ├── dataset/                   # CSV/JSON training data
│   ├── training/                  # Notebooks or scripts (train.py)
│   └── inference/                 # Local testing scripts
│
└── docs/                          # Documentation
    ├── architecture.md
    └── setup_guide.md

Getting Started

Prerequisites

Python 3.8+

Node.js 16+

npm or yarn



---

⚙️ Backend Setup

1. Navigate to the backend directory:

cd backend


2. Create a virtual environment:

python -m venv venv


3. Activate the virtual environment:

Windows (PowerShell): ./venv/Scripts/Activate.ps1

Windows (CMD): venv\\Scripts\\activate

macOS / Linux: source venv/bin/activate



4. Install dependencies:

pip install -r requirements.txt


5. Create environment variables:

cp .env.example .env

Update the .env file with your credentials and API keys.


6. Start the FastAPI server:

uvicorn main:app --reload

⚠️ Note: The --reload flag is intended for development only. Avoid using it in production as it increases resource usage and may reduce stability.

✅ Backend available at: http://localhost:8000




---

🎨 Frontend Setup

1. Navigate to the frontend directory:

cd frontend


2. Install dependencies:

npm install


3. Start the development server:

npm run dev

✅ Frontend available at: http://localhost:5173




---

🧠 AI Meal Plan Generation

Meal plans are generated dynamically using carefully engineered LLM prompts

Each plan respects:

User goals (e.g., weight loss, muscle gain)

Daily calorie targets

Macro distribution (protein, carbs, fats)

Dietary preferences and restrictions


AI responses are returned as valid, structured JSON, making them easy to store, validate, and display



---

📌 Key Highlights

✅ Clean, modular, and extensible codebase

✅ Real-world full-stack + AI integration

✅ Easily expandable (tracking, recommendations, mobile apps)

✅ Ideal for academic capstone evaluation or portfolio showcase



---

📄 License & Usage

This project is intended for educational and capstone purposes. You are free to extend, refactor, and experiment with the architecture.


---

💡 Built to demonstrate how AI, backend engineering, and frontend design come together to solve real-world problems in nutrition and health.
