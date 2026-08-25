from .constants import (
    FOGAES_MAX_PROPERTY_UF,
    FOGAES_MIN_PIE_RATIO,
    DS49_MIN_AHORRO_UF,
    DS49_MIN_EDAD,
    DS49_RSH_VULNERABLE_MAX,
    DS1_MIN_AHORRO_MESES,
    DS1_TRAMO_I_AHORRO_UF,
    DS1_TRAMO_I_TOPE_UF,
    DS1_TRAMO_I_RSH_MAX,
    DS1_TRAMO_I_RSH_ADULTO_MAYOR,
    DS1_TRAMO_II_AHORRO_UF,
    DS1_TRAMO_II_TOPE_UF,
    DS1_TRAMO_II_RSH_MAX,
    DS1_TRAMO_II_RSH_ADULTO_MAYOR,
    DS1_TRAMO_III_AHORRO_UF,
    DS1_TRAMO_III_TOPE_UF,
    LEASING_MIN_EDAD,
    LEY_21748_TOPE_UF,
    LEY_21748_TASA_REDUCCION_PB,
)


def _positive_float(value) -> float:
    try:
        numeric_value = float(value or 0)
    except (TypeError, ValueError):
        return 0.0
    return numeric_value if numeric_value > 0 else 0.0


def _positive_int(value) -> int:
    try:
        return int(float(value or 0))
    except (TypeError, ValueError):
        return 0


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
        notes = (
            "Tu perfil cumple los requisitos básicos para evaluar FOGAES. "
            "Esta información es referencial."
        )
    elif not vivienda_nueva:
        notes = "FOGAES aplica solo para vivienda nueva. Tu objetivo no corresponde a vivienda nueva."
    elif pie_ratio < FOGAES_MIN_PIE_RATIO:
        notes = (
            "Podrías evaluar FOGAES una vez que alcances un pie mínimo del 10%. "
            "Actualmente tu ahorro no alcanza ese umbral."
        )
    else:
        notes = (
            "El valor de la propiedad excede el límite FOGAES. "
            "Considera alternativas dentro del rango cubierto."
        )

    return {
        "type": "FOGAES",
        "name": "FOGAES — Financiamiento para Vivienda Nueva",
        "eligible": eligible,
        "conditions_met": conditions_met,
        "conditions_not_met": conditions_not_met,
        "notes": notes,
        "academy_module": "fogaes",
    }


def _detect_ds49(data: dict, indicators: dict) -> dict:
    edad = _positive_int(data.get("edad"))
    rsh_tramo = _positive_int(data.get("rsh_tramo"))
    propiedad_previa = _is_truthy(data.get("propiedad_previa"))
    ahorro_uf = _positive_float(data.get("ahorro_uf"))
    grupo_familiar_rsh = _is_truthy(data.get("grupo_familiar_rsh"))
    es_adulto_mayor = edad >= 60

    conditions_met = []
    conditions_not_met = []

    if edad >= DS49_MIN_EDAD:
        conditions_met.append("edad_minima")
    else:
        conditions_not_met.append("edad_minima")

    rsh_max = 100 if es_adulto_mayor else DS49_RSH_VULNERABLE_MAX
    if rsh_tramo > 0 and rsh_tramo <= rsh_max:
        conditions_met.append("vulnerabilidad_rsh")
    else:
        conditions_not_met.append("vulnerabilidad_rsh")

    if not propiedad_previa:
        conditions_met.append("sin_propiedad_previa")
    else:
        conditions_not_met.append("sin_propiedad_previa")

    if ahorro_uf >= DS49_MIN_AHORRO_UF:
        conditions_met.append("ahorro_minimo")
    else:
        conditions_not_met.append("ahorro_minimo")

    if grupo_familiar_rsh:
        conditions_met.append("grupo_familiar")
    else:
        conditions_not_met.append("grupo_familiar")

    eligible = len(conditions_not_met) == 0

    if eligible:
        notes = (
            "Tu perfil podría ser compatible con el Fondo Solidario de Elección de Vivienda (DS49). "
            "Esta información es referencial."
        )
    else:
        missing = [c for c in conditions_not_met]
        notes = (
            f"Tu perfil no cumple todos los requisitos del DS49. "
            f"Requisitos pendientes: {', '.join(missing)}."
        )

    return {
        "type": "DS49",
        "name": "Fondo Solidario de Elección de Vivienda (DS49)",
        "eligible": eligible,
        "conditions_met": conditions_met,
        "conditions_not_met": conditions_not_met,
        "notes": notes,
        "academy_module": "ds49",
    }


def _detect_padhi(data: dict, indicators: dict) -> dict:
    deuda_hipotecaria_vigente = _is_truthy(data.get("deuda_hipotecaria_vigente"))
    beneficio_previo = _is_truthy(data.get("beneficio_previo"))

    conditions_met = []
    conditions_not_met = []

    if deuda_hipotecaria_vigente:
        conditions_met.append("deuda_hipotecaria_vigente")
    else:
        conditions_not_met.append("deuda_hipotecaria_vigente")

    if beneficio_previo:
        conditions_met.append("beneficio_previo")
    else:
        conditions_not_met.append("beneficio_previo")

    eligible = deuda_hipotecaria_vigente and beneficio_previo

    if eligible:
        notes = (
            "Podrías ser elegible para el Programa de Acompañamiento a Deudores Hipotecarios (PADHI). "
            "Esta información es referencial."
        )
    elif deuda_hipotecaria_vigente and not beneficio_previo:
        notes = (
            "Tienes deuda hipotecaria vigente. Para acceder a PADHI se requiere haber sido "
            "beneficiario previo de un subsidio habitacional. Revisa la Academia Financiera."
        )
    else:
        notes = (
            "PADHI aplica a familias con morosidad hipotecaria vigente que hayan sido "
            "beneficiarias de un subsidio previo."
        )

    return {
        "type": "PADHI",
        "name": "Programa de Acompañamiento a Deudores Hipotecarios (PADHI)",
        "eligible": eligible,
        "conditions_met": conditions_met,
        "conditions_not_met": conditions_not_met,
        "notes": notes,
        "academy_module": "padhi",
    }


def _detect_ds1(data: dict, indicators: dict) -> dict:
    propiedad_previa = _is_truthy(data.get("propiedad_previa"))
    ahorro_uf = _positive_float(data.get("ahorro_uf"))
    ahorro_antiguedad_meses = _positive_int(data.get("ahorro_antiguedad_meses"))
    rsh_tramo = _positive_int(data.get("rsh_tramo"))
    es_adulto_mayor = _positive_int(data.get("edad")) >= 60
    valor_propiedad_uf = _positive_float(indicators.get("property_value_uf"))

    conditions_met = []
    conditions_not_met = []

    if not propiedad_previa:
        conditions_met.append("sin_propiedad_previa")
    else:
        conditions_not_met.append("sin_propiedad_previa")

    if ahorro_antiguedad_meses >= DS1_MIN_AHORRO_MESES:
        conditions_met.append("antiguedad_ahorro")
    else:
        conditions_not_met.append("antiguedad_ahorro")

    tramo = None
    tramo_nombre = None

    if rsh_tramo > 0 and valor_propiedad_uf > 0:
        rsh_effective_max = 100 if es_adulto_mayor else None

        if (
            ahorro_uf >= DS1_TRAMO_I_AHORRO_UF
            and valor_propiedad_uf <= DS1_TRAMO_I_TOPE_UF
            and rsh_tramo <= (rsh_effective_max or DS1_TRAMO_I_RSH_MAX)
        ):
            tramo = "I"
            tramo_nombre = "Tramo I"
            conditions_met.append(f"tramo_{tramo}_ahorro")
            conditions_met.append(f"tramo_{tramo}_tope")
            conditions_met.append(f"tramo_{tramo}_rsh")
        elif (
            ahorro_uf >= DS1_TRAMO_II_AHORRO_UF
            and valor_propiedad_uf <= DS1_TRAMO_II_TOPE_UF
            and rsh_tramo <= (rsh_effective_max or DS1_TRAMO_II_RSH_MAX)
        ):
            tramo = "II"
            tramo_nombre = "Tramo II"
            conditions_met.append(f"tramo_{tramo}_ahorro")
            conditions_met.append(f"tramo_{tramo}_tope")
            conditions_met.append(f"tramo_{tramo}_rsh")
        elif (
            ahorro_uf >= DS1_TRAMO_III_AHORRO_UF
            and valor_propiedad_uf <= DS1_TRAMO_III_TOPE_UF
            and rsh_tramo > 0
        ):
            tramo = "III"
            tramo_nombre = "Tramo III"
            conditions_met.append(f"tramo_{tramo}_ahorro")
            conditions_met.append(f"tramo_{tramo}_tope")
            conditions_met.append(f"tramo_{tramo}_rsh")

    if tramo:
        conditions_met.append("tramo_compatible")
    else:
        conditions_not_met.append("tramo_compatible")

    eligible = len(conditions_not_met) == 0

    if eligible:
        notes = (
            f"Tu perfil podría ser compatible con el Subsidio Clase Media (DS1), {tramo_nombre}. "
            "Esta información es referencial."
        )
    else:
        missing = [c for c in conditions_not_met]
        notes = (
            "Tu perfil no cumple todos los requisitos del Subsidio Clase Media (DS1). "
            f"Requisitos pendientes: {', '.join(missing)}."
        )

    return {
        "type": "DS1",
        "name": "Subsidio Clase Media para Compra de Viviendas (DS1)",
        "eligible": eligible,
        "conditions_met": conditions_met,
        "conditions_not_met": conditions_not_met,
        "notes": notes,
        "academy_module": "ds1",
    }


def _detect_leasing(data: dict, indicators: dict) -> dict:
    edad = _positive_int(data.get("edad"))
    registro_rui = _is_truthy(data.get("registro_rui"))
    propiedad_previa = _is_truthy(data.get("propiedad_previa"))
    beneficio_previo = _is_truthy(data.get("beneficio_previo"))

    conditions_met = []
    conditions_not_met = []

    if edad >= LEASING_MIN_EDAD:
        conditions_met.append("edad_minima")
    else:
        conditions_not_met.append("edad_minima")

    if registro_rui:
        conditions_met.append("inscrito_rui")
    else:
        conditions_not_met.append("inscrito_rui")

    if not propiedad_previa:
        conditions_met.append("sin_propiedad_previa")
    else:
        conditions_not_met.append("sin_propiedad_previa")

    if not beneficio_previo:
        conditions_met.append("sin_beneficio_previo")
    else:
        conditions_not_met.append("sin_beneficio_previo")

    eligible = len(conditions_not_met) == 0

    if eligible:
        notes = (
            "Tu perfil podría ser compatible con el Subsidio para Arrendamiento con "
            "Promesa de Compraventa (Leasing Habitacional). Esta información es referencial."
        )
    else:
        missing = [c for c in conditions_not_met]
        notes = (
            "Tu perfil no cumple todos los requisitos del Leasing Habitacional. "
            f"Requisitos pendientes: {', '.join(missing)}."
        )

    return {
        "type": "LEASING",
        "name": "Subsidio para Arrendamiento con Promesa de Compraventa (Leasing)",
        "eligible": eligible,
        "conditions_met": conditions_met,
        "conditions_not_met": conditions_not_met,
        "notes": notes,
        "academy_module": "leasing",
    }


def _detect_ley_21748(data: dict, indicators: dict) -> dict:
    vivienda_nueva = _is_truthy(data.get("vivienda_nueva"))
    persona_natural = not _is_truthy(data.get("es_empresa"))
    valor_propiedad_uf = _positive_float(indicators.get("property_value_uf"))

    conditions_met = []
    conditions_not_met = []

    if vivienda_nueva:
        conditions_met.append("vivienda_nueva")
    else:
        conditions_not_met.append("vivienda_nueva")

    if persona_natural:
        conditions_met.append("persona_natural")
    else:
        conditions_not_met.append("persona_natural")

    if valor_propiedad_uf > 0 and valor_propiedad_uf <= LEY_21748_TOPE_UF:
        conditions_met.append("valor_dentro_limite")
    else:
        conditions_not_met.append("valor_dentro_limite")

    eligible = len(conditions_not_met) == 0

    if eligible:
        notes = (
            f"Tu perfil podría beneficiarse con la Ley N° 21.748: reducción de "
            f"{LEY_21748_TASA_REDUCCION_PB} puntos base en la tasa de interés. "
            "Esta información es referencial."
        )
    else:
        missing = [c for c in conditions_not_met]
        notes = (
            "Tu perfil no cumple todos los requisitos de la Ley N° 21.748. "
            f"Requisitos pendientes: {', '.join(missing)}."
        )

    return {
        "type": "LEY_21748",
        "name": "Subsidio al Dividendo — Ley N° 21.748",
        "eligible": eligible,
        "conditions_met": conditions_met,
        "conditions_not_met": conditions_not_met,
        "notes": notes,
        "academy_module": "ley_21748",
    }


def detect_housing_benefits(data: dict, indicators: dict) -> dict:
    safe_data = data or {}
    safe_indicators = indicators or {}

    benefits = [
        _detect_fogaes(safe_data, safe_indicators),
        _detect_ds49(safe_data, safe_indicators),
        _detect_padhi(safe_data, safe_indicators),
        _detect_ds1(safe_data, safe_indicators),
        _detect_leasing(safe_data, safe_indicators),
        _detect_ley_21748(safe_data, safe_indicators),
    ]

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
        "disclaimer": (
            "La información es estrictamente referencial, no garantiza la obtención del "
            "subsidio o beneficio, y no reemplaza la evaluación oficial de las entidades "
            "bancarias o del MINVU."
        ),
    }
