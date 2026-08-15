import React, { useEffect, useMemo, useRef, useState } from "react";
import { buildFinancialTracking, goalStatuses } from "../services/financialTracking";
import { formatScore, getClassificationAdjustment, getScoreBadgeClass } from "../utils/helpers";
import {
  buildHousingNotViableRecommendation,
  calculateHousingSavings,
  determinePlanStatus,
  formatClp,
  getHousingPropertyPrice,
} from "../services/housingSavingsPlanService";

const planStatusClass = (status) => {
  if (status === "alcanzado") return "status-alcanzado";
  if (status === "en_curso") return "status-en-curso";
  if (status === "en_progreso") return "status-en-progreso";
  return "status-pendiente";
};

export default function FinancialTracking({
  evaluation,
  goals = [],
  onAcceptPlan,
  onGoalStatusChange,
  onOpenGoalPlan,
  onStartEvaluation,
  onOpenHousingPlan,
  onLogScoringEvent,
  onOpenMilestoneRegistration,
  successMessage,
}) {
  const tracking = useMemo(() => buildFinancialTracking(evaluation), [evaluation]);
  const [housingPieType, setHousingPieType] = useState("minimo");

  const housingInfo = useMemo(() => {
    if (!evaluation) return null;
    const input = evaluation.input || {};
    const price = getHousingPropertyPrice(evaluation);
    if (price <= 0) return null;
    return calculateHousingSavings(input, price);
  }, [evaluation]);

  const notViableRecommendation = useMemo(
    () =>
      housingInfo && !housingInfo.isViable
        ? buildHousingNotViableRecommendation(housingInfo)
        : null,
    [housingInfo],
  );

  const loggedNoViableKey = useRef(null);
  useEffect(() => {
    if (housingInfo && !housingInfo.isViable && notViableRecommendation) {
      const key = `${evaluation?.id || ""}:no_viable_shown`;
      if (loggedNoViableKey.current !== key) {
        loggedNoViableKey.current = key;
        onLogScoringEvent?.({
          type: "no_viable_shown",
          details: {
            pie_type: housingPieType,
            debt_reduction: notViableRecommendation.debtReduction,
            income_increase: notViableRecommendation.incomeIncrease,
            message: notViableRecommendation.message,
          },
        });
      }
    }
  }, [housingInfo, housingPieType, notViableRecommendation, evaluation?.id, onLogScoringEvent]);

  const housingStatus = useMemo(() => {
    if (!housingInfo || housingInfo.error) return null;
    return determinePlanStatus(
      housingInfo,
      evaluation?.housing_plan?.progress,
      housingPieType,
      Boolean(evaluation?.housing_plan),
    );
  }, [housingInfo, evaluation?.housing_plan, housingPieType]);

  const shouldShowHousingPlan = housingInfo && !housingInfo.error && housingInfo.price > 0 &&
    housingInfo.currentSavings < housingInfo.pieRecomendado;

  const adjustment = useMemo(
    () => getClassificationAdjustment(evaluation?.result),
    [evaluation?.result],
  );

  if (!tracking) {
    return (
      <section className="section-block tracking-panel">
        <div className="section-heading">
          <span className="eyebrow">Plan de Mejora</span>
          <h1>Mi plan de mejora</h1>
        </div>
        <div className="empty-state">
          <strong>Aún no tienes una preevaluación.</strong>
          <p>Realiza una preevaluación para generar tu plan de mejora.</p>
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

  const refPie = housingPieType === "recomendado" ? housingInfo?.pieRecomendado : housingInfo?.pieMinimo;
  const refGap = housingPieType === "recomendado" ? housingInfo?.gapRecomendado : housingInfo?.gapMinimo;
  const refMonths = housingPieType === "recomendado" ? housingInfo?.monthsRecomendado : housingInfo?.monthsMinimo;
  const currentGap = housingStatus?.remainingGap ?? refGap;

  return (
    <section className="section-block tracking-panel">
      <div className="section-heading">
        <span className="eyebrow">Plan de Mejora</span>
        <h1>Mi plan de mejora</h1>
        <p>Metas accionables para preparar mejor tu situación financiera a partir de tu última preevaluación.</p>
      </div>

      {successMessage && (
        <div className="success-message" style={{ marginBottom: "2rem" }}>
          {successMessage}
        </div>
      )}

      <div className="tracking-summary">
        <div className={`score-badge-wrap ${getScoreBadgeClass(tracking.classification)}`}>
          <span>Score financiero</span>
          <strong>{formatScore(tracking.score, "Sin score")}</strong>
          <small>Clasificación final: {tracking.classification || "Sin clasificación"}</small>
        </div>
        <div>
          <p>{tracking.message}</p>
          {adjustment ? (
            <div className="score-adjustment-note">
              <strong>{adjustment.message}</strong>
              {adjustment.detail ? <p>{adjustment.detail}</p> : null}
            </div>
          ) : null}
        </div>
      </div>

      {tracking.warning && <div className="warning-note">{tracking.warning}</div>}

      {shouldShowHousingPlan && (
        <div className="housing-plan-block">
          <div className="section-heading compact">
            <span className="eyebrow">Plan de ahorro vivienda</span>
            <h2>Plan de ahorro para tu vivienda</h2>
            <p>
              Tu vivienda de <strong>{formatClp(housingInfo.price)}</strong> requiere un PIE
              mínimo de <strong>{formatClp(housingInfo.pieMinimo)}</strong> (10%) y recomendado
              de <strong>{formatClp(housingInfo.pieRecomendado)}</strong> (20%).
              Actualmente tienes <strong>{formatClp(housingInfo.currentSavings)}</strong> ahorrados.
            </p>
          </div>

          <div className="housing-status-bar">
            <div className={"housing-status-indicator " + planStatusClass(housingStatus?.status)}>
              <span className="eyebrow">Estado</span>
              <strong>{housingStatus?.label || "Pendiente"}</strong>
            </div>
            <div className="housing-pie-toggle">
              <span className="eyebrow">Escenario</span>
              <div className="btn-group" role="group">
                <button
                  className={housingPieType === "minimo" ? "btn-group-selected" : ""}
                  onClick={() => setHousingPieType("minimo")}
                >
                  PIE mínimo (10%)
                </button>
                <button
                  className={housingPieType === "recomendado" ? "btn-group-selected" : ""}
                  onClick={() => setHousingPieType("recomendado")}
                >
                  PIE recomendado (20%)
                </button>
              </div>
            </div>
          </div>

          <div className="housing-metrics">
            <div className="metric">
              <span>PIE requerido</span>
              <strong>{formatClp(refPie)}</strong>
            </div>
            <div className={"metric " + (currentGap > 0 ? "metric-warning" : "metric-ok")}>
              <span>Brecha</span>
              <strong>{formatClp(currentGap)}</strong>
            </div>
            <div className="metric">
              <span>Capacidad mensual</span>
              <strong>{formatClp(housingInfo.monthlyCapacity)}</strong>
              <small>Ingreso - Deuda - $550,000 costo vida</small>
            </div>
            <div className="metric metric-highlight">
              <span>Tiempo estimado</span>
              {refMonths ? (
                <strong>{refMonths} meses</strong>
              ) : (
                <strong className="text-warning">No viable</strong>
              )}
              {housingInfo.isViable && (
                <small>Ahorrando {formatClp(housingInfo.monthlyCapacity)} mensual</small>
              )}
            </div>
          </div>

          {!housingInfo.isViable && (
            <div className="warning-note">
              {notViableRecommendation?.message ||
                "Con tu ingreso menos las deudas no alcanzas para cubrir el costo de vida base."}
            </div>
          )}

          <button
            className="secondary-button"
            type="button"
            onClick={() => onOpenHousingPlan?.(housingPieType)}
          >
            Ir al plan detallado
          </button>

          <div className="tracking-actions">
            {evaluation?.housing_plan ? (
              <div className="success-message">
                Plan de ahorro confirmado. Registra tu ahorro mes a mes en el plan detallado.
              </div>
            ) : (
              <>
                <button
                  type="button"
                  disabled={!housingInfo.isViable}
                  onClick={() => onAcceptPlan?.(housingPieType)}
                >
                  Aceptar plan
                </button>
                {!housingInfo.isViable && (
                  <p className="alternative-reason">
                    {notViableRecommendation?.message ||
                      "El plan no es viable actualmente: tu capacidad de ahorro mensual no cubre el costo de vida base."}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="tracking-actions" style={{ marginBottom: "1rem" }}>
        <button type="button" className="primary-button" onClick={onOpenMilestoneRegistration}>
          Registrar Avance / Hito Financiero
        </button>
      </div>

      {evaluation?.plan_accepted_at ? (
        <div className="success-message">Plan activado. Podrás volver a precalificar después de avanzar en tus metas.</div>
      ) : displayedGoals.length > 0 ? (
        <div className="tracking-actions">
          <button type="button" onClick={onAcceptPlan}>Aceptar plan</button>
        </div>
      ) : null}

      {displayedGoals.length === 0 ? (
        <div className="empty-state">
          <strong>Aún no tienes metas de seguimiento guardadas.</strong>
          <p>Puedes usar el plan sugerido de tu última preevaluación como guía inicial.</p>
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

        {tracking.ufNote && <p className="field-help">{tracking.ufNote}</p>}
      </div>
    </section>
  );
}
