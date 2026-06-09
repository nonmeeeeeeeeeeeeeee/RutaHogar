from typing import Dict, List
from .ai import (
    generate_executive_summary,
    generate_commercial_guidance,
    generate_user_explanation,
)


SCORING_VERSION = "1.0.1"

# Valor configurable usado para convertir los precios referenciales desde UF a CLP.
VALOR_UF_CLP = 40695

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



def generate_improvement_plan(score_result: Dict, user_data: Dict) -> List[str]:
    risks = set(score_result.get("risk_codes", []))
    plan = []

    if "morosidad_alta" in risks:
        plan.append("Regulariza o aclara compromisos pendientes antes de iniciar una evaluación formal.")
    elif "morosidad_media" in risks:
        plan.append("Revisa tu situación financiera actual y confirma si existen pagos pendientes o atrasos.")

    if "ahorro_bajo" in risks:
        plan.append("Define una meta mensual de ahorro y separa esos fondos apenas recibas tus ingresos.")
    else:
        plan.append("Mantén un fondo de ahorro separado para pie, gastos iniciales y margen de seguridad.")

    if "deuda_alta" in risks:
        plan.append("Prioriza reducir cuotas mensuales o cerrar deudas pequeñas antes de aumentar tu compromiso hipotecario.")
    else:
        plan.append("Evita tomar nuevas deudas de consumo mientras preparas tu compra.")

    if "contrato_plazo_fijo" in risks:
        plan.append("Evalua fortalecer tu estabilidad contractual antes de iniciar una evaluación hipotecaria formal.")
    elif "contrato_honorarios_variable" in risks:
        plan.append("Ordena respaldos de ingresos variables, boletas, contratos o movimientos consistentes.")
    elif "continuidad_baja" in risks or "continuidad_media" in risks or "contrato_independiente" in risks:
        plan.append("Mantén continuidad laboral y ordena respaldos simples de ingresos, especialmente si trabajas independiente.")
    else:
        plan.append("Conserva estabilidad laboral y evita cambios bruscos de fuente de ingreso durante la preparación.")

    if "ingreso_dividendo" in risks or "precio_objetivo" in risks or score_result.get("classification") != "Alto":
        plan.append("Revisa comuna, precio esperado o dividendo objetivo para que la compra sea más sostenible.")

    if "complemento_morosidad_alta" in risks:
        plan.append("Evalúa si el co-deudor puede regularizar su situación de morosidad antes de comprometerse.")
    elif "complemento_morosidad_media" in risks:
        plan.append("Confirma la situación financiera actual del co-deudor y si existen pagos pendientes.")

    if "complemento_deuda_alta" in risks:
        plan.append("El co-deudor debería priorizar reducir sus deudas mensuales antes de asumir un nuevo compromiso.")

    if "complemento_tarjetas_excesivas" in risks:
        plan.append("El co-deudor debería reducir la cantidad de tarjetas de crédito activas para mejorar su perfil.")

    if "complemento_continuidad_baja" in risks or "complemento_continuidad_media" in risks:
        plan.append("El co-deudor debería consolidar su estabilidad laboral antes de ser considerado como apoyo.")

    if "complemento_contrato_independiente" in risks:
        plan.append("Ordena antecedentes de ingresos del co-deudor si trabaja independiente.")

    if "complemento_relacion_debil" in risks:
        plan.append("Valida con anticipación si la relación declarada para complementar renta sera aceptada en una evaluación formal.")

    if "complemento_sin_datos" in risks:
        plan.append("Completa toda la información del co-deudor para una evaluación precisa.")

    if user_data.get("complemento_renta"):
        plan.append("Ordena la información de la persona que complementará renta y valida que pueda sostener ese apoyo.")
    elif score_result.get("classification") in {"Medio", "Bajo"}:
        plan.append("Evalua complementar renta con una persona de confianza si tu situación actual no alcanza para el objetivo.")

    return _unique(plan)


def calculate_score(data: Dict) -> Dict:
    ingreso = float(data.get("ingreso_mensual", 0) or 0)
    deuda = float(data.get("deuda_mensual", 0) or 0)
    ahorro = float(data.get("ahorro_disponible", 0) or 0)
    contrato = data.get("tipo_contrato", "")
    continuidad = data.get("continuidad_laboral", "")
    morosidad = data.get("morosidad_actual", "")
    antiguedad_morosidad = data.get("antiguedad_morosidad", "")
    comuna = data.get("comuna_objetivo")
    dividendo = float(data.get("dividendo_estimado", 0) or 0)
    complemento = bool(data.get("complemento_renta", False))
    comp_ingreso = float(data.get("ingreso_mensual_complementario", data.get("complemento_ingreso_mensual", 0)) or 0)
    comp_deuda = float(data.get("deuda_mensual_complementario", data.get("complemento_deuda_mensual", 0)) or 0)
    comp_morosidad = data.get("morosidad_complementario", data.get("complemento_morosidad", ""))
    comp_contrato = data.get("tipo_contrato_complementario", data.get("complemento_tipo_contrato", ""))
    comp_continuidad = data.get("continuidad_laboral_complementario", data.get("complemento_continuidad_laboral", ""))
    comp_relacion = data.get("relacion_complementario", data.get("complemento_relacion", ""))

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
    relaciones_debiles = {"amigo", "otro"}
    complemento_completo = (
        comp_ingreso > 0
        and comp_deuda >= 0
        and bool(comp_morosidad)
        and bool(comp_contrato)
        and bool(comp_continuidad)
        and bool(comp_relacion)
    )
    complemento_valido_para_capacidad = (
        complemento
        and complemento_completo
        and comp_morosidad == "no"
        and comp_relacion not in relaciones_debiles
    )
    ingreso_para_capacidad = ingreso + (comp_ingreso if complemento_valido_para_capacidad else 0)

    # Evitar división por cero
    if dividendo <= 0:
        dividendo = 1.0

    ingreso_cubre_dividendo = ingreso_para_capacidad >= 4 * dividendo
    if ingreso_cubre_dividendo:
        components["carga_financiera"] += 25
        score += 25
        positivos.append("Ingreso consistente con el dividendo estimado")
    else:
        components["carga_financiera"] -= 15
        score -= 15
        risk_codes.append("ingreso_dividendo")
        riesgos.append("El dividendo objetivo podría exigir más holgura financiera.")
        recomendaciones.append("Revisar el dividendo estimado o ajustar el objetivo de compra.")

    # Regla: deuda > 40% ingreso penaliza
    if ingreso > 0 and deuda > 0.4 * ingreso:
        components["carga_financiera"] -= 20
        score -= 20
        risk_codes.append("deuda_alta")
        riesgos.append("La carga mensual de deudas podría afectar la evaluación.")
        recomendaciones.append("Reducir compromisos mensuales antes de avanzar.")
    else:
        positivos.append("Carga de deuda aceptable")

    # Evaluacion de precio objetivo y pie segun valor declarado o comuna.
    property_value_clp = float(data.get("property_value_clp", 0) or 0)
    precio_referencia_uf = PRECIOS_REFERENCIA_UF.get(comuna)
    precio_objetivo_clp = 0.0
    pie_minimo_clp = 0.0
    pie_recomendado_clp = 0.0

    if property_value_clp > 0 or precio_referencia_uf:
        precio_objetivo_clp = property_value_clp if property_value_clp > 0 else precio_referencia_uf * VALOR_UF_CLP
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
            recomendaciones.append("Aumentar ahorro para acercarse a una posición más solida.")
        else:
            components["pie_disponible"] -= 20
            score -= 20
            risk_codes.append("ahorro_bajo")
            risk_codes.append("precio_objetivo")
            riesgos.append("El ahorro disponible podría ser bajo para el objetivo de compra declarado.")
            recomendaciones.append("Aumentar ahorro o evaluar una alternativa de compra más gradual.")
    else:
        # Si no existe referencia de comuna, se conserva una regla simple de respaldo.
        if ahorro < dividendo:
            components["pie_disponible"] -= 10
            score -= 10
            risk_codes.append("ahorro_bajo")
            riesgos.append("El ahorro disponible podría ser bajo para iniciar el proceso.")
            recomendaciones.append("Aumentar ahorro para cubrir pie y gastos iniciales")
        else:
            positivos.append("Ahorro disponible adecuado")

    # Tipo de contrato
    if contrato == "indefinido":
        components["estabilidad_laboral"] += 10
        score += 10
        positivos.append("Contrato indefinido favorable para una evaluación formal")
    elif contrato == "independiente":
        if continuidad in ("entre_1_y_3_anios", "mas_3_anios"):
            positivos.append("Ingreso independiente con continuidad declarada")
            recomendaciones.append("Mantener respaldos consistentes de ingresos independientes.")
        else:
            score -= 5
            risk_codes.append("contrato_independiente")
            riesgos.append("Los ingresos independientes pueden requerir mayor respaldo de continuidad.")
            recomendaciones.append("Ordenar antecedentes que demuestren estabilidad de ingresos.")
    elif contrato == "plazo_fijo":
        score -= 18
        risk_codes.append("contrato_plazo_fijo")
        riesgos.append("El contrato a plazo fijo puede dificultar una evaluación hipotecaria formal.")
        recomendaciones.append("Fortalecer estabilidad contractual antes de avanzar.")
    elif contrato == "honorarios_variable":
        score -= 10
        risk_codes.append("contrato_honorarios_variable")
        riesgos.append("Los ingresos por honorarios o variables pueden requerir mayor respaldo.")
        recomendaciones.append("Ordenar antecedentes que demuestren continuidad y consistencia de ingresos.")

    if continuidad == "menos_6_meses":
        components["estabilidad_laboral"] -= 15
        score -= 15
        risk_codes.append("continuidad_baja")
        riesgos.append("La continuidad laboral declarada podría requerir mayor consolidación.")
        recomendaciones.append("Mantener estabilidad laboral antes de solicitar una evaluación formal.")
    elif continuidad == "entre_6_y_12_meses":
        components["estabilidad_laboral"] -= 8
        score -= 8
        risk_codes.append("continuidad_media")
        riesgos.append("La continuidad laboral aún podría ser un punto a fortalecer.")
        recomendaciones.append("Seguir consolidando antiguedad y estabilidad de ingresos.")
    elif continuidad == "mas_3_anios":
        components["estabilidad_laboral"] += 5
        score += 5
        positivos.append("Continuidad laboral estable")

    if morosidad == "si":
        components["historial_crediticio"] -= 30
        if antiguedad_morosidad in {"menos_3_meses", "3_a_12_meses"}:
            score -= 35
        else:
            score -= 25
        risk_codes.append("morosidad_alta")
        riesgos.append("La morosidad declarada es un riesgo relevante para avanzar.")
        recomendaciones.append("Regularizar o aclarar pagos pendientes antes de continuar.")
    elif morosidad == "no_lo_se":
        components["historial_crediticio"] -= 12
        score -= 12
        risk_codes.append("morosidad_media")
        riesgos.append("Existe incertidumbre sobre la situación de pagos actual.")
        recomendaciones.append("Revisar tu situación financiera antes de avanzar.")

    # Complemento de renta con evaluacion completa del co-deudor
    if complemento:
        comp_tarjetas = int(data.get("complemento_tarjetas_activas", 0) or 0)
        if not complemento_completo:
            score -= 5
            risk_codes.append("complemento_sin_datos")
            riesgos.append("Falta información detallada del co-deudor para evaluar el riesgo.")
            recomendaciones.append("Completa los datos del co-deudor antes de considerarlo como apoyo de renta.")
        else:
            if comp_morosidad == "si":
                components["perfil_compra"] -= 20
                score -= 20
                risk_codes.append("complemento_morosidad_alta")
                riesgos.append("La persona complementaria declara morosidad, por lo que no mejora esta preevaluación.")
                recomendaciones.append("Considera complementar renta con una persona sin morosidad declarada.")

            if comp_relacion in relaciones_debiles:
                score -= 5
                risk_codes.append("complemento_relacion_debil")
                riesgos.append("La relacion declarada para complementar renta podría requerir mayor respaldo.")
                recomendaciones.append("Valida si esa relacion sería aceptada en una evaluación hipotecaria formal.")

            if comp_ingreso > 0 and comp_deuda > 0.4 * comp_ingreso:
                components["perfil_compra"] -= 15
                score -= 15
                risk_codes.append("complemento_deuda_alta")
                riesgos.append("El co-deudor tiene una carga de deuda elevada en relación a sus ingresos.")
                recomendaciones.append("El co-deudor debería reducir sus deudas antes de comprometerse.")

            if comp_contrato == "independiente":
                if comp_continuidad in ("entre_1_y_3_anios", "mas_3_anios"):
                    recomendaciones.append("Respaldar ingresos independientes del co-deudor con antecedentes formales.")
                else:
                    score -= 5
                    risk_codes.append("complemento_contrato_independiente")
                    riesgos.append("El co-deudor trabaja independiente con continuidad aún limitada.")
                    recomendaciones.append("Respaldar ingresos del co-deudor con antecedentes formales.")
            elif comp_contrato == "plazo_fijo":
                score -= 10
                risk_codes.append("complemento_contrato_plazo_fijo")
                riesgos.append("El contrato a plazo fijo del co-deudor puede limitar su aporte a la evaluación.")
            elif comp_contrato == "honorarios_variable":
                score -= 6
                risk_codes.append("complemento_contrato_variable")
                riesgos.append("Los ingresos variables del co-deudor pueden requerir mayor respaldo.")

            if comp_continuidad == "menos_6_meses":
                components["perfil_compra"] -= 10
                score -= 10
                risk_codes.append("complemento_continuidad_baja")
                riesgos.append("El co-deudor tiene baja continuidad laboral.")
                recomendaciones.append("El co-deudor debería consolidar su estabilidad laboral.")
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
                and comp_relacion not in relaciones_debiles
            )

            if perfil_limpio:
                components["perfil_compra"] += 10
                score += 10
                positivos.append("El co-deudor presenta un perfil financiero solido")
            else:
                components["perfil_compra"] += 3
            if complemento_valido_para_capacidad and "complemento_deuda_alta" not in risk_codes:
                score += 3
                positivos.append("Complemento de renta con antecedentes básicos utilizables")

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
        recomendaciones.append("Ajustar el dividendo objetivo para mantener una carga mensual más sostenible.")

    uniq_positivos = _unique(positivos)
    uniq_riesgos = _unique(riesgos)
    uniq_recomendaciones = _unique(recomendaciones)
    uniq_risk_codes = _unique(risk_codes)

    result = {
    "score": round(score, 1),
    "classification": clasificacion,
    "positive_indicators": uniq_positivos,
    "risks": uniq_riesgos,
    "recommendations": uniq_recomendaciones,
        "risk_codes": uniq_risk_codes,
        "component_scores": {k: round(v, 1) for k, v in components.items()},
        "algorithm_version": SCORING_VERSION,
    }

    result["ai_explanation"] = generate_user_explanation(
        classification=clasificacion,
        score=round(score, 1),
        positive_indicators=uniq_positivos,
        risks=uniq_riesgos,
    )

    result["improvement_plan"] = generate_improvement_plan(
        result,
        data
    )

    result["executive_summary"] = generate_executive_summary(
        classification=clasificacion,
        score=round(score, 1),
        positive_indicators=uniq_positivos,
        risks=uniq_riesgos
    )

    result["commercial_guidance"] = generate_commercial_guidance(
        classification=clasificacion,
        score=round(score, 1),
        positive_indicators=uniq_positivos,
        risks=uniq_riesgos,
        recommendations=uniq_recomendaciones
    )

    result.pop("risk_codes", None)

    return result
