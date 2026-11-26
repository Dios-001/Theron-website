import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { navigateTo, openContact } from '../lib/nav'
import { Logo } from './Logo'

const LINKS = [
  { label: 'Home', id: 'top' },
  { label: 'Solutions', id: 'solutions' },
  { label: 'Technology', id: 'technology' },
  { label: 'Industries', id: 'industries' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    firstLink.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtn.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // Wait a frame so the body scroll lock is released before scrolling.
    requestAnimationFrame(() => navigateTo(id))
  }
  const demo = (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    requestAnimationFrame(() => openContact("I'd like to see a demo of Theron."))
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled || open ? 'border-line bg-ink/80 backdrop-blur-xl' : 'border-transparent bg-ink/30 backdrop-blur-md'
        }`}
      >
        <div className="wrap flex h-16 items-center justify-between">
          <a href="#top" onClick={go('top')} aria-label="Theron, back to top" className="rounded-sm">
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} className="text-sm font-semibold text-fg-2 transition-colors hover:text-lime">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="#contact" onClick={demo} className="btn btn-primary hidden !h-10 !px-5 lg:inline-flex">
              Request a Demo
            </a>
            <button
              ref={menuBtn}
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line-strong text-fg lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside the header: backdrop-filter on the header would otherwise become the containing block for this fixed panel. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-ink/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <nav aria-label="Mobile" className="wrap flex h-full flex-col justify-between pb-10 pt-6">
              <ul className="m-0 list-none divide-y divide-line p-0">
                {LINKS.map((l, i) => (
                  <li key={l.id}>
                    <a ref={i === 0 ? firstLink : undefined} href={`#${l.id}`} onClick={go(l.id)} className="block py-4 text-2xl font-extrabold tracking-tight text-fg">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="#contact" onClick={demo} className="btn btn-primary w-full">
                Request a Demo
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
