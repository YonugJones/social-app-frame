export function getInitials(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return '?'

  return trimmed
    .split(/\s+/)
    .map((n) => n[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
