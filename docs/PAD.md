# Problem Analysis Document (PAD)


# FOR MORE YOU CAN VISIT THE GOOGLE DOCS 
# https://docs.google.com/document/d/1ZQcsXIWnio0MNYkpKjZ9Z4IqNVluhW-MjYmeqt-ofFI/edit?tab=t.0


## LLM-Integrated FastAPI Service for Personalized Nutritional Recommendations for Fitness Coaches  
**(AI-Nutritionist)**

---

## 1. Executive Summary
The **AI-Nutritionist** project proposes the development of a cutting-edge, three-tier web application designed to revolutionize personalized nutritional planning within the fitness coaching industry. The core innovation lies in integrating a **Large Language Model (TinyLLaMA/GPT-OSS)** with a mathematically precise **Constraint Satisfaction Problem (CSP) Solver**.

This hybrid approach ensures meal plans are:
- Textually coherent and user-friendly
- Numerically accurate within **±5% macro deviation**

The system is built using:
- **FastAPI** backend
- **React** frontend

It addresses scalability, accuracy, and efficiency challenges in manual nutrition planning and serves as a strong **capstone-level CSE portfolio project**.

---

## 2. Problem Statement and Justification

### 2.1 Background and Context
The demand for personalized fitness coaching is increasing rapidly. Coaches must manually create nutrition plans considering:
- Calories and macronutrients
- Dietary restrictions
- Allergies
- Cost constraints

This process is time-consuming, error-prone, and not scalable.

### 2.2 Problem Definition
There is no efficient, automated system that combines:
- **Hard nutritional constraints**
- **Human-readable meal plan generation**

**Research Question:**  
> How can we automate and personalize nutritional plan generation for fitness coaches using an AI-driven system that ensures numerical accuracy, linguistic flexibility, and usability?

### 2.3 Significance and Justification
- **Operational Efficiency:** Reduces planning time from hours to minutes
- **Accuracy:** Ensures macro compliance (±5%)
- **Technical Depth:** Demonstrates AI, microservices, and security expertise
- **Market Relevance:** Targets non-medical fitness nutrition

### 2.4 Expected Outcomes
1. Functional web-based MVP
2. Validated LLM + CSP core engine
3. Scalable, well-documented microservice architecture

---

## 3. Project Objectives (SMART)

### Specific (S)
Implement a `/generate_plan` endpoint supporting at least four diet types.

### Measurable (M)
- Macro accuracy: ±5%
- Success rate: ≥95%
- API response time: <2 seconds

### Achievable (A)
Uses proven tools: FastAPI, React, TinyLLaMA, CSP solvers.

### Relevant (R)
Directly addresses automated nutrition planning needs.

### Time-bound (T)
Completed within **16 weeks**.

### MVP Objectives

| ID  | Objective | Metric | Deadline |
|----|----------|--------|---------|
| O.1 | Core plan generation | ±5% macro deviation | Week 10 |
| O.2 | Multi-diet support | 95% success rate | Week 14 |
| O.3 | Deployment & usability | <2s response | Week 16 |

---

## 4. Methodology and Technical Approach

### 4.1 System Architecture Overview
A **decoupled microservice architecture** with five components:

1. **Frontend (React)**
2. **Backend API (FastAPI)**
3. **Database (SQLite/Firebase)**
4. **LLM Service (TinyLLaMA/GPT-OSS)**
5. **PDF Module (ReportLab)**

### 4.2 UML Component Diagram
- Frontend → Backend API
- Backend API → Database, LLM Service, PDF Module
- Clean separation of concerns

### 4.3 Concept Synthesis Plan

#### 4.3.1 LLM-Driven Constraint-Based Generation
- CSP solver ensures numeric accuracy
- LLM converts structured data to readable meal plans

#### 4.3.2 Asynchronous High-Performance API
- FastAPI `async def`
- Non-blocking LLM calls
- Supports high concurrency

#### 4.3.3 Security Implementation
- JWT authentication
- OWASP input validation
- Encrypted data storage

---

## 5. Team Roles and Work Distribution

| Role | Name | Responsibility |
|----|----|----|
| Project Manager | Abebe Kumbi | Planning, risk, communication |
| Lead Architect | Afomiya Legesse | System architecture |
| AI Engineer | Abdi Dawud | LLM fine-tuning |
| Data Specialist | Meron Tilahun | Nutritional datasets |
| Backend Dev | Abdullah Omar | FastAPI logic |
| DB Engineer | Meti Jemal | Database design |
| Frontend Dev | Olyad Negero | React UI |
| UI/UX Designer | Mihret Abebe | UX & PDF |
| Security Engineer | Abeselom Tsegazeab | JWT & security |
| QA & Docs Lead | Mohammed Kedir | Testing & documentation |

---

## 6. Timeline and Milestones (16 Weeks)

1. **Planning & Setup** (W1–2)
2. **Database & ML Prototype** (W3–6)
3. **Core API Development** (W7–10)
4. **Frontend & Multi-Diet Support** (W11–14)
5. **Testing & Deployment** (W15–16)

---

## 7. Risk Analysis & Mitigation

### Technical Risks
- LLM accuracy → mitigated using CSP validation
- API latency → async architecture

### Data & Security Risks
- JWT authentication
- Role-based access
- Encrypted storage

### Scope Risks
- Controlled MVP scope
- Formal change requests

---

**End of Document**
