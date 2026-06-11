import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { calculateAge } from "../utils/helpers";
import FieldTooltip from "./FieldTooltip";
import DataConsent from "./DataConsent";

const FALLBACK_UF_VALUE_CLP = 40695;
const mortgageTerms = [10, 15, 20, 25, 30];
const buyerObjectives = new Set([
  "comprar_ahora",
  "prepararme",
  "evaluar_capacidad",
]);
const weakComplementRelations = new Set(["amigo", "otro"]);

// Campos enteros (solo dígitos, sin decimales)
const integerFormattedFields = new Set([
  "ingreso_mensual",
  "deuda_mensual",
  "ahorro_disponible",
  "dividendo_estimado",
  "monto_morosidad",
  "ingreso_mensual_complementario",
  "deuda_mensual_complementario",
  "valor_vehiculos",
  "valor_inmuebles",
  "property_value",
]);

function roundCurrency(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function buildPropertyValues(value, unit, ufValueClp) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return {
      property_value: undefined,
      property_value_unit: unit,
      property_value_uf: undefined,
      property_value_clp: undefined,
    };
  }

  const valueUf = unit === "uf" ? numericValue : numericValue / ufValueClp;
  const valueClp = unit === "clp" ? numericValue : numericValue * ufValueClp;

  return {
    property_value: numericValue,
    property_value_unit: unit,
    property_value_uf: roundCurrency(valueUf),
    property_value_clp: Math.round(valueClp),
  };
}

// Formatea un string de dígitos a formato es-CL (puntos de miles)
function formatInteger(raw) {
  if (raw === "" || raw == null) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (digits === "") return "";
  return Number(digits).toLocaleString("es-CL");
}

// Quita los puntos de miles para obtener el valor numérico raw
function stripFormat(value) {
  return String(value)
    .replace(/\./g, "")
    .replace(/[^0-9]/g, "");
}

export default function ScoreForm({
  targetCommune,
  objective,
  birthDate,
  profile,
  consentGranted,
  onResult,
  onConsentAccept,
  onViewConsent,
}) {
  const debtIncomeMessage =
    "El monto de deuda mensual no puede ser mayor a tus ingresos declarados. Revisa este valor antes de continuar.";
  const declaredAge = useMemo(() => calculateAge(birthDate), [birthDate]);
  const asksPropertyValue = buyerObjectives.has(objective);

  const [form, setForm] = useState({
    ingreso_mensual: "",
    deuda_mensual: "",
    ahorro_disponible: "",
    property_value: "",
    property_value_unit: "uf",
    plazo_credito_hipotecario: "",
    tipo_contrato: "",
    continuidad_laboral: "",
    morosidad_actual: "",
    monto_morosidad: "",
    antiguedad_morosidad: "",
    dividendo_estimado: "",
    complemento_renta: false,
    ingreso_mensual_complementario: "",
    deuda_mensual_complementario: "",
    tipo_contrato_complementario: "",
    continuidad_laboral_complementario: "",
    morosidad_complementario: "",
    relacion_complementario: "",
    consentimiento: false,
    declara_patrimonio: false,
    valor_vehiculos: "",
    valor_inmuebles: "",
    patrimonio_unit: "clp",
  });

  // Estado paralelo solo para mostrar los valores formateados en pantalla
  const [displayValues, setDisplayValues] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ufValueClp, setUfValueClp] = useState(FALLBACK_UF_VALUE_CLP);
  const [ufStatus, setUfStatus] = useState("fallback");
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState(null);

  const consentDate = consentTimestamp
    ? new Date(consentTimestamp).toLocaleDateString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const debtExceedsIncome =
    form.ingreso_mensual !== "" &&
    form.deuda_mensual !== "" &&
    Number(form.deuda_mensual) > Number(form.ingreso_mensual);

  const mortgageTerm = Number(form.plazo_credito_hipotecario);
  const showMortgageAgeWarning =
    Number.isFinite(declaredAge) &&
    Number.isFinite(mortgageTerm) &&
    mortgageTerm > 0 &&
    declaredAge + mortgageTerm > 70;

  const showComplementRelationWarning = weakComplementRelations.has(
    form.relacion_complementario,
  );
  const showComplementMorosityWarning = form.morosidad_complementario === "si";

  const ufHelpText =
    ufStatus === "loading"
      ? `Consultando valor UF referencial. Respaldo interno: $${ufValueClp.toLocaleString("es-CL")}.`
      : ufStatus === "live"
        ? `Valor UF referencial actualizado: $${ufValueClp.toLocaleString("es-CL")}.`
        : `Valor UF referencial: $${ufValueClp.toLocaleString("es-CL")} (respaldo interno).`;

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2500);

    async function loadUfValue() {
      try {
        setUfStatus("loading");
        const response = await fetch("https://mindicador.cl/api/uf", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("No se pudo obtener la UF.");
        const data = await response.json();
        const latestUf = Number(data?.serie?.[0]?.valor);
        if (!Number.isFinite(latestUf) || latestUf <= 0)
          throw new Error("UF invalida.");
        setUfValueClp(Math.round(latestUf));
        setUfStatus("live");
      } catch {
        setUfValueClp(FALLBACK_UF_VALUE_CLP);
        setUfStatus("fallback");
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    loadUfValue();
    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    setForm((prev) => ({ ...prev, consentimiento: consentGranted }));
    if (consentGranted && !consentTimestamp) {
      setConsentTimestamp(new Date().toISOString());
    } else if (!consentGranted) {
      setConsentTimestamp(null);
    }
  }, [consentGranted]);

  useEffect(() => {
    if (consentModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Limpieza al desmontar
    return () => {
      document.body.style.overflow = "";
    };
  }, [consentModalOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Campos de montos enteros: autoformatear con puntos de miles
    if (integerFormattedFields.has(name)) {
      const raw = stripFormat(value); // "1200000"
      const formatted = formatInteger(raw); // "1.200.000"
      setDisplayValues((prev) => ({ ...prev, [name]: formatted }));
      setForm((prev) => {
        const next = { ...prev, [name]: raw };
        if (name === "morosidad_actual" && value !== "si") {
          next.monto_morosidad = "";
          next.antiguedad_morosidad = "";
        }
        return next;
      });
      return;
    }

    // Resto de campos: lógica original
    setForm((prev) => {
      const next = {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
              ? value === ""
                ? ""
                : value
              : value,
      };

      if (name === "morosidad_actual" && value !== "si") {
        next.monto_morosidad = "";
        next.antiguedad_morosidad = "";
      }

      return next;
    });
  };

  // Helper para obtener el valor de display de un campo formateado
  const displayVal = (name) => {
    if (name in displayValues) return displayValues[name];
    const raw = form[name];
    if (raw === "" || raw == null) return "";
    if (integerFormattedFields.has(name)) return formatInteger(raw);
    return raw;
  };

  const switchPropertyUnit = () => {
    setForm((prev) => {
      const nextUnit = prev.property_value_unit === "uf" ? "clp" : "uf";
      const currentValue = Number(prev.property_value);
      if (!Number.isFinite(currentValue) || currentValue <= 0) {
        return { ...prev, property_value_unit: nextUnit };
      }
      const convertedValue =
        nextUnit === "clp"
          ? Math.round(currentValue * ufValueClp)
          : Math.round(currentValue / ufValueClp);
      const convertedRaw = String(convertedValue);
      setDisplayValues((d) => ({
        ...d,
        property_value: formatInteger(convertedRaw),
      }));
      return {
        ...prev,
        property_value_unit: nextUnit,
        property_value: convertedRaw,
      };
    });
  };

  const switchPatrimonioUnit = () => {
    setForm((prev) => {
      const nextUnit = prev.patrimonio_unit === "uf" ? "clp" : "uf";
      const nextForm = { ...prev, patrimonio_unit: nextUnit };
      const nextDisplay = { ...displayValues };

      if (prev.valor_vehiculos !== "") {
        const val = Number(prev.valor_vehiculos);
        const converted =
          nextUnit === "clp"
            ? String(Math.round(val * ufValueClp))
            : String(roundCurrency(val / ufValueClp));
        nextForm.valor_vehiculos = converted;
        nextDisplay.valor_vehiculos = formatInteger(converted);
      }
      if (prev.valor_inmuebles !== "") {
        const val = Number(prev.valor_inmuebles);
        const converted =
          nextUnit === "clp"
            ? String(Math.round(val * ufValueClp))
            : String(roundCurrency(val / ufValueClp));
        nextForm.valor_inmuebles = converted;
        nextDisplay.valor_inmuebles = formatInteger(converted);
      }

      setDisplayValues(nextDisplay);
      return nextForm;
    });
  };

  const validate = () => {
    const missing = [];
    if (form.ingreso_mensual === "") missing.push("Ingreso mensual");
    if (form.deuda_mensual === "") missing.push("Deuda mensual");
    if (!Number.isFinite(declaredAge))
      missing.push("Fecha de nacimiento del perfil");
    if (form.ahorro_disponible === "") missing.push("Ahorro disponible");
    if (asksPropertyValue && form.property_value === "")
      missing.push("Monto estimado de vivienda");
    if (!form.plazo_credito_hipotecario)
      missing.push("Plazo estimado del crédito hipotecario");
    if (!form.tipo_contrato) missing.push("Tipo de contrato");
    if (!form.continuidad_laboral) missing.push("Continuidad laboral");
    if (!form.morosidad_actual) missing.push("Situacion de morosidad");
    if (form.morosidad_actual === "si") {
      if (form.monto_morosidad === "") missing.push("Monto de morosidad");
      if (!form.antiguedad_morosidad) missing.push("Antiguedad de morosidad");
    }
    if (!targetCommune) missing.push("Comuna objetivo preliminar");
    if (form.dividendo_estimado === "") missing.push("Dividendo estimado");
    if (missing.length) {
      setError(`Complete todos los campos: ${missing.join(", ")}`);
      return false;
    }

    const numericRules = [
      [
        "Ingreso mensual",
        form.ingreso_mensual,
        (value) => value > 0,
        "debe ser mayor que 0.",
      ],
      [
        "Deuda mensual",
        form.deuda_mensual,
        (value) => value >= 0,
        "debe ser mayor o igual a 0.",
      ],
      [
        "Edad declarada",
        declaredAge,
        (value) => value >= 18 && value <= 100,
        "debe estar entre 18 y 100.",
      ],
      [
        "Ahorro disponible",
        form.ahorro_disponible,
        (value) => value >= 0,
        "no puede ser negativo.",
      ],
      [
        "Dividendo estimado",
        form.dividendo_estimado,
        (value) => value >= 0,
        "no puede ser negativo.",
      ],
      [
        "Plazo estimado del crédito hipotecario",
        form.plazo_credito_hipotecario,
        (value) => mortgageTerms.includes(value),
        "es invalido.",
      ],
    ];

    if (asksPropertyValue) {
      numericRules.push([
        "Monto estimado de vivienda",
        form.property_value,
        (value) => value > 0,
        "debe ser mayor que 0.",
      ]);
    }

    if (form.morosidad_actual === "si") {
      numericRules.push([
        "Monto de morosidad",
        form.monto_morosidad,
        (value) => value > 0,
        "debe ser mayor que 0.",
      ]);
    }

    if (form.complemento_renta) {
      [
        ["Ingreso mensual complementario", form.ingreso_mensual_complementario],
        ["Deuda mensual complementaria", form.deuda_mensual_complementario],
      ].forEach(([label, value]) => {
        if (value !== "") {
          numericRules.push([
            label,
            value,
            (parsed) => parsed >= 0,
            "no puede ser negativo.",
          ]);
        }
      });
    }

    if (form.declara_patrimonio) {
      [
        ["Valor de vehiculos", form.valor_vehiculos],
        ["Valor de inmuebles", form.valor_inmuebles],
      ].forEach(([label, value]) => {
        if (value !== "") {
          numericRules.push([
            label,
            value,
            (parsed) => parsed >= 0,
            "no puede ser negativo.",
          ]);
        }
      });
    }

    const invalidNumber = numericRules.find(([, value, isValid]) => {
      const parsedValue = Number(value);
      return !Number.isFinite(parsedValue) || !isValid(parsedValue);
    });
    if (invalidNumber) {
      setError(`${invalidNumber[0]} ${invalidNumber[3]}`);
      return false;
    }

    if (debtExceedsIncome) {
      setError(debtIncomeMessage);
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const propertyValues = asksPropertyValue
        ? buildPropertyValues(
            form.property_value,
            form.property_value_unit,
            ufValueClp,
          )
        : buildPropertyValues("", form.property_value_unit, ufValueClp);

      const payload = {
        ingreso_mensual: parseFloat(form.ingreso_mensual),
        deuda_mensual: parseFloat(form.deuda_mensual),
        edad: declaredAge,
        ahorro_disponible: parseFloat(form.ahorro_disponible),
        ...propertyValues,
        plazo_credito_hipotecario: parseInt(form.plazo_credito_hipotecario, 10),
        tipo_contrato: form.tipo_contrato,
        continuidad_laboral: form.continuidad_laboral,
        morosidad_actual: form.morosidad_actual,
        monto_morosidad:
          form.morosidad_actual === "si"
            ? parseFloat(form.monto_morosidad)
            : undefined,
        antiguedad_morosidad:
          form.morosidad_actual === "si"
            ? form.antiguedad_morosidad
            : undefined,
        comuna_objetivo: targetCommune,
        dividendo_estimado: parseFloat(form.dividendo_estimado),
        complemento_renta: form.complemento_renta,
        ingreso_mensual_complementario:
          form.complemento_renta && form.ingreso_mensual_complementario !== ""
            ? parseFloat(form.ingreso_mensual_complementario)
            : undefined,
        deuda_mensual_complementario:
          form.complemento_renta && form.deuda_mensual_complementario !== ""
            ? parseFloat(form.deuda_mensual_complementario)
            : undefined,
        tipo_contrato_complementario:
          form.tipo_contrato_complementario || undefined,
        continuidad_laboral_complementario:
          form.continuidad_laboral_complementario || undefined,
        morosidad_complementario: form.morosidad_complementario || undefined,
        relacion_complementario: form.relacion_complementario || undefined,
        consentimiento: form.consentimiento,
        declara_patrimonio: form.declara_patrimonio,
        valor_vehiculos:
          form.declara_patrimonio && form.valor_vehiculos !== ""
            ? parseFloat(form.valor_vehiculos)
            : 0,
        valor_inmuebles:
          form.declara_patrimonio && form.valor_inmuebles !== ""
            ? parseFloat(form.valor_inmuebles)
            : 0,
        patrimonio_unit: form.patrimonio_unit,
        uf_value_clp: ufValueClp,
      };

      const apiBase =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV ? "http://127.0.0.1:8000" : "");
      const res = await axios.post(`${apiBase}/score`, payload, {
        timeout: 60000,
      });

      onResult(res.data, payload);
    } catch (err) {
      console.error(err);
      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        setError("La petición tardó demasiado, por favor intenta nuevamente.");
      } else {
        setError(
          "Hubo un problema con la petición, por favor intenta nuevamente.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="score-form">
      {/* ── Datos financieros ── */}
      <div className="form-section">
        <div>
          <span className="eyebrow">Datos financieros</span>
          <p>
            Usa montos aproximados. No pedimos claves, documentos ni información
            bancaria privada.
          </p>
        </div>
        <div className="form-grid">
          {/* Ingreso mensual */}
          <div className="field-wrap">
            <div className="field-label-row">
              <label htmlFor="ingreso_mensual">Ingreso mensual</label>
              <FieldTooltip text="Sueldo líquido o renta variable promedio de los últimos 6 meses." />
            </div>
            <input
              type="text"
              inputMode="numeric"
              id="ingreso_mensual"
              name="ingreso_mensual"
              value={displayVal("ingreso_mensual")}
              onChange={handleChange}
              placeholder="Ej: 1.200.000"
            />
          </div>

          {/* Deuda mensual */}
          <div className="field-wrap">
            <div className="field-label-row">
              <label htmlFor="deuda_mensual">Deuda mensual</label>
              <FieldTooltip text="Considera el total de tus compromisos financieros mensuales vigentes: créditos de consumo, automotrices e hipotecarios, cuota mínima de tarjetas de crédito, avances o superavances, créditos estudiantiles, préstamos de cooperativas, cajas de compensación, casas comerciales y pensiones alimenticias. No considera gastos comunes, servicios básicos, alimentación ni otros gastos cotidianos." />
            </div>
            <input
              type="text"
              inputMode="numeric"
              id="deuda_mensual"
              name="deuda_mensual"
              value={displayVal("deuda_mensual")}
              onChange={handleChange}
              placeholder="Ej: 150.000"
              aria-invalid={debtExceedsIncome}
            />
            {debtExceedsIncome && (
              <span id="debt-income-warning" className="field-warning">
                {debtIncomeMessage}
              </span>
            )}
          </div>

          {/* Ahorro disponible */}
          <div className="field-wrap">
            <div className="field-label-row">
              <label htmlFor="ahorro_disponible">Ahorro disponible</label>
              <FieldTooltip text="Dinero disponible para el pago inicial de la vivienda. Incluye todo lo que puedas aportar hoy: APV, Cuenta 2, ahorros propios o subsidio habitacional. Los bancos generalmente exigen entre un 10% y 20% del valor de la propiedad." />
            </div>
            <input
              type="text"
              inputMode="numeric"
              id="ahorro_disponible"
              name="ahorro_disponible"
              value={displayVal("ahorro_disponible")}
              onChange={handleChange}
              placeholder="Ej: 3.000.000"
            />
          </div>

          {/* Monto estimado de la vivienda */}
          {asksPropertyValue && (
            <div className="field-wrap">
              <div className="field-label-row">
                <label htmlFor="property_value">
                  Monto estimado de la vivienda
                </label>
                <FieldTooltip text="Precio de venta aproximado de la propiedad que deseas adquirir." />
              </div>
              <div className="unit-input">
                <input
                  type="text"
                  inputMode="decimal"
                  id="property_value"
                  name="property_value"
                  value={displayVal("property_value")}
                  onChange={handleChange}
                  placeholder={
                    form.property_value_unit === "uf"
                      ? "Ej: 3.500"
                      : "Ej: 136.500.000"
                  }
                />
                <button
                  type="button"
                  className="secondary-button unit-toggle"
                  onClick={switchPropertyUnit}
                >
                  {form.property_value_unit === "uf" ? "UF" : "CLP"}
                </button>
              </div>
              <span className="field-help">
                Puedes ingresarlo en UF o CLP. {ufHelpText}
              </span>
            </div>
          )}

          {/* Dividendo estimado */}
          <div className="field-wrap">
            <div className="field-label-row">
              <label htmlFor="dividendo_estimado">Dividendo estimado</label>
              <FieldTooltip text="Cuota mensual estimada que pagarías por el crédito hipotecario." />
            </div>
            <input
              type="text"
              inputMode="numeric"
              id="dividendo_estimado"
              name="dividendo_estimado"
              value={displayVal("dividendo_estimado")}
              onChange={handleChange}
              placeholder="Ej: 250.000"
            />
          </div>

          {/* Plazo estimado */}
          <div
            className={`field-wrap${showMortgageAgeWarning ? " field-with-warning" : ""}`}
          >
            <div className="field-label-row">
              <label htmlFor="plazo_credito_hipotecario">
                Plazo estimado del crédito hipotecario
              </label>
              <FieldTooltip text="Número de años en que planeas pagar el crédito. Los plazos más comunes van de 10 a 30 años." />
            </div>
            <select
              id="plazo_credito_hipotecario"
              name="plazo_credito_hipotecario"
              value={form.plazo_credito_hipotecario}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              {mortgageTerms.map((term) => (
                <option key={term} value={term}>
                  {term} años
                </option>
              ))}
            </select>
            {showMortgageAgeWarning && (
              <span className="field-warning">
                Por tu edad declarada, el plazo hipotecario solicitado podría
                verse limitado por condiciones asociadas al seguro de
                desgravamen. Esto puede aumentar el dividendo mensual estimado.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Trabajo y antecedentes ── */}
      <div className="form-section">
        <div>
          <span className="eyebrow">Trabajo y antecedentes declarados</span>
          <p>
            La morosidad es autodeclarada y sólo se usa como señal orientativa.
            No consultamos CMF, DICOM ni APIs externas.
          </p>
        </div>
        <div className="form-grid">
          {/* Tipo de contrato */}
          <div className="field-wrap">
            <div className="field-label-row">
              <label htmlFor="tipo_contrato">Tipo de contrato</label>
              <FieldTooltip text="Modalidad bajo la cual recibes tus ingresos actualmente." />
            </div>
            <select
              id="tipo_contrato"
              name="tipo_contrato"
              value={form.tipo_contrato}
              onChange={handleChange}
            >
              <option value="">Selecciona un tipo</option>
              <option value="indefinido">Indefinido</option>
              <option value="independiente">Independiente</option>
              <option value="plazo_fijo">Plazo fijo</option>
              <option value="honorarios_variable">Honorarios / variable</option>
            </select>
          </div>

          {/* Continuidad laboral */}
          <div className="field-wrap">
            <div className="field-label-row">
              <label htmlFor="continuidad_laboral">Continuidad laboral</label>
              <FieldTooltip text="Tiempo que llevas trabajando de forma continua en tu empleo o actividad actual." />
            </div>
            <select
              id="continuidad_laboral"
              name="continuidad_laboral"
              value={form.continuidad_laboral}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              <option value="menos_6_meses">Menos de 6 meses</option>
              <option value="entre_6_y_12_meses">Entre 6 y 12 meses</option>
              <option value="entre_1_y_3_anios">Entre 1 y 3 años</option>
              <option value="mas_3_anios">Más de 3 años</option>
            </select>
          </div>

          {/* Morosidad actual */}
          <div className="field-wrap">
            <div className="field-label-row">
              <label htmlFor="morosidad_actual">Morosidad actual</label>
              <FieldTooltip text="Indica si tienes cuotas o pagos vencidos en este momento." />
            </div>
            <select
              id="morosidad_actual"
              name="morosidad_actual"
              value={form.morosidad_actual}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {/* Monto de morosidad (condicional) */}
          {form.morosidad_actual === "si" && (
            <>
              <div className="field-wrap">
                <div className="field-label-row">
                  <label htmlFor="monto_morosidad">Monto de morosidad</label>
                  <FieldTooltip text="Total aproximado de deuda morosa que tienes actualmente." />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  id="monto_morosidad"
                  name="monto_morosidad"
                  value={displayVal("monto_morosidad")}
                  onChange={handleChange}
                  placeholder="Ej: 250.000"
                />
              </div>

              <div className="field-wrap">
                <div className="field-label-row">
                  <label htmlFor="antiguedad_morosidad">
                    Antigüedad de morosidad
                  </label>
                  <FieldTooltip text="Hace cuánto tiempo tienes esta deuda morosa sin regularizar." />
                </div>
                <select
                  id="antiguedad_morosidad"
                  name="antiguedad_morosidad"
                  value={form.antiguedad_morosidad}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="menos_3_meses">Menos de 3 meses</option>
                  <option value="3_a_12_meses">3 a 12 meses</option>
                  <option value="1_a_3_anios">1 a 3 años</option>
                  <option value="mas_3_anios">Más de 3 años</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Complemento de renta ── */}
      <label className="check-row">
        <input
          type="checkbox"
          name="complemento_renta"
          checked={form.complemento_renta}
          onChange={handleChange}
        />
        Complementar renta con una persona
      </label>

      {form.complemento_renta && (
        <div className="nested-fields">
          <h4>Datos del complemento de renta</h4>
          <div className="form-grid">
            {/* Ingreso mensual complementario */}
            <div className="field-wrap">
              <div className="field-label-row">
                <label htmlFor="ingreso_mensual_complementario">
                  Ingreso mensual complementario
                </label>
                <FieldTooltip text="Sueldo líquido o renta promedio de la persona que complementa tu renta." />
              </div>
              <input
                type="text"
                inputMode="numeric"
                id="ingreso_mensual_complementario"
                name="ingreso_mensual_complementario"
                value={displayVal("ingreso_mensual_complementario")}
                onChange={handleChange}
                placeholder="Ej: 800.000"
              />
            </div>

            {/* Deuda mensual complementaria */}
            <div className="field-wrap">
              <div className="field-label-row">
                <label htmlFor="deuda_mensual_complementario">
                  Deuda mensual complementaria
                </label>
                <FieldTooltip text="Total de cuotas mensuales comprometidas de la persona complementaria." />
              </div>
              <input
                type="text"
                inputMode="numeric"
                id="deuda_mensual_complementario"
                name="deuda_mensual_complementario"
                value={displayVal("deuda_mensual_complementario")}
                onChange={handleChange}
                placeholder="Ej: 100.000"
              />
            </div>

            {/* Tipo de contrato complementario */}
            <div className="field-wrap">
              <div className="field-label-row">
                <label htmlFor="tipo_contrato_complementario">
                  Tipo de contrato complementario
                </label>
                <FieldTooltip text="Modalidad contractual de la persona que complementa la renta." />
              </div>
              <select
                id="tipo_contrato_complementario"
                name="tipo_contrato_complementario"
                value={form.tipo_contrato_complementario}
                onChange={handleChange}
              >
                <option value="">Selecciona un tipo</option>
                <option value="indefinido">Indefinido</option>
                <option value="independiente">Independiente</option>
                <option value="plazo_fijo">Plazo fijo</option>
                <option value="honorarios_variable">
                  Honorarios / variable
                </option>
              </select>
            </div>

            {/* Continuidad laboral complementaria */}
            <div className="field-wrap">
              <div className="field-label-row">
                <label htmlFor="continuidad_laboral_complementario">
                  Continuidad laboral complementaria
                </label>
                <FieldTooltip text="Tiempo que lleva trabajando de forma continua la persona complementaria." />
              </div>
              <select
                id="continuidad_laboral_complementario"
                name="continuidad_laboral_complementario"
                value={form.continuidad_laboral_complementario}
                onChange={handleChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="menos_6_meses">Menos de 6 meses</option>
                <option value="entre_6_y_12_meses">Entre 6 y 12 meses</option>
                <option value="entre_1_y_3_anios">Entre 1 y 3 años</option>
                <option value="mas_3_anios">Más de 3 años</option>
              </select>
            </div>

            {/* Morosidad complementaria */}
            <div className="field-wrap">
              <div className="field-label-row">
                <label htmlFor="morosidad_complementario">
                  Morosidad complementaria
                </label>
                <FieldTooltip text="Indica si la persona complementaria tiene cuotas o pagos vencidos." />
              </div>
              <select
                id="morosidad_complementario"
                name="morosidad_complementario"
                value={form.morosidad_complementario}
                onChange={handleChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>

            {/* Relación complementaria */}
            <div
              className={`field-wrap${showComplementRelationWarning ? " field-with-warning" : ""}`}
            >
              <div className="field-label-row">
                <label htmlFor="relacion_complementario">
                  Relación complementaria
                </label>
                <FieldTooltip text="Vínculo que tienes con la persona que complementa tu renta." />
              </div>
              <select
                id="relacion_complementario"
                name="relacion_complementario"
                value={form.relacion_complementario}
                onChange={handleChange}
              >
                <option value="">Selecciona una relación</option>
                <option value="conyuge">Cónyuge</option>
                <option value="pareja_conviviente">Pareja conviviente</option>
                <option value="pareja_hijos_comun">
                  Pareja con hijos en común
                </option>
                <option value="padre_madre">Padre/Madre</option>
                <option value="hijo_hija">Hijo/a</option>
                <option value="hermano_hermana">Hermano/a</option>
                <option value="otro_familiar">Otro familiar</option>
                <option value="amigo">Amigo/a</option>
                <option value="otro">Otro</option>
              </select>
              {showComplementRelationWarning && (
                <span className="field-warning">
                  Esta relación puede requerir mayor respaldo en una evaluación
                  hipotecaria formal.
                </span>
              )}
            </div>
          </div>

          {showComplementMorosityWarning && (
            <div className="warning-box">
              Si la persona complementaria declara morosidad, no se considerará
              válida para mejorar el score orientativo.
            </div>
          )}
        </div>
      )}

      {/* ── Patrimonio ── */}
      <label className="check-row">
        <input
          type="checkbox"
          name="declara_patrimonio"
          checked={form.declara_patrimonio}
          onChange={handleChange}
        />
        Declarar patrimonio (Vehículos, Inmuebles, etc.)
      </label>

      {form.declara_patrimonio && (
        <div className="nested-fields">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h4 style={{ margin: 0 }}>Activos y Patrimonio</h4>
            <div className="unit-toggle-group">
              <button
                type="button"
                className={`secondary-button compact-button ${form.patrimonio_unit === "clp" ? "is-active" : ""}`}
                onClick={() =>
                  form.patrimonio_unit !== "clp" && switchPatrimonioUnit()
                }
              >
                CLP
              </button>
              <button
                type="button"
                className={`secondary-button compact-button ${form.patrimonio_unit === "uf" ? "is-active" : ""}`}
                onClick={() =>
                  form.patrimonio_unit !== "uf" && switchPatrimonioUnit()
                }
              >
                UF
              </button>
            </div>
          </div>
          <div className="form-grid">
            {/* Valor vehículos */}
            <div className="field-wrap">
              <div className="field-label-row">
                <label htmlFor="valor_vehiculos">
                  Valor total de vehículos
                </label>
                <FieldTooltip text="Valor comercial estimado de todos los vehículos de tu propiedad." />
              </div>
              <input
                type="text"
                inputMode="decimal"
                id="valor_vehiculos"
                name="valor_vehiculos"
                value={displayVal("valor_vehiculos")}
                onChange={handleChange}
                placeholder={
                  form.patrimonio_unit === "uf" ? "Ej: 400" : "Ej: 15.000.000"
                }
              />
            </div>

            {/* Valor inmuebles */}
            <div className="field-wrap">
              <div className="field-label-row">
                <label htmlFor="valor_inmuebles">
                  Valor total de inmuebles / otros
                </label>
                <FieldTooltip text="Valor comercial estimado de propiedades u otros activos que poseas." />
              </div>
              <input
                type="text"
                inputMode="decimal"
                id="valor_inmuebles"
                name="valor_inmuebles"
                value={displayVal("valor_inmuebles")}
                onChange={handleChange}
                placeholder={
                  form.patrimonio_unit === "uf"
                    ? "Ej: 2.500"
                    : "Ej: 100.000.000"
                }
              />
            </div>
          </div>
          <p className="field-help">
            Declara el valor comercial estimado de tus activos. Esto fortalece
            tu perfil de cara a una evaluación hipotecaria.
          </p>
        </div>
      )}

      {/* ── Consentimiento ── */}
      {consentGranted ? (
        <div className="consent-info">
          <span className="consent-info-icon">✓ </span>
          <span>
            Autorización de tratamiento de datos personales otorgada el{" "}
            <strong>{consentDate}</strong>.
            <button
              type="button"
              className="consent-ref-link"
              onClick={() => setConsentModalOpen(true)}
            >
              Ver detalle
            </button>
          </span>
        </div>
      ) : (
        <div className="consent-required">
          <p>
            Debes aceptar la autorización de tratamiento de datos personales
            antes de calcular tu score.
          </p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setConsentModalOpen(true)}
          >
            Aceptar autorización
          </button>
        </div>
      )}

      <div className="form-actions">
        <button
          type="submit"
          disabled={loading || debtExceedsIncome || !consentGranted}
        >
          Calcular score
        </button>
        {loading && <span>Calculando...</span>}
      </div>

      {error && <div className="error-message">{error}</div>}

      {consentModalOpen && (
        <div
          className="consent-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setConsentModalOpen(false)}
        >
          <div
            className="consent-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <DataConsent
              profile={profile}
              readonly={consentGranted}
              onAccept={(consentData) => {
                setConsentTimestamp(consentData.timestamp);
                setConsentModalOpen(false);
                onConsentAccept?.(consentData);
              }}
              onBack={() => setConsentModalOpen(false)}
            />
          </div>
        </div>
      )}
    </form>
  );
}
