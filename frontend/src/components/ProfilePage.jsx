import React, { useEffect, useMemo, useState } from "react";
import { comunasMvp } from "../constants/comunas";
import { roleLabels, updateStoredProfile } from "../services/auth";
import { normalizePhoneForStorage, upsertProfile } from "../services/profileService";

const objetivoLabels = {
  comprar_ahora: "Comprar ahora",
  prepararme: "Prepararme para comprar más adelante",
  evaluar_capacidad: "Evaluar mi capacidad de compra",
  conocer_propiedad: "Conocer que tipo de propiedad podría buscar",
};

const propertyLabels = {
  departamento: "Departamento",
  casa: "Casa",
  aun_no_lo_se: "Aun no lo sé",
  indiferente: "Indiferente",
};

const plazoLabels = {
  "0_3_meses": "0 a 3 meses",
  "3_6_meses": "3 a 6 meses",
  "6_12_meses": "6 a 12 meses",
  mas_12_meses: "Más de 12 meses",
};

const formatScore = (score) => (Number.isFinite(Number(score)) ? Math.round(Number(score)) : null);

const normalizeOnboarding = (data) => ({
  objetivo_principal: data?.objetivo_principal || "",
  tipo_propiedad: data?.tipo_propiedad === "indiferente" ? "aun_no_lo_se" : data?.tipo_propiedad || "",
  comuna_interes: data?.comuna_interes || "",
  plazo_compra: data?.plazo_compra || "",
  comuna_alternativa: data?.comuna_alternativa || "",
});

// Formatea un teléfono para mostrarlo de forma legible: +56 9 XXXX XXXX
function formatPhoneDisplay(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  const local = digits.startsWith("56") ? digits.slice(2) : digits;
  if (local.length === 9) {
    return `+56 ${local[0]} ${local.slice(1, 5)} ${local.slice(5)}`;
  }
  return phone;
}

export default function ProfilePage({ profile, onboarding, evaluations, onSaveOnboarding, onDeleteEvaluation, onProfileUpdate }) {
  const savedOnboarding = useMemo(() => normalizeOnboarding(onboarding), [onboarding]);
  const [form, setForm] = useState(savedOnboarding);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estado para edición de contacto
  const [contactEditing, setContactEditing] = useState(false);
  const [contactForm, setContactForm] = useState({ phone: "", email: "" });
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

  const alternativeCommunes = form.comuna_interes
    ? comunasMvp.filter((comuna) => comuna !== form.comuna_interes)
    : [];
  const hasChanges = useMemo(
    () => Object.keys(savedOnboarding).some((key) => form[key] !== savedOnboarding[key]),
    [form, savedOnboarding],
  );

  useEffect(() => {
    setForm(savedOnboarding);
  }, [savedOnboarding]);

  // Al abrir el formulario de contacto, cargar los valores actuales del perfil
  const openContactEdit = () => {
    setContactForm({
      phone: profile?.phone ? formatPhoneDisplay(profile.phone) : "",
      email: profile?.email || "",
    });
    setContactError("");
    setContactSuccess("");
    setContactEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "comuna_interes" && value === prev.comuna_alternativa) {
        next.comuna_alternativa = "";
      }
      return next;
    });
  };

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!hasChanges) return;

    const required = [
      ["objetivo_principal", "Objetivo principal"],
      ["tipo_propiedad", "Tipo de propiedad"],
      ["comuna_interes", "Comuna objetivo"],
      ["plazo_compra", "Plazo estimado"],
    ];
    const missing = required.filter(([key]) => !form[key]).map(([, label]) => label);

    if (missing.length) {
      setError(`Completa estos campos: ${missing.join(", ")}`);
      return;
    }

    if (!comunasMvp.includes(form.comuna_interes)) {
      setError("Selecciona una comuna objetivo desde la lista.");
      return;
    }

    if (form.comuna_alternativa && !comunasMvp.includes(form.comuna_alternativa)) {
      setError("Selecciona una comuna alternativa desde la lista o dejala vacía.");
      return;
    }

    if (form.comuna_alternativa && form.comuna_alternativa === form.comuna_interes) {
      setError("La comuna alternativa debe ser distinta a la comuna principal.");
      return;
    }

    try {
      await onSaveOnboarding(form);
      setSuccess("Respuestas preliminares guardadas.");
    } catch {
      setError("No se pudieron guardar las respuestas preliminares.");
    }
  };

  const submitContact = async (event) => {
    event.preventDefault();
    setContactError("");
    setContactSuccess("");

    const trimmedPhone = contactForm.phone.trim();
    const trimmedEmail = contactForm.email.trim();

    if (!trimmedEmail) {
      setContactError("El correo no puede estar vacío.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setContactError("Ingresa un correo electrónico válido.");
      return;
    }

    const normalizedPhone = normalizePhoneForStorage(trimmedPhone);
    if (trimmedPhone && !normalizedPhone) {
      setContactError("El teléfono ingresado no es válido. Usa formato +569XXXXXXXX o 9XXXXXXXX.");
      return;
    }

    setContactLoading(true);
    try {
      const updatedProfile = await upsertProfile(
        profile.id,
        profile.full_name,
        profile.role,
        onboarding,
        { phone: normalizedPhone, birth_date: profile.birth_date },
      );

      // Actualizar el perfil en auth/localStorage con los nuevos datos de contacto
      if (onProfileUpdate) {
        onProfileUpdate({
          ...profile,
          phone: updatedProfile?.phone || normalizedPhone,
          email: trimmedEmail,
        });
      }

      setContactSuccess("Datos de contacto actualizados.");
      setContactEditing(false);
    } catch {
      setContactError("No se pudieron guardar los datos de contacto. Intenta nuevamente.");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <section className="section-block profile-page">
      <div className="section-heading">
        <span className="eyebrow">Mi perfil</span>
        <h1>Datos y actividad</h1>
        <p>Administra tus respuestas preliminares y revisa el historial de scorings guardados.</p>
      </div>

      <div className="profile-grid">
        <section className="profile-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <strong>Datos del usuario</strong>
            {!contactEditing && (
              <button type="button" className="secondary-button compact-button" onClick={openContactEdit}>
                Editar contacto
              </button>
            )}
          </div>

          {contactEditing ? (
            <form className="score-form profile-form" onSubmit={submitContact}>
              <div className="form-grid">
                <label>
                  Teléfono
                  <input
                    type="tel"
                    inputMode="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    placeholder="+56 9 XXXX XXXX"
                    autoComplete="tel"
                  />
                </label>
                <label>
                  Correo electrónico
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="tu@correo.cl"
                    autoComplete="email"
                  />
                </label>
              </div>
              {contactError && <div className="error-message">{contactError}</div>}
              <div className="form-actions">
                <button type="submit" disabled={contactLoading}>
                  {contactLoading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setContactEditing(false)}
                  disabled={contactLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <dl className="profile-details">
              <div>
                <dt>Nombre</dt>
                <dd>{profile?.full_name || "Sin nombre"}</dd>
              </div>
              <div>
                <dt>Correo</dt>
                <dd>{profile?.email || "Sin correo"}</dd>
              </div>
              <div>
                <dt>Teléfono</dt>
                <dd>{profile?.phone ? formatPhoneDisplay(profile.phone) : "Sin teléfono"}</dd>
              </div>
              <div>
                <dt>Fecha nacimiento</dt>
                <dd>{profile?.birth_date ? new Date(`${profile.birth_date}T00:00:00`).toLocaleDateString("es-CL") : "No declarada"}</dd>
              </div>
              <div>
                <dt>Rol</dt>
                <dd>{roleLabels[profile?.role] || profile?.role || "Usuario"}</dd>
              </div>
            </dl>
          )}
          {contactSuccess && <div className="success-message" style={{ marginTop: "0.75rem" }}>{contactSuccess}</div>}
        </section>

        <section className="profile-card">
          <strong>Resumen preliminar actual</strong>
          <dl className="profile-details">
            <div>
              <dt>Objetivo inmobiliario</dt>
              <dd>{objetivoLabels[onboarding?.objetivo_principal] || "No declarado"}</dd>
            </div>
            <div>
              <dt>Tipo de propiedad</dt>
              <dd>{propertyLabels[onboarding?.tipo_propiedad] || "No declarado"}</dd>
            </div>
            <div>
              <dt>Comuna objetivo</dt>
              <dd>{onboarding?.comuna_interes || "No declarada"}</dd>
            </div>
            <div>
              <dt>Comuna alternativa</dt>
              <dd>{onboarding?.comuna_alternativa || "No declarada"}</dd>
            </div>
            <div>
              <dt>Plazo estimado</dt>
              <dd>{plazoLabels[onboarding?.plazo_compra] || "No declarado"}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="profile-card">
        <strong>Editar respuestas preliminares</strong>
        <form className="score-form profile-form" onSubmit={submit}>
          <div className="form-grid">
            <label>
              Objetivo inmobiliario
              <select name="objetivo_principal" value={form.objetivo_principal} onChange={handleChange}>
                <option value="">Selecciona una opción</option>
                <option value="comprar_ahora">Comprar ahora</option>
                <option value="prepararme">Prepararme para comprar más adelante</option>
                <option value="evaluar_capacidad">Evaluar mi capacidad de compra</option>
                <option value="conocer_propiedad">Conocer que tipo de propiedad podría buscar</option>
              </select>
            </label>

            <label>
              Tipo de propiedad
              <select name="tipo_propiedad" value={form.tipo_propiedad} onChange={handleChange}>
                <option value="">Selecciona una opción</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="aun_no_lo_se">Aun no lo sé</option>
              </select>
            </label>

            <label>
              Comuna objetivo
              <select name="comuna_interes" value={form.comuna_interes} onChange={handleChange}>
                <option value="">Selecciona una comuna</option>
                {comunasMvp.map((comuna) => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </select>
            </label>

            <label>
              Plazo estimado de compra
              <select name="plazo_compra" value={form.plazo_compra} onChange={handleChange}>
                <option value="">Selecciona una opción</option>
                <option value="0_3_meses">0 a 3 meses</option>
                <option value="3_6_meses">3 a 6 meses</option>
                <option value="6_12_meses">6 a 12 meses</option>
                <option value="mas_12_meses">Más de 12 meses</option>
              </select>
            </label>

            <label>
              Comuna alternativa
              <select name="comuna_alternativa" value={form.comuna_alternativa} onChange={handleChange} disabled={!form.comuna_interes}>
                <option value="">{form.comuna_interes ? "Sin comuna alternativa" : "Elige primero una comuna principal"}</option>
                {alternativeCommunes.map((comuna) => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-actions">
            {hasChanges && <button type="submit">Guardar cambios</button>}
          </div>
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}
        </form>
      </section>

      <section className="profile-card">
        <strong>Historial de scoring</strong>
        {evaluations.length > 0 ? (
          <div className="history-list profile-history">
            {evaluations.map((item) => (
              <article className="history-card" key={item.id}>
                <div className="history-card-header">
                  <div>
                    <span className="eyebrow">{new Date(item.created_at).toLocaleDateString("es-CL")}</span>
                    <h3>{formatScore(item.result.score) ?? "Sin score"} / {item.result.classification}</h3>
                  </div>
                  <button className="secondary-button compact-button" type="button" onClick={() => onDeleteEvaluation(item.id)}>
                    Eliminar
                  </button>
                </div>
                <dl>
                  <div>
                    <dt>Comuna objetivo</dt>
                    <dd>{item.input.comuna_objetivo || item.onboarding?.comuna_interes || "No declarada"}</dd>
                  </div>
                  <div>
                    <dt>Objetivo inmobiliario</dt>
                    <dd>{objetivoLabels[item.onboarding?.objetivo_principal] || "No declarado"}</dd>
                  </div>
                </dl>
                {item.result.ai_explanation ? (
                  <>
                    <strong>Explicación mejorada con IA</strong>
                    <p>{item.result.ai_explanation}</p>
                  </>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <strong>Aun no tienes precalificaciones guardadas.</strong>
            <p>Cuando completes una evaluación, aparecerá aqui como registro independiente.</p>
          </div>
        )}
      </section>
    </section>
  );
}