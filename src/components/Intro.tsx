import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedDivider from './AnimatedDivider'

gsap.registerPlugin(ScrollTrigger)

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) return

      // Entrance reveal: triggers when section enters viewport, STAYS visible when scrolling down past it
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.fromTo(
        '.intro-label-reveal',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      )
        .fromTo(
          '.intro-title-mask',
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.3',
        )
        .fromTo(
          '.intro-body-reveal',
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.5',
        )

      // Subtle scroll scrub parallax effect through the section
      gsap.to('.intro-parallax-text', {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="intro" className="relative bg-ivory">
      {/* Scroll-scrubbed animated divider line */}
      <AnimatedDivider />

      <div
        ref={contentRef}
        className="intro-parallax-text max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-10 lg:gap-20 items-start">
          {/* Label — visible only on md+ as its own column */}
          <div className="intro-label-reveal hidden md:block">
            <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-ink-muted inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bronze/70" />
              01 / Introduction
            </span>
          </div>

          <div>
            {/* Mobile-only label inline above heading */}
            <span className="intro-label-reveal md:hidden block font-sans text-[10px] uppercase tracking-[0.24em] text-ink-muted mb-5">
              01 / Introduction
            </span>

            {/* Headline with mask-based line animations */}
            <h2 className="font-serif text-[clamp(26px,3.8vw,44px)] leading-[1.18] text-ink mb-6 md:mb-8 max-w-[620px]">
              <span className="block overflow-hidden pb-1">
                <span className="intro-title-mask block">From an idea on paper</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="intro-title-mask block text-bronze italic">
                  to something people can actually use.
                </span>
              </span>
            </h2>

            <div className="overflow-hidden">
              <p className="intro-body-reveal font-sans text-[15px] md:text-[17px] text-ink-muted leading-[1.75] max-w-[540px]">
                I don't start with code. I start with the objective — what this needs to accomplish,
                who it's for, and what it should feel like. The design and development follow from there.
                The result is a digital experience that performs because it was understood first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
