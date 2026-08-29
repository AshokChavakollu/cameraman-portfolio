import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import Photographer from './Photographer'
import { prefersReducedMotion, usePointer } from '../lib/motion'

type Props = {
  onCapture?: () => void
}

/**
 * The hero stage: a lit studio for the photographer.
 *
 * Three-point light in the site palette — warm key from the front right, an
 * amber rim from behind to lift him off the navy, a cold blue fill so the
 * shadows stay cinematic — plus a generated room environment so the camera
 * body reads as metal instead of plastic.
 *
 * The loop stops entirely once the hero leaves the viewport, so the sections
 * below get the whole frame budget for their scroll work.
 */
export default function RigScene({ onCapture }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const pointer = usePointer()
  const [visible, setVisible] = useState(true)
  const still = prefersReducedMotion()

  useEffect(() => {
    const el = host.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={host} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.8]}
        frameloop={still || !visible ? 'demand' : 'always'}
        camera={{ position: [4.8, 1.6, 5.2], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        // Undebounced first measurement — R3F only builds its renderer once
        // it has a non-zero box, and the default scroll-debounced observer
        // can leave the canvas at 300×150 until the visitor moves.
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
        onCreated={({ camera }) => camera.lookAt(0, 0.1, 0)}
      >
        <Suspense fallback={null}>
          {/* Distance fade into the light paper, so the far edge of the stage
              falls away instead of ending in a hard line. */}
          <fog attach="fog" args={['#eff3fb', 9, 19]} />

          <Studio />
          {/* Light-theme rig: the figure stays a dark navy shape on the light
              paper, lifted by a warm key and a cool rim so it reads as form,
              not a flat cutout. */}
          <ambientLight intensity={0.55} color="#eef2ff" />
          <directionalLight position={[4, 5, 4]} intensity={1.3} color="#fff6e8" />
          <directionalLight position={[-5, 3.5, -2]} intensity={2.2} color="#e6c079" />
          <directionalLight position={[-1, 3, -6]} intensity={1.2} color="#5b8fd6" />

          <Photographer pointer={pointer} onCapture={onCapture} still={still} />
          {!still && <Dust />}
          {!still && <CameraDrift />}
        </Suspense>
      </Canvas>
    </div>
  )
}

/** Indoor environment for the PBR metals — generated locally, no fetch. */
function Studio() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = env.texture
    scene.environmentIntensity = 0.3
    return () => {
      scene.environment = null
      env.texture.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

/** Motes in the light. Fifty points, one draw call, no library. */
function Dust() {
  const points = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(50 * 3)
    for (let i = 0; i < 50; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 7
      positions[i * 3 + 1] = Math.random() * 3.4 - 0.6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])

  useFrame((state) => {
    const group = points.current
    if (!group) return
    const t = state.clock.elapsedTime
    group.rotation.y = t * 0.02
    group.position.y = Math.sin(t * 0.18) * 0.12
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#2a52b8"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </points>
  )
}

/** The camera drifts the whole time, so even a held frame breathes. */
function CameraDrift() {
  useFrame((state) => {
    const t = state.clock.elapsedTime
    state.camera.position.x = 4.8 + Math.sin(t * 0.12) * 0.4
    state.camera.position.y = 1.6 + Math.sin(t * 0.09) * 0.22
    state.camera.lookAt(0, 0.1, 0)
  })
  return null
}

