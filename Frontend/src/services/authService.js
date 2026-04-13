import axios from 'axios'
import { getApiBaseUrl } from '../config/api.js'

const api = axios.create({
  baseURL: getApiBaseUrl(),
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