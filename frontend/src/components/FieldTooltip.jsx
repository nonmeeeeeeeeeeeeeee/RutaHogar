import React, { useEffect, useRef, useState } from "react";

export default function FieldTooltip({ text }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <span className="field-tooltip-wrap" ref={ref}>
      <button
        type="button"
        className={`field-tooltip-btn ${open ? "is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Ayuda"
      >
        <i className="ti ti-help-circle" />
      </button>

      {open && (
        <div className="field-tooltip-cloud" role="tooltip">
          {text}
        </div>
      )}
    </span>
  );
}