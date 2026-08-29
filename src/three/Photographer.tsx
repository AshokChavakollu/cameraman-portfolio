import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * The hero: a photographer at work, and the gallery assembling around him.
 *
 * Every cycle he raises the camera, fires, and the shot he just took appears
 * large in the air — a freeze-frame with viewfinder brackets — holds long
 * enough to be seen, then glides into its place in a floating rectangle of
 * photographs that builds up around him. The pictures are the site's real
 * gallery images, so the wall he stands inside is the actual portfolio.
 *
 * The figure is a smooth mannequin, not a wireframe: capsule limbs, sphere
 * joints, matte cloth, warm skin — lit with a key and an amber rim so he
 * reads as a person standing in a studio rather than a diagram.
 */

type Props = {
  pointer: React.RefObject<{ x: number; y: number }>
  onCapture?: () => void
  still?: boolean
}

/* ---------- palette ----------
 * Lit figure on the light page: warm skin, navy suit, dark beard and hair.
 * Form comes from the key and rim lights, not from painted detail. */
const SKIN = '#c08b60'
const CLOTH = '#232e55'
const TROUSER = '#181f3d'
const HAIR = '#191209'
const SHOE = '#0d1122'
const CAM = '#101116'
const CAM_DARK = '#08090d'
/* Line-work runs in the site accent now — light navy on light paper. */
const AMBER = '#2a52b8'
const STRAP = '#3d3323'
const PAPER = '#ffffff'
const SHADOW = '#122a5e'

/* ---------- the real portfolio ---------- */
const PHOTO_FILES = ['haldi', 'mandap', 'mehendi', 'baraat', 'vidaai', 'reception']

/* ---------- the pose, described by where the joints are ----------
 * Everything lives in rig space: feet at y=0, +Z is the direction he shoots.
 * Two keyframes — camera resting at the chest, camera up at the eye — and a
 * single `raise` value blends between them. */
const SHOULDER_R = new THREE.Vector3(0.26, 1.49, 0.03)
const SHOULDER_L = new THREE.Vector3(-0.26, 1.49, 0.03)
const ELBOW_R = { rest: new THREE.Vector3(0.33, 1.06, 0.13), up: new THREE.Vector3(0.37, 1.3, 0.12) }
const ELBOW_L = {
  rest: new THREE.Vector3(-0.29, 1.05, 0.15),
  up: new THREE.Vector3(-0.32, 1.27, 0.17),
}
const CAM_POS = { rest: new THREE.Vector3(0.05, 1.24, 0.27), up: new THREE.Vector3(0.02, 1.6, 0.33) }
const CAM_TILT = { rest: 0.6, up: -0.03 }
const NECK_TILT = { rest: 0.32, up: 0.07 }
/* Hand and strap anchors in camera-local space. */
const HAND_R = new THREE.Vector3(0.16, -0.03, -0.01)
const HAND_L = new THREE.Vector3(-0.07, -0.1, 0.09)
const STRAP_CAM_R = new THREE.Vector3(0.15, 0.03, -0.03)
const STRAP_CAM_L = new THREE.Vector3(-0.15, 0.03, -0.03)
const STRAP_NECK_R = new THREE.Vector3(0.15, 1.47, 0.06)
const STRAP_NECK_L = new THREE.Vector3(-0.15, 1.47, 0.06)

/* ---------- cycle timing, seconds ---------- */
const T_REST = 1.3
const T_RAISE = 0.75
const T_AIM = 1.05
const T_PREVIEW = 1.7
const T_POP = 0.35 // first slice of preview: it grows out of the camera
const T_FLY = 0.75

/* ---------- the dial of photographs ----------
 * The same instrument language as the EPM capability wheel: a flat dial
 * facing the page, photos threaded on a hairline circle around him,
 * instrument ticks at the rim, the wheel turning slowly. Each photo
 * counter-rotates so the pictures stay upright while they ride the wheel,
 * and a connector lights the newest shot. */
const DIAL_R = 1.15
const DIAL_CY = 1.05
const WHEEL_SPEED = 0.07
/** Slot angles, top first, walking clockwise like a clock face. */
const DIAL_SLOTS: number[] = Array.from(
  { length: 8 },
  (_, i) => Math.PI / 2 - (i / 8) * Math.PI * 2,
)
const RING_COUNT = DIAL_SLOTS.length
const PHOTO_W = 0.46
const PHOTO_H = 0.345
const PREVIEW_W = 1.1
const PREVIEW_H = 0.8
const PREVIEW_POS = new THREE.Vector3(-0.88, 1.5, 0.4)
const FLY_SCALE = PHOTO_W / PREVIEW_W

type Phase = 'rest' | 'raise' | 'aim' | 'preview' | 'fly'

type Store = {
  phase: Phase
  t: number
  raise: number
  texIndex: number
  slotCursor: number
  flash: number
  /** Per-slot: -1 empty, otherwise seconds since the photo arrived. */
  age: Float32Array
  /** Per-slot fade-out when a slot is being replaced. */
  fade: Float32Array
  popFrom: THREE.Vector3
  seeded: boolean
  rand: () => number
}

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function buildStore(): Store {
  return {
    // Start mid-aim so the first shutter fires moments after load.
    phase: 'aim',
    t: 0.4,
    raise: 1,
    texIndex: 0,
    slotCursor: 0,
    flash: 0,
    age: new Float32Array(RING_COUNT).fill(-1),
    fade: new Float32Array(RING_COUNT).fill(1),
    popFrom: new THREE.Vector3(),
    seeded: false,
    rand: rng(41_2013),
  }
}

const smooth = (x: number) => x * x * (3 - 2 * x)

/* One continuous trunk — hips to neck — lathed instead of stacked shapes, so
 * the waist pinches and the chest swells the way a torso actually does. */
const TORSO_PROFILE = [
  [0.105, 0.9],
  [0.155, 0.97],
  [0.15, 1.06],
  [0.14, 1.14],
  [0.155, 1.24],
  [0.17, 1.34],
  [0.17, 1.42],
  [0.145, 1.48],
  [0.085, 1.53],
  [0.04, 1.555],
].map(([r, y]) => new THREE.Vector2(r, y))

/* Scratch objects so the frame loop allocates nothing. */
const _a = new THREE.Vector3()
const _b = new THREE.Vector3()
const _c = new THREE.Vector3()
const _up = new THREE.Vector3(0, 1, 0)

/** Lay a unit-height cylinder between two points. */
function lay(mesh: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3) {
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  _c.copy(b).sub(a)
  const len = _c.length()
  mesh.scale.set(1, len, 1)
  mesh.quaternion.setFromUnitVectors(_up, _c.divideScalar(len))
}

/** A static limb segment, oriented once. */
function Seg({
  from,
  to,
  r,
  r2,
  color,
  roughness = 0.85,
}: {
  from: [number, number, number]
  to: [number, number, number]
  r: number
  r2?: number
  color: string
  roughness?: number
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a)
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize(),
      ),
      length: dir.length(),
    }
  }, [from, to])
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[r2 ?? r, r, length, 14]} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  )
}

/** Load the gallery images, centre-crop-fitted to the photo plane. */
function usePhotos(): THREE.Texture[] {
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const planeAspect = PHOTO_W / PHOTO_H
    return PHOTO_FILES.map((name) =>
      loader.load(`/work/${name}.jpg`, (tex) => {
        const img = tex.image as HTMLImageElement
        const ia = img.width / img.height
        if (ia > planeAspect) {
          tex.repeat.set(planeAspect / ia, 1)
          tex.offset.set((1 - planeAspect / ia) / 2, 0)
        } else {
          tex.repeat.set(1, ia / planeAspect)
          tex.offset.set(0, (1 - ia / planeAspect) / 2)
        }
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        tex.needsUpdate = true
      }),
    )
  }, [])
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures])
  return textures
}

export default function Photographer({ pointer, onCapture, still }: Props) {
  const store = useRef<Store | null>(null)
  const photos = usePhotos()

  const driftRef = useRef<THREE.Group>(null)
  const swayRef = useRef<THREE.Group>(null)
  const neckRef = useRef<THREE.Group>(null)
  const camRef = useRef<THREE.Group>(null)
  const armURRef = useRef<THREE.Mesh>(null)
  const armLRRef = useRef<THREE.Mesh>(null)
  const armULRef = useRef<THREE.Mesh>(null)
  const armLLRef = useRef<THREE.Mesh>(null)
  const elbowRRef = useRef<THREE.Mesh>(null)
  const elbowLRef = useRef<THREE.Mesh>(null)
  const strapRRef = useRef<THREE.Mesh>(null)
  const strapLRef = useRef<THREE.Mesh>(null)
  const flashMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const flashLightRef = useRef<THREE.PointLight>(null)
  const glassMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const ledMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const ringLensRef = useRef<THREE.Mesh>(null)
  const formRef = useRef<THREE.Group>(null)
  const wheelRef = useRef<THREE.Group>(null)
  const connectorRef = useRef<THREE.BufferAttribute>(null)
  const previewRef = useRef<THREE.Group>(null)
  const previewPhotoRef = useRef<THREE.MeshBasicMaterial>(null)
  const slotRefs = useRef<Array<THREE.Group | null>>(Array.from({ length: RING_COUNT }, () => null))

  useFrame((state, rawDelta) => {
    const s = (store.current ??= buildStore())
    const cam = camRef.current
    const sway = swayRef.current
    const form = formRef.current
    const preview = previewRef.current
    if (!cam || !sway || !form || !preview) return

    // Clamped so a backgrounded tab cannot teleport the cycle on wake.
    const delta = still ? 0 : Math.min(rawDelta, 0.1)
    const t = state.clock.elapsedTime
    const p = pointer.current ?? { x: 0, y: 0 }

    /* --- seed the ring: shots from earlier in the day --- */
    if (!s.seeded) {
      s.seeded = true
      const n = still ? 6 : 3
      for (let k = 0; k < n; k++) {
        const slot = slotRefs.current[k]
        if (!slot) continue
        const mat = (slot.children[2] as THREE.Mesh).material as THREE.MeshBasicMaterial
        mat.map = photos[k % photos.length]
        mat.needsUpdate = true
        slot.visible = true
        s.age[k] = 10
      }
      s.texIndex = n % photos.length
      s.slotCursor = n
    }

    /* --- phase machine --- */
    if (!still) {
      s.t += delta
      if (s.phase === 'rest' && s.t >= T_REST) {
        s.phase = 'raise'
        s.t = 0
      } else if (s.phase === 'raise' && s.t >= T_RAISE) {
        s.phase = 'aim'
        s.t = 0
      } else if (s.phase === 'aim' && s.t >= T_AIM) {
        // Fire. Flash, HUD tick, and the freeze-frame appears.
        s.phase = 'preview'
        s.t = 0
        s.flash = 1
        onCapture?.()
        const mat = previewPhotoRef.current
        if (mat) {
          mat.map = photos[s.texIndex]
          mat.needsUpdate = true
        }
        preview.visible = true
        // If the target slot is occupied, its old photo starts to step aside.
        const target = s.slotCursor % RING_COUNT
        if (s.age[target] >= 0) s.fade[target] = 1 - 1e-6
        // The preview grows out of the camera body.
        cam.updateWorldMatrix(true, false)
        _a.set(0, 0.05, 0)
        cam.localToWorld(_a)
        form.worldToLocal(s.popFrom.copy(_a))
      } else if (s.phase === 'preview' && s.t >= T_PREVIEW) {
        s.phase = 'fly'
        s.t = 0
      } else if (s.phase === 'fly' && s.t >= T_FLY) {
        // Arrive: the photo takes its place in the rectangle.
        const idx = s.slotCursor % RING_COUNT
        const slot = slotRefs.current[idx]
        if (slot) {
          const mat = (slot.children[2] as THREE.Mesh).material as THREE.MeshBasicMaterial
          mat.map = photos[s.texIndex]
          mat.needsUpdate = true
          slot.visible = true
          s.age[idx] = 0
          s.fade[idx] = 1
        }
        preview.visible = false
        s.slotCursor++
        s.texIndex = (s.texIndex + 1) % photos.length
        s.phase = 'rest'
        s.t = 0
      }
    }

    /* --- the raise blend --- */
    let target = 1
    if (s.phase === 'rest') target = 0
    else if (s.phase === 'raise') target = smooth(Math.min(s.t / T_RAISE, 1))
    else if (s.phase === 'preview' && s.t > 0.4) target = 0
    else if (s.phase === 'fly') target = 0
    if (still) target = 1
    s.raise += (target - s.raise) * (still ? 1 : Math.min(1, delta * 9))
    const r = s.raise

    /* --- body: breath, weight shift, intent --- */
    const drift = driftRef.current
    if (drift && !still) {
      drift.position.y = Math.sin(t * 1.05) * 0.012
      drift.position.x = Math.sin(t * 0.27) * 0.02
      drift.rotation.z = Math.sin(t * 0.33) * 0.014
    }
    if (!still) {
      const targetY = Math.sin(t * 0.18) * 0.08 + p.x * 0.16
      const targetX = Math.sin(t * 0.23 + 1.1) * 0.02 - p.y * 0.05
      sway.rotation.y += (targetY - sway.rotation.y) * 0.04
      sway.rotation.x += (targetX - sway.rotation.x) * 0.04
    }

    /* --- camera between chest and eye, hands riding it --- */
    cam.position.lerpVectors(CAM_POS.rest, CAM_POS.up, r)
    cam.rotation.x = CAM_TILT.rest + (CAM_TILT.up - CAM_TILT.rest) * r
    // Handheld tremor — only meaningful while he is actually aiming.
    if (!still && r > 0.7) {
      cam.position.y += (Math.sin(t * 5.3) * 0.003 + Math.sin(t * 2.1 + 1.7) * 0.004) * r
      cam.rotation.z = Math.sin(t * 3.9) * 0.006 * r
    }
    cam.updateWorldMatrix(true, false)

    /* --- arms: shoulder → elbow → hand, hands welded to the camera --- */
    const armUR = armURRef.current
    const armLR = armLRRef.current
    const armUL = armULRef.current
    const armLL = armLLRef.current
    const elR = elbowRRef.current
    const elL = elbowLRef.current
    if (armUR && armLR && armUL && armLL && elR && elL) {
      // Right
      _a.lerpVectors(ELBOW_R.rest, ELBOW_R.up, r)
      _b.copy(HAND_R)
      cam.localToWorld(_b)
      sway.worldToLocal(_b)
      lay(armUR, SHOULDER_R, _a)
      lay(armLR, _a, _b)
      elR.position.copy(_a)
      // Left
      _a.lerpVectors(ELBOW_L.rest, ELBOW_L.up, r)
      _b.copy(HAND_L)
      cam.localToWorld(_b)
      sway.worldToLocal(_b)
      lay(armUL, SHOULDER_L, _a)
      lay(armLL, _a, _b)
      elL.position.copy(_a)
    }

    /* --- strap from the neck down to the camera lugs --- */
    const strapR = strapRRef.current
    const strapL = strapLRef.current
    if (strapR && strapL) {
      _b.copy(STRAP_CAM_R)
      cam.localToWorld(_b)
      sway.worldToLocal(_b)
      lay(strapR, STRAP_NECK_R, _b)
      _b.copy(STRAP_CAM_L)
      cam.localToWorld(_b)
      sway.worldToLocal(_b)
      lay(strapL, STRAP_NECK_L, _b)
    }

    /* --- head: at the eyepiece when shooting, on the preview after --- */
    const neck = neckRef.current
    if (neck) {
      neck.rotation.x = NECK_TILT.rest + (NECK_TILT.up - NECK_TILT.rest) * r
      const reviewing = s.phase === 'preview' || s.phase === 'fly'
      const yaw = reviewing ? 0.42 : 0.2 * (1 - r)
      neck.rotation.y += (yaw - neck.rotation.y) * 0.09
    }

    /* --- flash burst --- */
    if (s.flash > 0) s.flash = Math.max(0, s.flash - delta * 2.6)
    const f = s.flash
    const flashMat = flashMatRef.current
    if (flashMat) flashMat.emissiveIntensity = f * f * 9
    const flashLight = flashLightRef.current
    if (flashLight) flashLight.intensity = f * f * 6
    const glass = glassMatRef.current
    if (glass) glass.emissiveIntensity = 0.25 + f * 3
    const led = ledMatRef.current
    if (led) led.emissiveIntensity = still ? 1 : Math.sin(t * 3.4) > 0 ? 1.6 : 0.2
    // He rides focus while aiming.
    if (ringLensRef.current && !still) ringLensRef.current.rotation.z = Math.sin(t * 0.7) * 0.5

    /* --- the freeze-frame --- */
    if (s.phase === 'preview') {
      const pop = smooth(Math.min(s.t / T_POP, 1))
      preview.position.lerpVectors(s.popFrom, PREVIEW_POS, pop)
      // Ken Burns: once landed, the frame keeps creeping larger.
      const hold = Math.max(0, s.t - T_POP) / (T_PREVIEW - T_POP)
      preview.scale.setScalar(pop * (1 + hold * 0.06))
    } else if (s.phase === 'fly') {
      // The target slot is riding the orbit, so chase its live position.
      const q = smooth(Math.min(s.t / T_FLY, 1))
      const slot = slotRefs.current[s.slotCursor % RING_COUNT]
      if (slot) {
        slot.getWorldPosition(_a)
        form.worldToLocal(_a)
        preview.position.lerpVectors(PREVIEW_POS, _a, q)
      }
      preview.scale.setScalar(1.06 + (FLY_SCALE - 1.06) * q)
    }

    /* --- the wheel turns; photos stay upright as they ride it --- */
    const wheel = wheelRef.current
    if (wheel && !still) wheel.rotation.z += delta * WHEEL_SPEED
    const w = wheel ? wheel.rotation.z : 0
    const newest = s.slotCursor > 0 ? (s.slotCursor - 1) % RING_COUNT : -1
    for (let i = 0; i < RING_COUNT; i++) {
      const slot = slotRefs.current[i]
      if (!slot || !slot.visible) continue
      if (s.age[i] >= 0 && s.age[i] < 10) s.age[i] = Math.min(10, s.age[i] + delta)
      // The old photo steps aside quickly — shrinking as it goes, so it reads
      // as leaving rather than smudging out.
      if (s.fade[i] < 1) s.fade[i] = Math.max(0, s.fade[i] - delta / 0.8)
      const pop = 1 + 0.18 * Math.max(0, 1 - s.age[i] / 0.45)
      const fadeS = s.fade[i] < 1 ? smooth(s.fade[i]) : 1
      // Counter-rotate so the picture stays level, with a hand-placed tilt.
      slot.rotation.z = -w + (i % 2 === 0 ? 0.03 : -0.025) + Math.sin(t * 0.6 + i) * 0.01
      slot.scale.setScalar(pop * (0.82 + 0.18 * fadeS))
      const shadowMat = (slot.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial
      const frameMat = (slot.children[1] as THREE.Mesh).material as THREE.MeshBasicMaterial
      const photoMat = (slot.children[2] as THREE.Mesh).material as THREE.MeshBasicMaterial
      shadowMat.opacity = 0.16 * fadeS
      frameMat.opacity = fadeS
      photoMat.opacity = fadeS
      if (s.fade[i] === 0) {
        slot.visible = false
        s.age[i] = -1
        s.fade[i] = 1
      }
    }

    /* --- connector: dial centre to the newest shot, EPM-wheel style --- */
    const connector = connectorRef.current
    if (connector) {
      const slot = newest >= 0 ? slotRefs.current[newest] : null
      if (slot && slot.visible && s.phase !== 'fly') {
        slot.getWorldPosition(_a)
        form.worldToLocal(_a)
        connector.setXYZ(0, 0, DIAL_CY, -0.02)
        connector.setXYZ(1, _a.x, _a.y, _a.z - 0.02)
      } else {
        connector.setXYZ(0, 0, DIAL_CY, -0.02)
        connector.setXYZ(1, 0, DIAL_CY, -0.02)
      }
      connector.needsUpdate = true
    }

    /* --- the whole dial answers the pointer --- */
    if (!still) {
      form.position.x += (-p.x * 0.06 - form.position.x) * 0.05
      form.position.y += (p.y * 0.045 - form.position.y) * 0.05
    }
  })

  const cloth = { color: CLOTH, roughness: 0.85 }
  const skin = { color: SKIN, roughness: 0.6 }
  const camBody = { color: CAM, roughness: 0.4, metalness: 0.55 }

  return (
    <group position={[0.25, -1.18, 0]} rotation={[0, -0.35, 0]} scale={1.3}>
      <group ref={driftRef}>
        <group ref={swayRef}>
          {/* ── legs: thigh, knee, tapered calf, real shoes ── */}
          {/* left leg forward, right leg carrying the weight — a stance, not
              two posts */}
          <Seg from={[-0.12, 0.95, 0.01]} to={[-0.13, 0.5, 0.09]} r={0.064} r2={0.082} color={TROUSER} />
          <Seg from={[-0.13, 0.5, 0.09]} to={[-0.15, 0.07, 0.07]} r={0.036} r2={0.062} color={TROUSER} />
          <Seg from={[0.12, 0.95, 0.01]} to={[0.14, 0.52, -0.03]} r={0.064} r2={0.082} color={TROUSER} />
          <Seg from={[0.14, 0.52, -0.03]} to={[0.15, 0.07, -0.07]} r={0.036} r2={0.062} color={TROUSER} />
          <mesh position={[-0.13, 0.5, 0.09]}>
            <sphereGeometry args={[0.06, 12, 10]} />
            <meshStandardMaterial color={TROUSER} roughness={0.9} />
          </mesh>
          <mesh position={[0.14, 0.52, -0.03]}>
            <sphereGeometry args={[0.06, 12, 10]} />
            <meshStandardMaterial color={TROUSER} roughness={0.9} />
          </mesh>
          {/* trouser cuffs breaking over the shoes */}
          <mesh position={[-0.15, 0.1, 0.07]}>
            <cylinderGeometry args={[0.045, 0.052, 0.09, 12]} />
            <meshStandardMaterial color={TROUSER} roughness={0.9} />
          </mesh>
          <mesh position={[0.15, 0.1, -0.07]}>
            <cylinderGeometry args={[0.045, 0.052, 0.09, 12]} />
            <meshStandardMaterial color={TROUSER} roughness={0.9} />
          </mesh>
          <Shoe x={-0.15} z={0.09} yaw={0.12} />
          <Shoe x={0.155} z={-0.05} yaw={-0.15} />

          {/* ── trunk: one lathed form, hips to neck ── */}
          <mesh scale={[1.28, 1, 0.82]}>
            <latheGeometry args={[TORSO_PROFILE, 24]} />
            <meshStandardMaterial {...cloth} />
          </mesh>
          {/* trapezius slope from neck out to the shoulders */}
          <mesh position={[0, 1.47, 0.02]} scale={[1.9, 0.55, 0.85]}>
            <sphereGeometry args={[0.1, 20, 14]} />
            <meshStandardMaterial {...cloth} />
          </mesh>
          {/* deltoids */}
          <mesh position={SHOULDER_R}>
            <sphereGeometry args={[0.071, 16, 12]} />
            <meshStandardMaterial {...cloth} />
          </mesh>
          <mesh position={SHOULDER_L}>
            <sphereGeometry args={[0.071, 16, 12]} />
            <meshStandardMaterial {...cloth} />
          </mesh>
          {/* shirt collar at the throat */}
          <mesh position={[0, 1.52, 0.035]} rotation={[1.35, 0, 0]}>
            <torusGeometry args={[0.052, 0.013, 8, 20, Math.PI * 1.5]} />
            <meshStandardMaterial color="#3a4a7e" roughness={0.8} />
          </mesh>

          {/* ── neck and head ── */}
          <Seg from={[0, 1.5, 0.03]} to={[0, 1.6, 0.04]} r={0.044} color={SKIN} roughness={0.55} />
          <group ref={neckRef} position={[0, 1.56, 0.03]}>
            {/* skull */}
            <mesh position={[0, 0.11, 0.005]}>
              <sphereGeometry args={[0.112, 24, 18]} />
              <meshStandardMaterial {...skin} />
            </mesh>
            {/* face — an egg that narrows to the chin, set forward of the skull */}
            <mesh position={[0, 0.055, 0.045]} scale={[0.82, 1.05, 0.85]}>
              <sphereGeometry args={[0.093, 20, 16]} />
              <meshStandardMaterial {...skin} />
            </mesh>
            {/* nose — the one feature that makes the profile read as a person */}
            <mesh position={[0, 0.075, 0.135]} rotation={[1.15, 0, 0]}>
              <capsuleGeometry args={[0.0135, 0.028, 4, 10]} />
              <meshStandardMaterial {...skin} />
            </mesh>
            {/* spectacles — the honest way to give a geometric face eyes:
                two rings, a bridge, and temple arms back to the ears */}
            <mesh position={[0.042, 0.082, 0.124]}>
              <torusGeometry args={[0.031, 0.0042, 8, 20]} />
              <meshStandardMaterial color="#141821" roughness={0.35} metalness={0.4} />
            </mesh>
            <mesh position={[-0.042, 0.082, 0.124]}>
              <torusGeometry args={[0.031, 0.0042, 8, 20]} />
              <meshStandardMaterial color="#141821" roughness={0.35} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0.088, 0.126]}>
              <boxGeometry args={[0.024, 0.006, 0.006]} />
              <meshStandardMaterial color="#141821" roughness={0.35} metalness={0.4} />
            </mesh>
            <Seg from={[0.072, 0.082, 0.114]} to={[0.105, 0.08, 0.028]} r={0.0035} color="#141821" roughness={0.35} />
            <Seg from={[-0.072, 0.082, 0.114]} to={[-0.105, 0.08, 0.028]} r={0.0035} color="#141821" roughness={0.35} />
            {/* eyebrows just above the frames */}
            <mesh position={[0.042, 0.118, 0.118]} rotation={[0, 0, -0.12]}>
              <capsuleGeometry args={[0.0075, 0.032, 4, 8]} />
              <meshStandardMaterial color={HAIR} roughness={0.85} />
            </mesh>
            <mesh position={[-0.042, 0.118, 0.118]} rotation={[0, 0, 0.12]}>
              <capsuleGeometry args={[0.0075, 0.032, 4, 8]} />
              <meshStandardMaterial color={HAIR} roughness={0.85} />
            </mesh>
            {/* moustache under the nose, closing the beard frame */}
            <mesh position={[0, 0.032, 0.117]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.011, 0.034, 4, 8]} />
              <meshStandardMaterial color={HAIR} roughness={0.85} />
            </mesh>
            {/* trimmed beard — chin and jawline, meeting the sideburns */}
            <mesh position={[0, -0.008, 0.055]} scale={[0.84, 0.5, 0.78]}>
              <sphereGeometry args={[0.095, 20, 14]} />
              <meshStandardMaterial color={HAIR} roughness={0.85} />
            </mesh>
            {/* sideburns joining hair to beard */}
            <mesh position={[0.096, 0.06, 0.045]} scale={[0.35, 1.1, 0.5]}>
              <sphereGeometry args={[0.03, 10, 8]} />
              <meshStandardMaterial color={HAIR} roughness={0.85} />
            </mesh>
            <mesh position={[-0.096, 0.06, 0.045]} scale={[0.35, 1.1, 0.5]}>
              <sphereGeometry args={[0.03, 10, 8]} />
              <meshStandardMaterial color={HAIR} roughness={0.85} />
            </mesh>
            {/* hair — a cap on top, hairline where a hairline is */}
            <mesh position={[0, 0.128, -0.008]} rotation={[-0.26, 0, 0]}>
              <sphereGeometry args={[0.115, 24, 14, 0, Math.PI * 2, 0, 1.42]} />
              <meshStandardMaterial color={HAIR} roughness={0.8} />
            </mesh>
            {/* ears */}
            <mesh position={[0.107, 0.075, 0.02]} scale={[0.45, 1, 0.75]}>
              <sphereGeometry args={[0.032, 10, 8]} />
              <meshStandardMaterial {...skin} />
            </mesh>
            <mesh position={[-0.107, 0.075, 0.02]} scale={[0.45, 1, 0.75]}>
              <sphereGeometry args={[0.032, 10, 8]} />
              <meshStandardMaterial {...skin} />
            </mesh>
          </group>

          {/* ── arms, oriented every frame ── */}
          <mesh ref={armURRef}>
            <cylinderGeometry args={[0.05, 0.058, 1, 12]} />
            <meshStandardMaterial {...cloth} />
          </mesh>
          <mesh ref={armLRRef}>
            <cylinderGeometry args={[0.042, 0.05, 1, 12]} />
            <meshStandardMaterial {...cloth} />
          </mesh>
          <mesh ref={armULRef}>
            <cylinderGeometry args={[0.05, 0.058, 1, 12]} />
            <meshStandardMaterial {...cloth} />
          </mesh>
          <mesh ref={armLLRef}>
            <cylinderGeometry args={[0.042, 0.05, 1, 12]} />
            <meshStandardMaterial {...cloth} />
          </mesh>
          <mesh ref={elbowRRef}>
            <sphereGeometry args={[0.055, 12, 10]} />
            <meshStandardMaterial {...cloth} />
          </mesh>
          <mesh ref={elbowLRef}>
            <sphereGeometry args={[0.055, 12, 10]} />
            <meshStandardMaterial {...cloth} />
          </mesh>

          {/* ── the strap ── */}
          <mesh ref={strapRRef}>
            <cylinderGeometry args={[0.013, 0.013, 1, 8]} />
            <meshStandardMaterial color={STRAP} roughness={0.8} />
          </mesh>
          <mesh ref={strapLRef}>
            <cylinderGeometry args={[0.013, 0.013, 1, 8]} />
            <meshStandardMaterial color={STRAP} roughness={0.8} />
          </mesh>

          {/* ── the camera, hands welded to it ── */}
          <group ref={camRef} position={CAM_POS.up}>
            {/* body */}
            <mesh>
              <boxGeometry args={[0.27, 0.16, 0.11]} />
              <meshStandardMaterial {...camBody} />
            </mesh>
            {/* grip */}
            <mesh position={[0.15, -0.005, 0.015]}>
              <boxGeometry args={[0.06, 0.15, 0.12]} />
              <meshStandardMaterial color={CAM_DARK} roughness={0.6} />
            </mesh>
            {/* pentaprism */}
            <mesh position={[0, 0.1, -0.005]}>
              <boxGeometry args={[0.1, 0.06, 0.09]} />
              <meshStandardMaterial {...camBody} />
            </mesh>
            {/* eyecup */}
            <mesh position={[0, 0.075, -0.058]}>
              <boxGeometry args={[0.07, 0.045, 0.02]} />
              <meshStandardMaterial color={CAM_DARK} roughness={0.7} />
            </mesh>
            {/* lens barrel */}
            <mesh position={[-0.02, -0.005, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.072, 0.075, 0.17, 24]} />
              <meshStandardMaterial color={CAM_DARK} roughness={0.5} metalness={0.4} />
            </mesh>
            {/* focus ring with the amber index line */}
            <mesh ref={ringLensRef} position={[-0.02, -0.005, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.076, 0.076, 0.035, 24]} />
              <meshStandardMaterial color="#22242c" roughness={0.85} />
            </mesh>
            <mesh position={[-0.02, -0.005, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.074, 0.004, 8, 32]} />
              <meshStandardMaterial color={AMBER} roughness={0.4} metalness={0.3} />
            </mesh>
            {/* hood lip + front glass */}
            <mesh position={[-0.02, -0.005, 0.228]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.076, 0.025, 24]} />
              <meshStandardMaterial color={CAM_DARK} roughness={0.6} />
            </mesh>
            <mesh position={[-0.02, -0.005, 0.242]}>
              <circleGeometry args={[0.062, 24]} />
              <meshStandardMaterial
                ref={glassMatRef}
                color="#101c3d"
                emissive="#3462cc"
                emissiveIntensity={0.25}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
            {/* rec lamp on the back corner */}
            <mesh position={[0.11, 0.05, -0.057]}>
              <circleGeometry args={[0.008, 10]} />
              <meshStandardMaterial
                ref={ledMatRef}
                color="#ff6b5e"
                emissive="#ff6b5e"
                emissiveIntensity={1}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* speedlight */}
            <mesh position={[0, 0.15, -0.015]}>
              <boxGeometry args={[0.05, 0.05, 0.045]} />
              <meshStandardMaterial color={CAM_DARK} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.2, 0.015]} rotation={[-0.12, 0, 0]}>
              <boxGeometry args={[0.09, 0.055, 0.075]} />
              <meshStandardMaterial {...camBody} />
            </mesh>
            <mesh position={[0, 0.205, 0.055]} rotation={[-0.12, 0, 0]}>
              <planeGeometry args={[0.075, 0.045]} />
              <meshStandardMaterial
                ref={flashMatRef}
                color="#fdf6e4"
                emissive="#fff3d0"
                emissiveIntensity={0}
                roughness={0.3}
                toneMapped={false}
              />
            </mesh>
            <pointLight
              ref={flashLightRef}
              position={[0, 0.21, 0.14]}
              color="#ffeeC8"
              intensity={0}
              distance={3}
              decay={2}
            />
            {/* ── right hand wrapping the grip, fingers curled around it ── */}
            <group position={HAND_R}>
              <mesh scale={[0.75, 1.15, 0.95]}>
                <sphereGeometry args={[0.048, 14, 12]} />
                <meshStandardMaterial {...skin} />
              </mesh>
              {[0, 1, 2].map((i) => (
                <mesh
                  key={i}
                  position={[0.028, 0.028 - i * 0.032, 0.052]}
                  rotation={[1.35, 0, -0.15]}
                >
                  <capsuleGeometry args={[0.0115, 0.042, 4, 8]} />
                  <meshStandardMaterial {...skin} />
                </mesh>
              ))}
              {/* thumb hooked over the back */}
              <mesh position={[0.015, 0.015, -0.05]} rotation={[-0.9, 0, 0.3]}>
                <capsuleGeometry args={[0.0125, 0.036, 4, 8]} />
                <meshStandardMaterial {...skin} />
              </mesh>
            </group>
            {/* index finger up on the shutter button */}
            <mesh position={[0.13, 0.09, 0.03]} rotation={[0.4, 0, -0.2]}>
              <capsuleGeometry args={[0.0125, 0.04, 4, 8]} />
              <meshStandardMaterial {...skin} />
            </mesh>

            {/* ── left hand cradling the lens from below ── */}
            <group position={HAND_L}>
              <mesh scale={[1.05, 0.7, 1.1]}>
                <sphereGeometry args={[0.048, 14, 12]} />
                <meshStandardMaterial {...skin} />
              </mesh>
              {/* fingertips curling up the far side of the barrel */}
              {[0, 1, 2].map((i) => (
                <mesh
                  key={i}
                  position={[-0.045, 0.038, -0.02 + i * 0.035]}
                  rotation={[0, 0, 0.7]}
                >
                  <capsuleGeometry args={[0.011, 0.04, 4, 8]} />
                  <meshStandardMaterial {...skin} />
                </mesh>
              ))}
              {/* thumb up the near side */}
              <mesh position={[0.048, 0.035, 0.02]} rotation={[0, 0, -0.65]}>
                <capsuleGeometry args={[0.0125, 0.038, 4, 8]} />
                <meshStandardMaterial {...skin} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* ── the formation: square-on to the page camera, behind the figure ──
          The root turns the figure away by −0.35 and the page camera sits 45°
          off axis; +1.1 here cancels both, so the rectangle faces the viewer
          dead on. The position offset walks it back along the view axis, which
          keeps it centred on him on screen. */}
      <group position={[-0.49, 0, -0.25]} rotation={[0, 1.1, 0]}>
        <group ref={formRef}>
          {/* the freeze-frame */}
          <group ref={previewRef} visible={false}>
            {/* drop shadow, so the freeze-frame floats off the paper */}
            <mesh position={[0.03, -0.04, -0.012]}>
              <planeGeometry args={[PREVIEW_W + 0.07, PREVIEW_H + 0.07]} />
              <meshBasicMaterial color={SHADOW} transparent opacity={0.18} depthWrite={false} />
            </mesh>
            {/* bone border */}
            <mesh position={[0, 0, -0.006]}>
              <planeGeometry args={[PREVIEW_W + 0.07, PREVIEW_H + 0.07]} />
              <meshBasicMaterial color={PAPER} />
            </mesh>
            <mesh>
              <planeGeometry args={[PREVIEW_W, PREVIEW_H]} />
              <meshBasicMaterial ref={previewPhotoRef} toneMapped={false} />
            </mesh>
            {/* viewfinder brackets */}
            {(
              [
                [-1, 1],
                [1, 1],
                [-1, -1],
                [1, -1],
              ] as const
            ).map(([cx, cy]) => (
              <group
                key={`${cx}${cy}`}
                position={[cx * (PREVIEW_W / 2 + 0.11), cy * (PREVIEW_H / 2 + 0.1), 0.004]}
              >
                <mesh position={[cx * -0.05, 0, 0]}>
                  <planeGeometry args={[0.1, 0.014]} />
                  <meshBasicMaterial color={AMBER} transparent opacity={0.85} />
                </mesh>
                <mesh position={[0, cy * -0.05, 0]}>
                  <planeGeometry args={[0.014, 0.1]} />
                  <meshBasicMaterial color={AMBER} transparent opacity={0.85} />
                </mesh>
              </group>
            ))}
          </group>

          {/* ── the dial: hairline circle, instrument ticks, connector ── */}
          <DialGuides />
          <line>
            <bufferGeometry>
              <bufferAttribute
                ref={connectorRef}
                attach="attributes-position"
                args={[new Float32Array(6), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color={AMBER} transparent opacity={0.4} />
          </line>

          {/* ── the wheel the photos ride; each slot counter-rotates ──
              children per slot: [glow, frame, photo] */}
          <group ref={wheelRef} position={[0, DIAL_CY, 0]}>
            {DIAL_SLOTS.map((phi, i) => (
              <group
                key={i}
                ref={(el) => {
                  slotRefs.current[i] = el
                }}
                visible={false}
                position={[Math.cos(phi) * DIAL_R, Math.sin(phi) * DIAL_R, 0]}
              >
                {/* drop shadow, so the print lifts off the light paper */}
                <mesh position={[0.02, -0.025, -0.012]}>
                  <planeGeometry args={[PHOTO_W + 0.045, PHOTO_H + 0.045]} />
                  <meshBasicMaterial color={SHADOW} transparent opacity={0.16} depthWrite={false} />
                </mesh>
                <mesh position={[0, 0, -0.006]}>
                  <planeGeometry args={[PHOTO_W + 0.045, PHOTO_H + 0.045]} />
                  <meshBasicMaterial color={PAPER} transparent />
                </mesh>
                <mesh>
                  <planeGeometry args={[PHOTO_W, PHOTO_H]} />
                  <meshBasicMaterial transparent toneMapped={false} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>

      {/* ── grounding: a soft fake shadow under him ── */}
      <Blob x={0} z={0.05} r={0.62} opacity={0.35} />
    </group>
  )
}

/** A shoe with a toe box, heel and sole — not a brick. */
function Shoe({ x, z, yaw }: { x: number; z: number; yaw: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, yaw, 0]}>
      {/* sole */}
      <mesh position={[0, 0.012, 0.02]}>
        <boxGeometry args={[0.085, 0.024, 0.26]} />
        <meshStandardMaterial color="#060810" roughness={0.6} />
      </mesh>
      {/* heel + upper */}
      <mesh position={[0, 0.05, -0.045]} scale={[1, 0.85, 1.5]}>
        <sphereGeometry args={[0.045, 14, 10]} />
        <meshStandardMaterial color={SHOE} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* toe box, tapering forward */}
      <mesh position={[0, 0.042, 0.09]} scale={[0.9, 0.62, 1.9]}>
        <sphereGeometry args={[0.042, 14, 10]} />
        <meshStandardMaterial color={SHOE} roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  )
}

/** The dial furniture: a hairline circle the photos thread onto, and the
 *  instrument ticks at the rim — the EPM wheel's language in three.js. */
function DialGuides() {
  const { circle, ticks } = useMemo(() => {
    const seg = 96
    const c = new Float32Array(seg * 3)
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2
      c[i * 3] = Math.cos(a) * DIAL_R
      c[i * 3 + 1] = DIAL_CY + Math.sin(a) * DIAL_R
    }
    const circleGeo = new THREE.BufferGeometry()
    circleGeo.setAttribute('position', new THREE.BufferAttribute(c, 3))

    const n = 48
    const tickR = DIAL_R + 0.3
    const pts = new Float32Array(n * 6)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const len = i % 6 === 0 ? 0.09 : 0.045
      pts[i * 6] = Math.cos(a) * tickR
      pts[i * 6 + 1] = DIAL_CY + Math.sin(a) * tickR
      pts[i * 6 + 3] = Math.cos(a) * (tickR + len)
      pts[i * 6 + 4] = DIAL_CY + Math.sin(a) * (tickR + len)
    }
    const tickGeo = new THREE.BufferGeometry()
    tickGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    return { circle: circleGeo, ticks: tickGeo }
  }, [])
  useEffect(
    () => () => {
      circle.dispose()
      ticks.dispose()
    },
    [circle, ticks],
  )
  return (
    <>
      <lineLoop geometry={circle}>
        <lineBasicMaterial color={AMBER} transparent opacity={0.4} />
      </lineLoop>
      <lineSegments geometry={ticks}>
        <lineBasicMaterial color={AMBER} transparent opacity={0.55} />
      </lineSegments>
    </>
  )
}

function radialTex(rgb: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62)
  g.addColorStop(0, `rgba(${rgb},0.9)`)
  g.addColorStop(1, `rgba(${rgb},0)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

/** A soft dark ellipse on the floor — contact shadow without a light pass. */
function Blob({ x, z, r, opacity }: { x: number; z: number; r: number; opacity: number }) {
  const tex = useMemo(() => radialTex('2,5,16'), [])
  useEffect(() => () => tex.dispose(), [tex])
  return (
    <mesh position={[x, 0.003, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]}>
      <planeGeometry args={[r * 2, r * 2]} />
      <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  )
}

