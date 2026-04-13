import api from './api.js'

export const authService = {
  async login(payload) {
    const { data } = await api.post('/auth/login', payload)
    return data
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  async getCurrentUser() {
    const { data } = await api.get('/auth/me')
    return data.user
  },
}