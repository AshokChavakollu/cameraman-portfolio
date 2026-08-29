import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Smooth scroll driven by Lenis, with ScrollTrigger kept in lockstep. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 1.4 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}

type RevealOptions = {
  selector?: string
  y?: number
  stagger?: number
  start?: string
  duration?: number
}

/**
 * Staggered scroll reveal for a section. Attach the returned ref to the section
 * and give any child the `reveal` class. Reduced motion: children just appear.
 */
export function useReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null)
  const { selector = '.reveal', y = 26, stagger = 0.08, start = 'top 82%', duration = 1 } = options

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = root.querySelectorAll<HTMLElement>(selector)
    if (!targets.length) return

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'expo.out',
          // Drop the inline transform when the reveal finishes. A lingering
          // matrix() keeps the element on its own compositing layer, and
          // Chrome then skips repaints for images that change inside it.
          clearProps: 'transform',
          scrollTrigger: { trigger: root, start },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [selector, y, stagger, start, duration])

  return ref
}

/** Counts a number up when the element scrolls into view. */
export function useCountUp(target: number, duration = 1.9) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const format = (n: number) => Math.round(n).toLocaleString('en-IN')

    if (prefersReducedMotion()) {
      el.textContent = format(target)
      return
    }

    const state = { value: 0 }
    el.textContent = '0'

    const ctx = gsap.context(() => {
      gsap.to(state, {
        value: target,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        onUpdate: () => {
          el.textContent = format(state.value)
        },
      })
    }, el)

    return () => ctx.revert()
  }, [target, duration])

  return ref
}

/** Parallax drift on scroll. Positive `strength` moves the element up. */
export function useParallax<T extends HTMLElement>(strength = 60) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: strength },
        {
          y: -strength,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [strength])

  return ref
}

/**
 * Pointer position normalised to -1..1 around the viewport centre, smoothed.
 * Used for the hero rig's head-tracking. Returns a ref, never re-renders.
 */
export function usePointer() {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (prefersReducedMotion()) return

    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return pointer
}
