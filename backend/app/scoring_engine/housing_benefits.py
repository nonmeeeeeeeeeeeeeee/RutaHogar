from .constants import FOGAES_MAX_PROPERTY_UF, FOGAES_MIN_PIE_RATIO


def _positive_float(value) -> float:
    try:
        numeric_value = float(value or 0)
    except (TypeError, ValueError):
        return 0.0
    return numeric_value if numeric_value > 0 else 0.0


def _is_truthy(value) -> bool:
    return value is True or str(value).strip().lower() in {"true", "1", "si", "sí", "yes"}


def _detect_fogaes(data: dict, indicators: dict) -> dict:
    vivienda_nueva = _is_truthy(data.get("vivienda_nueva"))
    property_value_uf = _positive_float(indicators.get("property_value_uf"))
    pie_ratio = _positive_float(indicators.get("pie_ratio"))

    conditions_met = []
    conditions_not_met = []

    if vivienda_nueva:
        conditions_met.append("vivienda_nueva")
    else:
        conditions_not_met.append("vivienda_nueva")

    if property_value_uf > 0 and property_value_uf <= FOGAES_MAX_PROPERTY_UF:
        conditions_met.append("precio_dentro_limite")
    else:
        conditions_not_met.append("precio_dentro_limite")

    if pie_ratio >= FOGAES_MIN_PIE_RATIO:
        conditions_met.append("pie_suficiente")
    else:
        conditions_not_met.append("pie_suficiente")

    eligible = len(conditions_not_met) == 0

    if eligible:
        notes = "Tu perfil cumple los requisitos básicos para evaluar FOGAES. Esta información es referencial."
    elif not vivienda_nueva:
        notes = "FOGAES aplica solo para vivienda nueva. Tu objetivo no corresponde a vivienda nueva."
    elif pie_ratio < FOGAES_MIN_PIE_RATIO:
        notes = "Podrías evaluar FOGAES una vez que alcances un pie mínimo del 10%. Actualmente tu ahorro no alcanza ese umbral."
    else:
        notes = "El valor de la propiedad excede el límite FOGAES. Considera alternativas dentro del rango cubierto."

    return {
        "type": "FOGAES",
        "name": "FOGAES — Financiamiento para Vivienda Nueva",
        "eligible": eligible,
        "conditions_met": conditions_met,
        "conditions_not_met": conditions_not_met,
        "notes": notes,
    }


def detect_housing_benefits(data: dict, indicators: dict) -> dict:
    safe_data = data or {}
    safe_indicators = indicators or {}

    benefits = [_detect_fogaes(safe_data, safe_indicators)]

    applicable = [b for b in benefits if b["eligible"]]
    summary = (
        "Es posible que tu perfil sea compatible con beneficios habitacionales. "
        "Esta información es referencial y no garantiza aprobación."
        if applicable
        else "No se detectaron beneficios habitacionales aplicables a tu perfil actual."
    )

    return {
        "applicable_benefits": benefits,
        "summary": summary,
        "disclaimer": "Los beneficios habitacionales dependen de requisitos externos y evaluación formal.",
    }
