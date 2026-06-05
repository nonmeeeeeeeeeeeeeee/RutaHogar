# Badges de conteo en el filtro del DashboardLeads

El selector de filtro en `DashboardLeads.jsx` muestra el número de leads por cada categoría junto al nombre de la clasificación.

---

## Comportamiento

El dropdown de filtro muestra:

```
Todos (12)
Alto (5)
Medio (4)
Bajo (3)
```

Los conteos se recalculan con `useMemo` cada vez que cambia la lista de evaluaciones. Como `evaluations` se actualiza en tiempo real a través de [[notificacion-leads-alto|useLeads]], los badges reflejan el estado actual sin necesidad de recargar.

---

## Implementación

Los conteos se calculan localmente en `DashboardLeads.jsx` con un `useMemo`:

```js
const counts = useMemo(() => {
  const c = { Alto: 0, Medio: 0, Bajo: 0 };
  evaluations.forEach((item) => {
    if (c[item.result.classification] !== undefined) c[item.result.classification]++;
  });
  return c;
}, [evaluations]);
```

El total (`Todos`) usa directamente `evaluations.length`.

---

## Archivos involucrados

| Archivo | Cambio |
| :------ | :----- |
| `frontend/src/components/DashboardLeads.jsx` | `useMemo` de conteos + badges en las opciones del `<select>` |
