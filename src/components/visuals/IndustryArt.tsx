export type IndustryKind = 'factory' | 'construction' | 'warehouse' | 'agriculture' | 'wildlife' | 'facility'

const S = '#5d6c78'
const LIME = '#b6f23a'
const CYAN = '#4cc9f0'
const AMBER = '#f5b13d'

/** Minimal line illustrations with one detection accent each. Decorative, so hidden from assistive tech. */
export function IndustryArt({ kind }: { kind: IndustryKind }) {
  let art: React.ReactNode
  switch (kind) {
    case 'factory':
      art = (
        <>
          <path d="M40 120V70l40 24V70l40 24V70l40 24V70l40 24v26z" fill="none" stroke={S} strokeWidth={2} strokeLinejoin="round" />
          <rect x={232} y={40} width={16} height={80} fill="none" stroke={S} strokeWidth={2} />
          <path d="M60 104h8M96 104h8M132 104h8M168 104h8" stroke={S} strokeWidth={3} />
          <rect x={250} y={80} width={34} height={40} fill="none" stroke={LIME} strokeWidth={2} />
          <rect x={250} y={66} width={46} height={14} fill={LIME} />
        </>
      )
      break
    case 'construction':
      art = (
        <>
          <path d="M70 120V30M70 30h130M70 30l-24 18M200 30v26M60 120h20" stroke={S} strokeWidth={2} fill="none" />
          <path d="M200 56v14" stroke={S} strokeWidth={2} />
          <rect x={186} y={70} width={28} height={12} fill="none" stroke={S} strokeWidth={2} />
          <path d="M170 120V70h90v50M170 95h90M200 70v50M230 70v50" stroke={S} strokeWidth={2} fill="none" />
          <rect x={236} y={96} width={22} height={24} fill="none" stroke={AMBER} strokeWidth={2} strokeDasharray="4 3" />
        </>
      )
      break
    case 'warehouse':
      art = (
        <>
          <path d="M40 120V40M130 120V40M220 120V40M40 70h180M40 100h180M40 45h180" stroke={S} strokeWidth={2} />
          {[[50, 76], [90, 76], [140, 76], [180, 76], [60, 48], [150, 48], [100, 104], [190, 104]].map(([x, y]) => (
            <rect key={`${x}${y}`} x={x} y={y - 20} width={26} height={20} fill="none" stroke={S} strokeWidth={2} />
          ))}
          <rect x={246} y={84} width={44} height={36} fill="none" stroke={CYAN} strokeWidth={2} />
          <rect x={246} y={70} width={72} height={14} fill={CYAN} />
        </>
      )
      break
    case 'agriculture':
      art = (
        <>
          <path d="M40 120V74l50-34 50 34v46z M72 120V92h36v28" fill="none" stroke={S} strokeWidth={2} strokeLinejoin="round" />
          <path d="M160 108h140M160 124h140M170 100v24M210 100v24M250 100v24M290 100v24" stroke={S} strokeWidth={2} />
          <rect x={218} y={80} width={60} height={30} rx={10} fill="none" stroke={CYAN} strokeWidth={2} />
          <rect x={218} y={66} width={70} height={14} fill={CYAN} />
        </>
      )
      break
    case 'wildlife':
      art = (
        <>
          <path d="M0 124Q70 80 140 112T300 100V140H0z" fill="none" stroke={S} strokeWidth={2} />
          <path d="M50 108l14-36 14 36zM86 112l12-30 12 30zM250 106l14-38 14 38z" fill="none" stroke={S} strokeWidth={2} strokeLinejoin="round" />
          <rect x={150} y={72} width={64} height={42} fill="none" stroke={CYAN} strokeWidth={2} />
          <rect x={150} y={58} width={74} height={14} fill={CYAN} />
          <path d="M166 104q4-18 22-18t20 18M206 88l6-14" stroke={S} strokeWidth={2} fill="none" />
        </>
      )
      break
    case 'facility':
      art = (
        <>
          <rect x={40} y={60} width={50} height={60} rx={10} fill="none" stroke={S} strokeWidth={2} />
          <rect x={104} y={44} width={50} height={76} rx={10} fill="none" stroke={S} strokeWidth={2} />
          <path d="M90 100h14M154 84h40v36M194 120h60M222 120V70h30v50" stroke={S} strokeWidth={2} fill="none" />
          <path d="M230 126h70v8h-70z" fill="none" stroke={AMBER} strokeWidth={2} strokeDasharray="4 3" />
          <circle cx={282} cy={92} r={14} fill="none" stroke={AMBER} strokeWidth={2} />
        </>
      )
      break
  }
  return (
    <svg viewBox="0 0 320 150" aria-hidden="true" className="block h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="150" fill="#0b1117" />
      <path d="M0 125H320" stroke="#1c2832" strokeWidth={2} />
      {art}
    </svg>
  )
}
