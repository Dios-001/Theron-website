/** Theron mark: an almond-shaped lens with an iris and three linked vision nodes. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M2 14C7 7 12 5 16 5s9 2 14 9c-5 7-10 9-14 9S7 21 2 14Z" stroke="#b6f23a" strokeWidth={1.7} strokeLinejoin="round" />
      <circle cx={16} cy={14} r={4.8} stroke="#b6f23a" strokeWidth={1.6} />
      <circle cx={16} cy={14} r={1.8} fill="#b6f23a" />
      <path d="M9 27l7-6 7 6" stroke="#4cc9f0" strokeWidth={1.2} strokeLinejoin="round" opacity={0.8} />
      <circle cx={9} cy={27} r={1.6} fill="#4cc9f0" />
      <circle cx={16} cy={21} r={1.6} fill="#4cc9f0" />
      <circle cx={23} cy={27} r={1.6} fill="#4cc9f0" />
    </svg>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="text-[1.05rem] font-extrabold tracking-[0.3em] text-fg">THERON</span>
    </span>
  )
}
