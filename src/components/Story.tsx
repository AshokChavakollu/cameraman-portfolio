import { Fragment, useEffect, useRef } from 'react'
import { Eyebrow, Lede, Section, SectionTitle } from './ui'
import Icon from './Icon'
import { STORY } from '../data/site'
import { gsap, useCountUp, useReveal } from '../lib/motion'

/**
 * ONE WEDDING, START TO FINISH.
 *
 * The gallery is breadth and Films is three embeds. Neither shows one day as a
 * story, and that is the thing a couple is actually trying to imagine: not his
 * greatest hits, but what their own wedding would look like in his hands.
 *
 * Four things this section exists to hold:
 *
 * 1 · THE DAY RUNS SIDEWAYS. The beats are pinned and panned horizontally, so
 *     scroll distance IS elapsed time: you travel from a courtyard at 06:40 to
 *     a rooftop two nights later, and the wedding takes as long to get through
 *     as it takes to scroll. Stacked vertically the same six frames are a list
 *     of things that happened. Laid end to end they are a day going past.
 *
 * 2 · THE ARITHMETIC IS THE HEADLINE. Four thousand one hundred and eighty
 *     frames down to eight hundred and twelve is the plainest argument on the
 *     page for what the work costs, so it counts up at display size rather
 *     than sitting in a six-cell grid beside the film's runtime. The other
 *     four facts stay quiet underneath.
 *
 * 3 · THE DAYS ARE CHAPTERED, NOT LABELLED. A hairline stands between the last
 *     beat of one day and the first of the next, and the day itself rides on
 *     each card next to the clock. Three heavy day banners inside a strip this
 *     narrow would be three interruptions in a section whose whole argument is
 *     that it does not stop.
 *
 * 4 · THE HIJACK IS THE ENHANCEMENT, NOT THE FLOOR. Pinning only happens at
 *     `lg` and up, and only when motion is welcome. Everywhere else the same
 *     markup is a native scroll-snap strip the visitor flicks through, which
 *     is the behaviour a phone already has and the one a screen reader and a
 *     keyboard can both follow. Nothing is unreachable if the pan never runs.
 */

type Beat = (typeof STORY.beats)[number]

/** The beats are already in order, so the days are runs rather than buckets. */
const DAYS = STORY.beats.reduce<{ day: string; beats: Beat[] }[]>((acc, beat) => {
  const current = acc[acc.length - 1]
  if (current && current.day === beat.day) current.beats.push(beat)
  else acc.push({ day: beat.day, beats: [beat] })
  return acc
}, [])

export default function Story() {
  const ref = useReveal<HTMLElement>({ stagger: 0.08 })
  const stage = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const shot = useCountUp(STORY.arithmetic.shot.value)
  const delivered = useCountUp(STORY.arithmetic.delivered.value)

  /**
   * The pan. `matchMedia` carries both gates — width and motion appetite — so
   * there is one place that decides whether this section hijacks the scroll,
   * and one revert that puts every inline style back when it stops.
   *
   * The stage is height-and-overflow-capped from here rather than from a class
   * so the un-panned floor stays a plain scrolling strip: if the pin never
   * runs, nothing has clipped the cards out of reach.
   */
  useEffect(() => {
    const pin = stage.current
    const port = viewport.current
    const strip = track.current
    const bar = fill.current
    if (!pin || !port || !strip || !bar) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      pin.style.height = '100dvh'
      pin.style.overflow = 'hidden'
      port.style.overflowX = 'visible'

      // Measured against the STAGE, which is the box that clips: the viewport
      // is deliberately wider than it (negative margins cancel the section's
      // padding), so measuring against that would stop the pan a gutter short
      // and leave the last frame hanging off the right edge.
      const distance = () => Math.max(0, strip.scrollWidth - pin.clientWidth)

      gsap.to(strip, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
        },
      })

      return () => {
        pin.style.height = ''
        pin.style.overflow = ''
        port.style.overflowX = ''
      }
    })

    // Desktop, motion declined: the rail is a spent clock, not a dead one.
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: reduce)', () => {
      gsap.set(bar, { scaleX: 1 })
    })

    return () => mm.revert()
  }, [])

  return (
    <Section id="story" ref={ref} className="border-y border-line/60 bg-char/30">
      <div className="max-w-3xl">
        <Eyebrow>{STORY.eyebrow}</Eyebrow>
        <SectionTitle>{STORY.couple}</SectionTitle>
        <p className="reveal tech mt-4 text-amber/85">
          {STORY.venue} · {STORY.date}
        </p>
        <Lede>{STORY.lede}</Lede>
      </div>

      {/* The slate. The funnel first at display size, the rest underneath. */}
      <div className="reveal mt-10 border-y border-line/70 py-7 lg:mt-12">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-16">
          <div className="flex items-end gap-5 sm:gap-8">
            <div>
              <p className="tech-sm text-ash/65">{STORY.arithmetic.shot.label}</p>
              <p className="t-stat mt-2.5 font-light text-bone tabular-nums">
                <span ref={shot}>{STORY.arithmetic.shot.value.toLocaleString('en-IN')}</span>
              </p>
            </div>
            <span aria-hidden className="mb-2.5 shrink-0 text-amber/45">
              <Icon name="arrow" className="size-5" strokeWidth={1.25} />
            </span>
            <div>
              <p className="tech-sm text-ash/65">{STORY.arithmetic.delivered.label}</p>
              <p className="t-stat mt-2.5 font-light text-amber tabular-nums">
                <span ref={delivered}>
                  {STORY.arithmetic.delivered.value.toLocaleString('en-IN')}
                </span>
              </p>
            </div>
          </div>

          <p className="t-body max-w-sm text-ash lg:justify-self-end lg:text-right">
            {STORY.arithmetic.note}
          </p>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line/40 pt-6 sm:grid-cols-4">
          {STORY.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="tech-sm text-ash/65">{fact.label}</dt>
              <dd className="t-card mt-1.5 font-light text-bone">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* The day, end to end. Pinned and panned at lg, flicked below it. */}
      <div ref={stage} className="mt-12 flex flex-col justify-center lg:mt-0">
        <div
          ref={viewport}
          className="-mx-5 snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-5 sm:-mx-8 sm:px-8 xl:-mx-14 xl:px-14"
        >
          <ol className="flex items-stretch gap-6 lg:gap-12">
            {DAYS.map(({ day, beats }, d) => (
              <Fragment key={day}>
                {d > 0 && (
                  <li aria-hidden className="w-px shrink-0 self-stretch bg-line/70 lg:mx-2" />
                )}
                {beats.map((beat) => (
                  <li
                    key={beat.title}
                    className="w-[78vw] shrink-0 snap-center sm:w-[52vw] lg:w-[25rem] lg:snap-align-none"
                  >
                    <p className="tech flex items-baseline gap-3 text-amber tabular-nums">
                      {beat.time}
                      <span className="tech-sm text-ash/60">{day}</span>
                    </p>

                    <figure className="mt-4 overflow-hidden bg-char lg:mt-5">
                      <img
                        src={beat.src}
                        alt={`${beat.title}, ${STORY.couple}, ${STORY.venue}`}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/5] w-full object-cover lg:aspect-auto lg:h-[46vh]"
                      />
                    </figure>

                    <h3 className="t-heading mt-5 font-light text-bone">{beat.title}</h3>
                    <p className="t-body mt-2.5 text-ash">{beat.body}</p>
                  </li>
                ))}
              </Fragment>
            ))}
          </ol>
        </div>

        {/* The clock. It fills with the pan, so the bar is elapsed time. */}
        <div aria-hidden className="mt-8 hidden h-px bg-line/70 lg:block">
          <span ref={fill} className="block h-px origin-left scale-x-0 bg-amber/70" />
        </div>
      </div>

      <figure className="reveal mt-12 max-w-3xl border-t border-line/70 pt-7 lg:mt-16">
        <blockquote className="t-quote font-light text-bone/90 italic">
          “{STORY.quote.text}”
        </blockquote>
        <figcaption className="tech-sm mt-5 text-ash">
          {STORY.quote.name}
          <span className="text-ash/55"> · {STORY.quote.role}</span>
        </figcaption>
      </figure>

      <a
        href={STORY.cta.href}
        className="reveal tech mt-8 inline-flex items-center gap-2.5 border-b border-amber/40 pb-1 text-amber transition-colors duration-200 hover:border-amber"
      >
        <Icon name="play" className="size-3.5" />
        {STORY.cta.label}
      </a>
    </Section>
  )
}
