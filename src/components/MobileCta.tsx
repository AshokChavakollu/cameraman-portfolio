import { useEffect, useState } from 'react'
import Icon from './Icon'
import { SITE, whatsappHref } from '../data/site'

/**
 * Contact must be one tap from anywhere: a floating WhatsApp button on every
 * screen, plus a sticky call/WhatsApp bar on phones once the visitor is past
 * the hero (where the CTA is already on screen).
 */
export default function MobileCta() {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noreferrer"
        aria-label="Message on WhatsApp"
        className="fixed right-5 bottom-24 z-[65] flex size-14 items-center justify-center rounded-full bg-[#25D366] text-ink shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-transform duration-300 hover:scale-105 md:bottom-6"
      >
        <Icon name="whatsapp" className="size-7" />
      </a>

      <div
        className={`fixed inset-x-0 bottom-0 z-[64] grid grid-cols-2 border-t border-line bg-ink/95 backdrop-blur-md transition-transform duration-400 ease-[var(--ease-out-expo)] md:hidden ${
          past ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <a
          href={`tel:${SITE.phone}`}
          className="flex items-center justify-center gap-2 py-4 tech text-bone "
        >
          <Icon name="phone" className="size-4 text-amber" />
          Call
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-amber py-4 tech text-ink "
        >
          <Icon name="whatsapp" className="size-4" />
          Check my date
        </a>
      </div>
    </>
  )
}
