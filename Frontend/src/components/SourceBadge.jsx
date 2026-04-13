import { formatSourceLabel } from '../utils/messageFormatter.js'

export default function SourceBadge({ source }) {
  if (!source) return null

  return (
    <button type="button" className="source-badge" title={source}>
      {formatSourceLabel(source)}
    </button>
  )
}
