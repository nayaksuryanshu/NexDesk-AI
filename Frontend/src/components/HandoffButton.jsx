import { useState } from 'react'
import socketService from '../services/socketService.js'
import { analyticsService } from '../services/analyticsService.js'

export default function HandoffButton({ ticketId, customerName }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleHandoff = async () => {
    if (!ticketId) {
      return
    }

    try {
      setLoading(true)
      setMessage('')

      socketService.connect({ ticketId, preserveListeners: true })
      socketService.socket?.emit('requestHuman', {
        ticketId,
        reason: 'Customer requested human assistance',
        customerName,
      })

      await analyticsService.requestHandoff(ticketId, 'Customer requested human assistance')
      setMessage('A human agent has been notified and will assist shortly.')
    } catch {
      setMessage('Unable to notify an agent right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="handoff-panel">
      <button type="button" className="button-ghost" onClick={handleHandoff} disabled={loading}>
        {loading ? 'Requesting...' : 'Talk to a Human'}
      </button>
      {message ? <p className="muted">{message}</p> : null}
    </div>
  )
}
