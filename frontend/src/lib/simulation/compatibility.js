const DEFAULT_UF_CLP = 40695;
const MIN_DOWN_PAYMENT_RATE = 0.10;
const RECOMMENDED_DOWN_PAYMENT_RATE = 0.20;
const PRUDENT_DIVIDEND_RATE = 0.25;
const HIGH_DEBT_RATE = 0.40;
const MODERATE_DOWN_PAYMENT_GAP_RATE = 0.25;
const CLEAR_DIVIDEND_EXCESS_RATE = 1.15;

const statusRank = {
  Compatible: 0,
  Cercano: 1,
  "Requiere ajuste": 2,
};

const timelineLabels = {
  "0_3_meses": "Tu horizonte es corto, por eso conviene mirar primero brechas inmediatas de pie, deuda y dividendo.",
  "3_6_meses": "Tu horizonte permite ajustar algunas brechas, pero conviene priorizar escenarios con baja diferencia de pie y dividendo.",
  "6_12_meses": "Tu horizonte permite planificar ahorro o reducción de deuda antes de avanzar con mayor seguridad.",
  mas_12_meses: "Tu horizonte permite explorar mejoras graduales, manteniendo la simulación como referencia.",
};

function toNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeType(value) {
  const text = normalizeText(value);
  if (text.includes("departamento")) return "departamento";
  if (text.includes("casa") || text.includes("vivienda")) return "casa";
  return text || "";
}

function getUfValue(input = {}) {
  return toNumber(input.uf_value_clp) || DEFAULT_UF_CLP;
}

function projectToScenario(project, ufValueClp) {
  const valueUf = toNumber(project?.valor_uf);
  const valueClp = toNumber(project?.valor_clp) || Math.round(valueUf * ufValueClp);
  return {
    id: project?.id || "manual",
    source: "project",
    label: project?.nombre || "Proyecto referencial",
    comuna: project?.comuna || "",
    tipo_vivienda: project?.tipo_vivienda || "",
    valueUf,
    valueClp,
    project,
  };
}

export function getScenarioFromManualValue(valueUf, ufValueClp) {
  const numericUf = toNumber(valueUf);
  return {
    id: "manual",
    source: "manual",
    label: "Valor manual",
    comuna: "",
    tipo_vivienda: "",
    valueUf: numericUf,
    valueClp: Math.round(numericUf * ufValueClp),
    project: null,
  };
}

function getIncomeForCapacity(input = {}) {
  const ownIncome = toNumber(input.ingreso_mensual);
  const ownDebt = toNumber(input.deuda_mensual);
  const hasComplement = input.complemento_renta === true || input.complemento_renta === "si";
  const complementIncome = hasComplement ? toNumber(input.ingreso_mensual_complementario) : 0;
  const complementDebt = hasComplement ? toNumber(input.deuda_mensual_complementario) : 0;

  return {
    income: ownIncome + complementIncome,
    debt: ownDebt + complementDebt,
    ownIncome,
    ownDebt,
    complementIncome,
    complementDebt,
    hasComplement,
  };
}

function getDividendForScenario(input = {}, scenario) {
  const declaredDividend = toNumber(input.dividendo_estimado);
  if (declaredDividend > 0) return declaredDividend;

  return 0;
}

function getScoreNumber(input = {}) {
  const score = toNumber(input.score);
  return score || toNumber(input.financial_score);
}

function hasMediumHighScore(input = {}) {
  const classification = String(input.classification || "").toLowerCase();
  const score = getScoreNumber(input);
  return classification === "alto" || classification === "medio" || score >= 60;
}

function getMainGap({ income, debtRatio, gapMinimo, gapRecomendado, dividend, prudentDividend, valueClp, maxByMinDownPayment }) {
  if (income <= 0) return "ingreso";
  if (gapMinimo > 0) return "pie";
  if (debtRatio > HIGH_DEBT_RATE) return "deuda";
  if (dividend > 0 && dividend > prudentDividend) return "plazo/dividendo";
  if (maxByMinDownPayment > 0 && valueClp > maxByMinDownPayment) return "valor objetivo";
  if (gapRecomendado > 0) return "pie";
  return null;
}

function buildStatus({ input, income, debtRatio, gapMinimo, pieMinimo, gapRecomendado, dividend, prudentDividend, valueClp, maxByMinDownPayment }) {
  const missingCritical = income <= 0 || valueClp <= 0;
  const highDebt = debtRatio > HIGH_DEBT_RATE;
  const dividendTooHigh = dividend > 0 && dividend > prudentDividend;
  const dividendClearlyTooHigh = dividend > 0 && dividend > prudentDividend * CLEAR_DIVIDEND_EXCESS_RATE;
  const missingDownPayment = gapMinimo > 0;
  const downPaymentGapRate = pieMinimo > 0 ? gapMinimo / pieMinimo : 0;
  const largeDownPaymentGap = missingDownPayment && downPaymentGapRate > MODERATE_DOWN_PAYMENT_GAP_RATE;
  const valueAboveRange = maxByMinDownPayment > 0 && valueClp > maxByMinDownPayment;
  const valueClearlyAboveRange = valueAboveRange && largeDownPaymentGap;
  const canBeNear =
    hasMediumHighScore(input) &&
    !missingCritical &&
    !highDebt &&
    !dividendClearlyTooHigh &&
    !largeDownPaymentGap;

  if (missingCritical || highDebt || dividendClearlyTooHigh || largeDownPaymentGap || valueClearlyAboveRange) {
    return "Requiere ajuste";
  }

  if ((missingDownPayment || dividendTooHigh || valueAboveRange) && canBeNear) return "Cercano";
  if (missingDownPayment || dividendTooHigh || valueAboveRange) return "Requiere ajuste";

  const closeToDividendLimit = dividend > 0 && dividend > prudentDividend * 0.9;
  const closeToMinDownPayment = gapRecomendado > 0;

  if (closeToMinDownPayment || closeToDividendLimit) return "Cercano";
  return "Compatible";
}

function getRecommendation(mainGap) {
  const recommendations = {
    ingreso: "Revisa si puedes aumentar ingreso acreditable o buscar un escenario de menor valor.",
    pie: "Aumentar el ahorro disponible o elegir una alternativa de menor valor puede acercarte al objetivo.",
    deuda: "Reducir compromisos mensuales puede mejorar tu holgura para asumir un dividendo.",
    "plazo/dividendo": "Revisa plazo, dividendo esperado o un valor de vivienda menor antes de avanzar.",
    "valor objetivo": "Compara con alternativas de menor valor o con comunas más accesibles.",
  };
  return recommendations[mainGap] || "Mantén tus antecedentes actualizados antes de una evaluación formal.";
}

function getStatusMessage(status, mainGap, horizon, details = {}) {
  if (status === "Compatible") {
    return "Este escenario es Compatible porque tu ahorro cubre el pie mínimo y la carga estimada se mantiene dentro de un rango prudente.";
  }
  if (status === "Cercano") {
    if (mainGap === "pie" && details.gapMinimoUf > 0) {
      return `Este escenario es Cercano porque tu perfil general ayuda, pero aún existe una brecha de pie de ${Math.ceil(details.gapMinimoUf).toLocaleString("es-CL")} UF.`;
    }
    return horizon === "0_3_meses"
      ? "Este escenario esta cerca, pero conviene resolver la brecha inmediata antes de avanzar."
      : "Este escenario esta cerca de tu capacidad actual y podria mejorar con ahorro o ajuste gradual.";
  }

  const byGap = {
    ingreso: "El ingreso declarado no sostiene con holgura el dividendo de este escenario.",
    pie:
      details.gapMinimoUf > 0
        ? `Este escenario Requiere ajuste porque el pie mínimo requerido es de ${Math.ceil(details.pieMinimoUf).toLocaleString("es-CL")} UF y tu ahorro disponible es de ${Math.floor(details.savingsUf).toLocaleString("es-CL")} UF.`
        : "La principal brecha es el pie disponible para este valor de vivienda.",
    deuda: "La deuda mensual actual reduce tu holgura para asumir un dividendo.",
    "plazo/dividendo": "El dividendo estimado podria ser alto para tu ingreso actual.",
    "valor objetivo": "El valor objetivo esta sobre el rango referencial por ahorro disponible.",
  };
  return byGap[mainGap] || "Este escenario requiere ajustes importantes antes de avanzar.";
}

export function evaluateScenario(input = {}, scenario) {
  const ufValueClp = getUfValue(input);
  const valueClp = toNumber(scenario?.valueClp);
  const valueUf = toNumber(scenario?.valueUf) || (ufValueClp > 0 ? valueClp / ufValueClp : 0);
  const savings = toNumber(input.ahorro_disponible);
  const savingsUf = ufValueClp > 0 ? savings / ufValueClp : 0;
  const { income, debt } = getIncomeForCapacity(input);
  const dividend = getDividendForScenario(input, scenario);
  const pieMinimo = Math.round(valueClp * MIN_DOWN_PAYMENT_RATE);
  const pieRecomendado = Math.round(valueClp * RECOMMENDED_DOWN_PAYMENT_RATE);
  const pieMinimoUf = valueUf * MIN_DOWN_PAYMENT_RATE;
  const pieRecomendadoUf = valueUf * RECOMMENDED_DOWN_PAYMENT_RATE;
  const gapMinimo = Math.max(pieMinimo - savings, 0);
  const gapRecomendado = Math.max(pieRecomendado - savings, 0);
  const gapMinimoUf = ufValueClp > 0 ? gapMinimo / ufValueClp : 0;
  const gapRecomendadoUf = ufValueClp > 0 ? gapRecomendado / ufValueClp : 0;
  const prudentDividend = Math.round(income * PRUDENT_DIVIDEND_RATE);
  const debtRatio = income > 0 ? debt / income : 0;
  const maxByMinDownPayment = savings > 0 ? savings / MIN_DOWN_PAYMENT_RATE : 0;
  const maxByRecommendedDownPayment = savings > 0 ? savings / RECOMMENDED_DOWN_PAYMENT_RATE : 0;
  const status = buildStatus({
    input,
    income,
    debtRatio,
    gapMinimo,
    pieMinimo,
    gapRecomendado,
    dividend,
    prudentDividend,
    valueClp,
    maxByMinDownPayment,
  });
  const mainGap = getMainGap({
    income,
    debtRatio,
    gapMinimo,
    gapRecomendado,
    dividend,
    prudentDividend,
    valueClp,
    maxByMinDownPayment,
  });

  return {
    scenario,
    status,
    mainGap,
    message: getStatusMessage(status, mainGap, input.plazo_compra, { gapMinimoUf, pieMinimoUf, savingsUf }),
    recommendation: getRecommendation(mainGap),
    valueClp,
    valueUf,
    savings,
    savingsUf,
    income,
    debt,
    dividend,
    prudentDividend,
    debtRatio,
    pieMinimo,
    pieRecomendado,
    pieMinimoUf,
    pieRecomendadoUf,
    gapMinimo,
    gapRecomendado,
    gapMinimoUf,
    gapRecomendadoUf,
    maxByMinDownPayment,
    maxByRecommendedDownPayment,
    maxByMinDownPaymentUf: ufValueClp > 0 ? maxByMinDownPayment / ufValueClp : 0,
    maxByRecommendedDownPaymentUf: ufValueClp > 0 ? maxByRecommendedDownPayment / ufValueClp : 0,
    ufValueClp,
    horizonMessage: timelineLabels[input.plazo_compra] || timelineLabels["6_12_meses"],
  };
}

function getPreferenceScore(project, onboarding = {}) {
  const targetCommune = normalizeText(onboarding.comuna_interes || onboarding.comuna_objetivo);
  const projectCommune = normalizeText(project?.comuna);
  const preferredType = normalizeType(onboarding.tipo_propiedad || onboarding.tipo_vivienda_preferida);
  const projectType = normalizeType(project?.tipo_vivienda);

  return {
    communeMatch: Boolean(targetCommune && projectCommune && targetCommune === projectCommune),
    typeMatch: Boolean(preferredType && projectType && preferredType === projectType),
  };
}

function getGapAmount(evaluation) {
  if (!evaluation) return Number.MAX_SAFE_INTEGER;
  if (evaluation.mainGap === "pie") return evaluation.gapMinimo || evaluation.gapRecomendado || 0;
  if (evaluation.mainGap === "deuda") return Math.max(evaluation.debt - evaluation.income * HIGH_DEBT_RATE, 0);
  if (evaluation.mainGap === "plazo/dividendo") return Math.max(evaluation.dividend - evaluation.prudentDividend, 0);
  if (evaluation.mainGap === "valor objetivo") return Math.max(evaluation.valueClp - evaluation.maxByMinDownPayment, 0);
  if (evaluation.mainGap === "ingreso") return Number.MAX_SAFE_INTEGER - 1;
  return 0;
}

export function buildSimulationContext(evaluation, onboarding) {
  return {
    ...(evaluation?.input || {}),
    plazo_compra: onboarding?.plazo_compra || evaluation?.onboarding?.plazo_compra || evaluation?.input?.plazo_compra,
    comuna_objetivo:
      onboarding?.comuna_interes ||
      onboarding?.comuna_objetivo ||
      evaluation?.onboarding?.comuna_interes ||
      evaluation?.input?.comuna_objetivo,
    tipo_vivienda_preferida:
      onboarding?.tipo_propiedad ||
      onboarding?.tipo_vivienda_preferida ||
      evaluation?.onboarding?.tipo_propiedad,
    classification: evaluation?.result?.classification,
    score: evaluation?.result?.score,
    risks: evaluation?.result?.risks || [],
  };
}

export function buildAccessibleAlternatives(projects = [], input = {}, onboarding = {}, limit = 4) {
  const ufValueClp = getUfValue(input);
  return projects
    .map((project) => {
      const scenarioEvaluation = evaluateScenario(input, projectToScenario(project, ufValueClp));
      const preference = getPreferenceScore(project, onboarding);
      return {
        ...scenarioEvaluation,
        project,
        preference,
        gapAmount: getGapAmount(scenarioEvaluation),
      };
    })
    .sort((a, b) => {
      const statusDiff = (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9);
      if (statusDiff !== 0) return statusDiff;
      const gapDiff = a.gapAmount - b.gapAmount;
      if (gapDiff !== 0) return gapDiff;
      if (a.preference.communeMatch !== b.preference.communeMatch) return a.preference.communeMatch ? -1 : 1;
      if (a.preference.typeMatch !== b.preference.typeMatch) return a.preference.typeMatch ? -1 : 1;
      return a.valueClp - b.valueClp;
    })
    .slice(0, limit);
}

export function getMaxValueRange(input = {}) {
  const ufValueClp = getUfValue(input);
  const savings = toNumber(input.ahorro_disponible);
  const minRangeClp = savings > 0 ? savings / RECOMMENDED_DOWN_PAYMENT_RATE : 0;
  const maxRangeClp = savings > 0 ? savings / MIN_DOWN_PAYMENT_RATE : 0;
  return {
    minClp: minRangeClp,
    maxClp: maxRangeClp,
    minUf: ufValueClp > 0 ? minRangeClp / ufValueClp : 0,
    maxUf: ufValueClp > 0 ? maxRangeClp / ufValueClp : 0,
    ufValueClp,
  };
}

export { DEFAULT_UF_CLP, HIGH_DEBT_RATE };
