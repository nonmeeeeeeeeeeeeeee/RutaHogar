import { useEffect, useMemo, useRef, useState } from "react";
import { getEvaluations } from "../services/evaluationService";
import { supabase } from "../utils/supabase";
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
