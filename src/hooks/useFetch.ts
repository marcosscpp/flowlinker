import { useEffect, useState, useRef } from "react";
import axios from "axios";

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetch = <T>(fetchFn: () => Promise<T>): UseFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchFnRef = useRef(fetchFn);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);

    const source = axios.CancelToken.source();

    fetchFnRef
      .current()
      .then((res) => {
        setLoading(false);
        setData(res);
      })
      .catch((err) => {
        setLoading(false);
        if (axios.isCancel(err)) {
          return;
        }
        setError(err instanceof Error ? err.message : "Erro ao buscar dados");
      });

    return () => {
      source.cancel();
    };
  }, []);

  return { data, loading, error };
};
