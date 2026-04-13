export default function AIErrorAlert({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="ai-error-alert" role="alert">
      <div>
        <strong>AI assistant is temporarily unavailable.</strong>
        <p>{message}</p>
        <p>Please continue with a human support agent for urgent issues.</p>
      </div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss AI error">
        Dismiss
      </button>
    </div>
  )
}
