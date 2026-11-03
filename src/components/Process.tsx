import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedDivider from './AnimatedDivider'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    title: 'Understand',
    tagline: 'Strategy & Objectives',
    description:
      'Before writing a single line of code, I understand the core idea, the target audience, and the actual problem that needs solving. Everything follows from clarity.',
  },
  {
    number: '02',
    title: 'Build',
    tagline: 'Architecture & Craft',
    description:
      'I turn the concept into a responsive, accessible, and fast digital product — harmonizing modular structure, typography, and frontend choreography.',
  },
  {
    number: '03',
    title: 'Refine',
    tagline: 'Polish & Performance',
    description:
      'The micro-details matter. I polish interaction timings, motion physics, mobile responsiveness, and performance to ensure the experience feels world-class.',
  },
]

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = sectionRef.current
      if (!el) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) return

      gsap.fromTo(
        el.querySelectorAll('.process-reveal'),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative bg-ivory overflow-hidden">
      <AnimatedDivider />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
          <div className="process-reveal">
            <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-ink-muted inline-flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-bronze/70" />
              06 / Process
            </span>
            <h2 className="font-serif text-[clamp(28px,3.2vw,40px)] leading-[1.18] text-ink mb-4">
              How I approach a project.
            </h2>
            <p className="font-sans text-[14px] text-ink-muted leading-[1.65] max-w-[300px]">
              A structured, transparent workflow ensuring every milestone is intentional and clearly delivered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
            {steps.map((step) => (
              <div
                key={step.number}
                className="process-reveal group border-t border-stroke pt-8 pb-9 pr-0 sm:pr-8 transition-colors duration-300 hover:bg-white/40 p-4 -ml-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-[18px] italic text-bronze font-medium">
                    {step.number}
                  </span>
                  <span className="font-sans text-[9px] uppercase tracking-[0.18em] text-ink-muted/70">
                    {step.tagline}
                  </span>
                </div>
                <h3 className="font-serif text-[22px] md:text-[24px] text-ink mb-3 group-hover:text-bronze transition-colors duration-200">
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
