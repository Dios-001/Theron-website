import { Bell, ClipboardList, Download, FileText, LayoutGrid, ListChecks, PawPrint, HardHat, Search, Settings as SettingsIcon, Video } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CAMERAS,
  CATEGORY_META,
  EVENTS,
  RANGES,
  TYPES,
  agoLabel,
  cameraById,
  formatTimestamp,
  type Category,
  type DetectionEvent,
  type RangeKey,
  type Severity,
  type Status,
} from '../../data/events'
import { useClock } from '../../lib/hooks'
import type { DashboardTarget } from '../../lib/nav'
import { EventPanel } from './EventPanel'
import { EventsTable } from './EventsTable'
import { EventsOverTime, TypeBreakdown } from './charts'
import { CameraTile, CountUp, KpiCard, Legend, Panel } from './parts'

type ViewKey = 'overview' | 'live' | 'events' | 'ppe' | 'animal' | 'rules' | 'reports' | 'settings'

const NAV: Array<{ key: ViewKey; label: string; icon: typeof LayoutGrid }> = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'live', label: 'Live Monitoring', icon: Video },
  { key: 'events', label: 'Detection Events', icon: ListChecks },
  { key: 'ppe', label: 'PPE Compliance', icon: HardHat },
  { key: 'animal', label: 'Animal Detection', icon: PawPrint },
  { key: 'rules', label: 'Rule Violations', icon: ClipboardList },
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
]
const VIEW_CATEGORY: Partial<Record<ViewKey, Category>> = { ppe: 'ppe', animal: 'animal', rules: 'rule' }
const ALL_CATEGORIES = Object.keys(CATEGORY_META) as Category[]

function toCsv(rows: string[][]) {
  return rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
}
function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

export default function Dashboard() {
  const time = useClock()
  const [view, setView] = useState<ViewKey>('overview')
  const [range, setRange] = useState<RangeKey>('24h')
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState<'All' | Severity>('All')
  const [status, setStatus] = useState<'All' | Status>('All')
  const [category, setCategory] = useState<'all' | Category>('all')
  const [events, setEvents] = useState<DetectionEvent[]>(EVENTS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [onlineOnly, setOnlineOnly] = useState(false)
  const first = useRef(true)

  // "Learn More" links elsewhere on the page switch this preview to a view.
  useEffect(() => {
    const on = (e: Event) => {
      const t = (e as CustomEvent<DashboardTarget>).detail
      if (NAV.some((n) => n.key === t.view)) setView(t.view as ViewKey)
      setCategory((t.category as Category) ?? 'all')
      setSeverity('All')
      setStatus('All')
      setQuery('')
    }
    window.addEventListener('theron:dashboard', on)
    return () => window.removeEventListener('theron:dashboard', on)
  }, [])

  // Brief loading state when the time range or view changes.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [range, view])

  useEffect(() => {
    if (!bellOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setBellOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [bellOpen])

  const forcedCategory = VIEW_CATEGORY[view]
  const activeCategory = forcedCategory ?? (category === 'all' ? null : category)

  const rangeEvents = useMemo(() => events.filter((e) => e.minutesAgo <= RANGES[range].minutes), [events, range])
  const scoped = useMemo(() => (forcedCategory ? rangeEvents.filter((e) => TYPES[e.type].category === forcedCategory) : rangeEvents), [rangeEvents, forcedCategory])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return scoped.filter((e) => {
      const t = TYPES[e.type]
      const cam = cameraById(e.cameraId)
      if (activeCategory && t.category !== activeCategory) return false
      if (severity !== 'All' && t.severity !== severity) return false
      if (status !== 'All' && e.status !== status) return false
      if (!q) return true
      return [t.label, cam.name, cam.code, t.severity, e.status, e.id, CATEGORY_META[t.category].label].some((s) => s.toLowerCase().includes(q))
    })
  }, [scoped, query, severity, status, activeCategory])

  const filtersActive = !!query || severity !== 'All' || status !== 'All' || (!forcedCategory && category !== 'all')
  const clearFilters = () => {
    setQuery('')
    setSeverity('All')
    setStatus('All')
    setCategory('all')
  }

  const online = CAMERAS.filter((c) => c.online).length
  const openAlerts = rangeEvents.filter((e) => e.status === 'Open' || e.status === 'Escalated').length
  const ppeCount = rangeEvents.filter((e) => TYPES[e.type].category === 'ppe').length
  const compliance = Math.max(80, 99.2 - ppeCount * 0.35)
  const bellEvents = rangeEvents.filter((e) => TYPES[e.type].severity === 'High' && e.status === 'Open')

  const selected = events.find((e) => e.id === selectedId) ?? null
  const close = useCallback(() => setSelectedId(null), [])
  const setEventStatus = (id: string, s: Status) => setEvents((list) => list.map((e) => (e.id === id ? { ...e, status: s } : e)))
  const lastFor = (camId: string) => rangeEvents.find((e) => e.cameraId === camId) ?? events.find((e) => e.cameraId === camId)

  const tiles = (list: typeof CAMERAS, cols: string) => (
    <div className={`grid gap-3 ${cols}`}>
      {list.map((c) => (
        <CameraTile key={c.id} camera={c} last={lastFor(c.id)} time={time} onOpen={setSelectedId} />
      ))}
    </div>
  )

  const filterBar = (showCategory: boolean) => (
    <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 text-sm">
      <label className="flex items-center gap-2 text-fg-2">
        Severity
        <select className="field !h-9 !w-auto" value={severity} onChange={(e) => setSeverity(e.target.value as 'All' | Severity)}>
          {['All', 'High', 'Medium', 'Low'].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-fg-2">
        Status
        <select className="field !h-9 !w-auto" value={status} onChange={(e) => setStatus(e.target.value as 'All' | Status)}>
          {['All', 'Open', 'Escalated', 'Reviewed', 'Dismissed'].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      {showCategory && (
        <label className="flex items-center gap-2 text-fg-2">
          Category
          <select className="field !h-9 !w-auto" value={category} onChange={(e) => setCategory(e.target.value as 'all' | Category)}>
            <option value="all">All</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_META[c].label}
              </option>
            ))}
          </select>
        </label>
      )}
      {filtersActive && (
        <button type="button" className="ml-auto rounded-sm font-bold text-lime" onClick={clearFilters}>
          Clear filters
        </button>
      )}
    </div>
  )

  const table = (pageSize: number) => (
    <EventsTable events={filtered} onOpen={setSelectedId} loading={loading} pageSize={pageSize} onClear={clearFilters} />
  )

  const kpis = (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <KpiCard label="Active cameras" value={`${online} / ${CAMERAS.length}`} note={`${CAMERAS.length - online} camera offline`} />
      <KpiCard label="Total detections" value={<CountUp value={rangeEvents.length} />} note={RANGES[range].label} />
      <KpiCard label="PPE compliance rate" value={<CountUp value={compliance} decimals={1} suffix="%" />} note="Sample figure" tone="lime" />
      <KpiCard label="Open safety alerts" value={<CountUp value={openAlerts} />} note="Open or escalated" tone="danger" />
    </div>
  )

  let content: React.ReactNode
  if (view === 'overview') {
    content = (
      <>
        {kpis}
        <Panel title="Camera monitoring" aside={<span className="text-xs text-fg-3">Simulated feeds</span>}>
          {tiles(CAMERAS, 'sm:grid-cols-2 xl:grid-cols-3')}
        </Panel>
        <div className="grid gap-4 xl:grid-cols-[3fr_2fr]">
          <Panel title="Events over time" aside={<Legend categories={ALL_CATEGORIES} />}>
            <EventsOverTime events={rangeEvents} range={range} categories={ALL_CATEGORIES} height={300} />
          </Panel>
          <Panel title="Events by type">{rangeEvents.length ? <TypeBreakdown events={rangeEvents} /> : <p className="text-sm text-fg-3">No events in this time range.</p>}</Panel>
        </div>
        <Panel title="Recent events" flush>
          {table(6)}
        </Panel>
      </>
    )
  } else if (view === 'live') {
    const list = onlineOnly ? CAMERAS.filter((c) => c.online) : CAMERAS
    content = (
      <Panel
        title="Live monitoring"
        aside={
          <label className="flex items-center gap-2 text-sm text-fg-2">
            <input type="checkbox" className="h-4 w-4 accent-[#b6f23a]" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)} />
            Online only
          </label>
        }
      >
        {tiles(list, 'sm:grid-cols-2')}
        <p className="mt-4 text-xs text-fg-3">Select a camera to open its latest sample event.</p>
      </Panel>
    )
  } else if (view === 'events') {
    content = (
      <Panel title="Detection events" flush>
        {filterBar(true)}
        {table(10)}
      </Panel>
    )
  } else if (view === 'ppe' || view === 'animal' || view === 'rules') {
    const cat = forcedCategory as Category
    const high = scoped.filter((e) => TYPES[e.type].severity === 'High').length
    const open = scoped.filter((e) => e.status === 'Open' || e.status === 'Escalated').length
    content = (
      <>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          <KpiCard label={`${CATEGORY_META[cat].label} events`} value={<CountUp value={scoped.length} />} note={RANGES[range].label} />
          <KpiCard label="Need review" value={<CountUp value={open} />} note="Open or escalated" tone="danger" />
          <KpiCard label="High severity" value={<CountUp value={high} />} note="Sample data" />
        </div>
        <Panel title="Events over time" aside={<Legend categories={[cat]} />}>
          <EventsOverTime events={scoped} range={range} categories={[cat]} height={220} />
        </Panel>
        <Panel title={`${CATEGORY_META[cat].label} events`} flush>
          {filterBar(false)}
          {table(8)}
        </Panel>
      </>
    )
  } else if (view === 'reports') {
    const exportEvents = () =>
      download(
        'theron-sample-events.csv',
        toCsv([['Event ID', 'Timestamp', 'Camera', 'Event type', 'Severity', 'Review status'], ...rangeEvents.map((e) => [e.id, formatTimestamp(e.ts), cameraById(e.cameraId).name, TYPES[e.type].label, TYPES[e.type].severity, e.status])]),
      )
    const exportSummary = () => {
      const counts = new Map<string, number>()
      rangeEvents.forEach((e) => counts.set(TYPES[e.type].label, (counts.get(TYPES[e.type].label) ?? 0) + 1))
      download('theron-sample-summary.csv', toCsv([['Event type', 'Count'], ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, String(v)])]))
    }
    const reports = [
      { title: 'Event log', body: `All ${rangeEvents.length} sample events in ${RANGES[range].label.toLowerCase()}, with severity and review status.`, run: exportEvents },
      { title: 'Event summary by type', body: 'Counts per event type for the selected time range.', run: exportSummary },
    ]
    content = (
      <Panel title="Reports">
        <p className="mb-5 text-sm text-fg-2">Download CSV files built from the sample data and the time range selected above.</p>
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          {reports.map((r) => (
            <li key={r.title} className="flex flex-col justify-between gap-4 rounded-sm border border-line p-4">
              <div>
                <h4 className="font-bold">{r.title}</h4>
                <p className="mt-1.5 text-sm text-fg-2">{r.body}</p>
              </div>
              <button type="button" className="btn btn-ghost !h-10 w-fit" onClick={r.run}>
                <Download size={16} aria-hidden="true" />
                Download CSV
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    )
  } else {
    content = <SettingsView />
  }

  return (
    <div className="panel overflow-hidden shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-3 border-b border-line bg-ink-2 px-4 py-2.5 text-xs text-fg-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        Theron console · simulated sample data, no live cameras
      </div>

      <div className="grid lg:grid-cols-[210px_minmax(0,1fr)]">
        <nav aria-label="Dashboard sections" className="flex gap-1 overflow-x-auto border-b border-line p-2 lg:flex-col lg:border-b-0 lg:border-r lg:p-3">
          {NAV.map((n) => (
            <button
              key={n.key}
              type="button"
              aria-current={view === n.key ? 'page' : undefined}
              onClick={() => setView(n.key)}
              className={`flex shrink-0 items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-bold transition-colors ${view === n.key ? 'bg-lime/15 text-lime' : 'text-fg-2 hover:bg-white/5 hover:text-fg'}`}
            >
              <n.icon size={17} aria-hidden="true" />
              <span className="whitespace-nowrap">{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 border-b border-line p-3">
            <div role="search" className="relative min-w-[200px] flex-1">
              <label htmlFor="dash-search" className="sr-only">
                Search events, cameras, severity
              </label>
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" aria-hidden="true" />
              <input id="dash-search" type="search" className="field !h-10 !pl-9" placeholder="Search events, cameras, severity" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-sm text-fg-2">
              <span className="sr-only">Date range</span>
              <select className="field !h-10 !w-auto font-semibold" value={range} onChange={(e) => setRange(e.target.value as RangeKey)}>
                {(Object.keys(RANGES) as RangeKey[]).map((k) => (
                  <option key={k} value={k}>
                    {RANGES[k].label}
                  </option>
                ))}
              </select>
            </label>
            <div className="relative">
              <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-sm border border-line-strong hover:border-lime" aria-label={`Notifications, ${bellEvents.length} open high severity`} aria-expanded={bellOpen} onClick={() => setBellOpen((o) => !o)}>
                <Bell size={18} aria-hidden="true" />
                {bellEvents.length > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-extrabold text-[#1a0604]">{bellEvents.length}</span>}
              </button>
              {bellOpen && (
                <div className="absolute right-0 z-20 mt-2 w-72 rounded-md border border-line-strong bg-panel-2 p-2 shadow-2xl">
                  <p className="px-2 py-1.5 text-xs font-bold text-fg-3">Open high severity</p>
                  {bellEvents.length ? (
                    <ul className="m-0 list-none p-0">
                      {bellEvents.slice(0, 4).map((e) => (
                        <li key={e.id}>
                          <button type="button" className="w-full rounded-sm px-2 py-2 text-left text-sm hover:bg-white/5" onClick={() => { setBellOpen(false); setSelectedId(e.id) }}>
                            <span className="block font-bold">{TYPES[e.type].label}</span>
                            <span className="text-xs text-fg-3">
                              {cameraById(e.cameraId).name} · {agoLabel(e.minutesAgo)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-2 py-3 text-sm text-fg-2">No open high severity events.</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2.5 pl-1">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan/20 text-xs font-extrabold text-cyan" aria-hidden="true">
                DU
              </span>
              <span className="hidden text-sm leading-tight sm:block">
                <span className="block font-bold">Demo user</span>
                <span className="text-xs text-fg-3">Safety lead</span>
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-3 sm:p-4">{content}</div>
        </div>
      </div>

      <EventPanel event={selected} onClose={close} onStatus={setEventStatus} />
    </div>
  )
}

function SettingsView() {
  const [email, setEmail] = useState(true)
  const [digest, setDigest] = useState(false)
  const [min, setMin] = useState<Severity>('Medium')
  const [occupancy, setOccupancy] = useState(8)
  const toggle = (label: string, on: boolean, set: (v: boolean) => void) => (
    <label className="flex items-center justify-between gap-4 py-3.5">
      <span className="text-sm font-semibold">{label}</span>
      <input type="checkbox" role="switch" className="h-5 w-9 accent-[#b6f23a]" checked={on} onChange={(e) => set(e.target.checked)} />
    </label>
  )
  return (
    <Panel title="Settings">
      <div className="divide-y divide-line">
        {toggle('Email alerts for high severity events', email, setEmail)}
        {toggle('Daily summary report', digest, setDigest)}
        <label className="flex items-center justify-between gap-4 py-3.5">
          <span className="text-sm font-semibold">Minimum severity for notifications</span>
          <select className="field !h-9 !w-auto" value={min} onChange={(e) => setMin(e.target.value as Severity)}>
            {['High', 'Medium', 'Low'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center justify-between gap-4 py-3.5">
          <span className="text-sm font-semibold">Occupancy alert threshold (people)</span>
          <input type="number" min={1} max={99} className="field !h-9 !w-24" value={occupancy} onChange={(e) => setOccupancy(Number(e.target.value))} />
        </label>
      </div>
      <p className="mt-4 text-xs text-fg-3">These controls show how rules are configured. In this preview they change nothing.</p>
    </Panel>
  )
}
