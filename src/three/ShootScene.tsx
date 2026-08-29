import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Dslr from './Dslr'
import { prefersReducedMotion, usePointer } from '../lib/motion'

/**
 * The lit stage for the solid camera.
 *
 * Unlike the hero — which is a line drawing and needs no lights at all — this
 * one is shaded, so it gets a three-point rig: a warm key up camera-left, a
 * cold rim behind to lift the body off the ground, and a fill weak enough that
 * the shadows stay heavy. No environment map: at this roughness the body reads
 * as anodised metal without one, and it saves the request.
 */
export default function ShootScene({ onCapture }: { onCapture?: () => void }) {
  const host = useRef<HTMLDivElement>(null)
  const pointer = usePointer()
  const [visible, setVisible] = useState(false)
  const still = prefersReducedMotion()

  useEffect(() => {
    const el = host.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '150px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={host} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.8]}
        frameloop={still || !visible ? 'demand' : 'always'}
        camera={{ position: [2.85, 0.85, 3.8], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <spotLight
            position={[3.5, 4, 3]}
            angle={0.6}
            penumbra={0.9}
            intensity={140}
            color="#ffe6bb"
            distance={20}
          />
          <pointLight position={[-3.5, 1.2, -2.5]} intensity={45} color="#3462cc" distance={14} />
          {/* Front fill from the viewer side, so the lens and the grip read */}
          <pointLight position={[1.6, 1.4, 4.2]} intensity={52} color="#ffe4bd" distance={12} />
          <ambientLight intensity={0.45} />

          <Dslr pointer={pointer} onCapture={onCapture} still={still} />
        </Suspense>
      </Canvas>
    </div>
  )
}
