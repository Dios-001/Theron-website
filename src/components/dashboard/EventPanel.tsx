import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { agoLabel, cameraById, CATEGORY_META, formatTimestamp, TYPES, type DetectionEvent, type Status } from '../../data/events'
import { Scene } from '../visuals/scenes'
import { SeverityBadge } from './parts'

const STATUSES: Status[] = ['Open', 'Escalated', 'Reviewed', 'Dismissed']

interface Props {
  event: DetectionEvent | null
  onClose: () => void
  onStatus: (id: string, status: Status) => void
}

function Body({ event, onClose, onStatus }: { event: DetectionEvent; onClose: () => void; onStatus: Props['onStatus'] }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const cam = cameraById(event.cameraId)
  const t = TYPES[event.type]
  const scene = t.scene === 'camera' ? cam.scene : t.scene

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [onClose])

  const rows: Array<[string, string]> = [
    ['Event ID', event.id],
    ['Detected', `${formatTimestamp(event.ts)} (${agoLabel(event.minutesAgo)})`],
    ['Camera', `${cam.code} · ${cam.name}`],
    ['Site', cam.site],
    ['Solution', CATEGORY_META[t.category].solution],
  ]

  return (
    <div className="fixed inset-0 z-[70]">
      <motion.button type="button" aria-label="Close event details" tabIndex={-1} className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto border-l border-line-strong bg-panel shadow-2xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="flex items-start justify-between gap-4 p-5 pb-4">
          <div>
            <h3 id="event-title" className="text-xl">
              {t.label}
            </h3>
            <div className="mt-2 flex items-center gap-3 text-sm text-fg-2">
              <SeverityBadge severity={t.severity} />
              Sample event
            </div>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close event details" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line-strong hover:border-lime">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="relative aspect-video border-y border-line">
          <Scene kind={scene} label={`Simulated snapshot for ${t.label}`} />
          <span className="absolute bottom-2 left-2 rounded-sm bg-ink/85 px-2 py-1 text-xs font-bold">Simulated snapshot</span>
        </div>

        <div className="p-5">
          <p className="text-[0.9375rem] leading-relaxed text-fg-2">{t.description}</p>
          <dl className="m-0 mt-5 grid gap-3 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-fg-3">{k}</dt>
                <dd className="m-0 text-right font-bold">{v}</dd>
              </div>
            ))}
          </dl>

          <h4 className="mt-7 text-sm font-bold">Review status</h4>
          <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Review status">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={event.status === s}
                onClick={() => onStatus(event.id, s)}
                className={`h-10 rounded-sm border text-sm font-bold transition-colors ${event.status === s ? 'border-lime bg-lime/15 text-lime' : 'border-line-strong text-fg hover:border-lime/60'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-fg-3">Changes apply to this demo session only.</p>
        </div>
      </motion.aside>
    </div>
  )
}

export function EventPanel({ event, onClose, onStatus }: Props) {
  return <AnimatePresence>{event && <Body key={event.id} event={event} onClose={onClose} onStatus={onStatus} />}</AnimatePresence>
}
