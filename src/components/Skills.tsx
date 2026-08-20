import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skillGroups = [
  {
    category: 'Frontend',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'],
  },
  {
    category: 'Animation',
    items: ['GSAP', 'ScrollTrigger'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js'],
  },
  {
    category: 'Tools',
    items: ['Git', 'GitHub', 'VS Code'],
  },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.skills-reveal'), {
        y: 22,
        opacity: 0,
        duration: 0.8,
        stagger: 0.09,
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
    <section ref={sectionRef} id="skills" className="border-t border-stroke">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
          <div className="skills-reveal">
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted block mb-5">
              05 / Skills
            </span>
            <h2 className="font-serif text-[clamp(26px,3vw,36px)] leading-[1.2] text-ink">
              Tools I work with.
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
            {skillGroups.map((group) => (
              <div key={group.category} className="skills-reveal border-t border-stroke pt-6 pb-8 pr-0 sm:pr-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-5">
                  {group.category}
                </p>
                <ul className="space-y-2.5">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="font-sans text-[14px] text-ink-mid"
                    >
                      {skill}
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
