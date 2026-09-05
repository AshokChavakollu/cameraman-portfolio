import type { ReactNode } from 'react'
import Icon from './Icon'

/**
 * Shared shells, so every section keeps one rhythm of margin and type.
 *
 * The scale is the one from the Livin Studio site: a light Cormorant display at
 * clamp(2.1rem, 4.6vw, 3.6rem) for section titles, Manrope at 0.95–1rem with a
 * 1.7 line height for reading, and small wide-tracked caps for labels.
 */

export function Section({
  id,
  children,
  className = '',
  ref,
}: {
  id?: string
  children: ReactNode
  className?: string
  ref?: React.Ref<HTMLElement>
}) {
  return (
    <section
      id={id}
      ref={ref}
      className={`relative scroll-mt-20 px-5 py-20 sm:px-8 md:py-28 xl:px-14 ${className}`}
    >
      {/* Every section shares one shell, so their left edges line up all the
          way down the page. Content that must not stretch — a paragraph, a
          form, a FAQ row — is capped inside the section instead, left-aligned
          so the alignment survives. */}
      <div className="mx-auto w-full max-w-[104rem]">{children}</div>
    </section>
  )
}

/** Small label with a hairline marker — reads like a slate tag. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="reveal tech flex items-center gap-3 text-amber/85">
      <span className="h-px w-6 bg-amber/50" />
      {children}
    </p>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="reveal mt-4 max-w-2xl t-title font-light text-bone">
      {children}
    </h2>
  )
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="reveal mt-5 max-w-xl t-lede text-ash">{children}</p>
}

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'ghost'
  icon?: 'arrow' | 'play' | 'whatsapp'
  external?: boolean
  className?: string
}

export function CtaLink({
  href,
  children,
  variant = 'solid',
  icon = 'arrow',
  external,
  className = '',
}: ButtonProps) {
  const base =
    'group inline-flex items-center gap-2.5 rounded-full px-5 py-3 t-label font-medium tracking-[0.04em] transition-all duration-300 ease-[var(--ease-out-expo)] sm:px-7 sm:py-3.5'
  const skin =
    variant === 'solid'
      ? 'bg-amber font-semibold text-ink hover:bg-amber-glow hover:shadow-[0_0_38px_-8px_var(--color-amber)]'
      : 'border border-line text-bone/85 hover:border-amber/60 hover:text-amber'

  return (
    <a
      href={href}
      className={`${base} ${skin} ${className}`}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
      <Icon
        name={icon}
        className={
          icon === 'arrow'
            ? 'size-3.5 transition-transform duration-300 group-hover:translate-x-1'
            : 'size-3.5'
        }
        strokeWidth={1.5}
      />
    </a>
  )
}

/** Hairline rule with a marker at its centre — the repeating band divider. */
export function Divider() {
  return (
    <div className="mx-auto flex max-w-[104rem] items-center gap-4 px-5 sm:px-8">
      <span className="hairline h-px flex-1" />
      <span className="size-1 rotate-45 bg-amber/50" />
      <span className="hairline h-px flex-1" />
    </div>
  )
}
