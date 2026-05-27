import React, { useState } from "react";
import axios from "axios";

export default function ScoreForm({ targetCommune, onResult }) {
  const [form, setForm] = useState({
    ingreso_mensual: "",
    deuda_mensual: "",
    ahorro_disponible: "",
    tipo_contrato: "",
    continuidad_laboral: "",
    morosidad_actual: "",
    dividendo_estimado: "",
    complemento_renta: false,
    complemento_nombre: "",
    complemento_monto: "",
    complemento_relacion: "",
    consentimiento: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    if (form.ahorro_disponible === "") missing.push("Ahorro disponible");
    if (!form.tipo_contrato) missing.push("Tipo de contrato");
    if (!form.continuidad_laboral) missing.push("Continuidad laboral");
    if (!form.morosidad_actual) missing.push("Situacion de morosidad");
    if (!targetCommune) missing.push("Comuna objetivo preliminar");
    if (form.dividendo_estimado === "") missing.push("Dividendo estimado");
    if (!form.consentimiento) missing.push("Consentimiento de pre-evaluación");
    if (form.complemento_renta) {
      if (!form.complemento_nombre) missing.push("Nombre de la persona complementaria");
      if (form.complemento_monto === "") missing.push("Monto de complemento de renta");
      if (!form.complemento_relacion) missing.push("Relación con la persona complementaria");
    }
    if (missing.length) {
      setError(`Complete todos los campos: ${missing.join(", ")}`);
      return false;
    }

    const numericFields = [
      ["Ingreso mensual", form.ingreso_mensual],
      ["Deuda mensual", form.deuda_mensual],
      ["Ahorro disponible", form.ahorro_disponible],
      ["Dividendo estimado", form.dividendo_estimado],
    ];

    if (form.complemento_renta) {
      numericFields.push(["Monto de complemento de renta", form.complemento_monto]);
    }

    const invalidNumber = numericFields.find(([, value]) => Number(value) < 0);
    if (invalidNumber) {
      setError(`${invalidNumber[0]} no puede ser negativo.`);
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
        consentimiento: form.consentimiento,
      };

      const res = await axios.post("http://127.0.0.1:8000/score", payload);
      onResult(res.data, payload);
    } catch (err) {
      console.error(err);
      setError("Error comunicando con el backend. Asegúrate de que el servidor esté corriendo en http://127.0.0.1:8000");
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
              min="0"
              name="ingreso_mensual"
              value={form.ingreso_mensual}
              onChange={handleChange}
              placeholder="Ej: 1200000"
            />
          </label>

          <label>
            Deuda mensual
            <input
              type="number"
              inputMode="numeric"
              min="0"
              name="deuda_mensual"
              value={form.deuda_mensual}
              onChange={handleChange}
              placeholder="Ej: 150000"
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
          </div>
        </div>
      )}

      <label className="check-row consent-row">
        <input
          type="checkbox"
          name="consentimiento"
          checked={form.consentimiento}
          onChange={handleChange}
        />
        Acepto que estos datos sean usados solo para calcular una pre-evaluacion orientativa.
      </label>

      <div className="form-actions">
        <button type="submit" disabled={loading}>Calcular score</button>
        {loading && <span>Calculando...</span>}
      </div>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
}
