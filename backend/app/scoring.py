from typing import Dict, List
from .ai import (
    generate_executive_summary,
    generate_commercial_guidance
)


SCORING_VERSION = "1.0.0"

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

    if "complemento_morosidad_alta" in risks:
        messages.append("evaluar la situacion de morosidad del co-deudor")
    elif "complemento_morosidad_media" in risks:
        messages.append("confirmar la situacion financiera del co-deudor")

    if "complemento_deuda_alta" in risks:
        messages.append("revisar el nivel de endeudamiento del co-deudor")

    if "complemento_tarjetas_excesivas" in risks:
        messages.append("reducir la cantidad de tarjetas de credito del co-deudor")

    if "complemento_continuidad_baja" in risks or "complemento_continuidad_media" in risks:
        messages.append("consolidar la continuidad laboral del co-deudor")

    if "complemento_sin_datos" in risks:
        messages.append("completar la informacion del co-deudor")

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

    if "complemento_morosidad_alta" in risks:
        plan.append("Evalua si el co-deudor puede regularizar su situacion de morosidad antes de comprometerse.")
    elif "complemento_morosidad_media" in risks:
        plan.append("Confirma la situacion financiera actual del co-deudor y si existen pagos pendientes.")

    if "complemento_deuda_alta" in risks:
        plan.append("El co-deudor deberia priorizar reducir sus deudas mensuales antes de asumir un nuevo compromiso.")

    if "complemento_tarjetas_excesivas" in risks:
        plan.append("El co-deudor deberia reducir la cantidad de tarjetas de credito activas para mejorar su perfil.")

    if "complemento_continuidad_baja" in risks or "complemento_continuidad_media" in risks:
        plan.append("El co-deudor deberia consolidar su estabilidad laboral antes de ser considerado como apoyo.")

    if "complemento_contrato_independiente" in risks:
        plan.append("Ordena antecedentes de ingresos del co-deudor si trabaja independiente.")

    if "complemento_sin_datos" in risks:
        plan.append("Completa toda la informacion del co-deudor para una evaluacion precisa.")

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
    components = {
        "carga_financiera": 0.0,
        "estabilidad_laboral": 0.0,
        "historial_crediticio": 0.0,
        "pie_disponible": 0.0,
        "perfil_compra": 0.0,
    }
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
        components["carga_financiera"] += 25
        score += 25
        positivos.append("Ingreso consistente con el dividendo estimado")
    else:
        components["carga_financiera"] -= 15
        score -= 15
        risk_codes.append("ingreso_dividendo")
        riesgos.append("El dividendo objetivo podria exigir mas holgura financiera.")
        recomendaciones.append("Revisar el dividendo estimado o ajustar el objetivo de compra.")

    # Regla: deuda > 40% ingreso penaliza
    if ingreso > 0 and deuda > 0.4 * ingreso:
        components["carga_financiera"] -= 20
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
            components["pie_disponible"] += 15
            score += 15
            positivos.append("Ahorro consistente con el objetivo declarado")
        elif ahorro >= pie_minimo_clp:
            components["pie_disponible"] += 5
            score += 5
            positivos.append("Ahorro inicial disponible")
            recomendaciones.append("Aumentar ahorro para acercarse a una posicion mas solida.")
        else:
            components["pie_disponible"] -= 20
            score -= 20
            risk_codes.append("ahorro_bajo")
            risk_codes.append("precio_objetivo")
            riesgos.append("El ahorro disponible podria ser bajo para el objetivo de compra declarado.")
            recomendaciones.append("Aumentar ahorro o evaluar una alternativa de compra mas gradual.")
    else:
        # Si no existe referencia de comuna, se conserva una regla simple de respaldo.
        if ahorro < dividendo:
            components["pie_disponible"] -= 10
            score -= 10
            risk_codes.append("ahorro_bajo")
            riesgos.append("El ahorro disponible podria ser bajo para iniciar el proceso.")
            recomendaciones.append("Aumentar ahorro para cubrir pie y gastos iniciales")
        else:
            positivos.append("Ahorro disponible adecuado")

    # Tipo de contrato
    if contrato == "indefinido":
        components["estabilidad_laboral"] += 10
        score += 10
        positivos.append("Contrato indefinido (mayor estabilidad laboral)")
    elif contrato == "independiente":
        components["estabilidad_laboral"] -= 5
        score -= 5
        risk_codes.append("contrato_independiente")
        riesgos.append("Los ingresos independientes pueden requerir mayor respaldo.")
        recomendaciones.append("Ordenar antecedentes que demuestren estabilidad de ingresos.")

    if continuidad == "menos_6_meses":
        components["estabilidad_laboral"] -= 15
        score -= 15
        risk_codes.append("continuidad_baja")
        riesgos.append("La continuidad laboral declarada podria requerir mayor consolidacion.")
        recomendaciones.append("Mantener estabilidad laboral antes de solicitar una evaluacion formal.")
    elif continuidad == "entre_6_y_12_meses":
        components["estabilidad_laboral"] -= 8
        score -= 8
        risk_codes.append("continuidad_media")
        riesgos.append("La continuidad laboral aun podria ser un punto a fortalecer.")
        recomendaciones.append("Seguir consolidando antiguedad y estabilidad de ingresos.")
    elif continuidad == "mas_3_anios":
        components["estabilidad_laboral"] += 5
        score += 5
        positivos.append("Continuidad laboral estable")

    if morosidad == "si":
        components["historial_crediticio"] -= 30
        score -= 30
        risk_codes.append("morosidad_alta")
        riesgos.append("La morosidad declarada es un riesgo relevante para avanzar.")
        recomendaciones.append("Regularizar o aclarar pagos pendientes antes de continuar.")
    elif morosidad == "no_lo_se":
        components["historial_crediticio"] -= 12
        score -= 12
        risk_codes.append("morosidad_media")
        riesgos.append("Existe incertidumbre sobre la situacion de pagos actual.")
        recomendaciones.append("Revisar tu situacion financiera antes de avanzar.")

    # Complemento de renta con evaluacion completa del co-deudor
    if complemento:
        comp_ingreso = float(data.get("complemento_ingreso_mensual", 0) or 0)
        comp_deuda = float(data.get("complemento_deuda_mensual", 0) or 0)
        comp_morosidad = data.get("complemento_morosidad", "")
        comp_contrato = data.get("complemento_tipo_contrato", "")
        comp_continuidad = data.get("complemento_continuidad_laboral", "")
        comp_tarjetas = int(data.get("complemento_tarjetas_activas", 0) or 0)

        co_debtor_has_data = (
            comp_ingreso > 0 or comp_deuda > 0
            or comp_morosidad or comp_contrato
            or comp_continuidad or comp_tarjetas > 0
        )

        if not co_debtor_has_data:
            components["perfil_compra"] -= 5
            score -= 5
            risk_codes.append("complemento_sin_datos")
            riesgos.append("Falta informacion detallada del co-deudor para evaluar el riesgo.")
            recomendaciones.append("Completa los datos del co-deudor para una evaluacion mas precisa.")
        else:
            if comp_morosidad == "si":
                components["perfil_compra"] -= 20
                score -= 20
                risk_codes.append("complemento_morosidad_alta")
                riesgos.append("El co-deudor declara morosidad, lo que representa un riesgo significativo.")
                recomendaciones.append("Considera un co-deudor sin antecedentes de morosidad.")
            elif comp_morosidad == "no_lo_se":
                components["perfil_compra"] -= 10
                score -= 10
                risk_codes.append("complemento_morosidad_media")
                riesgos.append("Existe incertidumbre sobre la situacion de pagos del co-deudor.")
                recomendaciones.append("Confirma la situacion financiera del co-deudor antes de avanzar.")

            if comp_ingreso > 0 and comp_deuda > 0.4 * comp_ingreso:
                components["perfil_compra"] -= 15
                score -= 15
                risk_codes.append("complemento_deuda_alta")
                riesgos.append("El co-deudor tiene una carga de deuda elevada en relacion a sus ingresos.")
                recomendaciones.append("El co-deudor deberia reducir sus deudas antes de comprometerse.")

            if comp_contrato == "independiente":
                components["perfil_compra"] -= 5
                score -= 5
                risk_codes.append("complemento_contrato_independiente")
                riesgos.append("El co-deudor trabaja independiente, lo que puede sumar incertidumbre.")
                recomendaciones.append("Respaldar ingresos del co-deudor con antecedentes formales.")

            if comp_continuidad == "menos_6_meses":
                components["perfil_compra"] -= 10
                score -= 10
                risk_codes.append("complemento_continuidad_baja")
                riesgos.append("El co-deudor tiene baja continuidad laboral.")
                recomendaciones.append("El co-deudor deberia consolidar su estabilidad laboral.")
            elif comp_continuidad == "entre_6_y_12_meses":
                components["perfil_compra"] -= 5
                score -= 5
                risk_codes.append("complemento_continuidad_media")
                riesgos.append("El co-deudor tiene continuidad laboral limitada.")

            if comp_tarjetas >= 5:
                components["perfil_compra"] -= 15
                score -= 15
                risk_codes.append("complemento_tarjetas_excesivas")
                riesgos.append("El co-deudor tiene muchas tarjetas de credito activas, lo que puede indicar sobreendeudamiento.")
                recomendaciones.append("El co-deudor deberia reducir su cantidad de tarjetas activas.")
            elif comp_tarjetas >= 3:
                components["perfil_compra"] -= 8
                score -= 8
                risk_codes.append("complemento_tarjetas_excesivas")
                riesgos.append("El co-deudor tiene varias tarjetas de credito activas.")

            perfil_limpio = (
                comp_morosidad == "no"
                and (comp_ingreso <= 0 or comp_deuda <= 0.4 * comp_ingreso)
                and comp_contrato == "indefinido"
                and comp_continuidad in ("entre_1_y_3_anios", "mas_3_anios")
                and comp_tarjetas < 3
            )

            if perfil_limpio:
                components["perfil_compra"] += 10
                score += 10
                positivos.append("El co-deudor presenta un perfil financiero solido")
            else:
                components["perfil_compra"] += 3
                score += 3
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
        "component_scores": {k: round(v, 1) for k, v in components.items()},
        "algorithm_version": SCORING_VERSION,
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
