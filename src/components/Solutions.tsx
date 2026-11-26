import { ArrowRight, Check } from 'lucide-react'
import { SOLUTIONS } from '../data/solutions'
import { openDashboard } from '../lib/nav'
import { Reveal } from './Reveal'
import { Scene } from './visuals/scenes'

export function Solutions() {
  return (
    <section id="solutions" className="section">
      <div className="wrap">
        <Reveal>
          <h2 className="h-section max-w-3xl">One Vision Platform. Multiple Intelligence Layers.</h2>
          <p className="lede mt-5">Four detection solutions on the same camera infrastructure, reviewed in one place.</p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.id} delay={(i % 2) * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-panel transition-colors duration-300 hover:border-lime/40">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-line">
                  <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                    <Scene kind={s.scene} />
                  </div>
                  <span className="absolute left-3 top-3 rounded-sm bg-ink/80 px-2.5 py-1 text-xs font-bold text-fg">{s.tag}</span>
                  <span className="absolute bottom-3 right-3 rounded-sm bg-ink/80 px-2 py-1 text-[11px] font-semibold text-fg-2">Simulated</span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-center gap-3 text-lime">
                    {s.icon}
                    <h3 className="text-xl text-fg sm:text-[1.375rem]">{s.title}</h3>
                  </div>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-2">{s.description}</p>
                  <ul className="m-0 mt-5 grid list-none gap-x-6 gap-y-2.5 p-0 text-sm text-fg sm:grid-cols-1 xl:grid-cols-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={16} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => openDashboard(s.target)}
                    className="mt-7 inline-flex w-fit items-center gap-2 rounded-sm text-sm font-bold text-lime"
                    aria-label={`Learn more about ${s.title} in the dashboard preview`}
                  >
                    <span className="border-b border-transparent transition-colors group-hover:border-lime">Learn More</span>
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
