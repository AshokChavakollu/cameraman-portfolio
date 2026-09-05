# Cameraman portfolio — wedding filmmaker site

Single-page portfolio for a wedding filmmaker / cinematographer. A darkroom
palette — warm near-black ground, brass accent — a looped take of the
photographer in the hero with the portfolio assembling over it, and every
enquiry routed to WhatsApp.

The ground is warm, not blue-black and not `#000`. The work is marigold, red
and gold, and a cool ground fights every photograph on the page; true black is
harsh under a photograph and bands on a gradient. Tokens live in the `@theme`
block of `src/index.css` — `ink` is the page, `char` a lifted surface and the
matte around a print, `bone` and `ash` the two weights of type, `amber` the one
accent. Every text pair clears WCAG AA on the ground.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build → dist/
npm run lint
```

Stack: Vite + React 19 + TypeScript, Tailwind v4, GSAP + ScrollTrigger, Lenis,
zod. No 3D: the camera used to be a three.js model and is now the real take,
which reads better and saved ~890kB.

Type is two families and nine steps, and nothing else anywhere in the app:
**Cormorant Garamond** light for display, **Manrope** for everything else.
Every step is a class in `src/index.css` and every step is fluid, so a step is
one class rather than a size plus an `sm:` override:

| step | family | for |
| --- | --- | --- |
| `.t-display` | Cormorant | the hero slogan |
| `.t-title` | Cormorant | section titles, the footer line |
| `.t-heading` | Cormorant | service and process headings |
| `.t-card` | Cormorant | card titles, frame labels, the brand mark |
| `.t-quote` | Cormorant | pull quotes, which run to several lines |
| `.t-menu` | Cormorant | the mobile menu, sized against the phone |
| `.t-lede` | Manrope | section ledes, FAQ questions |
| `.t-body` | Manrope | body copy, form fields |
| `.t-label` | Manrope | buttons and small emphasis |
| `.t-stat` | Manrope | the big numerals |
| `.tech` `.tech-sm` `.tech-xs` | Manrope | slate tags, gear readouts, timeline labels |

Numbers stay in Manrope: Cormorant's old-style figures drop below the cap
height and "312" reads as "3ı2".

**Do not add a size to a component.** There were twenty-five hard-coded ones
before this — 0.5, 0.55, 0.72, 0.78, 0.8, 0.82, 0.9, 0.95, 0.98, 1, 1.08, 1.2,
1.28, 1.35, 1.4, 1.45, 1.6, 1.7, 1.9rem and seven separate clamps — most a
hair apart from a neighbour doing the same job, which reads as sloppiness
rather than as hierarchy. The steps also carry their own line-height, and they
are unlayered CSS: a `leading-` or `font-display` on the element does nothing
but suggest it is in charge.

## What's where

| Path | What it holds |
| --- | --- |
| `src/data/site.ts` | **All copy, prices, links, gallery and film lists.** Start here. |
| `src/lib/film.ts` | The take's measured beats and the feather. Both sections read it |
| `src/components/hero/` | Hero layout, the film stage, the rotating slogan |
| `src/components/sheet/` | "Every frame is a decision" — the contact sheet and its keeper |
| `src/components/Aperture.tsx` | The eight-blade iris a section opens through |
| `src/components/Availability.tsx` | The season strip — which months are still open |
| `src/components/Delivery.tsx` | The delivery docket — what lands, when, and in what spec |
| `src/components/Story.tsx` | One wedding start to finish — the day in the order it happened |
| `public/film/` | The take — 5.5s, silent, looped, and its poster |
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
4. **Dates** — `AVAILABILITY.months` and `AVAILABILITY.updated`, together. A
   stale strip is worse than none: it invites an enquiry for a month that went
   months ago, and "actually that's gone" is the worst first reply a couple can
   get. If nobody will keep it current, delete the section instead.
5. **Meta** — title, description and OG tags in `index.html`.
6. **Prices** in `SERVICES`. For `TESTIMONIALS`, get written permission before
   a real couple's name goes up, and use a frame from **their** wedding — a
   stock frame under a named couple beside a named venue and month is the one
   thing on this page that would be a lie rather than a placeholder.
7. **`STORY` needs one real wedding** — twelve to eighteen frames from a
   single day in the order they happened, with the couple's written permission
   for their name, venue and date. It currently borrows gallery frames, so the
   same photograph appears in four sections, which is what gives a placeholder
   away.
8. **`DELIVERY` is a delivery promise.** Turnarounds, frame count, album spec
   and especially the five-year retention line will be quoted back to the
   studio years later. Confirm every row.
9. **The FAQ answers are contract terms**, not copy. The deposit and whether it
   is refundable, the number of edited frames, the crew that turns up, the
   drone arrangement, the revision rounds and the illness clause are promises
   the studio has to keep. They are written as sensible defaults so the section
   can be judged full — confirm every one against what the studio actually
   does.

## Notes on the hero

The stage is **one 5.5s take of the photographer, looped**, and the portfolio
assembles on top of it. The split is the whole design: the FOOTAGE carries the
person and the room, the DOM carries the work. A generator cannot render a
legible event name and cannot know which photographs are in this portfolio
today, and anything burned into a clip can never be changed again — so the
video holds only him, and every photograph and caption is real DOM over it.

Each pass is one capture. At 2.0s the camera is at his eye, the frame flashes,
and the photograph grows out of the body; it holds open at his left, captioned
with the event, while in the footage he lowers the camera and reads its back;
then it shrinks into its place on the wall and the next pass takes the next one.

Three things that are load-bearing:

- **Two coordinate spaces.** The camera anchor is in PICTURE space so the
  freeze-frame lands on his hands at any crop; the photographs are in STAGE
  space so they can never be cropped off on a phone. Sizes are clamped px.
- **The clip does not loop on its own** and cannot be made to — see the header
  of `src/lib/film.ts`. It is a hard cut masked by a fast defocus, because a
  dissolve across that gap puts two of him on screen at once.
- **No viewfinder furniture.** No brackets, no rec light, no focal-length
  readout. They announced "this is a video of a camera", which is the opposite
  of the goal.

Performance and access:

- The take is 234kB of h264 and the poster 33kB. There is no renderer to wait
  for — dropping three.js took ~890kB off the page.
- Playback stops entirely once the hero scrolls out of view.
- `prefers-reduced-motion` renders the poster and skips every tween.

## The contact sheet

Second on the page. A sheet of twelve frames, one ringed in grease pencil, and
the keeper printed large beside it. It is the part of the job a client never
sees, and it is what the section title means: he did not take this photograph,
he took twelve and threw eleven away.

It replaced a three.js camera that fired on a timer, and then briefly a
scroll-scrubbed version of the same idea. Both told the story the hero already
tells — him firing a shutter, a picture appearing. The scrub also asked the
visitor to infer wheel → clip time → shutter → print, which is three steps
nobody makes in two seconds. A sheet with one frame circled needs no explaining
and says the thing the hero cannot: the choosing, not the capture.

Deliberate choices:

- **It plays itself, and it yields.** The pick moves every 3.6s so a passive
  visitor still watches frames chosen and rejected; the first hover, tap or tab
  stops the auto for good.
- **The frames develop once.** They come up out of blur and grey in a random
  order, like a sheet coming up in a tray. `once: true` — a darkroom effect that
  re-runs on every scroll-past is a loading spinner.
- **The ring is drawn, not faded.** `pathLength="1"` normalises the path so one
  dash offset draws it end to end with nothing measuring it in JavaScript, and
  the loop overshoots its own start the way a hand does.

Frames come from `CONTACT_SHEET` in `site.ts`. Ideally they are twelve frames of
ONE moment — a burst, near-identical — so choosing between them looks like the
judgement it is; set `pick` to the keeper.

> **The photographs currently in `public/work/` are AI-generated placeholders.**
> They are there so the sections can be judged with real images in them. Replace
> them with the photographer's own frames before launch — the site tells
> visitors these are his weddings.

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
