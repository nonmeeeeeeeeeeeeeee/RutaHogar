export function getCurrentMonthId(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function isPastMonth(monthId, currentMonthId) {
  return monthId < currentMonthId;
}

export function partitionMonths(monthsData, currentMonthId, openLimit = 2) {
  const pendingFromCurrent = monthsData
    .filter((month) => month.id >= currentMonthId && month.status === "pendiente");

  const openIds = new Set();
  const current = monthsData.find((month) => month.id === currentMonthId);
  if (current) openIds.add(current.id);
  if (pendingFromCurrent.length > 0) openIds.add(pendingFromCurrent[0].id);

  const open = monthsData.filter((month) => openIds.has(month.id)).slice(0, openLimit);
  const closed = monthsData.filter(
    (month) => !openIds.has(month.id) && (month.status !== "pendiente" || isPastMonth(month.id, currentMonthId)),
  );

  return { open, closed };
}
