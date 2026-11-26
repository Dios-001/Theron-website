import { WifiOff } from 'lucide-react'
import type { ReactNode } from 'react'
import { CATEGORY_META, agoLabel, TYPES, type Camera, type Category, type DetectionEvent, type Severity, type Status } from '../../data/events'
import { useCountUp } from '../../lib/hooks'
import { Scene } from '../visuals/scenes'

export function Panel({ title, aside, flush, children }: { title: string; aside?: ReactNode; flush?: boolean; children: ReactNode }) {
  return (
    <section className="panel min-w-0" aria-label={title}>
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-3.5">
        <h3 className="text-[0.9375rem] tracking-tight">{title}</h3>
        {aside}
      </header>
      <div className={flush ? '' : 'p-4'}>{children}</div>
    </section>
  )
}

const SEV: Record<Severity, string> = {
  High: 'border-danger/50 bg-danger/10 text-danger',
  Medium: 'border-amber/50 bg-amber/10 text-amber',
  Low: 'border-cyan/50 bg-cyan/10 text-cyan',
}
export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`inline-block rounded-sm border px-2 py-0.5 text-xs font-bold ${SEV[severity]}`}>{severity}</span>
}

const STATUS_DOT: Record<Status, string> = { Open: 'bg-fg-2', Escalated: 'bg-danger', Reviewed: 'bg-lime', Dismissed: 'bg-fg-3' }
export function StatusLabel({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold">
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
      {status}
    </span>
  )
}

export function Legend({ categories }: { categories: Category[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-xs text-fg-2">
      {categories.map((c) => (
        <li key={c} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_META[c].color }} aria-hidden="true" />
          {CATEGORY_META[c].label}
        </li>
      ))}
    </ul>
  )
}

export function CountUp({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const shown = useCountUp(value)
  return (
    <span aria-label={`${value.toFixed(decimals)}${suffix}`}>
      <span aria-hidden="true">
        {shown.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  )
}

export function KpiCard({ label, value, note, tone }: { label: string; value: ReactNode; note: string; tone?: 'lime' | 'danger' }) {
  return (
    <div className="panel min-w-0 p-4">
      <p className="text-sm font-semibold text-fg-2">{label}</p>
      <p className={`mt-2 text-3xl font-extrabold tabular-nums tracking-tight ${tone === 'lime' ? 'text-lime' : tone === 'danger' ? 'text-danger' : 'text-fg'}`}>{value}</p>
      <p className="mt-1 text-xs text-fg-3">{note}</p>
    </div>
  )
}

export function CameraTile({ camera, last, time, onOpen }: { camera: Camera; last?: DetectionEvent; time: string; onOpen: (id: string) => void }) {
  const clickable = camera.online && !!last
  const inner = (
    <>
      <div className="relative aspect-video overflow-hidden bg-ink">
        {camera.online ? <Scene kind={camera.scene} label={`Simulated view from ${camera.code}, ${camera.name}`} /> : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-fg-3">
            <WifiOff size={22} aria-hidden="true" />
            <span className="text-sm font-semibold">No signal</span>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-ink/90 to-transparent p-2 text-xs font-bold">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${camera.online ? 'bg-lime' : 'bg-danger'}`} aria-hidden="true" />
            <span className="truncate">
              {camera.code} · {camera.name}
            </span>
            <span className="sr-only">{camera.online ? 'online' : 'offline'}</span>
          </span>
          <span className="shrink-0 tabular-nums text-fg-2">{camera.online ? time : 'Offline'}</span>
        </div>
        {camera.online && last && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-ink/90 to-transparent p-2 text-xs font-bold">
            <span className="truncate rounded-sm bg-ink/80 px-1.5 py-0.5">{TYPES[last.type].label}</span>
            <span className="shrink-0 text-fg-2">{agoLabel(last.minutesAgo)}</span>
          </div>
        )}
      </div>
    </>
  )
  const cls = 'block w-full overflow-hidden rounded-sm border border-line text-left transition-colors'
  return clickable ? (
    <button type="button" className={`${cls} hover:border-lime/50`} onClick={() => onOpen(last.id)} aria-label={`${camera.code} ${camera.name}. Open latest event: ${TYPES[last.type].label}`}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  )
}
