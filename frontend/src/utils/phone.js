export const CHILEAN_MOBILE_PREFIX = "+56 9";
export const PHONE_ERROR_MESSAGE = "Ingresa un número chileno válido de 8 dígitos después de +56 9.";

export function onlyPhoneDigits(value, maxLength = 8) {
  return String(value || "").replace(/\D/g, "").slice(0, maxLength);
}

export function parseChileanPhone(value = "") {
  const digits = String(value || "").replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("569")) return digits.slice(3);
  if (digits.startsWith("9") && digits.length >= 9) return digits.slice(1);

  return digits;
}

export function formatPhone(value = "") {
  const digits = onlyPhoneDigits(parseChileanPhone(value), 8);
  const firstBlock = digits.slice(0, 4);
  const secondBlock = digits.slice(4, 8);
  return [firstBlock, secondBlock].filter(Boolean).join(" ");
}

export function validatePhone(value = "") {
  return parseChileanPhone(value).length === 8;
}

export function normalizePhone(value = "") {
  const digits = parseChileanPhone(value);
  return digits.length === 8 ? `+569${digits}` : "";
}
