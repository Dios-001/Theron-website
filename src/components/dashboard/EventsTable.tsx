import { SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cameraById, formatTimestamp, TYPES, type DetectionEvent } from '../../data/events'
import { SeverityBadge, StatusLabel } from './parts'

interface Props {
  events: DetectionEvent[]
  onOpen: (id: string) => void
  loading?: boolean
  pageSize?: number
  onClear?: () => void
}

export function EventsTable({ events, onOpen, loading, pageSize = 6, onClear }: Props) {
  const [limit, setLimit] = useState(pageSize)
  const sig = events.map((e) => e.id).join(',')
  useEffect(() => setLimit(pageSize), [sig, pageSize])

  if (loading) {
    return (
      <div role="status" aria-label="Loading events" className="grid gap-3 p-4">
        {Array.from({ length: Math.min(pageSize, 5) }).map((_, i) => (
          <div key={i} className="h-9 animate-pulse rounded-sm bg-line" />
        ))}
      </div>
    )
  }

  if (!events.length) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
        <SearchX size={28} className="text-fg-3" aria-hidden="true" />
        <p className="font-bold">No events match these filters.</p>
        <p className="max-w-sm text-sm text-fg-2">Widen the time range or clear the search and filters to see sample events again.</p>
        {onClear && (
          <button type="button" className="btn btn-ghost !h-10" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    )
  }

  const rows = events.slice(0, limit)
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">Recent detection events (sample data)</caption>
          <thead>
            <tr className="text-xs text-fg-3">
              {['Timestamp', 'Camera', 'Event type', 'Severity', 'Review status'].map((h) => (
                <th key={h} scope="col" className="whitespace-nowrap border-b border-line px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const t = TYPES[e.type]
              return (
                <tr key={e.id} onClick={() => onOpen(e.id)} className="cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-white/[0.035]">
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-fg-2">{formatTimestamp(e.ts)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-fg-2">{cameraById(e.cameraId).name}</td>
                  <td className="px-4 py-3">
                    <button type="button" className="rounded-sm text-left font-bold hover:text-lime" onClick={(ev) => { ev.stopPropagation(); onOpen(e.id) }} aria-label={`Open details for ${t.label}, ${cameraById(e.cameraId).name}`}>
                      {t.label}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={t.severity} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusLabel status={e.status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm text-fg-2">
        <span>
          Showing {rows.length} of {events.length}
        </span>
        {events.length > limit && (
          <button type="button" className="rounded-sm font-bold text-lime" onClick={() => setLimit((l) => l + pageSize)}>
            Show more
          </button>
        )}
      </div>
    </>
  )
}
