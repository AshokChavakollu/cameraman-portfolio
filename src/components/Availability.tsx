import { Eyebrow, Lede, Section, SectionTitle } from './ui'
import Icon from './Icon'
import { AVAILABILITY, type MonthStatus, whatsappHref } from '../data/site'
import { useReveal } from '../lib/motion'

/**
 * WHAT'S STILL OPEN.
 *
 * The site's main call to action is "Check my dates" and the hero says
 * "Available for 2026 dates" — and until this section there was nowhere on the
 * site to check anything. The first question every couple asks had no answer
 * on the page at all.
 *
 * Three things this section exists to do:
 *
 * 1 · ANSWER THE QUESTION. A month at a glance: open, nearly gone, or gone.
 *
 * 2 · CARRY THE DATE INTO THE ENQUIRY. An open month is a link that opens
 *     WhatsApp with that month already in the message and the sentence left
 *     hanging on "our wedding is on " — so the reply comes back with a date in
 *     it instead of "hi, are you free?".
 *
 * 3 · SAY WHAT ACTUALLY HOLDS A DATE. Scarcity that is not backed by a term is
 *     a sales trick; the line under the strip says an enquiry reserves nothing
 *     and the advance does.
 *
 * A booked month is deliberately NOT a link and not a disabled button — there
 * is nothing to do with it, so it is plain text that reads as closed. A
 * disabled control invites clicking and then refuses, which is worse than a
 * label.
 */

const A = AVAILABILITY

const TONE: Record<MonthStatus, { tile: string; label: string }> = {
  open: {
    tile: 'border-amber/45 bg-amber/[0.06] hover:border-amber hover:bg-amber/12',
    label: 'text-amber',
  },
  few: {
    tile: 'border-rec/40 bg-rec/[0.06] hover:border-rec/70 hover:bg-rec/12',
    label: 'text-rec/90',
  },
  booked: {
    tile: 'border-line/60 bg-transparent',
    label: 'text-ash/55',
  },
}

export default function Availability() {
  const ref = useReveal<HTMLElement>()

  return (
    <Section id="dates" ref={ref} className="border-y border-line/60 bg-char/30">
      <div className="max-w-2xl">
        <Eyebrow>{A.eyebrow}</Eyebrow>
        <SectionTitle>{A.title}</SectionTitle>
        <Lede>{A.lede}</Lede>
      </div>

      <ul className="reveal mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-12 lg:grid-cols-7">
        {A.months.map((month) => {
          const tone = TONE[month.status]
          const status =
            month.status === 'few'
              ? `${month.left} left`
              : month.status === 'open'
                ? A.legend.open
                : A.legend.booked

          const body = (
            <>
              <span className="t-heading block font-light text-bone">{month.short}</span>
              <span className="tech-sm mt-1 block text-ash/65 tabular-nums">{month.year}</span>
              <span className={`tech-sm mt-5 block ${tone.label}`}>{status}</span>
            </>
          )

          // Rule 2: the month travels with the enquiry.
          const message = A.ask
            .replace('{month}', month.label)
            .replace('{year}', String(month.year))

          return (
            <li key={`${month.short}-${month.year}`}>
              {month.status === 'booked' ? (
                <div className={`block rounded-xl border p-4 sm:p-5 ${tone.tile}`}>{body}</div>
              ) : (
                <a
                  href={whatsappHref(message)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Ask about ${month.label} ${month.year} on WhatsApp — ${status}`}
                  className={`block rounded-xl border p-4 transition-colors duration-300 sm:p-5 ${tone.tile}`}
                >
                  {body}
                </a>
              )}
            </li>
          )
        })}
      </ul>

      <div className="reveal mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line/70 pt-5">
        <Key className="bg-amber" label={A.legend.open} />
        <Key className="bg-rec" label={A.legend.few} />
        <Key className="bg-line" label={A.legend.booked} />
        <span className="tech-sm ml-auto flex items-center gap-2 text-ash/65">
          <Icon name="whatsapp" className="size-3.5 text-amber/70" />
          Tap a month to ask about it
        </span>
      </div>

      <p className="reveal t-body mt-5 max-w-2xl text-ash">
        {A.terms} <span className="text-ash/65">{A.updated}.</span>
      </p>
    </Section>
  )
}

function Key({ className, label }: { className: string; label: string }) {
  return (
    <span className="tech-sm flex items-center gap-2.5 text-ash/70">
      <span className={`size-2 rounded-full ${className}`} />
      {label}
    </span>
  )
}
