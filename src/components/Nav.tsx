import { useEffect, useState } from 'react'
import Icon from './Icon'
import { NAV_LINKS, SITE, whatsappHref } from '../data/site'

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

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to work
      </a>

      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-expo)] ${
          solid
            ? 'border-b border-line/70 bg-ink/85 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[104rem] items-center justify-between px-5 sm:h-18 sm:px-8 xl:px-14">
          <a href="#top" className="group flex items-center gap-2.5">
            <Icon
              name="aperture"
              className="size-5 text-amber transition-transform duration-700 group-hover:rotate-180"
            />
            <span className="font-display text-[1.45rem] font-light tracking-[0.02em] text-bone">
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
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="tap-44 flex flex-col items-end gap-1.5 md:hidden"
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
        className={`fixed inset-0 z-40 bg-ink/97 backdrop-blur-lg transition-all duration-400 ease-[var(--ease-out-expo)] md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-full flex-col justify-center gap-1 px-8">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-line/60 py-4 font-display text-[2.4rem] font-light text-bone transition-colors duration-200 hover:text-amber"
              style={{
                transitionDelay: open ? `${i * 40}ms` : '0ms',
                transform: open ? 'none' : 'translateY(12px)',
                opacity: open ? 1 : 0,
              }}
            >
              {l.label}
            </a>
          ))}
          <a href={`tel:${SITE.phone}`} className="mt-8 flex items-center gap-3 tech text-amber">
            <Icon name="phone" className="size-4" />
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </>
  )
}
