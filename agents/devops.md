# DevOps — ScoreLeads MVP

## Local setup

### Backend (Python 3.10+)
```powershell
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\uvicorn app.main:app --reload --port 8000
```

### Frontend (Node 18+)
```powershell
cd frontend
npm install
npm run dev
```

### Makefile (WSL / Git Bash)
```bash
make run           # instala deps + corre ambos servidores
make run-backend   # solo backend
make run-frontend  # solo frontend
```

Makefile usa comandos bash: no funciona en PowerShell nativo.

## Variables de entorno

`frontend/.env` (obligatorio):
```
VITE_SUPABASE_URL=https://adgnxtjkqedtvkwcizzn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Y8HX31lHegX7d37_uIngrQ_Osu7p3Cj
VITE_API_URL=http://127.0.0.1:8000
```

`frontend/.env.example` tiene template comentado.

## Deploy (Vercel)

Dos configs de Vercel:

1. **Root `vercel.json`** — build del frontend + rewrite `/score` → `/api/score`:
   ```json
   { "buildCommand": "cd frontend && npm install && npm run build",
     "outputDirectory": "frontend/dist",
     "rewrites": [{ "source": "/score", "destination": "/api/score" },
                  { "source": "/(.*)", "destination": "/index.html" }] }
   ```

2. **`backend/vercel.json`** — serverless Python para el endpoint `/api/score`:
   ```json
   { "builds": [{ "src": "api/index.py", "use": "@vercel/python" }],
     "routes": [{ "src": "/(.*)", "dest": "api/index.py" }] }
   ```

Entrypoints:
- `api/score.py` — shim que importa `app.main` (sys.path al backend)
- `backend/api/index.py` — shim alternativo

## Dependencias

- Backend: `fastapi`, `uvicorn[standard]`, `pydantic` (3 paquetes).
- Frontend: `react`, `react-dom`, `axios`, `@supabase/supabase-js`, `vite` (dev).
- Root: `@supabase/supabase-js` (no se usa directamente, instalado por frontend).

## Database (Supabase)

Schema en `supabase/schema.sql`. Ejecutar en SQL Editor de Supabase.
Tablas: `profiles`, `evaluations`, `improvement_goals`.
Row Level Security activo con políticas por `auth.uid()`.

## Notas

- No hay Docker, no hay CI/CD configurado.
- No hay tests configurados (ni pytest, ni vitest).
- No hay linting ni typecheck.
- El backend no requiere base de datos local (todo vía Supabase HTTP).
