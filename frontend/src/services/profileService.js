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

function normalizeProfile(row) {
  if (!row) return null;

  return {
    id: row.id,
    user_id: row.id,
    full_name: row.full_name || "",
    role: normalizeRole(row.role),
    onboarding_data: row.onboarding_data || null,
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
  if (!isSupabaseDataConfigured || !userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    logSupabaseError(error);
    throw error;
  }
  return normalizeProfile(data);
}

export async function upsertProfile(userId, fullName, role = "usuario", onboardingData) {
  const profile = {
    id: userId,
    full_name: fullName || "",
    role: normalizeRole(role),
  };

  if (!isSupabaseDataConfigured && onboardingData !== undefined) {
    profile.onboarding_data = onboardingData;
  }

  if (!isSupabaseDataConfigured) {
    return normalizeProfile({ ...profile, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ ...profile, updated_at: new Date().toISOString() }, { onConflict: "id" })
    .select("id, full_name, role, created_at, updated_at")
    .single();

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
  const role = "usuario";
  return upsertProfile(user.id, fullName, role);
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

  const profile = await getCurrentProfile(userId);
  return normalizeProfile({ ...profile, onboarding_data: onboardingData });
}
