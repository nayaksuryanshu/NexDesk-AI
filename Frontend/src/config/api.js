export function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL

  if (configuredUrl && configuredUrl.trim()) {
    return configuredUrl.replace(/\/$/, '')
  }

  return import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'
}
