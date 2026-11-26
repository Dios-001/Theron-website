import { motion, useReducedMotion } from 'framer-motion'
import { BellRing, Cable, ScanSearch, Crosshair } from 'lucide-react'
import { Reveal } from './Reveal'

const STEPS = [
  { title: 'Capture', body: 'Connect compatible surveillance cameras or video streams.', icon: Cable },
  { title: 'Analyze', body: 'Computer vision models analyze supported objects, activities, and environmental conditions.', icon: ScanSearch },
  { title: 'Detect', body: 'The platform identifies configured events, potential violations, and safety concerns.', icon: Crosshair },
  { title: 'Respond', body: 'Send alerts, review evidence, and generate reports for operational teams.', icon: BellRing },
]

export function HowItWorks() {
  const reduce = useReducedMotion()
  const grow = (axis: 'x' | 'y') =>
    reduce
      ? {}
      : {
          initial: axis === 'x' ? { scaleX: 0 } : { scaleY: 0 },
          whileInView: axis === 'x' ? { scaleX: 1 } : { scaleY: 1 },
          viewport: { once: true, margin: '0px 0px -20% 0px' },
          transition: { duration: 1.4, ease: 'easeInOut' as const },
        }

  return (
    <section id="how-it-works" className="section border-y border-line bg-ink-2">
      <div className="wrap">
        <Reveal>
          <h2 className="h-section max-w-3xl">From Video to Actionable Intelligence.</h2>
        </Reveal>

        <ol className="relative m-0 mt-16 grid list-none gap-10 p-0 lg:grid-cols-4 lg:gap-8">
          {/* connecting lines: horizontal on desktop, vertical on mobile */}
          <motion.span aria-hidden="true" {...grow('x')} className="flow-x absolute left-7 right-[calc(25%-28px)] top-7 hidden h-0.5 origin-left lg:block" />
          <motion.span aria-hidden="true" {...grow('y')} className="flow-y absolute bottom-10 left-[27px] top-10 w-0.5 origin-top lg:hidden" />

          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 lg:flex-col lg:gap-6">
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-lime/50 bg-ink text-lime shadow-[0_0_30px_-8px_rgba(182,242,58,0.6)]">
                <s.icon size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-fg-3">Step {i + 1}</p>
                <h3 className="mt-1 text-2xl">{s.title}</h3>
                <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-fg-2">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
