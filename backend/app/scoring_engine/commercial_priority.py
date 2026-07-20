# Commercial priority layer, separate from the financial score itself.

from .constants import COMMERCIAL_ACTIONS


def _blocker_codes(blockers: list) -> set:
    return {blocker.get("code") for blocker in blockers or [] if isinstance(blocker, dict)}


def _priority(action_key: str, reason: str, send_to_crm: bool) -> dict:
    action = COMMERCIAL_ACTIONS[action_key]
    return {
        "level": action,
        "action": action,
        "reason": reason,
        "send_to_crm": send_to_crm,
    }


def _has_near_term_purchase_intent(data: dict) -> bool:
    return (data or {}).get("plazo_compra") in {
        "inmediato",
        "0_3_meses",
        "3_a_6_meses",
        "3_6_meses",
    }


def _has_property_seen(data: dict) -> bool:
    return (data or {}).get("tiene_propiedad_vista") is True


def calculate_commercial_priority(
    classification: str,
    project_fit: dict,
    blockers: list,
    score: float,
    data: dict | None = None,
) -> dict:
    safe_project_fit = project_fit or {}
    safe_data = data or {}
    codes = _blocker_codes(blockers)
    project_fit_classification = safe_project_fit.get("classification")
    project_fit_status = safe_project_fit.get("status")
    near_term_intent = _has_near_term_purchase_intent(safe_data)
    property_seen = _has_property_seen(safe_data)

    if "complemento_incompleto" in codes:
        return _priority(
            "request_info",
            "Faltan antecedentes del complemento de renta antes de priorizar comercialmente.",
            False,
        )

    if codes.intersection({"morosidad_vigente", "carga_total_alta"}):
        return _priority(
            "do_not_route",
            "El lead presenta bloqueadores financieros críticos y no debe derivarse todavía.",
            False,
        )

    if project_fit_status == "requires_info" or project_fit_classification == "Requiere antecedentes":
        return _priority(
            "request_info",
            "Faltan antecedentes para evaluar la compatibilidad con el objetivo inmobiliario.",
            False,
        )

    if classification == "Alto" and safe_project_fit.get("compatible") is True:
        if near_term_intent and property_seen:
            return _priority(
                "contact_now",
                "Lead con alta preparación financiera, objetivo compatible, compra pronta y propiedad o proyecto visto.",
                True,
            )
        return _priority(
            "contact_now",
            "Lead con alta preparación financiera y compatible con el objetivo inmobiliario.",
            True,
        )

    if classification == "Medio" and project_fit_classification in {"Compatible", "Cercano"}:
        if near_term_intent or property_seen:
            return _priority(
                "contact_with_review",
                "Lead con potencial comercial y señales de intención de compra; requiere revisión antes de avanzar.",
                True,
            )
        return _priority(
            "contact_with_review",
            "Lead con potencial comercial, pero requiere revisión antes de avanzar.",
            True,
        )

    if score >= 70 and project_fit_classification == "Fuera de alcance":
        return _priority(
            "reorient",
            "Lead financieramente interesante, pero el objetivo inmobiliario declarado está fuera de alcance.",
            False,
        )

    if classification == "Bajo":
        return _priority(
            "nurture",
            "Lead con baja preparación financiera actual; conviene nutrirlo con un plan de mejora.",
            False,
        )

    return _priority(
        "request_info",
        "Se requieren más antecedentes antes de definir una prioridad comercial.",
        False,
    )
