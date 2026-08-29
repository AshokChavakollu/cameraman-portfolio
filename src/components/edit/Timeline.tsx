import type { RefObject } from 'react'
import Waveform from './Waveform'
import { EDIT } from '../../data/site'

/**
 * The timeline panel: ruler, four tracks, clips, playhead.
 *
 * Everything is positioned as a percentage of the timeline length, so the
 * panel is resolution-independent — the same code draws it on a phone and on a
 * 2000px display without a single pixel measurement.
 *
 * The playhead is moved by ref rather than by state. At 60fps a state update
 * per frame would re-render every clip in the panel sixty times a second for
 * no visual gain.
 *
 * Colours are the suite's own — an NLE is a dark instrument whatever the
 * site theme is, so nothing in here reads the theme tokens.
 */

const GOLD = '#e6c079'
const BLUE = '#3462cc'

const TRACKS = [
  { id: 'V2', label: 'V2', kind: 'video' as const, height: 'h-9' },
  { id: 'V1', label: 'V1', kind: 'video' as const, height: 'h-12' },
  { id: 'A1', label: 'A1', kind: 'audio' as const, height: 'h-9' },
  { id: 'A2', label: 'A2', kind: 'audio' as const, height: 'h-9' },
]

export default function Timeline({
  activeId,
  playhead,
}: {
  activeId?: string
  playhead: RefObject<HTMLDivElement | null>
}) {
  const pct = (v: number) => `${(v / EDIT.duration) * 100}%`

  return (
    <div className="self-start rounded-lg border border-[#24407c] bg-[#0c1c40]/80 lg:self-center">
      {/* ── Panel toolbar ── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#1e356b] px-3 py-2">
        <span className="tech-sm text-[#e8eefc]/85">{EDIT.project}</span>
        <span className="tech-sm text-[#93a8d9]/70">{EDIT.format}</span>
        <span className="tech-sm ml-auto flex items-center gap-1.5 text-[#93a8d9]/70">
          <span className="size-1.5 rounded-full bg-[#e6c079]/70" />
          snapping
        </span>
        <span className="tech-sm text-[#93a8d9]/70">zoom 1:4</span>
      </div>

      <div className="grid grid-cols-[2.6rem_1fr] sm:grid-cols-[3.4rem_1fr]">
        {/* ── Track headers ── */}
        <div className="border-r border-[#1e356b]">
          <div className="h-6 border-b border-[#1e356b]/70" />
          {TRACKS.map((t) => (
            <div
              key={t.id}
              className={`${t.height} flex items-center justify-between gap-1 border-b border-[#1e356b]/60 px-1.5 sm:px-2`}
            >
              <span className="tech-sm text-[#93a8d9]/80">{t.label}</span>
              {/* Eye for video, speaker for audio — the two controls every
                  editor's hand goes to first. */}
              <span className="text-[#93a8d9]/40">
                {t.kind === 'video' ? <EyeIcon /> : <SpeakerIcon />}
              </span>
            </div>
          ))}
        </div>

        {/* ── Tracks ── */}
        <div className="relative overflow-hidden">
          {/* Ruler */}
          <div className="relative h-6 border-b border-[#1e356b]/70">
            {Array.from({ length: EDIT.duration / 4 + 1 }, (_, i) => {
              const s = i * 4
              const major = s % 12 === 0
              return (
                <span
                  key={s}
                  className={`absolute top-0 w-px ${major ? 'h-3 bg-[#93a8d9]/50' : 'h-1.5 bg-[#93a8d9]/25'}`}
                  style={{ left: pct(s) }}
                >
                  {major && (
                    <span className="tech-sm absolute top-3 left-1 text-[0.5rem] text-[#93a8d9]/55 tabular-nums">
                      {mmss(s)}
                    </span>
                  )}
                </span>
              )
            })}
          </div>

          {TRACKS.map((t) => (
            <div key={t.id} className={`${t.height} relative border-b border-[#1e356b]/60`}>
              {t.kind === 'video'
                ? EDIT.clips
                    .filter((c) => c.track === t.id)
                    .map((c) => (
                      <VideoClip
                        key={c.id}
                        label={c.label}
                        left={pct(c.start)}
                        width={pct(c.dur)}
                        overlay={t.id === 'V2'}
                        active={c.id === activeId}
                      />
                    ))
                : EDIT.audio
                    .filter((a) => a.track === t.id)
                    .map((a, i) => (
                      <AudioClip
                        key={a.id}
                        label={a.label}
                        left={pct(a.start)}
                        width={pct(a.dur)}
                        seed={i + (t.id === 'A2' ? 9 : 1)}
                        energy={
                          t.id === 'A2' ? 'loud' : i === 1 ? 'speech' : i === 2 ? 'quiet' : 'loud'
                        }
                      />
                    ))}
            </div>
          ))}

          {/* ── Playhead ── */}
          <div
            ref={playhead}
            className="pointer-events-none absolute top-0 bottom-0 left-0 z-20 w-px bg-[#e6c079] will-change-transform"
          >
            <span className="absolute -top-0.5 -left-[5px] size-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-[#e6c079]" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** A video clip: filmstrip lip, label, and the handles at either end. */
function VideoClip({
  label,
  left,
  width,
  overlay,
  active,
}: {
  label: string
  left: string
  width: string
  overlay?: boolean
  active?: boolean
}) {
  return (
    <div
      className={`absolute inset-y-[3px] overflow-hidden rounded-[3px] border transition-colors duration-300 ${
        active
          ? 'border-[#e6c079]/70 bg-[#e6c079]/20 shadow-[inset_0_0_18px_-6px_#e6c079]'
          : overlay
            ? 'border-[#3462cc]/50 bg-[#3462cc]/15'
            : 'border-[#e6c079]/35 bg-[#e6c079]/10'
      }`}
      style={{ left, width }}
    >
      {/* Filmstrip perforation lip along the top */}
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: 'repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 6px)',
          color: overlay ? BLUE : GOLD,
          opacity: 0.45,
        }}
      />
      <span className="tech-sm absolute inset-x-1.5 top-1/2 truncate -translate-y-1/2 text-[0.5rem] text-[#e8eefc]/85 sm:text-[0.55rem]">
        {label}
      </span>
      {/* Trim handles */}
      <span className="absolute inset-y-1 left-0.5 w-px bg-[#e8eefc]/25" />
      <span className="absolute inset-y-1 right-0.5 w-px bg-[#e8eefc]/25" />
    </div>
  )
}

function AudioClip({
  label,
  left,
  width,
  seed,
  energy,
}: {
  label: string
  left: string
  width: string
  seed: number
  energy: 'loud' | 'speech' | 'quiet'
}) {
  return (
    <div
      className="absolute inset-y-[3px] overflow-hidden rounded-[3px] border border-[#3462cc]/45 bg-[#3462cc]/10"
      style={{ left, width }}
    >
      <Waveform seed={seed} energy={energy} className="size-full text-[#5b8fd6]" />
      <span className="tech-sm absolute inset-x-1.5 top-1/2 truncate -translate-y-1/2 text-[0.5rem] text-[#e8eefc]/75">
        {label}
      </span>
    </div>
  )
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function EyeIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  )
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M3 6h2.5L9 3v10L5.5 10H3z" />
      <path d="M11.5 6.2a3 3 0 0 1 0 3.6" />
    </svg>
  )
}
