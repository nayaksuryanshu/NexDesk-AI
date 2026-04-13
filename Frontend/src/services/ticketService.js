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

export const ticketService = {
  async getTickets(params = {}) {
    const { data } = await api.get('/tickets', { params })
    return data.tickets || []
  },

  async getTicketById(ticketId) {
    const { data } = await api.get(`/tickets/${ticketId}`)
    return data.ticket
  },

  async getTicketMessages(ticketId) {
    const { data } = await api.get(`/tickets/${ticketId}/messages`)
    return data.messages || []
  },

  async createTicket(payload) {
    const { data } = await api.post('/tickets', payload)
    return data.ticket
  },

  async updateTicket(ticketId, payload) {
    const { data } = await api.put(`/tickets/${ticketId}`, payload)
    return data.ticket
  },

  async deleteTicket(ticketId) {
    const { data } = await api.delete(`/tickets/${ticketId}`)
    return data
  },
}
