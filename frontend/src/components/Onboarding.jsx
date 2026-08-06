import React, { useState } from "react";
import { comunasMvp } from "../constants/comunas";

const normalizePropertyType = (value) =>
  value === "indiferente" || value === "aun_no_lo_se" ? "" : value || "";

export default function Onboarding({ initialData, onComplete, isAnon = false }) {
  const [anonConsent, setAnonConsent] = useState(false);
  const [form, setForm] = useState({
    objetivo_principal: initialData?.objetivo_principal || "",
    tipo_propiedad: normalizePropertyType(initialData?.tipo_propiedad),
    comuna_interes: initialData?.comuna_interes || "",
    plazo_compra: initialData?.plazo_compra || "",
    comuna_alternativa: initialData?.comuna_alternativa || "",
    tiene_propiedad_vista: initialData?.tiene_propiedad_vista === true,
  });
  const [error, setError] = useState("");
  const alternativeCommunes = form.comuna_interes
    ? comunasMvp.filter((comuna) => comuna !== form.comuna_interes)
    : [];

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "comuna_interes" && value === prev.comuna_alternativa) {
        next.comuna_alternativa = "";
      }
      return next;
    });
  };

  const submit = (event) => {
    event.preventDefault();
    setError("");

    const required = [
      ["objetivo_principal", "Objetivo principal"],
      ["tipo_propiedad", "Tipo de propiedad"],
      ["comuna_interes", "Comuna de interés"],
      ["plazo_compra", "Plazo de compra"],
    ];
    const missing = required.filter(([key]) => !form[key]).map(([, label]) => label);

    if (missing.length) {
      setError(`Completa estos campos: ${missing.join(", ")}`);
      return;
    }

    if (!comunasMvp.includes(form.comuna_interes)) {
      setError("Selecciona una comuna de interés desde la lista.");
      return;
    }

    if (form.comuna_alternativa && !comunasMvp.includes(form.comuna_alternativa)) {
      setError("Selecciona una comuna alternativa desde la lista o déjala vacía.");
      return;
    }

    if (form.comuna_alternativa && form.comuna_alternativa === form.comuna_interes) {
      setError("La comuna alternativa debe ser distinta a la comuna principal.");
      return;
    }

    if (isAnon && !anonConsent) {
      setError("Debes aceptar el procesamiento de tus datos para continuar.");
      return;
    }

    onComplete(form);
  };

  return (
    <section className="evaluation-panel onboarding-panel">
      <div className="section-heading compact">
        <span className="eyebrow">Contexto inicial</span>
        <h1>Antes de evaluar tu perfil</h1>
        <p>
          Estas preguntas ayudan a ordenar tu objetivo inmobiliario. No reemplazan la pre-evaluación financiera
          ni se usan como aprobación formal.
        </p>
      </div>

      <form className="score-form" onSubmit={submit}>
        <div className="form-grid">
          <label>
            ¿Cuál es tu objetivo principal?
            <select name="objetivo_principal" value={form.objetivo_principal} onChange={handleChange}>
              <option value="">Selecciona una opción</option>
              <option value="comprar_ahora">Comprar ahora</option>
              <option value="prepararme">Prepararme para comprar más adelante</option>
              <option value="evaluar_capacidad">Evaluar mi capacidad de compra</option>
              <option value="conocer_propiedad">Conocer qué tipo de propiedad podría buscar</option>
            </select>
          </label>

          <label>
            ¿Qué tipo de propiedad te interesa?
            <select name="tipo_propiedad" value={form.tipo_propiedad} onChange={handleChange}>
              <option value="">Selecciona una opción</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
            </select>
          </label>

          <label>
            ¿En qué comuna te gustaría comprar?
            <select
              name="comuna_interes"
              value={form.comuna_interes}
              onChange={handleChange}
            >
              <option value="">Selecciona una comuna</option>
              {comunasMvp.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
          </label>

          <label>
            ¿En qué plazo te gustaría comprar?
            <select name="plazo_compra" value={form.plazo_compra} onChange={handleChange}>
              <option value="">Selecciona una opción</option>
              <option value="0_3_meses">0 a 3 meses</option>
              <option value="3_6_meses">3 a 6 meses</option>
              <option value="6_12_meses">6 a 12 meses</option>
              <option value="mas_12_meses">Más de 12 meses</option>
            </select>
          </label>

          <label>
            ¿Tienes una comuna alternativa?
            <select
              name="comuna_alternativa"
              value={form.comuna_alternativa}
              onChange={handleChange}
              disabled={!form.comuna_interes}
            >
              <option value="">{form.comuna_interes ? "Sin comuna alternativa" : "Elige primero una comuna principal"}</option>
              {alternativeCommunes.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              name="tiene_propiedad_vista"
              checked={form.tiene_propiedad_vista}
              onChange={handleChange}
            />
            <span>Ya tengo una propiedad o proyecto visto</span>
          </label>
        </div>

        {isAnon && (
          <label className="check-row anon-consent-row">
            <input
              type="checkbox"
              checked={anonConsent}
              onChange={(e) => setAnonConsent(e.target.checked)}
            />
            <span>
              Acepto que mis datos sean procesados para calcular mi score orientativo.
              No se almacenan permanentemente si no creo una cuenta.
            </span>
          </label>
        )}

        <div className="form-actions">
          <button type="submit" disabled={isAnon && !anonConsent}>
            Continuar al formulario financiero
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </form>
    </section>
  );
}
