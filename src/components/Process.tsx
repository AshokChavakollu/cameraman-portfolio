import { Eyebrow, Lede, Section, SectionTitle } from './ui'
import { PROCESS } from '../data/site'
import { useReveal } from '../lib/motion'

/** A call sheet: five steps down a strip of film, numbered like slate takes. */
export default function Process() {
  const ref = useReveal<HTMLElement>({ stagger: 0.09 })

  return (
    <Section id="process" ref={ref}>
      <Eyebrow>From enquiry to delivery</Eyebrow>
      <SectionTitle>How it runs</SectionTitle>
      <Lede>
        Nobody enjoys chasing a vendor for updates. This is the whole sequence, written down, so you
        always know what happens next and when.
      </Lede>

      <ol className="relative mt-14 max-w-4xl">
        {/* The strip the steps hang off */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[1.35rem] w-px bg-line sm:left-[2.1rem]"
        />

        {PROCESS.map((p) => (
          <li
            key={p.step}
            className="reveal relative grid grid-cols-[3rem_1fr] gap-5 pb-10 sm:grid-cols-[4.5rem_1fr] sm:gap-8"
          >
            <div className="relative">
              <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-amber/40 bg-ink text-[0.72rem] font-medium tracking-[0.14em] text-amber tabular-nums sm:size-[4.25rem] sm:text-[0.8rem]">
                {p.step}
              </span>
            </div>

            <div className="pt-2">
              <h3 className="font-display text-[1.4rem] font-light text-bone sm:text-[1.7rem]">
                {p.title}
              </h3>
              <p className="mt-2 max-w-2xl text-[0.95rem] leading-[1.7] text-ash">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
