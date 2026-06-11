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
import { acceptEvaluationPlan, createEvaluation, deleteEvaluation as deleteStoredEvaluation, getEvaluations } from "./services/evaluationService";
import { useLeads } from "./hooks/useLeads";
import { normalizeDisplayList, normalizeDisplayText } from "./utils/text";
import { createGoal, getGoals, updateGoalProgress, updateGoalStatus } from "./services/goalsService";
import { getStoredAuth, roles, signOut, updateStoredProfile } from "./services/auth";
import { buildFinancialTracking } from "./services/financialTracking";
import {
  getConsent,
  saveConsent,
  updateProfileOnboarding,
  isSupabaseDataConfigured,
  isUUID,
} from "./services/profileService";
import { formatScore } from "./utils/helpers";
import { plazoLabels } from "./constants";

const ONBOARDING_KEY = "scoreleads_onboarding";

function getChannel() {
  try {
    const params = new URLSearchParams(window.location.search);
    const validChannels = ['web', 'chatbot', 'whatsapp', 'vendedor'];
    const channel = params.get('channel');
    if (channel && validChannels.includes(channel)) return channel;
  } catch {}
  return 'web';
}

const isUuidValue = (id) =>
  typeof id === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getStoredOnboardingForProfile = (profile) => {
  if (!profile) return null;

  try {
    const stored = JSON.parse(localStorage.getItem(ONBOARDING_KEY)) || {};
    return stored[profile.id] || stored[profile.user_id] || stored[profile.email] || null;
  } catch {
    return null;
  }
};

const isRemoteProfile = (profile) =>
  isSupabaseDataConfigured && (isUuidValue(profile?.id) || isUuidValue(profile?.user_id));

const getOnboardingData = (profile) => {
  if (!profile) return null;
  if (isRemoteProfile(profile)) return profile.onboarding_data || null;
  return profile.onboarding_data || getStoredOnboardingForProfile(profile) || null;
};

const hasCompletedOnboarding = (data) => {
  if (!data || typeof data !== "object") return false;

  return Boolean(
    data.objetivo_principal &&
      data.tipo_propiedad &&
      data.comuna_interes &&
      data.plazo_compra,
  );
};

const getInitialPageForProfile = (profile) => {
  if (!profile) return "home";
  if (profile.role !== roles.user) return "home";
  return hasCompletedOnboarding(getOnboardingData(profile)) ? "home" : "onboarding";
};

const futureModules = [
  {
    title: "Objetivo inmobiliario",
    status: "Disponible",
    description:
      "Captura objetivo de compra, comuna deseada, tipo de propiedad y plazo estimado para contextualizar la preevaluación.",
  },
  {
    title: "Pre-evaluación financiera",
    status: "Disponible",
    description:
      "Formulario guiado, score preliminar, clasificación y recomendaciones básicas para el usuario.",
  },
  {
    title: "Recomendaciones inteligentes",
    status: "Disponible",
    description:
      "Entrega recomendaciones orientativas basadas en la última preevaluación, sin reemplazar una evaluación bancaria formal.",
  },
  {
    title: "Priorización comercial",
    status: "Futuro",
    description:
      "Vista para equipos comerciales con leads ordenados por viabilidad y principales factores de riesgo.",
  },
  {
    title: "Seguimiento financiero",
    status: "Futuro",
    description:
      "Plan de preparación para leads aún no aptos, con metas de ahorro, deuda y continuidad laboral.",
  },
  {
    title: "Integraciones",
    status: "Futuro",
    description:
      "Conexiones con CRM, bancos, documentos y fuentes de datos cuando la integración esté disponible.",
  },
];

export default function App() {
  const storedAuth = useMemo(() => getStoredAuth(), []);
  const [auth, setAuth] = useState(storedAuth);
  const [page, setPage] = useState(() => getInitialPageForProfile(storedAuth.profile));
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
  const [consentGranted, setConsentGranted] = useState(false);

  const profile = auth.profile;
  const userId = isUUID(profile?.id)
    ? profile.id
    : isUUID(profile?.user_id)
      ? profile.user_id
      : null;
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
  const userOnboarding = isRemoteProfile(profile)
    ? profile?.onboarding_data || null
    : profile
      ? profile.onboarding_data ||
        onboarding[userId] ||
        onboarding[profile?.id] ||
        onboarding[profile?.email] ||
        null
      : null;
  const onboardingCompleted = hasCompletedOnboarding(userOnboarding);
  const currentScoreNumber = currentEvaluation
    ? formatScore(currentEvaluation.result?.score)
    : null;
  const currentScore =
    currentEvaluation && currentScoreNumber !== null
      ? {
          score: currentScoreNumber,
          classification: currentEvaluation.result.classification,
        }
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
        if (active)
          setDataError(
            "No pudimos cargar tu historial. Revisa que las tablas de Supabase esten creadas y vuelve a intentar.",
          );
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
        if (active)
          setDataError(
            "No pudimos cargar tus metas de seguimiento. Revisa la configuración de Supabase.",
          );
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

  useEffect(() => {
    let active = true;

    async function loadConsent() {
      if (!userId) {
        if (active) setConsentGranted(false);
        return;
      }

      try {
        const consent = await getConsent(userId);
        if (active) setConsentGranted(consent?.granted === true);
      } catch {
        if (active) setConsentGranted(false);
      }
    }

    loadConsent();

    return () => {
      active = false;
    };
  }, [userId]);

  const startEvaluation = () => {
    setResult(null);
    setResultSaved(null);
    setPage(onboardingCompleted ? "evaluate" : "onboarding");
  };

  const handleAuth = (nextAuth) => {
    setAuth(nextAuth);
    setResult(null);
    setResultSaved(null);
    setDataError("");
    setTrackingGoals([]);
    setConsentGranted(false);
    setPage(getInitialPageForProfile(nextAuth.profile));
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
      setDataError(
        "No se pudieron guardar tus respuestas preliminares. Puedes intentarlo nuevamente desde Perfil.",
      );
    }
    setResult(null);
    setPage("home");
  };

  const handleProfileOnboardingSave = async (answers) => {
    setDataError("");
    await saveOnboardingAnswers(answers);
  };

  const handleProfileUpdate = (updatedProfile) => {
    const nextProfile = updateStoredProfile(updatedProfile);
    setAuth((prev) => ({ ...prev, profile: nextProfile }));
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
      risks: normalizeDisplayList(scoreResult.risks),
      recommendations: normalizeDisplayList(scoreResult.recommendations),
      ai_explanation: normalizeDisplayText(scoreResult.ai_explanation),
      improvement_plan: normalizeDisplayList(scoreResult.improvement_plan),
      positive_indicators: normalizeDisplayList(scoreResult.positive_indicators),
      executive_summary: normalizeDisplayText(scoreResult.executive_summary),
      commercial_guidance: normalizeDisplayText(scoreResult.commercial_guidance),
      algorithm_version: scoreResult.algorithm_version,
      component_scores: scoreResult.component_scores,
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
      continuidad_laboral_complementario:
        input.continuidad_laboral_complementario,
      morosidad_complementario: input.morosidad_complementario,
      relacion_complementario: input.relacion_complementario,
      declara_patrimonio: input.declara_patrimonio,
      valor_vehiculos: input.valor_vehiculos,
      valor_inmuebles: input.valor_inmuebles,
      patrimonio_unit: input.patrimonio_unit,
      uf_value_clp: input.uf_value_clp,
    };

    try {
      setResult(resultSnapshot);
      setResultSaved(null);

      // Si el score es Bajo, redirigir a educación financiera (recommendations)
      // De lo contrario, ir al home para ver el resultado detallado
      setPage(
        resultSnapshot.classification === "Alto" ? "home" : "recommendations",
      );

      setDataError("");
      // Corrección: se usaban variables 'rt' y 't' no definidas.
      if (isSupabaseDataConfigured && !auth.session) {
        throw new Error(
          "No hay una sesión activa. Por favor, inicia sesión nuevamente.",
        );
      }

      // Solo enviamos el userId si es un UUID válido, de lo contrario pasamos null para que el servicio use el usuario autenticado
      const savedEvaluation = await createEvaluation(isUUID(userId) ? userId : null, {
        email: profile?.email || "sin-email",
        onboarding: userOnboarding ? { ...userOnboarding } : null,
        input: financialInput,
        result: resultSnapshot,
        channel: getChannel(),
      });

      setResultSaved(true);
      setEvaluations((prev) => {
        const entry = { ...savedEvaluation, created_at: savedEvaluation.created_at || new Date().toISOString() };
        return [entry, ...prev.filter((item) => item.id !== entry.id)].slice(0, 25);
      });
      prependEvaluation(savedEvaluation);
    } catch (err) {
      console.error(err);
      setResultSaved(false);
      setDataError(
        "El score se calculó, pero no pudimos guardar la preevaluación. Revisa que tu sesión siga activa y que Supabase permita insertar evaluaciones.",
      );
    }
  };

  const deleteEvaluation = async (evaluationId) => {
    try {
      setDataError("");
      await deleteStoredEvaluation(
        evaluationId,
        userId || profile?.email || "local-user",
      );
      removeEvaluation(evaluationId);
      setTrackingGoals([]);
    } catch (err) {
      console.error(err);
      setDataError("No se pudo eliminar la evaluación seleccionada.");
    }
  };

  const handleGoalStatusChange = async (goalId, status) => {
    try {
      setDataError("");
      const updatedGoal = await updateGoalStatus(
        goalId,
        userId || profile?.email || "local-user",
        status,
      );
      if (updatedGoal) {
        setTrackingGoals((prev) =>
          prev.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)),
        );
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
      const updatedEvaluation = await acceptEvaluationPlan(
        currentEvaluation.id,
        userId || profile?.email || "local-user",
      );
      if (updatedEvaluation) {
        setEvaluations((prev) =>
          prev.map((item) =>
            item.id === updatedEvaluation.id ? updatedEvaluation : item,
          ),
        );
      }
      setDataError(
        "Plan activado. Podrás volver a precalificar después de avanzar en tus metas.",
      );
    } catch (err) {
      console.error(err);
      setDataError("No pudimos activar el plan. Intentalo nuevamente.");
    }
  };

  const handleOpenGoalPlan = (goal) => {
    setActiveGoal(goal);
    setPage(
      goal.title === "Revisar objetivo inmobiliario"
        ? "objective-review"
        : "monthly-plan",
    );
  };

  const handleSaveGoalProgress = async (goalId, progressData) => {
    try {
      setDataError("");
      const updatedGoal = await updateGoalProgress(
        goalId,
        userId || profile?.email || "local-user",
        progressData,
      );
      if (updatedGoal) {
        setTrackingGoals((prev) =>
          prev.map((goal) =>
            goal.id === updatedGoal.id ? { ...goal, ...updatedGoal } : goal,
          ),
        );
        setActiveGoal((prev) =>
          prev?.id === updatedGoal.id ? { ...prev, ...updatedGoal } : prev,
        );
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
    setConsentGranted(false);
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
        onNavigate={(nextPage) =>
          nextPage === "evaluate" ? startEvaluation() : setPage(nextPage)
        }
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
        <Onboarding
          initialData={userOnboarding}
          onComplete={handleOnboardingComplete}
        />
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
              <span className="eyebrow">Solución inmobiliaria</span>
              <h1>ScoreLeads</h1>
              {result && (
                <div
                  className={
                    resultSaved === false ? "error-message" : "success-message"
                  }
                >
                  {resultSaved === false
                    ? `Score calculado: ${formatScore(result.score)} / ${result.classification}. No se pudo guardar en historial.`
                    : resultSaved === true
                      ? `Precalificación guardada: ${formatScore(result.score)} / ${result.classification}. Puedes revisar el detalle en Perfil.`
                      : `Score calculado: ${formatScore(result.score)} / ${result.classification}. Guardando historial...`}
                </div>
              )}
              <p>
                Plataforma para preevaluar leads inmobiliarios antes de iniciar
                una evaluación bancaria formal. El foco del producto es entregar
                una pre-evaluación financiera clara, rápida y orientativa.
              </p>
              <p className="hero-note">
                Sin documentos, sin claves bancarias y sin aprobación bancaria.
              </p>
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
                Estas tarjetas muestran la visión completa de ScoreLeads.
                Actualmente están habilitados el objetivo inmobiliario y la
                pre-evaluación financiera.
              </p>
            </div>

            <div className="module-grid">
              {futureModules.map((module) => (
                <article
                  className={`module-card ${module.status === "Disponible" ? "is-active" : ""}`}
                  key={module.title}
                >
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
          <button className="secondary-button" onClick={() => setPage("home")}>
            Volver al inicio
          </button>
          <div className="section-heading compact">
            <span className="eyebrow">Disponible</span>
            <h1>Pre-evaluación financiera</h1>
            <p>
              Completa todos los campos para calcular un score orientativo. El
              resultado no equivale a aprobación bancaria.
            </p>
          </div>
          {userOnboarding && (
            <div className="context-summary">
              <strong>Contexto inicial</strong>
              <span>
                {userOnboarding.comuna_interes} ·{" "}
                {plazoLabels[userOnboarding.plazo_compra] ||
                  userOnboarding.plazo_compra}
              </span>
              <button
                className="secondary-button compact-button"
                type="button"
                onClick={() => setPage("onboarding")}
              >
                Editar contexto
              </button>
            </div>
          )}
          <ScoreForm
            targetCommune={userOnboarding?.comuna_interes}
            objective={userOnboarding?.objetivo_principal}
            birthDate={profile?.birth_date}
            profile={profile}
            consentGranted={consentGranted}
            onConsentAccept={handleDataConsent}
            onResult={handleResult}
          />
        </section>
      ) : page === "profile" && profile.role === roles.user ? (
        <ProfilePage
          profile={profile}
          onboarding={userOnboarding}
          evaluations={userEvaluations}
          onSaveOnboarding={handleProfileOnboardingSave}
          onDeleteEvaluation={deleteEvaluation}
          onProfileUpdate={handleProfileUpdate}
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
        <ObjectiveReview
          evaluation={currentEvaluation}
          onBack={() => setPage("tracking")}
        />
      ) : page === "recommendations" && profile.role === roles.user ? (
        <Recommendations
          evaluation={currentEvaluation}
          onStartEvaluation={startEvaluation}
          onNavigate={setPage}
        />
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
