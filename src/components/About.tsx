import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedDivider from './AnimatedDivider'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = sectionRef.current
      if (!el) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) return

      gsap.fromTo(
        el.querySelectorAll('.about-reveal'),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
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
    <section ref={sectionRef} id="about" className="relative bg-ivory overflow-hidden">
      <AnimatedDivider />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-24 items-start">
          {/* Left column */}
          <div>
            <span className="about-reveal block font-sans text-[10px] uppercase tracking-[0.24em] text-ink-muted mb-5 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bronze/70" />
              04 / About
            </span>
            <h2 className="about-reveal font-serif text-[clamp(32px,4vw,48px)] leading-[1.12] text-ink mb-8">
              A little about me.
            </h2>

            {/* Location detail */}
            <div className="about-reveal border-t border-stroke pt-6">
              <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted mb-2">
                Based in
              </p>
              <p className="font-sans text-[15px] text-ink font-medium">
                Navi Mumbai, India
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <p className="about-reveal font-sans text-[16px] md:text-[18px] text-ink leading-[1.74]">
              I'm Sujal Vende, a developer from Navi Mumbai focused on engineering modern, high-performance web experiences. I build with React, TypeScript, Next.js, and refined animation tools like GSAP, with deep focus on clean code and design systems.
            </p>
            <p className="about-reveal font-sans text-[16px] md:text-[18px] text-ink-muted leading-[1.74]">
              I enjoy taking an idea, understanding what it needs to accomplish, and turning it into something clear, useful and visually refined. I care about the quality of what I build — not just that it works, but that it feels effortless and right to use.
            </p>
            <p className="about-reveal font-sans text-[16px] md:text-[18px] text-ink-muted leading-[1.74]">
              Right now I'm looking for opportunities to collaborate with businesses, creators, and teams who have ideas worth bringing into digital reality.
            </p>

            {/* Resume CTA */}
            <div className="about-reveal border-t border-stroke pt-7 mt-2 flex flex-wrap items-center gap-5">
              <a
                href="/resume.pdf"
                download
                className="font-sans text-ink border border-ink/35 hover:border-ink hover:bg-ink hover:text-ivory inline-flex min-h-[46px] items-center gap-2.5 transition-all duration-250 text-[13px] font-medium tracking-[0.02em] px-6 py-3 shadow-2xs hover:shadow-md"
                aria-label="Download Sujal Vende's resume as a PDF"
              >
                Download Resume
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">↗</span>
              </a>
              <p className="font-sans text-[14px] text-ink-muted">
                Looking for technical background? View my resume.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
