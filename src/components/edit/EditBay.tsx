import { useEffect, useRef, useState } from 'react'
import Monitor from './Monitor'
import Timeline from './Timeline'
import { Eyebrow, Lede, Section, SectionTitle } from '../ui'
import { ABOUT, EDIT } from '../../data/site'
import { gsap, prefersReducedMotion, useReveal } from '../../lib/motion'

/**
 * The edit bay: one wedding film on a timeline, playing itself.
 *
 * The shutter section shows the day being captured. This shows what happens
 * for the five weeks afterwards — the part a couple never sees, and the part
 * this photographer does himself instead of sending it to a farm. That claim
 * was a sentence in a paragraph before; here you watch it.
 *
 * The playhead runs the full timeline on a loop at 4×, which is how an editor
 * actually moves through a cut — scrubbing, not watching. Whatever it is
 * sitting on appears in the monitor above.
 */

/** Real seconds for one pass of the timeline. 72s of footage in 18s. */
const LOOP = 18

export default function EditBay() {
  const section = useReveal<HTMLElement>()
  const host = useRef<HTMLDivElement>(null)
  const playhead = useRef<HTMLDivElement>(null)
  const [tc, setTc] = useState(() => timecode(0))
  const [activeId, setActiveId] = useState(EDIT.clips[0].id)
  const [overlayId, setOverlayId] = useState<string | undefined>(undefined)

  // Warm every frame before the playhead reaches it, so a cut never shows a
  // blank monitor while the next photograph decodes.
  useEffect(() => {
    EDIT.clips.forEach((c) => {
      if (!c.frame) return
      const img = new Image()
      img.src = `/work/${c.frame}.jpg`
    })
  }, [])

  useEffect(() => {
    const el = host.current
    if (!el) return

    // Park it mid-timeline and leave it there.
    if (prefersReducedMotion()) {
      apply(0.46)
      return
    }

    let visible = true
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
            rootMargin: '120px',
          })
        : undefined
    io?.observe(el)

    const state = { p: 0 }
    let lastActive = ''
    let lastOverlay = ''
    let lastTc = ''

    function apply(p: number) {
      // Positioned against the track, not translated: the playhead is 1px
      // wide, so a percentage transform would move it by a fraction of a pixel.
      if (playhead.current) playhead.current.style.left = `${p * 100}%`

      const t = p * EDIT.duration
      const spine = EDIT.clips.find((c) => c.track === 'V1' && t >= c.start && t < c.start + c.dur)
      const over = EDIT.clips.find((c) => c.track === 'V2' && t >= c.start && t < c.start + c.dur)

      // Only touch React when something a human can see has changed.
      if (spine && spine.id !== lastActive) {
        lastActive = spine.id
        setActiveId(spine.id)
      }
      if ((over?.id ?? '') !== lastOverlay) {
        lastOverlay = over?.id ?? ''
        setOverlayId(over?.id)
      }
      const next = timecode(t)
      if (next !== lastTc) {
        lastTc = next
        setTc(next)
      }
    }

    const tween = gsap.to(state, {
      p: 1,
      duration: LOOP,
      ease: 'none',
      repeat: -1,
      onUpdate: () => {
        if (visible) apply(state.p)
      },
    })

    return () => {
      io?.disconnect()
      tween.kill()
    }
  }, [])

  const active = EDIT.clips.find((c) => c.id === activeId)
  const overlay = EDIT.clips.find((c) => c.id === overlayId)

  return (
    <Section id="about" ref={section} className="py-14 md:py-16">
      <div className="grid items-end gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <Eyebrow>{ABOUT.eyebrow}</Eyebrow>
          <SectionTitle>{ABOUT.title}</SectionTitle>
        </div>
        <Lede>
          Every wedding comes home as four hundred gigabytes of nothing in particular. This is where
          it becomes a film — cut, graded and finished by the same person who shot it.
        </Lede>
      </div>

      {/* The suite itself is a dark room — a deep navy panel on the light page,
          which is both how an NLE actually looks and the separation the
          section was missing. Its colours are fixed, not theme tokens. */}
      <div
        ref={host}
        className="reveal mt-8 rounded-2xl border border-[#2b2620] bg-[#100e0c] p-4 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.66)] sm:p-6"
      >
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ── Monitor ── */}
          <div>
            <Monitor
              clips={EDIT.clips.filter((c) => c.track === 'V1')}
              activeId={activeId}
              overlay={overlay?.label}
              timecode={tc}
            />

            <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-[#2b2620] pt-3">
              <span className="tech-sm text-[#9c9285]/80">now cutting</span>
              <span className="tech-sm text-[#ece5d8]/90">{active?.label}</span>
              <span className="tech-sm ml-auto text-[#d0a45c]/90">graded in-house</span>
            </div>
          </div>

          {/* ── Timeline ── */}
          <Timeline activeId={activeId} playhead={playhead} />
        </div>
      </div>

      {/* ── His story, and what it is shot on ──
             One paragraph and a single wrapped row of kit. The six-row gear
             table read as a spec sheet and cost 200px for information nobody
             books a wedding on. */}
      <div className="mt-10 grid gap-6 border-t border-line/70 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <p className="reveal max-w-2xl t-body text-ash">{ABOUT.body[0]}</p>

        <ul className="reveal flex flex-wrap items-start gap-x-2 gap-y-2 self-start">
          {ABOUT.kit.map((k) => (
            <li
              key={k.label}
              className="rounded-full border border-line px-3 py-1.5 t-label text-ash/85"
            >
              <span className="text-amber/80">{k.label}</span> · {k.value}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

/** Timeline seconds → broadcast timecode at 24fps. */
function timecode(t: number) {
  const total = EDIT.startTC + t
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = Math.floor(total % 60)
  const f = Math.floor((t % 1) * 24)
  return [h, m, s, f].map((v) => String(v).padStart(2, '0')).join(':')
}
