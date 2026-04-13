export default function StatCard({ label, value, trend, icon }) {
  return (
    <article className="dashboard-mini-card analytics-stat-card">
      <div className="analytics-stat-head">
        <span>{icon || '•'}</span>
        <small>{label}</small>
      </div>
      <strong className="analytics-stat-value">{value}</strong>
      {trend ? <span className="analytics-stat-trend">{trend}</span> : null}
    </article>
  )
}
