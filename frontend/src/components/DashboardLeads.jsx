import React, { useMemo, useState } from "react";

export default function DashboardLeads({ evaluations }) {
  const [filter, setFilter] = useState("todos");
  const filtered = useMemo(() => {
    if (filter === "todos") return evaluations;
    return evaluations.filter((item) => item.result.classification === filter);
  }, [evaluations, filter]);

  return (
    <section className="section-block">
      <div className="section-heading">
        <span className="eyebrow">Gestion comercial</span>
        <h1>Dashboard Leads</h1>
        <p>Vista simple para revisar leads evaluados con datos minimos necesarios para seguimiento comercial.</p>
      </div>

      <div className="toolbar">
        <label>
          Filtrar por clasificacion
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="todos">Todos</option>
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
          </select>
        </label>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Email</th>
              <th>Comuna</th>
              <th>Clasificacion</th>
              <th>Riesgos</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.created_at).toLocaleDateString("es-CL")}</td>
                <td>{item.email}</td>
                <td>{item.input.comuna_objetivo}</td>
                <td><span className={`status-pill ${item.result.classification.toLowerCase()}`}>{item.result.classification}</span></td>
                <td>{item.result.risks?.slice(0, 2).join(" ") || "Sin riesgos relevantes declarados."}</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan="5">Aun no hay leads para este filtro.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
