import { supabase } from "../utils/supabase";

export function subscribeToEvaluations(onEvent) {
  const channel = supabase
    .channel("evaluations-inserts")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "evaluations",
      },
      (payload) => {
        if (payload.new?.result?.classification) {
          onEvent(payload.new);
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
