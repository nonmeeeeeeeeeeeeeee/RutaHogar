import React from "react";

export default function NotificationToast({ count, onClick, onClose }) {
  if (count <= 0) return null;

  return (
    <div className="notification-toast">
      <div className="notification-content" onClick={onClick}>
        <div className="notification-icon">🚀</div>
        <div className="notification-text">
          <strong>{count} Lead{count > 1 ? "s" : ""} con Score Alto</strong>
          <p>Hay nuevos prospectos calificados esperando revisión.</p>
        </div>
      </div>
      <button className="notification-close" onClick={onClose} aria-label="Cerrar">
        ×
      </button>
    </div>
  );
}
