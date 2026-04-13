import api from './api.js'

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
