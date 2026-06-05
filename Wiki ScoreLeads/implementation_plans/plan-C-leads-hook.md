# Plan C — Realtime-First Hook Architecture

Extracts all lead-related state and side effects from `App.jsx` into a custom `useLeads` hook. The hook owns the initial fetch, the Realtime subscription, the sort, the notification counter, and the delete action. `App.jsx` becomes a thin coordinator.

This is the highest-effort plan. It is appropriate if the dashboard is expected to grow (more columns, pagination, search) and the leads state is likely to be reused across components.

---

## Scope

| Gap | Approach |
| :-- | :------- |
| E6 — Medio not redirected | Same one-line fix in `App.jsx` |
| E6 — Pull-based notification | `useLeads` hook manages counter internally |
| E1 — Stale list | `useLeads` keeps evaluations live via Realtime |
| E3 — No count badge | `useLeads` exposes `counts` derived value |

---

## New file: `frontend/src/hooks/useLeads.js`

```js
import { useEffect, useMemo, useRef, useState } from "react";
import { getEvaluations } from "../services/evaluationService";
import { supabase } from "../services/supabaseClient";
import { roles } from "../services/auth";

const LAST_LEAD_CHECK_KEY = "scoreleads_last_lead_check";
const CLASSIFICATION_ORDER = { Alto: 1, Medio: 2, Bajo: 3 };

function sortEvaluations(list) {
  return [...list].sort((a, b) => {
    const diff =
      (CLASSIFICATION_ORDER[a.result.classification] ?? 99) -
      (CLASSIFICATION_ORDER[b.result.classification] ?? 99);
    return diff !== 0 ? diff : new Date(b.created_at) - new Date(a.created_at);
  });
}

export function useLeads({ userId, profile }) {
  const [evaluations, setEvaluations] = useState([]);
  const [newHighLeadsCount, setNewHighLeadsCount] = useState(0);
  const [error, setError] = useState("");

  const isStaff = profile?.role === roles.sales || profile?.role === roles.admin;
  const isUUID = (id) =>
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  // Initial load
  useEffect(() => {
    let active = true;
    if (!userId) { setEvaluations([]); return; }

    async function load() {
      try {
        setError("");
        const filterId = isStaff ? null : isUUID(userId) ? userId : "loading";
        if (filterId === "loading") return;

        const list = await getEvaluations(filterId);
        const sorted = sortEvaluations(list);

        if (isStaff) {
          const lastCheck = localStorage.getItem(LAST_LEAD_CHECK_KEY) || new Date(0).toISOString();
          const fresh = sorted.filter(
            (ev) => ev.result.classification === "Alto" && ev.created_at > lastCheck && ev.user_id !== userId
          );
          if (active) setNewHighLeadsCount(fresh.length);
        }

        if (active) setEvaluations(sorted);
      } catch (err) {
        console.error(err);
        if (active) setError("No pudimos cargar el historial. Revisa que las tablas de Supabase esten creadas.");
      }
    }

    load();
    return () => { active = false; };
  }, [userId]);

  // Realtime subscription (staff only)
  useEffect(() => {
    if (!isStaff) return;

    const channel = supabase
      .channel("evaluations-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "evaluations" },
        (payload) => {
          const ev = payload.new;
          if (!ev?.result?.classification) return;

          setEvaluations((prev) => sortEvaluations([ev, ...prev.filter((item) => item.id !== ev.id)]).slice(0, 25));

          if (ev.result.classification === "Alto") {
            setNewHighLeadsCount((n) => n + 1);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profile?.role]);

  const counts = useMemo(() => {
    const c = { Alto: 0, Medio: 0, Bajo: 0 };
    evaluations.forEach((ev) => {
      if (c[ev.result.classification] !== undefined) c[ev.result.classification]++;
    });
    return c;
  }, [evaluations]);

  const dismissNotification = () => {
    setNewHighLeadsCount(0);
    localStorage.setItem(LAST_LEAD_CHECK_KEY, new Date().toISOString());
  };

  const removeEvaluation = (id) => {
    setEvaluations((prev) => prev.filter((item) => item.id !== id));
  };

  const prependEvaluation = (ev) => {
    setEvaluations((prev) => sortEvaluations([ev, ...prev.filter((item) => item.id !== ev.id)]).slice(0, 25));
  };

  return {
    evaluations,
    setEvaluations,
    newHighLeadsCount,
    counts,
    error,
    dismissNotification,
    removeEvaluation,
    prependEvaluation,
  };
}
```

---

## Changes to `App.jsx`

### Replace internal evaluations state with hook

Remove:
```js
const [evaluations, setEvaluations] = useState([]);
const [newHighLeadsCount, setNewHighLeadsCount] = useState(0);
```
And the two `useEffect` blocks that manage them.

Add:
```js
import { useLeads } from "./hooks/useLeads";

const {
  evaluations,
  setEvaluations,
  newHighLeadsCount,
  counts,
  error: leadsError,
  dismissNotification,
  removeEvaluation,
  prependEvaluation,
} = useLeads({ userId, profile });
```

### Update callers

- `handleResult`: replace `setEvaluations((prev) => [...])` with `prependEvaluation(savedEvaluation)`
- `deleteEvaluation`: replace `setEvaluations((prev) => prev.filter(...))` with `removeEvaluation(evaluationId)`
- `handleDismissNotification` / `handleNotificationClick`: call `dismissNotification()` instead of managing state inline

### E6 redirect fix
```js
setPage(resultSnapshot.classification === "Alto" ? "home" : "recommendations");
```

### Merge `leadsError` into `dataError`

```js
const visibleError = dataError || leadsError;
// Replace {dataError && ...} with {visibleError && ...}
```

---

## Changes to `DashboardLeads.jsx`

Accept `counts` as a prop (passed from `App.jsx` via the hook's return value):

```jsx
export default function DashboardLeads({ evaluations, counts }) {
```

```jsx
<option value="todos">Todos ({evaluations.length})</option>
<option value="Alto">Alto ({counts.Alto})</option>
<option value="Medio">Medio ({counts.Medio})</option>
<option value="Bajo">Bajo ({counts.Bajo})</option>
```

**Alternatively:** keep `counts` internal to `DashboardLeads` via a local `useMemo` (as in Plans A and B) and drop the prop. The hook's `counts` is still useful for other components (e.g., a badge on the Navbar leads link).

---

## Tradeoff vs. Plans A and B

| | Plan A | Plan B | Plan C |
| :- | :----- | :----- | :----- |
| New files | 0 | 1 service | 1 hook |
| `App.jsx` lines removed | ~0 | ~5 | ~40 |
| Testability | Low | Medium | High |
| Complexity | Lowest | Medium | Highest |
| Justified by current scope? | Yes | Yes | Only if dashboard grows |

Plan C is architecturally cleanest but introduces an abstraction that currently has only one consumer (`App.jsx`). The CLAUDE.md convention says "no abstractions without three real uses." Adopt Plan C if a second consumer of lead state is planned (e.g., a Navbar badge showing count, a separate notifications panel).

---

## Files changed

- `frontend/src/hooks/useLeads.js` — **new file**
- `frontend/src/App.jsx` — significant reduction (~40 lines removed, hook call added)
- `frontend/src/components/DashboardLeads.jsx` — 1 edit (count badges, optional `counts` prop)
