import { Bot } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <div className="typing-indicator" role="status" aria-live="polite">
      <span className="typing-indicator__icon">
        <Bot size={13} />
      </span>
      <div className="typing-indicator__dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="typing-indicator__label">AI is typing...</p>
    </div>
  )
}
