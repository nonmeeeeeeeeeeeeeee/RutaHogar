import React from "react";
import { normalizeDisplayList, hasUsableAiText } from "../utils/text";

export default function Result({ data }) {
  const { score, classification, risks = [], recommendations = [], ai_explanation } = data;
  const visibleScore = Number.isFinite(Number(score)) ? Math.round(Number(score)) : score;
  const tone = classification === "Alto" ? "high" : classification === "Medio" ? "medium" : "low";
  const visibleRisks = normalizeDisplayList(risks);
  const briefRecommendations = normalizeDisplayList(recommendations).slice(0, 3);
  const hasExplanation = hasUsableAiText(ai_explanation);

  return (
    <div className="result-panel">
      <div className="result-header">
        <div>
          <span className="eyebrow">Resultado</span>
          <h2>Score financiero preliminar</h2>
          <p>Resultado orientativo. No corresponde a una aprobación bancaria ni reemplaza una evaluación formal.</p>
        </div>
        <div className={`score-badge ${tone}`}>
          <strong>{visibleScore}</strong>
          <span>{classification}</span>
        </div>
      </div>

      <div className="result-grid">
        <section>
          <strong>Explicación mejorada con IA</strong>
          {hasExplanation ? (
            <p>{ai_explanation}</p>
          ) : (
            <p>La explicación automática no está disponible para esta evaluación.</p>
          )}
        </section>

        <section>
          <strong>Puntos a revisar</strong>
          <ul>
            {visibleRisks.length ? visibleRisks.map((risk, i) => <li key={i}>{risk}</li>) : <li>No se detectan riesgos principales declarados.</li>}
          </ul>
        </section>

        <section className="recommendation-section">
          <strong>Recomendaciones breves</strong>
          <ul>
            {briefRecommendations.length ? (
              briefRecommendations.map((step, i) => <li key={i}>{step}</li>)
            ) : (
              <li>Revisa tu situación con antecedentes formales antes de tomar una decisión.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
