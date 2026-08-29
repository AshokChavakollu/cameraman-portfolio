import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../../lib/motion'

/**
 * The viewfinder overlay: framing brackets, a focus box, and a readout of
 * exposure values that drifts the way a real camera's does when the operator
 * is riding aperture. It is decorative, so it is hidden from screen readers.
 */

const FOCALS = ['24mm', '35mm', '50mm', '85mm']
const STOPS = ['f/1.4', 'f/1.8', 'f/2.0', 'f/2.8']
const ISOS = ['640', '800', '1250', '1600']

export default function HeroHud({ frames }: { frames: number }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = window.setInterval(() => setTick((t) => t + 1), 2600)
    return () => window.clearInterval(id)
  }, [])

  const focal = FOCALS[tick % FOCALS.length]
  const stop = STOPS[(tick + 2) % STOPS.length]
  const iso = ISOS[(tick + 1) % ISOS.length]

  return (
    <div
      aria-hidden="true"
      className="tech-sm pointer-events-none absolute inset-0 z-20 text-bone/50"
    >
      {/* Corner brackets */}
      <Bracket className="top-6 left-6 border-t border-l" />
      <Bracket className="top-6 right-6 border-t border-r" />
      <Bracket className="bottom-6 left-6 border-b border-l" />
      <Bracket className="right-6 bottom-6 border-b border-r" />

      {/* Top strip: REC state */}
      <div className="absolute top-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        <span
          className="size-1.5 rounded-full bg-rec"
          style={{ animation: 'rec-blink 1.4s steps(1) infinite' }}
        />
        <span className="text-rec/90">rec</span>
        <span className="text-bone/30">4k · 24fps</span>
      </div>

      {/* Focus box, sitting over the lens */}
      <div className="absolute top-1/2 left-1/2 hidden size-28 -translate-x-1/2 -translate-y-1/2 sm:block">
        <span className="absolute top-0 left-0 h-4 w-4 border-t border-l border-amber/70" />
        <span className="absolute top-0 right-0 h-4 w-4 border-t border-r border-amber/70" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-amber/70" />
        <span className="absolute right-0 bottom-0 h-4 w-4 border-r border-b border-amber/70" />
      </div>

      {/* Bottom readout */}
      <div className="absolute right-6 bottom-5 left-6 flex items-end justify-between gap-4">
        <span className="tabular-nums">
          {focal} <span className="text-bone/30">/</span> {stop}{' '}
          <span className="text-bone/30">/</span> iso {iso}
        </span>
        <span className="tabular-nums text-amber/80">frames {String(frames).padStart(5, '0')}</span>
      </div>
    </div>
  )
}

function Bracket({ className }: { className: string }) {
  return <span className={`absolute size-7 border-bone/20 ${className}`} />
}
