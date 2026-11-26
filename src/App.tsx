import { MotionConfig } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { About } from './components/About'
import { Benefits } from './components/Benefits'
import { Contact } from './components/Contact'
import { CtaSection } from './components/CtaSection'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Industries } from './components/Industries'
import { Navbar } from './components/Navbar'
import { Reveal } from './components/Reveal'
import { Solutions } from './components/Solutions'
import { Technology } from './components/Technology'
import { LegalPage } from './pages/LegalPage'

// Recharts is heavy, so the dashboard is loaded as its own chunk.
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'))

type Route = 'home' | 'privacy' | 'terms'
const getRoute = (): Route => (window.location.hash === '#/privacy' ? 'privacy' : window.location.hash === '#/terms' ? 'terms' : 'home')

export default function App() {
  const [route, setRoute] = useState<Route>(getRoute)

  useEffect(() => {
    const onChange = () => {
      const next = getRoute()
      setRoute(next)
      if (next !== 'home') window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    onChange()
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only z-[60] rounded-sm bg-lime px-4 py-2 text-sm font-bold text-[#07110a] focus:not-sr-only focus:fixed focus:left-3 focus:top-3" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        {route === 'home' ? (
          <>
            <Hero />
            <Solutions />
            <HowItWorks />
            <section id="dashboard" className="section" aria-labelledby="dashboard-heading">
              <div className="wrap">
                <Reveal>
                  <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <div>
                      <h2 id="dashboard-heading" className="h-section">
                        One Dashboard for Every Camera.
                      </h2>
                      <p className="lede mt-5">Review detections, filter by severity or camera, and work through events in one place. Try the controls below.</p>
                    </div>
                    <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-sm border border-lime/40 bg-lime/10 px-3 py-2 text-sm font-bold text-lime">
                      <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden="true" />
                      Interactive Demo — Sample Data
                    </span>
                  </div>
                </Reveal>
                <div className="mt-12">
                  <Suspense fallback={<div className="panel flex h-[640px] items-center justify-center text-sm text-fg-3" role="status">Loading dashboard preview…</div>}>
                    <Dashboard />
                  </Suspense>
                  <p className="mt-4 text-sm text-fg-3">All cameras, events, counts and rates in this preview are simulated for illustration. They are not live data and not performance figures.</p>
                </div>
              </div>
            </section>
            <Industries />
            <Benefits />
            <Technology />
            <About />
            <CtaSection />
            <Contact />
          </>
        ) : (
          <LegalPage kind={route} />
        )}
      </main>
      <Footer />
    </MotionConfig>
  )
}
