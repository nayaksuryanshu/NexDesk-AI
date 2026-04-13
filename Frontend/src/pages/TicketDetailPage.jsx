import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import TicketForm from '../components/TicketForm.jsx'
import { ticketService } from '../services/ticketService.js'
import { useAuth } from '../context/useAuth.js'

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isStaff = user?.role === 'agent' || user?.role === 'admin'

  const loadTicket = useCallback(async () => {
    try {
      setError('')
      setLoading(true)
      const data = await ticketService.getTicketById(id)
      setTicket(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch ticket')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadTicket()
  }, [loadTicket])

  const handleSave = async (payload) => {
    try {
      setSaving(true)
      setError('')
      const updated = await ticketService.updateTicket(id, payload)
      setTicket(updated)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update ticket')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setError('')
      await ticketService.deleteTicket(id)
      navigate('/app/my-tickets', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete ticket')
    }
  }

  const handleStatusChange = async (status) => {
    await handleSave({ status })
  }

  return (
    <AppLayout title="Ticket Details">
      <main className="support-page">
        <section className="support-hero">
          <div>
            <span className="eyebrow">Ticket details</span>
            <h1>Review this ticket.</h1>
            <p>Update status, edit content, or continue in chat from one page.</p>
          </div>

          <div className="support-queue-card">
            <Link className="button-ghost" to="/app/my-tickets">
              Back to My Tickets
            </Link>
            {isStaff ? (
              <Link className="button-ghost" to="/app/agent">
                Agent Dashboard
              </Link>
            ) : null}
          </div>
        </section>

        {loading ? <p className="muted" style={{ marginTop: '16px' }}>Loading ticket...</p> : null}
        {error ? <div className="error-banner" style={{ marginTop: '16px' }}>{error}</div> : null}

        {!loading && ticket ? (
          <section className="support-grid" style={{ marginTop: '16px' }}>
            <article className="support-panel">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">Metadata</span>
                  <h2>{ticket.title}</h2>
                </div>
                <span className="tag">{ticket.status}</span>
              </div>

              <div className="ticket-meta" style={{ marginTop: '16px' }}>
                <span>Priority: {ticket.priority}</span>
                <span>Agent: {ticket.assignedAgent?.name || 'Unassigned'}</span>
                <span>Customer: {ticket.customerId?.name || ticket.customerId?.email || 'Unknown'}</span>
                <span>Created: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Unknown'}</span>
              </div>

              <div className="support-panel" style={{ marginTop: '16px' }}>
                <p>{ticket.description}</p>
              </div>

              <div className="ticket-actions" style={{ marginTop: '16px' }}>
                {!isStaff ? (
                  <Link className="button-ghost" to={`/app/tickets/${ticket._id}/chat`}>
                    Ask AI Assistant
                  </Link>
                ) : null}
                {isStaff ? (
                  <select
                    className="ticket-status-select"
                    value={ticket.status}
                    onChange={(event) => handleStatusChange(event.target.value)}
                    disabled={saving}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : null}
                <button type="button" className="button-ghost" onClick={loadTicket} disabled={saving}>
                  Refresh
                </button>
                {isStaff ? (
                  <button type="button" className="button-ghost" onClick={handleDelete} disabled={saving}>
                    Delete Ticket
                  </button>
                ) : null}
              </div>
            </article>

            <aside className="support-panel">
              <span className="eyebrow">Edit Ticket</span>
              <TicketForm
                initialValues={{
                  title: ticket.title,
                  description: ticket.description,
                  priority: ticket.priority,
                }}
                onSubmit={handleSave}
                submitLabel={saving ? 'Saving...' : 'Update Ticket'}
                disabled={saving || !isStaff}
              />
              {!isStaff ? (
                <p className="muted" style={{ marginTop: '12px' }}>
                  Only agents and admins can edit this ticket.
                </p>
              ) : null}
            </aside>
          </section>
        ) : null}
      </main>
    </AppLayout>
  )
}
