# Cameraman portfolio — wedding filmmaker site

Single-page portfolio for a wedding filmmaker / cinematographer. Dark cinema
palette, a Three.js camera rig in the hero, and every enquiry routed to WhatsApp.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build → dist/
npm run lint
```

Stack: Vite + React 19 + TypeScript, Tailwind v4, GSAP + ScrollTrigger, Lenis,
react-three-fiber (no drei), zod.

Type is the Livin Studio system: **Cormorant Garamond** light for display,
**Manrope** for everything else. Section titles run
`clamp(2.1rem, 4.6vw, 3.6rem)`, the hero `clamp(2.7rem, 7.4vw, 4.9rem)`, body
copy sits at 0.95–1rem on a 1.7 line height. Technical camera labels — slate
tags, gear readouts, the viewfinder HUD — use the `.tech` / `.tech-sm` classes
in `index.css` (small Manrope, wide tracking, caps) instead of a mono family.
Numbers stay in Manrope: Cormorant's old-style figures drop below the cap
height and "312" reads as "3ı2".

## What's where

| Path | What it holds |
| --- | --- |
| `src/data/site.ts` | **All copy, prices, links, gallery and film lists.** Start here. |
| `src/three/CameraRig.tsx` | The camera drawing — body, reels, lens stack, shutter |
| `src/three/Operator.tsx` | The person: head, torso, arms posed onto the rig |
| `src/three/HandheldRig.tsx` | Operator + camera as one body, and the handheld motion |
| `src/three/draw.tsx` | Block / Ring / Rails / Limb — the drawing kit |
| `src/three/layout.ts` | Palette, geometry helpers, where the camera meets the shoulder |
| `src/three/RigScene.tsx` | Canvas, fog, dust, camera drift |
| `src/three/Dslr.tsx` | The solid camera in the shutter section — zoom, fire, recoil |
| `src/three/ShootScene.tsx` | Lit stage for the solid camera |
| `src/components/shoot/` | The shutter section: print stack, one print card |
| `src/components/hero/` | Hero layout, viewfinder HUD overlay |
| `src/components/edit/` | The edit-bay section: monitor, timeline, waveforms |
| `src/lib/motion.ts` | Smooth scroll, reveal, count-up, parallax, pointer |
| `src/lib/enquiry.ts` | Form schema (zod) and the WhatsApp hand-off |
| `src/index.css` | Design tokens (`@theme`), grain, vignette, keyframes |

## Before it goes live

Everything below is a placeholder. Search `TODO:` in `src/data/site.ts`.

1. **Identity** — `SITE.name`, `role`, `city`, `phone`, `email`, `instagram`,
   `youtube`. The phone number drives both the WhatsApp links and the mobile
   call bar; it must be in international form (`+91…`).
2. **Photographs** — drop files in `public/work/` and set `src` on each entry in
   `SHOTS` (e.g. `src: '/work/01-haldi.jpg'`). Until then each tile renders a
   graded placeholder labelled `NO MEDIA`, so nothing ships silently empty.
   Export at ~2000px on the long edge, WebP or AVIF, and keep the `tag` values
   inside `GALLERY_FILTERS`.
3. **Films** — replace each `youtubeId` in `FILMS`. Players are click-to-load,
   so no YouTube code runs until a visitor presses play.
4. **Meta** — title, description and OG tags in `index.html`.
5. **Prices** in `SERVICES`, and the testimonials — get written permission
   before using a real couple's name.

## Notes on the hero

The camera is **drawn, not rendered** — the same language as the Livin Studio
room build: edges in an amber hairline, faces as barely-there translucent
panels, every material `MeshBasicMaterial` or line geometry. There are no lights
in the scene at all, which is the point: it reads as a technical drawing rather
than a product shot, and it costs a handful of draw calls.

It is not a camera on a tripod — it is a camera **on someone's shoulder**. The
operator is drawn in bone hairline (kit is warm, the person is not), his arms
posed by joint position rather than by angle so the right hand lands exactly on
the focus ring and the eyepiece meets his eye. `SHOULDER_MOUNT` in `layout.ts`
is the one number both files agree on.

The handheld feel is four motions stacked: **breath** (a slow rise through the
chest), **weight** (shifting foot to foot), **micro-shake** (incoherent sines —
the tremor nobody holds out) and **intent** (a slow pan, nudged by the visitor's
pointer). Any one alone reads as a mechanical loop; together they read as a
person trying to hold a camera still. It never scrubs to scroll.

The shutter fires every 5.5s, which pinches the iris, flashes the page and ticks
the frame counter in the HUD — the 3D and the DOM are one machine, not an
animation parked beside some text.

Performance and access:

- `three` loads as a separate chunk after first paint (`React.lazy`), so the
  headline and CTA are not stuck behind ~890kB of renderer.
- The render loop stops entirely once the hero scrolls out of view.
- `prefers-reduced-motion` renders a single static frame and skips every tween.

## The shutter section

Second on the page, after the hero. A solid camera on the left fires itself
every 3.2s — the zoom barrel rides out, the shutter button travels, the flash
pops — and each exposure sends one print flying onto a stack on the right. No
click required; a visitor who never touches the page still watches the work
being made.

Deliberate splits:

- The camera here is **shaded**, unlike the hero's wireframe. The hero is the
  blueprint, this is the thing the blueprint describes. Three-point light rig,
  no environment map.
- The prints are **DOM, not 3D**. A photograph in an `<img>` stays sharp at any
  DPR, costs nothing to composite, and the real frames drop straight in.
- One normalised phase drives the whole cycle, so the button, the barrel, the
  flash and the print can never disagree about where they are in the shot.

Frames come from `SHOOT_SEQUENCE` in `site.ts` — six ceremonies with a hue each.
Set `src` on an entry and that print shows the real photograph instead of the
graded field. Nothing else changes.

> **The five photographs currently in `public/work/` are AI-generated
> placeholders**, marked `placeholder: true`. They are there so the section can
> be judged with real images in it. Replace them with the photographer's own
> frames before launch — the section tells visitors these are his weddings.
> (`mandap` has no file yet and falls back to the graded field.)

## The edit bay

Third on the page, at `#about`. It replaced a plain About section — the story
and the gear list survived, but they now sit under something that shows the
work instead of describing it.

One wedding film on a Resolve-style timeline: four tracks, clips named after
the real parts of a day, waveforms, ruler, broadcast timecode. A playhead runs
the 72-second timeline in 18 real seconds — an editor scrubbing, not a film
playing — and the programme monitor shows whatever clip it is sitting on.

Two implementation notes worth keeping:

- **All six frames are mounted at once and crossfaded by opacity.** Swapping
  one `<img>`'s `src` looked correct in the DOM and painted nothing: the panel
  sits inside an element GSAP leaves a `transform` on, which promotes it to its
  own compositing layer, and Chrome does not reliably repaint that layer on a
  src change. `useReveal` now also clears its transform when the reveal ends.
- **The playhead moves by ref, not state.** A state update per animation frame
  would re-render every clip in the panel 60 times a second to move one line.

## Deploying

Static build, no server. `npm run build` then upload `dist/`, or point Vercel /
Netlify at the repo (framework preset: Vite, output `dist`).
