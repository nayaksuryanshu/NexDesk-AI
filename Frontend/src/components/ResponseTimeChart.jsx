export default function ResponseTimeChart({ aiMinutes = 0, humanMinutes = 0 }) {
  const max = Math.max(aiMinutes, humanMinutes, 1)

  return (
    <section className="support-panel analytics-chart-panel">
      <div className="panel-head">
        <div>
          <span className="eyebrow">Response Time</span>
          <h2>First response comparison</h2>
        </div>
      </div>

      <div className="response-chart">
        <div className="response-row">
          <span>AI</span>
          <div className="response-track">
            <div className="response-fill ai" style={{ width: `${Math.round((aiMinutes / max) * 100)}%` }} />
          </div>
          <strong>{aiMinutes} min</strong>
        </div>

        <div className="response-row">
          <span>Human</span>
          <div className="response-track">
            <div className="response-fill human" style={{ width: `${Math.round((humanMinutes / max) * 100)}%` }} />
          </div>
          <strong>{humanMinutes} min</strong>
        </div>
      </div>
    </section>
  )
}
