import { useCallback, useState } from "react";
import {
  explainComment,
  type InsightExplanation,
} from "@/lib/gitloreApi";

export function useExplain() {
  const [data, setData] = useState<InsightExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (body: Parameters<typeof explainComment>[0]) => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const res = await explainComment(body);
        setData(res);
        return res;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Explain request failed";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, run, reset, setData, setError };
}
