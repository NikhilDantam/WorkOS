# WorkOS — Outcome Intelligence Platform

A comprehensive outcome intelligence platform connecting training records to real-world livelihoods. WorkOS unifies trainee tracking, placement verification, 30/90/180-day retention analysis, wage progression, and domain-grounded AI intelligence into a single evidence-backed system.

## 🚀 Features

- **Executive Outcome Dashboard**: High-level KPIs covering placement rates, verification health, retention milestones, and median wage progression.
- **Trainee Directory & Lifecycle**: In-depth trainee profiles tracking credentials, placement status, salary, employer, and longitudinal retention checks.
- **Domain-Restricted AI Copilot**: Grounded AI assistant querying live outcome data to assist program managers and analysts.
- **Employer Network Analytics**: Placement partner breakdown, hire distribution, and employer verification status.
- **Evidence-Backed Verification**: Audit trails for wage slips, employment confirmations, and retention reports.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: FastAPI, Uvicorn, Pydantic, HTTPX, Python 3.10+
- **Database & Services**: Supabase (Postgres, Row-Level Security, Auth)

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+) and `pnpm`
- Python 3.10+ with `venv`

### 1. Clone & Setup Frontend

```bash
# Install frontend dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials / AI provider keys (optional)
```

### 3. Run Locally

**Start Backend:**
```bash
# From the project root
./backend/venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

**Start Frontend:**
```bash
# From the project root
pnpm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000) and proxies `/api` calls directly to the FastAPI server on port 8000.

---

## 🔒 Security & Privacy

- Environment variables containing API keys, database credentials, or service keys are excluded via `.gitignore`.
- Always configure `.env` locally using `.env.example` as a template.
