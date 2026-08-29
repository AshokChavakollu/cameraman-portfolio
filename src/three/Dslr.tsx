import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AMBER } from './layout'

/**
 * A solid camera — the one place on the site that is rendered rather than
 * drawn. The hero is a blueprint; this is the thing the blueprint describes,
 * and it is doing the job: zooming, firing, recoiling.
 *
 * One cycle, on a loop:
 *
 *   0.00–0.45  push in — the zoom barrel extends and the body leans forward
 *   0.45–0.55  the shutter button goes down
 *   0.55       FIRE — mirror slaps, flash pops, a print leaves the camera
 *   0.55–0.75  recoil, then the barrel pulls back
 *   0.75–1.00  hold, and drift toward the next subject
 *
 * Everything is driven off one normalised phase so the parts can never
 * disagree about where they are in the cycle.
 */

const BODY = '#101f3f'
const PLASTIC = '#0a1730'
const METAL = '#41567f'

type Props = {
  /** Seconds per shot. */
  interval?: number
  /** Fired at the moment of exposure. */
  onCapture?: () => void
  /** Smoothed pointer, -1..1 from viewport centre. */
  pointer: React.RefObject<{ x: number; y: number }>
  /** Static pose, no useFrame work. */
  still?: boolean
}

export default function Dslr({ interval = 3.2, onCapture, pointer, still }: Props) {
  const rig = useRef<THREE.Group>(null)
  const zoom = useRef<THREE.Group>(null)
  const button = useRef<THREE.Mesh>(null)
  const flash = useRef<THREE.Mesh>(null)
  const glass = useRef<THREE.Mesh>(null)
  const flashLight = useRef<THREE.PointLight>(null)
  const fired = useRef(-1)

  useFrame((state) => {
    if (still) return
    const t = state.clock.elapsedTime
    const cycle = Math.floor(t / interval)
    const phase = (t % interval) / interval
    const p = pointer.current ?? { x: 0, y: 0 }

    // One exposure per cycle, at the moment the button bottoms out.
    if (phase > 0.55 && fired.current !== cycle) {
      fired.current = cycle
      onCapture?.()
    }

    // How far into the shot we are, 0 → 1 → 0 across the push-in and recoil.
    const push = phase < 0.5 ? ease(phase / 0.5) : phase < 0.8 ? 1 - ease((phase - 0.5) / 0.3) : 0
    // A short spike right at the exposure.
    const pop = phase > 0.55 && phase < 0.72 ? 1 - (phase - 0.55) / 0.17 : 0

    if (rig.current) {
      // Turns toward the next subject between shots, and leans in for each one.
      rig.current.rotation.y = 2 + Math.sin(t * 0.22) * 0.26 + p.x * 0.18 + push * 0.06
      rig.current.rotation.x = Math.sin(t * 0.17 + 1.2) * 0.05 - p.y * 0.1 + pop * 0.035
      rig.current.position.z = push * 0.18 - pop * 0.06 // recoil
      rig.current.position.y = Math.sin(t * 0.9) * 0.012
    }

    // Zoom barrel rides out on the push-in.
    if (zoom.current) zoom.current.position.z = 0.62 + push * 0.26

    // Shutter button travels about a millimetre, like a real one.
    if (button.current)
      button.current.position.y = 0.58 - (phase > 0.45 && phase < 0.62 ? 0.035 : 0)

    if (flash.current) {
      const m = flash.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 0.25 + pop * 9
    }
    if (flashLight.current) flashLight.current.intensity = pop * 55

    if (glass.current) {
      const m = glass.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 0.35 + push * 0.5 + pop * 2.2
    }
  })

  return (
    <group ref={rig} rotation={[0, 2, 0]} scale={1}>
      {/* ── Body: a chamfered shell, not a box. Every real camera has a
             radius on it, and a hard-edged cuboid is what makes a render read
             as a placeholder. ── */}
      <mesh geometry={BODY_GEO}>
        <meshStandardMaterial color={BODY} metalness={0.42} roughness={0.46} />
      </mesh>
      {/* Rubber armour band around the middle of the shell */}
      <mesh position={[0, -0.12, 0]} geometry={ARMOUR_GEO}>
        <meshStandardMaterial color="#0a1630" metalness={0.1} roughness={0.92} />
      </mesh>

      {/* Grip, camera-right — rounded, with finger ridges */}
      <mesh position={[0.74, -0.06, 0.06]} geometry={GRIP_GEO}>
        <meshStandardMaterial color={PLASTIC} metalness={0.18} roughness={0.82} />
      </mesh>
      {[-0.28, -0.12, 0.04, 0.2].map((y) => (
        <mesh key={y} position={[0.95, y, 0.16]} rotation={[0, 0.25, 0]}>
          <boxGeometry args={[0.02, 0.1, 0.3]} />
          <meshStandardMaterial color="#08122a" metalness={0.1} roughness={0.95} />
        </mesh>
      ))}

      {/* Pentaprism hump — sloped front face, the shape that says "SLR" */}
      <mesh position={[-0.05, 0.62, 0]} geometry={PRISM_GEO}>
        <meshStandardMaterial color={BODY} metalness={0.42} roughness={0.44} />
      </mesh>
      {/* Hot shoe, with its contact rails */}
      <mesh position={[-0.05, 0.8, 0]}>
        <boxGeometry args={[0.26, 0.05, 0.3]} />
        <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[-0.05, 0.83, 0]}>
        <boxGeometry args={[0.19, 0.02, 0.22]} />
        <meshStandardMaterial color="#0a1428" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Top LCD — the little data panel above the grip */}
      <mesh position={[0.55, 0.53, -0.06]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.34, 0.22]} />
        <meshStandardMaterial
          color="#0b2c4a"
          emissive="#3f7fb8"
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Strap lugs, one each side */}
      {[-0.86, 0.86].map((x) => (
        <mesh key={x} position={[x, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.07, 0.022, 8, 16]} />
          <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.35} />
        </mesh>
      ))}

      {/* Eyecup behind the prism */}
      <mesh position={[-0.05, 0.55, -0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.13, 0.12, 20]} />
        <meshStandardMaterial color="#0a1630" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Flash panel, front of the hump */}
      <mesh ref={flash} position={[-0.05, 0.6, 0.29]}>
        <boxGeometry args={[0.44, 0.16, 0.03]} />
        <meshStandardMaterial
          color="#e9e4da"
          emissive="#ffe9c4"
          emissiveIntensity={0.25}
          roughness={0.3}
        />
      </mesh>
      <pointLight
        ref={flashLight}
        position={[-0.05, 0.6, 0.9]}
        color="#fff2d8"
        intensity={0}
        distance={9}
      />

      {/* Shutter button + mode dial on the top plate */}
      <mesh ref={button} position={[0.66, 0.58, 0.16]}>
        <cylinderGeometry args={[0.1, 0.11, 0.07, 24]} />
        <meshStandardMaterial color="#d8d2c8" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.62, 0.6, -0.02]}>
        <cylinderGeometry args={[0.2, 0.2, 0.12, 28]} />
        <meshStandardMaterial color={PLASTIC} metalness={0.4} roughness={0.6} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2
        return (
          <mesh key={i} position={[-0.62 + Math.cos(a) * 0.2, 0.66, -0.02 + Math.sin(a) * 0.2]}>
            <boxGeometry args={[0.03, 0.02, 0.03]} />
            <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.4} />
          </mesh>
        )
      })}

      {/* Screen on the back */}
      <mesh position={[-0.12, -0.02, -0.32]}>
        <boxGeometry args={[0.92, 0.66, 0.02]} />
        <meshStandardMaterial
          color="#071a3a"
          emissive="#2a5290"
          emissiveIntensity={0.6}
          roughness={0.25}
        />
      </mesh>

      {/* Brand plate, blank on purpose */}
      <mesh position={[-0.5, 0.18, 0.32]}>
        <boxGeometry args={[0.34, 0.08, 0.01]} />
        <meshStandardMaterial color={AMBER} metalness={0.6} roughness={0.35} />
      </mesh>

      {/* ── Lens: fixed mount, then the barrel that rides out on zoom ── */}
      <mesh position={[-0.05, -0.02, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.44, 0.24, 40]} />
        <meshStandardMaterial color={PLASTIC} metalness={0.5} roughness={0.5} />
      </mesh>

      <group ref={zoom} position={[0, 0, 0.62]}>
        <mesh position={[-0.05, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.4, 0.42, 40]} />
          <meshStandardMaterial color="#12244a" metalness={0.45} roughness={0.55} />
        </mesh>
        {/* Zoom ring — knurled band */}
        <mesh position={[-0.05, -0.02, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.41, 0.41, 0.16, 48]} />
          <meshStandardMaterial color="#0a1730" metalness={0.3} roughness={0.85} flatShading />
        </mesh>
        {/* Red ring, the one detail every photographer's eye goes to */}
        <mesh position={[-0.05, -0.02, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.395, 0.395, 0.045, 40]} />
          <meshStandardMaterial
            color={AMBER}
            emissive={AMBER}
            emissiveIntensity={0.5}
            roughness={0.4}
          />
        </mesh>
        {/* Front element */}
        <mesh position={[-0.05, -0.02, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.03, 40]} />
          <meshStandardMaterial color="#081530" metalness={0.9} roughness={0.12} />
        </mesh>
        <mesh ref={glass} position={[-0.05, -0.02, 0.38]}>
          <circleGeometry args={[0.33, 40]} />
          <meshStandardMaterial
            color="#0e2044"
            emissive={AMBER}
            emissiveIntensity={0.18}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Lens hood lip */}
        <mesh position={[-0.05, -0.02, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.44, 0.38, 0.16, 40, 1, true]} />
          <meshStandardMaterial
            color="#091428"
            metalness={0.3}
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
}

/** Ease in-out, so the push-in never starts or stops abruptly. */
const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)

/* ── Geometry ─────────────────────────────────────────────────────────────
   Built once at module load: the shapes never change, and rebuilding an
   ExtrudeGeometry on every render would be the most expensive thing on the
   page. */

/** A slab with rounded corners and a bevelled edge — the camera's shell. */
function shell(w: number, h: number, depth: number, r: number, bevel = 0.035) {
  const shape = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(depth - bevel * 2, 0.01),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 10,
  })
  geometry.center()
  return geometry
}

const BODY_GEO = shell(1.7, 1.05, 0.62, 0.16)
const ARMOUR_GEO = shell(1.72, 0.42, 0.64, 0.1, 0.02)
const GRIP_GEO = shell(0.44, 1.0, 0.74, 0.2)
/** Prism: a wedge, taller at the back than the front. */
const PRISM_GEO = (() => {
  const shape = new THREE.Shape()
  shape.moveTo(-0.31, -0.16)
  shape.lineTo(0.31, -0.16)
  shape.lineTo(0.31, 0.1)
  shape.lineTo(0, 0.18)
  shape.lineTo(-0.31, 0.1)
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
  })
  geometry.center()
  geometry.rotateY(Math.PI / 2)
  return geometry
})()
