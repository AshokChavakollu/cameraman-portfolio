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
 * Three decisions worth keeping:
 *
 * 1 · WHEN COMES FIRST, AND IT IS SET LIKE IT MATTERS. The column order is
 *     when → what → spec, because the anxiety being answered is about time,
 *     not about resolution. Reading down the left-hand column alone (48 hours,
 *     3 weeks, 5 weeks, 8 weeks) is the whole answer, and it is the only part
 *     most people will read, so the numeral is set at display size in the
 *     reading face with the unit small underneath. It used to run at label
 *     size in wide-tracked caps, the same as every other small label on the
 *     page, which made the one scannable column the least scannable thing.
 *
 * 2 · THE SPEC IS A LIST, NOT A SENTENCE OF DOTS. It was one string joined by
 *     middle dots ("60 to 90 sec · 4K · vertical cut included"), which reads
 *     as a filename. Three facts stacked and right-aligned can be checked one
 *     at a time, which is what a spec is for.
 *
 * 3 · IT IS NOT THE PROCESS SECTION AGAIN. Process is a two-column editorial
 *     rail with a photograph pinned beside it; this is a ruled docket with no
 *     picture in it at all. Two lists that look the same read as one list said
 *     twice, and the fix is that they are shaped differently, not that this
 *     one has an extra column bolted to its right-hand side.
 */
export default function Delivery() {
  const ref = useReveal<HTMLElement>({ stagger: 0.07 })

  return (
    <Section id="delivery" ref={ref}>
      <Eyebrow>{DELIVERY.eyebrow}</Eyebrow>
      <SectionTitle>{DELIVERY.title}</SectionTitle>
      <Lede>{DELIVERY.lede}</Lede>

      <ul className="mt-10 max-w-6xl border-t border-line/70">
        {DELIVERY.items.map((item) => (
          <li
            key={item.title}
            className="reveal group grid gap-x-10 gap-y-4 border-b border-line/70 py-7 transition-colors duration-400 hover:border-amber/35 sm:grid-cols-[7rem_1fr] lg:grid-cols-[8rem_1fr_14rem] lg:py-9"
          >
            {/* The answer most people came for, set to be read across a room. */}
            <p className="flex items-baseline gap-2 lg:block">
              <span className="t-stat block font-light text-amber tabular-nums">
                {item.when.value}
              </span>
              <span className="tech-sm block text-ash/60 lg:mt-2">{item.when.unit}</span>
            </p>

            <div>
              <h3 className="t-heading font-light text-bone">{item.title}</h3>
              <p className="mt-2.5 max-w-2xl t-body text-ash">{item.body}</p>
            </div>

            {/* On a narrow screen the spec sits under the copy in the second
                column rather than starting a third one nothing else uses. */}
            <ul className="flex flex-wrap gap-x-6 gap-y-1.5 sm:col-start-2 lg:col-start-3 lg:block lg:space-y-1.5 lg:text-right">
              {item.spec.map((s) => (
                <li key={s} className="tech-sm text-ash/65">
                  {s}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p className="reveal t-body mt-8 max-w-2xl text-ash">{DELIVERY.note}</p>
    </Section>
  )
}
