import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Load data from the backend inside a page:
 *   const { data, loading, error, reload } = useApi(() => getMyApplication(), []);
 * `data` is `initial` until the first answer arrives.
 */
export function useApi(loader, deps = [], initial = null) {
  const [state, setState] = useState({ data: initial, loading: true, error: "" });
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const reload = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: "" }));
    try {
      const data = await loaderRef.current();
      setState({ data, loading: false, error: "" });
      return data;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      return undefined;
    }
  }, []);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, reload };
}
