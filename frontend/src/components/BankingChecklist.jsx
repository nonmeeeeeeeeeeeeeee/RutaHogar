import React, { useState, useMemo, useEffect } from "react";

const BASE_CHECKLIST = [
  {
    id: "cedula",
    category: "identificacion",
    title: "Cédula de Identidad Vigente",
    subtitle: "Fotocopia legible por ambos lados (Nacional o Extranjero con residencia definitiva).",
    requiredFor: ["dependiente", "independiente"],
    icon: "🆔",
    mitigatesRisks: [],
  },
  {
    id: "domicilio",
    category: "identificacion",
    title: "Comprobante de Domicilio Reciente",
    subtitle: "Boleta de servicio básico (Luz, Agua, Gas, Internet) o Estado de Cuenta bancario con dirección (< 90 días).",
    requiredFor: ["dependiente", "independiente"],
    icon: "🏠",
    mitigatesRisks: [],
  },
  {
    id: "ahorro_vivienda",
    category: "ahorro",
    title: "Cartola de Ahorro / Certificado de Fondos para el Pie",
    subtitle: "Cartola de Cuenta de Ahorro Vivienda, Depósito a Plazo, Fondos Mutuos o comprobante de saldo para Pie.",
    requiredFor: ["dependiente", "independiente"],
    icon: "🏦",
    mitigatesRisks: ["ahorro_bajo", "precio_objetivo", "pie_insuficiente"],
    mitigationReason: "Demuestra la disponibilidad efectiva del ahorro necesario para cubrir el Pie inicial exigido.",
    mitigationBadge: "🎯 Destacado para Mitigar Brecha de Pie",
  },
  {
    id: "subsidio_habitacional",
    category: "ahorro",
    title: "Certificado de Subsidio Habitacional (Si aplica)",
    subtitle: "Certificado de asignación o postulación activa a subsidio estatal (DS1, DS19, DS49).",
    requiredFor: ["dependiente", "independiente"],
    icon: "📜",
    mitigatesRisks: ["ahorro_bajo", "precio_objetivo", "pie_insuficiente"],
    mitigationReason: "El subsidio asignado complementa tu capital inicial y fortalece la viabilidad de aprobación.",
    mitigationBadge: "🎯 Destacado como Aporte al Pie",
  },
  {
    id: "liquidaciones_sueldo",
    category: "ingresos_dep",
    title: "3 a 6 Últimas Liquidaciones de Sueldo",
    subtitle: "Liquidaciones mensuales consecutivas timbradas o firmadas (3 si renta es fija, 6 si es variable).",
    requiredFor: ["dependiente"],
    icon: "📄",
    mitigatesRisks: [],
  },
  {
    id: "cotizaciones_afp",
    category: "ingresos_dep",
    title: "Certificado de Cotizaciones AFP (12 - 24 Meses)",
    subtitle: "Certificado histórico de cotizaciones previsionales con RUT del empleador visible.",
    requiredFor: ["dependiente"],
    icon: "📊",
    mitigatesRisks: [
      "continuidad_baja",
      "continuidad_media",
      "continuidad_laboral_baja",
      "contrato_plazo_fijo",
      "contrato_honorarios_variable",
      "contrato_inestable",
    ],
    mitigationReason: "Acredita tu trayectoria y estabilidad laboral ininterrumpida ante el comité de riesgo bancario.",
    mitigationBadge: "⚡ Destacado para Mitigar Continuidad Laboral",
  },
  {
    id: "certificado_antiguedad",
    category: "ingresos_dep",
    title: "Certificado de Antigüedad Laboral / Anexos de Contrato",
    subtitle: "Documento oficial del empleador especificando cargo, fecha de ingreso, tipo de contrato y vigencia.",
    requiredFor: ["dependiente"],
    icon: "📝",
    mitigatesRisks: [
      "continuidad_baja",
      "continuidad_media",
      "continuidad_laboral_baja",
      "contrato_plazo_fijo",
      "contrato_inestable",
    ],
    mitigationReason: "Confirma estabilidad contractual vigente y respalda tu permanencia laboral a largo plazo.",
    mitigationBadge: "⚡ Destacado para Respaldar Estabilidad",
  },
  {
    id: "carpeta_tributaria_sii",
    category: "ingresos_indep",
    title: "Carpeta Tributaria Electrónica (SII) para Crédito Hipotecario",
    subtitle: "Carpeta oficial emitible en portal SII para 'Solicitud de Crédito' (Formularios 22 y 29 de 24 meses).",
    requiredFor: ["independiente"],
    icon: "💼",
    mitigatesRisks: [
      "contrato_independiente",
      "continuidad_baja",
      "continuidad_media",
      "continuidad_laboral_baja",
      "contrato_inestable",
    ],
    mitigationReason: "Requisito indispensable para independientes que sintetiza facturación, IVA e Impuesto a la Renta.",
    mitigationBadge: "⚡ Documento Clave para Independientes",
  },
  {
    id: "boletas_honorarios",
    category: "ingresos_indep",
    title: "Resumen Anual de Boletas de Honorarios (12-24 Meses)",
    subtitle: "Informe de boletas emitidas obtenido del portal SII demostrando ingresos mensuales recurrentes.",
    requiredFor: ["independiente"],
    icon: "🧾",
    mitigatesRisks: ["contrato_independiente", "contrato_honorarios_variable"],
    mitigationReason: "Demuestra la constancia mensual y recurrencia real de tus ingresos profesionales.",
    mitigationBadge: "⚡ Destacado para Respaldar Honorarios",
  },
  {
    id: "declaracion_f22",
    category: "ingresos_indep",
    title: "Declaración de Impuesto a la Renta (F22) - Últimos 2 Años",
    subtitle: "Comprobante de declaración y pago del Impuesto Anual a la Renta en SII.",
    requiredFor: ["independiente"],
    icon: "🏛️",
    mitigatesRisks: ["contrato_independiente"],
    mitigationReason: "Valida la rentabilidad anual neta declarada formalmente ante el Estado.",
    mitigationBadge: "⚡ Requisito Formal SII",
  },
  {
    id: "aclaracion_morosidad",
    category: "mitigacion_comercial",
    title: "Certificado de Aclaración Comercial / Regularización (DICOM / Boletín)",
    subtitle: "Certificado de Deuda Al Día o Carta de Aclaración de la institución acreedora respaldando el pago completo.",
    requiredFor: ["dependiente", "independiente"],
    icon: "🛡️",
    mitigatesRisks: ["morosidad_alta", "morosidad_media", "morosidad_vigente", "morosidad_desconocida"],
    mitigationReason: "Documento indispensable para levantar bloqueos por deudas informadas ante la banca.",
    mitigationBadge: "🔥 Prioridad Máxima: Desbloqueo Comercial",
  },
  {
    id: "finiquito_credito",
    category: "mitigacion_comercial",
    title: "Finiquito de Créditos Extinguidos / Estado Cero de Tarjetas",
    subtitle: "Comprobante de prepago de créditos o carta de extinción de deuda que certifica liberación de carga mensual.",
    requiredFor: ["dependiente", "independiente"],
    icon: "💳",
    mitigatesRisks: ["deuda_alta", "deuda_actual_alta", "carga_total_alta"],
    mitigationReason: "Demuestra que tus deudas pasadas fueron saldadas, liberando margen inmediato para el dividendo.",
    mitigationBadge: "🔥 Prioridad Máxima: Reducción de Carga",
  },
];

export default function BankingChecklist({ evaluation, input: propInput, result: propResult }) {
  const result = evaluation?.result || propResult || {};
  const input = evaluation?.input || propInput || {};

  // Determine default work regime from input
  const initialRegime = useMemo(() => {
    const contract = (input.tipo_contrato || "").toLowerCase();
    if (contract === "independiente" || contract === "honorarios_variable") {
      return "independiente";
    }
    return "dependiente";
  }, [input.tipo_contrato]);

  const [workRegime, setWorkRegime] = useState(initialRegime);

  // Sync state if initialRegime changes
  useEffect(() => {
    setWorkRegime(initialRegime);
  }, [initialRegime]);

  // Set of active risk/blocker codes detected by scoring API
  const activeRiskCodes = useMemo(() => {
    const codes = new Set();
    if (Array.isArray(result?.risk_codes)) {
      result.risk_codes.forEach((c) => codes.add(c));
    }
    if (Array.isArray(result?.blockers)) {
      result.blockers.forEach((b) => b?.code && codes.add(b.code));
    }
    if (result?.main_blocker?.code) {
      codes.add(result.main_blocker.code);
    }
    // Also check input properties if risk_codes were omitted
    if (input.morosidad_actual === "si") codes.add("morosidad_alta");
    if (input.morosidad_actual === "no_lo_se") codes.add("morosidad_media");
    if (input.tipo_contrato === "independiente") codes.add("contrato_independiente");
    if (input.continuidad_laboral === "menos_6_meses") codes.add("continuidad_baja");
    if (input.continuidad_laboral === "entre_6_y_12_meses") codes.add("continuidad_media");
    return codes;
  }, [result, input]);

  // Checkbox local state
  const storageKey = useMemo(() => {
    const evalId = evaluation?.id || "draft_checklist";
    return `scoreleads_checklist_state_${evalId}`;
  }, [evaluation?.id]);

  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const toggleCheck = (id) => {
    const next = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch (e) {
      console.warn("No se pudo guardar el avance en localStorage", e);
    }
  };

  // Helper to test if an item is highlighted by active risks
  const isItemHighlighted = (item) => {
    return item.mitigatesRisks.some((risk) => activeRiskCodes.has(risk));
  };

  // Items relevant for current work regime
  const relevantItems = useMemo(() => {
    return BASE_CHECKLIST.filter((item) => item.requiredFor.includes(workRegime));
  }, [workRegime]);

  // Priority / Highlighted items (Criterio E2)
  const highlightedItems = useMemo(() => {
    return relevantItems.filter(isItemHighlighted);
  }, [relevantItems, activeRiskCodes]);

  // Progress metrics
  const completedCount = useMemo(() => {
    return relevantItems.filter((item) => checkedItems[item.id]).length;
  }, [relevantItems, checkedItems]);

  const progressPercent = Math.round((completedCount / (relevantItems.length || 1)) * 100);

  const categories = [
    { id: "identificacion", label: "🆔 Identificación y Domicilio" },
    { id: "ahorro", label: "🏦 Ahorro y Capital Inicial" },
    {
      id: workRegime === "independiente" ? "ingresos_indep" : "ingresos_dep",
      label: workRegime === "independiente" ? "💼 Antecedentes Independiente / SII" : "📄 Antecedentes Laborales / AFP",
    },
    { id: "mitigacion_comercial", label: "🛡️ Antecedentes Especiales y Mitigación" },
  ];

  return (
    <section className="section-block banking-checklist-panel">
      <div className="section-heading">
        <span className="eyebrow">HU11 · Criterios E1 & E2</span>
        <h2>Checklist Referencial de Preparación Bancaria</h2>
        <p>
          Organiza la documentación exigida por la banca chilena según tu perfil laboral y antecedentes detectados en tu pre-evaluación.
        </p>
      </div>

      {/* Criterio E1: Explicit Visual Disclaimer Banner */}
      <div className="checklist-disclaimer-banner" role="alert">
        <div className="disclaimer-icon-badge">🛡️</div>
        <div className="disclaimer-text-content">
          <strong>Checklist Formativo y Referencial — NO subas ni envíes documentos a la plataforma</strong>
          <p>
            Esta lista es una guía de preparación personal. ScoreLeads <strong>NO solicita, no almacena ni recibe archivos personales o bancarios sensibles</strong> (cédulas, liquidaciones, claves ni cartolas). Conserva tus documentos en tu dispositivo privado.
          </p>
        </div>
      </div>

      {/* Work Regime Segmented Switch */}
      <div className="checklist-controls-bar">
        <div className="regime-toggle-container">
          <span className="control-label">Régimen Laboral:</span>
          <div className="segmented-control regime-selector">
            <button
              type="button"
              className={workRegime === "dependiente" ? "is-active" : ""}
              onClick={() => setWorkRegime("dependiente")}
            >
              👔 Trabajador Dependiente
            </button>
            <button
              type="button"
              className={workRegime === "independiente" ? "is-active" : ""}
              onClick={() => setWorkRegime("independiente")}
            >
              💼 Independiente / Honorarios
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="checklist-progress-tracker">
          <div className="progress-text-label">
            <span>Progreso de preparación:</span>
            <strong>{completedCount} de {relevantItems.length} preparados ({progressPercent}%)</strong>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Criterio E2: Highlighted Priority Section */}
      {highlightedItems.length > 0 && (
        <div className="priority-mitigation-section">
          <div className="priority-header">
            <span className="priority-badge">🎯 Documentos Prioritarios para tu Caso</span>
            <h3>Antecedentes clave para mitigar observaciones de tu pre-evaluación</h3>
            <p>Destacados dinámicamente según los factores de riesgo o bloqueadores detectados en tu score:</p>
          </div>

          <div className="priority-items-grid">
            {highlightedItems.map((item) => {
              const isChecked = Boolean(checkedItems[item.id]);
              return (
                <div key={`priority-${item.id}`} className={`priority-item-card ${isChecked ? "is-checked" : ""}`}>
                  <div className="priority-card-top">
                    <span className="priority-tag">{item.mitigationBadge}</span>
                    <label className="checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(item.id)}
                      />
                      <span>{isChecked ? "Listo" : "Marcar preparado"}</span>
                    </label>
                  </div>
                  <div className="priority-card-body">
                    <span className="item-icon">{item.icon}</span>
                    <div>
                      <strong className="item-title">{item.title}</strong>
                      <p className="item-subtitle">{item.subtitle}</p>
                    </div>
                  </div>
                  {item.mitigationReason && (
                    <div className="priority-reason-box">
                      <strong>💡 ¿Por qué es prioritario?:</strong> {item.mitigationReason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Categorized Checklist */}
      <div className="checklist-categories-list">
        <h3>Listado General de Antecedentes por Categoría</h3>

        {categories.map((cat) => {
          const categoryItems = relevantItems.filter((i) => i.category === cat.id);
          if (!categoryItems.length) return null;

          return (
            <div key={cat.id} className="checklist-category-block">
              <h4 className="category-title">{cat.label}</h4>
              <div className="category-items-list">
                {categoryItems.map((item) => {
                  const isChecked = Boolean(checkedItems[item.id]);
                  const isHighlighted = isItemHighlighted(item);

                  return (
                    <div
                      key={item.id}
                      className={`checklist-row-item ${isHighlighted ? "is-highlighted" : ""} ${
                        isChecked ? "is-checked" : ""
                      }`}
                    >
                      <div className="item-checkbox-col">
                        <input
                          type="checkbox"
                          id={`chk-${item.id}`}
                          checked={isChecked}
                          onChange={() => toggleCheck(item.id)}
                        />
                      </div>
                      <div className="item-content-col">
                        <label htmlFor={`chk-${item.id}`} className="item-header-label">
                          <span className="item-icon">{item.icon}</span>
                          <strong className="item-name">{item.title}</strong>
                          {isHighlighted && <span className="highlight-pill">{item.mitigationBadge}</span>}
                        </label>
                        <p className="item-desc">{item.subtitle}</p>
                        {isHighlighted && item.mitigationReason && (
                          <div className="item-inline-reason">
                            <strong>Motivo de destacado:</strong> {item.mitigationReason}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
