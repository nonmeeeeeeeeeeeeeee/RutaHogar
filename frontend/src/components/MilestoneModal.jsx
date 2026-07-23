import React, { useState } from "react";
import { formatClp } from "../services/monthlyPlanService";

export default function MilestoneModal({ evaluation, onClose, onSubmit }) {
  const [type, setType] = useState("ahorro");

  // States
  const [newSavings, setNewSavings] = useState("");
  const [newDebt, setNewDebt] = useState("");
  const [newContinuity, setNewContinuity] = useState("");

  const [error, setError] = useState(null);

  const handleAhorroSubmit = () => {
    const savingsVal = Number(newSavings);
    if (!Number.isFinite(savingsVal) || savingsVal < 0 || newSavings === "") {
      setError("El nuevo ahorro debe ser un número válido mayor o igual a 0.");
      return;
    }
    const currentSavings = Number(evaluation?.input?.ahorro_disponible) || 0;
    if (savingsVal <= currentSavings) {
      setError(
        `El nuevo monto de ahorro debe ser superior a tu ahorro declarado previamente (${formatClp(
          currentSavings
        )}).`
      );
      return;
    }
    onSubmit({ ahorro_disponible: savingsVal });
  };

  const handleDeudaSubmit = () => {
    const debtVal = Number(newDebt);
    if (!Number.isFinite(debtVal) || debtVal < 0 || newDebt === "") {
      setError("La nueva deuda debe ser un número válido mayor o igual a 0.");
      return;
    }
    const currentDebt = Number(evaluation?.input?.deuda_mensual) || 0;
    if (debtVal >= currentDebt) {
      setError(
        `Tu nueva deuda debe ser menor a la deuda declarada previamente (${formatClp(
          currentDebt
        )}). Si aumentó, no se considera un avance positivo.`
      );
      return;
    }
    onSubmit({ deuda_mensual: debtVal });
  };

  const handleLaboralSubmit = () => {
    if (!newContinuity) {
      setError("Selecciona tu nueva continuidad laboral.");
      return;
    }
    if (newContinuity === evaluation?.input?.continuidad_laboral) {
      setError(
        "Seleccionaste la misma continuidad laboral que ya tienes registrada."
      );
      return;
    }
    onSubmit({ continuidad_laboral: newContinuity });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (type === "ahorro") handleAhorroSubmit();
    else if (type === "deuda") handleDeudaSubmit();
    else if (type === "laboral") handleLaboralSubmit();
  };

  return (
    <div
      className="consent-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="consent-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "500px" }}
      >
        <button
          className="consent-modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 style={{ marginBottom: "1rem" }}>Registrar Hito Financiero</h2>
        <p style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
          Registra un avance en tus finanzas para actualizar tu evaluación y
          recalcular tu score.
        </p>

        <form onSubmit={handleSubmit} className="score-form">
          <div className="field-wrap">
            <label>¿Qué avance lograste?</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setError(null);
              }}
            >
              <option value="ahorro">Nuevo monto de ahorro acumulado</option>
              <option value="deuda">Reducción de mi deuda mensual</option>
              <option value="laboral">Mejora en mi continuidad laboral</option>
            </select>
          </div>

          {type === "ahorro" && (
            <div className="field-wrap">
              <label>Nuevo Ahorro Disponible Total</label>
              <p className="field-help" style={{ marginTop: "-0.5rem" }}>
                Tu ahorro anterior era:{" "}
                {formatClp(Number(evaluation?.input?.ahorro_disponible) || 0)}
              </p>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={newSavings}
                onChange={(e) => setNewSavings(e.target.value)}
                placeholder="Ej: 5000000"
              />
            </div>
          )}

          {type === "deuda" && (
            <div className="field-wrap">
              <label>Nueva Deuda Mensual Total</label>
              <p className="field-help" style={{ marginTop: "-0.5rem" }}>
                Tu deuda anterior era:{" "}
                {formatClp(Number(evaluation?.input?.deuda_mensual) || 0)}
              </p>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={newDebt}
                onChange={(e) => setNewDebt(e.target.value)}
                placeholder="Ej: 200000"
              />
            </div>
          )}

          {type === "laboral" && (
            <div className="field-wrap">
              <label>Nueva Continuidad Laboral</label>
              <select
                value={newContinuity}
                onChange={(e) => setNewContinuity(e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                <option value="menos_6_meses">Menos de 6 meses</option>
                <option value="entre_6_y_12_meses">Entre 6 y 12 meses</option>
                <option value="entre_1_y_3_anios">Entre 1 y 3 años</option>
                <option value="mas_3_anios">Más de 3 años</option>
              </select>
            </div>
          )}

          {error && <div className="form-error">{error}</div>}

          <div
            className="form-actions"
            style={{ marginTop: "1.5rem", justifyContent: "flex-end", display: "flex", gap: "1rem" }}
          >
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="primary-button">
              Registrar Avance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
