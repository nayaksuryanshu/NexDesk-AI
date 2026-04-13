import { Bot } from 'lucide-react'
import SourceBadge from './SourceBadge.jsx'
import { formatMetadataTooltip, formatTimestamp } from '../utils/messageFormatter.js'

const roleLabel = {
  customer: 'Customer',
  agent: 'Support Agent',
  ai: 'AI Assistant',
}

export default function MessageBubble({ message, grouped }) {
  const isAI = message?.role === 'ai' || message?.isAI
  const isSystemByRole = message?.role === 'system' || message?.type === 'system'
  const isHandoffNotice = /human agent joined|handoff|escalat/i.test(message?.content || '')
  const isSystem = isSystemByRole || isHandoffNotice || message?.metadata?.type === 'handoff'
  const isHumanAgent = message?.role === 'agent'
  const isCustomer = message?.role === 'customer'
  const tooltip = formatMetadataTooltip(message?.metadata)
  const uniqueSources = Array.from(new Set(message?.metadata?.sources || []))

  if (isSystem) {
    return (
      <div className="message-bubble message-bubble--system">
        <span className="message-bubble__rule" />
        <span className="message-bubble__system-label">
          {message?.content || 'Human Agent joined the chat'}
        </span>
        <span className="message-bubble__rule" />
      </div>
    )
  }

  return (
    <article
      className={`message-bubble ${isCustomer ? 'message-bubble--customer' : ''} ${isAI ? 'message-bubble--ai' : ''} ${isHumanAgent ? 'message-bubble--human' : ''}`}
      title={tooltip || undefined}
    >
      {isAI ? (
        <span className="message-bubble__icon">
          <Bot size={14} />
        </span>
      ) : null}

      <div
        className={[
          'message-bubble__panel',
          isCustomer ? 'message-bubble__panel--customer' : '',
          isAI ? 'message-bubble__panel--ai' : '',
          isHumanAgent ? 'message-bubble__panel--human' : '',
        ].join(' ')}
      >
        {!grouped ? (
          <header className="message-bubble__head">
            <span className="message-bubble__sender">
              {isHumanAgent ? <span className="rounded-full border border-teal-400/40 px-1.5 py-0.5 text-[9px] text-teal-200">H</span> : null}
              {roleLabel[message?.role] || message?.sender || 'User'}
            </span>
            <time dateTime={message?.timestamp} className="message-bubble__time">
              {formatTimestamp(message?.timestamp)}
            </time>
          </header>
        ) : null}

        <p className="message-bubble__content">{message?.content}</p>

        {isAI && uniqueSources.length ? (
          <div className="message-bubble__sources">
            {uniqueSources.map((source) => (
              <SourceBadge key={`${message._id || message.timestamp}-${source}`} source={source} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}
