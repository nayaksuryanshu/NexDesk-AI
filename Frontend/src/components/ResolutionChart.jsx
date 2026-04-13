export default function ResolutionChart({ aiResolved = 0, humanResolved = 0 }) {
  const total = aiResolved + humanResolved
  const aiPercent = total > 0 ? Math.round((aiResolved / total) * 100) : 0
  const humanPercent = total > 0 ? 100 - aiPercent : 0

  return (
    <section className="support-panel analytics-chart-panel">
      <div className="panel-head">
        <div>
          <span className="eyebrow">Resolution Breakdown</span>
          <h2>AI vs Human resolved</h2>
        </div>
      </div>

      <div className="resolution-chart">
        <div className="resolution-track">
          <div className="resolution-ai" style={{ width: `${aiPercent}%` }} />
          <div className="resolution-human" style={{ width: `${humanPercent}%` }} />
        </div>
        <div className="resolution-legend">
          <span>AI: {aiResolved}</span>
          <span>Human: {humanResolved}</span>
          <span>Total: {total}</span>
        </div>
      </div>
    </section>
  )
}
