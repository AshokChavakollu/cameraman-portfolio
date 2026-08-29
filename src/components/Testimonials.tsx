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

      <div className="mt-12 grid max-w-[84rem] gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="reveal flex flex-col justify-between rounded-2xl border border-line/70 bg-ink/60 p-7"
          >
            <Icon name="aperture" className="size-6 text-amber/50" strokeWidth={1} />
            {/* Quotes in the display serif — someone else's voice, set apart
                from the sans the rest of the page speaks in. */}
            <blockquote className="mt-6 font-display text-[1.28rem] leading-[1.5] font-light text-bone/90 italic">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-7 border-t border-line/70 pt-4">
              <span className="block font-display text-[1.2rem] font-light text-bone">
                {t.name}
              </span>
              <span className="mt-0.5 block tech-sm text-ash ">{t.detail}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
