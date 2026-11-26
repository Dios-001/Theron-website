import { navigateTo, openContact, openDashboard } from '../lib/nav'
import { Logo } from './Logo'

type Item = { label: string; onClick: () => void }

const PRODUCT: Item[] = [
  { label: 'Dashboard preview', onClick: () => navigateTo('dashboard') },
  { label: 'How it works', onClick: () => navigateTo('how-it-works') },
  { label: 'Technology', onClick: () => navigateTo('technology') },
  { label: 'Benefits', onClick: () => navigateTo('benefits') },
]
const SOLUTIONS: Item[] = [
  { label: 'Animal Detection', onClick: () => openDashboard({ view: 'animal' }) },
  { label: 'PPE Compliance', onClick: () => openDashboard({ view: 'ppe' }) },
  { label: 'Rule Violation Detection', onClick: () => openDashboard({ view: 'rules' }) },
  { label: 'Safety Violation Detection', onClick: () => openDashboard({ view: 'events', category: 'safety' }) },
]
const INDUSTRIES = ['Manufacturing', 'Construction', 'Warehousing and Logistics', 'Agriculture and Livestock', 'Wildlife Monitoring', 'Industrial Facilities']

function Column({ title, items }: { title: string; items: Item[] }) {
  return (
    <nav aria-label={title}>
      <h3 className="text-sm font-bold text-fg">{title}</h3>
      <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
        {items.map((i) => (
          <li key={i.label}>
            <button type="button" onClick={i.onClick} className="rounded-sm text-left text-sm text-fg-2 transition-colors hover:text-lime">
              {i.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2 pb-10 pt-16">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2.7fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg-2">AI-powered computer vision that turns camera feeds into actionable intelligence for safer, better-run operations.</p>
            <button type="button" className="btn btn-primary mt-6 !h-11" onClick={() => openContact()}>
              Contact us
            </button>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            <Column title="Product" items={PRODUCT} />
            <Column title="Solutions" items={SOLUTIONS} />
            <Column title="Industries" items={INDUSTRIES.map((label) => ({ label, onClick: () => navigateTo('industries') }))} />
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-sm text-fg-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Theron. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#/privacy" className="transition-colors hover:text-lime">
              Privacy Policy
            </a>
            <a href="#/terms" className="transition-colors hover:text-lime">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
