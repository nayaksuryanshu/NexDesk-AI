import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

const navItems = [
  { label: 'Features', to: '/features' },
]

function LogoMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 1.75L14.5 5v8L9 16.25 3.5 13V5L9 1.75Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M6.1 7.1h5.8M6.1 9h3.2M6.1 10.9h4.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const { ready, isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary">
        <Link to="/" className="brand">
          <LogoMark />
          <span>NexDesk AI</span>
        </Link>

        <div className="site-links">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="site-actions">
          {!ready ? null : isAuthenticated ? (
            <>
              <Link to="/app" className="profile-pill" title={user?.email || 'Authenticated user'}>
                <span className="profile-avatar" aria-hidden="true">
                  {(user?.name || 'U').trim().charAt(0).toUpperCase()}
                </span>
                <span className="profile-copy">
                  <strong>{user?.name || 'User'}</strong>
                </span>
              </Link>
              <button type="button" className="button-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-link">
                Login
              </Link>
              <Link to="/register" className="button">
                Create Account
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}