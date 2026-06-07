import React, { useMemo, useState } from "react";

function formatFecha(created_at) {
  if (!created_at) return "-";
  const d = new Date(created_at);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DashboardLeads({ evaluations }) {
  const [filter, setFilter] = useState("todos");
  const [selectedLead, setSelectedLead] = useState(null);

  const filtered = useMemo(() => {
    if (filter === "todos") return evaluations;
    return evaluations.filter((item) => item.result.classification === filter);
  }, [evaluations, filter]);

  const counts = useMemo(() => {
    const c = { Alto: 0, Medio: 0, Bajo: 0 };
    evaluations.forEach((item) => {
      if (c[item.result.classification] !== undefined) c[item.result.classification]++;
    });
    return c;
  }, [evaluations]);

  return (
    <section className="section-block">
      <div className="section-heading">
        <span className="eyebrow">Gestión comercial</span>
        <h1>Dashboard Leads</h1>
        <p>Vista para revisar leads evaluados y priorizar acciones comerciales.</p>
      </div>

      <div className="toolbar">
        <label>
          Filtrar por clasificación
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="todos">Todos ({evaluations.length})</option>
            <option value="Alto">Alto ({counts.Alto})</option>
            <option value="Medio">Medio ({counts.Medio})</option>
            <option value="Bajo">Bajo ({counts.Bajo})</option>
          </select>
        </label>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nombre</th>
              <th>Comuna</th>
              <th>Clasificación</th>
              <th>Riesgos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{formatFecha(item.created_at)}</td>
                <td>{item.full_name}</td>
                <td>{item.input?.comuna_objetivo || "-"}</td>
                <td>
                  <span className={`status-pill ${item.result.classification?.toLowerCase()}`}>
                    {item.result.classification}
                  </span>
                </td>
                <td>
                  {item.result.risks?.length
                    ? item.result.risks.slice(0, 2).join(", ")
                    : "Sin riesgos relevantes"}
                </td>
                <td>
                  <button
                    className="secondary-button compact-button"
                    onClick={() => setSelectedLead(item)}
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan="6">Aún no existen leads para esta clasificación.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {selectedLead && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="lead-detail-card"
            style={{
              background: "var(--color-surface, #fff)",
              borderRadius: "14px",
              padding: "2rem",
              maxWidth: "80%",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <h2 style={{ margin: 0 }}>Perfil del Lead</h2>
              <button className="secondary-button compact-button" onClick={() => setSelectedLead(null)}>
                Cerrar
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.4rem", marginBottom: "1.25rem" }}>
              <p style={{ margin: 0 }}>
                <strong>Nombre:</strong> {selectedLead.full_name || "-"}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Email:</strong> {selectedLead.email || "-"}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Fecha evaluación:</strong> {formatFecha(selectedLead.created_at)}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Comuna objetivo:</strong> {selectedLead.input?.comuna_objetivo || "-"}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Score:</strong> {selectedLead.result.score}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Clasificación:</strong>{" "}
                <span className={`status-pill ${selectedLead.result.classification?.toLowerCase()}`}>
                  {selectedLead.result.classification}
                </span>
              </p>
            </div>

            {selectedLead.result.positive_indicators?.length > 0 && (
              <>
                <h3 style={{ marginBottom: "0.5rem" }}>Indicadores positivos</h3>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1.25rem" }}>
                  {selectedLead.result.positive_indicators.map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </>
            )}

            {selectedLead.result.risks?.length > 0 && (
              <>
                <h3 style={{ marginBottom: "0.5rem" }}>Riesgos detectados</h3>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1.25rem" }}>
                  {selectedLead.result.risks.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </>
            )}

            {selectedLead.result.executive_summary && (
              <>
                <h3 style={{ marginBottom: "0.5rem" }}>Resumen Ejecutivo</h3>
                <p style={{ marginBottom: "1.25rem" }}>{selectedLead.result.executive_summary}</p>
              </>
            )}

            {selectedLead.result.commercial_guidance && (
              <>
                <h3 style={{ marginBottom: "0.5rem" }}>Orientación Comercial</h3>
                <p style={{ margin: 0 }}>{selectedLead.result.commercial_guidance}</p>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}