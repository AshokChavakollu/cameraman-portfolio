import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/motion'

/** A film strip filling as you scroll — the page's own timeline scrubber. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bar.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        },
      )
    })

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 bg-transparent">
      <div ref={bar} className="h-full w-full origin-left bg-amber/80" />
    </div>
  )
}
