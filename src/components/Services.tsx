import Icon, { type IconName } from './Icon'
import { Eyebrow, Lede, Section, SectionTitle } from './ui'
import { SERVICES, whatsappHref } from '../data/site'
import { useReveal } from '../lib/motion'

/**
 * PACKAGES.
 *
 * Four things this file exists to hold:
 *
 * 1 · THE WEDDING FILM IS NOT A QUARTER OF THIS SECTION. It was, and a
 *     four-up grid of identical cards gave a ₹1,85,000 wedding and a
 *     conference recap the same weight, the same width and the same picture of
 *     nothing. The flagship is now one wide panel with a photograph in it and
 *     the other three sit under it as a row. The hierarchy is the argument.
 *
 * 2 · A PACKAGE IS A PICTURE, NOT A PARAGRAPH. Every card used to be a stroke
 *     icon over body copy on a tinted rectangle, on a site whose entire
 *     product is photography. Each package carries a frame of the kind of work
 *     it buys, which is both the most persuasive thing available and the
 *     cheapest to be honest about.
 *
 * 3 · THE PRICE IS SET TO BE READ. It ran as one small wide-tracked line in
 *     the corner at the same size as everything else. A price is the string a
 *     visitor came to find: the qualifier now sits small above the number, and
 *     the number is set in the reading face with tabular figures.
 *
 * 4 · NO PILLS FOR THINGS THAT DO NOT CLICK. What is included used to be
 *     rounded-full chips, which is this site's button shape: sixteen of them
 *     across four cards read as tag soup and, worse, as sixteen controls that
 *     do nothing. They are a list now, marked with the same brass hairline the
 *     eyebrow uses.
 */

const [FLAGSHIP, ...REST] = SERVICES

/** The brass hairline from `Eyebrow`, at list size. */
function Mark() {
  return <span aria-hidden className="mt-[0.62em] h-px w-2.5 shrink-0 bg-amber/45" />
}

function Price({ lead, value, big }: { lead: string; value: string; big?: boolean }) {
  return (
    <p className="shrink-0 text-right">
      {lead && <span className="tech-sm block text-ash/60">{lead}</span>}
      <span
        className={`mt-1.5 block tabular-nums text-amber ${big ? 't-card' : 't-body font-medium'}`}
      >
        {value}
      </span>
    </p>
  )
}

function Includes({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 grid gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 t-body text-ash">
          <Mark />
          {item}
        </li>
      ))}
    </ul>
  )
}

function Quote({ title }: { title: string }) {
  return (
    <a
      href={whatsappHref(`Hi Aditya, I'd like a quote for: ${title}.`)}
      target="_blank"
      rel="noreferrer"
      className="mt-7 inline-flex items-center gap-2 tech text-amber transition-colors duration-200 hover:text-amber-glow"
    >
      Get a quote
      <Icon
        name="arrow"
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
      />
    </a>
  )
}

/** The amber lamp that comes up under a card on hover. */
function Wash() {
  return (
    <span className="pointer-events-none absolute inset-x-0 -bottom-24 h-40 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(208,164,92,0.10),transparent_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
  )
}

export default function Services() {
  const ref = useReveal<HTMLElement>({ stagger: 0.1 })

  return (
    <Section id="services" ref={ref}>
      <Eyebrow>What I shoot</Eyebrow>
      <SectionTitle>Packages</SectionTitle>
      <Lede>
        Prices are a starting point, not a wall. Tell me your dates and how many functions and I
        will send a written quote the same day. No meeting required to get a number.
      </Lede>

      {/* ── The flagship ── */}
      <article className="reveal group relative mt-10 grid overflow-hidden rounded-2xl border border-line/70 bg-char/50 transition-colors duration-400 hover:border-amber/45 lg:grid-cols-[1.1fr_1fr] lg:items-stretch">
        <Wash />

        <figure className="relative overflow-hidden bg-char lg:h-full">
          <img
            src={FLAGSHIP.image}
            alt={`${FLAGSHIP.title}, Falaknuma Palace`}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03] lg:h-full lg:aspect-auto"
          />
        </figure>

        <div className="relative flex flex-col justify-center p-7 sm:p-9 lg:p-10">
          <div className="flex items-start justify-between gap-6 border-b border-line/60 pb-5">
            <h3 className="flex items-center gap-3 t-heading font-light text-bone">
              <Icon
                name={FLAGSHIP.icon as IconName}
                className="size-5 shrink-0 text-amber"
                strokeWidth={1.25}
              />
              {FLAGSHIP.title}
            </h3>
            <Price lead={FLAGSHIP.price.lead} value={FLAGSHIP.price.value} big />
          </div>

          <p className="mt-5 t-body text-ash">{FLAGSHIP.body}</p>
          <Includes items={FLAGSHIP.includes} />
          <Quote title={FLAGSHIP.title} />
        </div>
      </article>

      {/* ── The rest, three across ── */}
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {REST.map((s) => (
          <article
            key={s.id}
            className="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-line/70 bg-char/50 transition-colors duration-400 hover:border-amber/45"
          >
            <Wash />

            <figure className="relative overflow-hidden bg-char">
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                decoding="async"
                className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
              />
            </figure>

            <div className="relative flex flex-1 flex-col p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-line/60 pb-4">
                <h3 className="flex items-center gap-2.5 t-card font-light text-bone">
                  <Icon
                    name={s.icon as IconName}
                    className="size-4 shrink-0 text-amber"
                    strokeWidth={1.25}
                  />
                  {s.title}
                </h3>
                <Price lead={s.price.lead} value={s.price.value} />
              </div>

              <p className="mt-4 t-body text-ash">{s.body}</p>
              <Includes items={s.includes} />

              {/* Pushed down so the four links sit on one line across the row
                  however unevenly the bodies wrap. */}
              <div className="mt-auto">
                <Quote title={s.title} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
