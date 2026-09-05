/**
 * Facts about the hero take, in one place.
 *
 * Two sections now run off this clip — the hero, where it plays itself, and
 * the shoot section, where the visitor scrubs it with the scroll wheel. The
 * beats below are measured off the file, so if they lived next to one of those
 * two the other would drift the first time the clip was replaced.
 *
 * ---------- measured off the cut: 1280×720, 5.50s ----------
 *
 * The delivered render was 8s and did not loop: it ended with the camera up at
 * his eye and began with it down at his chest, so every pass teleported. The
 * cut takes the stretch between the two closest-matching frames — both
 * camera-at-eye — which is 2.2s to 7.7s of the original.
 *
 * That still does not match, and it cannot: measured against the room, the
 * camera barely moves across the take (scale 1.000, about two pixels), so the
 * mismatch is HIM. He never comes back to the pose or the spot he started in,
 * and the closest any two frames in the take get is a mean difference of 14.7
 * where one frame to the next is about 1.0. No in-point and out-point exist
 * that cut together cleanly.
 *
 * So the seam is not blended — a dissolve across a 14.7 gap is a double
 * exposure, two of him on screen at once. It is a hard cut, masked by a fast
 * defocus (SEAM_BLUR): blur destroys the detail that makes a jump legible
 * without ever showing two images at once, and on a photographer's site it
 * reads as a focus pull rather than as a repair.
 *
 *   0.0–1.8  aiming, riding focus, breath held
 *   2.0      SHUTTER
 *   2.2–5.2  he lowers the camera and reads its back, then smiles
 *   5.2–5.5  it starts to come up again
 *
 * Re-measure every number here if the clip is replaced.
 */
export const DURATION = 5.5
export const FIRE = 2.0
export const POP_END = 2.45
export const HOLD_END = 4.4
export const FLY_END = 5.0

/** Half-width of the defocus at the wrap, in seconds, and how far out of focus
 *  it goes. Long enough to cover a frame or two of decoder jitter, short
 *  enough to read as a blink rather than as a transition. */
export const SEAM_WINDOW = 0.16
export const SEAM_BLUR = 15

/** Where the camera body sits in the frame at the shutter, as a fraction of
 *  the picture — the hero's freeze-frame grows out of exactly this point. */
export const CAMERA = { x: 0.44, y: 0.34 }

/**
 * One wide feather, one density — and the reason it is three nested layers.
 *
 * The feather wants to be the INTERSECTION of a radial and two linear ramps.
 * `mask-composite: intersect` is the way to say that, and it parses, computes
 * and does nothing in Chrome: the layers still composite as `add`, which is a
 * union, so the ramps cancel and the picture comes back as a hard rectangle.
 * Nesting one mask per element multiplies them, which is the same result by a
 * route the browser actually honours.
 *
 * They have to sit on a box the size of what is ON SCREEN, not on the video:
 * the video is the 16:9 rectangle that COVERS its box, so it is wider than the
 * visible area and its side feathers would happen off-stage where nobody sees
 * them.
 */
const RAMP_X = 'linear-gradient(to right, transparent 0%, #000 19%, #000 83%, transparent 100%)'
const RAMP_Y = 'linear-gradient(to bottom, transparent 0%, #000 14%, #000 82%, transparent 100%)'
const RAMP_R = 'radial-gradient(74% 80% at 52% 47%, #000 34%, transparent 100%)'

export const FEATHER_X = { maskImage: RAMP_X, WebkitMaskImage: RAMP_X } as const
export const FEATHER_Y = { maskImage: RAMP_Y, WebkitMaskImage: RAMP_Y } as const
export const FEATHER_R = { maskImage: RAMP_R, WebkitMaskImage: RAMP_R } as const
