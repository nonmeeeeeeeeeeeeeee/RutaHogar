import React, { useEffect, useMemo, useRef, useState } from "react";
import { mockProjects } from "../data/mockProjects";
import {
  buildAccessibleAlternatives,
  buildSimulationContext,
  evaluateScenario,
  getMaxValueRange,
  getScenarioFromManualValue,
} from "../lib/simulation/compatibility";
import { CLP_FORMATTER } from "../services/financialTracking";
import { plazoLabels, propertyLabels } from "../constants";

const statusClass = {
  Compatible: "compatible",
  Cercano: "near",
  "Requiere ajuste": "adjust",
};

function formatClp(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "$0";
  return CLP_FORMATTER.format(Math.round(number / 1000) * 1000);
}

function formatUf(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "0 UF";
  return `${Math.round(number).toLocaleString("es-CL")} UF`;
}

function formatPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0%";
  return `${Math.round(number * 100)}%`;
}

function formatUfClp(uf, clp) {
  return `${formatUf(uf)} · ${formatClp(clp)}`;
}

function getGapLabel(gap) {
  const labels = {
    ingreso: "Ingreso",
    pie: "Pie",
    deuda: "Deuda",
    "plazo/dividendo": "Plazo/dividendo",
    "valor objetivo": "Valor objetivo",
  };
  return labels[gap] || "Sin brecha crítica";
}

function getComparisonSummary(current, alternative) {
  if (!current || !alternative) return "Selecciona un escenario actual y una alternativa para comparar.";
  if ((statusClass[alternative.status] || "") !== (statusClass[current.status] || "")) {
    return `La alternativa tiene estado ${alternative.status}, frente a ${current.status} del escenario actual.`;
  }
  if (alternative.gapMinimo < current.gapMinimo) {
    return `La alternativa reduce la brecha de pie mínimo en ${formatClp(current.gapMinimo - alternative.gapMinimo)}.`;
  }
  if (alternative.valueClp < current.valueClp) {
    return `La alternativa tiene un valor menor en ${formatClp(current.valueClp - alternative.valueClp)}.`;
  }
  return "Ambos escenarios tienen una exigencia similar; revisa comuna, tipo de vivienda y brecha principal.";
}

function getProjectLabel(project) {
  if (!project) return "Valor manual";
  return `${project.nombre} · ${project.comuna} · ${formatUf(project.valor_uf)}`;
}

function RecommendationEmpty({ onStartEvaluation }) {
  return (
    <section className="section-block simulation-page">
      <div className="section-heading">
        <span className="eyebrow">Simulación</span>
        <h1>Simulación de compatibilidad</h1>
        <p>Necesitas una preevaluación guardada para comparar escenarios con tu perfil financiero actual.</p>
      </div>
      <div className="empty-state">
        <strong>Aún no tienes una evaluación disponible.</strong>
        <p>Completa la preevaluación para activar simulaciones referenciales de vivienda.</p>
        <button type="button" onClick={onStartEvaluation}>Ir a precalificación</button>
      </div>
    </section>
  );
}

export default function SimulationPage({ evaluation, onboarding, onStartEvaluation }) {
  const context = useMemo(
    () => buildSimulationContext(evaluation, onboarding),
    [evaluation, onboarding],
  );
  const ufValueClp = Number(context.uf_value_clp) || 40695;
  const [mode, setMode] = useState("project");
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0]?.id || "");
  const [manualUf, setManualUf] = useState("");
  const [comparison, setComparison] = useState(null);
  const comparisonRef = useRef(null);

  const selectedProject = useMemo(
    () => mockProjects.find((project) => project.id === selectedProjectId) || mockProjects[0] || null,
    [selectedProjectId],
  );

  const manualScenario = useMemo(
    () => getScenarioFromManualValue(manualUf, ufValueClp),
    [manualUf, ufValueClp],
  );

  const scenario = useMemo(() => {
    if (mode === "manual") return manualScenario;
    if (!selectedProject) return null;
    return {
      id: selectedProject.id,
      source: "project",
      label: selectedProject.nombre,
      comuna: selectedProject.comuna,
      tipo_vivienda: selectedProject.tipo_vivienda,
      valueUf: Number(selectedProject.valor_uf) || 0,
      valueClp: Number(selectedProject.valor_clp) || Math.round((Number(selectedProject.valor_uf) || 0) * ufValueClp),
      project: selectedProject,
    };
  }, [manualScenario, mode, selectedProject, ufValueClp]);

  const scenarioResult = useMemo(
    () => scenario ? evaluateScenario(context, scenario) : null,
    [context, scenario],
  );
  const alternatives = useMemo(
    () => buildAccessibleAlternatives(mockProjects, context, onboarding, 4),
    [context, onboarding],
  );
  const maxRange = useMemo(() => getMaxValueRange(context), [context]);
  const hasManualValue = mode !== "manual" || Number(manualUf) > 0;
  const currentComparable = scenarioResult && hasManualValue ? scenarioResult : null;

  useEffect(() => {
    if (comparison && comparisonRef.current) {
      comparisonRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [comparison]);

  const handleCompareAlternative = (item) => {
    if (!currentComparable) {
      setComparison({ error: true });
      return;
    }
    setComparison({
      current: currentComparable,
      alternative: item,
    });
  };

  if (!evaluation) {
    return <RecommendationEmpty onStartEvaluation={onStartEvaluation} />;
  }

  const typePreference =
    propertyLabels[onboarding?.tipo_propiedad] ||
    propertyLabels[context.tipo_vivienda_preferida] ||
    context.tipo_vivienda_preferida ||
    "Sin preferencia";
  const targetCommune = onboarding?.comuna_interes || context.comuna_objetivo || "Sin comuna";
  const horizon = plazoLabels[onboarding?.plazo_compra || context.plazo_compra] || "Sin plazo";

  return (
    <section className="section-block simulation-page">
      <div className="section-heading">
        <span className="eyebrow">Simulación</span>
        <h1>Compatibilidad y alternativas</h1>
        <p>
          Compara proyectos referenciales o ingresa un valor de vivienda para estimar brechas con los datos de tu última preevaluación.
        </p>
      </div>

      <div className="simulation-disclaimer">
        Esta simulación es referencial y se basa en datos declarados. No corresponde a aprobación bancaria, preaprobación, tasación ni cotización formal.
      </div>

      <div className="simulation-layout">
        <div className="simulator-panel">
          <div className="simulation-actions">
            <div className="segmented-control simulation-mode">
              <button className={mode === "project" ? "is-active" : ""} type="button" onClick={() => setMode("project")}>
                Proyecto referencial
              </button>
              <button className={mode === "manual" ? "is-active" : ""} type="button" onClick={() => setMode("manual")}>
                Valor manual
              </button>
            </div>
          </div>

          {mode === "project" ? (
            <label className="simulator-field">
              Proyecto referencial
              <select value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)}>
                {mockProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {getProjectLabel(project)}
                  </option>
                ))}
              </select>
              <span className="field-help">
                Los proyectos mostrados son referenciales para simulación y pueden no representar disponibilidad real.
              </span>
            </label>
          ) : (
            <label className="simulator-field">
              Valor de vivienda en UF
              <input
                min="0"
                inputMode="numeric"
                type="number"
                value={manualUf}
                onChange={(event) => setManualUf(event.target.value)}
                placeholder="Ej: 2800"
              />
              <span className="field-help">Se mostrará su equivalente aproximado en CLP usando la UF referencial disponible.</span>
            </label>
          )}

          <div className="simulation-context">
            <article>
              <span>Comuna objetivo</span>
              <strong>{targetCommune}</strong>
            </article>
            <article>
              <span>Tipo preferido</span>
              <strong>{typePreference}</strong>
            </article>
            <article>
              <span>Horizonte</span>
              <strong>{horizon}</strong>
            </article>
          </div>
        </div>

        <div className="simulator-panel">
          <h2>Rango referencial por ahorro</h2>
          <p>
            Este rango estima valores de vivienda según tu ahorro disponible. No es el pie requerido del proyecto ni representa financiamiento aprobado.
          </p>
          <p className="simulation-formula-note">
            Pie mínimo del escenario = 10% del valor. Pie recomendado = 20% del valor.
          </p>
          <div className="simulation-range">
            <article>
              <span>Vivienda estimada con pie recomendado</span>
              <strong>{formatUf(maxRange.minUf)}</strong>
              <small>{formatClp(maxRange.minClp)}</small>
            </article>
            <article>
              <span>Vivienda estimada con pie mínimo</span>
              <strong>{formatUf(maxRange.maxUf)}</strong>
              <small>{formatClp(maxRange.maxClp)}</small>
            </article>
          </div>
        </div>
      </div>

      <div className="simulation-comparison comparison-summary-panel" ref={comparisonRef}>
        <div className="section-heading compact">
          <span className="eyebrow">Comparación</span>
          <h2>Escenario actual vs alternativa</h2>
          <p>
            {comparison?.current && comparison?.alternative
              ? getComparisonSummary(comparison.current, comparison.alternative)
              : "Selecciona una alternativa desde las opciones accesibles para compararla con tu escenario actual."}
          </p>
        </div>

        {comparison?.error || !currentComparable ? (
          <div className="warning-box">
            Primero selecciona o simula un escenario base para comparar.
          </div>
        ) : null}

        <div className="comparison-grid">
          {[{ label: "Escenario A", data: comparison?.current || currentComparable }, { label: "Escenario B", data: comparison?.alternative }].map((item) => (
            <article className={!item.data ? "comparison-empty" : ""} key={item.label}>
              <span className="eyebrow">{item.label}</span>
              {item.data ? (
                <>
                  <h3>{item.data.scenario?.label || item.data.project?.nombre}</h3>
                  <dl>
                    <dt>Valor vivienda</dt>
                    <dd>{formatUfClp(item.data.valueUf, item.data.valueClp)}</dd>
                    <dt>Comuna</dt>
                    <dd>{item.data.scenario?.comuna || item.data.project?.comuna || "Sin comuna"}</dd>
                    <dt>Tipo vivienda</dt>
                    <dd>{propertyLabels[item.data.scenario?.tipo_vivienda] || propertyLabels[item.data.project?.tipo_vivienda] || item.data.scenario?.tipo_vivienda || "Sin tipo"}</dd>
                    <dt>Estado</dt>
                    <dd>{item.data.status}</dd>
                    <dt>Pie mínimo requerido</dt>
                    <dd>{formatUfClp(item.data.pieMinimoUf, item.data.pieMinimo)}</dd>
                    <dt>Pie recomendado</dt>
                    <dd>{formatUfClp(item.data.pieRecomendadoUf, item.data.pieRecomendado)}</dd>
                    <dt>Ahorro disponible</dt>
                    <dd>{formatUfClp(item.data.savingsUf, item.data.savings)}</dd>
                    <dt>Brecha de pie</dt>
                    <dd>{formatUfClp(item.data.gapMinimoUf, item.data.gapMinimo)}</dd>
                    <dt>Brecha principal</dt>
                    <dd>{getGapLabel(item.data.mainGap)}</dd>
                  </dl>
                </>
              ) : (
                <p>Selecciona una alternativa para compararla con tu escenario actual.</p>
              )}
            </article>
          ))}
        </div>

        <div className="simulation-disclaimer">
          Comparación referencial basada en datos declarados. No corresponde a aprobación bancaria, preaprobación, tasación ni cotización formal.
        </div>
      </div>

      {scenarioResult && hasManualValue ? (
        <div className="simulation-result-card">
          <div className="result-header">
            <div>
              <span className="eyebrow">Escenario evaluado</span>
              <h2>{scenario.label}</h2>
              <p>{scenario.comuna || "Valor ingresado manualmente"} · {scenario.tipo_vivienda || "Tipo no especificado"}</p>
            </div>
            <span className={`simulation-status ${statusClass[scenarioResult.status] || "adjust"}`}>
              {scenarioResult.status}
            </span>
          </div>

          <p className="simulation-message">{scenarioResult.message}</p>
          <p className="simulation-message"><strong>Recomendación:</strong> {scenarioResult.recommendation}</p>
          <p className="simulation-horizon">{scenarioResult.horizonMessage}</p>

          <div className="sim-metrics">
            <div className="metric metric-highlight">
              <span>Valor escenario</span>
              <strong>{formatUfClp(scenarioResult.valueUf, scenarioResult.valueClp)}</strong>
            </div>
            <div className="metric">
              <span>Pie mínimo requerido</span>
              <strong>{formatUfClp(scenarioResult.pieMinimoUf, scenarioResult.pieMinimo)}</strong>
              <small>Brecha: {formatUfClp(scenarioResult.gapMinimoUf, scenarioResult.gapMinimo)}</small>
            </div>
            <div className="metric">
              <span>Pie recomendado</span>
              <strong>{formatUfClp(scenarioResult.pieRecomendadoUf, scenarioResult.pieRecomendado)}</strong>
              <small>Brecha: {formatUfClp(scenarioResult.gapRecomendadoUf, scenarioResult.gapRecomendado)}</small>
            </div>
            <div className="metric">
              <span>Ahorro disponible</span>
              <strong>{formatUfClp(scenarioResult.savingsUf, scenarioResult.savings)}</strong>
              <small>UF referencial: {formatClp(scenarioResult.ufValueClp)}</small>
            </div>
            <div className="metric">
              <span>Brecha principal</span>
              <strong>{getGapLabel(scenarioResult.mainGap)}</strong>
              <small>Deuda/ingreso: {formatPercent(scenarioResult.debtRatio)}</small>
            </div>
          </div>
        </div>
      ) : (
        <div className="warning-box">
          Ingresa un valor de vivienda en UF para calcular el escenario manual.
        </div>
      )}

      <div className="alternatives-block">
        <div className="section-heading compact">
          <span className="eyebrow">Alternativas referenciales</span>
          <h2>Opciones más accesibles</h2>
          <p>
            Ordenadas por compatibilidad, menor brecha, comuna y tipo de vivienda preferidos. El horizonte ajusta mensajes, no cambia el score.
          </p>
        </div>

        <div className="alternative-grid">
          {alternatives.map((item) => (
            <article className="alternative-card simulation-alternative" key={item.project.id}>
              <div>
                <span className={`simulation-status ${statusClass[item.status] || "adjust"}`}>{item.status}</span>
                <h3>{item.project.nombre}</h3>
                <p>{item.project.comuna} · {propertyLabels[item.project.tipo_vivienda] || item.project.tipo_vivienda}</p>
              </div>
              <strong>{formatUf(item.valueUf)} · {formatClp(item.valueClp)}</strong>
              <p>Brecha principal: {getGapLabel(item.mainGap)}</p>
              <p>Pie mínimo: {formatUfClp(item.pieMinimoUf, item.pieMinimo)}</p>
              {item.preference.communeMatch ? <span className="alternative-benefit">Coincide con tu comuna objetivo</span> : null}
              {item.preference.typeMatch ? <span className="alternative-benefit">Coincide con tu tipo de vivienda</span> : null}
              <small>{item.project.descripcion_corta}</small>
              <button
                className="secondary-button compact-button"
                type="button"
                onClick={() => handleCompareAlternative(item)}
              >
                Comparar
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
