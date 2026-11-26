import { openContact } from '../lib/nav'
import { Reveal } from './Reveal'

export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden border-y border-line bg-gradient-to-b from-ink via-[#0a1410] to-ink py-24 sm:py-32" aria-labelledby="cta-heading">
      <div aria-hidden="true" className="vision-grid absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/15 blur-[130px]" />
      <div className="wrap">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id="cta-heading" className="h-section">Your Next Safety Insight Is Already on Camera.</h2>
          <p className="lede mx-auto mt-6">Discover how Theron can help your team detect critical events, improve visibility, and make faster, better-informed decisions.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" className="btn btn-primary" onClick={() => openContact("I'd like to book a demo of Theron.")}>
              Book a Demo
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => openContact("I'd like to talk to the Theron team about my site.")}>
              Talk to Our Team
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
