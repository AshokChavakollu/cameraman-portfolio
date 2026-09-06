import { useState } from 'react'
import Icon from './Icon'
import { Eyebrow, Lede, Section, SectionTitle } from './ui'
import { FILMS, SITE } from '../data/site'
import { useReveal } from '../lib/motion'

/**
 * Films are click-to-load. Three YouTube iframes on page load is roughly a
 * megabyte of player nobody asked for and three sets of cookies; instead we
 * paint a poster and only mount the embed when someone actually presses play.
 */
export default function Films() {
  const ref = useReveal<HTMLElement>({ stagger: 0.1 })
  const [playing, setPlaying] = useState<string | null>(null)

  return (
    <Section id="films" ref={ref} className="border-y border-line/60 bg-char/40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Roll the tape</Eyebrow>
          <SectionTitle>Films</SectionTitle>
          <Lede>
            Full wedding films, teasers and one brand piece. Sound on — half the work is in the
            audio.
          </Lede>
        </div>
        <a
          href={SITE.youtube}
          target="_blank"
          rel="noreferrer"
          className="reveal inline-flex items-center gap-2 tech text-amber transition-colors hover:text-amber-glow"
        >
          <Icon name="youtube" className="size-4" />
          All films on YouTube
        </a>
      </div>

      <div className="mt-10 grid max-w-[84rem] gap-4 md:grid-cols-3">
        {FILMS.map((film) => (
          <article key={film.id} className="reveal group">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-line/70 bg-ink">
              {playing === film.id ? (
                <iframe
                  className="size-full"
                  src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}?autoplay=1&rel=0`}
                  title={film.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(film.id)}
                  className="relative size-full"
                  aria-label={`Play ${film.title}, ${film.runtime}`}
                >
                  {/* Poster — the film's own YouTube thumbnail. */}
                  <img
                    src={`https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                  {/* Letterbox bars — fixed dark, because cinema bars are
                      black whatever the page theme is. */}
                  <span className="absolute inset-x-0 top-0 h-[9%] bg-[#100e0c]/85" />
                  <span className="absolute inset-x-0 bottom-0 h-[9%] bg-[#100e0c]/85" />

                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-16 items-center justify-center rounded-full border border-white/40 bg-[#100e0c]/40 text-[#f3ece0] backdrop-blur-sm transition-all duration-400 group-hover:border-amber group-hover:bg-amber">
                      <Icon name="play" className="size-5 translate-x-0.5" />
                    </span>
                  </span>

                  <span className="absolute right-3 bottom-[13%] rounded bg-[#100e0c]/75 px-2 py-1 tech-sm text-[#f3ece0]/85 tabular-nums">
                    {film.runtime}
                  </span>
                </button>
              )}
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="t-card font-light text-bone">{film.title}</h3>
                <p className="mt-1 tech-sm text-ash ">{film.place}</p>
              </div>
              <span className="shrink-0 rounded-full border border-line px-3 py-1 tech-sm text-amber/90 ">
                {film.kind}
              </span>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
