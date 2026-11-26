import { CAPABILITIES, STATUS_META, type CapabilityStatus } from '../data/technology'
import { PipelineDiagram } from './PipelineDiagram'
import { Reveal } from './Reveal'

const CHIP: Record<CapabilityStatus, string> = {
  core: 'border-lime/50 text-lime',
  supported: 'border-cyan/50 text-cyan',
  planned: 'border-dashed border-line-strong text-fg-2',
}

export function Technology() {
  return (
    <section id="technology" className="section border-y border-line bg-ink-2">
      <div className="wrap">
        <Reveal>
          <h2 className="h-section max-w-3xl">Computer Vision Engineered for Operations.</h2>
          <p className="lede mt-5">From camera stream to reviewed event, every stage is built to be configured, inspected and audited.</p>
        </Reveal>

        <div className="mt-14">
          <PipelineDiagram />
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg-2">
          <span className="font-bold text-fg">Capability status</span>
          {(Object.keys(STATUS_META) as CapabilityStatus[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-2">
              <span className={`rounded-sm border px-2 py-0.5 text-xs font-bold ${CHIP[k]}`}>{STATUS_META[k].label}</span>
              {STATUS_META[k].hint}
            </span>
          ))}
        </div>

        <ul className="m-0 mt-6 grid list-none gap-px overflow-hidden rounded-md border border-line bg-line p-0 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <li key={c.title} className="bg-ink-2 p-6">
              <span className={`inline-block rounded-sm border px-2 py-0.5 text-xs font-bold ${CHIP[c.status]}`}>{STATUS_META[c.status].label}</span>
              <h3 className="mt-4 text-lg leading-snug">{c.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-2">{c.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-fg-3">
          We don't publish accuracy figures or certifications on this page. Detection performance depends on camera quality, placement, lighting and configuration, and is best assessed on your own footage during a pilot.
        </p>
      </div>
    </section>
  )
}
