import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

/**
 * A section that opens through a lens.
 *
 * Not a circle. `clip-path: circle()` is one line and it reads as a soft mask;
 * an iris is eight straight blades that ROTATE as they open, which is what the
 * front of a lens actually does, and on this site the transition should be a
 * piece of camera rather than a piece of CSS. The polygon is rebuilt every
 * frame from one scalar, so the whole thing is still a scalar tween.
 *
 * Three things this file exists to hold:
 *
 * 1 · IT IS ANCHORED TO THE VIEWPORT, NOT TO THE SECTION. A section is several
 *     screens tall, so an iris centred on the element opens from a point far
 *     below the fold and reveals the top edge last — a wipe, not an iris. The
 *     centre is half a viewport below the section's top, which is roughly
 *     where the visitor is looking while the blades are moving.
 *
 * 2 · THE CLIP IS DROPPED AT THE END, not left at 100%. A live clip-path on a
 *     tall section is a permanent containing block and a permanent rasterise
 *     cost, and it would trap any sticky or fixed descendant added later.
 *
 * 3 · NO JAVASCRIPT, NO IRIS. The blades are only ever applied by this effect,
 *     so if it never runs — reduced motion, a JS error, an old browser — the
 *     section is simply visible. A reveal that can hide content on failure is
 *     not worth having.
 */

/** A real lens has five to nine. Eight reads as a lens and stays smooth. */
const BLADES = 8

/** How far open it starts — a pinhole, not a closed shutter. */
const SHUT = 0.055

/** Radians the blades turn while opening. Small: it should be felt, not seen. */
const SPIN = 0.34

/** Past this the clip comes off entirely — see rule 2. */
const RELEASE = 0.985

/** Slow out: the blades fly open and settle, they do not travel at a constant
 *  speed, which is what makes it read as sprung metal rather than a fade. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * The blade polygon at a given opening, in percentages of the element box.
 *
 * Percentages resolve against width for x and height for y, so a regular
 * polygon in percent space would come out stretched on any box that is not
 * square. The maths is therefore done in pixels and converted at the end.
 */
function iris(open: number, w: number, h: number, cy: number) {
  const cx = w / 2
  // Enough to clear the viewport around the centre. It does not need to cover
  // the whole section, because the clip is released before that could matter.
  const reach = Math.hypot(w, window.innerHeight)
  // cos(π/n) turns the circumradius into an inradius, so the flats of the
  // polygon clear the corners rather than its points.
  const r = (reach * (SHUT + (1 - SHUT) * open)) / Math.cos(Math.PI / BLADES)
  const turn = -Math.PI / 2 - SPIN * (1 - open)

  const points: string[] = []
  for (let i = 0; i < BLADES; i++) {
    const a = turn + (i / BLADES) * Math.PI * 2
    const x = ((cx + Math.cos(a) * r) / w) * 100
    const y = ((cy + Math.sin(a) * r) / h) * 100
    points.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`)
  }
  return `polygon(${points.join(', ')})`
}

export default function Aperture({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el || prefersReducedMotion()) return

    let w = 0
    let h = 0
    let cy = 0

    const measure = () => {
      const rect = el.getBoundingClientRect()
      w = rect.width
      h = rect.height
      cy = Math.min(window.innerHeight * 0.5, h / 2)
    }

    const draw = (p: number) => {
      if (!w || !h) return
      if (p >= RELEASE) {
        el.style.clipPath = ''
        el.style.willChange = ''
        return
      }
      el.style.willChange = 'clip-path'
      el.style.clipPath = iris(ease(p), w, h, cy)
    }

    measure()

    // A scalar tween rather than a bare ScrollTrigger: `scrub` smooths a
    // tween's playhead, and without it the blades step with the wheel.
    const open = { p: 0 }
    const tween = gsap.to(open, {
      p: 1,
      ease: 'none',
      onUpdate: () => draw(open.p),
      scrollTrigger: {
        trigger: el,
        start: 'top 62%',
        end: 'top -8%',
        scrub: 0.55,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure()
          draw(open.p)
        },
      },
    })

    draw(open.p)

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      el.style.clipPath = ''
      el.style.willChange = ''
    }
  }, [])

  // A plain block wrapper: sections are block-level and padded, so this adds
  // no layout of its own, and the id stays on the section inside for anchors.
  return <div ref={host}>{children}</div>
}
