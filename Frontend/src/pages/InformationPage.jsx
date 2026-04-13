import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/useAuth.js'

export default function InformationPage({ eyebrow, title, description, highlights = [], ctaPrimary, ctaSecondary, stats = [] }) {
  const { isAuthenticated } = useAuth()
  const hidePrimaryCTA = isAuthenticated && ctaPrimary?.label?.toLowerCase() === 'create account'

  return (
    <div className="page">
      <Navbar />

      <main className="info-page">
        <section className="info-hero">
          <div className="info-copy">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>

            <div className="hero-actions">
              {ctaPrimary && !hidePrimaryCTA ? (
                <Link className="button" to={ctaPrimary.href}>
                  {ctaPrimary.label}
                </Link>
              ) : null}
              {ctaSecondary ? (
                <Link className="button-ghost" to={ctaSecondary.href}>
                  {ctaSecondary.label}
                </Link>
              ) : null}
            </div>
          </div>

          <aside className="info-aside">
            <div className="info-panel">
              <h2>At a glance</h2>
              <p>Focused product notes with one clear next step.</p>
            </div>
            <div className="info-list">
              {stats.map((stat) => (
                <div className="info-stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="info-grid">
          {highlights.map((item) => (
            <article className="info-card" key={item.title}>
              {item.icon ? (
                <div className="feature-icon" aria-hidden="true">
                  {item.icon}
                </div>
              ) : null}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}
