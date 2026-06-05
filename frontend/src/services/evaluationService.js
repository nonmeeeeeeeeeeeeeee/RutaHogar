import { supabase } from "../utils/supabase";
import { ensureUserProfile, getAuthenticatedUser, isSupabaseDataConfigured, logSupabaseError } from "./profileService";

const EVALUATIONS_KEY = "scoreleads_evaluations";

function readLocalEvaluations() {
  try {
    return JSON.parse(localStorage.getItem(EVALUATIONS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeLocalEvaluations(evaluations) {
  localStorage.setItem(EVALUATIONS_KEY, JSON.stringify(evaluations));
}

export function normalizeEvaluation(row) {
  if (!row) return null;

  const recommendationData = row.recommendations || {};
  const recommendations = Array.isArray(recommendationData)
    ? recommendationData
    : recommendationData.items || [];
  const onboarding = {
    objetivo_principal: row.objective || "",
    tipo_propiedad: row.property_type || "",
    comuna_interes: row.target_commune || "",
    comuna_alternativa: row.alternative_commune || "",
    plazo_compra: row.purchase_timeline || "",
  };

  return {
    id: row.id,
    created_at: row.created_at,
    email: row.email,
    user_id: row.user_id,
    onboarding,
    input: row.financial_data || {},
    result: {
      score: row.score,
      classification: row.classification,
      risks: Array.isArray(recommendationData.risks) ? recommendationData.risks : [],
      recommendations,
      ai_explanation: row.explanation || "",
      improvement_plan: Array.isArray(recommendationData.improvement_plan) ? recommendationData.improvement_plan : [],
    },
  };
}

function buildRow(userId, evaluationPayload) {
  const result = evaluationPayload.result || {};
  const onboarding = evaluationPayload.onboarding || {};

  return {
    user_id: userId,
    email: evaluationPayload.email || null,
    created_at: new Date().toISOString(),
    score: Math.round(Number(result.score) || 0),
    classification: result.classification,
    objective: onboarding.objetivo_principal || null,
    property_type: onboarding.tipo_propiedad || null,
    target_commune: onboarding.comuna_interes || evaluationPayload.input?.comuna_objetivo || null,
    alternative_commune: onboarding.comuna_alternativa || null,
    purchase_timeline: onboarding.plazo_compra || null,
    financial_data: evaluationPayload.input || {},
    explanation: result.ai_explanation || "",
    recommendations: {
      items: result.recommendations || [],
      risks: result.risks || [],
      improvement_plan: result.improvement_plan || [],
    },
  };
}

const evaluationSelectColumns = [
  "id",
  "user_id",
  "email",
  "score",
  "classification",
  "objective",
  "property_type",
  "target_commune",
  "alternative_commune",
  "purchase_timeline",
  "financial_data",
  "explanation",
  "recommendations",
  "created_at",
].join(", ");

const isUUID = (id) => {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export async function createEvaluation(userId, evaluationPayload) {
  if (!isSupabaseDataConfigured) {
    const entry = {
      id: window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
      created_at: new Date().toISOString(),
      email: evaluationPayload.email,
      user_id: userId,
      onboarding: evaluationPayload.onboarding || null,
      input: evaluationPayload.input || {},
      result: evaluationPayload.result,
    };
    const next = [entry, ...readLocalEvaluations()].slice(0, 25);
    writeLocalEvaluations(next);
    return entry;
  }

  const user = await getAuthenticatedUser();
  if (!user?.id) {
    throw new Error("No hay usuario autenticado para guardar la preevaluacion.");
  }
  await ensureUserProfile(user);

  const { data, error } = await supabase
    .from("evaluations")
    .insert(buildRow(user.id, evaluationPayload))
    .select(evaluationSelectColumns)
    .single();

  if (error) {
    logSupabaseError(error);
    throw error;
  }
  return normalizeEvaluation(data);
}

export async function getEvaluations(userId) {
  if (!isSupabaseDataConfigured) {
    const local = readLocalEvaluations();
    return userId ? local.filter((item) => item.user_id === userId || item.email === userId) : local;
  }

  const user = await getAuthenticatedUser();
  if (!user?.id) {
    throw new Error("No hay usuario autenticado para cargar evaluaciones.");
  }

  // Intentamos sincronizar el perfil pero no bloqueamos la carga si falla
  ensureUserProfile(user).catch(err => console.warn("Error no crítico sincronizando perfil:", err));

  let query = supabase
    .from("evaluations")
    .select(evaluationSelectColumns);

  // Solo filtramos por user_id si se especificó un ID válido (no staff)
  if (isUUID(userId)) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    logSupabaseError(error);
    throw error;
  }
  return (data || []).map(normalizeEvaluation);
}

export async function getLatestEvaluation(userId) {
  if (!isSupabaseDataConfigured) {
    return (await getEvaluations(userId))[0] || null;
  }

  const user = await getAuthenticatedUser();
  if (!user?.id) {
    throw new Error("No hay usuario autenticado para cargar la evaluacion actual.");
  }
  //const { data, error } = await supabase
  let query = supabase
    .from("evaluations")
    /*.select(evaluationSelectColumns)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)*/
    .select(evaluationSelectColumns);

  if (userId && isUUID(userId)) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(1)
    .maybeSingle();

  if (error) {
    logSupabaseError(error);
    throw error;
  }
  return normalizeEvaluation(data);
}

export async function deleteEvaluation(evaluationId, userId) {
  if (!isSupabaseDataConfigured) {
    const next = readLocalEvaluations().filter((item) => item.id !== evaluationId);
    writeLocalEvaluations(next);
    return;
  }

  const user = await getAuthenticatedUser();
  if (!user?.id) {
    throw new Error("No hay usuario autenticado para eliminar evaluaciones.");
  }

  const { error } = await supabase
    .from("evaluations")
    .delete()
    .eq("id", evaluationId)
    .eq("user_id", user.id);

  if (error) {
    logSupabaseError(error);
    throw error;
  }
}

export async function acceptEvaluationPlan(evaluationId, userId) {
  const acceptedAt = new Date().toISOString();

  if (!isSupabaseDataConfigured) {
    const next = readLocalEvaluations().map((item) =>
      item.id === evaluationId ? { ...item, plan_accepted_at: acceptedAt } : item,
    );
    writeLocalEvaluations(next);
    return next.find((item) => item.id === evaluationId) || null;
  }

  return null;
}
