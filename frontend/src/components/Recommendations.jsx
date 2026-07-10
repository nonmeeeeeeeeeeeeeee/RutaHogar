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

      {evaluation?.result?.improvement_plan?.length > 0 && (
        <div className="improvement-plan-section" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", color: "var(--color-neutral-900)" }}>Plan de Mejora Estratégico</h2>
          <p style={{ marginBottom: "1rem", color: "var(--color-neutral-700)" }}>Priorizado por impacto según tu perfil actual.</p>
          <div className="plan-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {evaluation.result.improvement_plan.map((item, idx) => (
              <div 
                key={idx} 
                className="plan-card" 
                style={{ 
                  padding: "1.2rem", 
                  borderRadius: "8px", 
                  border: `1px solid ${item.impact_level === 'Alto' ? '#ffcccc' : item.impact_level === 'Medio' ? '#fff2cc' : '#cce5ff'}`,
                  backgroundColor: `${item.impact_level === 'Alto' ? '#fff0f0' : item.impact_level === 'Medio' ? '#fffdf0' : '#f0f8ff'}`,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <strong style={{ fontSize: "1.1rem", color: "var(--color-neutral-900)" }}>{item.category}</strong>
                  <span style={{ 
                    fontWeight: "600", 
                    padding: "4px 10px", 
                    borderRadius: "12px", 
                    backgroundColor: item.impact_level === 'Alto' ? '#ef4444' : item.impact_level === 'Medio' ? '#eab308' : '#3b82f6',
                    color: item.impact_level === 'Medio' ? '#000' : '#fff',
                    fontSize: "0.85rem"
                  }}>
                    Impacto: {item.impact_level}
                  </span>
                </div>
                <p style={{ margin: "0 0 0.75rem 0", lineHeight: "1.5", color: "var(--color-neutral-800)" }}>{item.description}</p>
                {item.expected_benefit && (
                  <div style={{ fontSize: "0.95rem", color: "var(--color-neutral-700)", marginTop: "0.5rem", borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "0.75rem" }}>
                    <strong>Beneficio esperado:</strong> {item.expected_benefit}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
