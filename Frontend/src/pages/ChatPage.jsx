import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, FileText, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import ChatWindow from '../components/ChatWindow.jsx'
import ChatInput from '../components/ChatInput.jsx'
import HandoffButton from '../components/HandoffButton.jsx'
import AgentNotification from '../components/AgentNotification.jsx'
import AppLayout from '../components/AppLayout.jsx'
import { ChatProvider } from '../context/ChatContext.jsx'
import { useChat } from '../context/useChat.js'
import { useAuth } from '../context/useAuth.js'
import { ticketService } from '../services/ticketService.js'
import { formatSourceLabel } from '../utils/messageFormatter.js'
import '../styles/ChatStyles.css'

const truncate = (value, max) => {
  if (!value) return ''
  if (value.length <= max) return value
  return `${value.slice(0, max)}...`
}

function ChatContent({ currentUser }) {
  const { id: selectedTicketId } = useParams()
  const navigate = useNavigate()
  const { messages, aiTyping, aiError, historyLoading, historyError, sendMessage, dismissAIError } = useChat()
  const [tickets, setTickets] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [sessionsError, setSessionsError] = useState('')
  const [customerTyping, setCustomerTyping] = useState(false)
  const [showContextPanel, setShowContextPanel] = useState(true)

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setSessionsError('')
        setLoadingSessions(true)
        const data = await ticketService.getTickets()
        setTickets(data)
      } catch (err) {
        setSessionsError(err.response?.data?.message || 'Unable to load active sessions.')
      } finally {
        setLoadingSessions(false)
      }
    }

    loadSessions()
  }, [])

  const ticketSessions = useMemo(
    () => [...tickets].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)),
    [tickets],
  )

  const ragSources = useMemo(() => {
    let aiSnippet = 'Context used to ground the current response.'

    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const message = messages[index]
      if ((message?.role === 'ai' || message?.isAI) && message?.metadata?.sources?.length) {
        if (message.content) {
          aiSnippet = truncate(message.content, 120)
        }

        return Array.from(new Set(message.metadata.sources || [])).map((source) => ({
          source,
          label: formatSourceLabel(source),
          snippet: aiSnippet,
        }))
      }
    }

    return ['company-faq.txt', 'support-policies.txt', 'product-docs.md'].map((source) => ({
      source,
      label: formatSourceLabel(source),
      snippet: aiSnippet,
    }))
  }, [messages])

  const handleSendMessage = (value) => {
    setCustomerTyping(true)
    sendMessage(value)
    setTimeout(() => setCustomerTyping(false), 1200)
  }

  return (
    <main className="app-chat-page">
      <section className={`chat-ops-grid ${showContextPanel ? 'chat-ops-grid--split' : 'chat-ops-grid--full'}`}>
        <div className="chat-sessions-panel">
          <header className="chat-ops-head">
            <div className="chat-ops-title">
              <p className="chat-kicker">Active Conversation</p>
              <div className="chat-title-row">
                <h2>Ticket #{selectedTicketId?.slice(-6)?.toUpperCase()}</h2>
                <span className="chat-live-pill">Live</span>
              </div>
            </div>

            <button type="button" className="chat-toggle-button" onClick={() => setShowContextPanel((current) => !current)}>
              {showContextPanel ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
              {showContextPanel ? 'Hide context' : 'Show context'}
            </button>
          </header>

          <div className="chat-ticket-strip">
            <button
              type="button"
              className="chat-nav-button"
              onClick={() => {
                const currentIndex = ticketSessions.findIndex((ticket) => ticket._id === selectedTicketId)
                if (currentIndex > 0) {
                  navigate(`/app/tickets/${ticketSessions[currentIndex - 1]._id}/chat`)
                }
              }}
              disabled={ticketSessions.findIndex((ticket) => ticket._id === selectedTicketId) <= 0}
            >
              <ChevronLeft size={14} />
            </button>

            <div className="relative min-w-0 flex-1">
              <select
                className="chat-ticket-select"
                value={selectedTicketId}
                onChange={(event) => navigate(`/app/tickets/${event.target.value}/chat`)}
              >
                {ticketSessions.map((ticket) => (
                  <option key={ticket._id} value={ticket._id}>
                    {truncate(ticket.title, 64)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="chat-nav-button"
              onClick={() => {
                const currentIndex = ticketSessions.findIndex((ticket) => ticket._id === selectedTicketId)
                if (currentIndex >= 0 && currentIndex < ticketSessions.length - 1) {
                  navigate(`/app/tickets/${ticketSessions[currentIndex + 1]._id}/chat`)
                }
              }}
              disabled={
                ticketSessions.findIndex((ticket) => ticket._id === selectedTicketId) === -1 ||
                ticketSessions.findIndex((ticket) => ticket._id === selectedTicketId) >= ticketSessions.length - 1
              }
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="chat-status-strip">
            <span>{loadingSessions ? 'Loading ticket chats...' : `${ticketSessions.length} ticket chat(s)`}</span>
            {sessionsError ? <span className="chat-status-error">{sessionsError}</span> : null}
            {aiTyping ? <span className="chat-status-ai">AI is typing...</span> : null}
            {customerTyping ? <span className="chat-status-customer">Customer is typing...</span> : null}
          </div>

          <div className="chat-conversation-shell">
            {historyError ? <div className="chat-history-error">{historyError}</div> : null}
            <ChatWindow
              messages={messages}
              aiTyping={aiTyping}
              aiError={aiError}
              historyLoading={historyLoading}
              onDismissAiError={dismissAIError}
            />
          </div>

          <ChatInput onSend={handleSendMessage} aiTyping={aiTyping} />
        </div>

        {showContextPanel ? (
          <aside className="chat-context-panel">
            <div className="chat-context-head">
              <div className="chat-context-heading">
                <div>
                  <h3>RAG Context Panel</h3>
                  <p>Source documents used in the latest AI answer</p>
                </div>
                <span className="chat-context-pill">
                  Sources
                </span>
              </div>
            </div>

            <div className="chat-context-body">
              <HandoffButton ticketId={selectedTicketId} customerName={currentUser?.name || null} />
              <AgentNotification role={currentUser?.role} inline />

              <div className="rag-panel">
                <p className="rag-panel__label">Source Documents</p>
                {ragSources.map((item) => (
                  <article
                    key={item.source}
                    className="rag-card"
                  >
                    <div className="rag-card__row">
                      <span className="rag-card__icon">
                        <FileText size={14} />
                      </span>
                      <div className="rag-card__body">
                        <p className="rag-card__title">{item.label}</p>
                        <p className="rag-card__snippet">{truncate(item.snippet, 120)}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        ) : null}
      </section>
    </main>
  )
}

export default function ChatPage() {
  const { id: selectedTicketId } = useParams()
  const { user } = useAuth()

  return (
    <AppLayout title="Active Chats">
      <ChatProvider ticketId={selectedTicketId} currentUser={user}>
        <ChatContent currentUser={user} />
      </ChatProvider>
    </AppLayout>
  )
}
