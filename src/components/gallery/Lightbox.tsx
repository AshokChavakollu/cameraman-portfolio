import { useEffect, useRef } from 'react'
import type { Shot } from '../../data/site'
import Icon from '../Icon'

/**
 * Full-bleed viewer. Keyboard is first-class: Esc closes, arrows step, and
 * focus is parked on the dialog so a keyboard user is not left behind on the
 * grid underneath.
 */
export default function Lightbox({
  shots,
  index,
  onClose,
  onStep,
}: {
  shots: Shot[]
  index: number
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const dialog = useRef<HTMLDivElement>(null)
  const shot = shots[index]

  useEffect(() => {
    dialog.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [onClose, onStep])

  if (!shot) return null

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`${shot.title}, ${shot.place}`}
      tabIndex={-1}
      className="fixed inset-0 z-[70] flex flex-col bg-ink/97 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <span className="tech text-ash tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="tap-44 flex size-10 items-center justify-center rounded-full border border-line text-bone transition-colors hover:border-amber hover:text-amber"
        >
          <Icon name="close" className="size-4" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-3 px-3 sm:px-8">
        <StepButton dir={-1} onStep={onStep} />

        <figure className="flex min-h-0 flex-1 flex-col items-center justify-center">
          {shot.src ? (
            <img
              src={shot.src}
              alt={`${shot.title}, ${shot.place}`}
              className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
            />
          ) : (
            <div
              className="flex aspect-[3/2] w-full max-w-3xl items-center justify-center rounded-lg border border-line"
              style={{
                background: `linear-gradient(155deg, hsl(${shot.hue} 38% 24%), hsl(30 18% 14%) 60%, #100e0c 100%)`,
              }}
            >
              <span className="tech text-bone/45 ">photograph pending</span>
            </div>
          )}
          <figcaption className="mt-6 text-center">
            <span className="block t-card font-light text-bone">
              {shot.title}
            </span>
            <span className="mt-1 block tech-sm text-ash ">
              {shot.place} · {shot.tag}
            </span>
          </figcaption>
        </figure>

        <StepButton dir={1} onStep={onStep} />
      </div>

      <div className="h-6" />
    </div>
  )
}

function StepButton({ dir, onStep }: { dir: 1 | -1; onStep: (delta: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onStep(dir)}
      aria-label={dir === 1 ? 'Next photograph' : 'Previous photograph'}
      className="tap-44 flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-bone transition-colors hover:border-amber hover:text-amber"
    >
      <Icon name="arrow" className={`size-4 ${dir === -1 ? 'rotate-180' : ''}`} strokeWidth={1.4} />
    </button>
  )
}
