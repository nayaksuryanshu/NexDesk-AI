import { useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Home,
  Menu,
  MessageSquare,
  Settings,
  Ticket,
  UserCircle2,
  X,
} from 'lucide-react'
import { useAuth } from '../context/useAuth.js'

const STATUS_KEY = 'nexdesk_agent_status'

export default function AppLayout({ title, children }) {
  const { user } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [agentStatus, setAgentStatus] = useState(() => localStorage.getItem(STATUS_KEY) || 'Online')

  const isStaff = user?.role === 'agent' || user?.role === 'admin'

  const navItems = useMemo(() => {
    if (isStaff) {
      return [
        { label: 'Dashboard', to: '/app', icon: Home },
        { label: 'Active Chats', to: '/app/agent', icon: MessageSquare },
        { label: 'Tickets', to: '/app/agent', icon: Ticket },
        { label: 'Analytics', to: '/app/analytics', icon: BarChart3 },
      ]
    }

    return [
      { label: 'Dashboard', to: '/app', icon: Home },
      { label: 'Active Chats', to: '/app/my-tickets', icon: MessageSquare },
      { label: 'Tickets', to: '/app/my-tickets', icon: Ticket },
    ]
  }, [isStaff])

  const switchStatus = () => {
    const next = agentStatus === 'Online' ? 'Busy' : 'Online'
    setAgentStatus(next)
    localStorage.setItem(STATUS_KEY, next)
  }

  const pageTitle =
    title ||
    [...navItems]
      .sort((a, b) => b.to.length - a.to.length)
      .find((item) => location.pathname.startsWith(item.to))?.label ||
    'Workspace'

  return (
    <div className="app-layout">
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="app-sidebar-top">
          <Link to="/app" className="app-logo">
            <span className="app-logo-mark">NX</span>
            <span>
              <strong>NexDesk AI</strong>
              <small>Agent Helpdesk</small>
            </span>
          </Link>
          <button
            type="button"
            className="app-sidebar-close"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="app-nav" aria-label="App navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="app-sidebar-bottom">
          <div className="app-user-pill">
            <UserCircle2 size={18} />
            <div>
              <strong>{user?.name || 'User'}</strong>
              <small>{user?.role || 'customer'}</small>
            </div>
          </div>

          <NavLink to="/app/support" className="app-nav-link app-nav-settings" onClick={() => setSidebarOpen(false)}>
            <Settings size={16} />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>

      <div className="app-main-shell">
        <header className="app-topbar">
          <div className="app-topbar-left">
            <button
              type="button"
              className="app-menu-btn"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <h1>{pageTitle}</h1>
          </div>

          {isStaff ? (
            <button type="button" className={`agent-status-pill ${agentStatus.toLowerCase()}`} onClick={switchStatus}>
              <span className="dot" aria-hidden="true" />
              Agent Status: {agentStatus}
            </button>
          ) : null}
        </header>

        <div className="app-main-content">{children}</div>
      </div>

      {sidebarOpen ? <button className="app-sidebar-overlay" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} /> : null}
    </div>
  )
}
