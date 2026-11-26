import { Reveal } from './Reveal'

const PRINCIPLES = [
  { title: 'Observable events, not guesses', body: 'Theron detects what a camera can see, such as a missing hard hat or a person in a marked zone. It does not claim to understand intent.' },
  { title: 'People make the decisions', body: 'Detections go to your team with evidence attached. Humans review, escalate or dismiss.' },
  { title: 'Straight about the limits', body: 'Some capabilities depend on camera and site conditions. We say so, and we show sample data as sample data.' },
]

export function About() {
  return (
    <section id="about" className="section">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <h2 className="h-section">Visual intelligence for a safer world.</h2>
          <p className="lede mt-6">
            Theron turns camera feeds into actionable intelligence. We help industrial and agricultural teams improve safety, monitor operations, detect violations and automate visual inspection with AI-powered computer vision.
          </p>
        </Reveal>
        <dl className="m-0 grid gap-0 divide-y divide-line border-y border-line">
          {PRINCIPLES.map((p) => (
            <Reveal key={p.title}>
              <div className="grid gap-2 py-7 sm:grid-cols-[0.8fr_1.2fr] sm:gap-8">
                <dt className="text-lg font-extrabold leading-snug">{p.title}</dt>
                <dd className="m-0 text-[0.9375rem] leading-relaxed text-fg-2">{p.body}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
