import React, { useState } from "react";
import { comunasMvp } from "../constants/comunas";

const normalizePropertyType = (value) => (value === "indiferente" ? "aun_no_lo_se" : value || "");

export default function Onboarding({ initialData, onComplete }) {
  const [form, setForm] = useState({
    objetivo_principal: initialData?.objetivo_principal || "",
    tipo_propiedad: normalizePropertyType(initialData?.tipo_propiedad),
    comuna_interes: initialData?.comuna_interes || "",
    plazo_compra: initialData?.plazo_compra || "",
    comuna_alternativa: initialData?.comuna_alternativa || "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    setError("");

    const required = [
      ["objetivo_principal", "Objetivo principal"],
      ["tipo_propiedad", "Tipo de propiedad"],
      ["comuna_interes", "Comuna de interes"],
      ["plazo_compra", "Plazo de compra"],
    ];
    const missing = required.filter(([key]) => !form[key]).map(([, label]) => label);

    if (missing.length) {
      setError(`Completa estos campos: ${missing.join(", ")}`);
      return;
    }

    if (!comunasMvp.includes(form.comuna_interes)) {
      setError("Selecciona una comuna de interes desde la lista.");
      return;
    }

    if (form.comuna_alternativa && !comunasMvp.includes(form.comuna_alternativa)) {
      setError("Selecciona una comuna alternativa desde la lista o dejala vacia.");
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
          Estas preguntas ayudan a ordenar tu objetivo inmobiliario. No reemplazan la pre-evaluacion financiera
          ni se usan como aprobacion formal.
        </p>
      </div>

      <form className="score-form" onSubmit={submit}>
        <div className="form-grid">
          <label>
            Cual es tu objetivo principal?
            <select name="objetivo_principal" value={form.objetivo_principal} onChange={handleChange}>
              <option value="">Selecciona una opcion</option>
              <option value="comprar_ahora">Comprar ahora</option>
              <option value="prepararme">Prepararme para comprar mas adelante</option>
              <option value="evaluar_capacidad">Evaluar mi capacidad de compra</option>
              <option value="conocer_propiedad">Conocer que tipo de propiedad podria buscar</option>
            </select>
          </label>

          <label>
            Que tipo de propiedad te interesa?
            <select name="tipo_propiedad" value={form.tipo_propiedad} onChange={handleChange}>
              <option value="">Selecciona una opcion</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="aun_no_lo_se">Aun no lo se</option>
            </select>
          </label>

          <label>
            En que comuna te gustaria comprar?
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
            En que plazo te gustaria comprar?
            <select name="plazo_compra" value={form.plazo_compra} onChange={handleChange}>
              <option value="">Selecciona una opcion</option>
              <option value="0_3_meses">0 a 3 meses</option>
              <option value="3_6_meses">3 a 6 meses</option>
              <option value="6_12_meses">6 a 12 meses</option>
              <option value="mas_12_meses">Mas de 12 meses</option>
            </select>
          </label>

          <label>
            Tienes una comuna alternativa?
            <select
              name="comuna_alternativa"
              value={form.comuna_alternativa}
              onChange={handleChange}
            >
              <option value="">Sin comuna alternativa</option>
              {comunasMvp.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit">Continuar al formulario financiero</button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </form>
    </section>
  );
}
