import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Frame from './gallery/Frame'
import Lightbox from './gallery/Lightbox'
import { Eyebrow, Lede, Section, SectionTitle } from './ui'
import { GALLERY_FILTERS, SHOTS, type GalleryFilter } from '../data/site'
import { gsap, prefersReducedMotion, useReveal } from '../lib/motion'

export default function Gallery() {
  const ref = useReveal<HTMLElement>({ selector: '.reveal', stagger: 0.06 })
  const grid = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<GalleryFilter>('All')
  const [open, setOpen] = useState<number | null>(null)

  const shots = useMemo(
    () => (filter === 'All' ? SHOTS : SHOTS.filter((s) => s.tag === filter)),
    [filter],
  )

  // Re-stagger the tiles whenever the filter changes, so a filter click reads
  // as the grid being re-cut rather than content teleporting.
  useEffect(() => {
    const root = grid.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-tile]',
        { opacity: 0, y: 18, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.035,
          ease: 'expo.out',
        },
      )
    }, root)

    return () => ctx.revert()
  }, [filter])

  const step = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : (i + delta + shots.length) % shots.length)),
    [shots.length],
  )

  return (
    <Section id="work" ref={ref}>
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <Eyebrow>Selected frames</Eyebrow>
          <SectionTitle>The work</SectionTitle>
          <Lede>
            Stills pulled from weddings, pre-weddings and commercial shoots across the last two
            seasons. Tap any frame to see it large.
          </Lede>
        </div>

        <div className="reveal flex flex-wrap gap-2" role="group" aria-label="Filter photographs">
          {GALLERY_FILTERS.map((f) => {
            const active = f === filter
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`tap-44 rounded-full border px-4 py-2 tech-sm transition-all duration-300 ${
                  active
                    ? 'border-amber bg-amber text-ink'
                    : 'border-line text-ash hover:border-amber/50 hover:text-amber'
                }`}
              >
                {f}
              </button>
            )
          })}
        </div>
      </div>

      <div
        ref={grid}
        className="mt-12 grid auto-rows-[6.5rem] grid-cols-2 gap-3 sm:auto-rows-[7.5rem] sm:grid-cols-3 lg:grid-cols-4"
      >
        {shots.map((shot, i) => (
          <Frame key={shot.id} shot={shot} index={i} onOpen={setOpen} />
        ))}
      </div>

      {open !== null && (
        <Lightbox shots={shots} index={open} onClose={() => setOpen(null)} onStep={step} />
      )}
    </Section>
  )
}
