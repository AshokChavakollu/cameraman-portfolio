import type { ShootFrame } from '../../data/site'

/**
 * One print, fresh out of the camera.
 *
 * Until real photographs land in /public/work the image area is a graded field
 * built from the ceremony's hue — the same treatment the work grid uses, so the
 * two never look like different placeholders.
 */
export default function Print({
  frame,
  number,
  innerRef,
}: {
  frame: ShootFrame
  number: number
  innerRef: (el: HTMLDivElement | null) => void
}) {
  return (
    <div
      ref={innerRef}
      className="absolute w-[88%] max-w-[26rem] rounded-lg border border-line/80 bg-char p-2.5 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.9)] will-change-transform sm:w-[86%]"
    >
      <div className="relative aspect-video overflow-hidden rounded">
        {frame.src ? (
          <img
            src={frame.src}
            alt={`${frame.label}, ${frame.place}`}
            className="size-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span
            className="absolute inset-0"
            style={{
              background: `linear-gradient(155deg,
                hsl(${frame.hue} 45% 86%) 0%,
                hsl(220 42% 90%) 54%,
                #e7eefb 100%)`,
            }}
          />
        )}
        {/* Key light in the corner, so the field has a direction */}
        <span
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(72% 56% at 24% 18%, rgba(246,224,180,0.24), transparent 70%)',
          }}
        />
      </div>

      <div className="flex items-baseline justify-between gap-3 px-1 pt-2.5 pb-1">
        <span className="font-display text-[1.1rem] leading-none font-light text-bone">
          {frame.label}
        </span>
        <span className="tech-sm text-ash/70 tabular-nums">{String(number).padStart(4, '0')}</span>
      </div>
      <p className="tech-sm px-1 pb-1 text-ash/55">{frame.place}</p>
    </div>
  )
}
