const statuses = [
  { label: 'All statuses', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
]

const priorities = [
  { label: 'All priorities', value: '' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

export default function TicketFilters({ filters, onChange, onClear }) {
  const handleFieldChange = (event) => {
    const { name, value } = event.target
    onChange?.({ ...filters, [name]: value })
  }

  return (
    <div className="ticket-filters">
      <label className="field">
        <span>Status</span>
        <select name="status" value={filters.status} onChange={handleFieldChange}>
          {statuses.map((status) => (
            <option key={status.value || 'all-status'} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Priority</span>
        <select name="priority" value={filters.priority} onChange={handleFieldChange}>
          {priorities.map((priority) => (
            <option key={priority.value || 'all-priority'} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>From date</span>
        <input name="fromDate" type="date" value={filters.fromDate} onChange={handleFieldChange} />
      </label>

      <button type="button" className="button-ghost" onClick={onClear}>
        Clear Filters
      </button>
    </div>
  )
}
