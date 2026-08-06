import { supabase } from "../utils/supabase";
import { ensureUserProfile, getAuthenticatedUser, isSupabaseDataConfigured, logSupabaseError } from "./profileService";

const SCORING_HISTORY_KEY = "scoreleads_scoring_history";

function readLocalScoringHistory() {
  try {
    return JSON.parse(localStorage.getItem(SCORING_HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function writeLocalScoringHistory(history) {
  localStorage.setItem(SCORING_HISTORY_KEY, JSON.stringify(history));
}

function buildScoringHistoryRow(userId, evaluationId, evaluationPayload) {
  const result = evaluationPayload.result || {};
  return {
    evaluation_id: evaluationId,
    user_id: userId,
    score: Math.round(Number(result.score) || 0),
    classification: result.classification,
    snapshot: JSON.parse(JSON.stringify(evaluationPayload.input || {})),
    component_scores: result.component_scores || {},
    algorithm_version: result.algorithm_version || "",
    channel: evaluationPayload.channel || "web",
  };
}

const scoringHistorySelectColumns = [
  "id",
  "evaluation_id",
  "user_id",
  "score",
  "classification",
  "snapshot",
  "component_scores",
  "algorithm_version",
  "channel",
  "events",
  "created_at",
].join(", ");

export async function getScoringHistory(userId) {
  if (!isSupabaseDataConfigured) {
    return readLocalScoringHistory().filter((item) => item.user_id === userId);
  }

  const user = await getAuthenticatedUser();
  if (!user?.id) {
    throw new Error("No hay usuario autenticado para cargar el historial.");
  }
  await ensureUserProfile(user);

  const { data, error } = await supabase
    .from("scoring_history")
    .select(scoringHistorySelectColumns)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseError(error);
    throw error;
  }
  return data || [];
}

export async function getScoringHistoryByEvaluation(evaluationId) {
  if (!isSupabaseDataConfigured) {
    return readLocalScoringHistory().filter((item) => item.evaluation_id === evaluationId);
  }

  const { data, error } = await supabase
    .from("scoring_history")
    .select(scoringHistorySelectColumns)
    .eq("evaluation_id", evaluationId)
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseError(error);
    throw error;
  }
  return data || [];
}

function shouldSkipEvent(existingEvents, event) {
  const events = Array.isArray(existingEvents) ? existingEvents : [];

  if (event?.type === "no_viable_shown") {
    return events.some((item) => item.type === "no_viable_shown");
  }

  if (event?.type === "simulate_success") {
    const last = events[events.length - 1];
    return last?.type === "simulate_success";
  }

  if (event?.type === "register_savings") {
    const last = events[events.length - 1];
    return last?.type === "register_savings" &&
      Number(last.details?.total_registered) === Number(event.details?.total_registered);
  }

  return false;
}

/**
 * Registra un evento de trazabilidad en el ScoringRecord de la evaluación
 * (estado "No viable" presentado y acciones posteriores del usuario).
 */
export async function appendScoringEvent(evaluationId, userId, event) {
  if (!evaluationId) return null;
  const payload = { type: event?.type, at: new Date().toISOString(), details: event?.details || {} };

  if (!isSupabaseDataConfigured) {
    const history = readLocalScoringHistory();
    const target = history.find((item) => item.evaluation_id === evaluationId);
    if (!target) return null;
    const existingEvents = Array.isArray(target.events) ? target.events : [];
    if (shouldSkipEvent(existingEvents, payload)) return target;

    const next = history.map((item) =>
      item.evaluation_id === evaluationId
        ? { ...item, events: [...existingEvents, payload] }
        : item,
    );
    writeLocalScoringHistory(next);
    return next.find((item) => item.evaluation_id === evaluationId) || null;
  }

  const user = await getAuthenticatedUser();
  if (!user?.id) throw new Error("No hay usuario autenticado para registrar el evento.");

  const { data: row, error: rowError } = await supabase
    .from("scoring_history")
    .select(scoringHistorySelectColumns)
    .eq("evaluation_id", evaluationId)
    .single();

  if (rowError || !row) {
    if (rowError) logSupabaseError(rowError);
    return null;
  }

  const existingEvents = Array.isArray(row.events) ? row.events : [];
  if (shouldSkipEvent(existingEvents, payload)) return row;

  const { data, error } = await supabase
    .from("scoring_history")
    .update({ events: [...existingEvents, payload] })
    .eq("evaluation_id", evaluationId)
    .select(scoringHistorySelectColumns)
    .single();

  if (error) { logSupabaseError(error); throw error; }
  return data;
}

export { buildScoringHistoryRow, readLocalScoringHistory, writeLocalScoringHistory };
