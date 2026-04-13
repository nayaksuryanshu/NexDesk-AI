import api, { buildApiUrl } from './api.js'

export const authService = {
  async login(payload) {
    console.log("VITE_API_BASE_URL is:", import.meta.env.VITE_API_BASE_URL)
    const loginUrl = buildApiUrl('/api/auth/login')
    const { data } = await api.post(loginUrl, payload)
    return data
  },

  async register(payload) {
    const registerUrl = buildApiUrl('/api/auth/register')
    const { data } = await api.post(registerUrl, payload)
    return data
  },

  async getCurrentUser() {
    const meUrl = buildApiUrl('/api/auth/me')
    const { data } = await api.get(meUrl)
    return data.user
  },
}