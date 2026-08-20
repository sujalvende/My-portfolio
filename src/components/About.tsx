import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.about-reveal'), {
        y: 26,
        opacity: 0,
        duration: 0.85,
        stagger: 0.13,
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
    <section ref={sectionRef} id="about" className="border-t border-stroke">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-24 items-start">
          {/* Left column */}
          <div>
            <span className="about-reveal block font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted mb-5">
              04 / About
            </span>
            <h2 className="about-reveal font-serif text-[clamp(30px,4vw,46px)] leading-[1.15] text-ink mb-8">
              A little about me.
            </h2>

            {/* Location detail */}
            <div className="about-reveal border-t border-stroke pt-6">
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-2">
                Based in
              </p>
              <p className="font-sans text-[15px] text-ink-mid">
                Navi Mumbai, India
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <p className="about-reveal font-sans text-[16px] md:text-[18px] text-ink-mid leading-[1.72]">
              I'm Sujal Vende, a BSc IT student and developer from Navi Mumbai, focused on building modern web experiences. I work primarily with HTML, CSS, JavaScript, React and modern frontend tools, while continuing to expand into full-stack development.
            </p>
            <p className="about-reveal font-sans text-[16px] md:text-[18px] text-ink-muted leading-[1.72]">
              I enjoy taking an idea, understanding what it needs to accomplish, and turning it into something clear, useful and visually refined. I care about the quality of what I build — not just that it works, but that it feels right to use.
            </p>
            <p className="about-reveal font-sans text-[16px] md:text-[18px] text-ink-muted leading-[1.72]">
              Right now I'm looking for opportunities to work with people who have ideas worth building. If that's you, I'd like to hear about it.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
