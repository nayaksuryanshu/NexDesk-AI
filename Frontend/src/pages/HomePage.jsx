import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const features = [
  {
    title: 'Knowledge-first replies',
    description: 'Answer from your docs and policies before a message goes out.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M7 5h10v14H7z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Fast handoff',
    description: 'Move a conversation to the right teammate without losing context.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 12h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M11 8l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 7h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Live visibility',
    description: 'See response speed, queue health, and support volume in one place.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5 19V5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M5 19h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M8 15l3-3 3 2 4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function HomePage() {
  return (
    <div className="page">
      <Navbar />

      <main>
        <section className="hero">
          <div>
            <span className="eyebrow">AI support platform</span>
            <h1>AI customer support, from first reply to final resolution.</h1>
            <p>NexDesk AI helps teams answer faster, escalate smoothly, and stay in control of every ticket.</p>

            <div className="hero-actions">
              <Link className="button" to="/register">
                Get Started
              </Link>
              <Link className="button-ghost" to="/login">
                Sign In
              </Link>
            </div>

            <div className="hero-points">
              <div className="point-card">
                <strong>24/7</strong>
                <div className="small-copy">Always on support coverage</div>
              </div>
              <div className="point-card">
                <strong>31%</strong>
                <div className="small-copy">Faster first replies</div>
              </div>
              <div className="point-card">
                <strong>7d</strong>
                <div className="small-copy">Session restore window</div>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Product mockup">
            <div className="glow-orb one" />
            <div className="glow-orb two" />

            <div className="visual-stack">
              <div className="floating-card chat-card">
                <div className="chat-head">
                  <div>
                    <strong>NexDesk Assistant</strong>
                    <div className="chat-status">Live customer chat</div>
                  </div>
                  <span className="chip">AI</span>
                </div>

                <div className="message-list">
                  <div className="message user">I need to update my billing email and invoice address.</div>
                  <div className="message agent">I found your account, updated the billing profile, and sent the receipt to your inbox.</div>
                </div>
              </div>

              <div className="floating-card widget-card">
                <div className="widget-head">
                  <div>
                    <strong>Agent Workspace</strong>
                    <div className="muted">Current queue, response health, and escalation state</div>
                  </div>
                  <span className="tag">4 live</span>
                </div>

                <div className="widget-preview">
                  <div>
                    <p className="muted">Knowledge match confidence</p>
                    <strong style={{ fontSize: '1.8rem', color: '#f8fafc' }}>98.4%</strong>
                  </div>
                  <div className="icon-24" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M5 19V5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M5 19h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M8 15l3-3 3 2 4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-section" id="features">
          <div className="section-intro">
            <span className="eyebrow">Features</span>
            <h2>Built for the whole support flow.</h2>
            <p>Simple, focused tools for answering, escalating, and tracking customer work.</p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 style={{ marginTop: '18px', fontSize: '1.3rem' }}>{feature.title}</h3>
                <p className="feature-meta" style={{ marginTop: '10px' }}>{feature.description}</p>
              </article>
            ))}
          </div>

          <div className="preview-card" id="documentation">
            <div>
              <span className="eyebrow">Quick start</span>
              <h2>Set up the experience without touching the layout.</h2>
              <p>Register, sign in, and move straight into the protected app shell.</p>
            </div>

            <div className="preview-steps">
              <div className="step">
                <span className="step-number">1</span>
                <div>
                  <strong>Create an account</strong>
                  <div className="muted">Jump into the app shell in a few clicks.</div>
                </div>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <div>
                  <strong>Resume your session</strong>
                  <div className="muted">Return to the same workspace after refresh.</div>
                </div>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <div>
                  <strong>Open the dashboard</strong>
                  <div className="muted">Support, analytics, and chat are all in one place.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}