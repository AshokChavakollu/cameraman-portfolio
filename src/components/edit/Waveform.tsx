/**
 * A mirrored audio waveform, drawn not sampled.
 *
 * Real waveforms are not noise — they have shape: a dhol block pulses, a vow
 * block is quiet with peaks where somebody speaks, room tone is nearly flat.
 * `energy` picks which of those a block behaves like, and the values are
 * deterministic so the bars never reshuffle between renders.
 */
export default function Waveform({
  seed,
  energy = 'loud',
  className = '',
}: {
  seed: number
  /** loud: music and drums · speech: quiet with peaks · quiet: room tone */
  energy?: 'loud' | 'speech' | 'quiet'
  className?: string
}) {
  const bars = 96
  const values = Array.from({ length: bars }, (_, i) => {
    // A cheap deterministic hash — same seed, same waveform, every render.
    const n = Math.abs(Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453) % 1

    if (energy === 'quiet') return 0.08 + n * 0.12
    if (energy === 'speech') {
      // Mostly low, with occasional syllable peaks.
      const speaking = Math.sin(i * 0.42 + seed) > 0.35
      return speaking ? 0.25 + n * 0.6 : 0.08 + n * 0.18
    }
    // Loud: a steady pulse with variation on top, like a drum bed.
    const pulse = (Math.sin(i * 0.55 + seed) + 1) / 2
    return 0.35 + pulse * 0.4 + n * 0.25
  })

  return (
    <svg
      viewBox={`0 0 ${bars} 20`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      {values.map((v, i) => (
        <rect
          key={i}
          x={i + 0.15}
          y={10 - v * 9}
          width={0.7}
          height={v * 18}
          fill="currentColor"
          opacity={0.55}
        />
      ))}
    </svg>
  )
}
