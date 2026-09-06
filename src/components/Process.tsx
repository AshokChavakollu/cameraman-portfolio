import { Eyebrow, Lede, Section, SectionTitle } from './ui'
import { PROCESS, PROCESS_FRAME } from '../data/site'
import { useReveal } from '../lib/motion'

/**
 * HOW IT RUNS — the five steps, on a strip.
 *
 * Three things this file exists to hold:
 *
 * 1 · THE NUMBERS ARE SLATE MARKS, NOT STEP BUBBLES. They were 68px outlined
 *     circles running down the middle of the page, which is the shape every
 *     "our process" section on the internet is wearing, and they were the
 *     largest thing in the section while carrying the least: the titles
 *     already say the order. They are small rectangles now, the shape of the
 *     slate that gets clapped in front of a lens, and they sit on the rail
 *     rather than being the rail.
 *
 * 2 · IT IS A COLUMN BESIDE A FRAME, NOT A LIST DOWN THE MIDDLE. Delivery is
 *     also five things in order, and stacked full-width they were the same
 *     section twice with different words. The header and one photograph pin
 *     themselves on the left while the steps run past on the right, so the two
 *     sections do not share a silhouette. Delivery, in exchange, has no
 *     picture in it at all.
 *
 * 3 · THE PIN IS SIZED TO STAY PINNED. The left column is capped short enough
 *     to fit a laptop viewport with the steps still travelling next to it; a
 *     sticky column taller than the screen just scrolls like everything else
 *     and the effect is paid for without being had.
 */
export default function Process() {
  const ref = useReveal<HTMLElement>({ stagger: 0.09 })

  return (
    <Section id="process" ref={ref}>
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-24">
          <Eyebrow>From enquiry to delivery</Eyebrow>
          <SectionTitle>How it runs</SectionTitle>
          <Lede>
            Nobody enjoys chasing a vendor for updates. This is the whole sequence, written down, so
            you always know what happens next and when.
          </Lede>

          <figure className="reveal mt-8 overflow-hidden rounded-xl bg-char">
            <img
              src={PROCESS_FRAME.src}
              alt={PROCESS_FRAME.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover lg:aspect-[3/2]"
            />
          </figure>
        </div>

        <ol className="relative space-y-9 lg:space-y-11">
          {/* The strip the marks hang off. Inset top and bottom so it starts
              and stops inside the first and last mark, not past them. */}
          <span
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-[1.125rem] w-px bg-line/70"
          />

          {PROCESS.map((p) => (
            <li key={p.step} className="reveal relative grid grid-cols-[2.25rem_1fr] gap-5 sm:gap-7">
              <span className="relative z-10 flex h-6 w-9 items-center justify-center border border-amber/35 bg-ink tech-sm text-amber tabular-nums">
                {p.step}
              </span>

              <div className="-mt-1">
                <h3 className="t-heading font-light text-bone">{p.title}</h3>
                <p className="mt-2.5 max-w-2xl t-body text-ash">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
