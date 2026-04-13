const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

export function getApiUrl() {
  return API_URL
}

export function getApiBaseUrl() {
  return `${API_URL}/api`
}
