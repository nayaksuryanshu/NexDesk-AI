import { useEffect, useState } from 'react'
import socketService from '../services/socketService.js'

export default function AgentNotification({ role, inline = false }) {
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (role !== 'agent' && role !== 'admin') {
      return undefined
    }

    socketService.connect({ userRole: role })

    const socket = socketService.socket
    if (!socket) {
      return undefined
    }

    socket.emit('joinAgentRoom')

    const handleHandoff = (payload) => {
      setNotification(payload)
      setTimeout(() => setNotification(null), 5000)
    }

    socket.on('handoffRequested', handleHandoff)

    return () => {
      socket.off('handoffRequested', handleHandoff)
    }
  }, [role])

  if (!notification) {
    return null
  }

  return (
    <aside className={`agent-notification ${inline ? 'agent-notification-inline' : ''}`} role="status" aria-live="polite">
      <strong>New Escalation</strong>
      <p>
        Ticket "{notification.title}" requested human help by {notification.customer}.
      </p>
    </aside>
  )
}
