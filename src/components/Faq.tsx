import Icon from './Icon'
import { Eyebrow, Section, SectionTitle } from './ui'
import { FAQS } from '../data/site'
import { useReveal } from '../lib/motion'

/** Native <details> — keyboard and screen readers get it for free. */
export default function Faq() {
  const ref = useReveal<HTMLElement>({ stagger: 0.07 })

  return (
    <Section ref={ref}>
      <Eyebrow>Before you ask</Eyebrow>
      <SectionTitle>Questions</SectionTitle>

      <div className="mt-12 max-w-4xl divide-y divide-line/70 border-y border-line/70">
        {FAQS.map((f) => (
          <details key={f.q} className="group reveal py-5">
            <summary className="flex list-none items-center justify-between gap-6 text-left [&::-webkit-details-marker]:hidden">
              <span className="text-[1rem] font-medium text-bone sm:text-[1.08rem]">{f.q}</span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-amber transition-all duration-300 group-open:rotate-45 group-open:border-amber">
                <Icon name="plus" className="size-3.5" />
              </span>
            </summary>
            <p className="mt-3 max-w-3xl pr-14 text-[0.95rem] leading-[1.7] text-ash">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
