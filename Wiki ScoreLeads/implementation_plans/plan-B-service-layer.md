# Plan B — Service-Layer Extraction

Fixes the same four gaps but moves the Realtime subscription logic into a dedicated service module. `App.jsx` stays thin; the subscription contract is testable and swappable without touching the component tree.

---

## Scope

| Gap | Approach |
| :-- | :------- |
| E6 — Medio not redirected | Same one-line fix as Plan A |
| E6 — Pull-based notification | New `realtimeService.js` exposes `subscribeToHighLeads(callback)` |
| E1 — Stale list | Callback in `realtimeService` delivers the full new evaluation; `App.jsx` inserts + re-sorts |
| E3 — No count badge | Same `useMemo` + label change as Plan A |

---

## New file: `frontend/src/services/realtimeService.js`

```js
import { supabase } from "./supabaseClient";

/**
 * Subscribes to INSERT events on evaluations.
 * onEvent receives the new evaluation row.
 * Returns a cleanup function.
 */
export function subscribeToEvaluations(onEvent) {
  const channel = supabase
    .channel("evaluations-feed")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "evaluations" },
      (payload) => {
        if (payload.new?.result?.classification) onEvent(payload.new);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
```

The service is deliberately narrow: it does not filter by classification, does not manage state, and does not know about React. The caller decides what to do with each event.

---

## Changes to `App.jsx`

### Import
```js
import { subscribeToEvaluations } from "./services/realtimeService";
```

### New `useEffect`
```js
useEffect(() => {
  const isStaff = profile?.role === roles.sales || profile?.role === roles.admin;
  if (!isStaff) return;

  const unsubscribe = subscribeToEvaluations((ev) => {
    setEvaluations((prev) => {
      const next = [ev, ...prev.filter((item) => item.id !== ev.id)];
      next.sort((a, b) => {
        const order = { Alto: 1, Medio: 2, Bajo: 3 };
        const diff = (order[a.result.classification] ?? 99) - (order[b.result.classification] ?? 99);
        return diff !== 0 ? diff : new Date(b.created_at) - new Date(a.created_at);
      });
      return next.slice(0, 25);
    });

    if (ev.result.classification === "Alto") {
      setNewHighLeadsCount((n) => n + 1);
    }
  });

  return unsubscribe;
}, [profile?.role]);
```

### E6 redirect fix (same as Plan A)
```js
setPage(resultSnapshot.classification === "Alto" ? "home" : "recommendations");
```

---

## Changes to `DashboardLeads.jsx`

Same count-badge change as Plan A.

```js
const counts = useMemo(() => {
  const c = { Alto: 0, Medio: 0, Bajo: 0 };
  evaluations.forEach((item) => {
    if (c[item.result.classification] !== undefined) c[item.result.classification]++;
  });
  return c;
}, [evaluations]);
```

```jsx
<option value="todos">Todos ({evaluations.length})</option>
<option value="Alto">Alto ({counts.Alto})</option>
<option value="Medio">Medio ({counts.Medio})</option>
<option value="Bajo">Bajo ({counts.Bajo})</option>
```

---

## Why extract to a service?

- `realtimeService.js` follows the same pattern as `evaluationService.js` and `goalsService.js` — all Supabase I/O lives in `services/`.
- If the Realtime provider changes (e.g., Supabase → Pusher), the component layer doesn't change.
- The callback signature `(ev: EvaluationRow) => void` is easy to test with a mock.

---

## Tradeoff vs. Plan A

| | Plan A | Plan B |
| :- | :----- | :----- |
| New files | 0 | 1 |
| `App.jsx` complexity | Slightly higher | Lower |
| Testability | Low | High |
| Aligns with existing service pattern | Partially | Fully |

Plan B adds one file but keeps `App.jsx` consistent with the project's existing architecture. Prefer this if the codebase will grow beyond the current MVP scope.

---

## Files changed

- `frontend/src/services/realtimeService.js` — **new file**
- `frontend/src/App.jsx` — 2 edits (condition + new `useEffect` using service)
- `frontend/src/components/DashboardLeads.jsx` — 1 edit (count badges)
