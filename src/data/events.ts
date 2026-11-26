// ALL DATA IN THIS FILE IS SIMULATED. It exists only to drive the dashboard preview on the site.
import type { SceneKind } from '../components/visuals/scenes'

export type Severity = 'High' | 'Medium' | 'Low'
export type Status = 'Open' | 'Escalated' | 'Reviewed' | 'Dismissed'
export type Category = 'ppe' | 'animal' | 'rule' | 'safety'
export type RangeKey = '1h' | '24h' | '7d'

export const RANGES: Record<RangeKey, { label: string; minutes: number }> = {
  '1h': { label: 'Last hour', minutes: 60 },
  '24h': { label: 'Last 24 hours', minutes: 1440 },
  '7d': { label: 'Last 7 days', minutes: 10080 },
}

export const CATEGORY_META: Record<Category, { label: string; color: string; solution: string }> = {
  ppe: { label: 'PPE compliance', color: '#b6f23a', solution: 'PPE compliance' },
  animal: { label: 'Animal detection', color: '#4cc9f0', solution: 'Animal detection' },
  rule: { label: 'Rule violations', color: '#f5b13d', solution: 'Rule violation detection' },
  safety: { label: 'Safety violations', color: '#ff6b5e', solution: 'Safety violation detection' },
}

export interface Camera {
  id: string
  code: string
  name: string
  site: string
  online: boolean
  scene: SceneKind
}

export const CAMERAS: Camera[] = [
  { id: 'c1', code: 'CAM-01', name: 'Assembly line', site: 'Plant A', online: true, scene: 'assembly' },
  { id: 'c2', code: 'CAM-02', name: 'Packing station', site: 'Plant A', online: false, scene: 'assembly' },
  { id: 'c3', code: 'CAM-03', name: 'Forklift lane', site: 'Plant A', online: true, scene: 'zone' },
  { id: 'c4', code: 'CAM-04', name: 'Press bay', site: 'Plant A', online: true, scene: 'safety' },
  { id: 'c5', code: 'CAM-05', name: 'North paddock', site: 'Farm site', online: true, scene: 'paddock' },
  { id: 'c6', code: 'CAM-06', name: 'East perimeter', site: 'Farm site', online: true, scene: 'perimeter' },
]

export interface EventType {
  label: string
  severity: Severity
  category: Category
  description: string
  /** Scene used for the snapshot. 'camera' uses the camera's own scene. */
  scene: SceneKind | 'camera'
}

export const TYPES = {
  hard_hat: { label: 'Missing Hard Hat', severity: 'High', category: 'ppe', scene: 'ppe', description: 'A person was visible without a hard hat inside a hard-hat-required area.' },
  vest: { label: 'Safety Vest Missing', severity: 'High', category: 'ppe', scene: 'ppe', description: 'A person was visible without a high-visibility vest in a marked area.' },
  gloves: { label: 'Missing Gloves', severity: 'Medium', category: 'ppe', scene: 'ppe', description: 'Bare hands were visible near equipment that requires gloves.' },
  zone_entry: { label: 'Restricted Zone Entry', severity: 'Medium', category: 'rule', scene: 'zone', description: 'A person crossed into a configured restricted zone.' },
  unauthorized: { label: 'Unauthorized Access', severity: 'High', category: 'rule', scene: 'camera', description: 'Movement was detected in an access-controlled area outside permitted hours.' },
  animal: { label: 'Animal Detected', severity: 'Low', category: 'animal', scene: 'camera', description: 'An animal was detected inside a monitored detection zone.' },
  livestock: { label: 'Livestock Outside Zone', severity: 'Medium', category: 'animal', scene: 'paddock', description: 'An animal was detected outside its configured paddock zone.' },
  proximity: { label: 'Unsafe Proximity to Equipment', severity: 'High', category: 'safety', scene: 'safety', description: 'A person was detected inside the safety margin around moving equipment.' },
  posture: { label: 'Abnormal Posture', severity: 'Medium', category: 'safety', scene: 'safety', description: 'A person was detected in a posture that may indicate a fall. Needs human review.' },
  occupancy: { label: 'Occupancy Threshold Exceeded', severity: 'Low', category: 'safety', scene: 'safety', description: 'More people were detected in an area than the configured threshold.' },
} satisfies Record<string, EventType>

export type TypeKey = keyof typeof TYPES

export interface DetectionEvent {
  id: string
  ts: number
  minutesAgo: number
  cameraId: string
  type: TypeKey
  status: Status
}

const CAMERA_TYPES: Record<string, TypeKey[]> = {
  c1: ['hard_hat', 'vest', 'vest', 'hard_hat', 'gloves', 'animal'],
  c2: ['vest', 'gloves', 'gloves'],
  c3: ['zone_entry', 'zone_entry', 'proximity', 'vest', 'occupancy'],
  c4: ['proximity', 'posture', 'gloves', 'hard_hat', 'occupancy'],
  c5: ['animal', 'animal', 'livestock', 'livestock'],
  c6: ['animal', 'animal', 'unauthorized', 'unauthorized'],
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const BASE = Date.now()

function build(): DetectionEvent[] {
  const rand = mulberry32(2026)
  const minutes: number[] = []
  for (let i = 0; i < 30; i++) minutes.push(Math.floor(Math.pow(rand(), 1.7) * 1420))
  for (let i = 0; i < 16; i++) minutes.push(1440 + Math.floor(rand() * 8600))
  minutes.sort((a, b) => a - b)
  minutes[0] = 4
  for (let i = 1; i < minutes.length; i++) if (minutes[i] <= minutes[i - 1]) minutes[i] = minutes[i - 1] + 1 + Math.floor(rand() * 3)

  return minutes.map((m, i) => {
    // CAM-02 went offline about six hours ago, so it only has older events.
    const pool = CAMERAS.filter((c) => (c.id === 'c2' ? m > 360 : true))
    const camera = pool[Math.floor(rand() * pool.length)]
    const types = CAMERA_TYPES[camera.id]
    const type = types[Math.floor(rand() * types.length)]
    const r = rand()
    const status: Status = m < 120 ? 'Open' : r < 0.55 ? 'Reviewed' : r < 0.7 ? 'Dismissed' : r < 0.8 ? 'Escalated' : 'Open'
    const seconds = Math.floor(rand() * 60)
    return {
      id: `EVT-${1041 - i}`,
      ts: BASE - m * 60000 - seconds * 1000,
      minutesAgo: m,
      cameraId: camera.id,
      type,
      status,
    }
  })
}

export const EVENTS: DetectionEvent[] = build()
export const cameraById = (id: string) => CAMERAS.find((c) => c.id === id) as Camera

const pad = (n: number) => String(n).padStart(2, '0')

export function formatTimestamp(ts: number) {
  const d = new Date(ts)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString()
  const day = same(d, today) ? 'Today' : same(d, yesterday) ? 'Yesterday' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  return `${day} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function agoLabel(minutes: number) {
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  if (minutes < 1440) return `${Math.round(minutes / 60)} h ago`
  return `${Math.round(minutes / 1440)} d ago`
}
