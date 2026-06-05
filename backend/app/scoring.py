from typing import Dict, List
from .ai import (
    generate_executive_summary,
    generate_commercial_guidance
)


# Valor configurable usado para convertir los precios referenciales desde UF a CLP.
VALOR_UF_CLP = 45408

# Tabla simple para el MVP. Representa precios promedio referenciales de propiedades
# objetivo por comuna, no tasaciones reales ni valores comerciales garantizados.
PRECIOS_REFERENCIA_UF = {
    "Buin": 2800,
    "Calera de Tango": 4300,
    "Cerrillos": 3000,
    "Cerro Navia": 2400,
    "Conchalí": 2800,
    "El Bosque": 2300,
    "Estación Central": 3100,
    "Huechuraba": 4700,
    "Independencia": 3300,
    "La Cisterna": 3200,
    "La Florida": 3900,
    "La Granja": 2500,
    "La Pintana": 2200,
    "La Reina": 7200,
    "Las Condes": 9200,
    "Lo Barnechea": 10500,
    "Lo Espejo": 2200,
    "Lo Prado": 2700,
    "Macul": 4100,
    "Maipú": 3600,
    "Melipilla": 2400,
    "Ñuñoa": 6200,
    "Padre Hurtado": 3000,
    "Paine": 2700,
    "Pedro Aguirre Cerda": 2600,
    "Peñaflor": 2900,
    "Peñalolén": 4700,
    "Pirque": 4300,
    "Providencia": 7600,
    "Pudahuel": 2900,
    "Puente Alto": 3100,
    "Quilicura": 3200,
    "Quinta Normal": 3300,
    "Recoleta": 3400,
    "Renca": 2600,
    "San Bernardo": 2800,
    "San Joaquín": 3500,
    "San José de Maipo": 3300,
    "San Miguel": 4500,
    "San Ramón": 2400,
    "Santiago": 3800,
    "Talagante": 3100,
    "Vitacura": 12000,
}


def clamp(v: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, v))


def _unique(items: List[str]) -> List[str]:
    seen = set()
    result = []
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result


def generate_ai_explanation(score_result: Dict, user_data: Dict) -> str:
    """Mock de explicacion asistida por IA.

    Esta funcion deja aislada la capa para conectar un proveedor de IA mas adelante.
    El texto evita reglas exactas, ponderaciones, formulas y factores positivos.
    """
    risks = set(score_result.get("risk_codes", []))
    messages = []

    if "morosidad_alta" in risks:
        messages.append("regularizar posibles compromisos pendientes")
    elif "morosidad_media" in risks:
        messages.append("confirmar tu situacion financiera antes de avanzar")

    if "deuda_alta" in risks:
        messages.append("revisar tu nivel de endeudamiento mensual")
    if "ahorro_bajo" in risks:
        messages.append("fortalecer tu ahorro disponible")
    if "continuidad_baja" in risks or "continuidad_media" in risks:
        messages.append("consolidar mayor continuidad laboral")
    if "ingreso_dividendo" in risks or "precio_objetivo" in risks:
        messages.append("ajustar tus expectativas de compra o dividendo")
    if "contrato_independiente" in risks:
        messages.append("respaldar mejor la estabilidad de tus ingresos")

    if not messages:
        return (
            "Tu perfil no muestra riesgos principales evidentes en esta pre-evaluacion. "
            "De todas formas, el resultado es solo orientativo y debe revisarse con antecedentes formales."
        )

    focus = ", ".join(_unique(messages[:4]))
    return (
        "Tu perfil presenta algunos elementos que podrian dificultar una evaluacion hipotecaria favorable. "
        f"Te recomendamos {focus} antes de avanzar con una solicitud formal."
    )


def generate_improvement_plan(score_result: Dict, user_data: Dict) -> List[str]:
    risks = set(score_result.get("risk_codes", []))
    plan = []

    if "morosidad_alta" in risks:
        plan.append("Regulariza o aclara compromisos pendientes antes de iniciar una evaluacion formal.")
    elif "morosidad_media" in risks:
        plan.append("Revisa tu situacion financiera actual y confirma si existen pagos pendientes o atrasos.")

    if "ahorro_bajo" in risks:
        plan.append("Define una meta mensual de ahorro y separa esos fondos apenas recibas tus ingresos.")
    else:
        plan.append("Mantén un fondo de ahorro separado para pie, gastos iniciales y margen de seguridad.")

    if "deuda_alta" in risks:
        plan.append("Prioriza reducir cuotas mensuales o cerrar deudas pequenas antes de aumentar tu compromiso hipotecario.")
    else:
        plan.append("Evita tomar nuevas deudas de consumo mientras preparas tu compra.")

    if "continuidad_baja" in risks or "continuidad_media" in risks or "contrato_independiente" in risks:
        plan.append("Mantén continuidad laboral y ordena respaldos simples de ingresos, especialmente si trabajas independiente.")
    else:
        plan.append("Conserva estabilidad laboral y evita cambios bruscos de fuente de ingreso durante la preparacion.")

    if "ingreso_dividendo" in risks or "precio_objetivo" in risks or score_result.get("classification") != "Alto":
        plan.append("Revisa comuna, precio esperado o dividendo objetivo para que la compra sea mas sostenible.")

    if user_data.get("complemento_renta"):
        plan.append("Ordena la informacion de la persona que complementara renta y valida que pueda sostener ese apoyo.")
    elif score_result.get("classification") in {"Medio", "Bajo"}:
        plan.append("Evalua complementar renta con una persona de confianza si tu situacion actual no alcanza para el objetivo.")

    return _unique(plan)


def calculate_score(data: Dict) -> Dict:
    ingreso = float(data.get("ingreso_mensual", 0) or 0)
    deuda = float(data.get("deuda_mensual", 0) or 0)
    ahorro = float(data.get("ahorro_disponible", 0) or 0)
    contrato = data.get("tipo_contrato", "")
    continuidad = data.get("continuidad_laboral", "")
    morosidad = data.get("morosidad_actual", "")
    comuna = data.get("comuna_objetivo")
    dividendo = float(data.get("dividendo_estimado", 0) or 0)
    complemento = bool(data.get("complemento_renta", False))

    # Base score
    score = 50.0
    positivos: List[str] = []
    riesgos: List[str] = []
    recomendaciones: List[str] = []
    risk_codes: List[str] = []

    # Evitar división por cero
    if dividendo <= 0:
        dividendo = 1.0

    # Regla: ingreso >= 4x dividendo
    ingreso_cubre_dividendo = ingreso >= 4 * dividendo
    if ingreso >= 4 * dividendo:
        score += 25
        positivos.append("Ingreso consistente con el dividendo estimado")
    else:
        score -= 15
        risk_codes.append("ingreso_dividendo")
        riesgos.append("El dividendo objetivo podria exigir mas holgura financiera.")
        recomendaciones.append("Revisar el dividendo estimado o ajustar el objetivo de compra.")

    # Regla: deuda > 40% ingreso penaliza
    if ingreso > 0 and deuda > 0.4 * ingreso:
        score -= 20
        risk_codes.append("deuda_alta")
        riesgos.append("La carga mensual de deudas podria afectar la evaluacion.")
        recomendaciones.append("Reducir compromisos mensuales antes de avanzar.")
    else:
        positivos.append("Carga de deuda aceptable")

    # Evaluacion de precio objetivo y pie segun comuna.
    precio_referencia_uf = PRECIOS_REFERENCIA_UF.get(comuna)
    precio_objetivo_clp = 0.0
    pie_minimo_clp = 0.0
    pie_recomendado_clp = 0.0

    if precio_referencia_uf:
        precio_objetivo_clp = precio_referencia_uf * VALOR_UF_CLP
        pie_minimo_clp = precio_objetivo_clp * 0.10
        pie_recomendado_clp = precio_objetivo_clp * 0.20

        if ahorro >= pie_recomendado_clp:
            score += 15
            positivos.append("Ahorro consistente con el objetivo declarado")
        elif ahorro >= pie_minimo_clp:
            score += 5
            positivos.append("Ahorro inicial disponible")
            recomendaciones.append("Aumentar ahorro para acercarse a una posicion mas solida.")
        else:
            score -= 20
            risk_codes.append("ahorro_bajo")
            risk_codes.append("precio_objetivo")
            riesgos.append("El ahorro disponible podria ser bajo para el objetivo de compra declarado.")
            recomendaciones.append("Aumentar ahorro o evaluar una alternativa de compra mas gradual.")
    else:
        # Si no existe referencia de comuna, se conserva una regla simple de respaldo.
        if ahorro < dividendo:
            score -= 10
            risk_codes.append("ahorro_bajo")
            riesgos.append("El ahorro disponible podria ser bajo para iniciar el proceso.")
            recomendaciones.append("Aumentar ahorro para cubrir pie y gastos iniciales")
        else:
            positivos.append("Ahorro disponible adecuado")

    # Tipo de contrato
    if contrato == "indefinido":
        score += 10
        positivos.append("Contrato indefinido (mayor estabilidad laboral)")
    elif contrato == "independiente":
        score -= 5
        risk_codes.append("contrato_independiente")
        riesgos.append("Los ingresos independientes pueden requerir mayor respaldo.")
        recomendaciones.append("Ordenar antecedentes que demuestren estabilidad de ingresos.")

    if continuidad == "menos_6_meses":
        score -= 15
        risk_codes.append("continuidad_baja")
        riesgos.append("La continuidad laboral declarada podria requerir mayor consolidacion.")
        recomendaciones.append("Mantener estabilidad laboral antes de solicitar una evaluacion formal.")
    elif continuidad == "entre_6_y_12_meses":
        score -= 8
        risk_codes.append("continuidad_media")
        riesgos.append("La continuidad laboral aun podria ser un punto a fortalecer.")
        recomendaciones.append("Seguir consolidando antiguedad y estabilidad de ingresos.")
    elif continuidad == "mas_3_anios":
        score += 5
        positivos.append("Continuidad laboral estable")

    if morosidad == "si":
        score -= 30
        risk_codes.append("morosidad_alta")
        riesgos.append("La morosidad declarada es un riesgo relevante para avanzar.")
        recomendaciones.append("Regularizar o aclarar pagos pendientes antes de continuar.")
    elif morosidad == "no_lo_se":
        score -= 12
        risk_codes.append("morosidad_media")
        riesgos.append("Existe incertidumbre sobre la situacion de pagos actual.")
        recomendaciones.append("Revisar tu situacion financiera antes de avanzar.")

    # Complemento de renta mejora ligeramente
    if complemento:
        score += 5
        positivos.append("Posibilidad de complementar renta")

    # Normalización y límites
    score = clamp(score)

    # Clasificación
    if score >= 70:
        clasificacion = "Alto"
    elif score >= 40:
        clasificacion = "Medio"
    else:
        clasificacion = "Bajo"

    # Recomendaciones según clasificación
    if clasificacion == "Bajo":
        recomendaciones.append("Revisar expectativas y plan de ahorro; considerar propiedades con menor dividendo")
    elif clasificacion == "Medio":
        recomendaciones.append("Mejorar ahorro o reducir deuda para pasar a clasificación Alto")

    if not ingreso_cubre_dividendo:
        recomendaciones.append("Ajustar el dividendo objetivo para mantener una carga mensual mas sostenible.")

    result = {
    "score": round(score, 1),
    "classification": clasificacion,
    "positive_indicators": _unique(positivos),
    "risks": _unique(riesgos),
    "recommendations": _unique(recomendaciones),
        "risk_codes": _unique(risk_codes),
    }

    result["ai_explanation"] = generate_ai_explanation(
        result,
        data
    )

    result["improvement_plan"] = generate_improvement_plan(
        result,
        data
    )

    result["executive_summary"] = generate_executive_summary(
        classification=clasificacion,
        score=round(score, 1),
        positive_indicators=_unique(positivos),
        risks=_unique(riesgos)
    )

    result["commercial_guidance"] = generate_commercial_guidance(
        classification=clasificacion,
        score=round(score, 1),
        positive_indicators=_unique(positivos),
        risks=_unique(riesgos),
        recommendations=_unique(recomendaciones) 
    )

    result.pop("risk_codes", None)

    return result
