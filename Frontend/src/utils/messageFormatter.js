export function formatTimestamp(value) {
  if (!value) return ''

  const date = new Date(value)
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function collapseRepeatedPattern(value) {
  for (let size = 1; size <= Math.floor(value.length / 2); size += 1) {
    if (value.length % size !== 0) {
      continue
    }

    const pattern = value.slice(0, size)
    if (pattern.repeat(value.length / size) === value) {
      return pattern
    }
  }

  return value
}

export function formatSourceLabel(source) {
  if (!source) return 'Source'

  const clean = source.split(/[\\/]/).pop() || source
  const withoutExt = clean.replace(/\.[^.]+$/, '')
  const collapsed = collapseRepeatedPattern(withoutExt)
  const label = collapsed
    .replace(/[-_.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase())

  return label.length > 20 ? `${label.slice(0, 20)}...` : label
}

export function formatMetadataTooltip(metadata) {
  if (!metadata) return ''

  const parts = []
  if (metadata.model) parts.push(`Model: ${metadata.model}`)
  if (typeof metadata.tokensUsed === 'number') parts.push(`Tokens: ${metadata.tokensUsed}`)

  return parts.join(' | ')
}
