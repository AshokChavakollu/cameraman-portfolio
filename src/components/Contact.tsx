import { useState, type FormEvent, type ReactNode } from 'react'
import Icon from './Icon'
import { Eyebrow, Lede, Section, SectionTitle } from './ui'
import { SITE, whatsappHref } from '../data/site'
import {
  SHOOT_TYPES,
  enquiryHref,
  enquirySchema,
  toFieldErrors,
  type FieldErrors,
} from '../lib/enquiry'
import { useReveal } from '../lib/motion'

export default function Contact() {
  const ref = useReveal<HTMLElement>({ stagger: 0.07 })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const raw = Object.fromEntries(new FormData(e.currentTarget))
    const parsed = enquirySchema.safeParse(raw)

    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error)
      setErrors(fieldErrors)
      // Send focus to the first thing that is wrong, not to the top of the page.
      const first = Object.keys(fieldErrors)[0]
      if (first) {
        e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      }
      return
    }

    setErrors({})
    setSent(true)
    window.open(enquiryHref(parsed.data), '_blank', 'noopener')
  }

  return (
    <Section id="contact" ref={ref}>
      <div className="grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow>Check a date</Eyebrow>
          <SectionTitle>
            Tell me
            <br />
            about the day
          </SectionTitle>
          <Lede>
            Fill this in and it opens WhatsApp with your details already written out. I reply to
            every enquiry myself, usually within a few hours.
          </Lede>

          <div className="reveal mt-10 space-y-4">
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-4 border-b border-line/70 pb-4 text-bone transition-colors hover:text-amber"
            >
              <Icon name="phone" className="size-5 text-amber" />
              <span className="t-body tracking-[0.02em]">{SITE.phoneDisplay}</span>
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-4 border-b border-line/70 pb-4 text-bone transition-colors hover:text-amber"
            >
              <Icon name="mail" className="size-5 text-amber" />
              <span className="t-body tracking-[0.02em]">{SITE.email}</span>
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 border-b border-line/70 pb-4 text-bone transition-colors hover:text-amber"
            >
              <Icon name="whatsapp" className="size-5 text-amber" />
              <span className="t-body tracking-[0.02em]">Message on WhatsApp</span>
            </a>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="reveal rounded-2xl border border-line/70 bg-char/50 p-6 sm:p-9"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" name="name" error={errors.name}>
              <input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Meghana"
                className={inputClass(!!errors.name)}
              />
            </Field>

            <Field label="Phone" name="phone" error={errors.phone}>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                className={inputClass(!!errors.phone)}
              />
            </Field>

            <Field label="City of the shoot" name="city" error={errors.city}>
              <input
                id="city"
                name="city"
                placeholder="Hyderabad"
                className={inputClass(!!errors.city)}
              />
            </Field>

            <Field label="Date" name="date" error={errors.date}>
              <input id="date" name="date" type="date" className={inputClass(!!errors.date)} />
            </Field>

            <div className="sm:col-span-2">
              <Field label="What are we shooting?" name="type" error={errors.type}>
                <select
                  id="type"
                  name="type"
                  defaultValue={SHOOT_TYPES[0]}
                  className={inputClass(!!errors.type)}
                >
                  {SHOOT_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-ink">
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Anything else" name="message" error={errors.message} optional>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Three functions across two days, roughly 400 guests, venue not fixed yet."
                  className={`${inputClass(!!errors.message)} resize-y`}
                />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-amber px-6 py-4 t-label font-semibold tracking-[0.04em] text-ink transition-all duration-300 hover:bg-amber-glow hover:shadow-[0_0_38px_-10px_var(--color-amber)]"
          >
            <Icon name="whatsapp" className="size-4" />
            Send on WhatsApp
          </button>

          <p aria-live="polite" className="mt-4 text-center tech text-ash ">
            {sent
              ? 'WhatsApp opened — hit send there and it reaches me'
              : 'No booking fee to check a date'}
          </p>
        </form>
      </div>
    </Section>
  )
}

const inputClass = (invalid: boolean) =>
  `w-full rounded-lg border bg-ink/70 px-4 py-3 t-body text-bone placeholder:text-ash/65 transition-colors duration-200 focus:border-amber focus:outline-none ${
    invalid ? 'border-rec/70' : 'border-line'
  }`

function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string
  name: string
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 flex items-baseline gap-2 tech-sm text-ash ">
        {label}
        {optional && <span className="text-ash/65 normal-case">(optional)</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 tech-sm text-rec">{error}</p>}
    </div>
  )
}
