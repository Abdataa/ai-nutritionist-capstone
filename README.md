# ai-nutritionist-capstone

## Project Setup
- Python backend (FastAPI)
- Frontend (React)
- LLM fine-tuning (TinyLLaMA / GPT-OSS)
- Documentation following capstone guide

## Folder Structure
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