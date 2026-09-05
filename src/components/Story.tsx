import { Eyebrow, Lede, Section, SectionTitle } from './ui'
import Icon from './Icon'
import { STORY } from '../data/site'
import { useReveal } from '../lib/motion'

/**
 * ONE WEDDING, START TO FINISH.
 *
 * The gallery is breadth and Films is three embeds. Neither shows one day as a
 * story, and that is the thing a couple is actually trying to imagine: not his
 * greatest hits, but what their own wedding would look like in his hands.
 *
 * Three things this section exists to hold:
 *
 * 1 · IT IS A DAY, NOT A GRID. The beats run in the order they happened, with
 *     the clock time on each one, so reading down it feels like the length of
 *     a wedding. A grid of the same six photographs says nothing about time,
 *     and time is the thing being sold — thirty-one hours of somebody's
 *     attention.
 *
 * 2 · FOUR THOUSAND FRAMES, EIGHT HUNDRED DELIVERED. Those two facts sit next
 *     to each other in the strip on purpose. It is the contact-sheet section
 *     restated as arithmetic, and it is the plainest argument on the page for
 *     why the work costs what it costs.
 *
 * 3 · IT ALTERNATES, IT DOES NOT ZIGZAG. The picture swaps sides each beat so
 *     the eye has somewhere new to go, but only from `lg` up — on a phone an
 *     alternating layout is just an inconsistent one, so it stacks the picture
 *     above the text every time.
 */
export default function Story() {
  const ref = useReveal<HTMLElement>({ stagger: 0.08 })

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

      {/* The slate: the day in numbers, before the day in pictures. */}
      <dl className="reveal mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-line/70 py-6 sm:grid-cols-3 lg:grid-cols-6">
        {STORY.facts.map((fact) => (
          <div key={fact.label}>
            <dt className="tech-sm text-ash/65">{fact.label}</dt>
            <dd className="t-card mt-1.5 font-light text-bone">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <ol className="mt-14 space-y-14 lg:mt-20 lg:space-y-24">
        {STORY.beats.map((beat, i) => (
          <li
            key={beat.title}
            className="reveal grid items-center gap-6 lg:grid-cols-2 lg:gap-14"
          >
            <figure className={i % 2 === 1 ? 'lg:order-2' : undefined}>
              <img
                src={beat.src}
                alt={`${beat.title} — ${STORY.couple}, ${STORY.venue}`}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </figure>

            <div className={i % 2 === 1 ? 'lg:order-1' : undefined}>
              <p className="tech flex items-baseline gap-3 text-amber tabular-nums">
                {beat.time}
                <span className="tech-sm text-ash/60">{beat.day}</span>
              </p>
              <h3 className="t-heading mt-3 font-light text-bone">{beat.title}</h3>
              <p className="t-body mt-3 max-w-xl text-ash">{beat.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <figure className="reveal mt-16 max-w-3xl border-t border-line/70 pt-8">
        <blockquote className="t-quote font-light text-bone/90 italic">
          “{STORY.quote.text}”
        </blockquote>
        <figcaption className="tech-sm mt-4 text-ash">{STORY.quote.name}</figcaption>
      </figure>

      <a
        href={STORY.cta.href}
        className="reveal tech mt-10 inline-flex items-center gap-2.5 border-b border-amber/40 pb-1 text-amber transition-colors duration-200 hover:border-amber"
      >
        <Icon name="play" className="size-3.5" />
        {STORY.cta.label}
      </a>
    </Section>
  )
}
