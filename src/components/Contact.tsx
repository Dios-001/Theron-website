import { CheckCircle2, Loader2, TriangleAlert } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { company } from '../data/company'
import { INDUSTRY_OPTIONS, SOLUTION_OPTIONS } from '../data/solutions'
import { isDemoMode, submitLead, type LeadResult } from '../lib/leadService'
import { Reveal } from './Reveal'

interface Values {
  fullName: string
  company: string
  email: string
  industry: string
  solution: string
  message: string
}
type Errors = Partial<Record<keyof Values, string>>
type Phase = 'idle' | 'loading' | 'success' | 'error'

const EMPTY: Values = { fullName: '', company: '', email: '', industry: '', solution: '', message: '' }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.fullName.trim()) e.fullName = 'Enter your full name.'
  if (!v.company.trim()) e.company = 'Enter your company name.'
  if (!v.email.trim()) e.email = 'Enter your work email.'
  else if (!EMAIL.test(v.email.trim())) e.email = 'Enter an email address like name@company.com.'
  if (!v.industry) e.industry = 'Choose your industry.'
  if (!v.solution) e.solution = 'Choose a solution of interest.'
  return e
}

export function Contact() {
  const uid = useId()
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<LeadResult | null>(null)
  const demo = isDemoMode()

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const msg = (e as CustomEvent<string>).detail
      setValues((v) => (v.message.trim() ? v : { ...v, message: msg }))
    }
    window.addEventListener('theron:contact', onPrefill)
    return () => window.removeEventListener('theron:contact', onPrefill)
  }, [])

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phase === 'loading') return
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    setPhase('loading')
    try {
      const r = await submitLead({ ...values, fullName: values.fullName.trim(), company: values.company.trim(), email: values.email.trim(), message: values.message.trim(), submittedAt: new Date().toISOString(), source: 'theron-website' })
      setResult(r)
      setPhase('success')
    } catch {
      setPhase('error')
    }
  }

  const field = (k: keyof Values, label: string, required: boolean, control: React.ReactNode) => (
    <div>
      <label htmlFor={`${uid}-${k}`} className="mb-2 block text-sm font-bold">
        {label}
        {required && (
          <span className="text-lime" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {control}
      {errors[k] && (
        <p id={`${uid}-${k}-err`} className="mt-1.5 text-sm font-semibold text-danger">
          {errors[k]}
        </p>
      )}
    </div>
  )
  const a11y = (k: keyof Values, required: boolean) => ({
    id: `${uid}-${k}`,
    name: k,
    value: values[k],
    onChange: set(k),
    required,
    'aria-required': required,
    'aria-invalid': errors[k] ? (true as const) : undefined,
    'aria-describedby': errors[k] ? `${uid}-${k}-err` : undefined,
  })

  return (
    <section id="contact" className="section border-t border-line">
      <div className="wrap grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <h2 className="h-section">Tell us what your cameras should catch.</h2>
          <p className="lede mt-5">Share your site, industry and the events you care about. We will use it to plan a consultation around your setup.</p>

          {demo && (
            <p className="mt-8 rounded-sm border border-amber/40 bg-amber/10 p-4 text-sm leading-relaxed text-fg-2">
              <strong className="text-amber">Demo mode.</strong> No backend is connected yet. Submitting validates your details but sends nothing.
            </p>
          )}

          {(company.email || company.phone || company.address) && (
            <dl className="m-0 mt-8 grid gap-4 text-sm">
              {company.email && (
                <div>
                  <dt className="font-bold text-fg-3">Email</dt>
                  <dd className="m-0 mt-1">
                    <a className="text-lime" href={`mailto:${company.email}`}>
                      {company.email}
                    </a>
                  </dd>
                </div>
              )}
              {company.phone && (
                <div>
                  <dt className="font-bold text-fg-3">Phone</dt>
                  <dd className="m-0 mt-1">{company.phone}</dd>
                </div>
              )}
              {company.address && (
                <div>
                  <dt className="font-bold text-fg-3">Address</dt>
                  <dd className="m-0 mt-1">{company.address}</dd>
                </div>
              )}
            </dl>
          )}
        </Reveal>

        <div className="rounded-md border border-line bg-panel p-6 sm:p-8">
          {phase === 'success' ? (
            <div role="status" className="py-6">
              <CheckCircle2 size={36} className="text-lime" aria-hidden="true" />
              <h3 className="mt-5 text-2xl">{result?.mode === 'live' ? 'Request received.' : 'Demo form complete.'}</h3>
              <p className="mt-3 max-w-md text-fg-2">
                {result?.mode === 'live'
                  ? `Thanks, ${values.fullName.split(' ')[0]}. Our team will follow up at ${values.email}.`
                  : 'This site has no backend connected, so nothing was sent. Once the form is connected to an API, requests will reach the team.'}
              </p>
              <button
                type="button"
                className="btn btn-ghost mt-7"
                onClick={() => {
                  setValues(EMPTY)
                  setPhase('idle')
                  setResult(null)
                }}
              >
                Start another request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate aria-label="Request a consultation" className="grid gap-5">
              {phase === 'error' && (
                <div role="alert" className="flex items-start gap-3 rounded-sm border border-danger/50 bg-danger/10 p-4 text-sm">
                  <TriangleAlert size={18} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
                  <p>We couldn't send your request. Check your connection and try again. Your details are still in the form.</p>
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                {field('fullName', 'Full name', true, <input className="field" type="text" autoComplete="name" {...a11y('fullName', true)} />)}
                {field('company', 'Company name', true, <input className="field" type="text" autoComplete="organization" {...a11y('company', true)} />)}
              </div>
              {field('email', 'Work email', true, <input className="field" type="email" autoComplete="email" {...a11y('email', true)} />)}
              <div className="grid gap-5 sm:grid-cols-2">
                {field(
                  'industry',
                  'Industry',
                  true,
                  <select className="field" {...a11y('industry', true)}>
                    <option value="">Select an industry</option>
                    {INDUSTRY_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>,
                )}
                {field(
                  'solution',
                  'Solution of interest',
                  true,
                  <select className="field" {...a11y('solution', true)}>
                    <option value="">Select a solution</option>
                    {SOLUTION_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>,
                )}
              </div>
              {field('message', 'Message', false, <textarea className="field" rows={4} placeholder="Sites, camera count, events you want to detect" {...a11y('message', false)} />)}
              <button type="submit" className="btn btn-primary w-full sm:w-fit" disabled={phase === 'loading'}>
                {phase === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  'Request a Consultation'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
