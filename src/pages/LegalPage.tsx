import { useEffect } from 'react'
import { navigateTo } from '../lib/nav'

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      ['What this covers', 'How Theron handles information collected through this website, such as details entered in the contact form.'],
      ['What we collect', 'Only what you type into the contact form: your name, company, work email, industry, solution of interest and message. [Confirm with legal: analytics, cookies and processors.]'],
      ['How we use it', 'To respond to your request and plan a consultation. [Confirm with legal: retention period and lawful basis.]'],
      ['Your choices', 'You can ask us to access or delete your details. [Add the contact route once real contact details exist.]'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    sections: [
      ['Using this website', 'This website describes Theron and its solutions. The dashboard preview uses simulated sample data and is not connected to any camera or customer account.'],
      ['No guarantees', 'Descriptions of detection capabilities are general. Real-world performance depends on camera quality, placement, lighting and configuration, and Theron supports human decision-making; it does not replace it.'],
      ['Changes', 'These terms may change. [Confirm with legal: governing law, liability and update process.]'],
    ],
  },
} as const

export function LegalPage({ kind }: { kind: keyof typeof CONTENT }) {
  const page = CONTENT[kind]
  useEffect(() => {
    document.title = `${page.title} | Theron`
    return () => {
      document.title = 'Theron | AI Computer Vision & Intelligent Surveillance'
    }
  }, [page.title])

  return (
    <div className="wrap pb-24 pt-32">
      <h1 className="h-section">{page.title}</h1>
      <p className="mt-6 max-w-2xl rounded-sm border border-amber/40 bg-amber/10 p-4 text-sm leading-relaxed text-fg-2">
        <strong className="text-amber">Draft placeholder.</strong> This text is not legal advice and must be replaced with legally reviewed content before launch.
      </p>
      <div className="mt-10 grid max-w-2xl gap-8">
        {page.sections.map(([h, p]) => (
          <section key={h}>
            <h2 className="text-xl tracking-tight">{h}</h2>
            <p className="mt-2 leading-relaxed text-fg-2">{p}</p>
          </section>
        ))}
      </div>
      <button type="button" className="btn btn-ghost mt-12" onClick={() => navigateTo('top')}>
        Back to home
      </button>
    </div>
  )
}
