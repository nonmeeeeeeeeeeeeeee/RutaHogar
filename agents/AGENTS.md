# ScoreLeads MVP

Mini MVP web para preevaluación financiera de leads inmobiliarios.
Usuario ingresa datos → score 0-100 → clasificación Alto/Medio/Bajo + explicación + recomendaciones.

## Stack real

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5 + axios |
| Backend | FastAPI + Pydantic v2 |
| DB/Auth | Supabase (PostgreSQL, auth, RLS, RPC) |
| Deploy | Vercel (frontend SPA + serverless Python) |
| Scoring | Reglas puras en `backend/app/scoring.py` (sin ML, sin APIs externas) |

## Estructura del proyecto

```
ScoreLeads/
├── api/                        # Vercel serverless entry shim (/api/score → backend)
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app, POST /score, ScoreRequest model
│   │   └── scoring.py          # calculate_score() + generate_ai_explanation() + generate_improvement_plan()
│   ├── api/index.py            # Vercel serverless entry (from backend dir)
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   ├── components/         # 12+ componentes (ScoreForm, Result, AuthPanel, etc.)
│   │   ├── services/           # auth, profileService, evaluationService, goalsService, etc.
│   │   ├── utils/supabase.ts   # Cliente Supabase singleton
│   │   └── App.jsx             # Ruteo interno por estado (no react-router)
│   └── .env                    # VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_API_URL
├── supabase/schema.sql         # DDL completo con RLS policies
├── vercel.json                 # Root: build frontend + rewrite /score → /api/score
└── Makefile                    # WSL/Git Bash: make run
```

## Comandos exactos

```powershell
# Backend (Windows PowerShell)
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev

# Makefile (WSL o Git Bash, no PowerShell nativo)
make run
```

Frontend abierto en `http://localhost:5173`, backend en `http://localhost:8000`.

## Variables de entorno (`frontend/.env`)

```
VITE_SUPABASE_URL=https://adgnxtjkqedtvkwcizzn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Y8HX31lHegX7d37_uIngrQ_Osu7p3Cj
VITE_API_URL=http://127.0.0.1:8000
```

## Puntos clave para agentes

- **No hay opencode.json** ni `CLAUDE.md` — los `agents/*.md` son la única fuente de instrucciones locales.
- **No hay react-router**: el ruteo es por estado (`page` en App.jsx).
- **No hay tests** — no hay pytest, vitest, eslint, ni scripts de lint/typecheck.
- **Supabase es condicional**: si faltan env vars, `supabase` es `null` y todo funciona con localStorage como fallback.
- **El consentimiento** es obligatorio (valida backend en `consentimiento: true`). Se otorga en Onboarding → DataConsent, se guarda localmente con `getLocalConsent()`.
- **Scoring**: `calculate_score()` en `scoring.py`, base 50, clamped [0,100]. Clasificación: ≥70 Alto, ≥40 Medio, <40 Bajo.
- **Complemento de renta** ahora evalúa perfil completo del co-deudor (morosidad -20, deuda alta -15, tarjetas ≥5 -15, etc.).
- **Vercel deploy**: root `vercel.json` construye frontend y rewritea `/score` → `/api/score`. Backend tiene su propio `backend/vercel.json` para serverless Python.
- **Backend serverless**: `api/score.py` y `backend/api/index.py` son shims que importan `app.main` ajustando sys.path.
