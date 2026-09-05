/**
 * Every word, number and link on the site lives here.
 *
 * PLACEHOLDERS — swap before launch. Search for `TODO:` in this file.
 * The name, phone, Instagram handle and YouTube IDs are stand-ins so the
 * layout can be judged with real-length copy instead of lorem ipsum.
 */

export const SITE = {
  name: 'Aditya Rao', // TODO: real name
  role: 'Wedding Filmmaker & Cinematographer',
  city: 'Hyderabad',
  basedLine: 'Hyderabad · shooting across India',
  phone: '+919000000000', // TODO: real number
  phoneDisplay: '+91 90000 00000',
  email: 'hello@adityarao.film', // TODO
  instagram: 'https://instagram.com/', // TODO
  youtube: 'https://youtube.com/', // TODO
  whatsappMessage:
    "Hi Aditya, I found your website. I'd like to check your availability for my wedding.",
} as const

export const whatsappHref = (message: string = SITE.whatsappMessage) =>
  `https://wa.me/${SITE.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

export const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#films', label: 'Films' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#dates', label: 'Dates' },
  { href: '#contact', label: 'Contact' },
] as const

export const HERO = {
  eyebrow: 'Available for 2026 dates',
  /**
   * The hero cycles these, one every few seconds, with no dots or arrows —
   * a visitor should notice the words changed, not the mechanism.
   *
   * Each is two lines and **the second is set in the accent blue**, so the
   * second line must always be the phrase worth stressing. The first entry is the one
   * screen readers and search engines get, so it stays the strongest.
   *
   * They are promises, not CVs: "nine years behind the camera" told a couple
   * what he has done, these tell them what they get.
   */
  slogans: [
    ['We turn weddings into', 'memories you can watch'],
    ['The day passes.', "The film doesn't."],
    ['Live it once.', 'Watch it forever.'],
    ['Your day, kept', 'exactly as it felt'],
  ],
  sub: 'Nine years and three hundred weddings, and the job has never changed: give the day back exactly as it felt — the nervous hands before the mangalsutra, the uncle who cries when he thinks nobody is watching. No posing. No shot list on a clipboard.',
  primaryCta: 'Check my dates',
  secondaryCta: 'Watch a film',
  stats: [
    { value: 312, suffix: '+', label: 'Weddings filmed' },
    { value: 9, suffix: ' yrs', label: 'Behind the lens' },
    { value: 26, suffix: '', label: 'Cities shot in' },
  ],
  /**
   * The hero stage.
   *
   * The FOOTAGE carries the photographer and the room. The PHOTOGRAPHS are
   * DOM, drawn on top — so the wall he builds is the real portfolio and can be
   * re-ordered, re-labelled or replaced without re-rendering a frame of video.
   *
   * `photos` is the capture order: one per pass of the clip, looping. Keep it
   * to six or fewer long words — the event name is set in caps under the
   * freeze-frame and a long one wraps.
   */
  film: {
    clip: '/film/hero.mp4',
    poster: '/film/hero.webp',
    /** Sits above the event name on the freeze-frame, as the shot lands. */
    captureLabel: 'Captured',
    photos: [
      { event: 'Haldi', src: '/work/haldi.jpg' },
      { event: 'Mehendi', src: '/work/mehendi.jpg' },
      { event: 'Baraat', src: '/work/baraat.jpg' },
      { event: 'Mandap', src: '/work/mandap.jpg' },
      { event: 'Vidaai', src: '/work/vidaai.jpg' },
      { event: 'Reception', src: '/work/reception.jpg' },
    ],
  },
} as const

/**
 * The contact sheet — "Every frame is a decision".
 *
 * A contact sheet is the sheet of every frame on a roll, printed small, with
 * the keeper ringed in grease pencil. It is the part of the job a client never
 * sees, and it is what the section title is actually about: he did not take
 * this photograph, he took twelve and threw eleven away.
 *
 * IDEALLY these are twelve frames of ONE moment — a burst, near-identical, so
 * choosing between them looks like the judgement it is. Until that burst
 * exists these are the gallery files, which reads as a sheet of a whole day
 * rather than of one moment. Swap them and set `pick` to the keeper.
 */
export const CONTACT_SHEET = {
  eyebrow: 'Watch it work',
  title: 'Every frame is a decision',
  lede: 'Nobody hangs the first frame. A moment gets shot a dozen times over a few seconds, and then somebody has to know which one it was. That part is the job.',
  /** Sits above the sheet, like the strip label on a real one. */
  roll: 'Mandap · Falaknuma · 12 frames',
  /** Index of the frame ringed in pencil when the section arrives. */
  pick: 6,
  keeperLabel: 'The keeper',
  hint: 'Pick another',
  frames: [
    { src: '/work/first-look.jpg', label: 'First look', place: 'Falaknuma Palace' },
    { src: '/work/haldi.jpg', label: 'Haldi hands', place: 'Jubilee Hills' },
    { src: '/work/mehendi.jpg', label: 'Mehendi light', place: 'Kompally' },
    { src: '/work/baraat.jpg', label: 'Baraat', place: 'Old City' },
    { src: '/work/blue-hour.jpg', label: 'Blue hour', place: 'Gandikota' },
    { src: '/work/coast-road.jpg', label: 'Coast road', place: 'Vizag' },
    { src: '/work/mandap.jpg', label: 'The mandap', place: 'Falaknuma Palace' },
    { src: '/work/vidaai.jpg', label: 'The vidaai', place: 'Vijayawada' },
    { src: '/work/reception.jpg', label: 'Rooftop', place: 'Banjara Hills' },
    { src: '/work/backwaters.jpg', label: 'Backwaters', place: 'Alleppey' },
    { src: '/work/founder.jpg', label: 'Founder portrait', place: 'HITEC City' },
    { src: '/work/product-launch.jpg', label: 'Product launch', place: 'Hyderabad' },
  ],
} as const

/** Ticker under the hero — reads like a call sheet. */
export const TICKER = [
  'Wedding films',
  'Pre-wedding',
  'Haldi & Mehendi',
  'Reception',
  'Brand films',
  'Music videos',
  'Drone',
  'Same-day edits',
] as const

/**
 * The edit-bay section: one wedding film on a timeline.
 *
 * Times are in timeline seconds. The playhead runs the whole length on a loop
 * at 4× so a visitor sees several cuts without waiting — an editor scrubbing,
 * not a film playing.
 *
 * V1 is the spine (the ceremonies), V2 is what gets layered over it (drone,
 * titles, cutaways), A1 is the day's own sound, A2 the music bed.
 */
export type EditClip = {
  id: string
  track: 'V1' | 'V2'
  label: string
  start: number
  dur: number
  /** Basename of the frame in /public/work this clip shows in the monitor. */
  frame?: string
}

export type EditAudio = {
  id: string
  track: 'A1' | 'A2'
  label: string
  start: number
  dur: number
}

export const EDIT: {
  project: string
  format: string
  duration: number
  startTC: number
  clips: EditClip[]
  audio: EditAudio[]
} = {
  project: 'MEGHANA_ROHIT_FILM_v7',
  format: '3840 × 2160 · 24 fps',
  /** Timeline length in seconds. */
  duration: 72,
  /** Broadcast start timecode — hour one, like every real delivery. */
  startTC: 3600,
  clips: [
    { id: 'c1', track: 'V1', label: 'Haldi — courtyard', start: 0, dur: 11, frame: 'haldi' },
    { id: 'c2', track: 'V1', label: 'Mehendi', start: 11, dur: 9, frame: 'mehendi' },
    { id: 'c3', track: 'V1', label: 'Baraat — Old City', start: 20, dur: 14, frame: 'baraat' },
    { id: 'c4', track: 'V1', label: 'Mandap · vows', start: 34, dur: 16, frame: 'mandap' },
    { id: 'c5', track: 'V1', label: 'Vidaai', start: 50, dur: 10, frame: 'vidaai' },
    { id: 'c6', track: 'V1', label: 'Reception', start: 60, dur: 12, frame: 'reception' },

    { id: 'o1', track: 'V2', label: 'Title', start: 0, dur: 4 },
    { id: 'o2', track: 'V2', label: 'Drone — palace', start: 21, dur: 6 },
    { id: 'o3', track: 'V2', label: 'Cutaway — hands', start: 38, dur: 5 },
    { id: 'o4', track: 'V2', label: 'Sparklers', start: 62, dur: 7 },
  ],
  /** Audio blocks: A1 is production sound, A2 the score. */
  audio: [
    { id: 'a1', track: 'A1', label: 'Dhol + atmos', start: 0, dur: 34 },
    { id: 'a2', track: 'A1', label: 'Vows — lav mic', start: 34, dur: 26 },
    { id: 'a3', track: 'A1', label: 'Room tone', start: 60, dur: 12 },
    { id: 'a4', track: 'A2', label: 'Score — “Ghar Aaya”', start: 0, dur: 72 },
  ],
}

/**
 * The availability strip.
 *
 * The site's main call to action is "Check my dates" and the hero says
 * "Available for 2026 dates", but until this section there was nowhere to
 * check anything — the answer to the first question every couple asks was
 * "send a message and wait". A month is a link that opens WhatsApp already
 * asking about that month, so the enquiry arrives with the date in it.
 *
 * TODO: KEEP THIS CURRENT. A stale availability strip is worse than none —
 * it invites an enquiry for a month that went months ago, and the reply
 * "actually that's gone" is the worst first message a couple can get. Update
 * `months` and `updated` together, and if nobody will maintain it, take the
 * section out rather than let it drift.
 */
export type MonthStatus = 'open' | 'few' | 'booked'

export const AVAILABILITY = {
  eyebrow: 'Dates',
  title: "What's still open",
  lede: 'Wedding season runs November to February and again through April to June. Most of a season goes eight to ten months ahead, so the honest answer is usually "ask early".',
  /** Shown under the strip. Change it in the same commit as `months`. */
  updated: 'Updated 12 February 2026',
  /** The one thing that actually holds a date, said plainly. */
  terms: 'A date is only held once the advance is paid — an enquiry does not reserve it.',
  /** `{month}` and `{year}` are filled in before the message is sent. */
  ask: 'Hi Aditya, I found your website. Is {month} {year} still open? Our wedding is on ',
  legend: { open: 'Open', few: 'Few left', booked: 'Fully booked' },
  months: [
    { label: 'November', short: 'Nov', year: 2026, status: 'booked' },
    { label: 'December', short: 'Dec', year: 2026, status: 'few', left: 2 },
    { label: 'January', short: 'Jan', year: 2027, status: 'open' },
    { label: 'February', short: 'Feb', year: 2027, status: 'few', left: 3 },
    { label: 'April', short: 'Apr', year: 2027, status: 'open' },
    { label: 'May', short: 'May', year: 2027, status: 'open' },
    { label: 'June', short: 'Jun', year: 2027, status: 'booked' },
  ] as { label: string; short: string; year: number; status: MonthStatus; left?: number }[],
} as const

export const ABOUT = {
  eyebrow: 'In the edit',
  title: 'Shot in a day. Cut over five weeks.',
  body: [
    "I started as a second shooter in 2017 carrying somebody else's tripod through a Hyderabad palace wedding, and I have not put a camera down since. Three hundred weddings later the film still has to feel like the day felt, not like a music video somebody bought — and every frame of it is cut and graded by me, not sent to a farm and called delivery.",
  ],
  /** Gear list, rendered as a technical readout. */
  kit: [
    { label: 'Bodies', value: 'Sony FX6 · FX3 · A7S III' },
    { label: 'Glass', value: '24mm · 35mm · 50mm · 85mm — all f/1.4' },
    { label: 'Support', value: 'Ronin RS4 · Sachtler fluid head' },
    { label: 'Air', value: 'DJI Mavic 3 Cine · licensed pilot' },
    { label: 'Sound', value: 'Dual Rode wireless · 32-bit float' },
    { label: 'Grade', value: 'DaVinci Resolve Studio · own LUTs' },
  ],
} as const

export const SERVICES = [
  {
    id: 'wedding-film',
    title: 'Wedding Film',
    icon: 'film',
    price: 'from ₹1,85,000',
    body: 'Full-day coverage across your functions. A 6–8 minute film, a 60-second teaser for the day after, and every frame colour graded by hand.',
    includes: ['2 cinematographers', 'Teaser in 48 hours', 'Film in 5 weeks', 'Drone included'],
  },
  {
    id: 'pre-wedding',
    title: 'Pre-Wedding',
    icon: 'heart',
    price: 'from ₹65,000',
    body: 'A half-day or full-day shoot on location — a fort, a coastline, a rooftop at blue hour. Direction included, because nobody knows what to do with their hands.',
    includes: ['Location scouting', '60–80 edited stills', '90-second film', 'Outfit guidance'],
  },
  {
    id: 'photography',
    title: 'Photography',
    icon: 'aperture',
    price: 'from ₹95,000',
    body: 'Candid and traditional stills, shot alongside the film crew so you are never pulled in two directions by two teams with two plans.',
    includes: [
      '500+ edited frames',
      'Same-day highlights',
      'Printed album option',
      'Family portraits',
    ],
  },
  {
    id: 'brand-film',
    title: 'Brand & Event',
    icon: 'building',
    price: 'on request',
    body: 'Product launches, founder stories, conference recaps, music videos. Script to grade, or just the camera department if you already have a director.',
    includes: ['Concept & script', 'Crew sourcing', 'Multi-cam events', 'Reel cutdowns'],
  },
] as const

/** Photo grid. Real files go in /public/work — see README. */
export const GALLERY_FILTERS = ['All', 'Wedding', 'Pre-wedding', 'Portrait', 'Events'] as const
export type GalleryFilter = (typeof GALLERY_FILTERS)[number]

export type Shot = {
  id: string
  title: string
  place: string
  tag: Exclude<GalleryFilter, 'All'>
  /** Drives the placeholder tint until real photos land. */
  hue: number
  /** Grid span — a couple of hero tiles keep the masonry from reading flat. */
  span?: 'wide' | 'tall'
  /** TODO: set once real files exist, e.g. '/work/01-haldi.jpg' */
  src?: string
  /** True while the image is an AI stand-in rather than the client's frame. */
  placeholder?: boolean
}

export const SHOTS: Shot[] = [
  {
    id: 's1',
    title: 'First look',
    place: 'Falaknuma Palace',
    tag: 'Wedding',
    hue: 28,
    span: 'tall',
    src: '/work/first-look.jpg',
    placeholder: true,
  },
  {
    id: 's2',
    title: 'Haldi hands',
    place: 'Jubilee Hills',
    tag: 'Wedding',
    hue: 44,
    src: '/work/haldi.jpg',
    placeholder: true,
  },
  {
    id: 's3',
    title: 'Blue hour',
    place: 'Gandikota',
    tag: 'Pre-wedding',
    hue: 210,
    span: 'wide',
    src: '/work/blue-hour.jpg',
    placeholder: true,
  },
  {
    id: 's4',
    title: 'The vidaai',
    place: 'Vijayawada',
    tag: 'Wedding',
    hue: 16,
    src: '/work/vidaai.jpg',
    placeholder: true,
  },
  {
    id: 's5',
    title: 'Rooftop',
    place: 'Banjara Hills',
    tag: 'Portrait',
    hue: 8,
  },
  {
    id: 's6',
    title: 'Sangeet floor',
    place: 'Novotel HICC',
    tag: 'Events',
    hue: 300,
    src: '/work/reception.jpg',
    placeholder: true,
  },
  {
    id: 's7',
    title: 'Backwaters',
    place: 'Alleppey',
    tag: 'Pre-wedding',
    hue: 160,
    span: 'tall',
    src: '/work/backwaters.jpg',
    placeholder: true,
  },
  {
    id: 's8',
    title: 'Baraat',
    place: 'Old City',
    tag: 'Wedding',
    hue: 36,
    src: '/work/baraat.jpg',
    placeholder: true,
  },
  {
    id: 's9',
    title: 'Founder portrait',
    place: 'HITEC City',
    tag: 'Portrait',
    hue: 200,
    src: '/work/founder.jpg',
    placeholder: true,
  },
  {
    id: 's10',
    title: 'Mehendi light',
    place: 'Kompally',
    tag: 'Wedding',
    hue: 52,
    src: '/work/mehendi.jpg',
    placeholder: true,
    span: 'wide',
  },
  {
    id: 's11',
    title: 'Product launch',
    place: 'Hyderabad',
    tag: 'Events',
    hue: 264,
    src: '/work/product-launch.jpg',
    placeholder: true,
  },
  {
    id: 's12',
    title: 'Coast road',
    place: 'Vizag',
    tag: 'Pre-wedding',
    hue: 190,
    src: '/work/coast-road.jpg',
    placeholder: true,
  },
]

/**
 * The shutter section: what the camera fires at, in order. Each capture drops
 * one print onto the stack on the right.
 *
 * `src` is empty for now, so a graded placeholder stands in. Drop real frames
 * into /public/work and fill it in — nothing else changes.
 */
/**
 * ⚠️ PLACEHOLDER IMAGERY — every frame with `placeholder: true` is an
 * AI-generated stand-in, not this photographer's work. They exist so the
 * section can be judged with real photographs in it. **They must be replaced
 * with the client's own frames before launch.** Publishing them as his
 * portfolio would be telling couples he shot weddings he never attended.
 */
export const FILMS = [
  {
    id: 'f1',
    title: 'Meghana & Rohit',
    kind: 'Wedding Film',
    runtime: '7:24',
    place: 'Falaknuma Palace, Hyderabad',
    // Sample stand-in — swap for Aditya's own upload before launch.
    youtubeId: '6M5z2yvHJGs',
    hue: 30,
  },
  {
    id: 'f2',
    title: 'Sruthi & Karan',
    kind: 'Teaser',
    runtime: '1:02',
    place: 'Udaipur',
    // Sample stand-in — swap for Aditya's own upload before launch.
    youtubeId: 'd0YlV06LqnE',
    hue: 205,
  },
  {
    id: 'f3',
    title: 'The Room Below',
    kind: 'Brand Film',
    runtime: '2:48',
    place: 'For Aureate Coffee',
    // Sample stand-in — swap for Aditya's own upload before launch.
    youtubeId: '5JGBAoEDpLQ',
    hue: 18,
  },
] as const

export const PROCESS = [
  {
    step: '01',
    title: 'A call, not a form letter',
    body: 'Twenty minutes on the phone. Your dates, your venues, how many functions, what you actually want to feel when you watch it in ten years.',
  },
  {
    step: '02',
    title: 'Recce & shot plan',
    body: 'I visit the venue or study it in detail — where the light falls at 4pm, where the baraat enters, where the crowd will block the mandap.',
  },
  {
    step: '03',
    title: 'Shoot day',
    body: 'We arrive before the makeup does and leave after the last car. You will barely notice us. That is the whole point.',
  },
  {
    step: '04',
    title: 'The edit',
    body: 'A teaser inside 48 hours while everyone is still glowing. The full film in five weeks, with one round of changes if you want them.',
  },
  {
    step: '05',
    title: 'Delivery, forever',
    body: '4K masters, social cutdowns, and your raw footage archived on two drives plus cloud. Ask me for it in 2040 and it will still be there.',
  },
] as const

/**
 * What actually lands, and when.
 *
 * Services says what a package costs and Process says how the day runs, and
 * between them nothing said what the couple ends up holding. Deliverable
 * anxiety is one of the quiet reasons a couple books the other photographer:
 * they have all been told about a "cinematic film" and none of them know
 * whether that means four minutes or forty, whether their parents can see the
 * photographs, or whether the files still open in five years.
 *
 * Written as a delivery docket — when, what, and the spec — because that is
 * the shape of the answer they want.
 *
 * TODO: EVERY ROW IS A COMMITMENT. The turnarounds, the frame count, the album
 * spec and above all the retention window are promises the studio has to keep,
 * and the retention line is the one that will be quoted back years later.
 * Confirm each against what the studio actually does before launch.
 */
export const DELIVERY = {
  eyebrow: 'Deliverables',
  title: 'What actually lands',
  lede: 'Every studio promises a cinematic film. Almost none of them tell you how long it is, when it arrives, or whether your mother can watch it without an app. This is the whole list.',
  items: [
    {
      when: '48 hours',
      title: 'The teaser',
      spec: '60–90 sec · 4K · vertical cut included',
      body: 'A minute of the day, cut and graded while it is still the thing everyone is talking about. The vertical cut comes with it, so nobody has to screen-record it off a laptop to put it up.',
    },
    {
      when: '3 weeks',
      title: 'The photographs',
      spec: '600–900 frames · online gallery',
      body: 'Edited frames in a gallery you can send to anyone — both sets of parents included — with full-resolution downloads and print rights for anything personal.',
    },
    {
      when: '5 weeks',
      title: 'The film',
      spec: '6–8 min · 4K · 24fps',
      body: 'The day in the order it happened, graded by hand, delivered as a file you own rather than a link that expires. Two rounds of changes are included.',
    },
    {
      when: '5 weeks',
      title: 'The ceremonies, uncut',
      spec: 'full length · 1080p',
      body: 'The pheras, the vows, the speeches — unglamorous and end to end. Nobody asks for this at the booking and everybody wants it in twenty years.',
    },
    {
      when: '8 weeks',
      title: 'The album',
      spec: '30 spreads · 12×18in · hand-laid',
      body: 'Laid out by me, printed on cotton rag and stitched by hand. You see the whole layout and approve it before anything goes to print.',
    },
  ],
  note: 'Everything is held in two places, a drive here and the cloud, for five years — ask for a re-download any time inside that window. After five years, do not assume: keep your own copy.',
} as const

/**
 * What couples said, and enough about them to believe it.
 *
 * These used to be a quote, a first name and a line like "Wedding, Falaknuma
 * Palace". That reads as copywriting, because it is exactly what invented
 * praise looks like. A testimonial is only worth the specifics attached to it:
 * a venue, a month, and a frame from that actual day. The same words with a
 * date on them are a different claim.
 *
 * TODO: get written permission before a real couple's name goes here, and use
 * a frame from THEIR wedding — a stock frame under a named couple is the one
 * thing on this page that would be a lie rather than a placeholder.
 */
/**
 * One wedding, start to finish.
 *
 * The gallery is breadth — a dozen frames from a dozen days — and Films is
 * three embeds. Neither shows ONE day as a story, and that is the thing a
 * couple is actually trying to imagine: not his greatest hits, but what their
 * own wedding would look like in his hands.
 *
 * It is also the only part of the site with a name, a venue and a date
 * attached, which makes it the only part search engines can do anything with.
 *
 * The two numbers in `facts` that matter are `Frames shot` and `Frames
 * delivered`. Four thousand down to eight hundred is the contact sheet section
 * restated as arithmetic, and it is the clearest argument on the page for why
 * the job costs what it costs.
 *
 * TODO: THIS NEEDS ONE REAL WEDDING. Twelve to eighteen frames from a single
 * day, in the order they happened, with the couple's written permission for
 * their name, venue and date. The frames below are borrowed from the gallery,
 * so the same photograph currently appears here and in three other sections —
 * which is the one thing that gives a placeholder away.
 */
export const STORY = {
  eyebrow: 'One wedding, start to finish',
  couple: 'Meghana & Rohit',
  venue: 'Falaknuma Palace, Hyderabad',
  date: '14 December 2024',
  lede: 'Three days, six functions, thirty-one hours on camera. This is the whole of one wedding in the order it happened — not the highlights, the day.',
  facts: [
    { label: 'Functions', value: 'Six, over three days' },
    { label: 'On camera', value: 'Two, plus lights' },
    { label: 'Hours shot', value: '31' },
    { label: 'Frames shot', value: '4,180' },
    { label: 'Frames delivered', value: '812' },
    { label: 'Film', value: '7 min 40 sec' },
  ],
  beats: [
    {
      time: '06:40',
      day: 'Day one',
      title: 'Haldi',
      src: '/work/haldi.jpg',
      body: 'Turmeric in an open courtyard at first light, which is the best light anyone will get all weekend and the only hour nobody is dressed for it.',
    },
    {
      time: '11:20',
      day: 'Day one',
      title: 'Mehendi',
      src: '/work/mehendi.jpg',
      body: 'Four hours of hands and no hurry at all. Most of the quiet in the finished film was shot here, while everyone assumed nothing was happening.',
    },
    {
      time: '18:05',
      day: 'Day two',
      title: 'Baraat',
      src: '/work/baraat.jpg',
      body: 'Two hundred people and one dhol down a closed street in the Old City. Shot slow on purpose — the blur is the point, a sharp baraat looks like a queue.',
    },
    {
      time: '20:15',
      day: 'Day two',
      title: 'The mandap',
      src: '/work/mandap.jpg',
      body: 'The pheras. No direction, no second take, nobody moved for a better angle — you get one take of a wedding and the job is to be in the right place already.',
    },
    {
      time: '23:40',
      day: 'Day two',
      title: 'Vidaai',
      src: '/work/vidaai.jpg',
      body: 'Her father held it together until the car door shut. It is the frame the family asked to print, and it is the reason I stopped posing anybody years ago.',
    },
    {
      time: '21:00',
      day: 'Day three',
      title: 'Reception',
      src: '/work/reception.jpg',
      body: 'A rooftop, a bad PA and four hundred guests. By this point a wedding photographer is furniture, which is exactly when people forget to perform.',
    },
  ],
  quote: {
    text: 'The teaser came while we were still at the reception and my mother has watched it maybe four hundred times.',
    name: 'Meghana R.',
  },
  cta: { label: 'Watch their film', href: '#films' },
} as const

export const TESTIMONIALS = [
  {
    quote:
      'We booked him for the wedding film and ended up hiring him for my sister’s too. The teaser came while we were still at the reception and my mother has watched it maybe four hundred times.',
    name: 'Meghana R.',
    service: 'Wedding film',
    venue: 'Falaknuma Palace, Hyderabad',
    date: 'December 2024',
    frame: '/work/mandap.jpg',
  },
  {
    quote:
      'He shot for eleven hours and I did not once feel a camera pointed at me. When the film came, half the moments in it I did not even know happened.',
    name: 'Karan S.',
    service: 'Wedding + pre-wedding',
    venue: 'Udaipur',
    date: 'February 2025',
    frame: '/work/first-look.jpg',
  },
  {
    quote:
      'Our brand film had a two-week deadline and a small budget. He wrote it, shot it and graded it himself, and it still looks better than the agency cut we paid five times for.',
    name: 'Nikhil Aggarwal',
    service: 'Brand film',
    venue: 'Aureate Coffee, HITEC City',
    date: 'August 2025',
    frame: '/work/founder.jpg',
  },
] as const

/**
 * The questions couples actually ask before they pay a deposit.
 *
 * There were four here, and all four were easy ones — when do we get it, do
 * you travel. The ones that decide a booking were missing: what holds a date,
 * how many photographs, who else turns up, what happens if you fall ill. An
 * unanswered objection does not get raised, it just goes and books someone
 * else.
 *
 * TODO: SIX OF THESE ARE CONTRACT TERMS, NOT COPY. The deposit and its
 * refundability, the number of edited frames, the crew that comes, the drone
 * arrangement, the number of revision rounds and the illness clause are all
 * promises the studio has to be able to keep. They are written here as
 * sensible defaults so the section can be judged full; every one must be
 * confirmed against what the studio actually does before launch.
 */
export const FAQS = [
  {
    q: 'How far in advance should we book?',
    a: 'Six to nine months for a peak-season date (November to February). If your date is inside eight weeks, message me anyway — cancellations happen.',
  },
  {
    q: 'What does it take to hold a date?',
    a: 'A one-page agreement and 30% of the package. Until that lands the date stays open to whoever asks next — I do not hold dates on a promise, because holding one for you means turning away everyone else who wanted it. The balance is due a week before the first function.',
  },
  {
    q: 'Do you travel outside Hyderabad?',
    a: 'Constantly. Travel and stay for the crew is added at actuals; there is no separate "destination premium".',
  },
  {
    q: 'How many photographs do we actually get?',
    a: 'Six to nine hundred edited frames for a full wedding, in an online gallery your family can view and download from. It is not a number I pad: you get every frame worth keeping and none of the four hundred near-identical ones that were not.',
  },
  {
    q: 'Do we get the unedited files?',
    a: 'No, and I would be wary of anyone who says yes. A RAW file is a negative, not a photograph — it is half the work, and it is not the thing you are paying for. If there is a frame you loved that did not make the edit, ask and I will grade it for you.',
  },
  {
    q: 'Who else comes on the day?',
    a: 'For a full wedding, two of us on camera and one on lights — the same people each time, not a rotating pool of freelancers. You meet them at the recce, and their travel and stay is already inside the quote you sign.',
  },
  {
    q: 'Is the drone included, and who gets permission?',
    a: 'Included in the wedding film package, and the permission is mine to arrange. There are venues and city zones where it will be refused — you will hear that from me at the recce, not on the morning of the baraat.',
  },
  {
    q: 'When do we get the film?',
    a: 'Teaser in 48 hours, full film in five weeks, photographs in three. If a date matters — an anniversary, a visa deadline — say so and I will plan around it.',
  },
  {
    q: 'Can we ask for changes to the film?',
    a: 'Two rounds, included — a song swap, a moment you want in, a relative you want out. What I will not do is re-cut it to match somebody else’s reel: you are hiring a way of seeing, and a film made by committee looks like one.',
  },
  {
    q: 'What if it rains, or the schedule collapses?',
    a: 'It always collapses. That is normal and it is my job, not yours. We carry rain covers, extra lights for dark halls, and a second body in case one dies.',
  },
  {
    q: 'What if you cannot make it?',
    a: 'It has not happened in nine years, which is exactly why it is planned for. Every contract names a second shooter who has worked your kind of day and can carry it. If the one who cannot be there is me, you get the full crew, the film, and my fee back.',
  },
] as const
