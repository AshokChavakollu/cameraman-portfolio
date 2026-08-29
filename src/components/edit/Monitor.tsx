import type { EditClip } from '../../data/site'

/**
 * The programme monitor: whatever the playhead is sitting on.
 *
 * Every frame is mounted once and crossfaded by opacity rather than swapped
 * into one <img> via src. Two reasons, in order of importance:
 *
 *  1. The panel lives inside an element GSAP leaves a transform on, which
 *     promotes it to its own compositing layer. Chrome does not reliably
 *     repaint that layer when an <img> changes src — the frame decodes,
 *     reports its natural size, and paints nothing at all.
 *  2. A dissolve between clips is what an edit actually looks like. A hard
 *     src swap pops.
 *
 * The frames are the same photographs the shutter section throws onto the
 * stack, so a visitor who scrolled past it recognises the shot.
 *
 * Colours are the suite's own — an NLE is a dark instrument whatever the
 * site theme is, so nothing in here reads the theme tokens.
 */
export default function Monitor({
  clips,
  activeId,
  overlay,
  timecode,
}: {
  clips: EditClip[]
  activeId?: string
  overlay?: string
  timecode: string
}) {
  const active = clips.find((c) => c.id === activeId)

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#24407c] bg-[#060f24]">
      {clips.map((c) =>
        c.frame ? (
          <img
            key={c.id}
            src={`/work/${c.frame}.jpg`}
            alt={c.label}
            decoding="async"
            className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
              c.id === activeId ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null,
      )}

      {/* Safe-area guides — every monitor in every suite has these on. */}
      <span className="pointer-events-none absolute inset-[7%] z-10 border border-[#e8eefc]/12" />
      <span className="pointer-events-none absolute inset-[13%] z-10 border border-[#e8eefc]/8" />

      {/* Top strip: what is playing */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-[#060f24]/85 to-transparent px-3 py-2">
        <span className="tech-sm text-[#e8eefc]/85">{active?.label ?? 'no clip'}</span>
        {overlay && (
          <span className="tech-sm rounded border border-[#e6c079]/40 bg-[#060f24]/50 px-1.5 py-0.5 text-[#e6c079]/90">
            v2 · {overlay}
          </span>
        )}
      </div>

      {/* Bottom strip: transport state and timecode */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-gradient-to-t from-[#060f24]/90 to-transparent px-3 py-2">
        <span className="tech-sm flex items-center gap-2 text-[#e8eefc]/85">
          <span className="size-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-[#e6c079]" />
          play
        </span>
        <span className="tech-sm text-[#e6c079]/90 tabular-nums">{timecode}</span>
      </div>
    </div>
  )
}
