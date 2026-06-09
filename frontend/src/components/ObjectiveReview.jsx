import React from "react";

const timelineLabels = {
  "0_3_meses": "0 a 3 meses",
  "3_6_meses": "3 a 6 meses",
  "6_12_meses": "6 a 12 meses",
  mas_12_meses: "Más de 12 meses",
};

const propertyLabels = {
  departamento: "Departamento",
  casa: "Casa",
  aun_no_lo_se: "Aun no lo sé",
  indiferente: "Indiferente",
};

export default function ObjectiveReview({ evaluation, onBack }) {
  const onboarding = evaluation?.onboarding || {};
  const input = evaluation?.input || {};

  return (
    <section className="section-block objective-review">
      <button className="secondary-button compact-button" type="button" onClick={onBack}>Volver al seguimiento</button>

      <div className="section-heading compact">
        <span className="eyebrow">Revisión de objetivo</span>
        <h1>Revisar alternativas</h1>
        <p>Si el objetivo se ve exigente, considera ajustar plazo, comuna, tipo de propiedad o dividendo esperado.</p>
      </div>

      <div className="profile-grid">
        <section className="profile-card">
          <strong>Objetivo actual</strong>
          <dl className="profile-details">
            <div>
              <dt>Comuna objetivo</dt>
              <dd>{onboarding.comuna_interes || input.comuna_objetivo || "No declarada"}</dd>
            </div>
            <div>
              <dt>Comuna alternativa</dt>
              <dd>{onboarding.comuna_alternativa || "No declarada"}</dd>
            </div>
            <div>
              <dt>Tipo de propiedad</dt>
              <dd>{propertyLabels[onboarding.tipo_propiedad] || "No declarado"}</dd>
            </div>
            <div>
              <dt>Plazo actual</dt>
              <dd>{timelineLabels[onboarding.plazo_compra] || "No declarado"}</dd>
            </div>
            <div>
              <dt>Dividendo esperado</dt>
              <dd>{input.dividendo_estimado ? `$${Number(input.dividendo_estimado).toLocaleString("es-CL")}` : "No declarado"}</dd>
            </div>
          </dl>
        </section>

        <section className="profile-card">
          <strong>Orientacion</strong>
          <p>
            No es necesario cambiar tu objetivo de inmediato. Usa esta revisión para comparar alternativas
            antes de repetir una preevaluación o iniciar una evaluación bancaria formal.
          </p>
          <ul>
            <li>Revisar si el plazo declarado da espacio suficiente para ahorrar.</li>
            <li>Comparar comuna objetivo y comuna alternativa.</li>
            <li>Evaluar un dividendo esperado mas holgado si el objetivo se siente exigente.</li>
          </ul>
        </section>
      </div>
    </section>
  );
}
