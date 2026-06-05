# Plan A — Surgical Fixes (Minimal Footprint)

Addresses all four gaps with the smallest possible change surface. No new files, no new abstractions, no refactoring beyond what the fix strictly requires.

---

## Scope

| Gap | File | Change |
| :-- | :--- | :----- |
| E6 — Medio not redirected | `frontend/src/App.jsx` | One-line condition change |
| E6 — Pull-based notification | `frontend/src/App.jsx` | Inline Supabase Realtime subscription in existing `useEffect` |
| E1 — Stale list on new lead | `frontend/src/App.jsx` | Prepend incoming lead to `evaluations` state inside subscription callback |
| E3 — No count badge on filter | `frontend/src/components/DashboardLeads.jsx` | Derive counts via `useMemo`, inject into `<option>` labels |

---

## Step-by-step

### 1. Fix E6 redirect (`App.jsx`)

**Location:** `handleResult`, line 290.

Change:
```js
setPage(resultSnapshot.classification === "Bajo" ? "recommendations" : "home");
```
To:
```js
setPage(resultSnapshot.classification === "Alto" ? "home" : "recommendations");
```

No other changes in `handleResult`.

---

### 2. Add Realtime subscription (`App.jsx`)

Add a second `useEffect` that runs when `userId` and `profile.role` resolve to a staff role. It subscribes to `INSERT` events on the `evaluations` table, filtered to `classification = Alto`.

**Import addition** (top of file):
```js
import { supabase } from "./services/supabaseClient";
```

**New `useEffect`** (after the existing evaluations loader):
```js
useEffect(() => {
  const isStaff = profile?.role === roles.sales || profile?.role === roles.admin;
  if (!isStaff) return;

  const channel = supabase
    .channel("new-alto-leads")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "evaluations" },
      (payload) => {
        const ev = payload.new;
        if (!ev?.result?.classification) return;

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
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [profile?.role]);
```

**Why a separate `useEffect`:** the subscription lifecycle is independent of `userId` changes — it only depends on role. Mixing it into the existing loader effect would require unsubscribing and resubscribing on every evaluation reload.

---

### 3. Add count badges to filter (`DashboardLeads.jsx`)

**New `useMemo`** (alongside existing `filtered`):
```js
const counts = useMemo(() => {
  const c = { Alto: 0, Medio: 0, Bajo: 0 };
  evaluations.forEach((item) => {
    if (c[item.result.classification] !== undefined) c[item.result.classification]++;
  });
  return c;
}, [evaluations]);
```

**Updated `<select>` options:**
```jsx
<option value="todos">Todos ({evaluations.length})</option>
<option value="Alto">Alto ({counts.Alto})</option>
<option value="Medio">Medio ({counts.Medio})</option>
<option value="Bajo">Bajo ({counts.Bajo})</option>
```

---

## Risk assessment

| Risk | Likelihood | Mitigation |
| :--- | :--------- | :--------- |
| Supabase Realtime not enabled on `evaluations` table | Medium | Subscription fails silently; existing pull-on-load still works |
| `payload.new.result` shape differs from stored evaluations | Low | Guard with `if (!ev?.result?.classification) return` |
| Duplicate event fires on own insert (user scores themselves) | Low | `prev.filter((item) => item.id !== ev.id)` deduplicates |

---

## Files changed

- `frontend/src/App.jsx` — 2 targeted edits (condition + new `useEffect`)
- `frontend/src/components/DashboardLeads.jsx` — 1 targeted edit (`useMemo` + option labels)

**No new files. No dependency additions.**
