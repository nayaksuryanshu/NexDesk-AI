import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import { useAuth } from '../context/useAuth.js'

export default function DashboardPage() {
  const { user } = useAuth()
  const isStaff = user?.role === 'agent' || user?.role === 'admin'

  return (
    <AppLayout title="Dashboard">
      <main className="dashboard-content app-page-content">
        <div className="dashboard-panel">
          <div style={{ marginTop: '28px' }}>
            <span className="eyebrow">Protected workspace</span>
            <h1 className="dashboard-title">Hello, {user?.name || 'there'}.</h1>
            <p className="dashboard-text">Your workspace is live and ready.</p>
          </div>

          <div className="dashboard-stats">
            <div className="dashboard-mini-card">
              <div className="muted">Role</div>
              <strong style={{ color: '#f8fafc', fontSize: '1.4rem' }}>{user?.role || 'customer'}</strong>
            </div>
            <div className="dashboard-mini-card">
              <div className="muted">Email</div>
              <strong style={{ color: '#f8fafc', fontSize: '1.1rem' }}>{user?.email || 'unknown'}</strong>
            </div>
            <div className="dashboard-mini-card">
              <div className="muted">Status</div>
              <strong style={{ color: '#bbf7d0', fontSize: '1.1rem' }}>Authenticated</strong>
            </div>
          </div>

          <div className="dashboard-grid">
            <section className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">Activity</span>
                  <h2 style={{ fontSize: '1.7rem' }}>Recent updates</h2>
                </div>
                <span className="tag">Live</span>
              </div>

              <div className="dashboard-list" style={{ marginTop: '18px' }}>
                <div className="dashboard-row">
                  <div>
                    <strong style={{ color: '#f8fafc' }}>Billing profile updated</strong>
                    <div className="muted">Customer handoff completed.</div>
                  </div>
                  <span className="status-badge">Resolved</span>
                </div>
                <div className="dashboard-row">
                  <div>
                    <strong style={{ color: '#f8fafc' }}>Knowledge article suggested</strong>
                    <div className="muted">The assistant matched the right answer.</div>
                  </div>
                  <span className="status-badge">AI</span>
                </div>
                <div className="dashboard-row">
                  <div>
                    <strong style={{ color: '#f8fafc' }}>Human escalation queued</strong>
                    <div className="muted">Agent context was passed through.</div>
                  </div>
                  <span className="status-badge">Priority</span>
                </div>
              </div>
            </section>

            <aside className="dashboard-aside">
              <span className="eyebrow">Shortcuts</span>
              <h2 style={{ fontSize: '1.7rem' }}>Quick actions.</h2>
              <p className="dashboard-text" style={{ marginTop: '12px' }}>Jump straight to the tools you use most.</p>

              <div className="dashboard-list" style={{ marginTop: '20px' }}>
                <div className="dashboard-mini-card">
                  <div className="muted">Support desk</div>
                  <strong style={{ color: '#f8fafc' }}>Open tickets</strong>
                </div>
                <div className="dashboard-mini-card">
                  <div className="muted">Analytics</div>
                  <strong style={{ color: '#f8fafc' }}>View performance</strong>
                </div>
                <div className="dashboard-mini-card">
                  <div className="muted">Tickets</div>
                  <strong style={{ color: '#f8fafc' }}>Review requests</strong>
                </div>
                {isStaff ? (
                  <Link className="button" to="/app/agent">
                    Resolve Ticket Queue
                  </Link>
                ) : (
                  <Link className="button" to="/app/my-tickets">
                    My Tickets & AI Chat
                  </Link>
                )}
                <Link className="button" to="/app/support">
                  Open Support Desk
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}