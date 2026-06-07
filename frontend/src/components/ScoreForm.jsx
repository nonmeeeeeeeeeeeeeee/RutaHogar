import React, { useMemo, useState } from "react";
import axios from "axios";
import { getLocalConsent } from "../services/profileService";

const UF_VALUE_CLP = 40695;
const mortgageTerms = [10, 15, 20, 25, 30];
const buyerObjectives = new Set(["comprar_ahora", "prepararme", "evaluar_capacidad"]);
const weakComplementRelations = new Set(["amigo", "otro"]);

const consent = getLocalConsent();
const consentDate = consent?.timestamp
  ? new Date(consent.timestamp).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  : null;

function calculateAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasBirthdayPassed) age -= 1;
  return age;
}

function roundCurrency(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function buildPropertyValues(value, unit) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return {
      property_value: undefined,
      property_value_unit: unit,
      property_value_uf: undefined,
      property_value_clp: undefined,
    };
  }

  const valueUf = unit === "uf" ? numericValue : numericValue / UF_VALUE_CLP;
  const valueClp = unit === "clp" ? numericValue : numericValue * UF_VALUE_CLP;

  return {
    property_value: numericValue,
    property_value_unit: unit,
    property_value_uf: roundCurrency(valueUf),
    property_value_clp: Math.round(valueClp),
  };
}

export default function ScoreForm({ targetCommune, objective, birthDate, onResult, onViewConsent }) {
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
    consentimiento: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
  const showComplementRelationWarning = weakComplementRelations.has(form.relacion_complementario);
  const showComplementMorosityWarning = form.morosidad_complementario === "si";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? (value === "" ? "" : value) : value,
      };

      if (name === "morosidad_actual" && value !== "si") {
        next.monto_morosidad = "";
        next.antiguedad_morosidad = "";
      }

      return next;
    });
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
          ? Math.round(currentValue * UF_VALUE_CLP)
          : roundCurrency(currentValue / UF_VALUE_CLP);
      return { ...prev, property_value_unit: nextUnit, property_value: String(convertedValue) };
    });
  };

  const validate = () => {
    const missing = [];
    if (form.ingreso_mensual === "") missing.push("Ingreso mensual");
    if (form.deuda_mensual === "") missing.push("Deuda mensual");
    if (!Number.isFinite(declaredAge)) missing.push("Fecha de nacimiento del perfil");
    if (form.ahorro_disponible === "") missing.push("Ahorro disponible");
    if (asksPropertyValue && form.property_value === "") missing.push("Monto estimado de vivienda");
    if (!form.plazo_credito_hipotecario) missing.push("Plazo estimado del credito hipotecario");
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
      ["Ingreso mensual", form.ingreso_mensual, (value) => value > 0, "debe ser mayor que 0."],
      ["Deuda mensual", form.deuda_mensual, (value) => value >= 0, "debe ser mayor o igual a 0."],
      ["Edad declarada", declaredAge, (value) => value >= 18 && value <= 100, "debe estar entre 18 y 100."],
      ["Ahorro disponible", form.ahorro_disponible, (value) => value >= 0, "no puede ser negativo."],
      ["Dividendo estimado", form.dividendo_estimado, (value) => value >= 0, "no puede ser negativo."],
      ["Plazo estimado del credito hipotecario", form.plazo_credito_hipotecario, (value) => mortgageTerms.includes(value), "es invalido."],
    ];

    if (asksPropertyValue) {
      numericRules.push(["Monto estimado de vivienda", form.property_value, (value) => value > 0, "debe ser mayor que 0."]);
    }

    if (form.morosidad_actual === "si") {
      numericRules.push(["Monto de morosidad", form.monto_morosidad, (value) => value > 0, "debe ser mayor que 0."]);
    }

    if (form.complemento_renta) {
      [
        ["Ingreso mensual complementario", form.ingreso_mensual_complementario],
        ["Deuda mensual complementaria", form.deuda_mensual_complementario],
      ].forEach(([label, value]) => {
        if (value !== "") {
          numericRules.push([label, value, (parsed) => parsed >= 0, "no puede ser negativo."]);
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
        ? buildPropertyValues(form.property_value, form.property_value_unit)
        : buildPropertyValues("", form.property_value_unit);
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
        monto_morosidad: form.morosidad_actual === "si" ? parseFloat(form.monto_morosidad) : undefined,
        antiguedad_morosidad: form.morosidad_actual === "si" ? form.antiguedad_morosidad : undefined,
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
        tipo_contrato_complementario: form.tipo_contrato_complementario || undefined,
        continuidad_laboral_complementario: form.continuidad_laboral_complementario || undefined,
        morosidad_complementario: form.morosidad_complementario || undefined,
        relacion_complementario: form.relacion_complementario || undefined,
        consentimiento: form.consentimiento,
      };

      const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://127.0.0.1:8000" : "");
      const res = await axios.post(`${apiBase}/score`, payload, { timeout: 60000 });

      onResult(res.data, payload);
    } catch (err) {
      console.error(err);
      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        setError("La peticion tardo demasiado, por favor intenta nuevamente.");
      } else {
        setError("Hubo un problema con la peticion, por favor intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="score-form">
      <div className="form-section">
        <div>
          <span className="eyebrow">Datos financieros</span>
          <p>Usa montos aproximados. No pedimos claves, documentos ni informacion bancaria privada.</p>
        </div>
        <div className="form-grid">
          <label>
            Ingreso mensual
            <input
              type="number"
              inputMode="numeric"
              min="1"
              name="ingreso_mensual"
              value={form.ingreso_mensual}
              onChange={handleChange}
              placeholder="Ej: 1200000"
            />
          </label>

          <label className={debtExceedsIncome ? "field-with-warning" : undefined}>
            Deuda mensual
            <input
              type="number"
              inputMode="numeric"
              min="0"
              name="deuda_mensual"
              value={form.deuda_mensual}
              onChange={handleChange}
              placeholder="Ej: 150000"
              aria-invalid={debtExceedsIncome}
              aria-describedby={debtExceedsIncome ? "debt-income-warning" : undefined}
            />
            {debtExceedsIncome && (
              <span id="debt-income-warning" className="field-warning">
                {debtIncomeMessage}
              </span>
            )}
          </label>

          <label>
            Ahorro disponible
            <input
              type="number"
              inputMode="numeric"
              min="0"
              name="ahorro_disponible"
              value={form.ahorro_disponible}
              onChange={handleChange}
              placeholder="Ej: 3000000"
            />
          </label>

          {asksPropertyValue && (
            <label>
              Monto estimado de la vivienda
              <div className="unit-input">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  name="property_value"
                  value={form.property_value}
                  onChange={handleChange}
                  placeholder={form.property_value_unit === "uf" ? "Ej: 3500" : "Ej: 136500000"}
                />
                <button type="button" className="secondary-button unit-toggle" onClick={switchPropertyUnit}>
                  {form.property_value_unit === "uf" ? "UF" : "Pesos"}
                </button>
              </div>
              <span className="field-help">
                Puedes ingresarlo en UF o pesos. Para este MVP se usa UF referencial de ${UF_VALUE_CLP.toLocaleString("es-CL")}.
              </span>
            </label>
          )}

          <label>
            Dividendo estimado
            <input
              type="number"
              inputMode="numeric"
              min="0"
              name="dividendo_estimado"
              value={form.dividendo_estimado}
              onChange={handleChange}
              placeholder="Ej: 250000"
            />
          </label>

          <label className={showMortgageAgeWarning ? "field-with-warning" : undefined}>
            Plazo estimado del credito hipotecario
            <select name="plazo_credito_hipotecario" value={form.plazo_credito_hipotecario} onChange={handleChange}>
              <option value="">Selecciona una opcion</option>
              {mortgageTerms.map((term) => (
                <option key={term} value={term}>{term} anos</option>
              ))}
            </select>
            {showMortgageAgeWarning && (
              <span className="field-warning">
                Por tu edad declarada, el plazo hipotecario solicitado podria verse limitado por condiciones asociadas al seguro de desgravamen. Esto puede aumentar el dividendo mensual estimado.
              </span>
            )}
          </label>
        </div>
      </div>

      <div className="form-section">
        <div>
          <span className="eyebrow">Trabajo y antecedentes declarados</span>
          <p>La morosidad es autodeclarada y solo se usa como senal orientativa. No consultamos CMF, DICOM ni APIs externas.</p>
        </div>
        <div className="form-grid">
          <label>
            Tipo de contrato
            <select name="tipo_contrato" value={form.tipo_contrato} onChange={handleChange}>
              <option value="">Selecciona un tipo</option>
              <option value="indefinido">Indefinido</option>
              <option value="independiente">Independiente</option>
              <option value="plazo_fijo">Plazo fijo</option>
              <option value="honorarios_variable">Honorarios / variable</option>
            </select>
          </label>

          <label>
            Continuidad laboral
            <select name="continuidad_laboral" value={form.continuidad_laboral} onChange={handleChange}>
              <option value="">Selecciona una opcion</option>
              <option value="menos_6_meses">Menos de 6 meses</option>
              <option value="entre_6_y_12_meses">Entre 6 y 12 meses</option>
              <option value="entre_1_y_3_anios">Entre 1 y 3 anos</option>
              <option value="mas_3_anios">Mas de 3 anos</option>
            </select>
          </label>

          <label>
            Morosidad actual
            <select name="morosidad_actual" value={form.morosidad_actual} onChange={handleChange}>
              <option value="">Selecciona una opcion</option>
              <option value="no">No</option>
              <option value="si">Si</option>
            </select>
          </label>

          {form.morosidad_actual === "si" && (
            <>
              <label>
                Monto de morosidad
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  name="monto_morosidad"
                  value={form.monto_morosidad}
                  onChange={handleChange}
                  placeholder="Ej: 250000"
                />
              </label>

              <label>
                Antiguedad de morosidad
                <select name="antiguedad_morosidad" value={form.antiguedad_morosidad} onChange={handleChange}>
                  <option value="">Selecciona una opcion</option>
                  <option value="menos_3_meses">Menos de 3 meses</option>
                  <option value="3_a_12_meses">3 a 12 meses</option>
                  <option value="1_a_3_anios">1 a 3 anos</option>
                  <option value="mas_3_anios">Mas de 3 anos</option>
                </select>
              </label>
            </>
          )}
        </div>
      </div>

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
            <label>
              Ingreso mensual complementario
              <input
                type="number"
                inputMode="numeric"
                min="0"
                name="ingreso_mensual_complementario"
                value={form.ingreso_mensual_complementario}
                onChange={handleChange}
                placeholder="Ej: 800000"
              />
            </label>
            <label>
              Deuda mensual complementaria
              <input
                type="number"
                inputMode="numeric"
                min="0"
                name="deuda_mensual_complementario"
                value={form.deuda_mensual_complementario}
                onChange={handleChange}
                placeholder="Ej: 100000"
              />
            </label>
            <label>
              Tipo de contrato complementario
              <select name="tipo_contrato_complementario" value={form.tipo_contrato_complementario} onChange={handleChange}>
                <option value="">Selecciona un tipo</option>
                <option value="indefinido">Indefinido</option>
                <option value="independiente">Independiente</option>
                <option value="plazo_fijo">Plazo fijo</option>
                <option value="honorarios_variable">Honorarios / variable</option>
              </select>
            </label>
            <label>
              Continuidad laboral complementaria
              <select name="continuidad_laboral_complementario" value={form.continuidad_laboral_complementario} onChange={handleChange}>
                <option value="">Selecciona una opcion</option>
                <option value="menos_6_meses">Menos de 6 meses</option>
                <option value="entre_6_y_12_meses">Entre 6 y 12 meses</option>
                <option value="entre_1_y_3_anios">Entre 1 y 3 anos</option>
                <option value="mas_3_anios">Mas de 3 anos</option>
              </select>
            </label>
            <label>
              Morosidad complementaria
              <select name="morosidad_complementario" value={form.morosidad_complementario} onChange={handleChange}>
                <option value="">Selecciona una opcion</option>
                <option value="no">No</option>
                <option value="si">Si</option>
              </select>
            </label>
            <label className={showComplementRelationWarning ? "field-with-warning" : undefined}>
              Relacion complementaria
              <select name="relacion_complementario" value={form.relacion_complementario} onChange={handleChange}>
                <option value="">Selecciona una relacion</option>
                <option value="conyuge">Conyuge</option>
                <option value="pareja_conviviente">Pareja conviviente</option>
                <option value="pareja_hijos_comun">Pareja con hijos en comun</option>
                <option value="padre_madre">Padre/Madre</option>
                <option value="hijo_hija">Hijo/a</option>
                <option value="hermano_hermana">Hermano/a</option>
                <option value="otro_familiar">Otro familiar</option>
                <option value="amigo">Amigo/a</option>
                <option value="otro">Otro</option>
              </select>
              {showComplementRelationWarning && (
                <span className="field-warning">
                  Esta relacion puede requerir mayor respaldo en una evaluacion hipotecaria formal.
                </span>
              )}
            </label>
          </div>
          {showComplementMorosityWarning && (
            <div className="warning-box">
              Si la persona complementaria declara morosidad, no se considerara valida para mejorar el score orientativo.
            </div>
          )}
        </div>
      )}

      <div className="consent-info">
        <span className="consent-info-icon">✓</span>
        <span>
          Autorizacion de tratamiento de datos personales otorgada el{" "}
          <strong>{consentDate || "fecha registrada"}</strong>.
          {onViewConsent && (
            <>
              {" "}
              <button type="button" className="consent-ref-link" onClick={onViewConsent}>
                Ver detalle
              </button>
            </>
          )}
        </span>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading || debtExceedsIncome}>Calcular score</button>
        {loading && <span>Calculando...</span>}
      </div>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
}
