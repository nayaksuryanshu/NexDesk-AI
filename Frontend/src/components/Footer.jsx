import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

const productLinks = [
  { label: 'Features', to: '/features' },
  { label: 'Integrations', to: '/integrations' },
  { label: 'Changelog', to: '/changelog' },
]

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
]

export default function Footer() {
  const { isAuthenticated } = useAuth()

  return (
    <footer className="footer" id="site-footer">
      <div className="footer-card">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand-small">
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
              <span>NexDesk AI</span>
            </Link>
            <p className="footer-copy" style={{ marginTop: '14px' }}>A focused support experience for modern teams.</p>
          </div>

          <div>
            <h4>Product</h4>
            <div className="footer-links product-links">
              {productLinks.map((link) => (
                <Link key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>Company</h4>
            <div className="footer-links company-links">
              {companyLinks.map((link) => (
                <Link key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>Resources</h4>
            <div className="footer-links company-links">
              <Link to="/app/support">Support desk</Link>
              {!isAuthenticated ? <Link to="/login">Sign in</Link> : null}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 NexDesk AI.</span>
          <span>Built for support teams that need speed and clarity.</span>
        </div>
      </div>
    </footer>
  )
}