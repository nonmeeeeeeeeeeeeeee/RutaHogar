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
    complemento_ingreso_mensual: Optional[float] = None
    complemento_deuda_mensual: Optional[float] = None
    complemento_morosidad: Optional[str] = None
    complemento_tipo_contrato: Optional[str] = None
    complemento_continuidad_laboral: Optional[str] = None
    complemento_tarjetas_activas: Optional[int] = None
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

    @field_validator("complemento_ingreso_mensual", "complemento_deuda_mensual")
    @classmethod
    def validate_complement_non_negative(cls, value):
        if value is not None and value < 0:
            raise ValueError("Los valores del co-deudor no pueden ser negativos")
        return value

    @field_validator("complemento_tarjetas_activas")
    @classmethod
    def validate_complement_cards(cls, value):
        if value is not None and value < 0:
            raise ValueError("Las tarjetas activas no pueden ser negativas")
        return value

    @field_validator("complemento_morosidad")
    @classmethod
    def validate_complement_delinquency(cls, value):
        if value is not None:
            allowed = {"si", "no", "no_lo_se"}
            if value not in allowed:
                raise ValueError("Morosidad del co-deudor invalida")
        return value

    @field_validator("complemento_tipo_contrato")
    @classmethod
    def validate_complement_contract(cls, value):
        if value is not None:
            allowed = {"indefinido", "plazo_fijo", "independiente"}
            if value not in allowed:
                raise ValueError("Tipo de contrato del co-deudor invalido")
        return value

    @field_validator("complemento_continuidad_laboral")
    @classmethod
    def validate_complement_continuity(cls, value):
        if value is not None:
            allowed = {"menos_6_meses", "entre_6_y_12_meses", "entre_1_y_3_anios", "mas_3_anios"}
            if value not in allowed:
                raise ValueError("Continuidad laboral del co-deudor invalida")
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
            if self.complemento_ingreso_mensual is None:
                raise ValueError("Debe indicar el ingreso mensual del co-deudor")
            if self.complemento_deuda_mensual is None:
                raise ValueError("Debe indicar la deuda mensual del co-deudor")
            if not self.complemento_morosidad:
                raise ValueError("Debe indicar la morosidad del co-deudor")
            if not self.complemento_tipo_contrato:
                raise ValueError("Debe indicar el tipo de contrato del co-deudor")
            if not self.complemento_continuidad_laboral:
                raise ValueError("Debe indicar la continuidad laboral del co-deudor")
            if self.complemento_tarjetas_activas is None:
                raise ValueError("Debe indicar las tarjetas de credito activas del co-deudor")
        return self


@app.post("/score")
def score_endpoint(payload: ScoreRequest):
    result = calculate_score(payload.model_dump())
    return result
