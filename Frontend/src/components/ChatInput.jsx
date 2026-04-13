import { useEffect, useRef, useState } from 'react'
import { Paperclip, Send } from 'lucide-react'

export default function ChatInput({ onSend, aiTyping }) {
  const [value, setValue] = useState('')
  const [attachmentMessage, setAttachmentMessage] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`
  }, [value])

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = value.trim()
    if (!next) {
      return
    }

    onSend(next)
    setValue('')
    setAttachmentMessage('')
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <div className="chat-composer">
        <button
          type="button"
          className="chat-composer__action chat-composer__action--attach"
          disabled={aiTyping}
          onClick={() => setAttachmentMessage('Attachment upload will be connected in the next backend update.')}
          aria-label="Add attachment"
        >
          <Paperclip size={16} />
        </button>

        <div className="chat-composer__field">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Ask a question about this ticket..."
            rows={2}
            className="chat-input__textarea"
            disabled={aiTyping}
          />
          {attachmentMessage ? <span className="chat-input__note">{attachmentMessage}</span> : null}
        </div>

        <button type="submit" className="chat-composer__action chat-composer__action--send" disabled={aiTyping || !value.trim()} aria-label="Send message">
          <Send size={16} />
        </button>
      </div>
    </form>
  )
}
