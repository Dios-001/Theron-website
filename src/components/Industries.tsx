import { Reveal } from './Reveal'
import { IndustryArt, type IndustryKind } from './visuals/IndustryArt'

const INDUSTRIES: Array<{ kind: IndustryKind; title: string; body: string }> = [
  { kind: 'factory', title: 'Manufacturing and Factories', body: 'Check PPE at stations, watch restricted machine zones and keep a reviewable record of safety events on the line.' },
  { kind: 'construction', title: 'Construction and Infrastructure', body: 'Flag missing PPE and entries into exclusion zones across changing sites, with evidence snapshots for site managers.' },
  { kind: 'warehouse', title: 'Warehousing and Logistics', body: 'Watch pedestrian and forklift interactions, loading-bay access and occupancy in busy aisles.' },
  { kind: 'agriculture', title: 'Agriculture and Livestock', body: 'Get alerts when animals leave a paddock or enter a restricted area, and review movement over time.' },
  { kind: 'wildlife', title: 'Wildlife and Environmental Monitoring', body: 'Detect animals in remote camera feeds and keep a searchable history of sightings and snapshots.' },
  { kind: 'facility', title: 'Industrial Facilities and Operations', body: 'Monitor perimeters, plant areas and access points against rules your team defines for each site.' },
]

export function Industries() {
  return (
    <section id="industries" className="section">
      <div className="wrap">
        <Reveal>
          <h2 className="h-section max-w-3xl">Built for <span className="whitespace-nowrap">Real-World</span> Environments.</h2>
          <p className="lede mt-5">The same platform, configured around what matters on each kind of site.</p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((x) => (
            <article key={x.kind} className="group bg-ink p-0 transition-colors duration-300 hover:bg-panel">
              <div className="aspect-[320/150] overflow-hidden border-b border-line">
                <div className="h-full w-full opacity-90 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100">
                  <IndustryArt kind={x.kind} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg">{x.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-fg-2">{x.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
