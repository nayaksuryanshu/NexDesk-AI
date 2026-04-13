import { Link } from 'react-router-dom'

const statusLabel = {
  open: 'Open',
  in_progress: 'Escalated',
  resolved: 'Closed',
  closed: 'Closed',
}

export default function TicketInboxRow({ ticket, canAssign = false }) {
  const status = statusLabel[ticket?.status] || ticket?.status || 'Open'
  const priority = (ticket?.priority || 'medium').toUpperCase()
  const updatedAt = ticket?.updatedAt || ticket?.createdAt

  return (
    <article className="ticket-inbox-row">
      <div className="ticket-inbox-col id" data-label="Ticket ID">#{(ticket?._id || '').slice(-6).toUpperCase()}</div>
      <div className="ticket-inbox-col subject" data-label="Subject">
        <strong>{ticket?.title || 'Untitled ticket'}</strong>
        <small>{ticket?.description || 'No description provided.'}</small>
      </div>
      <div className="ticket-inbox-col status" data-label="Status">
        <span className={`ticket-status-badge ${status.toLowerCase()}`}>{status}</span>
      </div>
      <div className="ticket-inbox-col priority" data-label="Priority">{priority}</div>
      <div className="ticket-inbox-col updated" data-label="Last Updated">{updatedAt ? new Date(updatedAt).toLocaleString() : 'Recently'}</div>
      <div className="ticket-inbox-actions">
        <Link to={`/app/tickets/${ticket?._id}`} className="button-ghost">
          Quick View
        </Link>
        {canAssign ? <button type="button" className="button-ghost">Assign to me</button> : null}
      </div>
    </article>
  )
}
