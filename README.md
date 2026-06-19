# ScoreLeads

Software for pre-evaluating real-estate leads (React frontend + FastAPI backend).
The current project focus is moving toward a final product version for year-end,
prioritizing data consistency, correct persistence, traceability, and real user
flows.

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
nvm use
npm install
npm run dev
```

The frontend requires Node.js 20.19+ or 22.12+ because the current Vite
toolchain does not support older Node versions. Node 22 is recommended; use
`nvm use` from the repository root to pick the version declared in `.nvmrc`.

Or use Makefile targets from the repo root:

```bash
make run
```

> Nota: este `Makefile` usa comandos bash; si estás en Windows, úsalo desde WSL o Git Bash.

Open the Vite URL (http://localhost:5173) and test the form.
