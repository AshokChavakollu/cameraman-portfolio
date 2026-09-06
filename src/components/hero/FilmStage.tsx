import { useEffect, useRef, useState } from 'react'
import { HERO } from '../../data/site'
import { prefersReducedMotion } from '../../lib/motion'
import {
  CAMERA,
  DURATION,
  FEATHER_R,
  FEATHER_X,
  FEATHER_Y,
  FIRE,
  FLY_END,
  HOLD_END,
  POP_END,
} from '../../lib/film'

/**
 * THE STAGE — one 8s take of the photographer, looped, with the portfolio
 * assembling itself on top of him.
 *
 * The split is the whole design, and it is the same one the Prastha hero uses:
 * the FOOTAGE carries the person and the room, the DOM carries the product.
 * A generator cannot render a legible event name and it cannot know which
 * photographs are in this portfolio today — and anything burned into the clip
 * can never be changed again. So the video holds only him, and every
 * photograph, label and bracket here is real DOM sitting over it.
 *
 * Each pass of the clip is one capture:
 *
 *   2.00s  SHUTTER    the camera is at his eye — the frame flashes and the
 *                     photograph he has just taken grows out of the body.
 *   2.45s  HOLD       it sits open at his left, captioned with the event and
 *                     creeping slowly larger, while in the footage he lowers
 *                     the camera and reads its back.
 *   4.40s  FLY        it shrinks away into its place on the wall.
 *   5.00s  PARKED     the wall is one photograph longer, and the next pass
 *                     takes the next one.
 *
 * There is no viewfinder furniture on the stage — no corner brackets, no rec
 * light, no focal-length readout. They announced "this is a video of a camera",
 * which is the opposite of the goal: the picture should read as the page, not
 * as a clip placed on it. What is left is the work — the photographs, their
 * event names, and the flash on the shutter, which is an event and not a label.
 *
 * Two rules this file exists to hold:
 *
 * 1 · TWO COORDINATE SPACES, ON PURPOSE. The stage is nowhere near 16:9, so
 *     `object-cover` crops the picture's sides by an amount that changes with
 *     the viewport. The camera anchor is therefore in PICTURE space, so the
 *     freeze-frame keeps growing out of the camera in his hands at every
 *     width; the photographs and their captions are in STAGE space, so they
 *     can never be cropped away on a phone. Sizes are clamped px, not raw
 *     fractions, so nothing shrinks to a stamp.
 *
 * 2 · NO BOX AROUND THE FOOTAGE. The hero field is a pale gradient, so the
 *     only thing the clip can dissolve into it with is transparency: one wide
 *     feather at a single density. A vignette, or a density stop inside the
 *     mask, reads as a dark ring — a rectangle by another name.
 */

const { film } = HERO
const PHOTOS = film.photos



/**
 * The freeze-frame and the wall it lands on — in STAGE coordinates.
 *
 * They used to be fractions of the PICTURE, which is the 16:9 rectangle that
 * COVERS the stage. That rectangle is wider than the stage by an amount that
 * depends on the viewport, so on a phone the outer fifth of it is cropped away
 * and a photograph placed there was simply gone. Anything the visitor is meant
 * to read is therefore positioned against the stage; only the camera anchor,
 * which has to sit on his hands, stays in picture space.
 *
 * Sizes are a fraction of the stage width with px bounds, so a photograph is
 * never a postage stamp on a phone nor a poster on a wide monitor.
 *
 * `objPos` is where the picture gets cropped: he stands right of centre, so on
 * a narrow stage the crop is pulled left, which walks him toward the feathered
 * right edge and keeps the left side open for the work.
 */
type Seat = { x: number; y: number; rotate: number }

type Layout = {
  objPos: number
  card: { x: number; y: number; w: number; min: number; max: number }
  slot: { w: number; min: number; max: number }
  slots: Seat[]
}

const LAYOUTS: { from: number; layout: Layout }[] = [
  {
    from: 620,
    layout: {
      objPos: 0.5,
      card: { x: 0.4, y: 0.44, w: 0.3, min: 150, max: 280 },
      slot: { w: 0.155, min: 72, max: 132 },
      slots: [
        { x: 0.115, y: 0.13, rotate: -2.2 },
        { x: 0.105, y: 0.4, rotate: 1.8 },
        { x: 0.115, y: 0.67, rotate: -1.6 },
        { x: 0.3, y: 0.12, rotate: 2.4 },
        { x: 0.29, y: 0.87, rotate: -1.1 },
      ],
    },
  },
  {
    from: 430,
    layout: {
      objPos: 0.4,
      card: { x: 0.44, y: 0.46, w: 0.4, min: 130, max: 230 },
      slot: { w: 0.2, min: 64, max: 104 },
      slots: [
        { x: 0.13, y: 0.14, rotate: -2.4 },
        { x: 0.12, y: 0.5, rotate: 1.6 },
        { x: 0.14, y: 0.86, rotate: -1.4 },
      ],
    },
  },
  {
    from: 0,
    layout: {
      objPos: 0.3,
      card: { x: 0.42, y: 0.48, w: 0.46, min: 112, max: 200 },
      slot: { w: 0.26, min: 58, max: 92 },
      slots: [
        { x: 0.16, y: 0.14, rotate: -2.6 },
        { x: 0.16, y: 0.85, rotate: 1.8 },
      ],
    },
  },
]

/** The most seats any layout has. The wall is kept this long whatever is on
 *  screen, so a resize moves photographs between seats instead of losing them. */
const MAX_SEATS = 5

/**
 * What the layout is chosen and sized against.
 *
 * Not the stage width: a phone held sideways gives a stage around 780×220, and
 * on width alone that picks the five-seat layout with 120px photographs — half
 * of which then sit above the top edge of a 220px-tall stage. Height is the
 * binding constraint there, so the basis is whichever runs out first.
 */
const basisOf = (w: number, h: number) => Math.min(w, h * 1.35)

function pickLayout(basis: number): Layout {
  for (const step of LAYOUTS) if (basis >= step.from) return step.layout
  return LAYOUTS[LAYOUTS.length - 1].layout
}

const clampPx = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

/** Type sitting on the footage rather than on the page: the palette's ink is
 *  deep navy and disappears into a dark frame, so it goes light and carries
 *  its own shadow for the moments the picture behind it is bright. */
const ON_FILM = '0 1px 4px rgba(0,0,0,0.8)'

const smooth = (x: number) => x * x * (3 - 2 * x)
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

type Box = { left: number; top: number; width: number; height: number }
type Metrics = { w: number; h: number; basis: number; box: Box; layout: Layout }

/**
 * The stage, the rectangle the video paints into, and the layout that fits it.
 *
 * `box` is what `object-fit: cover` is doing, in numbers the overlay can be
 * positioned against: the smallest 16:9 rectangle that covers the stage, slid
 * sideways by the layout's crop.
 */
function useStage(ref: React.RefObject<HTMLElement | null>): Metrics {
  const [metrics, setMetrics] = useState<Metrics>(() => ({
    w: 0,
    h: 0,
    basis: 0,
    box: { left: 0, top: 0, width: 0, height: 0 },
    layout: pickLayout(0),
  }))

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const { width: w, height: h } = el.getBoundingClientRect()
      if (!w || !h) return
      const basis = basisOf(w, h)
      const layout = pickLayout(basis)
      const scale = Math.max(w / 16, h / 9)
      const width = 16 * scale
      const height = 9 * scale
      setMetrics({
        w,
        h,
        basis,
        // (w - width) is zero or negative: the picture overhangs the stage.
        box: { left: (w - width) * layout.objPos, top: (h - height) / 2, width, height },
        layout,
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  return metrics
}

export default function FilmStage({ onCapture }: { onCapture?: () => void }) {
  const stage = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const wire = useRef<SVGLineElement>(null)
  const { w: stageW, h: stageH, basis, box, layout } = useStage(stage)
  const seats = layout.slots
  const cardW = clampPx(basis * layout.card.w, layout.card.min, layout.card.max)
  const slotW = clampPx(basis * layout.slot.w, layout.slot.min, layout.slot.max)

  const still = prefersReducedMotion()

  /**
   * The clip is not decoding — the file 404d, or the browser has no h264.
   * The poster stands in for the picture, but the timeline keeps running off
   * the wall clock, so the wall still builds and the stage is never dead.
   */
  const [stalled, setStalled] = useState(false)
  const stalledRef = useRef(false)

  /** Which photo is in the air, and what has already landed on the wall. */
  const [shot, setShot] = useState<number | null>(null)
  const [wall, setWall] = useState<(number | null)[]>(() => Array(MAX_SEATS).fill(null))

  // Frame-loop state lives in refs: the timeline is read every frame, and
  // putting it in state would re-render the tree sixty times a second.
  const shotRef = useRef<number | null>(null)
  const taken = useRef(0)
  const firedThisPass = useRef(false)
  const lastTime = useRef(0)

  // Reduced motion: no timeline to run, so the wall arrives already built. It
  // is the resolved state — the same thing the loop would leave behind.
  useEffect(() => {
    if (!still) return
    setWall(Array.from({ length: MAX_SEATS }, (_, i) => i % PHOTOS.length))
    setShot(null)
    shotRef.current = null
  }, [still])

  // ── playback ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = video.current
    if (!el || still || stalled) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.15 },
    )
    io.observe(el)

    // A decode that never starts is not an error — no `error` event, no
    // `stalled`, just an element parked at readyState 0 forever. Without this
    // the stage would sit on a black rectangle and never build anything.
    const guard = window.setTimeout(() => {
      if (el.currentTime < 0.3) {
        stalledRef.current = true
        setStalled(true)
      }
    }, 4000)

    return () => {
      io.disconnect()
      window.clearTimeout(guard)
    }
  }, [still, stalled])

  // ── the timeline, driven by the clip's own clock ─────────────────────────
  // Not by a timer: a timer and a video drift apart the moment the decoder
  // stutters or the tab is throttled, and then the shot stops coming out of
  // the camera at the instant he presses the shutter.
  useEffect(() => {
    if (still || !box.width) return

    let frame = 0

    const tick = () => {
      frame = requestAnimationFrame(tick)
      const el = video.current
      const t = stalledRef.current || !el ? (performance.now() / 1000) % DURATION : el.currentTime

      // `loop` never fires `ended`, so a new pass is the clock going backwards.
      if (t < lastTime.current - 0.1) firedThisPass.current = false
      lastTime.current = t

      if (!firedThisPass.current && t >= FIRE) {
        firedThisPass.current = true
        const next = taken.current % PHOTOS.length
        shotRef.current = next
        setShot(next)
        onCapture?.()
      }

      const index = shotRef.current
      const el2 = card.current
      if (index === null || !el2) {
        if (wire.current) wire.current.style.opacity = '0'
        return
      }

      // It has landed: hand it to the wall and take the card down.
      if (t >= FLY_END || t < FIRE) {
        const seat = taken.current % seats.length
        setWall((current) => current.map((v, i) => (i === seat ? index : v)))
        taken.current += 1
        shotRef.current = null
        setShot(null)
        return
      }

      const cx = stageW * layout.card.x
      const cy = stageH * layout.card.y
      // The one anchor still in picture space: it has to land on his hands.
      const camx = box.left + box.width * CAMERA.x
      const camy = box.top + box.height * CAMERA.y
      const seat = seats[taken.current % seats.length]

      let x = cx
      let y = cy
      let scale = 1
      let opacity = 1

      if (t < POP_END) {
        // Out of the camera body, growing.
        const p = smooth(clamp01((t - FIRE) / (POP_END - FIRE)))
        x = lerp(camx, cx, p)
        y = lerp(camy, cy, p)
        scale = 0.05 + 0.95 * p
        opacity = clamp01(p * 2.4)
      } else if (t < HOLD_END) {
        // Held open while he reads the back of the camera, creeping larger.
        scale = 1 + 0.045 * clamp01((t - POP_END) / (HOLD_END - POP_END))
      } else {
        // Away to its place on the wall.
        const p = smooth(clamp01((t - HOLD_END) / (FLY_END - HOLD_END)))
        x = lerp(cx, stageW * seat.x, p)
        y = lerp(cy, stageH * seat.y, p)
        scale = lerp(1.045, slotW / cardW, p)
        opacity = 1 - p * 0.2
      }

      el2.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`
      el2.style.opacity = String(opacity)

      // The hairline back to the camera, so the picture reads as having come
      // out of that body rather than having been placed there.
      const line = wire.current
      if (line) {
        const lit = t < HOLD_END ? 1 : 0
        line.style.opacity = String(lit * opacity * 0.55)
        line.setAttribute('x1', String(camx))
        line.setAttribute('y1', String(camy))
        line.setAttribute('x2', String(x))
        line.setAttribute('y2', String(y))
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [still, stageW, stageH, basis, box, layout, seats, cardW, slotW, onCapture])

  const picture = shot === null ? null : PHOTOS[shot]

  return (
    <div ref={stage} className="absolute inset-0 overflow-hidden">
      {/* THE PICTURE. Feathered at the stage's own edges — see FEATHER — and
          holding the video at the cover box inside it. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden" style={FEATHER_X}>
        <div className="absolute inset-0 overflow-hidden" style={FEATHER_Y}>
          <div className="absolute inset-0 overflow-hidden" style={FEATHER_R}>
            {/* The picture, held at the cover box inside the feathered stage. */}
            <div
              className="absolute"
              style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
            >
              {stalled || still ? (
                <img src={film.poster} alt="" className="size-full object-cover" />
              ) : (
                <video
                  ref={video}
                  src={film.clip}
                  poster={film.poster}
                  className="size-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onError={() => {
                    stalledRef.current = true
                    setStalled(true)
                  }}
                />
              )}

              {/* There used to be a blue wash here, lifting the take's shadows
                  towards a pale navy field so it did not sit on the page as a
                  hole. The ground is a warm near-black now and the footage is
                  warm and dark, so the two meet on their own — the wash would
                  only mute the one thing on the page that must not be muted. */}
            </div>
          </div>
        </div>
      </div>

      {/* THE WORK. Anchored to the picture, not to the stage, and deliberately
          outside the feather — a photograph on the wall must not fade just
          because it is near an edge. */}
      <div className="pointer-events-none absolute inset-0">
        {/* Keyed by slot AND photograph: there are more photographs than slots,
            so a slot is eventually reused, and keying by slot alone would swap
            the <img> underneath a mounted element — the old picture snaps into
            the new one with no transition. A new key remounts it, which replays
            the settle and reads as one photograph replacing another. */}
        {wall
          .slice(0, seats.length)
          .map((index, i) =>
            index === null ? null : (
              <Parked
                key={`${i}-${index}`}
                seat={seats[i]}
                photo={PHOTOS[index]}
                w={slotW}
                stageW={stageW}
                stageH={stageH}
              />
            ),
          )}

        {/* The hairline back to the camera. */}
        <svg
          aria-hidden
          className="absolute inset-0 size-full"
          viewBox={`0 0 ${stageW || 1} ${stageH || 1}`}
        >
          <line
            ref={wire}
            stroke="var(--color-amber-glow)"
            strokeWidth="1"
            strokeDasharray="3 4"
            style={{ opacity: 0 }}
          />
        </svg>

        {/* The freeze-frame. */}
        {picture && (
          <div
            ref={card}
            className="absolute top-0 left-0 origin-center"
            style={{ width: cardW, opacity: 0 }}
          >
            {/* A print, not a readout: the shot that has just been taken is
                marked by being large, lit and captioned — not by brackets. */}
            <div className="relative aspect-[4/3] bg-char p-[4px] shadow-[0_26px_60px_-22px_rgba(0,0,0,0.85)]">
              <img src={picture.src} alt="" className="size-full object-cover" />
            </div>
            <div className="mt-2 flex items-baseline gap-2" style={{ textShadow: ON_FILM }}>
              <span className="tech-sm text-amber-glow">{film.captureLabel}</span>
              <span className="h-px flex-1 bg-white/25" />
              <span className="tech text-white">{picture.event}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** One photograph, parked on the wall. Placed and sized in stage pixels, so it
 *  keeps its spot and stays legible at every viewport width. */
function Parked({
  seat,
  photo,
  w,
  stageW,
  stageH,
}: {
  seat: Seat
  photo: (typeof PHOTOS)[number]
  w: number
  stageW: number
  stageH: number
}) {
  return (
    <figure
      className="pointer-events-none absolute top-0 left-0 origin-center"
      style={{
        width: w,
        transform: `translate(${stageW * seat.x}px, ${stageH * seat.y}px) translate(-50%, -50%) rotate(${seat.rotate}deg)`,
        animation: 'photo-land 0.5s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <div className="aspect-[4/3] bg-char p-[2px] shadow-[0_12px_28px_-14px_rgba(0,0,0,0.7)]">
        <img src={photo.src} alt="" className="size-full object-cover" />
      </div>
      <figcaption
        className="tech-sm mt-1 text-center text-white/70"
        style={{ textShadow: ON_FILM }}
      >
        {photo.event}
      </figcaption>
    </figure>
  )
}
