import React, { useMemo } from "react";
import { buildRecommendations } from "../services/recommendationService";
import { formatScore } from "../utils/helpers";

export default function Recommendations({ evaluation, onStartEvaluation, onNavigate }) {
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
        <div className={`score-badge-wrap ${data.classification === "Alto" ? "score-high" : data.classification === "Medio" ? "score-medium" : "score-low"}`}>
          <span>Score actual</span>
          <strong>{formatScore(data.score, "Sin score")}</strong>
          <small>{data.classification}</small>
        </div>
        <p>{data.summary}</p>
      </div>

      {evaluation?.result?.ai_explanation ? (
        <section className="recommendation-ai" style={{ marginBottom: "1.5rem" }}>
          <strong>Explicación mejorada con IA</strong>
          <p>{evaluation.result.ai_explanation}</p>
        </section>
      ) : null}

      <div className="recommendation-grid">
        <section>
          <strong>Recomendaciones personalizadas</strong>
          <ul>
            {data.recommendations.map((item) => (
              <li key={item.text}>
                {item.text}
                {item.benefit && <p className="benefit"><b>Beneficio esperado: </b>{item.benefit}</p>}
              </li>
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

      {data.classification === "Bajo" && (
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button className="primary-button" type="button" onClick={() => onNavigate?.("tracking")}>
            Ver Plan de Mejora
          </button>
        </div>
      )}
    </section>
  );
}
