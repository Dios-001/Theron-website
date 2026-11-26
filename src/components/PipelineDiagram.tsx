import { BellRing, Camera, ChartColumn, Cpu, ScanSearch } from 'lucide-react'

const NODES = [
  { icon: Camera, title: 'Camera Feeds', sub: 'CCTV and IP cameras' },
  { icon: Cpu, title: 'Vision Models', sub: 'Detection and classification' },
  { icon: ScanSearch, title: 'Detection Engine', sub: 'Zones and rules' },
  { icon: BellRing, title: 'Alert System', sub: 'Real-time notifications' },
  { icon: ChartColumn, title: 'Analytics Dashboard', sub: 'Review and reports' },
]

/** CSS pipeline diagram: horizontal on desktop, vertical on small screens. */
export function PipelineDiagram() {
  return (
    <figure className="m-0">
      <ol className="m-0 flex list-none flex-col items-stretch p-0 lg:flex-row lg:items-stretch">
        {NODES.map((n, i) => (
          <li key={n.title} className="flex flex-col items-stretch lg:flex-1 lg:flex-row">
            <div className="flex flex-1 items-center gap-4 rounded-md border border-line-strong bg-panel p-4 lg:flex-col lg:gap-3 lg:p-5 lg:text-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-lime/40 text-lime">
                <n.icon size={20} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[0.9375rem] font-extrabold">{n.title}</span>
                <span className="mt-0.5 block text-xs text-fg-3">{n.sub}</span>
              </span>
            </div>
            {i < NODES.length - 1 && (
              <span aria-hidden="true" className="flex items-center justify-center lg:self-center">
                <span className="flow-y mx-auto block h-8 w-0.5 lg:hidden" />
                <span className="flow-x hidden h-0.5 w-8 lg:block xl:w-12" />
              </span>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="mt-5 text-sm text-fg-3">Camera Feeds → Vision Models → Detection Engine → Alert System → Analytics Dashboard. Processing can run at the edge or in the cloud, where supported.</figcaption>
    </figure>
  )
}
