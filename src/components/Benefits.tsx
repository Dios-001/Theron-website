import { Activity, BellRing, Eye, FileText, Layers, LayoutDashboard, Plug, SlidersHorizontal } from 'lucide-react'
import { Reveal } from './Reveal'

const BENEFITS = [
  { icon: Activity, title: 'Real-time visual event detection', body: 'Configured events surface as they appear on camera.' },
  { icon: BellRing, title: 'Faster safety incident awareness', body: 'Teams hear about a possible issue sooner, then decide what to do.' },
  { icon: Eye, title: 'Less manual video monitoring', body: 'Staff review flagged events instead of watching every feed.' },
  { icon: LayoutDashboard, title: 'Centralized event management', body: 'One place to triage, review and close out events.' },
  { icon: SlidersHorizontal, title: 'Configurable detection rules', body: 'Set zones, thresholds and alert targets for each site.' },
  { icon: FileText, title: 'Historical reporting and audit support', body: 'Event history and evidence snapshots to support reviews.' },
  { icon: Plug, title: 'Works with existing cameras', body: 'Integration potential with compatible camera infrastructure.' },
  { icon: Layers, title: 'Scalable across sites', body: 'Built to extend monitoring to more cameras and locations.' },
]

export function Benefits() {
  return (
    <section id="benefits" className="section border-t border-line">
      <div className="wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <h2 className="h-section">Make Every Camera More Useful.</h2>
            <p className="lede mt-5">
              Theron supports the people responsible for safety. It flags what the cameras see so they can make better-informed decisions. Detection depends on camera placement, lighting and how rules are configured, so a person stays in the loop.
            </p>
          </div>
        </Reveal>

        <ul className="m-0 grid list-none gap-x-10 gap-y-9 p-0 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={(i % 2) * 0.06}>
                <div className="border-t border-line-strong pt-5">
                  <b.icon size={22} className="text-lime" aria-hidden="true" />
                  <h3 className="mt-4 text-lg leading-snug">{b.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-2">{b.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
