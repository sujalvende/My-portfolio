import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.intro-reveal'), {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
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
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
          <div className="intro-reveal">
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              01 / Introduction
            </span>
          </div>

          <div>
            <h2 className="intro-reveal font-serif text-[clamp(26px,3.5vw,40px)] leading-[1.2] text-ink mb-7 max-w-[580px]">
              From an idea on paper to something people can actually use.
            </h2>
            <p className="intro-reveal font-sans text-[16px] md:text-[17px] text-ink-muted leading-[1.72] max-w-[520px]">
              I don't start with code. I start with the objective — what this needs to accomplish, who it's for, and what it should feel like. The design and development follow from there. The result is a website that works because it was understood first.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
