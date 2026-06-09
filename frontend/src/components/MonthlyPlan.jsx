import React, { useEffect, useMemo, useState } from "react";
import { buildMonthlyPlan, formatClp, isMonetaryPlanGoal, serializeMonthlyProgress } from "../services/monthlyPlanService";

export default function MonthlyPlan({ evaluation, goal, onBack, onSaveProgress }) {
  const [progressData, setProgressData] = useState(goal?.progress_data || null);
  const hasMonetaryGoal = isMonetaryPlanGoal(goal);
  const plan = useMemo(() => buildMonthlyPlan(evaluation, progressData), [evaluation, progressData]);

  useEffect(() => {
    setProgressData(goal?.progress_data || null);
  }, [goal?.id, goal?.progress_data]);

  const updateMonth = (monthId, value) => {
    const nextAmount = value === "" ? "" : Math.max(Number(value) || 0, 0);
    const draftProgress = {
      months: plan.monthsData.map((month) => ({
        id: month.id,
        label: month.label,
        savedAmount: month.id === monthId ? nextAmount : month.savedAmount,
      })),
    };
    const nextPlan = buildMonthlyPlan(evaluation, draftProgress);
    const serializedProgress = serializeMonthlyProgress(nextPlan.monthsData);

    setProgressData(serializedProgress);
    onSaveProgress?.(goal.id, serializedProgress);
  };

  return (
    <section className="section-block monthly-plan">
      <button className="secondary-button compact-button" type="button" onClick={onBack}>Volver al seguimiento</button>

      <div className="section-heading compact">
        <span className="eyebrow">Plan mensual</span>
        <h1>{goal?.title || "Plan mensual de ahorro"}</h1>
        <p>Este plan considera avances desde hoy. Los datos ya declarados se muestran aparte y no se vuelven a contar como avance mensual.</p>
      </div>

      {!hasMonetaryGoal ? (
        <div className="empty-state">
          <strong>Esta meta no requiere ahorro mensual directo.</strong>
          <p>Se activa cuando completes avances relevantes o cuando pase el periodo recomendado antes de volver a precalificar.</p>
        </div>
      ) : !plan.hasValidTarget ? (
        <div className="empty-state">
          <strong>Plan sin metas monetarias calculadas.</strong>
          <p>No hay una meta adicional de ahorro o reduccion mensual para esta evaluación. Mantén estabilidad y revisa tus avances antes de volver a evaluar.</p>
        </div>
      ) : (
        <>
          <div className="plan-progress">
            <div>
              <span>Ahorro declarado actual</span>
              <strong>{formatClp(plan.currentSavings)}</strong>
            </div>
            <div>
              <span>Ahorro adicional logrado</span>
              <strong>{formatClp(plan.totalSaved)} de {formatClp(plan.additionalTarget)}</strong>
            </div>
            <div>
              <span>Progreso del plan</span>
              <strong>{plan.progressPercent}%</strong>
            </div>
          </div>

          <div className="progress-bar" aria-label={`Progreso del plan ${plan.progressPercent}%`}>
            <span style={{ width: `${plan.progressPercent}%` }} />
          </div>

          <div className="monthly-timeline">
            {plan.monthsData.map((month) => (
              <article className={`month-card ${month.status}`} key={month.id}>
                <div>
                  <span className="eyebrow">{month.label}</span>
                  <h3>{statusLabels[month.status]}</h3>
                  <p>Meta base: {formatClp(month.baseTarget)}</p>
                  <p>Deficit anterior: {formatClp(month.previousDeficit)}</p>
                  <strong>Meta ajustada: {formatClp(month.adjustedTarget)}</strong>
                </div>

                <label>
                  ¿Cuánto lograste ahorrar este mes?
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={month.savedAmount}
                    onChange={(event) => updateMonth(month.id, event.target.value)}
                    placeholder="Ej: 100000"
                  />
                </label>

                <div className="month-footer">
                  <span>Acumulado esperado: {formatClp(month.expectedAccumulated)}</span>
                  <span>Acumulado real: {formatClp(month.accumulated)}</span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
