# Property value resolution layer for future project-aware scoring.

from .constants import VALOR_UF_CLP


def _positive_float(value) -> float:
    try:
        numeric_value = float(value or 0)
    except (TypeError, ValueError):
        return 0.0
    return numeric_value if numeric_value > 0 else 0.0


def _resolve_uf_value(data: dict) -> float:
    declared_uf_value = _positive_float(data.get("uf_value_clp"))
    return declared_uf_value or VALOR_UF_CLP


def _get_reference_prices_uf() -> dict:
    # Lazy import keeps this preparatory layer disconnected from scoring.py at load time.
    try:
        from ..scoring import PRECIOS_REFERENCIA_UF
    except ImportError:
        return {}
    return PRECIOS_REFERENCIA_UF


def _build_result(property_value_clp: float, property_value_uf: float, source: str, uf_value_clp: float) -> dict:
    return {
        "property_value_clp": property_value_clp,
        "property_value_uf": property_value_uf,
        "property_value_source": source,
        "uf_value_clp": uf_value_clp,
    }


def _from_clp(property_value_clp: float, source: str, uf_value_clp: float) -> dict:
    return _build_result(
        property_value_clp=property_value_clp,
        property_value_uf=property_value_clp / uf_value_clp if uf_value_clp > 0 else 0.0,
        source=source,
        uf_value_clp=uf_value_clp,
    )


def _from_uf(property_value_uf: float, source: str, uf_value_clp: float) -> dict:
    return _build_result(
        property_value_clp=property_value_uf * uf_value_clp,
        property_value_uf=property_value_uf,
        source=source,
        uf_value_clp=uf_value_clp,
    )


def _default_reference_uf(reference_prices: dict) -> float:
    values = [_positive_float(value) for value in reference_prices.values()]
    valid_values = [value for value in values if value > 0]
    if not valid_values:
        return 0.0
    return sum(valid_values) / len(valid_values)


def resolve_property_value_clp(data: dict) -> dict:
    safe_data = data or {}
    uf_value_clp = _resolve_uf_value(safe_data)

    declared_clp = _positive_float(safe_data.get("property_value_clp"))
    if declared_clp:
        return _from_clp(declared_clp, "declared_clp", uf_value_clp)

    declared_uf = _positive_float(safe_data.get("property_value_uf"))
    if declared_uf:
        return _from_uf(declared_uf, "declared_uf", uf_value_clp)

    property_value = _positive_float(safe_data.get("property_value"))
    property_value_unit = str(safe_data.get("property_value_unit") or "").strip().lower()
    if property_value and property_value_unit == "clp":
        return _from_clp(property_value, "property_value_clp_unit", uf_value_clp)
    if property_value and property_value_unit == "uf":
        return _from_uf(property_value, "property_value_uf_unit", uf_value_clp)

    reference_prices = _get_reference_prices_uf()
    comuna_objetivo = safe_data.get("comuna_objetivo")
    reference_uf = _positive_float(reference_prices.get(comuna_objetivo))
    if reference_uf:
        return _from_uf(reference_uf, "comuna_reference", uf_value_clp)

    default_reference_uf = _default_reference_uf(reference_prices)
    if default_reference_uf:
        return _from_uf(default_reference_uf, "default_reference", uf_value_clp)

    return _build_result(0.0, 0.0, "unknown", uf_value_clp)
