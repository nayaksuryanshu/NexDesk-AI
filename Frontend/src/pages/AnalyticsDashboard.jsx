import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import { analyticsService } from '../services/analyticsService.js'
import { ticketService } from '../services/ticketService.js'
import { useAuth } from '../context/useAuth.js'

export default function AnalyticsDashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [responseTimes, setResponseTimes] = useState({ avgAiFirstResponseMinutes: 0, avgHumanFirstResponseMinutes: 0 })
  const [handoffs, setHandoffs] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const isStaff = user?.role === 'agent' || user?.role === 'admin'

  useEffect(() => {
    const load = async () => {
      try {
        setError('')
        setLoading(true)
        const [summaryData, responseData, ticketData] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getResponseTimes(),
          ticketService.getTickets(),
        ])

        setSummary(summaryData)
        setResponseTimes(responseData)
        setHandoffs(
          (ticketData || [])
            .filter((ticket) => ticket.status === 'in_progress' || ticket.assignedAgent)
            .slice(0, 6),
        )
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (!isStaff) {
    return <Navigate to="/app" replace />
  }

  const trendCards = [
    {
      label: 'Total Tickets Resolved',
      value: summary?.aiRate?.totalResolved || 0,
      trend: '+5% from last week',
      positive: true,
    },
    {
      label: 'AI Deflection Rate (%)',
      value: `${summary?.aiRate?.aiResolutionRate || 0}%`,
      trend: '+3% from last week',
      positive: true,
    },
    {
      label: 'Average Response Time',
      value: `${responseTimes.avgAiFirstResponseMinutes || 0} min`,
      trend: '-8% from last week',
      positive: true,
    },
    {
      label: 'Pending Human Handoffs',
      value: summary?.escalatedTickets || 0,
      trend: '+2% from last week',
      positive: false,
    },
  ]

  return (
    <AppLayout title="Analytics">
      <main className="support-page app-page-content">
        {error ? <div className="error-banner">{error}</div> : null}
        {loading ? <p className="muted">Loading analytics...</p> : null}

        {!loading ? (
          <>
            <section className="analytics-premium-grid">
              {trendCards.map((item) => (
                <article className="analytics-metric-card" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <small className={item.positive ? 'trend-up' : 'trend-down'}>{item.trend}</small>
                </article>
              ))}
            </section>

            <section className="analytics-placeholder-grid">
              <article className="analytics-placeholder-card">
                <div className="panel-head">
                  <h3>Ticket Volume by Day</h3>
                </div>
                <div className="analytics-chart-placeholder">Bar chart placeholder (Recharts ready)</div>
              </article>

              <article className="analytics-placeholder-card">
                <div className="panel-head">
                  <h3>Resolution Time: AI vs Human</h3>
                </div>
                <div className="analytics-chart-placeholder">Line chart placeholder (Recharts ready)</div>
              </article>
            </section>

            <section className="analytics-table-panel">
              <div className="panel-head">
                <h3>Recent Handoffs</h3>
              </div>

              <div className="analytics-table-head">
                <span>Ticket ID</span>
                <span>Customer intent</span>
                <span>Human Agent assigned</span>
              </div>

              {handoffs.length === 0 ? <p className="muted">No recent handoffs found.</p> : null}

              {handoffs.map((ticket) => (
                <div className="analytics-table-row" key={ticket._id}>
                  <span>#{ticket._id.slice(-6).toUpperCase()}</span>
                  <span>{ticket.title}</span>
                  <span>{ticket.assignedAgent?.name || 'Unassigned'}</span>
                </div>
              ))}
            </section>
          </>
        ) : null}
      </main>
    </AppLayout>
  )
}
