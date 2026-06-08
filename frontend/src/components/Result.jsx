import React from "react";

export default function Result({ data }) {
  const { score, classification, risks = [], recommendations = [], ai_explanation } = data;
  const visibleScore = Number.isFinite(Number(score)) ? Math.round(Number(score)) : score;
  const tone = classification === "Alto" ? "high" : classification === "Medio" ? "medium" : "low";
  const briefRecommendations = recommendations.slice(0, 3);

  return (
    <div className="result-panel">
      <div className="result-header">
        <div>
          <span className="eyebrow">Resultado</span>
          <h2>Score financiero preliminar</h2>
          <p>Resultado orientativo. No corresponde a una aprobacion bancaria ni reemplaza una evaluacion formal.</p>
        </div>
        <div className={`score-badge ${tone}`}>
          <strong>{visibleScore}</strong>
          <span>{classification}</span>
        </div>
      </div>

      <div className="result-grid">
        <section>
          <strong>Explicacion mejorada con IA</strong>
          <p>{ai_explanation}</p>
        </section>

        <section>
          <strong>Puntos a revisar</strong>
          <ul>
            {risks.length ? risks.map((risk, i) => <li key={i}>{risk}</li>) : <li>No se detectan riesgos principales declarados.</li>}
          </ul>
        </section>

        <section className="recommendation-section">
          <strong>Recomendaciones breves</strong>
          <ul>
            {briefRecommendations.length ? (
              briefRecommendations.map((step, i) => <li key={i}>{step}</li>)
            ) : (
              <li>Revisa tu situacion con antecedentes formales antes de tomar una decision.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
