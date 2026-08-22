// HU12 - Academia Financiera
//
// Contenido educativo contextual para ScoreLeads.
// Las afirmaciones financieras deben estar respaldadas por fuentes oficiales
// chilenas. El contenido es estático; las condiciones de subsidios o productos
// financieros que cambien con el tiempo deben derivar al sitio oficial.
//
// Fuentes principales:
// - SERNAC: educación y derechos del consumidor financiero
// - CMF: información y regulación del mercado financiero
// - MINVU: subsidios y beneficios habitacionales
// - ChileAtiende: RSH y trámites del Estado
// - Banco Central de Chile: UF e indicadores económicos

export const ACADEMY_TOPICS = [
  {
    id: "credito",
    label: "Crédito hipotecario",
    icon: "ti-building-bank",
    accent: "#1d4ed8",
  },
  {
    id: "endeudamiento",
    label: "Endeudamiento",
    icon: "ti-chart-pie",
    accent: "#7c3aed",
  },
  {
    id: "ahorro",
    label: "Ahorro y pie",
    icon: "ti-pig",
    accent: "#246354",
  },
  {
    id: "costos",
    label: "Tasas y costos",
    icon: "ti-percentage",
    accent: "#b42318",
  },
  {
    id: "uf",
    label: "UF e inflación",
    icon: "ti-chart-line",
    accent: "#0369a1",
  },
  {
    id: "subsidios",
    label: "Subsidios",
    icon: "ti-gift",
    accent: "#9a5b00",
  },
  {
    id: "rsh",
    label: "RSH y beneficios",
    icon: "ti-file-description",
    accent: "#0f766e",
  },
  {
    id: "vivienda",
    label: "Compra de vivienda",
    icon: "ti-home",
    accent: "#6d28d9",
  },
];


// -----------------------------------------------------------------------------
// ARTÍCULOS
// -----------------------------------------------------------------------------

export const ACADEMY_ARTICLES = [

  // ===========================================================================
  // CRÉDITO HIPOTECARIO
  // ===========================================================================

  {
    id: "credito-1",
    topic: "credito",
    title: "¿Qué es un crédito hipotecario?",
    summary:
      "Entiende qué financia un crédito hipotecario, cómo se estructura y qué significa comprometer una propiedad como garantía.",
    level: "Básico",
    minutes: 4,
    tags: ["crédito hipotecario", "dividendo", "plazo"],
    body:
      "Un crédito hipotecario es un financiamiento de largo plazo destinado, entre otros fines, a la adquisición de una vivienda. El crédito queda asociado a una garantía sobre el inmueble, de acuerdo con las condiciones del contrato.\n\nEl monto solicitado, el plazo, la tasa de interés y otros costos determinan cuánto terminarás pagando. Por eso no basta con mirar solamente el monto del dividendo mensual: también es importante revisar la información completa de la cotización y comparar alternativas equivalentes.\n\nAntes de contratar, revisa especialmente la tasa de interés, la CAE, el costo total, los seguros, los gastos y las demás condiciones informadas por la institución.",
    sources: [
      {
        institution: "SERNAC",
        title: "Consumidor Financiero",
        url: "https://www.sernac.cl/portal/604/w3-article-64924.html",
      },
      {
        institution: "CMF",
        title: "Simulador de Crédito Hipotecario",
        url: "https://servicios.cmfchile.cl/simuladorhipotecario/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "credito-2",
    topic: "credito",
    title: "¿Qué evalúa una institución financiera?",
    summary:
      "Conoce por qué una evaluación hipotecaria considera más que tu ingreso mensual.",
    level: "Básico",
    minutes: 4,
    tags: [
      "crédito hipotecario",
      "ingresos",
      "deudas",
      "capacidad de pago",
    ],
    body:
      "Una institución financiera analiza la solvencia y capacidad de pago antes de contratar una operación de crédito. La evaluación no depende exclusivamente del ingreso mensual: también puede considerar las obligaciones financieras existentes y la información necesaria para evaluar la operación.\n\nPor eso, tener un ingreso determinado no garantiza por sí solo la aprobación de un crédito hipotecario. La decisión corresponde a la institución financiera y depende de sus políticas de evaluación y de las características concretas de la operación.\n\nEn ScoreLeads, la evaluación sirve como una referencia orientativa para identificar fortalezas y posibles bloqueadores del perfil. No reemplaza la evaluación formal de una institución financiera.",
    sources: [
      {
        institution: "SERNAC",
        title: "Consumidor Financiero",
        url: "https://www.sernac.cl/portal/604/w3-article-64924.html",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "credito-3",
    topic: "credito",
    title: "Preaprobación hipotecaria: ¿qué significa?",
    summary:
      "Diferencia una simulación, una evaluación preliminar y la aprobación formal de un crédito.",
    level: "Intermedio",
    minutes: 4,
    tags: ["preaprobación", "crédito hipotecario", "evaluación"],
    body:
      "Una simulación permite estimar cuánto podrías pagar bajo determinadas condiciones. Una evaluación preliminar o preaprobación puede entregar una referencia sobre la posibilidad de acceder a financiamiento, pero no debe confundirse automáticamente con la aprobación definitiva del crédito.\n\nLa aprobación formal depende de la evaluación que realice la institución financiera y de los antecedentes que correspondan a la operación concreta, incluida la propiedad que se pretende financiar.\n\nPor eso, una simulación o una evaluación preliminar no debería interpretarse como una garantía de que el crédito será finalmente otorgado.",
    sources: [
      {
        institution: "CMF",
        title: "Simulador de Crédito Hipotecario",
        url: "https://servicios.cmfchile.cl/simuladorhipotecario/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "credito-4",
    topic: "credito",
    title: "Renta complementada y codeudor",
    summary:
      "Qué significa complementar ingresos y por qué también deben considerarse las obligaciones de la otra persona.",
    level: "Intermedio",
    minutes: 5,
    tags: ["codeudor", "renta complementada", "deudas"],
    body:
      "En algunas operaciones es posible que más de una persona participe en la evaluación del financiamiento. La forma concreta en que se considera la renta conjunta depende de las condiciones de la institución y del contrato.\n\nComplementar ingresos no significa simplemente sumar dos sueldos. La evaluación también debe considerar las obligaciones y antecedentes financieros que correspondan a las personas involucradas.\n\nAntes de comprometer a otra persona como codeudor o participante de una operación, es importante entender las responsabilidades que asumirá y revisar las condiciones específicas del crédito.",
    sources: [
      {
        institution: "SERNAC",
        title: "Consumidor Financiero",
        url: "https://www.sernac.cl/portal/604/w3-article-64924.html",
      },
    ],
    reviewedAt: "2026-08",
  },

  // ===========================================================================
  // ENDEUDAMIENTO
  // ===========================================================================

  {
    id: "endeudamiento-1",
    topic: "endeudamiento",
    title: "¿Qué es la carga financiera?",
    summary:
      "Aprende a relacionar tus ingresos con las obligaciones que ya tienes antes de asumir una nueva deuda.",
    level: "Básico",
    minutes: 4,
    tags: ["carga financiera", "deuda", "ingresos"],
    body:
      "La carga financiera permite analizar qué parte de los ingresos de una persona o familia está comprometida con obligaciones financieras. Es una medida útil para evaluar cuánto margen queda disponible para asumir nuevas cuotas.\n\nUna carga elevada puede reducir la capacidad para enfrentar imprevistos o asumir una nueva deuda. Por eso, antes de solicitar un crédito hipotecario conviene considerar no solamente el futuro dividendo, sino también las cuotas y obligaciones que ya existen.\n\nSERNAC entrega recomendaciones generales sobre endeudamiento, pero los criterios utilizados por cada institución financiera para evaluar una solicitud pueden ser diferentes.",
    sources: [
      {
        institution: "SERNAC",
        title: "Cuida tus lucas: endeudamiento",
        url: "https://www.sernac.cl/604/w3-article-9163.html",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "endeudamiento-2",
    topic: "endeudamiento",
    title: "¿Cómo afectan tus otras deudas a un hipotecario?",
    summary:
      "Un crédito automotriz, tarjetas u otras obligaciones pueden reducir el margen disponible para una nueva deuda.",
    level: "Básico",
    minutes: 4,
    tags: ["deuda", "carga financiera", "tarjetas"],
    body:
      "Cuando solicitas un nuevo crédito, tus obligaciones financieras existentes forman parte del contexto que puede utilizarse para evaluar tu capacidad de pago.\n\nPor ejemplo, una cuota de crédito automotriz o compromisos derivados de otros productos financieros pueden disminuir el margen disponible para asumir un dividendo hipotecario.\n\nPor eso, antes de buscar una vivienda es útil elaborar un presupuesto que incluya todas tus cuotas y obligaciones, en lugar de considerar solamente el futuro dividendo.",
    sources: [
      {
        institution: "SERNAC",
        title: "Consumidor Financiero",
        url: "https://www.sernac.cl/portal/604/w3-article-64924.html",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "endeudamiento-3",
    topic: "endeudamiento",
    title: "Tarjetas y líneas de crédito: ¿por qué importan?",
    summary:
      "Entiende por qué tus productos de crédito de consumo deben formar parte de tu presupuesto.",
    level: "Básico",
    minutes: 3,
    tags: ["tarjetas", "línea de crédito", "deuda"],
    body:
      "Las tarjetas de crédito y líneas de crédito forman parte de tus productos financieros y pueden generar obligaciones que debes considerar al analizar tu presupuesto.\n\nTener una tarjeta no significa necesariamente que estés endeudado por el total del cupo disponible. Sin embargo, los compromisos efectivamente adquiridos y las condiciones del producto deben incorporarse al análisis de tus finanzas.\n\nAntes de solicitar un hipotecario, revisa tus estados de cuenta y calcula cuánto de tus ingresos ya está comprometido con deudas y gastos recurrentes.",
    sources: [
      {
        institution: "SERNAC",
        title: "Educación financiera",
        url: "https://www.sernac.cl/educacion-para-el-consumo/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "endeudamiento-4",
    topic: "endeudamiento",
    title: "Cómo ordenar tus deudas antes de buscar vivienda",
    summary:
      "Una estrategia sencilla para conocer tu situación financiera antes de comprometerte con una nueva deuda.",
    level: "Básico",
    minutes: 4,
    tags: ["deuda", "presupuesto", "carga financiera"],
    body:
      "Antes de solicitar un crédito hipotecario, reúne información sobre todas tus obligaciones: saldo pendiente, cuota, plazo y condiciones principales.\n\nDespués, construye un presupuesto mensual que incluya ingresos, gastos habituales y cuotas de crédito. Esto permite conocer cuánto margen tienes realmente y evitar decidir solamente en función del precio máximo de una vivienda.\n\nSi tienes varias deudas, no asumas que prepagar una de ellas siempre será la mejor alternativa. Compara los costos, las condiciones y el efecto que tendría esa decisión sobre tus ahorros y tu capacidad de pago.",
    sources: [
      {
        institution: "SERNAC",
        title: "Educación financiera",
        url: "https://www.sernac.cl/educacion-para-el-consumo/",
      },
    ],
    reviewedAt: "2026-08",
  },

  // ===========================================================================
  // AHORRO Y PIE
  // ===========================================================================

  {
    id: "ahorro-1",
    topic: "ahorro",
    title: "¿Qué es el pie de una vivienda?",
    summary:
      "Entiende qué parte del valor de una propiedad debes financiar con recursos propios según las condiciones de tu operación.",
    level: "Básico",
    minutes: 3,
    tags: ["pie", "ahorro", "vivienda"],
    body:
      "El pie corresponde a la parte del valor de la vivienda que no se financia mediante el crédito hipotecario y que debe cubrirse con recursos propios u otras fuentes permitidas por la operación.\n\nNo existe un único porcentaje de pie que se aplique de manera universal a todos los créditos hipotecarios. El porcentaje financiado depende de las condiciones de la institución, del producto y de las características de la operación.\n\nUn mayor aporte propio puede reducir el monto que necesitas financiar, pero no debe interpretarse automáticamente como una garantía de aprobación o de una determinada tasa de interés.",
    sources: [
      {
        institution: "CMF",
        title: "Simulador de Crédito Hipotecario",
        url: "https://servicios.cmfchile.cl/simuladorhipotecario/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "ahorro-2",
    topic: "ahorro",
    title: "Cómo planificar el ahorro para una vivienda",
    summary:
      "Convierte una meta de ahorro en un objetivo mensual que puedas seguir y revisar.",
    level: "Básico",
    minutes: 4,
    tags: ["ahorro", "pie", "presupuesto"],
    body:
      "Para construir un plan de ahorro comienza definiendo cuánto necesitas reunir y en qué plazo. Divide el monto pendiente por la cantidad de meses disponibles para obtener una referencia del ahorro mensual necesario.\n\nDespués compara esa meta con tu presupuesto real. Si el monto mensual no es sostenible, puedes evaluar ampliar el plazo, ajustar el objetivo de vivienda o revisar tus gastos.\n\nEl ahorro también debe considerar que la compra de una vivienda puede involucrar otros costos además del pie. Por eso conviene no destinar automáticamente todos tus recursos disponibles al pie.",
    sources: [
      {
        institution: "SERNAC",
        title: "Educación financiera",
        url: "https://www.sernac.cl/educacion-para-el-consumo/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "ahorro-3",
    topic: "ahorro",
    title: "Cuenta de ahorro para la vivienda",
    summary:
      "Conoce por qué este instrumento aparece en varios programas habitacionales y cómo acreditar el ahorro.",
    level: "Intermedio",
    minutes: 4,
    tags: ["ahorro", "cuenta de ahorro", "subsidio"],
    body:
      "La cuenta de ahorro para la vivienda es utilizada en distintos programas habitacionales para acreditar ahorro. Los requisitos concretos dependen del programa y del llamado correspondiente.\n\nPor ejemplo, el primer llamado nacional DS1 de 2026 exigió una cuenta de ahorro para la vivienda con al menos 12 meses de antigüedad y un ahorro mínimo que variaba según el tramo y la modalidad de postulación.\n\nEstos requisitos pueden cambiar entre llamados, por lo que antes de postular siempre debes revisar las condiciones oficiales del llamado vigente.",
    sources: [
      {
        institution: "MINVU",
        title: "Primer llamado nacional DS1 2026",
        url: "https://www.minvu.gob.cl/postulacion/primer-llamado-nacional-2026-para-postular-al-subsidio-para-sectores-medios-d-s-1/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "ahorro-4",
    topic: "ahorro",
    title: "Pie, ahorro y fondo de emergencia",
    summary:
      "Ahorrar para el pie es importante, pero también conviene considerar la liquidez necesaria para enfrentar imprevistos.",
    level: "Intermedio",
    minutes: 4,
    tags: ["pie", "ahorro", "emergencia"],
    body:
      "El objetivo de reunir un pie no debería analizarse de manera aislada. Comprar una vivienda también implica asumir una obligación financiera de largo plazo y enfrentar gastos que pueden aparecer antes o después de la compra.\n\nPor eso es útil distinguir entre el dinero destinado al pie y los recursos que necesitas mantener disponibles para gastos inesperados y obligaciones habituales.\n\nLa cantidad adecuada de ahorro disponible depende de cada hogar y de sus gastos. La idea central es evitar que la compra de la vivienda deje al hogar sin liquidez para enfrentar un imprevisto.",
    sources: [
      {
        institution: "SERNAC",
        title: "Educación financiera",
        url: "https://www.sernac.cl/educacion-para-el-consumo/",
      },
    ],
    reviewedAt: "2026-08",
  },

  // ===========================================================================
  // TASAS Y COSTOS
  // ===========================================================================

  {
    id: "costos-1",
    topic: "costos",
    title: "Tasa de interés: ¿qué significa?",
    summary:
      "La tasa es solo una parte del costo de un crédito. Aprende a distinguirla de otros indicadores.",
    level: "Básico",
    minutes: 3,
    tags: ["tasa", "crédito", "costo"],
    body:
      "La tasa de interés representa el costo asociado al financiamiento y es una de las variables que determinan el valor de los pagos de un crédito.\n\nSin embargo, comparar solamente la tasa puede ser insuficiente. Un crédito puede incluir seguros, gastos y otros cargos que también influyen en su costo.\n\nPor eso, cuando compares ofertas, revisa las condiciones completas y utiliza indicadores como la CAE y el Costo Total del Crédito cuando correspondan.",
    sources: [
      {
        institution: "SERNAC",
        title: "Carga Anual Equivalente (CAE)",
        url: "https://www.sernac.cl/portal/607/w3-propertyvalue-15048.html",
      },
      {
        institution: "CMF",
        title: "Simulador de Crédito Hipotecario",
        url: "https://servicios.cmfchile.cl/simuladorhipotecario/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "costos-2",
    topic: "costos",
    title: "¿Qué es la CAE?",
    summary:
      "La Carga Anual Equivalente permite comparar alternativas financieras bajo condiciones comparables.",
    level: "Básico",
    minutes: 4,
    tags: ["CAE", "tasa", "costo"],
    body:
      "La Carga Anual Equivalente, conocida como CAE, es un indicador expresado como porcentaje que permite comparar distintas alternativas de productos financieros.\n\nEn una operación de crédito hipotecario, la CAE considera elementos del financiamiento que permiten expresar su costo de una manera comparable, incluyendo factores como tasa, plazo, seguros y determinados cargos según corresponda.\n\nLa comparación debe hacerse entre operaciones con características equivalentes, especialmente respecto del monto, plazo y condiciones. Una CAE menor no significa que cualquier crédito sea automáticamente adecuado para ti: también debes revisar el resto de las condiciones.",
    sources: [
      {
        institution: "SERNAC",
        title: "Carga Anual Equivalente (CAE)",
        url: "https://www.sernac.cl/portal/607/w3-propertyvalue-15048.html",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "costos-3",
    topic: "costos",
    title: "Costo Total del Crédito",
    summary:
      "Descubre cuánto terminarías pagando considerando los pagos del crédito durante todo el plazo.",
    level: "Básico",
    minutes: 4,
    tags: ["costo total", "CAE", "dividendo"],
    body:
      "El Costo Total del Crédito permite conocer cuánto se pagará durante toda la operación bajo las condiciones informadas.\n\nEste indicador es especialmente útil porque una cuota mensual baja no necesariamente significa que el crédito sea más barato. Un plazo más largo puede reducir el pago mensual, pero aumentar el monto total pagado.\n\nAl comparar alternativas, revisa el Costo Total junto con la CAE, la tasa, el plazo, los seguros y los demás costos informados.",
    sources: [
      {
        institution: "SERNAC",
        title: "Carga Anual Equivalente y Crédito Hipotecario",
        url: "https://www.sernac.cl/portal/607/w3-propertyvalue-15048.html",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "costos-4",
    topic: "costos",
    title: "Gastos operacionales de un crédito hipotecario",
    summary:
      "El costo de financiar una vivienda no se limita al pie y al dividendo.",
    level: "Intermedio",
    minutes: 4,
    tags: ["gastos operacionales", "crédito", "costos"],
    body:
      "Además del capital y los intereses, una operación hipotecaria puede involucrar gastos asociados a su formalización y operación. Estos costos deben revisarse en la información entregada por la institución financiera.\n\nEntre los conceptos que pueden aparecer se encuentran gastos relacionados con tasación, estudio de títulos, escritura y otras gestiones, según las características de la operación.\n\nNo todos los créditos tienen exactamente los mismos costos. Por eso es importante revisar la hoja resumen y la cotización específica antes de tomar una decisión.",
    sources: [
      {
        institution: "SERNAC",
        title: "Hoja resumen y educación financiera",
        url: "https://www.sernac.cl/educacion-para-el-consumo/videos/serie-para-vivir-mejor-educacion-financiera/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "costos-5",
    topic: "costos",
    title: "Seguros asociados al crédito hipotecario",
    summary:
      "Conoce los seguros que la normativa exige para las operaciones hipotecarias.",
    level: "Intermedio",
    minutes: 4,
    tags: ["seguros", "desgravamen", "incendio"],
    body:
      "En las operaciones de crédito hipotecario existen seguros obligatorios establecidos por la normativa. La CMF señala específicamente el seguro de desgravamen y el seguro de incendio.\n\nEl seguro de desgravamen cubre el saldo de la deuda en caso de fallecimiento del deudor, de acuerdo con las condiciones de la póliza. El seguro de incendio protege el inmueble frente a los riesgos cubiertos por la póliza correspondiente.\n\nAntes de contratar debes revisar las coberturas, exclusiones y costos de los seguros ofrecidos. También es importante diferenciar los seguros obligatorios de otros productos voluntarios.",
    sources: [
      {
        institution: "CMF",
        title: "¿Hay seguros obligatorios en los créditos hipotecarios?",
        url: "https://www.cmfchile.cl/educa/621/w3-article-27508.html",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "costos-6",
    topic: "costos",
    title: "Cómo comparar dos créditos hipotecarios",
    summary:
      "Una metodología simple para comparar ofertas sin quedarse solamente con la tasa.",
    level: "Intermedio",
    minutes: 5,
    tags: ["CAE", "costo total", "tasa", "comparación"],
    body:
      "Para comparar dos créditos hipotecarios comienza asegurándote de que las alternativas tengan características comparables: monto, plazo, tipo de crédito y condiciones similares.\n\nDespués revisa la tasa de interés, la CAE, el Costo Total del Crédito, el dividendo, los seguros y los gastos informados. La CMF cuenta con un simulador que permite comparar instituciones bajo determinados parámetros.\n\nSERNAC también destaca la importancia de revisar la hoja resumen, donde deben presentarse elementos relevantes como cuota, costo total, CAE, cargos, seguros y gastos adicionales.\n\nLa alternativa con menor tasa no necesariamente será la de menor costo total. Por eso conviene comparar el conjunto de condiciones.",
    sources: [
      {
        institution: "CMF",
        title: "Simulador de Crédito Hipotecario",
        url: "https://servicios.cmfchile.cl/simuladorhipotecario/",
      },
      {
        institution: "SERNAC",
        title: "Educación financiera: Hoja de resumen",
        url: "https://www.sernac.cl/educacion-para-el-consumo/videos/serie-para-vivir-mejor-educacion-financiera/",
      },
    ],
    reviewedAt: "2026-08",
  },

  // ===========================================================================
  // UF E INFLACIÓN
  // ===========================================================================

  {
    id: "uf-1",
    topic: "uf",
    title: "¿Qué es la UF?",
    summary:
      "Conoce la Unidad de Fomento y por qué aparece frecuentemente en los créditos hipotecarios en Chile.",
    level: "Básico",
    minutes: 3,
    tags: ["UF", "crédito", "inflación"],
    body:
      "La Unidad de Fomento, UF, es un índice de reajustabilidad autorizado por el Banco Central de Chile para determinadas operaciones de crédito de dinero en moneda nacional.\n\nSu valor se reajusta diariamente entre el día 10 de un mes y el día 9 del siguiente, de acuerdo con la variación del Índice de Precios al Consumidor correspondiente al período utilizado para su cálculo.\n\nPor eso, cuando una obligación está expresada en UF, su equivalente en pesos puede cambiar aunque la cantidad de UF permanezca igual.",
    sources: [
      {
        institution: "Banco Central de Chile",
        title: "Unidad de Fomento",
        url: "https://si3.bcentral.cl/Bdemovil/BDE/Series/MOV_ID_IR1",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "uf-2",
    topic: "uf",
    title: "UF e inflación",
    summary:
      "Entiende la relación entre la UF y el IPC sin confundir ambos conceptos.",
    level: "Básico",
    minutes: 3,
    tags: ["UF", "IPC", "inflación"],
    body:
      "La UF y el IPC no son lo mismo. El IPC mide la variación de los precios de una canasta de bienes y servicios, mientras que la UF es una unidad de reajustabilidad cuyo valor se ajusta utilizando la variación del IPC.\n\nEl Banco Central señala que, si el IPC registra una variación positiva, la UF aumenta gradualmente durante su período de reajuste. Si el IPC es cero, la UF permanece constante durante ese período. Si el IPC es negativo, la UF disminuye.",
    sources: [
      {
        institution: "Banco Central de Chile",
        title: "Preguntas frecuentes: UF e inflación",
        url: "https://www.bcentral.cl/es/web/banco-central/preguntas-frecuentes",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "uf-3",
    topic: "uf",
    title: "¿Cómo afecta la UF a tu dividendo?",
    summary:
      "Una cuota expresada en UF puede representar distintos montos en pesos a lo largo del tiempo.",
    level: "Intermedio",
    minutes: 4,
    tags: ["UF", "dividendo", "crédito"],
    body:
      "Cuando un crédito y su dividendo están expresados en UF, el número de UF que debes pagar puede mantenerse según las condiciones del crédito, mientras que su equivalente en pesos cambia con el valor de la UF.\n\nPor ejemplo, un dividendo de una determinada cantidad de UF tendrá un valor en pesos diferente si la UF aumenta.\n\nEsto no significa que la tasa de interés esté cambiando necesariamente. Son conceptos diferentes: la tasa determina el costo financiero del crédito, mientras que la UF es una unidad de reajustabilidad cuyo valor en pesos cambia con el tiempo.",
    sources: [
      {
        institution: "Banco Central de Chile",
        title: "Unidad de Fomento",
        url: "https://si3.bcentral.cl/Bdemovil/BDE/Series/MOV_ID_IR1",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "uf-4",
    topic: "uf",
    title: "¿Qué significa que un crédito esté en UF?",
    summary:
      "Comprende qué implica expresar una deuda en UF y por qué debes mirar también su equivalente en pesos.",
    level: "Intermedio",
    minutes: 4,
    tags: ["UF", "crédito hipotecario", "dividendo"],
    body:
      "Un crédito denominado en UF expresa el capital y las obligaciones asociadas utilizando esta unidad de reajustabilidad. Como la UF cambia su valor en pesos, el monto equivalente en pesos de una obligación puede variar.\n\nEsto es especialmente importante para el presupuesto mensual de un hogar: no basta con conocer el número de UF del dividendo, también debes considerar cómo ese pago se traduce a pesos.\n\nAl evaluar un crédito de largo plazo conviene simular el presupuesto bajo distintos escenarios y no asumir que el valor en pesos será idéntico durante todo el período.",
    sources: [
      {
        institution: "Banco Central de Chile",
        title: "Unidad de Fomento",
        url: "https://si3.bcentral.cl/Bdemovil/BDE/Series/MOV_ID_IR1",
      },
    ],
    reviewedAt: "2026-08",
  },

  // ===========================================================================
  // SUBSIDIOS
  // ===========================================================================

  {
    id: "subsidios-1",
    topic: "subsidios",
    title: "¿Qué es un subsidio habitacional?",
    summary:
      "Los subsidios habitacionales son beneficios estatales que buscan apoyar el acceso a una solución habitacional bajo determinadas condiciones.",
    level: "Básico",
    minutes: 4,
    tags: ["subsidio", "vivienda", "MINVU"],
    body:
      "Los subsidios habitacionales son beneficios otorgados por el Estado a personas o familias que cumplen los requisitos establecidos en cada programa.\n\nLos programas pueden tener objetivos, beneficiarios, montos, requisitos de ahorro y tipos de vivienda diferentes. Por eso no existe un único conjunto de requisitos que sirva para todos los subsidios.\n\nAntes de postular, revisa siempre el programa y el llamado específico publicado por MINVU. La información de ScoreLeads es educativa y no reemplaza la postulación ni la evaluación oficial.",
    sources: [
      {
        institution: "MINVU",
        title: "Beneficios de vivienda",
        url: "https://www.minvu.gob.cl/beneficios/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "subsidios-2",
    topic: "subsidios",
    title: "DS1: ¿cómo funciona?",
    summary:
      "Conoce el propósito general del Subsidio para Sectores Medios y por qué sus requisitos deben revisarse por llamado.",
    level: "Intermedio",
    minutes: 5,
    tags: ["DS1", "subsidio", "RSH", "ahorro"],
    body:
      "El Subsidio para Sectores Medios, conocido como DS1, está destinado a familias que buscan acceder a una vivienda y cumplen las condiciones establecidas por el programa.\n\nEn el primer llamado nacional de 2026, MINVU informó tres tramos para adquisición de vivienda y requisitos diferenciados de ahorro y Registro Social de Hogares. Las condiciones concretas, fechas y montos corresponden a ese llamado y no deben interpretarse como requisitos permanentes para futuros procesos.\n\nCuando quieras postular, revisa directamente el llamado vigente de MINVU para conocer los requisitos, fechas, ahorro mínimo y condiciones de la vivienda.",
    sources: [
      {
        institution: "MINVU",
        title: "Primer llamado nacional 2026 DS1",
        url: "https://www.minvu.gob.cl/postulacion/primer-llamado-nacional-2026-para-postular-al-subsidio-para-sectores-medios-d-s-1/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "subsidios-3",
    topic: "subsidios",
    title: "Subsidio, ahorro y crédito: ¿cómo se combinan?",
    summary:
      "Un subsidio puede formar parte de una estructura de financiamiento junto con ahorro propio y, cuando corresponda, crédito hipotecario.",
    level: "Intermedio",
    minutes: 4,
    tags: ["subsidio", "pie", "crédito"],
    body:
      "En algunos programas habitacionales, el valor de la vivienda puede financiarse combinando el aporte del subsidio con ahorro propio y, cuando corresponda, un crédito hipotecario.\n\nLa forma exacta de combinar estos componentes depende del programa y de sus requisitos. Por eso no es correcto asumir que cualquier subsidio puede utilizarse con cualquier vivienda o crédito.\n\nUna buena práctica es identificar primero el programa al que podrías acceder y después verificar las condiciones de la vivienda y del financiamiento compatible con ese beneficio.",
    sources: [
      {
        institution: "MINVU",
        title: "Subsidio para Sectores Medios DS1",
        url: "https://www.minvu.gob.cl/postulacion/primer-llamado-nacional-2026-para-postular-al-subsidio-para-sectores-medios-d-s-1/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "subsidios-4",
    topic: "subsidios",
    title: "¿Por qué los requisitos de un subsidio pueden cambiar?",
    summary:
      "Distingue entre las características generales de un programa y las condiciones de un llamado específico.",
    level: "Básico",
    minutes: 3,
    tags: ["subsidio", "MINVU", "requisitos"],
    body:
      "Los programas habitacionales tienen reglas establecidas por su normativa, pero los llamados específicos pueden establecer fechas, cupos, montos, condiciones y procedimientos determinados.\n\nPor ejemplo, el primer llamado nacional DS1 de 2026 tuvo fechas de postulación, ahorro mínimo y condiciones específicas para ese proceso.\n\nPor esta razón, una aplicación educativa no debería presentar los requisitos de un llamado antiguo como si fueran válidos para siempre. ScoreLeads debe entregar orientación general y derivar al sitio oficial de MINVU para comprobar las condiciones vigentes.",
    sources: [
      {
        institution: "MINVU",
        title: "Primer llamado nacional 2026 DS1",
        url: "https://www.minvu.gob.cl/postulacion/primer-llamado-nacional-2026-para-postular-al-subsidio-para-sectores-medios-d-s-1/",
      },
    ],
    reviewedAt: "2026-08",
  },

  // ===========================================================================
  // RSH
  // ===========================================================================

  {
    id: "rsh-1",
    topic: "rsh",
    title: "¿Qué es el Registro Social de Hogares?",
    summary:
      "El RSH ayuda a determinar la calificación socioeconómica de los hogares para distintos procesos de beneficios estatales.",
    level: "Básico",
    minutes: 4,
    tags: ["RSH", "beneficios", "subsidio"],
    body:
      "El Registro Social de Hogares es un sistema que ayuda a identificar a personas y familias que pueden acceder a la oferta de beneficios del Estado.\n\nLa calificación socioeconómica considera variables como ingresos, composición familiar, vivienda, educación y salud, entre otras. Además, combina información proporcionada por las personas con información disponible en bases de datos del Estado.\n\nEl RSH no significa que una persona reciba automáticamente un beneficio. Cada programa estatal establece sus propios requisitos y condiciones.",
    sources: [
      {
        institution: "ChileAtiende",
        title: "Registro Social de Hogares y Cartola Hogar",
        url: "https://www.chileatiende.gob.cl/fichas/42344-registro-social-de-hogares-rsh-y-cartola-hogar",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "rsh-2",
    topic: "rsh",
    title: "¿Qué significa tu porcentaje del RSH?",
    summary:
      "El porcentaje del RSH corresponde a un tramo de calificación socioeconómica y no equivale por sí solo a un beneficio.",
    level: "Básico",
    minutes: 4,
    tags: ["RSH", "tramo", "subsidio"],
    body:
      "El Registro Social de Hogares asigna a cada hogar un tramo de calificación socioeconómica. Ese tramo se utiliza en los procesos de selección de distintos beneficios estatales.\n\nEstar dentro de un determinado porcentaje no significa automáticamente que tengas derecho a un subsidio. El programa correspondiente puede establecer otros requisitos relacionados con ahorro, ingresos, composición del hogar, vivienda u otras condiciones.\n\nPor eso, para saber si puedes acceder a un beneficio debes revisar los requisitos completos del programa y no solamente tu porcentaje del RSH.",
    sources: [
      {
        institution: "ChileAtiende",
        title: "Registro Social de Hogares",
        url: "https://www.chileatiende.gob.cl/fichas/42344-registro-social-de-hogares-rsh-y-cartola-hogar",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "rsh-3",
    topic: "rsh",
    title: "RSH y subsidios habitacionales",
    summary:
      "El RSH puede ser uno de los requisitos para postular a determinados programas habitacionales.",
    level: "Intermedio",
    minutes: 4,
    tags: ["RSH", "subsidio", "DS1"],
    body:
      "Algunos programas habitacionales utilizan el Registro Social de Hogares como parte de sus requisitos. El porcentaje exigido puede variar según el programa y el tramo de postulación.\n\nPor ejemplo, el primer llamado nacional DS1 de 2026 estableció condiciones diferentes para los tramos 1, 2 y 3, incluyendo límites asociados al RSH.\n\nPor eso, antes de interpretar tu porcentaje como una posibilidad de acceso a un subsidio, revisa las condiciones del llamado vigente publicado por MINVU.",
    sources: [
      {
        institution: "MINVU",
        title: "Primer llamado nacional 2026 DS1",
        url: "https://www.minvu.gob.cl/postulacion/primer-llamado-nacional-2026-para-postular-al-subsidio-para-sectores-medios-d-s-1/",
      },
      {
        institution: "ChileAtiende",
        title: "Registro Social de Hogares",
        url: "https://www.chileatiende.gob.cl/fichas/42344-registro-social-de-hogares-rsh-y-cartola-hogar",
      },
    ],
    reviewedAt: "2026-08",
  },

  // ===========================================================================
  // COMPRA DE VIVIENDA
  // ===========================================================================

  {
    id: "vivienda-1",
    topic: "vivienda",
    title: "Vivienda nueva vs. usada",
    summary:
      "Ambas alternativas pueden ser válidas, pero debes evaluar costos, condiciones de la propiedad y financiamiento.",
    level: "Básico",
    minutes: 4,
    tags: ["vivienda", "nueva", "usada"],
    body:
      "Comprar una vivienda nueva o usada implica revisar aspectos diferentes de la propiedad y de la operación. En ambos casos debes considerar el precio, las condiciones de financiamiento, la documentación y los costos asociados a la compra.\n\nEn una vivienda usada puede ser especialmente importante revisar los antecedentes de la propiedad y su situación jurídica. En una vivienda nueva también debes revisar cuidadosamente las condiciones del proyecto y del contrato.\n\nLa decisión no debería basarse solamente en si la vivienda es nueva o usada: también importa si la operación completa es compatible con tu presupuesto y necesidades.",
    sources: [
      {
        institution: "SERNAC",
        title: "Educación financiera",
        url: "https://www.sernac.cl/educacion-para-el-consumo/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "vivienda-2",
    topic: "vivienda",
    title: "¿Qué es una tasación?",
    summary:
      "La tasación busca determinar un valor de referencia de la propiedad para efectos de la operación financiera.",
    level: "Intermedio",
    minutes: 3,
    tags: ["tasación", "vivienda", "crédito"],
    body:
      "La tasación es una valoración de la propiedad realizada para la operación correspondiente. En el contexto de un crédito hipotecario, la información de la propiedad forma parte de los antecedentes que se consideran para evaluar el financiamiento.\n\nEl precio acordado entre comprador y vendedor y el valor determinado en una tasación no son necesariamente idénticos.\n\nPor eso, antes de comprometer una compra conviene entender cómo una eventual diferencia entre el precio de compra y el valor considerado para el financiamiento puede afectar la estructura de recursos necesarios.",
    sources: [
      {
        institution: "CMF",
        title: "Simulador de Crédito Hipotecario",
        url: "https://servicios.cmfchile.cl/simuladorhipotecario/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "vivienda-3",
    topic: "vivienda",
    title: "¿Qué es un estudio de títulos?",
    summary:
      "Conoce por qué los antecedentes jurídicos de una propiedad son relevantes antes de comprar.",
    level: "Intermedio",
    minutes: 4,
    tags: ["estudio de títulos", "propiedad", "compra"],
    body:
      "El estudio de títulos consiste en revisar los antecedentes jurídicos de una propiedad para determinar si existen situaciones que deban considerarse antes de concretar una operación.\n\nEn una compra financiada con crédito hipotecario, la institución puede requerir antecedentes de la propiedad para verificar las condiciones necesarias para constituir la garantía.\n\nAntes de firmar compromisos importantes conviene asegurarse de conocer qué antecedentes deben revisarse y quién será responsable de realizar las gestiones correspondientes.",
    sources: [
      {
        institution: "SERNAC",
        title: "Educación para el consumo",
        url: "https://www.sernac.cl/educacion-para-el-consumo/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "vivienda-4",
    topic: "vivienda",
    title: "Costos que debes considerar al comprar una vivienda",
    summary:
      "El precio de publicación y el pie no representan necesariamente todos los recursos que necesitarás.",
    level: "Básico",
    minutes: 4,
    tags: ["gastos", "vivienda", "pie"],
    body:
      "El precio de una vivienda no es necesariamente el único desembolso asociado a la compra. Dependiendo de la operación pueden existir costos relacionados con tasación, estudio de títulos, escritura, inscripción y otros trámites o servicios.\n\nEn una compra financiada también debes considerar los costos asociados al crédito, como intereses, seguros y otros cargos informados en la cotización.\n\nAntes de comprometerte, construye un presupuesto que contemple tanto el precio de la vivienda como los costos de la operación y la capacidad de mantener el financiamiento posteriormente.",
    sources: [
      {
        institution: "SERNAC",
        title: "Educación financiera: Hoja de resumen",
        url: "https://www.sernac.cl/educacion-para-el-consumo/videos/serie-para-vivir-mejor-educacion-financiera/",
      },
    ],
    reviewedAt: "2026-08",
  },

  {
    id: "vivienda-5",
    topic: "vivienda",
    title: "Qué revisar antes de comprometer la compra",
    summary:
      "Antes de firmar una promesa o asumir una obligación importante, revisa la vivienda, el financiamiento y las condiciones del contrato.",
    level: "Intermedio",
    minutes: 5,
    tags: ["promesa", "contrato", "vivienda"],
    body:
      "Antes de asumir un compromiso de compra es recomendable revisar cuidadosamente las condiciones de la operación: precio, forma de pago, condiciones de financiamiento, plazos, gastos y obligaciones de las partes.\n\nTambién debes verificar que los antecedentes relevantes de la propiedad estén siendo revisados y que las condiciones del crédito sean compatibles con tu presupuesto.\n\nUna decisión de compra responsable no consiste solamente en saber si puedes pagar el pie. Debes evaluar si puedes sostener la obligación financiera y si entiendes las condiciones contractuales antes de firmar.",
    sources: [
      {
        institution: "SERNAC",
        title: "Consumidor Financiero",
        url: "https://www.sernac.cl/portal/604/w3-article-64924.html",
      },
    ],
    reviewedAt: "2026-08",
  },
];


// -----------------------------------------------------------------------------
// GLOSARIO
// -----------------------------------------------------------------------------

export const ACADEMY_GLOSSARY = {
  pie: {
    label: "pie",
    definition:
      "Parte del valor de la vivienda que no se financia mediante el crédito hipotecario y que debe cubrirse según las condiciones de la operación.",
    articleId: "ahorro-1",
  },

  tasa: {
    label: "tasa",
    definition:
      "Porcentaje utilizado para determinar el costo financiero asociado al crédito.",
    articleId: "costos-1",
  },

  cae: {
    label: "CAE",
    definition:
      "Indicador expresado como porcentaje que permite comparar alternativas financieras bajo condiciones comparables.",
    articleId: "costos-2",
  },

  "costo total": {
    label: "costo total",
    definition:
      "Monto total que se pagará durante la operación bajo las condiciones informadas.",
    articleId: "costos-3",
  },

  subsidio: {
    label: "subsidio",
    definition:
      "Beneficio estatal que se entrega bajo las condiciones establecidas por un determinado programa habitacional.",
    articleId: "subsidios-1",
  },

  "carga financiera": {
    label: "carga financiera",
    definition:
      "Medida utilizada para analizar qué parte de los ingresos está comprometida con obligaciones financieras.",
    articleId: "endeudamiento-1",
  },

  dividendo: {
    label: "dividendo",
    definition:
      "Pago periódico asociado al crédito hipotecario según las condiciones de la operación.",
    articleId: "uf-3",
  },

  UF: {
    label: "UF",
    definition:
      "Unidad de Fomento, un índice de reajustabilidad cuyo valor se expresa en pesos y se ajusta de acuerdo con la variación del IPC.",
    articleId: "uf-1",
  },

  IPC: {
    label: "IPC",
    definition:
      "Índice de Precios al Consumidor, utilizado como referencia para medir la variación de los precios de una canasta de bienes y servicios.",
    articleId: "uf-2",
  },

  codeudor: {
    label: "codeudor",
    definition:
      "Persona que participa en una operación de crédito junto con el deudor, según las condiciones establecidas por la institución y el contrato.",
    articleId: "credito-4",
  },

  RSH: {
    label: "RSH",
    definition:
      "Registro Social de Hogares, sistema utilizado para apoyar la identificación de personas y hogares que pueden acceder a beneficios estatales.",
    articleId: "rsh-1",
  },

  "registro social de hogares": {
    label: "Registro Social de Hogares",
    definition:
      "Sistema que establece la calificación socioeconómica de los hogares para distintos procesos de beneficios estatales.",
    articleId: "rsh-1",
  },

  tasación: {
    label: "tasación",
    definition:
      "Valoración de una propiedad realizada para la operación correspondiente.",
    articleId: "vivienda-2",
  },

  "estudio de títulos": {
    label: "estudio de títulos",
    definition:
      "Revisión de antecedentes jurídicos relevantes de una propiedad antes de una operación inmobiliaria.",
    articleId: "vivienda-3",
  },

  "gastos operacionales": {
    label: "gastos operacionales",
    definition:
      "Costos asociados a la formalización y operación del financiamiento o de la compra, según corresponda.",
    articleId: "costos-4",
  },

  "seguro de desgravamen": {
    label: "seguro de desgravamen",
    definition:
      "Seguro obligatorio en operaciones hipotecarias que cubre el saldo de la deuda ante el fallecimiento del deudor, según las condiciones de la póliza.",
    articleId: "costos-5",
  },

  "seguro de incendio": {
    label: "seguro de incendio",
    definition:
      "Seguro obligatorio asociado a operaciones hipotecarias que cubre los riesgos establecidos en la póliza.",
    articleId: "costos-5",
  },

  plazo: {
    label: "plazo",
    definition:
      "Período establecido para pagar el crédito.",
    articleId: "costos-3",
  },

  preaprobación: {
    label: "preaprobación",
    definition:
      "Evaluación preliminar que puede entregar una referencia sobre la posibilidad de acceder a financiamiento, sin equivaler necesariamente a una aprobación definitiva.",
    articleId: "credito-3",
  },

  endeudamiento: {
    label: "endeudamiento",
    definition:
      "Situación financiera asociada a las obligaciones de deuda que mantiene una persona o familia.",
    articleId: "endeudamiento-4",
  },
};


// -----------------------------------------------------------------------------
// MAPEO DE RIESGOS DEL SCORE → CONTENIDO EDUCATIVO
// -----------------------------------------------------------------------------

export function classifyRiskText(riskText = "") {
  const text = riskText.toLowerCase();

  if (
    text.includes("co-deudor") ||
    text.includes("codeudor") ||
    text.includes("complementari") ||
    text.includes("complemento")
  ) {
    return {
      topic: "credito",
      term: "codeudor",
      articleId: "credito-4",
    };
  }

  if (text.includes("moros") || text.includes("pagos")) {
    return {
      topic: "endeudamiento",
      term: "endeudamiento",
      articleId: "endeudamiento-1",
    };
  }

  if (
    text.includes("ahorro") ||
    text.includes("pie")
  ) {
    return {
      topic: "ahorro",
      term: "pie",
      articleId: "ahorro-1",
    };
  }

  if (
    text.includes("dividendo") ||
    text.includes("cuota")
  ) {
    return {
      topic: "costos",
      term: "dividendo",
      articleId: "uf-3",
    };
  }

  if (
    text.includes("deuda") ||
    text.includes("carga") ||
    text.includes("tarjetas") ||
    text.includes("endeud")
  ) {
    return {
      topic: "endeudamiento",
      term: "carga financiera",
      articleId: "endeudamiento-1",
    };
  }

  if (
    text.includes("continuidad") ||
    text.includes("contrato") ||
    text.includes("independiente") ||
    text.includes("honorarios")
  ) {
    return {
      topic: "credito",
      term: "crédito hipotecario",
      articleId: "credito-2",
    };
  }

  if (
    text.includes("edad") ||
    text.includes("plazo")
  ) {
    return {
      topic: "credito",
      term: "plazo",
      articleId: "costos-3",
    };
  }

  return {
    topic: "credito",
    term: null,
    articleId: "credito-2",
  };
}


// -----------------------------------------------------------------------------
// ARTÍCULOS INICIALES
// -----------------------------------------------------------------------------

export const STARTER_ARTICLE_IDS = [
  "credito-1",
  "ahorro-1",
  "costos-2",
];


// -----------------------------------------------------------------------------
// CASOS PRÁCTICOS
// -----------------------------------------------------------------------------

export const CASE_STUDIES = [
  {
    id: "caso-costo-total",
    title: "La tasa más baja no siempre cuenta toda la historia",
    tag: {
      classification: "Medio",
      riskKeyword: "dividendo",
    },
    situation:
      "Una persona encuentra dos alternativas hipotecarias. Una tiene una tasa de interés ligeramente menor, pero la otra presenta una CAE y un costo total más convenientes bajo condiciones comparables.",
    why:
      "La tasa de interés es solamente uno de los componentes del costo del crédito. La CAE y el Costo Total permiten incorporar otros elementos relevantes de la operación.",
    action:
      "Comparar ofertas equivalentes revisando tasa, CAE, costo total, seguros, gastos y plazo antes de elegir.",
    relatedArticleIds: [
      "costos-2",
      "costos-3",
      "costos-6",
    ],
  },

  {
    id: "caso-pie-insuficiente",
    title: "Buen perfil, pero el ahorro todavía no alcanza",
    tag: {
      classification: "Alto",
      riskKeyword: "ahorro",
    },
    situation:
      "Una persona tiene ingresos suficientes y pocas obligaciones financieras, pero todavía no reúne los recursos propios necesarios para estructurar la compra de la vivienda que está evaluando.",
    why:
      "Tener capacidad de pago no elimina la necesidad de contar con los recursos propios requeridos por la operación. El porcentaje de financiamiento depende de las condiciones del crédito y de la institución.",
    action:
      "Determinar cuánto ahorro falta, establecer una meta mensual y revisar si la vivienda objetivo es compatible con los recursos disponibles.",
    relatedArticleIds: [
      "ahorro-1",
      "ahorro-2",
      "ahorro-4",
    ],
  },

  {
    id: "caso-dividendo-ajustado",
    title: "El dividendo deja poco margen mensual",
    tag: {
      classification: "Medio",
      riskKeyword: "dividendo",
    },
    situation:
      "El ingreso permite cubrir el dividendo estimado, pero después de considerar las demás obligaciones y gastos queda poco margen para enfrentar imprevistos.",
    why:
      "La capacidad de pago no debería analizarse solamente preguntando si una persona puede pagar una cuota. También es importante considerar el resto de sus obligaciones y su presupuesto mensual.",
    action:
      "Comparar alternativas de menor precio, mayor ahorro o diferentes condiciones de financiamiento y evaluar cómo cambia el presupuesto mensual.",
    relatedArticleIds: [
      "endeudamiento-1",
      "endeudamiento-2",
      "uf-3",
    ],
  },

  {
    id: "caso-rsh",
    title: "Tener un RSH no significa tener automáticamente un subsidio",
    tag: {
      classification: "Medio",
      riskKeyword: "subsidio",
    },
    situation:
      "Una persona conoce su porcentaje del RSH y asume que ese porcentaje por sí solo significa que puede recibir un subsidio habitacional.",
    why:
      "El RSH es uno de los elementos que pueden utilizarse en los procesos de selección de beneficios, pero cada programa establece sus propios requisitos.",
    action:
      "Identificar el programa habitacional concreto y revisar sus requisitos completos en MINVU o ChileAtiende.",
    relatedArticleIds: [
      "rsh-1",
      "rsh-2",
      "subsidios-1",
    ],
  },

  {
    id: "caso-uf",
    title: "El dividendo está en UF, pero el presupuesto está en pesos",
    tag: {
      classification: "Medio",
      riskKeyword: "dividendo",
    },
    situation:
      "Una persona conoce el número de UF de su dividendo, pero no ha considerado que el equivalente en pesos puede cambiar cuando cambia el valor de la UF.",
    why:
      "La UF es una unidad de reajustabilidad cuyo valor en pesos cambia de acuerdo con su mecanismo de actualización asociado al IPC.",
    action:
      "Incorporar al presupuesto el equivalente en pesos y evaluar escenarios para comprobar que el hogar pueda mantener la obligación.",
    relatedArticleIds: [
      "uf-1",
      "uf-2",
      "uf-3",
    ],
  },

  {
    id: "caso-deuda",
    title: "El ingreso parece suficiente, pero existen otras deudas",
    tag: {
      classification: "Bajo",
      riskKeyword: "deuda",
    },
    situation:
      "Una persona tiene un ingreso que parece suficiente para el dividendo objetivo, pero además mantiene cuotas de otros créditos y obligaciones financieras.",
    why:
      "La capacidad de pago debe considerar el conjunto de obligaciones financieras y no solamente la nueva cuota que se pretende contratar.",
    action:
      "Revisar todas las cuotas, construir un presupuesto completo y evaluar el efecto de las deudas existentes antes de comprometer una nueva obligación.",
    relatedArticleIds: [
      "endeudamiento-1",
      "endeudamiento-2",
      "endeudamiento-4",
    ],
  },
];


// -----------------------------------------------------------------------------
// BUSCAR CASO RELACIONADO CON LA EVALUACIÓN REAL
// -----------------------------------------------------------------------------

export function findMatchingCase(evaluation) {
  const result = evaluation?.result;

  if (!result?.classification || !Array.isArray(result.risks)) {
    return null;
  }

  return (
    CASE_STUDIES.find(
      (item) =>
        item.tag.classification === result.classification &&
        result.risks.some((risk) =>
          risk.toLowerCase().includes(item.tag.riskKeyword)
        )
    ) || null
  );
}