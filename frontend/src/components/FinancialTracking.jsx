import React, { useMemo } from "react";
import { buildFinancialTracking, goalStatuses } from "../services/financialTracking";
import { formatScore } from "../utils/helpers";

const scoreColorClass = (score) => {
  const n = Number(score);
  if (!Number.isFinite(n)) return "";
  if (n >= 60) return "score-high";
  if (n <= 40) return "score-low";
  return "score-medium";
};

export default function FinancialTracking({
  evaluation,
  goals = [],
  onAcceptPlan,
  onGoalStatusChange,
  onOpenGoalPlan,
  onStartEvaluation,
}) {
  const tracking = useMemo(() => buildFinancialTracking(evaluation), [evaluation]);

  if (!tracking) {
    return (
      <section className="section-block tracking-panel">
        <div className="section-heading">
          <span className="eyebrow">Seguimiento financiero</span>
          <h1>Mi plan de mejora</h1>
        </div>
        <div className="empty-state">
          <strong>Aún no tienes una preevaluación.</strong>
          <p>Realiza una preevaluación para generar tu seguimiento financiero.</p>
          <button type="button" onClick={onStartEvaluation}>Iniciar pre-evaluación</button>
        </div>
      </section>
    );
  }

  const displayedGoals = goals.length
    ? tracking.goals.map((goal) => {
        const storedGoal = goals.find((item) => item.title === goal.title || item.id === goal.id);
        return storedGoal ? { ...storedGoal, ...goal, id: storedGoal.id, status: storedGoal.status } : goal;
      })
    : tracking.goals.map((goal) => ({ ...goal, status: "pendiente" }));

  return (
    <section className="section-block tracking-panel">
      <div className="section-heading">
        <span className="eyebrow">Seguimiento financiero</span>
        <h1>Mi plan de mejora</h1>
        <p>Metas accionables para preparar mejor tu situación financiera a partir de tu última preevaluación.</p>
      </div>

      <div className="tracking-summary">
        <div className={`score-badge-wrap ${scoreColorClass(tracking.score)}`}>
          <span>Score actual</span>
          <strong>{formatScore(tracking.score, "Sin score")}</strong>
          <small>{tracking.classification}</small>
        </div>
        <p>{tracking.message}</p>
      </div>

      {tracking.warning && <div className="warning-note">{tracking.warning}</div>}

      {evaluation?.plan_accepted_at ? (
        <div className="success-message">Plan activado. Podrás volver a precalificar después de avanzar en tus metas.</div>
      ) : displayedGoals.length > 0 ? (
        <div className="tracking-actions">
          <button type="button" onClick={onAcceptPlan}>Aceptar plan</button>
        </div>
      ) : null}

      {displayedGoals.length === 0 ? (
        <div className="empty-state">
          <strong>No hay información suficiente para generar un plan detallado.</strong>
          <p>Realiza una preevaluación completa para generar metas mensuales y acciones sugeridas.</p>
          <button type="button" onClick={onStartEvaluation}>Ir a precalificación</button>
        </div>
      ) : null}

      <div className="tracking-goals">
        {displayedGoals.map((goal) => (
          <article className="tracking-goal" key={goal.id}>
            <div>
              <span className="eyebrow">Meta recomendada</span>
              <h3>{goal.title}</h3>
              {goal.description && <p>{goal.description}</p>}
              {goal.timeline && <strong className="goal-timeline">Plazo sugerido: {goal.timeline}</strong>}
              <div className="goal-actions">
                <button
                  className="secondary-button compact-button"
                  type="button"
                  onClick={() => onOpenGoalPlan?.(goal)}
                >
                  {goal.title === "Revisar objetivo inmobiliario" ? "Revisar alternativas" : "Ver plan mensual"}
                </button>
              </div>
            </div>
            <label>
              Estado
              <select
                value={goal.status || "pendiente"}
                onChange={(event) => onGoalStatusChange?.(goal.id, event.target.value)}
              >
                {Object.entries(goalStatuses).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </div>

      {tracking.ufNote && <p className="tracking-footnote">{tracking.ufNote}</p>}
    </section>
  );
}
