const STYLES = {
  open: 'bg-amber-400/15 text-amber-300 ring-amber-400/30',
  'in progress': 'bg-sky-400/15 text-sky-300 ring-sky-400/30',
  resolved: 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30',
  closed: 'bg-slate-400/15 text-slate-300 ring-slate-400/30',
}

const DOT = {
  open: 'bg-amber-400',
  'in progress': 'bg-sky-400',
  resolved: 'bg-emerald-400',
  closed: 'bg-slate-400',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider ring-1 ring-inset ${
        STYLES[status] || STYLES.open
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status] || DOT.open}`} />
      {status}
    </span>
  )
}
