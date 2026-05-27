from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel, field_validator, model_validator
from fastapi.middleware.cors import CORSMiddleware
from .scoring import calculate_score

app = FastAPI(title="ScoreLeads MVP")

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
    ahorro_disponible: float
    tipo_contrato: str  # 'indefinido', 'plazo_fijo', 'independiente'
    continuidad_laboral: str
    morosidad_actual: str
    comuna_objetivo: Optional[str] = None
    dividendo_estimado: float
    complemento_renta: bool = False
    complemento_nombre: Optional[str] = None
    complemento_monto: Optional[float] = None
    complemento_relacion: Optional[str] = None
    consentimiento: bool

    @field_validator("ingreso_mensual", "deuda_mensual", "ahorro_disponible", "dividendo_estimado")
    @classmethod
    def validate_non_negative(cls, value):
        if value < 0:
            raise ValueError("El valor no puede ser negativo")
        return value

    @field_validator("tipo_contrato")
    @classmethod
    def validate_contract_type(cls, value):
        allowed = {"indefinido", "plazo_fijo", "independiente"}
        if value not in allowed:
            raise ValueError("Tipo de contrato invalido")
        return value

    @field_validator("continuidad_laboral")
    @classmethod
    def validate_work_continuity(cls, value):
        allowed = {"menos_6_meses", "entre_6_y_12_meses", "entre_1_y_3_anios", "mas_3_anios"}
        if value not in allowed:
            raise ValueError("Continuidad laboral invalida")
        return value

    @field_validator("morosidad_actual")
    @classmethod
    def validate_current_delinquency(cls, value):
        allowed = {"si", "no", "no_lo_se"}
        if value not in allowed:
            raise ValueError("Morosidad actual invalida")
        return value

    @field_validator("consentimiento")
    @classmethod
    def validate_consent(cls, value):
        if not value:
            raise ValueError("El consentimiento es obligatorio")
        return value

    @field_validator("complemento_monto")
    @classmethod
    def validate_complement_amount(cls, value):
        if value is not None and value < 0:
            raise ValueError("El complemento de renta no puede ser negativo")
        return value

    @model_validator(mode="after")
    def validate_complement_details(self):
        if self.complemento_renta:
            if not self.complemento_nombre:
                raise ValueError("Debe indicar el nombre del complemento de renta")
            if self.complemento_monto is None:
                raise ValueError("Debe indicar el monto del complemento de renta")
            if not self.complemento_relacion:
                raise ValueError("Debe indicar la relacion del complemento de renta")
        return self


@app.post("/score")
def score_endpoint(payload: ScoreRequest):
    result = calculate_score(payload.model_dump())
    return result
