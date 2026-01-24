# ai-nutritionist-capstone

## Project Setup
- Python backend (FastAPI)
- Frontend (React)
- LLM fine-tuning (TinyLLaMA / GPT-OSS)
- Documentation following capstone guide

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


