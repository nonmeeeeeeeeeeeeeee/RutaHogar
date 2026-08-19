# Constants for the future professional scoring engine.
# They do not replace the current logic in backend/app/scoring.py yet.
# Version 1.1.0-prep is preparatory and must not be exposed as a functional
# algorithm change until these layers are explicitly integrated.

ALGORITHM_VERSION = "1.1.0-prep"

VALOR_UF_CLP = 40695

CLASSIFICATION_THRESHOLDS = {
    "alto": 75,
    "medio": 50,
}

SCORING_WEIGHTS = {
    "capacidad_pago": 0.25,
    "endeudamiento": 0.20,
    "pie_ahorro": 0.20,
    "estabilidad_laboral": 0.15,
    "historial_pago": 0.10,
    "complemento_renta": 0.05,
    "calidad_datos": 0.05,
}

BLOCKER_SEVERITIES = {
    "info": "info",
    "low": "low",
    "medium": "medium",
    "high": "high",
    "critical": "critical",
}

PROJECT_FIT_CLASSIFICATIONS = {
    "compatible": "Compatible",
    "near": "Cercano",
    "out_of_reach": "Fuera de alcance",
    "requires_info": "Requiere antecedentes",
}

COMMERCIAL_ACTIONS = {
    "contact_now": "Contactar ahora",
    "contact_with_review": "Contactar con revisión",
    "nurture": "Nutrir con plan de mejora",
    "reorient": "Reorientar a otro proyecto",
    "request_info": "Solicitar antecedentes",
    "do_not_route": "No derivar todavía",
}

FOGAES_MAX_PROPERTY_UF = 4000
FOGAES_MIN_PIE_RATIO = 0.10
