import { useEffect, useState } from 'react'
import Icon from './Icon'
import { NAV_LINKS, SITE, whatsappHref } from '../data/site'

/**
 * The bar, and the sheet behind it on a phone.
 *
 * Four things the sheet exists to get right, each one a way it was broken:
 *
 * 1 · IT SCROLLS. The links were centred in a fixed, non-scrolling box. Six of
 *     them at 2.4rem plus a phone number is taller than a small phone and far
 *     taller than any phone on its side, and the overflow was simply
 *     unreachable. It is a scroll container now, and the content centres only
 *     when it fits.
 *
 * 2 · IT COVERS THE BOTTOM BAR. The sheet sat at z-40 while the call/WhatsApp
 *     bar sits at 64 and the floating button at 65, so both of them punched
 *     through an open menu. The sheet is above them and below the bar that
 *     holds the close button.
 *
 * 3 · IT LETS GO ON ROTATE. The sheet is `md:hidden`, but hiding it did not
 *     clear `open`, so turning a phone sideways into the tablet layout left
 *     the page scroll-locked with no visible menu and no way to unlock it.
 *
 * 4 · THE STAGGER ACTUALLY RUNS. The links carried an inline `transitionDelay`
 *     and inline opacity and transform, but the only transition declared on
 *     them was `colors` — so they snapped, and the delay did nothing at all.
 */
export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // A menu that stays open behind a locked page is a trap on mobile.
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  // Rule 3: the sheet is hidden from `md` up, so the state has to go with it.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to work
      </a>

      <nav
        className={`fixed inset-x-0 top-0 z-[70] transition-all duration-500 ease-[var(--ease-out-expo)] ${
          solid || open
            ? 'border-b border-line/70 bg-ink/85 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[104rem] items-center justify-between gap-4 px-5 sm:h-18 sm:px-8 xl:px-14">
          <a href="#top" className="group flex min-w-0 items-center gap-2.5">
            <Icon
              name="aperture"
              className="size-5 shrink-0 text-amber transition-transform duration-700 group-hover:rotate-180"
            />
            <span className="truncate t-card font-light tracking-[0.02em] text-bone">
              {SITE.name}
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="tech text-ash transition-colors duration-200 hover:text-amber"
              >
                {l.label}
              </a>
            ))}
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-amber/50 px-4 py-2 tech text-amber transition-colors duration-200 hover:bg-amber hover:text-ink"
            >
              <Icon name="whatsapp" className="size-3.5" />
              Enquire
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="tap-44 flex shrink-0 flex-col items-end gap-1.5 md:hidden"
          >
            <span
              className={`h-px bg-bone transition-all duration-300 ${open ? 'w-6 translate-y-[3.5px] rotate-45' : 'w-6'}`}
            />
            <span
              className={`h-px bg-bone transition-all duration-300 ${open ? 'w-6 -translate-y-[3.5px] -rotate-45' : 'w-4'}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-[66] h-[100dvh] overflow-y-auto overscroll-contain bg-ink/97 backdrop-blur-lg transition-[opacity,visibility] duration-400 ease-[var(--ease-out-expo)] md:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {/* `min-h-full` with `justify-center`: it centres while it fits and
            scrolls from the top the moment it does not. */}
        <div className="flex min-h-full flex-col justify-center px-6 pt-24 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-line/60 py-3.5 t-menu font-light text-bone transition-[color,opacity,transform] duration-500 ease-[var(--ease-out-expo)] hover:text-amber"
              style={{
                transitionDelay: open ? `${70 + i * 45}ms` : '0ms',
                transform: open ? 'none' : 'translateY(14px)',
                opacity: open ? 1 : 0,
              }}
            >
              {l.label}
            </a>
          ))}

          {/* The thing the whole site is for, in the menu rather than only in
              the bar behind it. */}
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="mt-8 flex items-center justify-center gap-2.5 rounded-full bg-amber py-4 tech font-semibold text-ink transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]"
            style={{
              transitionDelay: open ? `${70 + NAV_LINKS.length * 45}ms` : '0ms',
              transform: open ? 'none' : 'translateY(14px)',
              opacity: open ? 1 : 0,
            }}
          >
            <Icon name="whatsapp" className="size-4" />
            Check my dates
          </a>

          <a
            href={`tel:${SITE.phone}`}
            className="mt-5 flex items-center justify-center gap-3 tech text-ash transition-colors duration-200 hover:text-amber"
          >
            <Icon name="phone" className="size-4 text-amber" />
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </>
  )
}
