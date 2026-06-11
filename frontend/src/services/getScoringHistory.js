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

export { buildScoringHistoryRow, readLocalScoringHistory, writeLocalScoringHistory };
