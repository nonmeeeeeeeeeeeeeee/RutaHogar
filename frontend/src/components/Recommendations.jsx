import React, { useMemo } from "react";
import { buildRecommendations } from "../services/recommendationService";

const formatScore = (score) => (Number.isFinite(Number(score)) ? Math.round(Number(score)) : "Sin score");

export default function Recommendations({ evaluation, onStartEvaluation }) {
  const data = useMemo(() => buildRecommendations(evaluation), [evaluation]);

  if (!data) {
    return (
      <section className="section-block recommendations-panel">
        <div className="section-heading">
          <span className="eyebrow">Recomendaciones inteligentes</span>
          <h1>Orientación personalizada</h1>
        </div>
        <div className="empty-state">
          <strong>Aún no tienes una preevaluación.</strong>
          <p>Realiza una preevaluación para generar recomendaciones personalizadas.</p>
          <button type="button" onClick={onStartEvaluation}>Ir a precalificación</button>
        </div>
      </section>
    );
  }

  return (
    <section className="section-block recommendations-panel">
      <div className="section-heading">
        <span className="eyebrow">Recomendaciones inteligentes</span>
        <h1>Orientación personalizada</h1>
        <p>Recomendaciones generales basadas en tu última preevaluación, sin exponer reglas internas del score.</p>
      </div>

      <div className="recommendation-summary">
        <div className="score-badge-wrap">
          <span>Score actual</span>
          <strong>{formatScore(data.score)}</strong>
          <small>{data.classification}</small>
        </div>
        <p>{data.summary}</p>
      </div>

      <div className="recommendation-grid">
        <section>
          <strong>Recomendaciones personalizadas</strong>
          <ul>
            {data.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <strong>Acciones sugeridas</strong>
          <ul>
            {data.actions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="warning-note">
        Esta orientación no reemplaza una evaluación bancaria formal.
      </div>
    </section>
  );
}
