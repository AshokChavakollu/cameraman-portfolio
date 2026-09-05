import { Eyebrow, Lede, Section, SectionTitle } from './ui'
import { DELIVERY } from '../data/site'
import { useReveal } from '../lib/motion'

/**
 * WHAT ACTUALLY LANDS — a delivery docket.
 *
 * Services says what a package costs and Process says how the day runs, and
 * between them nothing said what the couple ends up holding. That gap is one
 * of the quiet reasons a couple books the other studio: everyone has been
 * promised a "cinematic film", and none of them know whether that means four
 * minutes or forty, whether their parents can see the photographs, or whether
 * the files still open in five years.
 *
 * Two decisions worth keeping:
 *
 * 1 · WHEN COMES FIRST. The column order is when → what → spec, because the
 *     anxiety being answered is about time, not about resolution. Reading down
 *     the left-hand column alone — 48 hours, 3 weeks, 5 weeks, 8 weeks — is
 *     the whole answer, and it is the only part most people will read.
 *
 * 2 · IT IS NOT THE PROCESS SECTION AGAIN. Process is a numbered rail of five
 *     steps; this is a docket of ruled rows with a spec on the right. Two
 *     lists that look the same read as one list said twice.
 */
export default function Delivery() {
  const ref = useReveal<HTMLElement>({ stagger: 0.07 })

  return (
    <Section id="delivery" ref={ref}>
      <Eyebrow>{DELIVERY.eyebrow}</Eyebrow>
      <SectionTitle>{DELIVERY.title}</SectionTitle>
      <Lede>{DELIVERY.lede}</Lede>

      <ul className="mt-12 max-w-5xl divide-y divide-line/70 border-y border-line/70">
        {DELIVERY.items.map((item) => (
          <li
            key={item.title}
            className="reveal grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[6.5rem_1fr] lg:grid-cols-[7.5rem_1fr_15rem] lg:items-baseline"
          >
            <span className="tech text-amber tabular-nums">{item.when}</span>

            <div>
              <h3 className="t-card font-light text-bone">{item.title}</h3>
              <p className="mt-2 max-w-2xl t-body text-ash">{item.body}</p>
            </div>

            {/* On a narrow screen the spec sits under the copy in the second
                column rather than starting a third one nothing else uses. */}
            <span className="tech-sm text-ash/65 sm:col-start-2 lg:col-start-3 lg:text-right">
              {item.spec}
            </span>
          </li>
        ))}
      </ul>

      <p className="reveal t-body mt-8 max-w-2xl text-ash">{DELIVERY.note}</p>
    </Section>
  )
}
