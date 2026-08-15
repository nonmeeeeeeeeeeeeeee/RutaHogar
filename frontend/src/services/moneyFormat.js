export function formatMoneyInput(raw) {
  if (raw === "" || raw == null) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (digits === "") return "";
  return Number(digits).toLocaleString("es-CL");
}

export function stripMoneyInput(value) {
  return String(value).replace(/\./g, "").replace(/[^0-9]/g, "");
}
