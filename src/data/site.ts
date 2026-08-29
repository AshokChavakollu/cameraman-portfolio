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
  { href: '#contact', label: 'Contact' },
] as const

export const HERO = {
  eyebrow: 'Available for 2026 dates',
  /**
   * The hero cycles these, one every few seconds, with no dots or arrows —
   * a visitor should notice the words changed, not the mechanism.
   *
   * Each is two lines and **the second is set in gold italic**, so the second
   * line must always be the phrase worth stressing. The first entry is the one
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
export type ShootFrame = {
  id: string
  label: string
  place: string
  /** Tints the graded field that stands in when `src` is missing. */
  hue: number
  src?: string
  /** True while the image is an AI stand-in rather than the client's frame. */
  placeholder?: boolean
}

export const SHOOT_SEQUENCE: ShootFrame[] = [
  {
    id: 'haldi',
    label: 'Haldi',
    place: 'Jubilee Hills',
    hue: 44,
    src: '/work/haldi.jpg',
    placeholder: true,
  },
  {
    id: 'mehendi',
    label: 'Mehendi',
    place: 'Kompally',
    hue: 24,
    src: '/work/mehendi.jpg',
    placeholder: true,
  },
  {
    id: 'baraat',
    label: 'Baraat',
    place: 'Old City',
    hue: 12,
    src: '/work/baraat.jpg',
    placeholder: true,
  },
  {
    id: 'mandap',
    label: 'The mandap',
    place: 'Falaknuma',
    hue: 34,
    src: '/work/mandap.jpg',
    placeholder: true,
  },
  {
    id: 'vidaai',
    label: 'Vidaai',
    place: 'Vijayawada',
    hue: 208,
    src: '/work/vidaai.jpg',
    placeholder: true,
  },
  {
    id: 'reception',
    label: 'Reception',
    place: 'Novotel HICC',
    hue: 288,
    src: '/work/reception.jpg',
    placeholder: true,
  },
]

/**
 * Films. `youtubeId` drives a click-to-load embed — no iframe is mounted until
 * the visitor asks for one, so the page does not ship three players it may
 * never need.
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

export const TESTIMONIALS = [
  {
    quote:
      'We booked him for the wedding film and ended up hiring him for my sister’s too. The teaser came while we were still at the reception and my mother has watched it maybe four hundred times.',
    name: 'Meghana R.',
    detail: 'Wedding, Falaknuma Palace',
  },
  {
    quote:
      'He shot for eleven hours and I did not once feel a camera pointed at me. When the film came, half the moments in it I did not even know happened.',
    name: 'Karan S.',
    detail: 'Wedding + Pre-wedding, Udaipur',
  },
  {
    quote:
      'Our brand film had a two-week deadline and a small budget. He wrote it, shot it and graded it himself, and it still looks better than the agency cut we paid five times for.',
    name: 'Nikhil Aggarwal',
    detail: 'Founder, Aureate Coffee',
  },
] as const

export const FAQS = [
  {
    q: 'How far in advance should we book?',
    a: 'Six to nine months for a peak-season date (November to February). If your date is inside eight weeks, message me anyway — cancellations happen.',
  },
  {
    q: 'Do you travel outside Hyderabad?',
    a: 'Constantly. Travel and stay for the crew is added at actuals; there is no separate "destination premium".',
  },
  {
    q: 'When do we get the film?',
    a: 'Teaser in 48 hours, full film in five weeks, photographs in three. If a date matters — an anniversary, a visa deadline — say so and I will plan around it.',
  },
  {
    q: 'What if it rains, or the schedule collapses?',
    a: 'It always collapses. That is normal and it is my job, not yours. We carry rain covers, extra lights for dark halls, and a second body in case one dies.',
  },
] as const
