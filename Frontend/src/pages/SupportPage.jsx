import { useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { useAuth } from '../context/useAuth.js'

const priorityOptions = ['Low', 'Normal', 'High', 'Urgent']

export default function SupportPage() {
  const { user } = useAuth()
  const isCustomer = user?.role === 'customer'
  const [ticket, setTicket] = useState({ subject: '', priority: 'Normal', details: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setTicket((current) => ({ ...current, [name]: value }))
    setSubmitted(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <AppLayout title="Support Desk">
      <main className="support-page">
        <section className="support-hero">
          <div>
            <span className="eyebrow">Customer support</span>
            <h1>Open a support request.</h1>
            <p>Use the protected workspace to create a ticket and check queue status.</p>
          </div>

          <div className="support-queue-card">
            <div className="support-queue-head">
              <div>
                <span className="eyebrow">Queue snapshot</span>
                <strong>Live support status</strong>
              </div>
              <span className="tag">Protected</span>
            </div>
            <div className="support-queue-grid">
              <div className="support-queue-stat">
                <span className="support-queue-label">Open</span>
                <strong className="support-queue-value">12</strong>
              </div>
              <div className="support-queue-stat">
                <span className="support-queue-label">SLA</span>
                <strong className="support-queue-value">96%</strong>
              </div>
              <div className="support-queue-stat">
                <span className="support-queue-label">Reply</span>
                <strong className="support-queue-value support-queue-value--time">3m 14s</strong>
              </div>
            </div>
            <p className="support-queue-note">
              Signed in as {user?.name || 'customer'}.
            </p>
          </div>
        </section>

        <section className="support-grid">
          {isCustomer ? (
            <div className="support-panel">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">New ticket</span>
                  <h2>Create a request</h2>
                </div>
                <span className="status-badge">Live</span>
              </div>

              <form className="support-form" onSubmit={handleSubmit}>
                <label className="field">
                  <span>Subject</span>
                  <input name="subject" value={ticket.subject} onChange={handleChange} placeholder="Billing clarification" required />
                </label>

                <label className="field">
                  <span>Priority</span>
                  <select name="priority" value={ticket.priority} onChange={handleChange}>
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Details</span>
                  <textarea
                    name="details"
                    rows="6"
                    value={ticket.details}
                    onChange={handleChange}
                    placeholder="Describe the issue and any context the agent should know."
                    required
                  />
                </label>

                <button className="button" type="submit">
                  Submit Request
                </button>

                {submitted ? <div className="success-banner">Your support request is ready to hand off to an agent.</div> : null}
              </form>
            </div>
          ) : (
            <div className="support-panel">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">Support desk</span>
                  <h2>Agent workspace</h2>
                </div>
                <span className="status-badge">Read only</span>
              </div>
              <p className="muted">Agents can review queue status and activity here. Ticket creation is hidden for staff roles.</p>
            </div>
          )}

          <aside className="support-panel">
            <span className="eyebrow">Recent activity</span>
            <div className="support-activity-list">
              <div className="support-activity-item">
                <strong>Password reset escalated</strong>
                <span>12 min ago</span>
              </div>
              <div className="support-activity-item">
                <strong>Invoice updated successfully</strong>
                <span>1 hour ago</span>
              </div>
              <div className="support-activity-item">
                <strong>Knowledge article delivered</strong>
                <span>Today</span>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </AppLayout>
  )
}
