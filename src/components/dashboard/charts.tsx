import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CATEGORY_META, RANGES, TYPES, type Category, type DetectionEvent, type RangeKey } from '../../data/events'

const AXIS = { fill: '#8c9893', fontSize: 11 }
const pad = (n: number) => String(n).padStart(2, '0')

const BUCKETS: Record<RangeKey, { count: number; size: number }> = {
  '1h': { count: 12, size: 5 },
  '24h': { count: 24, size: 60 },
  '7d': { count: 7, size: 1440 },
}

function bucketize(events: DetectionEvent[], range: RangeKey) {
  const { count, size } = BUCKETS[range]
  const now = Date.now()
  const rows = Array.from({ length: count }, (_, k) => {
    const i = count - 1 - k // oldest on the left
    const start = new Date(now - (i + 1) * size * 60000)
    const label = range === '7d' ? start.toLocaleDateString('en-GB', { weekday: 'short' }) : `${pad(start.getHours())}:${pad(start.getMinutes())}`
    return { label, ppe: 0, animal: 0, rule: 0, safety: 0 }
  })
  for (const e of events) {
    const i = Math.floor(e.minutesAgo / size)
    if (i >= count) continue
    rows[count - 1 - i][TYPES[e.type].category] += 1
  }
  return rows
}

export function EventsOverTime({ events, range, categories, height = 220 }: { events: DetectionEvent[]; range: RangeKey; categories: Category[]; height?: number }) {
  const data = bucketize(events, range)
  return (
    <div role="img" aria-label={`Stacked bar chart of ${events.length} sample events over ${RANGES[range].label.toLowerCase()}, split by category.`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 6, right: 4, left: -22, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#10161c', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, fontSize: 12 }} labelStyle={{ color: '#f4f7f5', fontWeight: 700 }} itemStyle={{ color: '#b9c3be' }} />
          {categories.map((c) => (
            <Bar key={c} dataKey={c} name={CATEGORY_META[c].label} stackId="a" fill={CATEGORY_META[c].color} isAnimationActive={false} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TypeBreakdown({ events }: { events: DetectionEvent[] }) {
  const counts = new Map<string, number>()
  for (const e of events) counts.set(e.type, (counts.get(e.type) ?? 0) + 1)
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  const max = Math.max(1, ...rows.map((r) => r[1]))
  return (
    <ul className="m-0 grid list-none gap-3.5 p-0">
      {rows.map(([type, n]) => {
        const t = TYPES[type as keyof typeof TYPES]
        return (
          <li key={type}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-semibold">{t.label}</span>
              <span className="tabular-nums text-fg-2">{n}</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-line" aria-hidden="true">
              <div className="h-full rounded-full" style={{ width: `${(n / max) * 100}%`, background: CATEGORY_META[t.category].color }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
