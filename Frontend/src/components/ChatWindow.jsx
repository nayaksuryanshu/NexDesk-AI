import { useEffect, useMemo, useRef } from 'react'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import AIErrorAlert from './AIErrorAlert.jsx'

const dayLabel = (timestamp) => {
  if (!timestamp) {
    return 'Today'
  }

  const date = new Date(timestamp)
  const now = new Date()

  if (date.toDateString() === now.toDateString()) {
    return 'Today'
  }

  return date.toLocaleDateString()
}

export default function ChatWindow({ messages, aiTyping, aiError, historyLoading, onDismissAiError }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, aiTyping])

  const groupedMessages = useMemo(
    () =>
      messages.map((message, index) => {
        const prev = messages[index - 1]
        const grouped = prev && prev.sender === message.sender && prev.role === message.role
        return { message, grouped }
      }),
    [messages],
  )

  const stickyLabel = dayLabel(messages[messages.length - 1]?.timestamp)

  return (
    <section className="chat-window">
      {aiError ? <AIErrorAlert message={aiError} onDismiss={onDismissAiError} /> : null}

      <div className="chat-window__messages">
        <div className="chat-window__date-chip">
          <span>
            {stickyLabel}
          </span>
        </div>

        <div className="chat-window__stack">
          {historyLoading ? (
            <div className="chat-window__loading">
              Loading chat history...
            </div>
          ) : null}

          {messages.length === 0 && !aiTyping && !historyLoading ? (
            <div className="chat-empty-state">
              <strong className="text-slate-100">No messages yet</strong>
              <p className="mt-1 text-sm text-slate-400">Start chatting on this ticket to build a conversation history.</p>
            </div>
          ) : null}

          {groupedMessages.map(({ message, grouped }) => (
            <MessageBubble key={message._id || `${message.timestamp}-${message.content}`} message={message} grouped={grouped} />
          ))}

          {aiTyping ? <TypingIndicator /> : null}

          <div ref={bottomRef} />
        </div>
      </div>
    </section>
  )
}
