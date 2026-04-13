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

export const analyticsService = {
  async getSummary() {
    const { data } = await api.get('/analytics/summary')
    return data
  },

  async getAiRate() {
    const { data } = await api.get('/analytics/ai-rate')
    return data
  },

  async getTicketVolume(days = 7) {
    const { data } = await api.get('/analytics/ticket-volume', {
      params: { days },
    })
    return data
  },

  async getResponseTimes() {
    const { data } = await api.get('/analytics/response-times')
    return data
  },

  async requestHandoff(ticketId, reason = 'Customer requested human support') {
    const { data } = await api.post(`/handoff/${ticketId}`, { reason })
    return data
  },
}
