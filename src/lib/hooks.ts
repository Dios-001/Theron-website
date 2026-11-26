import { useEffect, useRef, useState } from 'react'

const pad = (n: number) => String(n).padStart(2, '0')

/** Wall-clock time as HH:MM:SS, ticking every second. */
export function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

const reduceMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Animates a number toward `value`; jumps instantly when reduced motion is requested. */
export function useCountUp(value: number, duration = 700) {
  const [shown, setShown] = useState(0)
  const current = useRef(0)
  useEffect(() => {
    if (reduceMotion()) {
      current.current = value
      setShown(value)
      return
    }
    const from = current.current
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      current.current = from + (value - from) * (1 - Math.pow(1 - p, 3))
      setShown(current.current)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return shown
}
