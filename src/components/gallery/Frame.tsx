import type { Shot } from '../../data/site'
import Icon from '../Icon'

/**
 * One tile in the grid.
 *
 * Until the real photographs land, `shot.src` is undefined and the tile renders
 * a graded placeholder built from the shot's hue — deliberately good-looking, so
 * the client can judge the layout, and deliberately labelled `NO MEDIA` so
 * nobody ships it by accident. Drop a file in /public/work, set `src`, done.
 */
export default function Frame({
  shot,
  index,
  onOpen,
}: {
  shot: Shot
  index: number
  onOpen: (index: number) => void
}) {
  const span =
    shot.span === 'wide'
      ? 'sm:col-span-2 row-span-2'
      : shot.span === 'tall'
        ? 'row-span-3'
        : 'row-span-2'

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      data-tile
      className={`group relative overflow-hidden rounded-xl border border-line/70 bg-char text-left ${span}`}
      aria-label={`${shot.title}, ${shot.place} — open larger`}
    >
      {shot.src ? (
        <img
          src={shot.src}
          alt={`${shot.title}, ${shot.place}`}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
        />
      ) : (
        <Placeholder hue={shot.hue} index={index} />
      )}

      {/* Caption plate — a fixed dark scrim, because it sits over a photograph
          whatever the page theme is. */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#100e0c]/90 via-[#100e0c]/55 to-transparent p-4 pt-10">
        <span className="block t-card font-light text-[#f3ece0]">
          {shot.title}
        </span>
        <span className="mt-0.5 block tech-sm text-[#b3a897]">{shot.place}</span>
      </span>

      <span className="pointer-events-none absolute top-3 right-3 flex size-8 items-center justify-center rounded-full border border-white/25 bg-[#100e0c]/45 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <Icon name="plus" className="size-3.5 text-[#f3ece0]" />
      </span>
    </button>
  )
}

function Placeholder({ hue, index }: { hue: number; index: number }) {
  return (
    <span
      className="relative block size-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
      style={{
        // Each tile keeps a hint of its own hue, then resolves into the site's
        // navy — otherwise a grid of free-hue gradients fights the palette.
        background: `linear-gradient(155deg,
          hsl(${hue} 38% 22%) 0%,
          hsl(30 18% 13%) 54%,
          #e6dfd2 100%)`,
      }}
    >
      {/* A soft key light in the corner so the tile has a direction of light */}
      <span
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(70% 55% at 22% 18%, rgba(255,255,255,0.55), transparent 70%)',
        }}
      />
      <span className="absolute top-3 left-3 tech-sm text-bone/40 ">
        img {String(index + 1).padStart(3, '0')}
        <span className="ml-2 text-rec/70">no media</span>
      </span>
    </span>
  )
}
