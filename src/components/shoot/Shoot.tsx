import { Suspense, lazy, useCallback, useRef, useState } from 'react'
import Print from './Print'
import { Eyebrow, Lede, Section, SectionTitle } from '../ui'
import { SHOOT_SEQUENCE } from '../../data/site'
import { gsap, prefersReducedMotion, useReveal } from '../../lib/motion'

/**
 * Camera on the left, prints on the right, and the distance between them doing
 * work rather than sitting empty.
 *
 * On a wide screen the two halves used to drift apart with a hole in the
 * middle. The fix is composition, not padding: the camera is large and aimed
 * across the gap, a dashed flight path connects the lens to the stack, and a
 * live exposure readout sits under the body — so the space between the columns
 * reads as the distance a frame travels.
 *
 * The camera fires on its own every few seconds. Nobody has to click anything.
 */

const ShootScene = lazy(() => import('../../three/ShootScene'))

/** Depth 0 is the print that just landed; the rest fall back behind it. */
const RESTING = [
  { x: -34, y: 0, rotate: -3, scale: 1, opacity: 1 },
  { x: -8, y: -16, rotate: 4, scale: 0.94, opacity: 0.7 },
  { x: 18, y: -36, rotate: -6, scale: 0.88, opacity: 0.42 },
  { x: 42, y: -54, rotate: 8, scale: 0.83, opacity: 0.22 },
  { x: 64, y: -70, rotate: -10, scale: 0.79, opacity: 0.1 },
]

type Shot = { key: number; index: number }

export default function Shoot() {
  const section = useReveal<HTMLElement>()
  const cards = useRef(new Map<number, HTMLDivElement>())
  const flash = useRef<HTMLDivElement>(null)
  const counter = useRef(41)
  const [shots, setShots] = useState<Shot[]>([])

  const onCapture = useCallback(() => {
    counter.current += 1
    const key = counter.current

    setShots((prev) => {
      const next = [{ key, index: key % SHOOT_SEQUENCE.length }, ...prev].slice(0, RESTING.length)

      // Lay the stack out on the next frame, once React has mounted the new
      // card and handed us its node.
      requestAnimationFrame(() => layout(cards.current, next, key))
      return next
    })

    const el = flash.current
    if (el && !document.hidden && !prefersReducedMotion()) {
      gsap.fromTo(el, { opacity: 0.5 }, { opacity: 0, duration: 0.55, ease: 'power2.out' })
    }
  }, [])

  const latest = shots[0] ? SHOOT_SEQUENCE[shots[0].index] : undefined

  return (
    <Section id="shoot" ref={section} className="border-y border-line/60 bg-char/30">
      <div className="max-w-2xl">
        <Eyebrow>Watch it work</Eyebrow>
        <SectionTitle>Every frame is a decision</SectionTitle>
        <Lede>
          Push in, wait for the moment, expose. Three hundred times a day, until the day is a film.
          This is the loop — the camera below is running it on its own.
        </Lede>
      </div>

      <div className="relative mt-10 grid items-center gap-10 lg:mt-4 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-4">
        {/* ── The camera, and what it is doing right now ── */}
        <div className="reveal relative mx-auto w-full max-w-[32rem] lg:mx-0">
          {/* Anchored to the stage's edge, so it always starts at the lens */}
          <FlightPath />
          {/* The stage is framed like a lit set: a gold hairline, a glow that
              falls off into the navy, and brackets at the corners. Without it
              the camera floats in an empty column on a wide screen. */}
          <div className="relative overflow-hidden rounded-2xl border border-amber/20 bg-[radial-gradient(120%_90%_at_50%_45%,rgba(52,98,204,0.12),transparent_70%)] shadow-[0_24px_60px_-30px_rgba(18,42,94,0.35),inset_0_0_60px_-30px_rgba(42,82,184,0.18)]">
            <StageBracket className="top-4 left-4 border-t border-l" />
            <StageBracket className="top-4 right-4 border-t border-r" />
            <StageBracket className="bottom-4 left-4 border-b border-l" />
            <StageBracket className="right-4 bottom-4 border-r border-b" />
            <span className="tech-sm absolute top-4 left-1/2 z-10 -translate-x-1/2 text-amber/55">
              stage · 50mm
            </span>

            <div className="relative h-[34vh] min-h-[260px] w-full sm:h-[38vh] lg:h-[19rem]">
              <Suspense fallback={<Poster />}>
                <ShootScene onCapture={onCapture} />
              </Suspense>
              <div
                ref={flash}
                className="pointer-events-none absolute inset-0 z-20 bg-amber-glow opacity-0 mix-blend-screen"
              />
            </div>
          </div>

          <ExposureReadout frames={shots[0]?.key} label={latest?.label} place={latest?.place} />
        </div>

        {/* ── The prints ── */}
        <div className="reveal relative flex h-[38vh] min-h-[300px] items-center justify-center sm:h-[42vh] lg:h-[19rem]">
          {shots.length === 0 && <p className="tech-sm text-ash/45">waiting for the first frame</p>}

          {/* Newest last in the DOM so it paints on top without z-index churn */}
          {[...shots].reverse().map((shot) => (
            <Print
              key={shot.key}
              frame={SHOOT_SEQUENCE[shot.index]}
              number={shot.key}
              innerRef={(el) => {
                if (el) cards.current.set(shot.key, el)
                else cards.current.delete(shot.key)
              }}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}

function StageBracket({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute z-10 size-6 border-amber/35 ${className}`} />
}

/**
 * The line the frame travels down. Desktop only — on a phone the two halves
 * stack, and a path drawn between them would point at nothing.
 */
function FlightPath() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 120"
      preserveAspectRatio="none"
      className="pointer-events-none absolute top-[42%] left-full z-0 ml-2 hidden h-20 w-[82%] -translate-y-1/2 lg:block"
    >
      <path
        d="M0 96 C 180 96, 300 34, 600 20"
        fill="none"
        stroke="#2a52b8"
        strokeOpacity="0.55"
        strokeWidth="1.5"
        strokeDasharray="7 11"
        style={{ animation: 'dash-flow 2.4s linear infinite' }}
      />
      <circle cx="0" cy="96" r="3" fill="#2a52b8" fillOpacity="0.8" />
      <circle cx="600" cy="20" r="3" fill="#2a52b8" fillOpacity="0.55" />
    </svg>
  )
}

/** A live slate under the camera: what it just exposed, and on what settings. */
function ExposureReadout({
  frames,
  label,
  place,
}: {
  frames?: number
  label?: string
  place?: string
}) {
  return (
    <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line/70 pt-4">
      <span className="tech-sm flex items-center gap-2 text-rec/90">
        <span
          className="size-1.5 rounded-full bg-rec"
          style={{ animation: 'rec-blink 1.4s steps(1) infinite' }}
        />
        rec
      </span>
      <span className="tech-sm text-ash/70">50mm · f/1.4 · 1/50 · iso 800</span>
      <span className="tech-sm ml-auto text-amber/80 tabular-nums">
        frame {String(frames ?? 0).padStart(4, '0')}
      </span>
      <p className="tech-sm w-full text-ash/55">
        {label ? (
          <>
            just exposed — <span className="text-bone/80">{label}</span>, {place}
          </>
        ) : (
          'standing by'
        )}
      </p>
    </div>
  )
}

/**
 * Animate the stack into place. The card that just arrived flies in from the
 * lens — left, low and small — while everything behind it slides back a step.
 */
function layout(cards: Map<number, HTMLDivElement>, shots: Shot[], newest: number) {
  const still = prefersReducedMotion()

  shots.forEach((shot, depth) => {
    const el = cards.get(shot.key)
    const target = RESTING[Math.min(depth, RESTING.length - 1)]
    if (!el) return

    if (still) {
      gsap.set(el, target)
      return
    }

    if (shot.key === newest) {
      gsap.fromTo(
        el,
        { x: -300, y: 170, rotate: -22, scale: 0.5, opacity: 0 },
        { ...target, duration: 1, ease: 'expo.out' },
      )
    } else {
      gsap.to(el, { ...target, duration: 0.75, ease: 'expo.out' })
    }
  })
}

/** Holds the stage's shape while the 3D chunk loads. */
function Poster() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="size-40 rounded-full opacity-60 blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(42,82,184,0.18), transparent 70%)',
        }}
      />
    </div>
  )
}
