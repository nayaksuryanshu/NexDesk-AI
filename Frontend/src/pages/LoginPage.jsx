import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function AuthVisual() {
  return (
    <section className="auth-visual">
      <div className="auth-visual-card">
        <div>
          <Link to="/" className="brand-small">
            <span className="brand-mark" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.75L14.5 5v8L9 16.25 3.5 13V5L9 1.75Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6.1 7.1h5.8M6.1 9h3.2M6.1 10.9h4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span>NexDesk AI</span>
          </Link>
          <div className="auth-copy" style={{ marginTop: '42px' }}>
            <span className="eyebrow">Secure access</span>
            <h1>Return to the workspace.</h1>
            <p>Sign in to resume tickets, chat, and support activity.</p>
          </div>
        </div>

        <div>
          <div className="abstract-shape" />
          <div className="testimonial">
            <p style={{ color: '#dbeafe' }}>Secure access, saved sessions, and a clean return to the app shell.</p>
            <div className="muted" style={{ marginTop: '12px' }}>Protected workspace</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/app'
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      await login(formData)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <AuthVisual />

      <section className="auth-form-panel">
        <div className="auth-card">
          <span className="eyebrow">Sign in</span>
          <h2>Welcome back.</h2>
          <p className="muted">Use your email and password to continue.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            {error ? <div className="error-banner">{error}</div> : null}
            {message ? <div className="success-banner">{message}</div> : null}

            <button className="button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="social-auth">
              <button type="button" className="social-button" onClick={() => setMessage('Google login is not configured yet.')}>Continue with Google</button>
              <button type="button" className="social-button" onClick={() => setMessage('GitHub login is not configured yet.')}>Continue with GitHub</button>
            </div>

            <div className="form-footer">
              <span className="muted">No account yet?</span>
              <Link to="/register" className="text-link">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}