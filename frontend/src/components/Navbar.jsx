import React from "react";
import { roleLabels, roles } from "../services/auth";

const navByRole = {
  [roles.user]: [
    { id: "evaluate", label: "Precalificacion" },
    { id: "tracking", label: "Seguimiento" },
    { id: "recommendations", label: "Recomendaciones" },
  ],
  [roles.sales]: [{ id: "leads", label: "Dashboard Leads" }],
  [roles.admin]: [{ id: "admin", label: "Panel Admin" }],
};

export default function Navbar({ profile, page, currentScore, onNavigate, onLogout }) {
  const role = profile?.role || roles.user;
  const items = navByRole[role] || navByRole[roles.user];
  const displayName = profile?.full_name || profile?.email || "Usuario";

  return (
    <nav className="navbar">
      <button className="brand-button" type="button" onClick={() => onNavigate("home")} aria-label="Ir al inicio">
        <img src="/Logo ScoreLeads.png" alt="ScoreLeads" />
      </button>

      <div className="nav-links">
        {items.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${page === item.id ? "is-active" : ""}`}
            type="button"
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="nav-user">
        {role === roles.user && (
          <strong className="current-score">
            {currentScore ? `Score actual: ${currentScore.score} / ${currentScore.classification}` : "Sin score actual"}
          </strong>
        )}
        <span>{displayName}</span>
        <small>{roleLabels[role]}</small>
        {role === roles.user && (
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate("profile")}>
            Perfil
          </button>
        )}
        <button className="secondary-button compact-button" type="button" onClick={onLogout}>
          Salir
        </button>
      </div>
    </nav>
  );
}
