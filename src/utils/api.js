const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const api = {
  get: (endpoint) => fetch(`${API_BASE}${endpoint}`),
  post: (endpoint, body) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  put: (endpoint, body) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  delete: (endpoint) =>
    fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' }),
};
