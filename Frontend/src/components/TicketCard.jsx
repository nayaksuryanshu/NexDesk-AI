import { Link } from 'react-router-dom'

const statusTone = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export default function TicketCard({ ticket, controls, metaPrefix = 'Customer', showAiChat = false }) {
  if (!ticket) {
    return null
  }

  const assignee = ticket.assignedAgent?.name || 'Unassigned'
  const customer = ticket.customerId?.name || ticket.customerId?.email || 'Unknown customer'
  const createdAt = ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Unknown date'

  return (
    <article className="support-activity-item ticket-card">
      <div className="ticket-card-head">
        <strong>{ticket.title}</strong>
        <span className="tag">{statusTone[ticket.status] || ticket.status}</span>
      </div>

      <p className="muted">{ticket.description}</p>

      <div className="ticket-meta">
        <span>
          Priority: <strong style={{ color: '#f8fafc' }}>{ticket.priority}</strong>
        </span>
        <span>
          Assignee: <strong style={{ color: '#f8fafc' }}>{assignee}</strong>
        </span>
        <span>
          {metaPrefix}: <strong style={{ color: '#f8fafc' }}>{customer}</strong>
        </span>
        <span>Created: {createdAt}</span>
      </div>

      <div className="ticket-actions">
        <Link className="button-ghost" to={`/app/tickets/${ticket._id}`}>
          View Details
        </Link>
        {showAiChat ? (
          <Link className="button-ghost" to={`/app/tickets/${ticket._id}/chat`}>
            AI Chat
          </Link>
        ) : null}
        {controls || null}
      </div>
    </article>
  )
}
