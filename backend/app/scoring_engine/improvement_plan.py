# Structured improvement plan layer for future financial preparation workflows.

import math


def _positive_float(value) -> float:
    try:
        numeric_value = float(value or 0)
    except (TypeError, ValueError):
        return 0.0
    return numeric_value if numeric_value > 0 else 0.0


def _blocker_codes(blockers: list) -> set:
    return {blocker.get("code") for blocker in blockers or [] if isinstance(blocker, dict)}


def _is_truthy(value) -> bool:
    return value is True or str(value).strip().lower() in {"true", "1", "si", "sí", "yes"}


def _estimate_months(gap: float, monthly_target: float) -> int:
    if gap <= 0:
        return 0
    if monthly_target <= 0:
        return 12
    return max(1, math.ceil(gap / monthly_target))


def _action(
    action_type: str,
    title: str,
    description: str,
    current_value: float,
    target_value: float,
    gap: float,
    priority: str,
    estimated_months: int,
) -> dict:
    return {
        "type": action_type,
        "title": title,
        "description": description,
        "current_value": round(current_value, 1),
        "target_value": round(target_value, 1),
        "gap": round(max(gap, 0.0), 1),
        "priority": priority,
        "estimated_months": estimated_months,
    }


def build_structured_improvement_plan(data: dict, indicators: dict, blockers: list) -> list:
    safe_data = data or {}
    safe_indicators = indicators or {}
    codes = _blocker_codes(blockers)
    actions = []

    ingreso_total = _positive_float(safe_indicators.get("ingreso_total"))
    if ingreso_total <= 0:
        ingreso_total = _positive_float(safe_data.get("ingreso_mensual"))
    ahorro = _positive_float(safe_data.get("ahorro_disponible"))
    deuda_mensual = _positive_float(safe_data.get("deuda_mensual"))
    brecha_pie_minimo = _positive_float(safe_indicators.get("brecha_pie_minimo"))

    if "pie_insuficiente" in codes:
        pie_minimo = _positive_float(safe_indicators.get("pie_minimo_clp"))
        monthly_savings_target = ingreso_total * 0.10
        actions.append(
            _action(
                "increase_savings",
                "Aumentar ahorro para el pie",
                "El ahorro disponible no alcanza el pie minimo estimado.",
                ahorro,
                pie_minimo if pie_minimo > 0 else ahorro + brecha_pie_minimo,
                brecha_pie_minimo,
                "high",
                _estimate_months(brecha_pie_minimo, monthly_savings_target),
            )
        )

    if codes.intersection({"deuda_actual_alta", "carga_total_alta"}):
        target_debt = ingreso_total * 0.30 if ingreso_total > 0 else 0.0
        debt_gap = max(deuda_mensual - target_debt, 0.0)
        actions.append(
            _action(
                "reduce_debt",
                "Reducir deuda mensual",
                "La deuda mensual declarada supera un nivel prudente respecto del ingreso.",
                deuda_mensual,
                target_debt,
                debt_gap,
                "high" if "carga_total_alta" in codes else "medium",
                _estimate_months(debt_gap, ingreso_total * 0.10),
            )
        )

    if "dividendo_exigente" in codes:
        dividendo = _positive_float(safe_data.get("dividendo_estimado"))
        target_dividend = ingreso_total * 0.25 if ingreso_total > 0 else 0.0
        actions.append(
            _action(
                "adjust_property_goal",
                "Ajustar objetivo inmobiliario",
                "El dividendo estimado exige demasiada carga mensual; conviene aumentar pie, reducir valor objetivo, ajustar plazo o complementar renta.",
                dividendo,
                target_dividend,
                max(dividendo - target_dividend, 0.0),
                "high",
                1,
            )
        )

    if "morosidad_vigente" in codes:
        monto_morosidad = _positive_float(safe_data.get("monto_morosidad"))
        actions.append(
            _action(
                "regularize_debt",
                "Regularizar morosidad",
                "Regulariza o aclara la morosidad vigente antes de una derivacion comercial.",
                monto_morosidad,
                0.0,
                monto_morosidad,
                "high",
                _estimate_months(monto_morosidad, ingreso_total * 0.10),
            )
        )

    if "morosidad_desconocida" in codes:
        actions.append(
            _action(
                "verify_credit_status",
                "Verificar situacion crediticia",
                "Revisa tu situacion financiera actual antes de avanzar con una evaluacion formal.",
                0.0,
                0.0,
                0.0,
                "medium",
                1,
            )
        )

    if "continuidad_laboral_baja" in codes:
        actions.append(
            _action(
                "improve_job_stability",
                "Fortalecer continuidad laboral",
                "Es recomendable esperar mayor continuidad o reunir respaldos de ingresos antes de avanzar.",
                0.0,
                6.0,
                6.0,
                "medium",
                6,
            )
        )

    if "complemento_incompleto" in codes:
        actions.append(
            _action(
                "complete_complement_data",
                "Completar datos del complementario",
                "Completa ingresos, deuda, contrato, continuidad, morosidad y relacion del complementario.",
                0.0,
                1.0,
                1.0,
                "high",
                1,
            )
        )

    if "edad_plazo_riesgoso" in codes:
        plazo_credito = _positive_float(safe_data.get("plazo_credito_hipotecario"))
        actions.append(
            _action(
                "adjust_credit_term",
                "Ajustar plazo del credito",
                "Simula un menor plazo hipotecario o revisa alternativas compatibles con la edad declarada.",
                plazo_credito,
                max(plazo_credito - 5, 0.0),
                5.0 if plazo_credito > 5 else plazo_credito,
                "medium",
                1,
            )
        )

    if _is_truthy(safe_data.get("pie_en_cuotas_interes")):
        actions.append(
            _action(
                "review_installment_down_payment",
                "Revisar opción de pie en cuotas",
                "Consulta si el proyecto permite pago del pie en cuotas; depende de condiciones comerciales de la inmobiliaria y no reemplaza el ahorro ya disponible.",
                0.0,
                0.0,
                0.0,
                "medium",
                1,
            )
        )

    return actions
