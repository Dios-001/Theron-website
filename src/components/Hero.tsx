import { useClock } from '../lib/hooks'
import { navigateTo, openContact } from '../lib/nav'
import { Scene } from './visuals/scenes'

const SAMPLE_EVENTS = [
  { label: 'Safety vest missing', where: 'Assembly line', color: 'bg-danger' },
  { label: 'Animal detected', where: 'Dock door 2', color: 'bg-cyan' },
  { label: 'Restricted zone entry', where: 'Forklift lane', color: 'bg-amber' },
]

export function Hero() {
  const time = useClock()
  return (
    <section id="top" className="vision-grid relative overflow-hidden pb-20 pt-28 lg:pb-28 lg:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[560px] w-[560px] rounded-full bg-lime/10 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan/10 blur-[140px]" />

      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1.08fr_1fr]">
        <div>
          <p className="mb-6 flex items-center gap-2.5 text-sm font-semibold text-fg-2">
            <span className="rec-dot h-2 w-2 rounded-full bg-lime" aria-hidden="true" />
            AI-powered visual intelligence for industrial operations.
          </p>
          <h1 className="h-display">
            Your Cameras See Everything. <span className="text-lime">Theron Understands It.</span>
          </h1>
          <p className="lede mt-7">
            Transform ordinary camera feeds into real-time intelligence. Theron uses advanced computer vision to detect animals, identify safety violations, monitor PPE compliance, and help businesses act before small risks become serious problems.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="btn btn-primary" onClick={() => openContact("I'd like to see a demo of Theron.")}>
              Request a Demo
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigateTo('solutions')}>
              Explore Our Solutions
            </button>
          </div>
        </div>

        <div className="relative pb-36 sm:pb-32">
          <figure className="relative m-0 overflow-hidden rounded-md border border-lime/25 bg-panel shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9),0_0_80px_-30px_rgba(182,242,58,0.45)]">
            <div className="relative aspect-[16/10]">
              <Scene kind="assembly" animate />
              <div className="scanline" aria-hidden="true" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                <span className="inline-flex items-center gap-2 rounded-sm bg-ink/80 px-2.5 py-1 text-xs font-bold text-fg">
                  <span className="rec-dot h-1.5 w-1.5 rounded-full bg-danger" aria-hidden="true" />
                  Cam 04 · Assembly line
                </span>
                <span className="rounded-sm bg-ink/80 px-2.5 py-1 text-xs font-bold tabular-nums text-fg">{time}</span>
              </div>
              <span className="absolute bottom-3 right-3 rounded-sm bg-ink/80 px-2 py-1 text-[11px] font-semibold text-fg-2">Simulated feed</span>
            </div>
            <figcaption className="sr-only">A simulated factory camera view with AI detection boxes around workers, PPE and an animal.</figcaption>
          </figure>

          <div className="absolute bottom-0 left-0 w-[88%] max-w-sm rounded-md border border-line-strong bg-panel/95 p-4 shadow-2xl backdrop-blur sm:-left-6">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-bold">Detection events</span>
              <span className="text-xs text-fg-3">Sample data</span>
            </div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {SAMPLE_EVENTS.map((e) => (
                <li key={e.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2.5 font-semibold">
                    <span className={`h-2 w-2 rounded-full ${e.color}`} aria-hidden="true" />
                    {e.label}
                  </span>
                  <span className="text-xs text-fg-3">{e.where}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
