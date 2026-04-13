import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
            <span className="eyebrow">New account</span>
            <h1>Start with a clean slate.</h1>
            <p>Create an account to explore the protected workspace.</p>
          </div>
        </div>

        <div>
          <div className="network-lines">
            <div className="network-line" />
            <span className="network-node" />
            <span className="network-node" />
            <span className="network-node" />
            <span className="network-node" />
          </div>
          <div className="testimonial">
            <p style={{ color: '#dbeafe' }}>Create an account and land directly inside the product shell.</p>
            <div className="muted" style={{ marginTop: '12px' }}>Account setup</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
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
      await register(formData)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create your account right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <AuthVisual />

      <section className="auth-form-panel">
        <div className="auth-card">
          <span className="eyebrow">Create account</span>
          <h2>Book your demo access.</h2>
          <p className="muted">Create a customer account to enter the app.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Name</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Ava Patel"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

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
                autoComplete="new-password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>Role</span>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            {error ? <div className="error-banner">{error}</div> : null}
            {message ? <div className="success-banner">{message}</div> : null}

            <button className="button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>

            <div className="social-auth">
              <button type="button" className="social-button" onClick={() => setMessage('Google sign-up is not configured yet.')}>Continue with Google</button>
              <button type="button" className="social-button" onClick={() => setMessage('GitHub sign-up is not configured yet.')}>Continue with GitHub</button>
            </div>

            <div className="form-footer">
              <span className="muted">Already have an account?</span>
              <Link to="/login" className="text-link">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}