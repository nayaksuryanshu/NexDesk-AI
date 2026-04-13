export default function VolumeChart({ series = [] }) {
  const max = Math.max(...series.map((item) => item.count), 1)

  return (
    <section className="support-panel analytics-chart-panel">
      <div className="panel-head">
        <div>
          <span className="eyebrow">Ticket Volume</span>
          <h2>Daily trend</h2>
        </div>
      </div>

      <div className="volume-chart">
        {series.map((item) => (
          <div className="volume-bar-wrap" key={item.date}>
            <div className="volume-bar" style={{ height: `${Math.max(8, Math.round((item.count / max) * 140))}px` }} title={`${item.date}: ${item.count}`} />
            <small>{item.date.slice(5)}</small>
          </div>
        ))}
      </div>
    </section>
  )
}
