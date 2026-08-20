import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    number: '01',
    title: 'Websites',
    description:
      'Modern, responsive websites for businesses, professionals, and organisations that need a clear and credible online presence.',
  },
  {
    number: '02',
    title: 'Web Applications',
    description:
      'Interactive web applications built around practical functionality, clean interfaces, and straightforward user experience.',
  },
  {
    number: '03',
    title: 'UI / UX Implementation',
    description:
      'Turning designs, wireframes, and ideas into polished, pixel-considered, responsive interfaces that work as intended.',
  },
  {
    number: '04',
    title: 'Digital Experiences',
    description:
      'Thoughtful interactions, smooth animations, and frontend experiences that make the product feel considered and alive.',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.service-reveal'), {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
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
    <section ref={sectionRef} id="services" className="border-t border-stroke">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
          <div className="service-reveal">
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted block mb-5">
              03 / What I Build
            </span>
            <h2 className="font-serif text-[clamp(26px,3vw,36px)] leading-[1.2] text-ink">
              The work I take on.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {services.map((service) => (
              <div
                key={service.number}
                className="service-reveal border-t border-stroke pt-7 pb-8 sm:pr-8"
              >
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted block mb-5">
                  {service.number}
                </span>
                <h3 className="font-serif text-[20px] md:text-[22px] text-ink mb-3">
                  {service.title}
                </h3>
                <p className="font-sans text-[14px] md:text-[15px] text-ink-muted leading-[1.7]">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
