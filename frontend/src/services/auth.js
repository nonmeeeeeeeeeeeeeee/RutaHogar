import { supabase } from "../utils/supabase";
import { ensureUserProfile, getCurrentProfile, normalizeRole } from "./profileService";

const PROFILE_KEY = "scoreleads_profile";
const SESSION_KEY = "scoreleads_session";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const roles = {
  user: "usuario",
  sales: "ejecutivo",
  admin: "admin",
};

export const roleLabels = {
  usuario: "Usuario",
  ejecutivo: "Ejecutivo comercial",
  admin: "Admin",
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

function readStored(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value?.role ? { ...value, role: normalizeRole(value.role) } : value;
  } catch {
    return null;
  }
}

function saveSession(session, profile) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  const normalizedProfile = profile?.role ? { ...profile, role: normalizeRole(profile.role) } : profile;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(normalizedProfile));
  return { session, profile: normalizedProfile };
}

function buildProfile(user, preferredRole = roles.user, persistedProfile = null) {
  if (!user?.id) {
    throw new Error("No se pudo obtener la informacion del usuario.");
  }

  const fullName = persistedProfile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email || "";
  const role = normalizeRole(persistedProfile?.role || user.user_metadata?.role || preferredRole);

  return {
    id: user.id,
    user_id: user.id,
    email: user.email,
    full_name: fullName,
    role,
    onboarding_data: persistedProfile?.onboarding_data || null,
    created_at: persistedProfile?.created_at || user.created_at || new Date().toISOString(),
    updated_at: persistedProfile?.updated_at,
  };
}

async function getOrCreateProfile(user, preferredRole) {
  const fallbackProfile = buildProfile(user, preferredRole);

  try {
    const existingProfile = await getCurrentProfile(user.id);
    if (existingProfile) {
      return buildProfile(user, preferredRole, existingProfile);
    }

    const createdProfile = await ensureUserProfile(user);
    return buildProfile(user, preferredRole, createdProfile);
  } catch (err) {
    console.warn("No se pudo sincronizar el perfil en Supabase. Usando perfil de Auth como fallback.", err);
    return fallbackProfile;
  }
}

export async function signIn({ email, password, role = roles.user }) {
  if (isSupabaseConfigured) {
    if (!supabase) {
      throw new Error("Supabase no esta configurado correctamente.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error("No se pudo iniciar sesion. Revisa tu correo y contrasena.");
    }

    if (!data?.user) {
      throw new Error("No se pudo obtener la informacion del usuario.");
    }

    return saveSession(data.session, await getOrCreateProfile(data.user, role));
  }

  const user = { id: `local-${email}`, email, created_at: new Date().toISOString(), user_metadata: { role } };
  return saveSession({ user, access_token: "local-mvp-session" }, buildProfile(user, role));
}

export async function signUp({ email, password, role = roles.user, full_name = "" }) {
  if (isSupabaseConfigured) {
    if (!supabase) {
      throw new Error("Supabase no esta configurado correctamente.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: normalizeRole(role), full_name } },
    });
    if (error) {
      throw new Error("No se pudo crear la cuenta. Revisa los datos ingresados.");
    }

    if (!data?.user) {
      throw new Error("Cuenta creada, pero no se pudo obtener el usuario. Revisa tu correo si Supabase requiere confirmacion.");
    }

    return saveSession(data.session, await getOrCreateProfile(data.user, role));
  }

  const user = { id: `local-${email}`, email, created_at: new Date().toISOString(), user_metadata: { role, full_name } };
  return saveSession({ user, access_token: "local-mvp-session" }, buildProfile(user, role));
}

export function getStoredAuth() {
  return {
    session: readStored(SESSION_KEY),
    profile: readStored(PROFILE_KEY),
  };
}

export function updateStoredProfile(profile) {
  if (!profile) return null;
  const normalizedProfile = { ...profile, role: normalizeRole(profile.role) };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(normalizedProfile));
  return normalizedProfile;
}

export async function signOut() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PROFILE_KEY);
}
