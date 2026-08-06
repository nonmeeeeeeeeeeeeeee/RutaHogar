import React, { useState } from "react";
import { formatClp } from "../utils/helpers";
import { continuityOptions } from "./ScoreForm";

export default function RegisterMilestone({ evaluation, onBack, onRegister }) {
  const [activeType, setActiveType] = useState(null); // 'ahorro', 'deuda', 'laboral'
  const [newSavings, setNewSavings] = useState("");
  const [newDebt, setNewDebt] = useState("");
  const [newContinuity, setNewContinuity] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputData = evaluation?.input || {};
  const currentSavings = Number(inputData.ahorro_disponible) || 0;
  const currentDebt = Number(inputData.deuda_mensual) || 0;
  const currentContinuity = inputData.continuidad_laboral || "";

  const handleAhorroSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const savingsVal = Number(newSavings);
    if (!Number.isFinite(savingsVal) || savingsVal < 0 || newSavings === "") {
      setError("El nuevo ahorro debe ser un número válido mayor o igual a 0.");
      return;
    }
    if (savingsVal <= currentSavings) {
      setError(
        `El nuevo monto de ahorro debe ser superior a tu ahorro declarado previamente (${formatClp(
          currentSavings
        )}).`
      );
      return;
    }
    setIsSubmitting(true);
    await onRegister({ ahorro_disponible: savingsVal });
    setIsSubmitting(false);
  };

  const handleDeudaSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const debtVal = Number(newDebt);
    if (!Number.isFinite(debtVal) || debtVal < 0 || newDebt === "") {
      setError("La deuda debe ser un número válido mayor o igual a 0.");
      return;
    }
    if (debtVal >= currentDebt) {
      setError(
        `El nuevo monto debe ser inferior a tu deuda declarada previamente (${formatClp(
          currentDebt
        )}).`
      );
      return;
    }
    setIsSubmitting(true);
    await onRegister({ deuda_mensual: debtVal });
    setIsSubmitting(false);
  };

  const handleLaboralSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!newContinuity) {
      setError("Selecciona una opción de continuidad laboral.");
      return;
    }
    if (newContinuity === currentContinuity) {
      setError(
        "Debes seleccionar una continuidad diferente a la actual."
      );
      return;
    }
    setIsSubmitting(true);
    await onRegister({ continuidad_laboral: newContinuity });
    setIsSubmitting(false);
  };

  return (
    <section className="section-block milestone-registration-panel">
      <div className="section-heading">
        <button type="button" className="text-button mb-3" onClick={onBack}>
          ← Volver al Plan de Mejora
        </button>
        <span className="eyebrow">Seguimiento</span>
        <h1>Registrar un Avance Financiero</h1>
        <p>
          Selecciona el área en la que lograste un hito para recalcular tu perfil y 
          plan de mejora.
        </p>
      </div>

      <div className="milestone-cards-container" style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button 
          className={`card-button ${activeType === 'ahorro' ? 'active' : ''}`} 
          onClick={() => { setActiveType('ahorro'); setError(""); }}
          style={{ flex: 1, padding: "1.5rem", borderRadius: "8px", border: activeType === 'ahorro' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', background: activeType === 'ahorro' ? 'var(--surface-color-alt)' : 'var(--surface-color)', cursor: "pointer", textAlign: "left" }}
        >
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>💰 Aumento de Ahorro</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>He logrado ahorrar más dinero para mi pie.</p>
        </button>

        <button 
          className={`card-button ${activeType === 'deuda' ? 'active' : ''}`} 
          onClick={() => { setActiveType('deuda'); setError(""); }}
          style={{ flex: 1, padding: "1.5rem", borderRadius: "8px", border: activeType === 'deuda' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', background: activeType === 'deuda' ? 'var(--surface-color-alt)' : 'var(--surface-color)', cursor: "pointer", textAlign: "left" }}
        >
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>💳 Reducción de Deuda</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>He pagado parte o la totalidad de mis deudas.</p>
        </button>

        <button 
          className={`card-button ${activeType === 'laboral' ? 'active' : ''}`} 
          onClick={() => { setActiveType('laboral'); setError(""); }}
          style={{ flex: 1, padding: "1.5rem", borderRadius: "8px", border: activeType === 'laboral' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', background: activeType === 'laboral' ? 'var(--surface-color-alt)' : 'var(--surface-color)', cursor: "pointer", textAlign: "left" }}
        >
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>💼 Mejora Laboral</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>He cambiado mi tipo de contrato o antigüedad.</p>
        </button>
      </div>

      <div className="milestone-form-container">
        {activeType === "ahorro" && (
          <form onSubmit={handleAhorroSubmit} className="milestone-form" style={{ padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)" }}>
            <h3>Actualiza tu Ahorro Disponible</h3>
            <p className="field-help" style={{ marginBottom: "1.5rem" }}>
              Actualmente tienes declarado: <strong>{formatClp(currentSavings)}</strong>
            </p>
            <label className="field-label">
              Nuevo Ahorro Disponible Total (CLP)
              <input
                type="number"
                min="0"
                value={newSavings}
                onChange={(e) => setNewSavings(e.target.value)}
                placeholder="Ej. 15000000"
                className="text-input"
                autoFocus
              />
            </label>
            {error && <div className="warning-note" style={{ marginTop: "1rem" }}>{error}</div>}
            <div style={{ marginTop: "1.5rem" }}>
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? "Calculando nuevo score..." : "Registrar y Recalcular"}
              </button>
            </div>
          </form>
        )}

        {activeType === "deuda" && (
          <form onSubmit={handleDeudaSubmit} className="milestone-form" style={{ padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)" }}>
            <h3>Actualiza tu Deuda Mensual</h3>
            <p className="field-help" style={{ marginBottom: "1.5rem" }}>
              Actualmente pagas al mes: <strong>{formatClp(currentDebt)}</strong>
            </p>
            <label className="field-label">
              Nueva Deuda Mensual Total (CLP)
              <input
                type="number"
                min="0"
                value={newDebt}
                onChange={(e) => setNewDebt(e.target.value)}
                placeholder="Ej. 150000"
                className="text-input"
                autoFocus
              />
            </label>
            {error && <div className="warning-note" style={{ marginTop: "1rem" }}>{error}</div>}
            <div style={{ marginTop: "1.5rem" }}>
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? "Calculando nuevo score..." : "Registrar y Recalcular"}
              </button>
            </div>
          </form>
        )}

        {activeType === "laboral" && (
          <form onSubmit={handleLaboralSubmit} className="milestone-form" style={{ padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)" }}>
            <h3>Actualiza tu Continuidad Laboral</h3>
            <p className="field-help" style={{ marginBottom: "1.5rem" }}>
              Continuidad actual: <strong>{continuityOptions.find(o => o.value === currentContinuity)?.label || "No especificada"}</strong>
            </p>
            <label className="field-label">
              Nueva Continuidad Laboral
              <select
                value={newContinuity}
                onChange={(e) => setNewContinuity(e.target.value)}
                className="text-input"
                autoFocus
              >
                <option value="">Selecciona una opción</option>
                {continuityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            {error && <div className="warning-note" style={{ marginTop: "1rem" }}>{error}</div>}
            <div style={{ marginTop: "1.5rem" }}>
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? "Calculando nuevo score..." : "Registrar y Recalcular"}
              </button>
            </div>
          </form>
        )}

        {!activeType && (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", border: "1px dashed var(--border-color)", borderRadius: "8px" }}>
            Selecciona una opción de arriba para comenzar.
          </div>
        )}
      </div>
    </section>
  );
}
