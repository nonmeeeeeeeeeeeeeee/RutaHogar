import { supabase } from "../utils/supabase";

const FEEDBACK_FUNCTION = "submit-feedback";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeFeedbackPayload(payload = {}) {
  const rating = Number(payload.clarity_rating);

  return {
    name: cleanText(payload.name) || null,
    email: cleanText(payload.email) || null,
    phone: cleanText(payload.phone) || null,
    tester_type: cleanText(payload.tester_type) || "Otro",
    first_impression: cleanText(payload.first_impression) || null,
    confusing_part: cleanText(payload.confusing_part) || null,
    improvement_suggestion: cleanText(payload.improvement_suggestion) || null,
    clarity_rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null,
  };
}

function isDevelopment() {
  return import.meta.env.DEV;
}

function getFunctionUrl() {
  return supabaseUrl ? `${supabaseUrl.replace(/\/$/, "")}/functions/v1/${FEEDBACK_FUNCTION}` : null;
}

async function readFunctionError(feedback) {
  const functionUrl = getFunctionUrl();
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!functionUrl || !supabaseKey) {
    return null;
  }

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(feedback),
    });
    const body = await response.text();
    return { status: response.status, body };
  } catch (error) {
    return { status: null, body: error.message };
  }
}

async function insertFeedbackFallback(feedback) {
  const { error } = await supabase.from("feedback").insert([feedback]);

  if (error) {
    throw new Error(error.message || "No se pudo guardar el feedback.");
  }

  return {
    success: true,
    email_sent: false,
    fallback: true,
    warning: "Feedback guardado sin correo porque la Edge Function no está desplegada.",
  };
}

export async function submitFeedback(payload) {
  if (!supabase) {
    throw new Error("Supabase no está configurado para recibir feedback.");
  }

  const feedback = normalizeFeedbackPayload(payload);

  const { data, error } = await supabase.functions.invoke(FEEDBACK_FUNCTION, {
    body: feedback,
  });

  if (error || data?.success === false) {
    const details = await readFunctionError(feedback);

    if (isDevelopment()) {
      console.error("No se pudo enviar feedback con Edge Function:", {
        supabaseUrl,
        functionName: FEEDBACK_FUNCTION,
        functionUrl: getFunctionUrl(),
        invokeError: error,
        functionStatus: details?.status,
        functionBody: details?.body,
      });
    }

    if (details?.status === 404) {
      return insertFeedbackFallback(feedback);
    }

    throw new Error(data?.error || "No se pudo guardar el feedback.");
  }

  return data;
}
