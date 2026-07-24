const STYLES = {
  low: 'text-console-muted',
  medium: 'text-signal-amber',
  high: 'text-rose-400',
}

const BARS = {
  low: 1,
  medium: 2,
  high: 3,
}

export default function PriorityTag({ priority }) {
  const active = BARS[priority] || 1
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[12px] ${STYLES[priority] || STYLES.low}`}>
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={`w-1 rounded-sm ${bar <= active ? 'bg-current' : 'bg-current/20'}`}
            style={{ height: `${bar * 3 + 3}px` }}
          />
        ))}
      </span>
      <span className="capitalize">{priority}</span>
    </span>
  )
}
