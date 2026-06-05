import { supabase } from "../utils/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseDataConfigured = Boolean(supabaseUrl && supabasePublishableKey && supabase);

const roleAliases = {
  usuario_comun: "usuario",
  usuario: "usuario",
  ejecutivo_comercial: "ejecutivo",
  ejecutivo: "ejecutivo",
  admin: "admin",
};

export function normalizeRole(role) {
  return roleAliases[role] || "usuario";
}

function isUUID(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function normalizeProfile(row) {
  if (!row) return null;

  return {
    id: row.id,
    user_id: row.id,
    full_name: row.full_name || "",
    role: normalizeRole(row.role),
    onboarding_data: row.onboarding_data || null,
    last_lead_seen_at: row.last_lead_seen_at || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function logSupabaseError(error) {
  if (!error) return;

  console.error("Supabase error:", {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
}

export async function getAuthenticatedUser() {
  if (!isSupabaseDataConfigured) return null;

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    logSupabaseError(sessionError);
    throw sessionError;
  }

  if (!sessionData?.session?.user) {
    return null;
  }

  return sessionData.session.user;
}

export async function getCurrentProfile(userId) {
  if (!isSupabaseDataConfigured || !userId || !isUUID(userId)) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, onboarding_data, last_lead_seen_at, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    logSupabaseError(error);
    throw error;
  }
  return normalizeProfile(data);
}

export async function upsertProfile(userId, fullName, role = "usuario", onboardingData) {
  if (!isUUID(userId)) {
    console.warn("Saltando upsert: ID no es un UUID válido.");
    return normalizeProfile({ id: userId, full_name: fullName, role });
  }

  const profile = {
    id: userId,
    full_name: fullName || "",
    role: normalizeRole(role),
    onboarding_data: onboardingData || null,
  };

  if (!isSupabaseDataConfigured) {
    return normalizeProfile({ ...profile, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ ...profile, updated_at: new Date().toISOString() })
    .select("id, full_name, role, onboarding_data, last_lead_seen_at, created_at, updated_at")
    .maybeSingle();

  if (error) {
    logSupabaseError(error);
    throw error;
  }
  return normalizeProfile(data);
}

export async function ensureUserProfile(user) {
  if (!user?.id) {
    throw new Error("No hay usuario autenticado para sincronizar perfil.");
  }

  const existingProfile = await getCurrentProfile(user.id);
  if (existingProfile) return existingProfile;

  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "";
  const role = normalizeRole(user.user_metadata?.role || "usuario");
  return upsertProfile(user.id, fullName, role);
}

export async function updateLastLeadSeenAt(userId) {
  if (!isSupabaseDataConfigured || !isUUID(userId)) return;
  const { error } = await supabase
    .from("profiles")
    .update({ last_lead_seen_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) {
    logSupabaseError(error);
    throw error;
  }
}

const CONSENT_KEY = "scoreleads_dataconsent";

export function getLocalConsent() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY)) || null;
  } catch {
    return null;
  }
}

export function saveLocalConsent(consentData) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
}

export async function saveConsent(userId, consentData) {
  saveLocalConsent(consentData);

  if (!isSupabaseDataConfigured || !userId) return consentData;

  const user = await getAuthenticatedUser();
  if (!user?.id || user.id !== userId) return consentData;

  const { error } = await supabase
    .from("profiles")
    .update({ consent_data: consentData, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    logSupabaseError(error);
  }

  return consentData;
}

export async function getConsent(userId) {
  const local = getLocalConsent();
  if (!isSupabaseDataConfigured || !userId) return local;

  try {
    const user = await getAuthenticatedUser();
    if (!user?.id) return local;

    const { data, error } = await supabase
      .from("profiles")
      .select("consent_data")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data?.consent_data) return local;

    const remote = data.consent_data;
    if (!local || new Date(remote.timestamp) > new Date(local.timestamp)) {
      saveLocalConsent(remote);
      return remote;
    }

    return local;
  } catch {
    return local;
  }
}

export async function updateProfileOnboarding(userId, onboardingData) {
  if (!isSupabaseDataConfigured) {
    return normalizeProfile({
      id: userId,
      role: "usuario",
      onboarding_data: onboardingData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  const user = await getAuthenticatedUser();
  if (!user?.id || user.id !== userId) {
    throw new Error("No hay usuario autenticado para actualizar respuestas preliminares.");
  }
  await ensureUserProfile(user);

  if (!isUUID(userId)) {
    return normalizeProfile({ id: userId, onboarding_data: onboardingData });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ 
      onboarding_data: onboardingData,
      updated_at: new Date().toISOString() 
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    logSupabaseError(error);
    throw error;
  }
  return normalizeProfile(data);
}
