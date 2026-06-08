import React from "react";
import { roleLabels } from "../services/auth";

export default function AdminPanel({ evaluations, profile }) {
  const counts = evaluations.reduce(
    (acc, item) => {
      acc.total += 1;
      acc[item.result.classification] = (acc[item.result.classification] || 0) + 1;
      return acc;
    },
    { total: 0, Alto: 0, Medio: 0, Bajo: 0 }
  );

  const profiles = [
    profile,
    { id: "template-sales", email: "ejecutivo@scoreleads.cl", role: "ejecutivo" },
    { id: "template-user", email: "usuario@scoreleads.cl", role: "usuario" },
  ].filter(Boolean);

  return (
    <section className="section-block">
      <div className="section-heading">
        <span className="eyebrow">Administracion</span>
        <h1>Panel Admin</h1>
        <p>Metricas generales y estructura simple de perfiles para preparar la conexion con Supabase.</p>
      </div>

      <div className="metrics-grid">
        <article><strong>{counts.total}</strong><span>Evaluaciones</span></article>
        <article><strong>{counts.Alto}</strong><span>Alta</span></article>
        <article><strong>{counts.Medio}</strong><span>Media</span></article>
        <article><strong>{counts.Bajo}</strong><span>Baja</span></article>
      </div>

      <div className="admin-grid">
        <section>
          <strong>Profiles</strong>
          <p className="small-text">Estructura preparada: id, full_name, role, created_at, updated_at.</p>
          <ul className="plain-list">
            {profiles.map((item) => (
              <li key={item.id}>
                <span>{item.email}</span>
                <strong>{roleLabels[item.role] || item.role}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <strong>Evaluaciones generales</strong>
          <p className="small-text">
            No se muestran claves bancarias, documentos ni reglas internas. Solo informacion necesaria para la gestion.
          </p>
          <ul className="plain-list">
            {evaluations.slice(0, 5).map((item) => (
              <li key={item.id}>
                <span>{item.input.comuna_objetivo}</span>
                <strong>{item.result.classification}</strong>
              </li>
            ))}
            {!evaluations.length && <li>No hay evaluaciones registradas.</li>}
          </ul>
        </section>
      </div>
    </section>
  );
}
