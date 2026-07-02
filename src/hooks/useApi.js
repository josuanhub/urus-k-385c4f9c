import { useState, useCallback } from 'react';

const API_BASE    = 'https://www.urusverify.com/v1/client/385c4f9c-e908-4973-a966-044e3512c21e/api';
const FACTORY_KEY = 'factory2026';

const DEFAULT_HEADERS = {
  'Content-Type':  'application/json',
  'x-factory-key': FACTORY_KEY,
};

/**
 * Realiza una petición autenticada a la API base.
 *
 * @param {string} endpoint  - Ruta relativa, e.g. '/users'
 * @param {RequestInit} options - Opciones fetch (method, body, headers extra, etc.)
 * @returns {Promise<{ data: any, error: string|null, status: number }>}
 */
export async function fetchApi(endpoint = '', options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    method: options.method ?? 'GET',
    headers: {
      ...DEFAULT_HEADERS,
      ...(options.headers ?? {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    ...(options.signal ? { signal: options.signal } : {}),
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        (typeof data === 'object' && data?.message) ??
        (typeof data === 'string' && data) ??
        `Error ${response.status}: ${response.statusText}`;
      return { data: null, error: message, status: response.status };
    }

    return { data, error: null, status: response.status };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { data: null, error: 'Request aborted', status: 0 };
    }
    return { data: null, error: err.message ?? 'Network error', status: 0 };
  }
}

/**
 * Hook que expone fetchApi con estado reactivo (loading / error / data).
 *
 * @returns {{ request: Function, data: any, error: string|null, loading: boolean, reset: Function }}
 */
export function useApi() {
  const [data,    setData]    = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  const request = useCallback(async (endpoint = '', options = {}) => {
    setLoading(true);
    setError(null);

    const result = await fetchApi(endpoint, options);

    setData(result.data);
    setError(result.error);
    setLoading(false);

    return result;
  }, []);

  return { request, data, error, loading, reset };
}

export default useApi;