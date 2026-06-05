# Frontend — ScoreLeads MVP

React 18 + Vite 5 + axios. Sin react-router (ruteo por estado en App.jsx). Sin librería de UI.

## Estructura

```
frontend/src/
├── components/
│   ├── ScoreForm.jsx      # Formulario principal, POST /score, validación completa
│   ├── Result.jsx         # Muestra score, clasificación, riesgos
│   ├── AuthPanel.jsx      # Login/registro con Supabase auth
│   ├── DataConsent.jsx    # Consentimiento datos personales
│   ├── Onboarding.jsx     # Captura objetivo inmobiliario inicial
│   ├── ProfilePage.jsx    # Perfil + historial de evaluaciones
│   ├── FinancialTracking.jsx, MonthlyPlan.jsx, Goals...
│   ├── Recommendations.jsx, ObjectiveReview.jsx
│   ├── Navbar.jsx, AdminPanel.jsx, DashboardLeads.jsx
├── services/
│   ├── auth.js            # getStoredAuth, signIn, signUp, signOut, roles
│   ├── profileService.js  # CRUD perfiles + consent
│   ├── evaluationService.js  # CRUD evaluaciones
│   ├── goalsService.js    # CRUD metas
│   ├── financialTracking.js  # buildFinancialTracking()
│   ├── recommendationService.js
│   └── monthlyPlanService.js
├── utils/supabase.ts      # Cliente Supabase (null si faltan env vars)
├── App.jsx                # Entry point + state machine de páginas
├── main.jsx               # createRoot(document.getElementById("root"))
├── styles.css             # Único stylesheet
└── constants/comunas.js   # Lista de comunas
```

## Flujo principal

1. AuthPanel → login/registro (Supabase auth)
2. Onboarding → captura comuna + plazo
3. DataConsent → acepta consentimiento
4. ScoreForm → completa datos → POST /score
5. Result + Recommendations → muestra resultado
6. ProfilePage → historial persistido en Supabase

## Supabase

- Cliente condicional en `utils/supabase.ts`: si faltan env vars, `supabase = null` y todo funciona con localStorage.
- `profileService.js` usa Supabase si disponible, con fallback a `localStorage`.
- `auth.js` usa Supabase auth (email/password), fallback a `localStorage`.
- Roles: `usuario`, `ejecutivo`, `admin` (en `auth.js`).

## ScoreForm (componente clave)

- 6 campos del co-deudor aparecen condicionalmente al marcar "Complementar renta".
- Validación local antes de enviar.
- Payload incluye todos los campos al backend.
- Consumo: `axios.post(VITE_API_URL + "/score", payload)`.
- Consentimiento se obtiene de `profileService.getLocalConsent()`.
