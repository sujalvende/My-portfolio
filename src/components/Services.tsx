import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedDivider from './AnimatedDivider'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    number: '01',
    title: 'Websites',
    description:
      'Professional websites for businesses, professionals, and organisations that need a clear, credible, and aesthetically elevated online presence.',
  },
  {
    number: '02',
    title: 'Web Applications',
    description:
      'Functional digital products built around real requirements, practical workflows, and a straightforward, accessible user experience.',
  },
  {
    number: '03',
    title: 'UI / UX Implementation',
    description:
      'Responsive design systems turned into pixel-perfect, highly responsive interfaces that feel natural across every screen size.',
  },
  {
    number: '04',
    title: 'Digital Experiences & Motion',
    description:
      'Thoughtful micro-interactions, smooth GSAP animations, and frontend choreography that make the product feel considered and truly alive.',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = sectionRef.current
      if (!el) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) return

      gsap.fromTo(
        el.querySelectorAll('.service-reveal'),
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
    <section ref={sectionRef} id="services" className="relative bg-ivory overflow-hidden">
      <AnimatedDivider />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
          <div className="service-reveal">
            <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-ink-muted inline-flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-bronze/70" />
              03 / What I Build
            </span>
            <h2 className="font-serif text-[clamp(28px,3.2vw,40px)] leading-[1.18] text-ink">
              The work I take on.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {services.map((service) => (
              <div
                key={service.number}
                className="service-reveal group border-t border-stroke pt-8 pb-9 pr-0 sm:pr-8 transition-colors duration-300 hover:bg-white/40 p-4 -ml-4"
              >
                <span className="font-mono text-[11px] font-bold text-bronze uppercase tracking-[0.22em] block mb-4 transition-transform duration-300 group-hover:translate-x-1">
                  {service.number}
                </span>
                <h3 className="font-serif text-[21px] md:text-[23px] text-ink mb-3 group-hover:text-bronze transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="font-sans text-[14px] md:text-[15px] text-ink-muted leading-[1.72]">
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
