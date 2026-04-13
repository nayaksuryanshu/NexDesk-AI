import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import TicketCard from '../components/TicketCard.jsx'
import TicketFilters from '../components/TicketFilters.jsx'
import AgentNotification from '../components/AgentNotification.jsx'
import { ticketService } from '../services/ticketService.js'
import { useAuth } from '../context/useAuth.js'

const initialFilters = {
  status: '',
  priority: '',
  fromDate: '',
}

export default function AgentDashboard() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [showResolved, setShowResolved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isStaff = user?.role === 'agent' || user?.role === 'admin'

  const loadTickets = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await ticketService.getTickets()
      setTickets(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tickets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  const filteredTickets = useMemo(() => {
    const fromTimestamp = filters.fromDate ? new Date(filters.fromDate).getTime() : null

    return tickets.filter((ticket) => {
      if (!showResolved && (ticket.status === 'resolved' || ticket.status === 'closed')) {
        return false
      }

      if (filters.status && ticket.status !== filters.status) {
        return false
      }

      if (filters.priority && ticket.priority !== filters.priority) {
        return false
      }

      if (fromTimestamp && new Date(ticket.createdAt).getTime() < fromTimestamp) {
        return false
      }

      return true
    })
  }, [tickets, filters, showResolved])

  const handleStatusChange = async (ticketId, status) => {
    try {
      const updated = await ticketService.updateTicket(ticketId, { status })
      setTickets((current) => current.map((ticket) => (ticket._id === ticketId ? updated : ticket)))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update ticket status')
    }
  }

  if (!isStaff) {
    return <Navigate to="/app" replace />
  }

  return (
    <AppLayout title="Active Chats">
      <AgentNotification role={user?.role} />

      <main className="support-page">
        <section className="support-hero">
          <div>
            <span className="eyebrow">Agent dashboard</span>
            <h1>Resolve the queue.</h1>
            <p>Use filters and status controls to move tickets through the workflow.</p>
          </div>

          <div className="support-queue-card">
            <strong>{filteredTickets.length}</strong>
            <p className="muted">tickets in view</p>
            <Link className="button-ghost" to="/app/analytics">
              Open Analytics
            </Link>
            <button type="button" className="button-ghost" onClick={loadTickets}>
              Refresh Tickets
            </button>
            <button type="button" className="button-ghost" onClick={() => setShowResolved((current) => !current)}>
              {showResolved ? 'Hide Resolved' : 'Show Resolved'}
            </button>
          </div>
        </section>

        <section className="support-panel" style={{ marginTop: '16px' }}>
          <TicketFilters
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(initialFilters)}
          />
        </section>

        {error ? <div className="error-banner" style={{ marginTop: '16px' }}>{error}</div> : null}

        <section className="support-grid" style={{ marginTop: '16px' }}>
          <div className="support-panel" style={{ gridColumn: '1 / -1' }}>
            {loading ? <p className="muted">Loading tickets...</p> : null}

            {!loading && filteredTickets.length === 0 ? (
              <p className="muted">No tickets found for the selected filters.</p>
            ) : null}

            {!loading && filteredTickets.length > 0 ? (
              <div className="support-activity-list">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    metaPrefix="Customer"
                    controls={
                      <select
                        className="ticket-status-select"
                        value={ticket.status}
                        onChange={(event) => handleStatusChange(ticket._id, event.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    }
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </AppLayout>
  )
}
