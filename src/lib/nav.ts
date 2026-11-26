const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Smooth-scroll to a section id ('top' for the page top). Leaves legal pages first if needed. */
export function navigateTo(id: string) {
  const go = () => {
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior })
      history.replaceState(null, '', window.location.pathname + window.location.search)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
    history.replaceState(null, '', `#${id}`)
  }
  if (window.location.hash.startsWith('#/')) {
    history.replaceState(null, '', window.location.pathname)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    setTimeout(go, 80)
  } else {
    go()
  }
}

export type DashboardTarget = { view: string; category?: string }

/** Scroll to the dashboard preview and switch it to a view (used by "Learn More" links). */
export function openDashboard(target: DashboardTarget) {
  window.dispatchEvent(new CustomEvent<DashboardTarget>('theron:dashboard', { detail: target }))
  navigateTo('dashboard')
}

/** Scroll to the contact form, optionally pre-filling a starter message. */
export function openContact(message?: string) {
  if (message) window.dispatchEvent(new CustomEvent<string>('theron:contact', { detail: message }))
  navigateTo('contact')
}
