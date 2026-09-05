import Icon, { type IconName } from './Icon'
import { Eyebrow, Lede, Section, SectionTitle } from './ui'
import { SERVICES, whatsappHref } from '../data/site'
import { useReveal } from '../lib/motion'

export default function Services() {
  const ref = useReveal<HTMLElement>({ stagger: 0.1 })

  return (
    <Section id="services" ref={ref}>
      <Eyebrow>What I shoot</Eyebrow>
      <SectionTitle>Packages</SectionTitle>
      <Lede>
        Prices are a starting point, not a wall. Tell me your dates and how many functions and I
        will send a written quote the same day — no meeting required to get a number.
      </Lede>

      <div className="mt-14 grid max-w-6xl gap-4 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <article
            key={s.id}
            className="reveal group relative overflow-hidden rounded-2xl border border-line/70 bg-char/50 p-7 transition-colors duration-400 hover:border-amber/45 sm:p-9"
          >
            {/* Amber wash that rises on hover — the card lights up like a lamp
 being brought in, not a colour swap. */}
            <span className="pointer-events-none absolute inset-x-0 -bottom-24 h-40 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(208,164,92,0.10),transparent_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex items-start justify-between gap-6">
              <Icon
                name={s.icon as IconName}
                className="size-9 text-amber transition-transform duration-500 group-hover:-rotate-6"
                strokeWidth={1}
              />
              <span className="tech text-ash ">{s.price}</span>
            </div>

            <h3 className="relative mt-7 t-heading font-light text-bone">
              {s.title}
            </h3>
            <p className="relative mt-3 t-body text-ash">{s.body}</p>

            <ul className="relative mt-6 flex flex-wrap gap-2">
              {s.includes.map((inc) => (
                <li
                  key={inc}
                  className="rounded-full border border-line px-3 py-1.5 tech-sm text-ash/90 "
                >
                  {inc}
                </li>
              ))}
            </ul>

            <a
              href={whatsappHref(`Hi Aditya, I'd like a quote for: ${s.title}.`)}
              target="_blank"
              rel="noreferrer"
              className="relative mt-7 inline-flex items-center gap-2 tech text-amber transition-colors hover:text-amber-glow"
            >
              Get a quote
              <Icon
                name="arrow"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </article>
        ))}
      </div>
    </Section>
  )
}
