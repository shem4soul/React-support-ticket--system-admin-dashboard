import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchTickets, updateTicketStatus } from '../lib/api.js'
import StatusBadge from '../components/StatusBadge.jsx'
import PriorityTag from '../components/PriorityTag.jsx'

const STATUSES = ['open', 'in progress', 'resolved', 'closed']
const PRIORITIES = ['low', 'medium', 'high']

const NEXT_ACTIONS = {
  open: [
    { status: 'in progress', label: 'Mark in progress' },
    { status: 'closed', label: 'Close' },
  ],
  'in progress': [
    { status: 'resolved', label: 'Resolve' },
    { status: 'closed', label: 'Close' },
  ],
  resolved: [{ status: 'closed', label: 'Close' }],
  closed: [],
}

function formatDate(value) {
  const d = new Date(value)
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Dashboard() {
  const { session, logout } = useAuth()
  const [tickets, setTickets] = useState([])
  const [allTickets, setAllTickets] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [filtered, everything] = await Promise.all([
        fetchTickets({ status: statusFilter, priority: priorityFilter }),
        fetchTickets(),
      ])
      setTickets(filtered)
      setAllTickets(everything)
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not load tickets.')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, priorityFilter])

  useEffect(() => {
    load()
  }, [load])

  const counts = useMemo(() => {
    const base = { open: 0, 'in progress': 0, resolved: 0, closed: 0 }
    for (const t of allTickets) base[t.status] = (base[t.status] || 0) + 1
    return base
  }, [allTickets])

  async function handleStatusChange(ticket, status) {
    setOpenMenuId(null)
    setUpdatingId(ticket.id)
    const previous = tickets
    setTickets((rows) => rows.map((r) => (r.id === ticket.id ? { ...r, status } : r)))
    try {
      await updateTicketStatus(ticket.id, status)
      setAllTickets((rows) => rows.map((r) => (r.id === ticket.id ? { ...r, status } : r)))
      // If the active filter no longer matches this ticket, drop it from view
      if (statusFilter && statusFilter !== status) {
        setTickets((rows) => rows.filter((r) => r.id !== ticket.id))
      }
    } catch (err) {
      setTickets(previous)
      setError(err?.response?.data?.error || 'Could not update ticket status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-console-bg">
      <header className="sticky top-0 z-20 border-b border-console-border bg-console-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-signal-cyan/30 bg-signal-cyan/10 text-signal-cyan">
              <span className="h-2 w-2 animate-pulse rounded-full bg-signal-cyan" />
            </div>
            <div>
              <p className="font-display text-base font-semibold leading-tight text-console-text">
                Support Console
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-console-muted">
                Ticket queue
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden font-mono text-xs text-console-muted sm:block">
              {session?.admin?.username}
            </p>
            <button
              onClick={logout}
              className="rounded-lg border border-console-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-console-muted transition hover:border-rose-400/40 hover:text-rose-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* signal strip */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATUSES.map((s) => (
            <div
              key={s}
              className="rounded-xl border border-console-border bg-console-panel px-4 py-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-console-muted">
                {s}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-console-text">
                {counts[s] ?? 0}
              </p>
            </div>
          ))}
        </div>

        {/* filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUSES}
          />
          <FilterSelect
            label="Priority"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={PRIORITIES}
          />
          {(statusFilter || priorityFilter) && (
            <button
              onClick={() => {
                setStatusFilter('')
                setPriorityFilter('')
              }}
              className="font-mono text-[11px] uppercase tracking-wider text-console-muted underline decoration-dotted underline-offset-4 hover:text-console-text"
            >
              Clear filters
            </button>
          )}
          <span className="ml-auto font-mono text-[11px] text-console-muted">
            {loading ? 'Loading…' : `${tickets.length} ticket${tickets.length === 1 ? '' : 's'}`}
          </span>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 font-mono text-[12px] text-rose-300">
            {error}
          </p>
        )}

        {/* table */}
        <div className="overflow-hidden rounded-2xl border border-console-border bg-console-panel">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-console-border font-mono text-[11px] uppercase tracking-[0.12em] text-console-muted">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {!loading && tickets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <p className="font-display text-sm text-console-muted">
                        No tickets match these filters.
                      </p>
                    </td>
                  </tr>
                )}
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-console-border/60 last:border-0 hover:bg-console-panel2/60"
                  >
                    <td className="px-5 py-4">
                      <p className="font-body text-sm font-medium text-console-text">{ticket.name}</p>
                      <p className="font-mono text-[11px] text-console-muted">
                        #{String(ticket.id).padStart(5, '0')} · {ticket.subject}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-body text-sm text-console-muted">{ticket.email}</td>
                    <td className="px-5 py-4">
                      <PriorityTag priority={ticket.priority} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-5 py-4 font-mono text-[12px] text-console-muted">
                      {formatDate(ticket.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === ticket.id ? null : ticket.id)}
                          disabled={updatingId === ticket.id || NEXT_ACTIONS[ticket.status].length === 0}
                          className="rounded-lg border border-console-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-console-text transition hover:border-signal-cyan/40 hover:text-signal-cyan disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {updatingId === ticket.id ? 'Updating…' : 'Update ▾'}
                        </button>
                        {openMenuId === ticket.id && (
                          <div className="absolute right-0 top-9 z-10 w-44 overflow-hidden rounded-lg border border-console-border bg-console-panel2 shadow-glow">
                            {NEXT_ACTIONS[ticket.status].map((action) => (
                              <button
                                key={action.status}
                                onClick={() => handleStatusChange(ticket, action.status)}
                                className="block w-full px-3.5 py-2.5 text-left font-mono text-[11px] uppercase tracking-wider text-console-text transition hover:bg-console-border/60"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-console-border bg-console-panel px-3 py-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-console-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-mono text-[12px] capitalize text-console-text focus:outline-none"
      >
        <option value="" className="bg-console-panel">
          All
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-console-panel capitalize">
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}
