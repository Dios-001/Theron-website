import { useId } from 'react'

export type SceneKind = 'assembly' | 'ppe' | 'zone' | 'safety' | 'animal' | 'paddock' | 'perimeter'

const LIME = '#b6f23a'
const CYAN = '#4cc9f0'
const AMBER = '#f5b13d'
const RED = '#ff6b5e'
const FONT = 'Manrope, system-ui, sans-serif'

interface DetProps {
  x: number
  y: number
  w: number
  h: number
  label: string
  color: string
  below?: boolean
  dashed?: boolean
  fs?: number
  delay?: number
}

/** A detection bounding box with its label chip. */
function Det({ x, y, w, h, label, color, below, dashed, fs = 9, delay }: DetProps) {
  const lw = Math.round(label.length * fs * 0.6 + 10)
  const lh = fs + 6
  const ly = below ? y + h : y - lh
  return (
    <g className={delay !== undefined ? 'det-in' : undefined} style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity={0.08} stroke={color} strokeWidth={1.5} strokeDasharray={dashed ? '5 3' : undefined} />
      <rect x={x} y={ly} width={lw} height={lh} fill={color} />
      <text x={x + 5} y={ly + fs + 1} fontSize={fs} fontWeight={800} fill="#07110a" fontFamily={FONT}>
        {label}
      </text>
    </g>
  )
}

interface WorkerProps {
  x: number
  y: number
  s?: number
  hat?: boolean
  vest?: boolean
  gloves?: boolean
}

/** Geometry helper: detection boxes for a worker drawn at (x, y) with scale s. */
const wb = (x: number, y: number, s: number) => ({
  person: { x: x - 24 * s, y: y - 108 * s, w: 48 * s, h: 112 * s },
  hat: { x: x - 14 * s, y: y - 108 * s, w: 28 * s, h: 16 * s },
  vest: { x: x - 15 * s, y: y - 82 * s, w: 30 * s, h: 38 * s },
  hands: { x: x - 23 * s, y: y - 50 * s, w: 46 * s, h: 11 * s },
})

function Worker({ x, y, s = 1, hat = true, vest = true, gloves = true }: WorkerProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={3} rx={20} ry={4.5} fill="#000" opacity={0.4} />
      <rect x={-9} y={-44} width={8} height={44} rx={2} fill="#1c2733" />
      <rect x={1} y={-44} width={8} height={44} rx={2} fill="#202c39" />
      <rect x={-13} y={-84} width={26} height={42} rx={4} fill="#34424f" />
      <rect x={-20} y={-82} width={7} height={36} rx={3} fill="#2c3945" />
      <rect x={13} y={-82} width={7} height={36} rx={3} fill="#2c3945" />
      {vest && (
        <g>
          <rect x={-13} y={-82} width={26} height={36} rx={2} fill="#f2872e" />
          <rect x={-13} y={-70} width={26} height={3.5} fill="#e8eadf" />
          <rect x={-13} y={-58} width={26} height={3.5} fill="#e8eadf" />
        </g>
      )}
      <rect x={-21} y={-48} width={8} height={8} rx={2} fill={gloves ? '#d9a441' : '#c99a7a'} />
      <rect x={13} y={-48} width={8} height={8} rx={2} fill={gloves ? '#d9a441' : '#c99a7a'} />
      <circle cx={0} cy={-93} r={9.5} fill="#c99a7a" />
      {hat && (
        <g>
          <path d="M-11.5 -94a11.5 11.5 0 0 1 23 0z" fill="#f4c542" />
          <rect x={-14} y={-95} width={28} height={3.2} rx={1.5} fill="#f4c542" />
        </g>
      )}
    </g>
  )
}

function Animal({ x, y, s = 1, kind = 'cow' }: { x: number; y: number; s?: number; kind?: 'cow' | 'deer' }) {
  const body = kind === 'cow' ? '#7d7468' : '#94704c'
  const dark = kind === 'cow' ? '#4a443c' : '#5f4630'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={3} rx={38} ry={4.5} fill="#000" opacity={0.4} />
      {[-25, -15, 13, 23].map((lx) => (
        <rect key={lx} x={lx} y={-19} width={6} height={19} rx={2} fill={dark} />
      ))}
      <rect x={-33} y={-43} width={66} height={27} rx={13} fill={body} />
      {kind === 'cow' && (
        <g fill="#3b362f" opacity={0.8}>
          <circle cx={-12} cy={-33} r={7} />
          <circle cx={10} cy={-28} r={5} />
        </g>
      )}
      <path d="M26 -40 L41 -54 L54 -47 L54 -34 L41 -29Z" fill={body} />
      <circle cx={46} cy={-44} r={1.6} fill="#0b0f12" />
      {kind === 'deer' && <path d="M42 -54 l-4 -14 m4 14 l6 -15 m-6 8 l-8 -3" stroke="#6b4f35" strokeWidth={2.2} fill="none" strokeLinecap="round" />}
      <path d="M-33 -37 q-9 7 -7 17" stroke={dark} fill="none" strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}
const ab = (x: number, y: number, s: number) => ({ x: x - 38 * s, y: y - 70 * s, w: 96 * s, h: 74 * s })

function Forklift({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={3} rx={62} ry={6} fill="#000" opacity={0.4} />
      <rect x={-44} y={-46} width={78} height={34} rx={4} fill="#d99a1f" />
      <path d="M-30 -46 V-84 H8 V-46" fill="none" stroke="#8e6512" strokeWidth={4} />
      <rect x={-26} y={-80} width={30} height={30} fill="#10171e" opacity={0.7} />
      <rect x={38} y={-96} width={6} height={92} fill="#30363d" />
      <rect x={44} y={-8} width={40} height={5} fill="#555d66" />
      <circle cx={-26} cy={-6} r={11} fill="#10151a" stroke="#2a323a" strokeWidth={3} />
      <circle cx={20} cy={-6} r={11} fill="#10151a" stroke="#2a323a" strokeWidth={3} />
    </g>
  )
}

function Room({ id }: { id: string }) {
  const boxes: Array<[number, number, number, number]> = [
    [34, 198, 40, 36], [80, 208, 32, 26], [118, 200, 44, 34], [166, 210, 28, 24], [208, 196, 38, 38],
    [262, 206, 36, 28], [304, 200, 42, 34], [350, 208, 30, 26], [394, 198, 40, 36],
  ]
  return (
    <>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#090f16" />
          <stop offset="1" stopColor="#131d28" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15202b" />
          <stop offset="1" stopColor="#090d12" />
        </linearGradient>
        <radialGradient id={`${id}l`} cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor="#dcecff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#dcecff" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}p`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="10" fill={AMBER} opacity="0.3" />
        </pattern>
      </defs>
      <rect width="640" height="360" fill={`url(#${id}w)`} />
      {[28, 58, 90].map((y) => (
        <path key={y} d={`M0 ${y}H640`} stroke="#18232f" strokeWidth={2} />
      ))}
      {[110, 300, 490].map((x) => (
        <g key={x}>
          <ellipse cx={x + 30} cy={40} rx={110} ry={70} fill={`url(#${id}l)`} />
          <rect x={x} y={20} width={60} height={5} rx={2} fill="#d9ebff" opacity={0.8} />
        </g>
      ))}
      <rect x={0} y={112} width={640} height={126} fill="#0c141c" />
      {[0, 107, 214, 320, 427, 534].map((x) => (
        <rect key={x} x={x} y={112} width={3} height={126} fill="#16212c" />
      ))}
      {boxes.map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#7a5f45" opacity={0.75} />
          <rect x={x + w / 2 - 2} y={y} width={4} height={h} fill="#a98a66" opacity={0.5} />
        </g>
      ))}
      <rect x={462} y={148} width={160} height={90} fill="#111b26" stroke="#1d2a38" />
      <rect x={478} y={162} width={44} height={22} fill="#0a1118" stroke="#233243" />
      <rect x={484} y={168} width={20} height={3} fill={LIME} opacity={0.7} />
      <rect x={484} y={175} width={30} height={3} fill={CYAN} opacity={0.5} />
      <rect x={0} y={237} width={640} height={123} fill={`url(#${id}f)`} />
      {[-160, 40, 220, 320, 420, 600, 800].map((x2) => (
        <line key={x2} x1={320 + (x2 - 320) * 0.28} y1={237} x2={x2} y2={360} stroke="#1b2733" />
      ))}
      <path d="M262 237L140 360" stroke="#c9a227" strokeOpacity={0.32} strokeWidth={3} />
      <path d="M378 237L500 360" stroke="#c9a227" strokeOpacity={0.32} strokeWidth={3} />
    </>
  )
}

function Field({ id, bright }: { id: string; bright?: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bright ? '#10202c' : '#070d14'} />
          <stop offset="1" stopColor={bright ? '#1d3340' : '#122029'} />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14241b" />
          <stop offset="1" stopColor="#0a120d" />
        </linearGradient>
        <radialGradient id={`${id}m`} cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.3" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="360" fill={`url(#${id}s)`} />
      {[[60, 40], [150, 24], [260, 58], [380, 30], [470, 66], [590, 36], [330, 90]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={1.2} fill="#cfe3ff" opacity={0.6} />
      ))}
      <path d="M0 236 Q180 190 360 222 T640 214 V360 H0Z" fill={`url(#${id}g)`} />
      <rect x={573} y={110} width={5} height={130} fill="#26323a" />
      <circle cx={575} cy={110} r={5} fill="#ffe9a8" />
      <ellipse cx={575} cy={150} rx={110} ry={90} fill={`url(#${id}m)`} />
      {[20, 90, 160, 230, 300, 370, 440, 510, 580, 640].map((x) => (
        <rect key={x} x={x} y={248} width={4} height={36} fill="#2a3640" />
      ))}
      <path d="M0 258H640M0 274H640" stroke="#2a3640" strokeWidth={2} />
    </>
  )
}

interface SceneProps {
  kind: SceneKind
  /** Fade detection boxes in one after another (used in the hero). */
  animate?: boolean
  label?: string
}

const LABELS: Record<SceneKind, string> = {
  assembly: 'Simulated camera view of an assembly line with detected people, PPE status and an animal',
  ppe: 'Simulated camera view of a worker with hard hat and vest detected and gloves missing',
  zone: 'Simulated camera view of a restricted zone with a person detected inside it',
  safety: 'Simulated camera view of a person standing too close to a forklift',
  animal: 'Simulated camera view of a cow detected in a paddock zone',
  paddock: 'Simulated camera view of a paddock with one animal outside its zone',
  perimeter: 'Simulated night camera view of a deer detected at a fence line',
}

export function Scene({ kind, animate = false, label }: SceneProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const d = (n: number) => (animate ? n : undefined)
  let body: React.ReactNode = null

  if (kind === 'assembly') {
    const a = wb(180, 305, 1.3)
    const b = wb(335, 300, 1.15)
    const c = wb(505, 296, 1.05)
    const dog = ab(64, 338, 0.55)
    body = (
      <>
        <Room id={id} />
        <path d="M440 336L618 336L640 268L476 262Z" fill={`url(#${id}p)`} stroke={AMBER} strokeWidth={1.4} strokeDasharray="6 4" />
        <text x={470} y={329} fontSize={9} fontWeight={800} fill={AMBER} fontFamily={FONT}>Restricted zone</text>
        <Animal x={64} y={338} s={0.55} kind="deer" />
        <Worker x={180} y={305} s={1.3} />
        <Worker x={335} y={300} s={1.15} vest={false} />
        <Worker x={505} y={296} s={1.05} hat={false} />
        <Det {...a.hat} label="Hard Hat: Detected" color={LIME} delay={d(500)} fs={9} />
        <Det {...a.vest} label="Vest" color={LIME} delay={d(750)} fs={8} below />
        <Det {...b.hat} label="Hard Hat: Detected" color={LIME} delay={d(1000)} fs={8} />
        <Det {...b.vest} label="Safety Vest: Missing" color={RED} delay={d(1250)} fs={9} below />
        <Det {...c.hat} label="Hard Hat: Missing" color={RED} delay={d(1500)} fs={8} />
        <Det {...dog} label="Animal Detected" color={CYAN} delay={d(1800)} fs={9} dashed />
        <path d="M335 330 Q 300 345 250 340" stroke={LIME} strokeWidth={1.5} strokeDasharray="2 5" fill="none" strokeLinecap="round" opacity={0.7} />
        <circle cx={250} cy={340} r={3} fill={LIME} />
      </>
    )
  } else if (kind === 'ppe') {
    const w = wb(320, 350, 2.35)
    body = (
      <>
        <Room id={id} />
        <Worker x={320} y={350} s={2.35} gloves={false} />
        <Det {...w.hat} label="Hard Hat: Detected" color={LIME} delay={d(300)} fs={10} />
        <Det {...w.vest} label="Safety Vest: Detected" color={LIME} delay={d(700)} fs={10} below />
        <Det {...w.hands} label="Gloves: Missing" color={RED} delay={d(1100)} fs={10} below />
      </>
    )
  } else if (kind === 'zone') {
    const w = wb(470, 322, 1.55)
    body = (
      <>
        <Room id={id} />
        <path d="M300 340L630 340L640 262L350 256Z" fill={`url(#${id}p)`} stroke={AMBER} strokeWidth={2} strokeDasharray="7 4" />
        <text x={316} y={332} fontSize={10} fontWeight={800} fill={AMBER} fontFamily={FONT}>Restricted zone</text>
        <Worker x={130} y={300} s={1.2} />
        <Worker x={470} y={322} s={1.55} />
        <Det {...w.person} label="Restricted Zone: Entry" color={RED} delay={d(400)} fs={10} />
      </>
    )
  } else if (kind === 'safety') {
    const p = wb(190, 322, 1.45)
    body = (
      <>
        <Room id={id} />
        <ellipse cx={390} cy={316} rx={190} ry={44} fill="none" stroke={AMBER} strokeWidth={1.6} strokeDasharray="7 5" />
        <Forklift x={400} y={312} s={1.25} />
        <Worker x={190} y={322} s={1.45} />
        <Det x={400 - 76} y={312 - 124} w={175} h={132} label="Forklift: Moving" color={CYAN} fs={9} delay={d(400)} />
        <Det {...p.person} label="Unsafe Proximity" color={RED} delay={d(800)} fs={10} />
        <path d="M232 296 H312" stroke={RED} strokeWidth={1.6} strokeDasharray="3 4" />
      </>
    )
  } else if (kind === 'animal') {
    const a = ab(330, 306, 2)
    body = (
      <>
        <Field id={id} bright />
        <path d="M120 330 L560 330 L520 250 L170 250Z" fill="none" stroke={LIME} strokeWidth={1.6} strokeDasharray="7 5" />
        <text x={134} y={322} fontSize={10} fontWeight={800} fill={LIME} fontFamily={FONT}>Zone: North paddock</text>
        <Animal x={330} y={306} s={2} />
        <Det {...a} label="Animal Detected" color={CYAN} fs={10} delay={d(400)} />
      </>
    )
  } else if (kind === 'paddock') {
    const a = ab(200, 304, 1.2)
    const b = ab(500, 288, 0.9)
    body = (
      <>
        <Field id={id} bright />
        <path d="M60 332 L350 332 L330 252 L90 252Z" fill="none" stroke={LIME} strokeWidth={1.4} strokeDasharray="6 4" />
        <Animal x={200} y={304} s={1.2} />
        <Animal x={500} y={288} s={0.9} />
        <Det {...a} label="Livestock" color={CYAN} fs={8} delay={d(400)} />
        <Det {...b} label="Outside Zone" color={AMBER} fs={8} delay={d(800)} dashed />
      </>
    )
  } else {
    const a = ab(430, 308, 1.5)
    body = (
      <>
        <Field id={id} />
        <Animal x={430} y={308} s={1.5} kind="deer" />
        <Det {...a} label="Animal Detected" color={CYAN} fs={10} delay={d(400)} />
        <path d="M250 330 Q 300 318 340 322 T 396 318" stroke={CYAN} strokeWidth={1.6} strokeDasharray="2 5" fill="none" strokeLinecap="round" />
        <circle cx={396} cy={318} r={3} fill={CYAN} />
      </>
    )
  }

  return (
    <svg viewBox="0 0 640 360" role="img" aria-label={label ?? LABELS[kind]} preserveAspectRatio="xMidYMid slice" className="block h-full w-full">
      {body}
    </svg>
  )
}
