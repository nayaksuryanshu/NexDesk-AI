import axios from 'axios'

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const apiOrigin = rawApiUrl.replace(/\/+$/, '').replace(/\/api$/, '')
const apiBaseUrl = `${apiOrigin}/api`

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexdesk_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
