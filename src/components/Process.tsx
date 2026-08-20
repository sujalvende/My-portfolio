import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    title: 'Understand',
    description:
      'Before writing a line of code, I understand the idea, the audience, and the actual problem that needs solving. Everything follows from clarity.',
  },
  {
    number: '02',
    title: 'Build',
    description:
      'I turn the concept into a responsive, functional and polished product — working through structure, design, and implementation together.',
  },
  {
    number: '03',
    title: 'Refine',
    description:
      'The details matter. I improve interactions, responsiveness, performance, and the small things that make the difference between good and excellent.',
  },
]

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.process-reveal'), {
        y: 24,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 78%',
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="border-t border-stroke">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
          <div className="process-reveal">
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted block mb-5">
              06 / Process
            </span>
            <h2 className="font-serif text-[clamp(26px,3vw,36px)] leading-[1.2] text-ink">
              How I approach a project.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
            {steps.map((step) => (
              <div
                key={step.number}
                className="process-reveal border-t border-stroke pt-7 pb-8 pr-0 sm:pr-8"
              >
                <span className="font-serif text-[13px] italic text-bronze block mb-5">
                  {step.number}
                </span>
                <h3 className="font-serif text-[20px] md:text-[22px] text-ink mb-3">
                  {step.title}
                </h3>
                <p className="font-sans text-[14px] md:text-[15px] text-ink-muted leading-[1.72]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
