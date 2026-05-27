import React, { useEffect, useMemo, useState } from "react";
import { comunasMvp } from "../constants/comunas";
import { roleLabels } from "../services/auth";

const objetivoLabels = {
  comprar_ahora: "Comprar ahora",
  prepararme: "Prepararme para comprar mas adelante",
  evaluar_capacidad: "Evaluar mi capacidad de compra",
  conocer_propiedad: "Conocer que tipo de propiedad podria buscar",
};

const propertyLabels = {
  departamento: "Departamento",
  casa: "Casa",
  indiferente: "Indiferente",
};

const plazoLabels = {
  "0_3_meses": "0 a 3 meses",
  "3_6_meses": "3 a 6 meses",
  "6_12_meses": "6 a 12 meses",
  mas_12_meses: "Mas de 12 meses",
};

const formatScore = (score) => (Number.isFinite(Number(score)) ? Math.round(Number(score)) : null);

const normalizeOnboarding = (data) => ({
  objetivo_principal: data?.objetivo_principal || "",
  tipo_propiedad: data?.tipo_propiedad || "",
  comuna_interes: data?.comuna_interes || "",
  plazo_compra: data?.plazo_compra || "",
  comuna_alternativa: data?.comuna_alternativa || "",
});

export default function ProfilePage({ profile, onboarding, evaluations, onSaveOnboarding, onDeleteEvaluation }) {
  const savedOnboarding = useMemo(() => normalizeOnboarding(onboarding), [onboarding]);
  const [form, setForm] = useState(savedOnboarding);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const hasChanges = useMemo(
    () => Object.keys(savedOnboarding).some((key) => form[key] !== savedOnboarding[key]),
    [form, savedOnboarding],
  );

  useEffect(() => {
    setForm(savedOnboarding);
  }, [savedOnboarding]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      setError("Selecciona una comuna alternativa desde la lista o dejala vacia.");
      return;
    }

    try {
      await onSaveOnboarding(form);
      setSuccess("Respuestas preliminares guardadas.");
    } catch {
      setError("No se pudieron guardar las respuestas preliminares.");
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
          <strong>Datos del usuario</strong>
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
              <dt>Rol</dt>
              <dd>{roleLabels[profile?.role] || profile?.role || "Usuario"}</dd>
            </div>
          </dl>
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
                <option value="">Selecciona una opcion</option>
                <option value="comprar_ahora">Comprar ahora</option>
                <option value="prepararme">Prepararme para comprar mas adelante</option>
                <option value="evaluar_capacidad">Evaluar mi capacidad de compra</option>
                <option value="conocer_propiedad">Conocer que tipo de propiedad podria buscar</option>
              </select>
            </label>

            <label>
              Tipo de propiedad
              <select name="tipo_propiedad" value={form.tipo_propiedad} onChange={handleChange}>
                <option value="">Selecciona una opcion</option>
                <option value="departamento">Departamento</option>
                <option value="casa">Casa</option>
                <option value="indiferente">Indiferente</option>
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
                <option value="">Selecciona una opcion</option>
                <option value="0_3_meses">0 a 3 meses</option>
                <option value="3_6_meses">3 a 6 meses</option>
                <option value="6_12_meses">6 a 12 meses</option>
                <option value="mas_12_meses">Mas de 12 meses</option>
              </select>
            </label>

            <label>
              Comuna alternativa
              <select name="comuna_alternativa" value={form.comuna_alternativa} onChange={handleChange}>
                <option value="">Sin comuna alternativa</option>
                {comunasMvp.map((comuna) => (
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
                <p>{item.result.ai_explanation}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <strong>Aun no tienes precalificaciones guardadas.</strong>
            <p>Cuando completes una evaluacion, aparecera aqui como registro independiente.</p>
          </div>
        )}
      </section>
    </section>
  );
}
