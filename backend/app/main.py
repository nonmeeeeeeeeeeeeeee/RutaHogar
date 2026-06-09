from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel, field_validator, model_validator
from fastapi.middleware.cors import CORSMiddleware
from .scoring import calculate_score

app = FastAPI(title="ScoreLeads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScoreRequest(BaseModel):
    ingreso_mensual: float
    deuda_mensual: float
    edad: int
    ahorro_disponible: float
    property_value: Optional[float] = None
    property_value_unit: Optional[str] = None
    property_value_uf: Optional[float] = None
    property_value_clp: Optional[float] = None
    plazo_credito_hipotecario: int
    tipo_contrato: str  # 'indefinido', 'plazo_fijo', 'independiente'
    continuidad_laboral: str
    morosidad_actual: str
    monto_morosidad: Optional[float] = None
    antiguedad_morosidad: Optional[str] = None
    comuna_objetivo: Optional[str] = None
    dividendo_estimado: float
    complemento_renta: bool = False
    ingreso_mensual_complementario: Optional[float] = None
    deuda_mensual_complementario: Optional[float] = None
    tipo_contrato_complementario: Optional[str] = None
    continuidad_laboral_complementario: Optional[str] = None
    morosidad_complementario: Optional[str] = None
    relacion_complementario: Optional[str] = None
    consentimiento: bool
    declara_patrimonio: bool = False
    valor_vehiculos: Optional[float] = 0.0
    valor_inmuebles: Optional[float] = 0.0
    patrimonio_unit: Optional[str] = "clp"

    @field_validator("ingreso_mensual")
    @classmethod
    def validate_income(cls, value):
        if value <= 0:
            raise ValueError("El ingreso mensual debe ser mayor que 0")
        return value

    @field_validator("deuda_mensual", "ahorro_disponible", "dividendo_estimado")
    @classmethod
    def validate_non_negative(cls, value):
        if value < 0:
            raise ValueError("El valor no puede ser negativo")
        return value

    @field_validator(
        "property_value", 
        "property_value_uf", 
        "property_value_clp", 
        "monto_morosidad",
        "valor_vehiculos",
        "valor_inmuebles"
    )
    @classmethod
    def validate_optional_non_negative(cls, value):
        if value is not None and value < 0:
            raise ValueError("El valor no puede ser negativo")
        return value

    @field_validator("edad")
    @classmethod
    def validate_age(cls, value):
        if value < 18 or value > 100:
            raise ValueError("La edad debe estar entre 18 y 100")
        return value

    @field_validator("plazo_credito_hipotecario")
    @classmethod
    def validate_mortgage_term(cls, value):
        if value not in {10, 15, 20, 25, 30}:
            raise ValueError("Plazo de credito hipotecario inválido")
        return value

    @field_validator("tipo_contrato")
    @classmethod
    def validate_contract_type(cls, value):
        allowed = {"indefinido", "plazo_fijo", "independiente", "honorarios_variable"}
        if value not in allowed:
            raise ValueError("Tipo de contrato inválido")
        return value

    @field_validator("continuidad_laboral")
    @classmethod
    def validate_work_continuity(cls, value):
        allowed = {"menos_6_meses", "entre_6_y_12_meses", "entre_1_y_3_anios", "mas_3_anios"}
        if value not in allowed:
            raise ValueError("Continuidad laboral inválida")
        return value

    @field_validator("morosidad_actual")
    @classmethod
    def validate_current_delinquency(cls, value):
        allowed = {"si", "no"}
        if value not in allowed:
            raise ValueError("Morosidad actual inválida")
        return value

    @field_validator("antiguedad_morosidad")
    @classmethod
    def validate_delinquency_age(cls, value):
        if value is not None:
            allowed = {"menos_3_meses", "3_a_12_meses", "1_a_3_anios", "mas_3_anios"}
            if value not in allowed:
                raise ValueError("Antiguedad de morosidad inválida")
        return value

    @field_validator("property_value_unit")
    @classmethod
    def validate_property_value_unit(cls, value):
        if value is not None and value not in {"uf", "clp"}:
            raise ValueError("Unidad de monto de vivienda inválida")
        return value

    @field_validator("consentimiento")
    @classmethod
    def validate_consent(cls, value):
        if not value:
            raise ValueError("El consentimiento es obligatorio")
        return value

    @field_validator("ingreso_mensual_complementario", "deuda_mensual_complementario")
    @classmethod
    def validate_complement_non_negative(cls, value):
        if value is not None and value < 0:
            raise ValueError("Los valores del co-deudor no pueden ser negativos")
        return value

    @field_validator("morosidad_complementario")
    @classmethod
    def validate_complement_delinquency(cls, value):
        if value is not None:
            allowed = {"si", "no"}
            if value not in allowed:
                raise ValueError("Morosidad del co-deudor inválida")
        return value

    @field_validator("tipo_contrato_complementario")
    @classmethod
    def validate_complement_contract(cls, value):
        if value is not None:
            allowed = {"indefinido", "plazo_fijo", "independiente", "honorarios_variable"}
            if value not in allowed:
                raise ValueError("Tipo de contrato del co-deudor inválido")
        return value

    @field_validator("continuidad_laboral_complementario")
    @classmethod
    def validate_complement_continuity(cls, value):
        if value is not None:
            allowed = {"menos_6_meses", "entre_6_y_12_meses", "entre_1_y_3_anios", "mas_3_anios"}
            if value not in allowed:
                raise ValueError("Continuidad laboral del co-deudor inválida")
        return value

    @field_validator("relacion_complementario")
    @classmethod
    def validate_complement_relation(cls, value):
        if value is not None:
            allowed = {
                "conyuge", "pareja_conviviente", "pareja_hijos_comun", "padre_madre",
                "hijo_hija", "hermano_hermana", "otro_familiar", "amigo", "otro",
            }
            if value not in allowed:
                raise ValueError("Relacion del complemento de renta inválida")
        return value

    @model_validator(mode="after")
    def validate_conditional_fields(self):
        if self.morosidad_actual == "si":
            if self.monto_morosidad is None or self.monto_morosidad <= 0:
                raise ValueError("Debe indicar el monto de morosidad")
            if not self.antiguedad_morosidad:
                raise ValueError("Debe indicar la antiguedad de morosidad")
        return self


@app.post("/score")
async def score_endpoint(payload: ScoreRequest):
    result = calculate_score(payload.model_dump())
    return result
