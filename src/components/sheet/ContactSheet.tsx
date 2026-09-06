import { useEffect, useRef, useState } from 'react'
import { Eyebrow, Lede, Section, SectionTitle } from '../ui'
import { CONTACT_SHEET } from '../../data/site'
import { ScrollTrigger, gsap, prefersReducedMotion, useReveal } from '../../lib/motion'

/**
 * EVERY FRAME IS A DECISION — the contact sheet.
 *
 * A contact sheet is every frame on a roll printed small, with the keeper
 * ringed in grease pencil. It is the part of the job the client never sees,
 * and it is what the title of this section is actually about: he did not take
 * this photograph, he took twelve and threw eleven away.
 *
 * What was here before was the same story the hero already tells — him firing
 * a shutter, a picture appearing — driven by a scroll scrub. Two problems, and
 * only one of them was the interaction. The scrub asked the visitor to infer
 * wheel → clip time → shutter → print, which is three steps nobody makes in
 * two seconds. But even working perfectly it was a second helping of the hero.
 * A sheet of frames with one circled needs no explaining at all, and it says
 * something the hero cannot: the choosing, not the capture.
 *
 * Three things this file exists to hold:
 *
 * 1 · IT PLAYS ITSELF, AND IT YIELDS. The pick moves on its own every few
 *     seconds so a visitor who does nothing still watches frames get chosen
 *     and rejected. The moment anyone hovers, taps or tabs a frame the auto
 *     stops for good — nothing is more irritating than a thing that keeps
 *     moving under a hand that has taken hold of it.
 *
 * 2 · THE FRAMES RISE IN ROLL ORDER, ONCE. Each print slides up into its own
 *     frame, 01 through 12, the dark ground showing above it until it lands.
 *     No fade: the picture is legible from the first frame of the move.
 *
 *     It used to defocus instead: blur and grey resolving into focus and
 *     colour, in a random order. Three things wrong with that. Animating
 *     `filter` re-rasterises twelve image layers every frame, which is the one
 *     move that will not hold sixty. It left an inline `opacity: 1` on every
 *     cell, which outranks the `opacity-45` that is supposed to dim the
 *     rejects, so the dimming quietly never worked again after the intro. And
 *     defocusing is a lens pulling focus, not a print developing: this section
 *     is about the darkroom, and a contact sheet arrives already sharp.
 *
 *     Transform only now, and `clearProps` on the way out so the tween owns
 *     nothing once it has finished.
 *
 * 3 · THE RING IS DRAWN AFTER THE SHEET IS DRY. Nothing gets circled until the
 *     last frame has come up, because the point of the section is the choosing
 *     and you cannot watch a choice that was already made before you arrived.
 *     The auto-advance waits on the same flag, so the section is entered on
 *     `SHEET.pick` rather than on whichever frame an off-screen timer had
 *     wandered to.
 *
 * 4 · THE PENCIL RING IS DRAWN, NOT FADED. `pathLength="1"` normalises the
 *     path so a dash offset of 1 → 0 draws it end to end without anyone
 *     measuring it in JavaScript, and the loop overshoots its own start the
 *     way a hand does.
 */

const SHEET = CONTACT_SHEET
const COUNT = SHEET.frames.length

/** How long a frame stays ringed before the pick moves on by itself. */
const DWELL = 3600

/**
 * The grease-pencil loop: a full oval closed and then carried a little past
 * where it started, with the radii nudged off true so no two quarters match —
 * a hand does not draw an ellipse.
 *
 * It is drawn in a 100x75 box, the same 4:3 as the frame it goes around, so
 * `preserveAspectRatio="none"` stretches it by the same amount in both axes
 * and it stays an oval. The first version was a 124x92 arc that did not close,
 * squashed into a box of a different ratio and sized against the whole cell,
 * CAPTION INCLUDED — which is why it came out as a lopsided sickle hanging off
 * the bottom of the frame and across its neighbours.
 *
 * `non-scaling-stroke` keeps the line an even weight after that stretch.
 */
const PENCIL =
  'M 4 40 C 3 20, 25 3, 51 3 C 77 3, 97 19, 96 38 C 95 57, 74 73, 49 72 C 25 71, 5 57, 4 39 C 4 31, 8 23, 16 16'

export default function ContactSheet() {
  const section = useReveal<HTMLElement>()
  const grid = useRef<HTMLDivElement>(null)

  // Typed wider than the data: `CONTACT_SHEET` is `as const`, so `pick` is the
  // literal 6 and the state would refuse every other frame.
  const [picked, setPicked] = useState<number>(SHEET.pick)
  const [taken, setTaken] = useState(false)
  const [developed, setDeveloped] = useState(false)

  // ── the sheet comes up in the tray ───────────────────────────────────────
  useEffect(() => {
    const el = grid.current
    if (!el) return

    if (prefersReducedMotion()) {
      setDeveloped(true)
      return
    }

    // The prints, not the buttons: the cell's own opacity is what marks a
    // frame as kept or rejected, and a tween has no business holding it.
    const prints = el.querySelectorAll('.sheet-print')

    const tween = gsap.fromTo(
      prints,
      { yPercent: 12 },
      {
        yPercent: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: { each: 0.05 },
        paused: true,
        clearProps: 'transform',
        onComplete: () => setDeveloped(true),
      },
    )

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 78%',
      once: true,
      onEnter: () => tween.play(),
    })

    return () => {
      st.kill()
      tween.kill()
    }
  }, [])

  // ── it keeps choosing until someone else does ────────────────────────────
  useEffect(() => {
    if (!developed || taken || prefersReducedMotion()) return
    const id = window.setInterval(() => setPicked((p) => (p + 1) % COUNT), DWELL)
    return () => window.clearInterval(id)
  }, [developed, taken])

  const take = (i: number) => {
    setPicked(i)
    setTaken(true)
  }

  const keeper = SHEET.frames[picked]

  return (
    <Section id="shoot" ref={section} className="border-y border-line/60 bg-char/30">
      <div className="max-w-2xl">
        <Eyebrow>{SHEET.eyebrow}</Eyebrow>
        <SectionTitle>{SHEET.title}</SectionTitle>
        <Lede>{SHEET.lede}</Lede>
      </div>

      <div className="reveal mt-10 grid gap-10 lg:mt-8 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12">
        {/* ── The sheet ── */}
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-line/70 pb-2">
            <span className="tech-sm text-ash/70">{SHEET.roll}</span>
            <span className="tech-sm text-ash/65">{SHEET.hint}</span>
          </div>

          <div ref={grid} className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-4">
            {SHEET.frames.map((frame, i) => {
              const isPick = i === picked
              return (
                <button
                  key={frame.src}
                  type="button"
                  aria-pressed={isPick}
                  aria-label={`${frame.label}, ${frame.place}`}
                  onMouseEnter={() => take(i)}
                  onFocus={() => take(i)}
                  onClick={() => take(i)}
                  className={`group relative block cursor-pointer transition-opacity duration-500 ${
                    isPick ? 'opacity-100' : 'opacity-45 hover:opacity-80'
                  }`}
                >
                  {/* The ring's box. It wraps the picture only and does not
                      clip, so the loop can overshoot the frame by a few pixels
                      without the caption stretching it or the neighbours
                      catching it. */}
                  <span className="relative block">
                    <span className="block overflow-hidden bg-char p-[3px] shadow-[0_6px_18px_-10px_rgba(0,0,0,0.6)]">
                      <img
                        src={frame.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="sheet-print aspect-[4/3] w-full object-cover"
                      />
                    </span>

                    {isPick && developed && (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 100 75"
                        preserveAspectRatio="none"
                        className="pointer-events-none absolute -inset-1"
                      >
                        <path
                          d={PENCIL}
                          fill="none"
                          stroke="var(--color-rec)"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          pathLength="1"
                          style={{
                            strokeDasharray: 1,
                            strokeDashoffset: 1,
                            animation: 'pencil 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
                          }}
                        />
                      </svg>
                    )}
                  </span>

                  <span className="tech-sm mt-1.5 block text-left text-ash/65 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                    {isPick && <span className="ml-1.5 text-rec/80">×</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── The one he kept ── */}
        <figure className="lg:sticky lg:top-28">
          <div className="relative overflow-hidden bg-char p-2 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.66)]">
            <img
              key={keeper.src}
              src={keeper.src}
              alt={`${keeper.label}, ${keeper.place}`}
              className="aspect-[4/3] w-full object-cover"
              style={{ animation: 'keeper-in 0.6s cubic-bezier(0.16,1,0.3,1) both' }}
            />
          </div>

          <figcaption className="mt-4 flex items-baseline gap-4 border-t border-line/70 pt-4">
            <span className="tech-sm text-rec/80">{SHEET.keeperLabel}</span>
            <span className="min-w-0 flex-1 truncate">
              <span className="t-card font-light text-bone">{keeper.label}</span>
              <span className="tech-sm ml-3 text-ash/60">{keeper.place}</span>
            </span>
            <span className="tech-sm shrink-0 text-ash/65 tabular-nums">
              {String(picked + 1).padStart(2, '0')} / {COUNT}
            </span>
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
