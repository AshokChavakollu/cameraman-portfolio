import Icon from './Icon'
import { NAV_LINKS, SITE, whatsappHref } from '../data/site'

export default function Footer() {
  return (
    <footer className="relative border-t border-line/70 px-5 pt-12 pb-28 sm:px-8 md:pb-12">
      <div className="mx-auto w-full max-w-[104rem]">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <div>
            <p className="t-title font-light text-bone">
              {SITE.name}
            </p>
            <p className="mt-3 tech text-ash ">
              {SITE.role} · {SITE.basedLine}
            </p>
          </div>

          <div className="flex gap-3">
            <Social href={SITE.instagram} label="Instagram" icon="instagram" />
            <Social href={SITE.youtube} label="YouTube" icon="youtube" />
            <Social href={whatsappHref()} label="WhatsApp" icon="whatsapp" />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line/70 pt-6">
          <nav className="flex flex-wrap gap-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="tech-sm text-ash transition-colors hover:text-amber"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <p className="tech-sm text-ash/60 ">
            © {new Date().getFullYear()} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  )
}

function Social({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: 'instagram' | 'youtube' | 'whatsapp'
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-full border border-line text-ash transition-colors duration-300 hover:border-amber hover:text-amber"
    >
      <Icon name={icon} className="size-4.5" />
    </a>
  )
}
