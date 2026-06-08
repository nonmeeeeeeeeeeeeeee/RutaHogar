import React, { useEffect, useMemo, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import AuthPanel from "./components/AuthPanel";
import DashboardLeads from "./components/DashboardLeads";
import DataConsent from "./components/DataConsent";
import FinancialTracking from "./components/FinancialTracking";
import MonthlyPlan from "./components/MonthlyPlan";
import Navbar from "./components/Navbar";
import NotificationToast from "./components/NotificationToast";
import ObjectiveReview from "./components/ObjectiveReview";
import Onboarding from "./components/Onboarding";
import ProfilePage from "./components/ProfilePage";
import Recommendations from "./components/Recommendations";
import Result from "./components/Result";
import ScoreForm from "./components/ScoreForm";
import { useLeads } from "./hooks/useLeads";
import { acceptEvaluationPlan, createEvaluation, deleteEvaluation as deleteStoredEvaluation, getEvaluations } from "./services/evaluationService";
import { createGoal, getGoals, updateGoalProgress, updateGoalStatus } from "./services/goalsService";
import { getStoredAuth, roles, signOut, updateStoredProfile } from "./services/auth";
import { buildFinancialTracking } from "./services/financialTracking";
import { getConsent, saveConsent, updateProfileOnboarding, isSupabaseDataConfigured } from "./services/profileService";

const ONBOARDING_KEY = "scoreleads_onboarding";

const plazoLabels = {
  "0_3_meses": "0 a 3 meses",
  "3_6_meses": "3 a 6 meses",
  "6_12_meses": "6 a 12 meses",
  "mas_12_meses": "Mas de 12 meses",
};

const formatScore = (score) => (Number.isFinite(Number(score)) ? Math.round(Number(score)) : null);

const futureModules = [
  {
    title: "Objetivo inmobiliario",
    status: "Disponible",
    description: "Captura objetivo de compra, comuna deseada, tipo de propiedad y plazo estimado para contextualizar la preevaluacion.",
  },
  {
    title: "Pre-evaluacion financiera",
    status: "Disponible",
    description: "Formulario guiado, score preliminar, clasificacion y recomendaciones basicas para el usuario.",
  },
  {
    title: "Recomendaciones inteligentes",
    status: "Disponible",
    description: "Entrega recomendaciones orientativas basadas en la ultima preevaluacion, sin reemplazar una evaluacion bancaria formal.",
  },
  {
    title: "Priorizacion comercial",
    status: "Futuro",
    description: "Vista para equipos comerciales con leads ordenados por viabilidad y principales factores de riesgo.",
  },
  {
    title: "Seguimiento financiero",
    status: "Futuro",
    description: "Plan de preparacion para leads aun no aptos, con metas de ahorro, deuda y continuidad laboral.",
  },
  {
    title: "Integraciones",
    status: "Futuro",
    description: "Conexiones con CRM, bancos, documentos y fuentes de datos cuando la integracion este disponible.",
  },
];

export default function App() {
  const storedAuth = useMemo(() => getStoredAuth(), []);
  const [auth, setAuth] = useState(storedAuth);
  const [page, setPage] = useState(() => (storedAuth.profile?.role === roles.user ? "onboarding" : "home"));
  const [result, setResult] = useState(null);
  const [resultSaved, setResultSaved] = useState(null);
  const [dataError, setDataError] = useState("");
  const [trackingGoals, setTrackingGoals] = useState([]);
  const [activeGoal, setActiveGoal] = useState(null);
  const [onboarding, setOnboarding] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ONBOARDING_KEY)) || {};
    } catch {
      return {};
    }
  });
  const [consentGranted, setConsentGranted] = useState(() => {
    const local = getConsent(null);
    return local?.granted === true;
  });

  const profile = auth.profile;
  const isUUID = (id) => {
    if (!id || typeof id !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  };
  const userId = isUUID(profile?.id) ? profile.id : isUUID(profile?.user_id) ? profile.user_id : null;
  const {
    evaluations,
    setEvaluations,
    newHighLeadsCount,
    counts,
    error: leadsError,
    markLeadsSeen,
    dismissToastLocally,
    removeEvaluation,
    prependEvaluation,
  } = useLeads({ userId, profile });
  const visibleError = dataError || leadsError;

  const userEvaluations = profile ? evaluations : [];
  const currentEvaluation = userEvaluations[0] || null;
  const userOnboarding = userId ? profile?.onboarding_data || onboarding[userId] || onboarding[profile?.email] || currentEvaluation?.onboarding || null : null;
  const currentScoreNumber = currentEvaluation ? formatScore(currentEvaluation.result?.score) : null;
  const currentScore =
    currentEvaluation && currentScoreNumber !== null
      ? { score: currentScoreNumber, classification: currentEvaluation.result.classification }
      : null;

  useEffect(() => {
    let active = true;


    async function loadEvaluations() {
      if (!userId) {
        setEvaluations([]);
        return;
      }

      try {
        setDataError("");
        const storedEvaluations = await getEvaluations(userId, profile?.role);
        if (active) setEvaluations(storedEvaluations);
      } catch (err) {
        console.error(err);
        if (active) setDataError("No pudimos cargar tu historial. Revisa que las tablas de Supabase esten creadas y vuelve a intentar.");
      }
    }

    loadEvaluations();
    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    let active = true;

    async function loadGoals() {
      if (!userId || !currentEvaluation || page !== "tracking") {
        setTrackingGoals([]);
        return;
      }

      try {
        const storedGoals = await getGoals(userId, currentEvaluation.id);
        if (storedGoals.length > 0) {
          if (active) setTrackingGoals(storedGoals);
          return;
        }

        const tracking = buildFinancialTracking(currentEvaluation);
        const createdGoals = await Promise.all(
          (tracking?.goals || []).map((goal) =>
            createGoal(userId, currentEvaluation.id, {
              title: goal.title,
              description: goal.description,
              status: "pendiente",
            }),
          ),
        );
        if (active) setTrackingGoals(createdGoals);
      } catch (err) {
        console.error(err);
        if (active) setDataError("No pudimos cargar tus metas de seguimiento. Revisa la configuracion de Supabase.");
      }
    }

    loadGoals();
    return () => {
      active = false;
    };
  }, [userId, currentEvaluation?.id, page]);

  useEffect(() => {
    if (page === "leads" && profile?.role === roles.sales) markLeadsSeen();
  }, [page]);

  const startEvaluation = () => {
    setResult(null);
    setResultSaved(null);
    setPage(userOnboarding ? "evaluate" : "onboarding");
  };

  const handleAuth = (nextAuth) => {
    setAuth(nextAuth);
    setResult(null);
    setResultSaved(null);
    setDataError("");
    setTrackingGoals([]);
    setPage(nextAuth.profile?.role === roles.user ? "onboarding" : "home");
  };

  const saveOnboardingAnswers = async (answers) => {
    const onboardingUserId = userId || profile?.email || "local-user";
    const next = {
      ...onboarding,
      [onboardingUserId]: {
        ...answers,
        updated_at: new Date().toISOString(),
      },
    };
    setOnboarding(next);
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(next));

    if (userId) {
      const savedProfile = await updateProfileOnboarding(userId, answers);
      const nextProfile = updateStoredProfile({
        ...profile,
        ...savedProfile,
        email: profile?.email,
        full_name: savedProfile?.full_name || profile?.full_name,
        role: savedProfile?.role || profile?.role,
        onboarding_data: answers,
      });
      setAuth((prev) => ({ ...prev, profile: nextProfile }));
    }
  };

  const handleOnboardingComplete = async (answers) => {
    try {
      setDataError("");
      await saveOnboardingAnswers(answers);
    } catch (err) {
      console.error(err);
      setDataError("No se pudieron guardar tus respuestas preliminares. Puedes intentarlo nuevamente desde Perfil.");
    }
    setResult(null);
    if (consentGranted) {
      setPage("evaluate");
    } else {
      setPage("dataconsent");
    }
  };

  const handleProfileOnboardingSave = async (answers) => {
    setDataError("");
    await saveOnboardingAnswers(answers);
  };

  const handleDataConsent = async (consentData) => {
    if (userId) {
      await saveConsent(userId, consentData);
    }
    setConsentGranted(true);
    setPage("evaluate");
  };

  const handleResult = async (scoreResult, input) => {
    const resultSnapshot = {
       score: scoreResult.score,
       classification: scoreResult.classification,
       risks: [...(scoreResult.risks || [])],
       recommendations: [...(scoreResult.recommendations || [])],
       ai_explanation: scoreResult.ai_explanation,
       improvement_plan: [...(scoreResult.improvement_plan || [])],
       positive_indicators: [...(scoreResult.positive_indicators || [])],
       executive_summary: scoreResult.executive_summary || "",
       commercial_guidance: scoreResult.commercial_guidance || "",
     };

    const financialInput = {
      ingreso_mensual: input.ingreso_mensual,
      deuda_mensual: input.deuda_mensual,
      edad: input.edad,
      ahorro_disponible: input.ahorro_disponible,
      property_value: input.property_value,
      property_value_unit: input.property_value_unit,
      property_value_uf: input.property_value_uf,
      property_value_clp: input.property_value_clp,
      plazo_credito_hipotecario: input.plazo_credito_hipotecario,
      dividendo_estimado: input.dividendo_estimado,
      comuna_objetivo: input.comuna_objetivo,
      tipo_contrato: input.tipo_contrato,
      continuidad_laboral: input.continuidad_laboral,
      morosidad_actual: input.morosidad_actual,
      monto_morosidad: input.monto_morosidad,
      antiguedad_morosidad: input.antiguedad_morosidad,
      complemento_renta: input.complemento_renta,
      ingreso_mensual_complementario: input.ingreso_mensual_complementario,
      deuda_mensual_complementario: input.deuda_mensual_complementario,
      tipo_contrato_complementario: input.tipo_contrato_complementario,
      continuidad_laboral_complementario: input.continuidad_laboral_complementario,
      morosidad_complementario: input.morosidad_complementario,
      relacion_complementario: input.relacion_complementario,
    };

    try {
      setResult(resultSnapshot);
      setResultSaved(null);
      
      // Si el score es Bajo, redirigir a educación financiera (recommendations)
      // De lo contrario, ir al home para ver el resultado detallado
      setPage(resultSnapshot.classification === "Alto" ? "home" : "recommendations");

      setDataError("");
      // Corrección: se usaban variables 'rt' y 't' no definidas.
      if (isSupabaseDataConfigured && !auth.session) {
        throw new Error("No hay una sesión activa. Por favor, inicia sesión nuevamente.");
      }

      // Solo enviamos el userId si es un UUID válido, de lo contrario pasamos null para que el servicio use el usuario autenticado
      const savedEvaluation = await createEvaluation(isUUID(userId) ? userId : null, {
        email: profile?.email || "sin-email",
        onboarding: userOnboarding ? { ...userOnboarding } : null,
        input: financialInput,
        result: resultSnapshot,
      });

      setResultSaved(true);
      prependEvaluation(savedEvaluation);
    } catch (err) {
      console.error(err);
      setResultSaved(false);
      setDataError("El score se calculo, pero no pudimos guardar la preevaluacion. Revisa que tu sesion siga activa y que Supabase permita insertar evaluaciones.");
    }
  };

  const deleteEvaluation = async (evaluationId) => {
    try {
      setDataError("");
      await deleteStoredEvaluation(evaluationId, userId || profile?.email || "local-user");
      removeEvaluation(evaluationId);
      setTrackingGoals([]);
    } catch (err) {
      console.error(err);
      setDataError("No se pudo eliminar la evaluacion seleccionada.");
    }
  };

  const handleGoalStatusChange = async (goalId, status) => {
    try {
      setDataError("");
      const updatedGoal = await updateGoalStatus(goalId, userId || profile?.email || "local-user", status);
      if (updatedGoal) {
        setTrackingGoals((prev) => prev.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)));
      }
    } catch (err) {
      console.error(err);
      setDataError("No se pudo actualizar el estado de la meta.");
    }
  };

  const handleAcceptPlan = async () => {
    if (!currentEvaluation) return;

    try {
      setDataError("");
      const updatedEvaluation = await acceptEvaluationPlan(currentEvaluation.id, userId || profile?.email || "local-user");
      if (updatedEvaluation) {
        setEvaluations((prev) => prev.map((item) => (item.id === updatedEvaluation.id ? updatedEvaluation : item)));
      }
      setDataError("Plan activado. Podras volver a precalificar despues de avanzar en tus metas.");
    } catch (err) {
      console.error(err);
      setDataError("No pudimos activar el plan. Intentalo nuevamente.");
    }
  };

  const handleOpenGoalPlan = (goal) => {
    setActiveGoal(goal);
    setPage(goal.title === "Revisar objetivo inmobiliario" ? "objective-review" : "monthly-plan");
  };

  const handleSaveGoalProgress = async (goalId, progressData) => {
    try {
      setDataError("");
      const updatedGoal = await updateGoalProgress(goalId, userId || profile?.email || "local-user", progressData);
      if (updatedGoal) {
        setTrackingGoals((prev) => prev.map((goal) => (goal.id === updatedGoal.id ? { ...goal, ...updatedGoal } : goal)));
        setActiveGoal((prev) => (prev?.id === updatedGoal.id ? { ...prev, ...updatedGoal } : prev));
      }
    } catch (err) {
      console.error(err);
      setDataError("No pudimos guardar el avance mensual.");
    }
  };

  const handleLogout = async () => {
    await signOut();
    setAuth({ session: null, profile: null });
    setEvaluations([]);
    setTrackingGoals([]);
    setPage("home");
    setResult(null);
    setResultSaved(null);
  };

  const handleNotificationClick = () => setPage("leads");

  const handleDismissNotification = () => markLeadsSeen();

  if (!profile) {
    return (
      <div className="app-shell auth-shell">
        <AuthPanel onAuth={handleAuth} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar
        profile={profile}
        page={page}
        currentScore={currentScore}
        onNavigate={(nextPage) => (nextPage === "evaluate" ? startEvaluation() : setPage(nextPage))}
        onLogout={handleLogout}
      />
      {visibleError && <div className="error-message">{visibleError}</div>}

      {/* Notificación para ejecutivos */}
      <NotificationToast 
        count={newHighLeadsCount} 
        onClick={handleNotificationClick}
        onClose={handleDismissNotification}
      />

      {page === "onboarding" && profile.role === roles.user ? (
        <Onboarding initialData={userOnboarding} onComplete={handleOnboardingComplete} />
      ) : page === "dataconsent" && profile.role === roles.user ? (
        <DataConsent
          profile={profile}
          readonly={consentGranted}
          onAccept={handleDataConsent}
          onBack={() => setPage(consentGranted ? "evaluate" : "onboarding")}
        />
      ) : page === "home" ? (
        <>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">Solucion inmobiliaria</span>
              <h1>ScoreLeads</h1>
              {result && (
                <div className={resultSaved === false ? "error-message" : "success-message"}>
                  {resultSaved === false
                    ? `Score calculado: ${formatScore(result.score)} / ${result.classification}. No se pudo guardar en historial.`
                    : resultSaved === true
                      ? `Precalificacion guardada: ${formatScore(result.score)} / ${result.classification}. Puedes revisar el detalle en Perfil.`
                      : `Score calculado: ${formatScore(result.score)} / ${result.classification}. Guardando historial...`}
                </div>
              )}
              <p>
                Plataforma para preevaluar leads inmobiliarios antes de iniciar una evaluacion bancaria formal.
                El foco del producto es entregar una pre-evaluacion financiera clara, rapida y orientativa.
              </p>
              <p className="hero-note">Sin documentos, sin claves bancarias y sin aprobacion bancaria.</p>
            </div>

            <aside className="score-preview" aria-label="Resumen de ScoreLeads">
              <span className="preview-label">Flujo activo</span>
              <strong>Formulario - Score - Recomendaciones</strong>
              <p>Resultado orientativo: Alto, Medio o Bajo.</p>
            </aside>
          </section>

          {result && <Result data={result} />}

          <section className="section-block">
            <div className="section-heading">
              <span className="eyebrow">Mapa del producto</span>
              <h2>Implementaciones planificadas</h2>
              <p>
                Estas tarjetas muestran la vision completa de ScoreLeads. Actualmente estan habilitados el
                objetivo inmobiliario y la pre-evaluacion financiera.
              </p>
            </div>

            <div className="module-grid">
              {futureModules.map((module) => (
                <article className={`module-card ${module.status === "Disponible" ? "is-active" : ""}`} key={module.title}>
                  <div>
                    <span className="module-status">{module.status}</span>
                    <h3>{module.title}</h3>
                  </div>
                  <p>{module.description}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : page === "evaluate" ? (
        <section className="evaluation-panel">
          <button className="secondary-button" onClick={() => setPage("home")}>Volver al inicio</button>
          <div className="section-heading compact">
            <span className="eyebrow">Disponible</span>
            <h1>Pre-evaluacion financiera</h1>
            <p>Completa todos los campos para calcular un score orientativo. El resultado no equivale a aprobacion bancaria.</p>
          </div>
          {userOnboarding && (
            <div className="context-summary">
              <strong>Contexto inicial</strong>
              <span>{userOnboarding.comuna_interes} · {plazoLabels[userOnboarding.plazo_compra] || userOnboarding.plazo_compra}</span>
              <button className="secondary-button compact-button" type="button" onClick={() => setPage("onboarding")}>
                Editar contexto
              </button>
            </div>
          )}
          <ScoreForm
              targetCommune={userOnboarding?.comuna_interes}
              objective={userOnboarding?.objetivo_principal}
              birthDate={profile?.birth_date}
              onResult={handleResult}
              onViewConsent={() => setPage("dataconsent")}
            />
        </section>
      ) : page === "profile" && profile.role === roles.user ? (
        <ProfilePage
          profile={profile}
          onboarding={userOnboarding}
          evaluations={userEvaluations}
          onSaveOnboarding={handleProfileOnboardingSave}
          onDeleteEvaluation={deleteEvaluation}
        />
      ) : page === "tracking" && profile.role === roles.user ? (
        <FinancialTracking
          evaluation={currentEvaluation}
          goals={trackingGoals}
          onAcceptPlan={handleAcceptPlan}
          onGoalStatusChange={handleGoalStatusChange}
          onOpenGoalPlan={handleOpenGoalPlan}
          onStartEvaluation={startEvaluation}
        />
      ) : page === "monthly-plan" && profile.role === roles.user ? (
        <MonthlyPlan
          evaluation={currentEvaluation}
          goal={activeGoal}
          onBack={() => setPage("tracking")}
          onSaveProgress={handleSaveGoalProgress}
        />
      ) : page === "objective-review" && profile.role === roles.user ? (
        <ObjectiveReview evaluation={currentEvaluation} onBack={() => setPage("tracking")} />
      ) : page === "recommendations" && profile.role === roles.user ? (
        <Recommendations evaluation={currentEvaluation} onStartEvaluation={startEvaluation} />
      ) : page === "leads" && profile.role === roles.sales ? (
        <DashboardLeads evaluations={evaluations} />
      ) : page === "admin" && profile.role === roles.admin ? (
        <AdminPanel evaluations={evaluations} profile={profile} />
      ) : (
        <section className="section-block">
          <div className="section-heading">
            <span className="eyebrow">Vista no disponible</span>
            <h1>Revisa tu navegacion</h1>
            <p>Tu rol actual no tiene acceso a esta vista.</p>
          </div>
        </section>
      )}
    </div>
  );
}
