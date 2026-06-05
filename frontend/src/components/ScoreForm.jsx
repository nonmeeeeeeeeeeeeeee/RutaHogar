import React, { useState } from "react";
import axios from "axios";
import { getLocalConsent } from "../services/profileService";

export default function ScoreForm({ targetCommune, onResult }) {
  const debtIncomeMessage =
    "El monto de deuda mensual no puede ser mayor a tus ingresos declarados. Revisa este valor antes de continuar.";
const consent = getLocalConsent();
const consentDate = consent?.timestamp
  ? new Date(consent.timestamp).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  : null;

export default function ScoreForm({ targetCommune, onResult, onViewConsent }) {
  const [form, setForm] = useState({
    ingreso_mensual: "",
    deuda_mensual: "",
    edad: "",
    numero_cargas: "",
    ahorro_disponible: "",
    tipo_contrato: "",
    continuidad_laboral: "",
    morosidad_actual: "",
    dividendo_estimado: "",
    complemento_renta: false,
    complemento_nombre: "",
    complemento_monto: "",
    complemento_relacion: "",
    complemento_ingreso_mensual: "",
    complemento_deuda_mensual: "",
    complemento_morosidad: "",
    complemento_tipo_contrato: "",
    complemento_continuidad_laboral: "",
    complemento_tarjetas_activas: "",
    consentimiento: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debtExceedsIncome =
    form.ingreso_mensual !== "" &&
    form.deuda_mensual !== "" &&
    Number(form.deuda_mensual) > Number(form.ingreso_mensual);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? (value === "" ? "" : value) : value,
    }));
  };

  const validate = () => {
    const missing = [];
    if (form.ingreso_mensual === "") missing.push("Ingreso mensual");
    if (form.deuda_mensual === "") missing.push("Deuda mensual");
    if (form.edad === "") missing.push("Edad");
    if (form.numero_cargas === "") missing.push("Numero de cargas");
    if (form.ahorro_disponible === "") missing.push("Ahorro disponible");
    if (!form.tipo_contrato) missing.push("Tipo de contrato");
    if (!form.continuidad_laboral) missing.push("Continuidad laboral");
    if (!form.morosidad_actual) missing.push("Situacion de morosidad");
    if (!targetCommune) missing.push("Comuna objetivo preliminar");
    if (form.dividendo_estimado === "") missing.push("Dividendo estimado");
    if (form.complemento_renta) {
      if (!form.complemento_nombre) missing.push("Nombre de la persona complementaria");
      if (form.complemento_monto === "") missing.push("Monto de complemento de renta");
      if (!form.complemento_relacion) missing.push("Relación con la persona complementaria");
      if (form.complemento_ingreso_mensual === "") missing.push("Ingreso mensual del co-deudor");
      if (form.complemento_deuda_mensual === "") missing.push("Deuda mensual del co-deudor");
      if (!form.complemento_morosidad) missing.push("Morosidad del co-deudor");
      if (!form.complemento_tipo_contrato) missing.push("Tipo de contrato del co-deudor");
      if (!form.complemento_continuidad_laboral) missing.push("Continuidad laboral del co-deudor");
      if (form.complemento_tarjetas_activas === "") missing.push("Tarjetas de crédito activas del co-deudor");
    }
    if (missing.length) {
      setError(`Complete todos los campos: ${missing.join(", ")}`);
      return false;
    }

    const numericRules = [
      ["Ingreso mensual", form.ingreso_mensual, (value) => value > 0, "debe ser mayor que 0."],
      ["Deuda mensual", form.deuda_mensual, (value) => value >= 0, "debe ser mayor o igual a 0."],
      ["Edad", form.edad, (value) => value >= 18 && value <= 100, "debe estar entre 18 y 100."],
      ["Numero de cargas", form.numero_cargas, (value) => value >= 0 && value <= 10, "debe estar entre 0 y 10."],
      ["Ahorro disponible", form.ahorro_disponible, (value) => value >= 0, "no puede ser negativo."],
      ["Dividendo estimado", form.dividendo_estimado, (value) => value >= 0, "no puede ser negativo."],
    ];

    if (form.complemento_renta) {
      numericRules.push([
        "Monto de complemento de renta",
        form.complemento_monto,
        (value) => value >= 0,
        "no puede ser negativo.",
      ]);
      numericFields.push(["Monto de complemento de renta", form.complemento_monto]);
      numericFields.push(["Ingreso mensual del co-deudor", form.complemento_ingreso_mensual]);
      numericFields.push(["Deuda mensual del co-deudor", form.complemento_deuda_mensual]);
      numericFields.push(["Tarjetas de crédito activas", form.complemento_tarjetas_activas]);

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
      const payload = {
        ingreso_mensual: parseFloat(form.ingreso_mensual),
        deuda_mensual: parseFloat(form.deuda_mensual),
        edad: parseInt(form.edad, 10),
        numero_cargas: parseInt(form.numero_cargas, 10),
        ahorro_disponible: parseFloat(form.ahorro_disponible),
        tipo_contrato: form.tipo_contrato,
        continuidad_laboral: form.continuidad_laboral,
        morosidad_actual: form.morosidad_actual,
        comuna_objetivo: targetCommune,
        dividendo_estimado: parseFloat(form.dividendo_estimado),
        complemento_renta: form.complemento_renta,
        complemento_nombre: form.complemento_nombre || undefined,
        complemento_monto: form.complemento_renta ? parseFloat(form.complemento_monto) : undefined,
        complemento_relacion: form.complemento_relacion || undefined,
        complemento_ingreso_mensual: form.complemento_renta ? parseFloat(form.complemento_ingreso_mensual) : undefined,
        complemento_deuda_mensual: form.complemento_renta ? parseFloat(form.complemento_deuda_mensual) : undefined,
        complemento_morosidad: form.complemento_morosidad || undefined,
        complemento_tipo_contrato: form.complemento_tipo_contrato || undefined,
        complemento_continuidad_laboral: form.complemento_continuidad_laboral || undefined,
        complemento_tarjetas_activas: form.complemento_renta ? parseInt(form.complemento_tarjetas_activas, 10) : undefined,
        consentimiento: form.consentimiento,
      };

      const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://127.0.0.1:8000" : "");
      const res = await axios.post(`${apiBase}/score`, payload, { timeout: 60000 });
      
      onResult(res.data, payload);
    } catch (err) {
      console.error(err);
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError("La petición tardó demasiado, por favor intenta nuevamente.");
      } else {
        setError("Hubo un problema con la petición, por favor intenta nuevamente.");
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
            Edad
            <input
              type="number"
              inputMode="numeric"
              min="18"
              max="100"
              step="1"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              placeholder="Ej: 35"
            />
          </label>

          <label>
            Numero de cargas
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="10"
              step="1"
              name="numero_cargas"
              value={form.numero_cargas}
              onChange={handleChange}
              placeholder="Ej: 0"
            />
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
              <option value="plazo_fijo">Plazo fijo</option>
              <option value="independiente">Independiente</option>
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
              <option value="no_lo_se">No lo se</option>
            </select>
          </label>
        </div>
      </div>

      <label className="check-row">
        <input
          type="checkbox"
          name="complemento_renta"
          checked={form.complemento_renta}
          onChange={handleChange}
        />
        Complementar renta con otra persona
      </label>

      {form.complemento_renta && (
        <div className="nested-fields">
          <h4>Datos del complemento de renta</h4>
          <div className="form-grid">
            <label>
              Nombre de la persona complementaria
              <input
                type="text"
                name="complemento_nombre"
                value={form.complemento_nombre}
                onChange={handleChange}
                placeholder="Ej: Juan Perez"
              />
            </label>
            <label>
              Monto mensual de complemento
              <input
                type="number"
                inputMode="numeric"
                min="0"
                name="complemento_monto"
                value={form.complemento_monto}
                onChange={handleChange}
                placeholder="Ej: 250000"
              />
            </label>
            <label>
              Relacion con la persona complementaria
              <select name="complemento_relacion" value={form.complemento_relacion} onChange={handleChange}>
                <option value="">Selecciona una relacion</option>
                <option value="pareja">Pareja</option>
                <option value="familiar">Familiar</option>
                <option value="amigo">Amigo</option>
                <option value="otro">Otro</option>
              </select>
            </label>
            <label>
              Ingreso mensual del co-deudor
              <input
                type="number"
                inputMode="numeric"
                min="0"
                name="complemento_ingreso_mensual"
                value={form.complemento_ingreso_mensual}
                onChange={handleChange}
                placeholder="Ej: 800000"
              />
            </label>
            <label>
              Deuda mensual del co-deudor
              <input
                type="number"
                inputMode="numeric"
                min="0"
                name="complemento_deuda_mensual"
                value={form.complemento_deuda_mensual}
                onChange={handleChange}
                placeholder="Ej: 100000"
              />
            </label>
            <label>
              Morosidad del co-deudor
              <select name="complemento_morosidad" value={form.complemento_morosidad} onChange={handleChange}>
                <option value="">Selecciona una opcion</option>
                <option value="no">No</option>
                <option value="si">Si</option>
                <option value="no_lo_se">No lo se</option>
              </select>
            </label>
            <label>
              Tipo de contrato del co-deudor
              <select name="complemento_tipo_contrato" value={form.complemento_tipo_contrato} onChange={handleChange}>
                <option value="">Selecciona un tipo</option>
                <option value="indefinido">Indefinido</option>
                <option value="plazo_fijo">Plazo fijo</option>
                <option value="independiente">Independiente</option>
              </select>
            </label>
            <label>
              Continuidad laboral del co-deudor
              <select name="complemento_continuidad_laboral" value={form.complemento_continuidad_laboral} onChange={handleChange}>
                <option value="">Selecciona una opcion</option>
                <option value="menos_6_meses">Menos de 6 meses</option>
                <option value="entre_6_y_12_meses">Entre 6 y 12 meses</option>
                <option value="entre_1_y_3_anios">Entre 1 y 3 anos</option>
                <option value="mas_3_anios">Mas de 3 anos</option>
              </select>
            </label>
            <label>
              Tarjetas de crédito activas
              <input
                type="number"
                inputMode="numeric"
                min="0"
                name="complemento_tarjetas_activas"
                value={form.complemento_tarjetas_activas}
                onChange={handleChange}
                placeholder="Ej: 2"
              />
            </label>
          </div>
        </div>
      )}

      <div className="consent-info">
        <span className="consent-info-icon">✓</span>
        <span>
          Autorización de tratamiento de datos personales otorgada el{" "}
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