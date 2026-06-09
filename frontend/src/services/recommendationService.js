const summaries = {
  Alto: "Tu perfil se ve mejor preparado para iniciar conversaciones formales, manteniendo siempre una revisión responsable.",
  Medio: "Tu perfil podria fortalecerse antes de avanzar con una evaluación formal.",
  Bajo: "Conviene preparar mejor tu situación financiera antes de avanzar con el proceso.",
};

const primaryRecommendations = {
  Alto: [
    "Manten tu estabilidad financiera y evita aumentar tus deudas antes de iniciar una evaluación formal.",
    "Conserva el ahorro disponible para pie, gastos iniciales y margen de seguridad.",
  ],
  Medio: [
    "Podrias fortalecer tu perfil financiero antes de avanzar. Revisa tus niveles de deuda, ahorro y estabilidad declarada.",
    "Evalua si el dividendo esperado sigue siendo sostenible para tu situación actual.",
  ],
  Bajo: [
    "Conviene preparar mejor tu situación financiera antes de avanzar. Enfocate en ordenar deudas, aumentar ahorro o revisar tu objetivo inmobiliario.",
    "Considera ajustar el plazo de compra o revisar alternativas de comuna antes de una evaluación formal.",
  ],
};

export function buildRecommendations(evaluation) {
  if (!evaluation) return null;

  const classification = evaluation.result?.classification || "Bajo";
  const input = evaluation.input || {};
  const onboarding = evaluation.onboarding || {};
  const recommendations = [...(primaryRecommendations[classification] || primaryRecommendations.Bajo)];
  const actions = [];

  if (input.morosidad_actual === "si" || input.morosidad_actual === "no_lo_se") {
    recommendations.push("Revisa y regulariza cualquier situación de morosidad declarada antes de avanzar.");
    actions.push("Confirmar estado de pagos y compromisos vigentes.");
  }

  if (input.continuidad_laboral === "menos_6_meses" || input.continuidad_laboral === "entre_6_y_12_meses") {
    recommendations.push("Fortalecer la continuidad laboral puede ayudar a preparar mejor una futura evaluación.");
    actions.push("Mantener estabilidad laboral y respaldos simples de ingresos.");
  }

  if (input.complemento_renta) {
    recommendations.push("Si usarás complemento de renta, ordena los antecedentes de esa persona con anticipación.");
    actions.push("Validar documentos básicos de quien complementará renta.");
  }

  if (onboarding.comuna_interes || input.comuna_objetivo) {
    actions.push(`Revisar si ${onboarding.comuna_interes || input.comuna_objetivo} sigue siendo una comuna objetivo realista.`);
  }

  if (onboarding.tipo_propiedad) {
    actions.push("Comparar alternativas de propiedad manteniendo una cuota mensual sostenible.");
  }

  if (onboarding.plazo_compra) {
    actions.push("Alinear el plazo de compra con ahorro, estabilidad laboral y nivel de deuda actual.");
  }

  actions.push("Solicitar una evaluación bancaria formal solo cuando tengas antecedentes actualizados.");

  return {
    score: evaluation.result?.score,
    classification,
    summary: summaries[classification] || summaries.Bajo,
    recommendations: [...new Set(recommendations)],
    actions: [...new Set(actions)],
  };
}
