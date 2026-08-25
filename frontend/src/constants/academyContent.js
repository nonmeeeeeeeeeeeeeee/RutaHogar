// HU12 - Academia financiera contextual.
//
// El CATÁLOGO educativo (temas, artículos, glosario, casos prácticos) es
// contenido de apoyo y se mantiene como texto fijo: no requiere estar
// conectado a Supabase ni actualizado en tiempo real.
//
// Lo que SÍ debe ser real (y ya no se simula) es la situación del usuario:
// score, clasificación, riesgos e indicadores positivos. Esos datos vienen
// directamente del resultado guardado por el backend (ver
// backend/app/scoring.py -> calculate_score) a través del prop `evaluation`
// que recibe <AcademiaFinanciera />, con la misma forma que ya usan
// Result.jsx y Recommendations.jsx: evaluation.result.{score,
// classification, risks[], positive_indicators[]}.

export const ACADEMY_TOPICS = [
  {
    id: "credito",
    label: "Crédito hipotecario",
    icon: "ti-building-bank",
    accent: "#1d4ed8",
  },
  {
    id: "pie",
    label: "Pie y ahorro",
    icon: "ti-pig",
    accent: "#246354",
  },
  {
    id: "subsidios",
    label: "Subsidios habitacionales",
    icon: "ti-gift",
    accent: "#9a5b00",
  },
  {
    id: "tasas",
    label: "Tasas de interés",
    icon: "ti-percentage",
    accent: "#b42318",
  },
  {
    id: "vivienda",
    label: "Tipos de vivienda",
    icon: "ti-home",
    accent: "#6d28d9",
  },
];

export const ACADEMY_ARTICLES = [
  {
    id: "credito-1",
    topic: "credito",
    title: "Qué evalúa un banco antes de aprobar tu crédito hipotecario",
    summary: "Los cinco factores principales que revisa una entidad financiera: renta, deudas, continuidad laboral, ahorro y comportamiento de pago.",
    level: "Básico",
    minutes: 4,
    tags: ["carga financiera", "morosidad", "continuidad laboral"],
    body:
      "Antes de aprobar un crédito hipotecario, el banco arma una foto completa de tu situación financiera. No basta con tener el pie ahorrado: también revisa cuánto ganas, cuánto debes y hace cuánto tiempo trabajas.\n\nLos cinco factores más relevantes son la renta líquida mensual, la carga financiera o dti (qué porcentaje de tu renta ya está comprometido en otras deudas), la continuidad laboral (idealmente 12 meses o más en el mismo empleo o rubro), el ahorro disponible para el pie, y el comportamiento de pago histórico reflejado en tu comportamiento crediticio.\n\nCada banco pondera estos factores de forma distinta, por eso es normal que la misma persona reciba ofertas diferentes en distintas instituciones.",
  },
  {
    id: "credito-2",
    topic: "credito",
    title: "Renta complementada: cómo sumar el sueldo de otra persona a tu evaluación",
    summary: "Qué es la evaluación conjunta o codeudor, cuándo conviene usarla y qué documentos suele pedir el banco.",
    level: "Intermedio",
    minutes: 5,
    tags: ["codeudor", "morosidad"],
    body:
      "Si tu renta individual no alcanza para el crédito que necesitas, puedes evaluar en conjunto con otra persona (pareja, familiar directo). A esto se le llama renta complementada o evaluación con codeudor.\n\nEl banco suma ambas rentas y también ambas deudas, por lo que conviene hacerlo solo si la otra persona tiene una carga financiera baja. El codeudor queda igualmente responsable de la deuda, así que es una decisión que conviene conversar con calma.\n\nEn general se solicitan las liquidaciones de sueldo de ambas personas, certificado de cotizaciones y cédula de identidad vigente.",
  },
  {
    id: "credito-3",
    topic: "credito",
    title: "Primera vivienda: errores comunes al postular por primera vez",
    summary: "Los tropiezos más frecuentes de quienes postulan sin experiencia previa: mala estimación de gastos, no considerar el pie total y elegir mal el plazo.",
    level: "Básico",
    minutes: 3,
    tags: ["plazo", "pie"],
    body:
      "Postular a tu primera vivienda tiene una curva de aprendizaje. Los errores más comunes son subestimar los gastos operacionales (notaría, tasación, estudio de títulos), no considerar que el pie mínimo suele ser 10% a 20% del valor de la propiedad, y elegir un plazo de crédito solo pensando en la cuota mensual sin mirar el costo total del interés.\n\nUna buena práctica es simular distintos escenarios antes de comprometerte con un proyecto específico.",
  },
  {
    id: "pie-1",
    topic: "pie",
    title: "Qué es el pie y cuánto deberías ahorrar",
    summary: "El pie es el porcentaje del valor de la propiedad que financias con ahorro propio, no con el crédito.",
    level: "Básico",
    minutes: 3,
    tags: ["pie"],
    body:
      "El pie es la parte del valor de la vivienda que pagas con tus propios ahorros, sin financiamiento bancario. La mayoría de los bancos en Chile exige entre un 10% y un 20% del valor de la propiedad, aunque algunos programas permiten financiar hasta el 90%.\n\nMientras mayor sea tu pie, menor será el monto del crédito y, en general, mejores condiciones de tasa podrás negociar. Ahorrar de forma constante y demostrable (con cuenta de ahorro dedicada) también mejora tu evaluación.",
  },
  {
    id: "pie-2",
    topic: "pie",
    title: "Cuenta de ahorro para la vivienda: beneficios tributarios",
    summary: "Cómo funciona la cuenta de ahorro para la vivienda y qué beneficios tributarios puedes aprovechar al usarla.",
    level: "Intermedio",
    minutes: 4,
    tags: ["ahorro"],
    body:
      "En Chile existen cuentas de ahorro para la vivienda que permiten acceder a beneficios tributarios y, en algunos casos, a un mayor puntaje al momento de postular a subsidios habitacionales.\n\nMantener el ahorro en una cuenta dedicada (y no mezclado con tu cuenta corriente) también ayuda a que el banco identifique claramente tu capacidad real de ahorro mensual.",
  },
  {
    id: "pie-3",
    topic: "pie",
    title: "Cómo armar un plan de ahorro mensual realista",
    summary: "Una forma simple de calcular cuánto ahorrar cada mes para alcanzar tu meta de pie en un plazo definido.",
    level: "Básico",
    minutes: 3,
    tags: ["pie", "plazo"],
    body:
      "Para armar un plan de ahorro realista, parte por definir tu meta total de pie y el plazo en que quieres alcanzarla. Divide el monto faltante entre los meses disponibles para obtener tu meta de ahorro mensual.\n\nSi la cifra resultante es difícil de sostener, es mejor extender el plazo o revisar tu objetivo de vivienda, en lugar de comprometer un ahorro que luego no podrás mantener.",
  },
  {
    id: "subsidios-1",
    topic: "subsidios",
    title: "Subsidios habitacionales en Chile: una mirada general",
    summary: "Qué son los subsidios habitacionales, quién los entrega y por qué pueden reducir el dividendo o complementar el pie.",
    level: "Básico",
    minutes: 4,
    tags: ["subsidio"],
    body:
      "Los subsidios habitacionales son aportes estatales, no reembolsables, que buscan facilitar el acceso a la vivienda. Pueden complementar tu pie, reducir el monto del crédito necesario o, en algunos programas, apoyar directamente el pago del dividendo.\n\nCada programa tiene requisitos propios de tramo socioeconómico, ahorro mínimo y tipo de vivienda, por lo que conviene revisar cuál calza mejor con tu perfil antes de postular.",
  },
  {
    id: "subsidios-2",
    topic: "subsidios",
    title: "Requisitos generales para postular a un subsidio",
    summary: "Los requisitos que suelen repetirse entre distintos programas: ahorro mínimo, tramo de ingresos y no ser propietario.",
    level: "Intermedio",
    minutes: 4,
    tags: ["subsidio"],
    body:
      "Aunque cada programa tiene reglas específicas, en general se solicita contar con un ahorro mínimo acreditado en una cuenta de ahorro para la vivienda, pertenecer a un tramo de ingresos determinado según el Registro Social de Hogares, y no ser propietario de otra vivienda.\n\nLa simulación de subsidios dentro de RutaHogar es referencial: no reemplaza la evaluación oficial de la entidad correspondiente.",
  },
  {
    id: "subsidios-3",
    topic: "subsidios",
    title: "Cómo un subsidio puede cambiar tu capacidad de compra",
    summary: "Un subsidio no solo reduce el precio final, también puede bajar el dividendo mensual y hacer viable un proyecto que hoy no calza.",
    level: "Intermedio",
    minutes: 3,
    tags: ["subsidio", "dividendo"],
    body:
      "Un subsidio bien aplicado puede mover a un usuario de una clasificación 'Medio' a 'Alto', porque reduce el monto que efectivamente necesita financiar con crédito. Esto impacta directamente en el dividendo mensual y, por lo tanto, en la carga financiera declarada.\n\nPor eso, cuando el bloqueador principal de un lead es el nivel de ingresos, suele ser una buena alternativa a explorar antes de descartar un proyecto.",
  },
  {
    id: "tasas-1",
    topic: "tasas",
    title: "Qué es la tasa de interés y cómo afecta tu dividendo",
    summary: "La tasa de interés determina cuánto pagas por sobre el capital prestado. Pequeñas variaciones cambian bastante el dividendo final.",
    level: "Básico",
    minutes: 4,
    tags: ["tasa"],
    body:
      "La tasa de interés es el costo que cobra el banco por prestarte dinero, expresada como un porcentaje anual. En créditos hipotecarios, incluso una variación de medio punto porcentual puede significar una diferencia considerable en el dividendo mensual y en el costo total del crédito a lo largo de los años.\n\nLas tasas hipotecarias en Chile suelen expresarse en UF, por lo que además del interés hay que considerar la variación de la UF en el tiempo.",
  },
  {
    id: "tasas-2",
    topic: "tasas",
    title: "Tasa fija vs. tasa variable: diferencias prácticas",
    summary: "Una tasa fija te da certeza en el dividendo; una variable puede bajar o subir según las condiciones de mercado.",
    level: "Intermedio",
    minutes: 4,
    tags: ["tasa"],
    body:
      "Con una tasa fija, el dividendo se mantiene estable durante todo el crédito, lo que facilita la planificación financiera. Con una tasa variable, el dividendo puede subir o bajar según las condiciones de mercado, lo que implica más riesgo pero también la posibilidad de pagar menos si las tasas bajan.\n\nLa mayoría de los créditos hipotecarios en Chile se ofrecen a tasa fija, precisamente por la estabilidad que entrega a largo plazo.",
  },
  {
    id: "tasas-3",
    topic: "tasas",
    title: "Cómo se relaciona la UF con tu crédito hipotecario",
    summary: "La mayoría de los créditos hipotecarios en Chile están denominados en UF, no en pesos. Esto tiene implicancias directas en tu dividendo.",
    level: "Intermedio",
    minutes: 3,
    tags: ["uf", "dividendo"],
    body:
      "Cuando un crédito está en UF, el monto en pesos de tu dividendo varía cada mes según el valor de la UF, aunque el número de UF que pagas se mantenga igual. En períodos de alta inflación, la UF sube más rápido, lo que puede presionar tu presupuesto mensual.\n\nPor eso conviene simular distintos escenarios de variación de UF antes de comprometerte con un crédito a largo plazo.",
  },
  {
    id: "vivienda-1",
    topic: "vivienda",
    title: "Departamento o casa: qué considerar según tu situación",
    summary: "Diferencias prácticas en precio, gastos comunes, plusvalía y flexibilidad entre ambos tipos de vivienda.",
    level: "Básico",
    minutes: 3,
    tags: ["vivienda"],
    body:
      "Departamentos y casas tienen estructuras de costos distintas. Los departamentos suelen tener un valor de entrada menor y gastos comunes fijos, mientras que las casas no tienen gastos comunes pero pueden implicar mayores costos de mantención propia.\n\nLa elección también depende de tu etapa de vida, la comuna de interés y si priorizas cercanía a servicios o más espacio propio.",
  },
  {
    id: "vivienda-2",
    topic: "vivienda",
    title: "Vivienda nueva vs. usada: impacto en el crédito",
    summary: "Los bancos suelen evaluar de forma distinta una vivienda nueva y una usada, especialmente en tasación y antigüedad del crédito.",
    level: "Intermedio",
    minutes: 4,
    tags: ["vivienda"],
    body:
      "Una vivienda nueva suele facilitar la tasación bancaria porque su valor de mercado es más reciente y verificable. Una vivienda usada puede requerir una tasación más detallada y, dependiendo de su antigüedad, algunos bancos ajustan el plazo máximo del crédito.\n\nEn ambos casos, es clave revisar el estudio de títulos antes de firmar cualquier promesa de compra.",
  },
  {
    id: "vivienda-3",
    topic: "vivienda",
    title: "Comuna de interés: cómo influye en tu capacidad de compra",
    summary: "El valor por metro cuadrado varía mucho entre comunas de la Región Metropolitana. Ajustar la comuna de interés puede acercarte a tu meta.",
    level: "Básico",
    minutes: 3,
    tags: ["vivienda", "pie"],
    body:
      "El valor de la vivienda varía de forma significativa según la comuna, incluso dentro de un mismo radio de la Región Metropolitana. Si tu capacidad de compra actual no calza con tu comuna de interés original, ampliar la búsqueda a comunas cercanas con valores más accesibles puede ser una alternativa viable mientras mejoras tu perfil financiero.",
  },
  {
    id: "subsidios-fogaes",
    topic: "subsidios",
    title: "FOGAES: financiamiento para vivienda nueva",
    summary: "Qué es FOGAES, quién puede postular y cómo esta garantía estatal facilita el acceso a un crédito hipotecario con menor pie.",
    level: "Básico",
    minutes: 4,
    tags: ["subsidio", "pie", "vivienda"],
    body:
      "FOGAES (Fondo de Garantías para Empresas de Seguros) es un sistema de garantías estatales diseñado para facilitar el acceso a crédito hipotecario. Su objetivo es que más personas puedan financiar una vivienda nueva con un pie más bajo del que los bancos usualmente exigen.\n\nCómo funciona: el Estado respalda parcialmente el crédito, lo que reduce el riesgo para el banco y permite ofrecer mejores condiciones al solicitante. Esto significa que puedes acceder a un crédito hipotecario con un pie mínimo del 10%, cuando normalmente los bancos piden entre 15% y 20%.\n\nRequisitos principales: la vivienda debe ser nueva (no usada), el valor de la propiedad no puede exceder las 4.000 UF, y debes contar con un pie mínimo equivalente al 10% del valor de la propiedad. El banco evaluará también tu renta, continuidad laboral y comportamiento de pago.\n\nDónde postular: los bancos adheridos al sistema FOGAES. Puedes consultar la lista de entidades autorizadas en el sitio oficial de FOGAES o preguntar directamente en tu banco.\n\nRecuerda: esta información es referencial. La aprobación final depende de la evaluación bancaria formal.",
  },
  {
    id: "subsidios-ds49",
    topic: "subsidios",
    title: "DS49: Fondo Solidario de Elección de Vivienda",
    summary: "El subsidio estatal para familias en situación de vulnerabilidad que buscan su primera vivienda.",
    level: "Básico",
    minutes: 4,
    tags: ["subsidio", "vivienda"],
    body:
      "El DS49 (Decreto Supremo 49) es el Fondo Solidario de Elección de Vivienda, un subsidio estatal no reembolsable dirigido a familias en situación de vulnerabilidad socioeconómica.\n\nQuién puede postular: personas mayores de 18 años, inscritas en el Registro Social de Hogares (RSH) con un tramo de vulnerabilidad de hasta el 40% (o hasta el 100% si eres adulto mayor de 60 años), que no sean propietarias de otra vivienda, que cuenten con un ahorro mínimo de 10 UF en una cuenta de ahorro para la vivienda, y que postulen con un grupo familiar acreditado.\n\nEl monto del subsidio varía según el tramo de vulnerabilidad y la zona geográfica. Es un aporte estatal directo que reduce el monto que necesitas financiar con crédito.\n\nProceso de postulación: se realiza a través del SERVIU (Servicio de Vivienda y Urbanismo). Es importante reunir la documentación requerida (certificado de RSH, comprobante de ahorro, certificado de grupo familiar) antes de iniciar el proceso.\n\nRecuerda: esta información es referencial. La aprobación final depende de la evaluación del SERVIU.",
  },
  {
    id: "subsidios-padhi",
    topic: "subsidios",
    title: "PADHI: Acompañamiento a Deudores Hipotecarios",
    summary: "Programa de orientación para personas con deuda hipotecaria vigente que fueron beneficiarias previas de subsidios.",
    level: "Intermedio",
    minutes: 3,
    tags: ["subsidio", "morosidad"],
    body:
      "PADHI (Programa de Acompañamiento a Deudores Hipotecarios) no es un subsidio nuevo, sino un programa de orientación y acompañamiento para personas que ya tienen una deuda hipotecaria vigente y que anteriormente fueron beneficiarias de un subsidio habitacional.\n\nQuién puede acceder: debes contar con una deuda hipotecaria activa y haber sido beneficiario previo de un subsidio habitacional (como DS49, DS1 u otro programa similar).\n\nQué ofrece el programa: orientación financiera para reestructurar deudas, asesoría sobre opciones de pago, y acompañamiento durante el proceso de normalización de la deuda. El objetivo es ayudarte a salir de la morosidad y recuperar la estabilidad financiera.\n\nEste programa es parte del conjunto de herramientas que el Estado ofrece para proteger a las familias que ya accedieron a una vivienda con apoyo estatal.\n\nSi no cumples con los requisitos de PADHI pero tienes deuda hipotecaria, te recomendamos revisar la sección de Crédito Hipotecario en la Academia Financiera para entender tus opciones.\n\nRecuerda: esta información es referencial. El acceso al programa depende de la entidad administradora.",
  },
  {
    id: "subsidios-ds1",
    topic: "subsidios",
    title: "DS1: Subsidio Clase Media para compra de vivienda",
    summary: "El subsidio para la clase media que busca facilitar la compra de una primera vivienda con ahorro previo.",
    level: "Intermedio",
    minutes: 4,
    tags: ["subsidio", "ahorro", "vivienda"],
    body:
      "El DS1 (Decreto Supremo 1) es el Subsidio Clase Media para Compra de Viviendas, dirigido a personas que desean adquirir su primera vivienda y que cuentan con un ahorro acumulado.\n\nEl subsidio se organiza en tres tramos, cada uno con requisitos distintos de ahorro, valor de propiedad y tramo RSH:\n\nTramo I: ahorro mínimo de 30 UF, valor de propiedad hasta 1.100 UF, RSH hasta el 60% (o hasta 90% si eres adulto mayor).\n\nTramo II: ahorro mínimo de 40 UF, valor de propiedad hasta 1.600 UF, RSH hasta el 80% (o hasta 90% si eres adulto mayor).\n\nTramo III: ahorro mínimo de 80 UF, valor de propiedad hasta 2.200 UF, con inscripción en el RSH.\n\nRequisitos comunes: no ser propietario de otra vivienda, contar con antigüedad mínima de 12 meses en la cuenta de ahorro para la vivienda, y cumplir con los requisitos del tramo al que postulas.\n\nEl monto del subsidio varía según el tramo y se entrega como aporte estatal no reembolsable que complementa tu pie o reduce el monto del crédito.\n\nRecuerda: esta información es referencial. La aprobación final depende de la evaluación del SERVIU.",
  },
  {
    id: "subsidios-leasing",
    topic: "subsidios",
    title: "Leasing Habitacional: arrendamiento con promesa de compraventa",
    summary: "Una alternativa al crédito hipotecario que te permite arrendar una vivienda con la opción de comprarla eventualmente.",
    level: "Intermedio",
    minutes: 3,
    tags: ["subsidio", "vivienda"],
    body:
      "El Leasing Habitacional es un subsidio que funciona como arrendamiento con promesa de compraventa de vivienda. En lugar de obtener un crédito hipotecario convencional, arriendas la vivienda con la opción de comprarla en el futuro.\n\nCómo funciona: pagas una cuota mensual por el arrendamiento, y una parte de esa cuota se acumula como descuento del precio de compra. Al final del plazo, tienes la opción de comprar la vivienda con el descuento acumulado.\n\nRequisitos: ser mayor de 18 años, estar inscrito en el Registro Único de Inscritos (RUI), no ser propietario de otra vivienda, y no haber sido beneficiario previo de un subsidio habitacional.\n\nVentajas: es una alternativa para quienes no califican para un crédito hipotecario convencional pero tienen la capacidad de pagar una cuota mensual. También permite acumular ahorro para el pie mientras habitas la vivienda.\n\nEl leasing habitacional es gestionado por entidades autorizadas por el Estado. Consulta las opciones disponibles en tu zona.\n\nRecuerda: esta información es referencial. Las condiciones específicas dependen de la entidad administradora.",
  },
  {
    id: "subsidios-ley21748",
    topic: "subsidios",
    title: "Ley 21.748: reducción de tasa para vivienda nueva",
    summary: "Beneficio que reduce la tasa de interés en 0.60 puntos porcentuales para créditos de vivienda nueva.",
    level: "Básico",
    minutes: 3,
    tags: ["subsidio", "tasa", "vivienda"],
    body:
      "La Ley N° 21.748 establece una reducción de la tasa de interés de 0.60 puntos porcentuales para créditos hipotecarios destinados a la compra de vivienda nueva.\n\nQué significa en la práctica: si tu tasa de interés es de, por ejemplo, 3.50%, con la Ley 21.748 pasaría a 2.90%. Esto reduce directamente tu dividendo mensual durante toda la vida del crédito, lo que puede representar un ahorro significativo.\n\nRequisitos: la vivienda debe ser nueva (no usada), debes ser persona natural (no empresa), y el valor de la propiedad no puede exceder las 4.000 UF.\n\nCómo se aplica: el banco aplica la reducción automáticamente cuando el crédito cumple con los requisitos de la ley. No necesitas realizar un trámite adicional; el banco verifica que la vivienda sea nueva y que el valor esté dentro del tope.\n\nEste beneficio es acumulable con otros subsidios habitacionales, lo que puede mejorar significativamente las condiciones de tu crédito.\n\nRecuerda: esta información es referencial. La aplicación efectiva de la reducción depende de la entidad bancaria.",
  },
];

// Mapeo academy_module (backend) → articleId (frontend) para deep-link
// desde tarjetas de beneficios directamente a la cápsula educativa.
export const ACADEMY_BENEFIT_CAPSULES = {
  fogaes: "subsidios-fogaes",
  ds49: "subsidios-ds49",
  padhi: "subsidios-padhi",
  ds1: "subsidios-ds1",
  leasing: "subsidios-leasing",
  ley_21748: "subsidios-ley21748",
};

// Glosario contextual (HU12 - E3): términos que aparecen en Resultado, Plan de
// mejora o Mapa y que deben ofrecer acceso directo a contenido de la Academia.
export const ACADEMY_GLOSSARY = {
  pie: {
    label: "pie",
    definition: "Porcentaje del valor de la propiedad que financias con ahorro propio, sin crédito.",
    articleId: "pie-1",
  },
  tasa: {
    label: "tasa",
    definition: "Costo que cobra el banco por prestarte dinero, expresado como porcentaje anual.",
    articleId: "tasas-1",
  },
  subsidio: {
    label: "subsidio",
    definition: "Aporte estatal no reembolsable que puede complementar tu pie o reducir tu dividendo.",
    articleId: "subsidios-1",
  },
  plazo: {
    label: "plazo",
    definition: "Cantidad de años en los que se paga el crédito. A mayor plazo, menor cuota pero más interés total.",
    articleId: "credito-3",
  },
  dividendo: {
    label: "dividendo",
    definition: "Cuota mensual que pagas por tu crédito hipotecario, compuesta por capital e interés.",
    articleId: "tasas-3",
  },
  "carga financiera": {
    label: "carga financiera",
    definition: "Porcentaje de tu renta que ya está comprometido en el pago de deudas vigentes.",
    articleId: "credito-1",
  },
  morosidad: {
    label: "morosidad",
    definition: "Historial de pagos atrasados o pendientes. Un banco revisa tu comportamiento de pago reciente.",
    articleId: "credito-1",
  },
  "continuidad laboral": {
    label: "continuidad laboral",
    definition: "Tiempo que llevas en tu trabajo actual o rubro. A mayor continuidad, mejor evaluación de estabilidad.",
    articleId: "credito-1",
  },
  codeudor: {
    label: "codeudor",
    definition: "Persona que evalúa el crédito junto a ti, sumando renta y también deudas y riesgos.",
    articleId: "credito-2",
  },
};

// HU12 - E2 / E3: mapeo entre los textos reales de riesgo que devuelve el
// backend (ver backend/app/scoring.py -> riesgos.append(...)) y el tema /
// término de glosario más relevante para explicarlos. No inventa el riesgo:
// solo interpreta el texto real que ya viene en evaluation.result.risks.
export function classifyRiskText(riskText = "") {
  const text = riskText.toLowerCase();

  if (text.includes("co-deudor") || text.includes("complementari") || text.includes("complemento"))
    return { topic: "credito", term: "codeudor" };
  if (text.includes("moros") || text.includes("pagos"))
    return { topic: "credito", term: "morosidad" };
  if (text.includes("ahorro"))
    return { topic: "pie", term: "pie" };
  if (text.includes("dividendo"))
    return { topic: "tasas", term: "dividendo" };
  if (text.includes("deuda") || text.includes("carga") || text.includes("tarjetas"))
    return { topic: "credito", term: "carga financiera" };
  if (text.includes("continuidad") || text.includes("contrato") || text.includes("independiente") || text.includes("honorarios"))
    return { topic: "credito", term: "continuidad laboral" };
  if (text.includes("edad") || text.includes("plazo"))
    return { topic: "credito", term: "plazo" };

  return { topic: "credito", term: null };
}

// Artículos genéricos de entrada para quien todavía no tiene una
// preevaluación (no hay score real que interpretar todavía).
export const STARTER_ARTICLE_IDS = ["credito-1", "pie-1", "subsidios-1"];

// HU12 (mejora) - Casos prácticos "de borde": situaciones donde el resultado
// no es obvio a simple vista (ej. score alto con un bloqueador puntual). El
// contenido narrativo es de apoyo/no crítico; el `tag` de cada caso sí se
// contrasta contra evaluation.result real para detectar si el caso del
// usuario se parece a uno de estos ejemplos.
export const CASE_STUDIES = [
  {
    id: "caso-pie-insuficiente",
    title: "Score alto, pero sin el pie del 15%",
    tag: { classification: "Alto", riskKeyword: "ahorro" },
    situation:
      "Un usuario con ingresos altos, sin deudas y contrato indefinido obtiene un score de 80 puntos (Alto). Sin embargo, su ahorro solo cubre un 8% del valor de la propiedad que le interesa, por debajo del 10%-20% que suelen exigir los bancos.",
    why:
      "El motor de scoring pondera con fuerza la relación entre ingreso y dividendo, además de la estabilidad laboral. Un ahorro insuficiente queda registrado como un riesgo puntual, pero no siempre baja la clasificación general a Medio si el resto del perfil es sólido.",
    action:
      "Aunque la clasificación sea Alto, conviene reforzar el ahorro antes de una evaluación bancaria formal: el pie bajo suele ser la primera objeción real del banco, incluso con buen puntaje.",
    relatedArticleIds: ["pie-1", "pie-3"],
  },
  {
    id: "caso-dividendo-ajustado",
    title: "Score medio por un dividendo muy ajustado",
    tag: { classification: "Medio", riskKeyword: "dividendo" },
    situation:
      "El ingreso mensual alcanza a cubrir el dividendo estimado, pero con muy poco margen. El sistema marca que 'el dividendo objetivo podría exigir más holgura financiera', y el score baja a la banda Medio.",
    why:
      "La regla interna exige que el ingreso cubra cómodamente el dividendo (no solo lo justo). Un margen ajustado es señal de riesgo ante cualquier imprevisto o alza de tasa.",
    action:
      "Simular un dividendo más bajo (plazo más largo, propiedad de menor valor o mayor pie) puede acercar a este perfil a una clasificación Alto sin cambiar sus ingresos.",
    relatedArticleIds: ["tasas-1", "tasas-3"],
  },
  {
    id: "caso-continuidad-corta",
    title: "Score bajo por continuidad laboral corta",
    tag: { classification: "Bajo", riskKeyword: "continuidad" },
    situation:
      "Un usuario recién cambió a un contrato a plazo fijo hace algunos meses. Aunque su renta es razonable, el sistema indica que 'el contrato a plazo fijo puede dificultar una evaluación hipotecaria formal'.",
    why:
      "La continuidad laboral es uno de los cinco factores centrales de cualquier evaluación hipotecaria: a los bancos les interesa ver ingresos sostenidos en el tiempo, no solo el monto actual.",
    action:
      "Mantener el mismo empleo por más tiempo, o reunir respaldos de continuidad en el rubro (contratos anteriores, boletas), suele mejorar este bloqueador de forma natural en pocos meses.",
    relatedArticleIds: ["credito-1", "credito-3"],
  },
  {
    id: "caso-codeudor-debil",
    title: "Renta complementada con un codeudor con antecedentes débiles",
    tag: { classification: "Medio", riskKeyword: "co-deudor" },
    situation:
      "Un usuario suma la renta de su pareja para calificar. El sistema detecta que 'el co-deudor tiene una carga de deuda elevada en relación a sus ingresos', por lo que el aporte del complemento no mejora tanto como se esperaba.",
    why:
      "Al evaluar en conjunto, el banco (y el motor de scoring) suma también las deudas del codeudor, no solo su renta. Un codeudor con carga alta puede incluso restar respecto de una evaluación individual limpia.",
    action:
      "Antes de complementar renta, vale la pena revisar la carga financiera del codeudor por separado, o evaluar primero si la evaluación individual ya es suficiente.",
    relatedArticleIds: ["credito-2"],
  },
  {
    id: "caso-morosidad-incierta",
    title: "Morosidad declarada como 'no lo sé'",
    tag: { classification: "Bajo", riskKeyword: "incertidumbre" },
    situation:
      "Un usuario no está seguro de si tiene alguna deuda impaga y responde 'no lo sé' en el formulario. El sistema registra 'existe incertidumbre sobre la situación de pagos actual' y penaliza el score de forma preventiva.",
    why:
      "El motor de scoring trata la incertidumbre de forma conservadora: es más seguro asumir que hay algo que revisar, que asumir que todo está en orden sin evidencia.",
    action:
      "Revisar el propio historial de pagos (por ejemplo a través de plataformas de información comercial) antes de completar el formulario evita este castigo evitable.",
    relatedArticleIds: ["credito-1"],
  },
];

// Busca, entre los casos prácticos, el que más se parece a la situación real
// del usuario (misma clasificación + un riesgo real que calza con el caso).
export function findMatchingCase(evaluation) {
  const result = evaluation?.result;
  if (!result?.classification || !Array.isArray(result.risks)) return null;

  return (
    CASE_STUDIES.find(
      (item) =>
        item.tag.classification === result.classification &&
        result.risks.some((risk) => risk.toLowerCase().includes(item.tag.riskKeyword))
    ) || null
  );
}