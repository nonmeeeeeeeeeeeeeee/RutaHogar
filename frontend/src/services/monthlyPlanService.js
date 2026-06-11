import { CLP_FORMATTER, timelineMonths } from "./financialTracking";

export function formatClp(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "$0";
  return CLP_FORMATTER.format(Math.round(number / 1000) * 1000);
}

export function isMonetaryPlanGoal(goal) {
  const title = (goal?.title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return [
    "ahorro",
    "deuda",
    "pie",
    "fondo",
    "dividendo",
  ].some((keyword) => title.includes(keyword));
}

export { getTimelineMonths } from "./financialTracking";

function monthLabel(date) {
  const text = new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function buildMonthSkeleton(months, startDate = new Date()) {
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + index, 1);
    return {
      id: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: monthLabel(date),
      savedAmount: "",
      status: "pendiente",
    };
  });
}

export function calculateAdditionalSavingsTarget(evaluation, months) {
  const input = evaluation?.input || {};
  const income = Number(input.ingreso_mensual) || 0;
  const currentSavings = Number(input.ahorro_disponible) || 0;
  const dividend = Number(input.dividendo_estimado) || 0;
  const classification = evaluation?.result?.classification || "Bajo";
  const target = Math.max(dividend * 8, income * (classification === "Alto" ? 2 : 3), 1500000);
  const remaining = Math.max(target - currentSavings, 0);
  const orientativeMonthlyTarget = Math.ceil(
    Math.max(
      income > 0 ? income * 0.05 : 0,
      dividend > 0 ? dividend * 0.25 : 0,
      currentSavings > 0 ? currentSavings * 0.02 : 0,
    ) / 1000,
  ) * 1000;
  const baseMonthlyTarget = remaining > 0
    ? Math.ceil(remaining / Math.max(months, 1))
    : orientativeMonthlyTarget;
  const additionalTarget = remaining > 0
    ? remaining
    : baseMonthlyTarget * Math.max(months, 1);

  return {
    currentSavings,
    totalTarget: currentSavings + additionalTarget,
    additionalTarget,
    baseMonthlyTarget,
  };
}

export function buildMonthlyPlan(evaluation, progressData) {
  const months = getTimelineMonths(evaluation?.onboarding);
  const savings = calculateAdditionalSavingsTarget(evaluation, months);
  const storedMonths = Array.isArray(progressData?.months) ? progressData.months : [];
  const skeleton = buildMonthSkeleton(months);
  let accumulated = 0;
  let carriedDeficit = 0;

  const monthsData = skeleton.map((month, index) => {
    const stored = storedMonths.find((item) => item.id === month.id) || storedMonths[index] || {};
    const savedAmount = stored.savedAmount === "" || stored.savedAmount === undefined ? "" : Number(stored.savedAmount);
    const adjustedTarget = Math.max(savings.baseMonthlyTarget + carriedDeficit, 0);
    const achieved = Number(savedAmount) || 0;
    const hasInput = savedAmount !== "";
    const deficit = hasInput ? Math.max(adjustedTarget - achieved, 0) : carriedDeficit;
    const status = hasInput ? (achieved >= adjustedTarget ? "logrado" : "no_logrado") : "pendiente";

    accumulated += achieved;
    carriedDeficit = hasInput ? deficit : carriedDeficit;

    return {
      ...month,
      savedAmount,
      baseTarget: savings.baseMonthlyTarget,
      previousDeficit: adjustedTarget - savings.baseMonthlyTarget,
      adjustedTarget,
      expectedAccumulated: Math.min(savings.additionalTarget, savings.baseMonthlyTarget * (index + 1)),
      accumulated,
      deficit,
      status,
    };
  });

  const totalSaved = monthsData.reduce((sum, item) => sum + (Number(item.savedAmount) || 0), 0);
  const progressPercent = savings.additionalTarget > 0
    ? Math.min(100, Math.round((totalSaved / savings.additionalTarget) * 100))
    : 0;

  return {
    months,
    currentSavings: savings.currentSavings,
    additionalTarget: savings.additionalTarget,
    baseMonthlyTarget: savings.baseMonthlyTarget,
    hasValidTarget: savings.additionalTarget > 0 && savings.baseMonthlyTarget > 0 && monthsData.length > 0,
    totalSaved,
    progressPercent,
    monthsData,
  };
}

export function serializeMonthlyProgress(monthsData) {
  return {
    months: monthsData.map((item) => ({
      id: item.id,
      label: item.label,
      savedAmount: item.savedAmount,
      status: item.status,
    })),
    updated_at: new Date().toISOString(),
  };
}

export function getNextPrequalificationDate(evaluation) {
  if (!evaluation?.plan_accepted_at) return null;
  const date = new Date(evaluation.plan_accepted_at);
  date.setDate(date.getDate() + 30);
  return date;
}

export function canPrequalify(evaluation, goals = [], now = new Date()) {
  const nextDate = getNextPrequalificationDate(evaluation);
  const completedImportantGoal = goals.some((goal) => goal.status === "completada");

  if (!nextDate || completedImportantGoal) {
    return { allowed: true, nextDate };
  }

  return {
    allowed: now >= nextDate,
    nextDate,
  };
}
