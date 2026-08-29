import { useEffect, useRef, useState } from 'react'
import { HERO } from '../../data/site'
import { gsap, prefersReducedMotion } from '../../lib/motion'

/**
 * The rotating hero slogan.
 *
 * Three masked lines that roll out upward and the next set rolls in from
 * below — the same language as the intro animation, so the change reads as the
 * page breathing rather than a widget doing a trick. No dots, no arrows: the
 * words are the content, the carousel is not.
 *
 * Accessibility: the animated block is hidden from assistive tech and a single
 * static <h1> carries the first slogan. Otherwise a screen reader would
 * announce a new headline every five seconds, and a crawler would index
 * whichever line happened to be showing.
 */

const HOLD = 4.8 // seconds a slogan stays up
const LINES = 2

export default function SloganCycle() {
  const root = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const slogans = HERO.slogans

  useEffect(() => {
    if (slogans.length < 2 || prefersReducedMotion()) return

    let alive = true
    const ctx = gsap.context(() => {
      const inner = '.line-mask > span'

      const cycle = () => {
        gsap
          .timeline({ delay: HOLD })
          // Out, top of the mask, fastest line first.
          .to(inner, { yPercent: -115, duration: 0.5, stagger: 0.05, ease: 'power3.in' })
          .add(() => {
            if (alive) setIndex((i) => (i + 1) % slogans.length)
          })
          .set(inner, { yPercent: 115 })
          // In, from below.
          .to(inner, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' })
          .add(() => {
            if (alive) cycle()
          })
      }

      cycle()
    }, root)

    return () => {
      alive = false
      ctx.revert()
    }
  }, [slogans])

  const current = slogans[index]

  return (
    <>
      {/* What screen readers and crawlers get: one stable headline. */}
      <h1 className="sr-only">{slogans[0].join(' ')}</h1>

      <div
        ref={root}
        aria-hidden="true"
        className="mt-6 font-display text-[clamp(2.15rem,5.4vw,3.8rem)] leading-[1.06] font-light tracking-[-0.02em] text-bone"
      >
        {Array.from({ length: LINES }, (_, i) => (
          <span key={i} className="line-mask">
            <span className={i === 1 ? 'text-amber italic' : undefined}>{current[i]}</span>
          </span>
        ))}
      </div>
    </>
  )
}
