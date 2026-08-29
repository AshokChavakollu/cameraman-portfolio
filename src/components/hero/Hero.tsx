import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import HeroHud from './HeroHud'
import SloganCycle from './SloganCycle'
import { CtaLink } from '../ui'
import Icon from '../Icon'
import { HERO, SITE, TICKER, whatsappHref } from '../../data/site'
import { gsap, prefersReducedMotion, useCountUp } from '../../lib/motion'

/** three + drei are ~800kB of the bundle. The headline and the CTA must not
 *  wait behind them, so the rig arrives as its own chunk after first paint. */
const RigScene = lazy(() => import('../../three/RigScene'))

/**
 * Left: who he is and how to reach him. Right: the rig.
 *
 * The two halves are coupled — every time the shutter fires in the 3D scene the
 * DOM flashes and the frame counter ticks, so the animation reads as one
 * machine rather than a decorative object parked next to some text.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const flash = useRef<HTMLDivElement>(null)
  const [frames, setFrames] = useState(1284)

  const onCapture = useCallback(() => {
    setFrames((n) => n + 1)
    const el = flash.current
    // A tween started while the tab is hidden freezes mid-flight (rAF is
    // paused) and leaves the stage sitting under a lit overlay.
    if (!el || document.hidden || prefersReducedMotion()) return
    gsap.fromTo(
      el,
      { opacity: 0.42 },
      { opacity: 0, duration: 0.5, ease: 'power2.out', overwrite: true },
    )
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return

    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll('.hero-in, .line-mask > span'), {
        opacity: 1,
        y: 0,
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.line-mask > span', {
          yPercent: 115,
          duration: 1.15,
          stagger: 0.09,
          delay: 0.15,
        })
        .from('.hero-in', { opacity: 0, y: 22, duration: 0.9, stagger: 0.1 }, '-=0.7')
        .from('.hero-stage', { opacity: 0, duration: 1.4 }, '-=1.3')
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <header
      ref={root}
      className="relative isolate min-h-[100svh] overflow-hidden border-b border-line/60"
    >
      {/* Backdrop, in layers — the EPM treatment in navy: diagonal colour
          field, glow pools, a masked square grid, grain, and a fade so the
          hero dissolves into the page instead of ending on a hard band. */}
      <div aria-hidden className="hero-field pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="hero-mesh pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="hero-noise pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-ink"
      />

      {/* The ticker is pinned to the bottom of the header, so the grid keeps a
          bottom pad wide enough that the stats never slide under it. */}
      <div className="mx-auto grid w-full max-w-[104rem] grid-cols-1 items-center gap-2 px-5 pt-28 pb-24 sm:px-8 xl:px-14 lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-32 lg:pb-32">
        {/* ── Copy ── */}
        <div className="relative z-10 order-2 lg:order-1">
          <p className="hero-in tech flex items-center gap-3 text-amber/85">
            <span className="size-1.5 animate-pulse rounded-full bg-amber" />
            {HERO.eyebrow}
          </p>

          <SloganCycle />

          <p className="hero-in mt-6 max-w-xl text-[1rem] leading-[1.75] text-ash">{HERO.sub}</p>

          <div className="hero-in mt-9 flex flex-wrap items-center gap-3">
            <CtaLink href={whatsappHref()} icon="whatsapp" external>
              {HERO.primaryCta}
            </CtaLink>
            <CtaLink href="#films" variant="ghost" icon="play">
              {HERO.secondaryCta}
            </CtaLink>
          </div>

          <dl className="hero-in mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-7">
            {HERO.stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </dl>

          <p className="hero-in tech-sm mt-8 text-ash/65">{SITE.basedLine}</p>
        </div>

        {/* ── Stage ── */}
        <div className="hero-stage relative order-1 h-[52vh] min-h-[340px] w-full sm:h-[58vh] lg:order-2 lg:h-[76vh]">
          <Suspense fallback={<StagePoster />}>
            <RigScene onCapture={onCapture} />
          </Suspense>
          <HeroHud frames={frames} />
          {/* Shutter flash — fired from the 3D scene, painted in the DOM because
              a full-bleed CSS layer is cheaper than a post-processing pass. */}
          <div
            ref={flash}
            className="pointer-events-none absolute inset-0 z-30 opacity-0 mix-blend-screen"
            style={{
              background:
                'radial-gradient(circle at 62% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.3) 55%, transparent 78%)',
              mixBlendMode: 'normal',
            }}
          />
          {/* Fade the rig's tripod legs into the page instead of cutting them. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-ink to-transparent" />
        </div>
      </div>

      {/* ── Call-sheet ticker ── */}
      <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-line/70 bg-ink/70 py-3 backdrop-blur-sm">
        <div
          className="flex w-max gap-10 whitespace-nowrap"
          style={{ animation: 'marquee 38s linear infinite' }}
        >
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={`${item}-${i}`} className="tech-sm flex items-center gap-10 text-ash/60">
              {item}
              <Icon name="aperture" className="size-3 text-amber/50" />
            </span>
          ))}
        </div>
      </div>

      <ScrollCue />
    </header>
  )
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useCountUp(value)
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      {/* Set in Manrope, not the display serif: Cormorant's old-style figures
          drop the 1 and the 0 below the cap height, so "312" reads as "3ı2". */}
      <dd className="text-[1.75rem] leading-none font-semibold text-bone tabular-nums sm:text-[2.2rem]">
        <span ref={ref} />
        <span className="font-light text-amber">{suffix}</span>
      </dd>
      <p className="tech-sm mt-2.5 text-ash/70">{label}</p>
    </div>
  )
}

/** Holds the stage's shape while the 3D chunk loads — no layout shift, and a
 *  lens-shaped glow so the gap reads as intentional. */
function StagePoster() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="size-48 rounded-full opacity-70 blur-2xl"
        style={{
          background:
            'radial-gradient(circle, rgba(42,82,184,0.18), rgba(91,143,214,0.1) 55%, transparent 72%)',
        }}
      />
    </div>
  )
}

function ScrollCue() {
  return (
    <div className="pointer-events-none absolute bottom-16 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
      <span className="h-12 w-px overflow-hidden bg-line">
        <span
          className="block h-4 w-px bg-amber"
          style={{ animation: 'scroll-cue 2.2s ease-in-out infinite' }}
        />
      </span>
    </div>
  )
}
