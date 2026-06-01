const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/** Map `/api/...` to the backend path (json-server has no `/api` prefix). */
function resolveUrl(endpoint) {
  const path = API_BASE ? endpoint.replace(/^\/api/, '') : endpoint;
  return `${API_BASE}${path}`;
}

export const api = {
  get: (endpoint) => fetch(resolveUrl(endpoint)),
  post: (endpoint, body) =>
    fetch(resolveUrl(endpoint), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  put: (endpoint, body) =>
    fetch(resolveUrl(endpoint), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  delete: (endpoint) =>
    fetch(resolveUrl(endpoint), { method: 'DELETE' }),
};
