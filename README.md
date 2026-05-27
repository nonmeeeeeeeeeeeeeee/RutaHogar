# ScoreLeads MVP

Minimal MVP for pre-evaluating real-estate leads (React frontend + FastAPI backend).

Run backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Or use Makefile targets from the repo root:

```bash
make run
```

> Nota: este `Makefile` usa comandos bash; si estás en Windows, úsalo desde WSL o Git Bash.

Open the Vite URL (http://localhost:5173) and test the form.
