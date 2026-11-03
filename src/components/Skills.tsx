import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedDivider from './AnimatedDivider'

gsap.registerPlugin(ScrollTrigger)

const skillGroups = [
  {
    category: 'Frontend Core',
    items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'React 19', 'Tailwind CSS'],
  },
  {
    category: 'Creative & Motion',
    items: ['GSAP', 'ScrollTrigger', '@gsap/react', 'Lenis Scroll', 'Responsive Choreography'],
  },
  {
    category: 'Backend & Systems',
    items: ['Node.js', 'Express.js', 'REST APIs', 'Supabase', 'PostgreSQL'],
  },
  {
    category: 'Workflow & Tools',
    items: ['Git', 'GitHub', 'VS Code', 'Vite', 'Vercel', 'Figma'],
  },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = sectionRef.current
      if (!el) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) return

      gsap.fromTo(
        el.querySelectorAll('.skills-reveal'),
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.08,
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
    <section ref={sectionRef} id="skills" className="relative bg-ivory overflow-hidden">
      <AnimatedDivider />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
          <div className="skills-reveal">
            <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-ink-muted inline-flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-bronze/70" />
              05 / Skills & Tools
            </span>
            <h2 className="font-serif text-[clamp(28px,3.2vw,40px)] leading-[1.18] text-ink mb-4">
              Tools I work with.
            </h2>
            <p className="font-sans text-[14px] text-ink-muted leading-[1.65] max-w-[300px]">
              Practical, battle-tested modern tools chosen for reliability, speed, and refined frontend execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
            {skillGroups.map((group) => (
              <div
                key={group.category}
                className="skills-reveal border-t border-stroke pt-7 pb-8 pr-0 sm:pr-4"
              >
                <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-bronze font-semibold mb-5 flex items-center justify-between">
                  <span>{group.category}</span>
                  <span className="text-[9px] text-ink-muted/50 font-mono">({group.items.length})</span>
                </p>
                <ul className="space-y-3">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="group font-sans text-[14px] text-ink-mid transition-all duration-200 hover:text-ink hover:translate-x-1 flex items-center gap-2 cursor-default"
                    >
                      <span className="w-1 h-1 rounded-full bg-ink/20 group-hover:bg-bronze transition-colors" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
