import React, { useState } from "react";
import { isSupabaseConfigured, roleLabels, roles, signIn, signUp } from "../services/auth";

export default function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: roles.user,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Ingresa email y contrasena para continuar.");
      return;
    }

    if (mode === "signup" && !form.full_name.trim()) {
      setError("Ingresa tu nombre para crear la cuenta.");
      return;
    }

    setLoading(true);
    try {
      const auth = mode === "signin" ? await signIn(form) : await signUp(form);
      onAuth(auth);
    } catch (err) {
      const fallback =
        mode === "signin"
          ? "No se pudo iniciar sesion. Revisa tu correo y contrasena."
          : "No se pudo crear la cuenta. Revisa los datos ingresados.";
      const message = err?.message || fallback;
      setError(message.includes("Cannot read") ? fallback : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-panel">
      <div className="auth-copy">
        <img src="/Logo ScoreLeads.png" alt="ScoreLeads" />
        <span className="eyebrow">Acceso MVP</span>
        <h1>Ingresa a tu pre-evaluacion</h1>
        <p>
          Este acceso separa vistas por rol y protege la informacion del flujo. En modo MVP, los roles pueden
          probarse localmente; con Supabase configurado se usa Supabase Auth.
        </p>
        {!isSupabaseConfigured && (
          <p className="inline-note">Modo local activo: configura VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY para usar Supabase.</p>
        )}
      </div>

      <form className="auth-form" onSubmit={submit}>
        <div className="segmented-control" aria-label="Modo de acceso">
          <button type="button" className={mode === "signin" ? "is-active" : ""} onClick={() => setMode("signin")}>
            Entrar
          </button>
          <button type="button" className={mode === "signup" ? "is-active" : ""} onClick={() => setMode("signup")}>
            Crear cuenta
          </button>
        </div>

        {mode === "signup" && (
          <label>
            Nombre
            <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Ej: Isaias Carte" />
          </label>
        )}

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="nombre@correo.cl" />
        </label>

        <label>
          Contrasena
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Minimo 6 caracteres" />
        </label>

        <label>
          Rol para este MVP
          <select name="role" value={form.role} onChange={handleChange}>
            <option value={roles.user}>{roleLabels[roles.user]}</option>
            <option value={roles.sales}>{roleLabels[roles.sales]}</option>
            <option value={roles.admin}>{roleLabels[roles.admin]}</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>{loading ? "Validando..." : "Continuar"}</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </section>
  );
}
