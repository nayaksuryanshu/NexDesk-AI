import { useEffect, useMemo, useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import TicketInboxFilters from '../components/TicketInboxFilters.jsx'
import TicketInboxRow from '../components/TicketInboxRow.jsx'
import TicketForm from '../components/TicketForm.jsx'
import { ticketService } from '../services/ticketService.js'

const initialFilters = {
  status: '',
  assignee: '',
  query: '',
}

export default function CustomerTicketsPage() {
  const [tickets, setTickets] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  const loadTickets = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await ticketService.getTickets()
      setTickets(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your tickets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const normalizedStatus = ticket.status === 'in_progress' ? 'escalated' : ticket.status
      if (filters.status && normalizedStatus !== filters.status) {
        return false
      }

      if (filters.assignee === 'human' && !ticket.assignedAgent) {
        return false
      }

      if (filters.assignee === 'ai' && ticket.assignedAgent) {
        return false
      }

      if (filters.query) {
        const haystack = `${ticket._id} ${ticket.title} ${ticket.description}`.toLowerCase()
        if (!haystack.includes(filters.query.toLowerCase())) {
          return false
        }
      }

      return true
    })
  }, [tickets, filters])

  const handleCreateTicket = async (payload) => {
    try {
      setSubmitting(true)
      setError('')
      setSuccess('')
      const created = await ticketService.createTicket(payload)
      setTickets((current) => [created, ...current])
      setSuccess('Ticket created successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout title="Tickets">
      <main className="support-page app-page-content">
        <section className="support-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Ticket Inbox</span>
              <h2>Customer helpdesk queue</h2>
            </div>
            <button type="button" className="button-ghost" onClick={loadTickets}>
              Refresh Inbox
            </button>
          </div>

          <TicketInboxFilters
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(initialFilters)}
          />

          {loading ? <p className="muted">Loading tickets...</p> : null}
          {!loading && filteredTickets.length === 0 ? <p className="muted">No tickets match the current filters.</p> : null}

          {!loading && filteredTickets.length > 0 ? (
            <div className="ticket-inbox-list">
              <div className="ticket-inbox-head">
                <span>Ticket ID</span>
                <span>Subject</span>
                <span>Status</span>
                <span>Priority</span>
                <span>Last Updated</span>
                <span>Actions</span>
              </div>
              {filteredTickets.map((ticket) => (
                <TicketInboxRow key={ticket._id} ticket={ticket} canAssign={false} />
              ))}
            </div>
          ) : null}
        </section>

        <section className="support-panel" style={{ marginTop: '16px' }}>
          <span className="eyebrow">Create ticket</span>
          <TicketForm
            onSubmit={handleCreateTicket}
            submitLabel={submitting ? 'Creating...' : 'Create Ticket'}
            disabled={submitting}
          />
          {success ? <div className="success-banner">{success}</div> : null}
          {error ? <div className="error-banner">{error}</div> : null}
        </section>
      </main>
    </AppLayout>
  )
}
