import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import SupportPage from './pages/SupportPage.jsx'
import InformationPage from './pages/InformationPage.jsx'
import AgentDashboard from './pages/AgentDashboard.jsx'
import TicketDetailPage from './pages/TicketDetailPage.jsx'
import CustomerTicketsPage from './pages/CustomerTicketsPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import AnalyticsDashboard from './pages/AnalyticsDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './App.css'

const marketingPages = {
  features: {
    eyebrow: 'Features',
    title: 'A support stack built for speed.',
    description: 'Routing, handoff, and analytics stay in one workspace.',
    ctaPrimary: { label: 'Create Account', href: '/register' },
    ctaSecondary: { label: 'Talk to Sales', href: '/contact' },
    stats: [
      { label: 'Coverage', value: '24/7' },
      { label: 'Resolution lift', value: '31%' },
    ],
    highlights: [
      {
        title: 'Grounded answers',
        description: 'Reply from policies and product docs.',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 5h10v14H7z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        title: 'Context-safe handoff',
        description: 'Move to a person without losing the thread.',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 12h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M11 8l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 7h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
  integrations: {
    eyebrow: 'Integrations',
    title: 'Connect the support workflow to the tools you already use.',
    description: 'The app is ready for CRM, identity, ticketing, and analytics integrations.',
    ctaPrimary: { label: 'Contact Us', href: '/contact' },
    ctaSecondary: { label: 'Explore Changelog', href: '/changelog' },
    stats: [
      { label: 'CRM', value: 'Ready' },
      { label: 'Ticketing', value: 'Ready' },
      { label: 'Identity', value: 'Ready' },
    ],
    highlights: [
      { title: 'CRM sync', description: 'Pipe account and ticket data into the right place.' },
      { title: 'Identity providers', description: 'Extend auth beyond local email and password login.' },
      { title: 'Analytics tools', description: 'Track support performance in the tools your team already uses.' },
    ],
  },
  changelog: {
    eyebrow: 'Changelog',
    title: 'Recent product updates.',
    description: 'Track the latest changes in the app shell and support desk experience.',
    ctaPrimary: { label: 'Back to Home', href: '/' },
    ctaSecondary: { label: 'Open Dashboard', href: '/app' },
    stats: [
      { label: 'Latest release', value: 'Apr 2026' },
      { label: 'Frontend', value: 'React + Vite' },
      { label: 'Backend', value: 'Express + MongoDB' },
    ],
    highlights: [
      { title: 'Landing refresh', description: 'Cleaner hero sections and a more focused visual language.' },
      { title: 'Auth flow', description: 'Login, registration, and session restore run through the backend.' },
      { title: 'Protected workspace', description: 'Customer support areas stay behind authentication.' },
    ],
  },
  about: {
    eyebrow: 'About',
    title: 'Support automation that stays calm to use.',
    description: 'NexDesk AI reduces repetitive work and keeps context intact during handoff.',
    ctaPrimary: { label: 'Register', href: '/register' },
    ctaSecondary: { label: 'Contact', href: '/contact' },
    stats: [
      { label: 'Mission', value: 'Remove friction' },
      { label: 'Focus', value: 'Support ops' },
      { label: 'Stack', value: 'AI + workflow' },
    ],
    highlights: [
      { title: 'Focused UX', description: 'A refined interface built for long sessions and clarity.' },
      { title: 'Workflow first', description: 'Each page follows the real API and auth states.' },
      { title: 'Ready to ship', description: 'Local development and production setup both work.' },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Reach out about onboarding or integrations.',
    description: 'This page gives visitors a real destination for questions and demo requests.',
    ctaPrimary: { label: 'Book Demo', href: '/register' },
    ctaSecondary: { label: 'Support Desk', href: '/app/support' },
    stats: [
      { label: 'Response', value: 'Same day' },
      { label: 'Demo', value: 'Scheduled' },
      { label: 'Launch', value: 'Guided' },
    ],
    highlights: [
      { title: 'Sales and implementation', description: 'Start with an evaluation and move into rollout.' },
      { title: 'Technical questions', description: 'Discuss auth, deployment, and API setup.' },
      { title: 'Support escalation', description: 'Route product issues into the support desk.' },
    ],
  },
  'privacy-policy': {
    eyebrow: 'Privacy Policy',
    title: 'A concise privacy page for the product site.',
    description: 'This placeholder route gives the footer link a real destination.',
    ctaPrimary: { label: 'Back Home', href: '/' },
    ctaSecondary: { label: 'Open Features', href: '/features' },
    stats: [
      { label: 'Stored data', value: 'Session only' },
      { label: 'Scope', value: 'Protected' },
      { label: 'Access', value: 'Controlled' },
    ],
    highlights: [
      { title: 'Session restore', description: 'The app keeps signed-in state across refreshes.' },
      { title: 'Auth requests', description: 'Authenticated requests include the current token.' },
      { title: 'Replace before launch', description: 'Swap this placeholder for legal copy before production.' },
    ],
  },
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/features" element={<InformationPage {...marketingPages.features} />} />
      <Route path="/integrations" element={<InformationPage {...marketingPages.integrations} />} />
      <Route path="/changelog" element={<InformationPage {...marketingPages.changelog} />} />
      <Route path="/about" element={<InformationPage {...marketingPages.about} />} />
      <Route path="/contact" element={<InformationPage {...marketingPages.contact} />} />
      <Route path="/privacy-policy" element={<InformationPage {...marketingPages['privacy-policy']} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/support"
        element={
          <ProtectedRoute>
            <SupportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/agent"
        element={
          <ProtectedRoute allowedRoles={['agent', 'admin']}>
            <AgentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/analytics"
        element={
          <ProtectedRoute allowedRoles={['agent', 'admin']}>
            <AnalyticsDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/my-tickets"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerTicketsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/tickets/:id"
        element={
          <ProtectedRoute>
            <TicketDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/tickets/:id/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
