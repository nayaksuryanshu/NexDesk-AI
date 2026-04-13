export default function TicketInboxFilters({ filters, onChange, onClear }) {
  const handleChange = (event) => {
    const { name, value } = event.target
    onChange?.({ ...filters, [name]: value })
  }

  return (
    <div className="ticket-inbox-filters">
      <label className="field">
        <span>Status</span>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="escalated">Escalated</option>
        </select>
      </label>

      <label className="field">
        <span>Assignee</span>
        <select name="assignee" value={filters.assignee} onChange={handleChange}>
          <option value="">All</option>
          <option value="ai">AI</option>
          <option value="human">Human</option>
        </select>
      </label>

      <label className="field">
        <span>Search</span>
        <input
          name="query"
          value={filters.query}
          onChange={handleChange}
          placeholder="Search ticket ID or subject"
        />
      </label>

      <button type="button" className="button-ghost" onClick={onClear}>
        Reset
      </button>
    </div>
  )
}
