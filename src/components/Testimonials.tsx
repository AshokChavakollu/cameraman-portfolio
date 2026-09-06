import { Eyebrow, Section, SectionTitle } from './ui'
import Icon from './Icon'
import { TESTIMONIALS } from '../data/site'
import { useReveal } from '../lib/motion'

export default function Testimonials() {
  const ref = useReveal<HTMLElement>({ stagger: 0.1 })

  return (
    <Section ref={ref} className="border-y border-line/60 bg-char/40">
      <Eyebrow>Couples & clients</Eyebrow>
      <SectionTitle>In their words</SectionTitle>

      <div className="mt-10 grid max-w-[84rem] gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="reveal flex flex-col justify-between rounded-2xl border border-line/70 bg-ink/60 p-7"
          >
            <Icon name="aperture" className="size-6 text-amber/50" strokeWidth={1} />
            {/* Quotes in the display serif — someone else's voice, set apart
                from the sans the rest of the page speaks in. */}
            <blockquote className="mt-6 t-quote font-light text-bone/90 italic">
              “{t.quote}”
            </blockquote>
            {/* The specifics are the testimonial. A frame from their own day,
                the venue and the month turn a nice sentence into a claim that
                could be checked — which is the only reason to believe it. */}
            <figcaption className="mt-7 flex items-center gap-4 border-t border-line/70 pt-5">
              <img
                src={t.frame}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-12 shrink-0 rounded-lg object-cover"
              />
              <span className="min-w-0">
                <span className="block t-card font-light text-bone">{t.name}</span>
                <span className="mt-1 block tech-sm text-ash">
                  {t.venue} · {t.date}
                </span>
                <span className="mt-1 block tech-sm text-amber/75">{t.service}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
