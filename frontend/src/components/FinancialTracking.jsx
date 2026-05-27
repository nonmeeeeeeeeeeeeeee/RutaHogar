import React, { useMemo } from "react";
import { buildFinancialTracking, goalStatuses } from "../services/financialTracking";

const formatScore = (score) => (Number.isFinite(Number(score)) ? Math.round(Number(score)) : "Sin score");

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
          <strong>Aun no tienes una preevaluacion.</strong>
          <p>Realiza una preevaluacion para generar tu seguimiento financiero.</p>
          <button type="button" onClick={onStartEvaluation}>Iniciar pre-evaluacion</button>
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
        <p>Metas accionables para preparar mejor tu situacion financiera a partir de tu ultima preevaluacion.</p>
      </div>

      <div className="tracking-summary">
        <div className="score-badge-wrap">
          <span>Score actual</span>
          <strong>{formatScore(tracking.score)}</strong>
          <small>{tracking.classification}</small>
        </div>
        <p>{tracking.message}</p>
      </div>

      {tracking.warning && <div className="warning-note">{tracking.warning}</div>}

      {evaluation?.plan_accepted_at ? (
        <div className="success-message">Plan activado. Podras volver a precalificar despues de avanzar en tus metas.</div>
      ) : displayedGoals.length > 0 ? (
        <div className="tracking-actions">
          <button type="button" onClick={onAcceptPlan}>Aceptar plan</button>
        </div>
      ) : null}

      {displayedGoals.length === 0 ? (
        <div className="empty-state">
          <strong>No hay informacion suficiente para generar un plan detallado.</strong>
          <p>Realiza una preevaluacion completa para generar metas mensuales y acciones sugeridas.</p>
          <button type="button" onClick={onStartEvaluation}>Ir a precalificacion</button>
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
