import { io } from 'socket.io-client'
import { getApiUrl } from '../config/api.js'

class SocketService {
  constructor() {
    this.socket = null
    this.joinedTicketId = null
  }

  getSocketUrl() {
    return getApiUrl()
  }

  connect({ ticketId, userRole, onMessage, onTyping, onAIError, onError, preserveListeners = false } = {}) {
    if (!this.socket) {
      this.socket = io(this.getSocketUrl(), {
        transports: ['websocket', 'polling'],
        withCredentials: false,
      })
    }

    if (!preserveListeners) {
      this.removeListeners()
    }

    this.socket.on('connect', () => {
      if (ticketId && this.joinedTicketId !== ticketId) {
        this.socket.emit('joinTicket', ticketId)
        this.joinedTicketId = ticketId
      }
    })

    this.socket.on('newMessage', (message) => {
      onMessage?.(message)
    })

    this.socket.on('aiTyping', (payload) => {
      onTyping?.(Boolean(payload?.isTyping))
    })

    this.socket.on('aiError', (payload) => {
      onAIError?.(payload?.message || 'AI assistant is temporarily unavailable.')
    })

    this.socket.on('messageError', (payload) => {
      onError?.(payload?.error || 'Failed to send message.')
    })

    this.socket.on('connect_error', () => {
      onAIError?.('Realtime service is currently unavailable. Please refresh or contact support.')
    })

    if (ticketId && this.joinedTicketId !== ticketId) {
      this.socket.emit('joinTicket', ticketId)
      this.joinedTicketId = ticketId
    }

    if (userRole === 'agent' || userRole === 'admin') {
      this.socket.emit('joinAgentRoom')
    }

    return this.socket
  }

  sendMessage({ ticketId, message, sender, role = 'customer' }) {
    if (!this.socket || !ticketId || !message) {
      return
    }

    this.socket.emit('sendMessage', {
      ticketId,
      message,
      sender,
      role,
    })
  }

  removeListeners() {
    if (!this.socket) {
      return
    }

    this.socket.off('newMessage')
    this.socket.off('aiTyping')
    this.socket.off('aiError')
    this.socket.off('messageError')
    this.socket.off('connect_error')
    this.socket.off('connect')
  }

  disconnect() {
    if (!this.socket) {
      return
    }

    this.removeListeners()
    this.socket.disconnect()
    this.socket = null
    this.joinedTicketId = null
  }
}

const socketService = new SocketService()

export { socketService }
export default socketService
