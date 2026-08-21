import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    number: '01',
    title: 'OSD Coaching Classes',
    posterTitle: ['OSD', 'COACHING'],
    url: 'https://osd-couching-classes.vercel.app',
    meta: 'WEB DEVELOPMENT · DESIGN',
    description: 'A professional digital presence for a coaching business, designed to make information clearer and build trust online.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&h=900&fit=crop&auto=format&q=80',
    imageAlt: 'Students in a focused classroom session at Om Sai Datta Classes',
    theme: 'bg-[#DCE4DE]',
  },
  {
    number: '02',
    title: 'Skill Bridge',
    posterTitle: ['SKILL', 'BRIDGE'],
    url: 'https://skill-bridge-prototype.vercel.app',
    meta: 'WEB DEVELOPMENT · DIGITAL EXPERIENCE',
    description: 'A learning-focused digital experience built around making opportunities and skills easier to discover and use.',
    image: 'https://images.unsplash.com/photo-1580894732930-0babd100d356?w=1400&h=900&fit=crop&auto=format&q=80',
    imageAlt: 'Learner using the Skill Bridge learning experience',
    theme: 'bg-[#DDE2EC]',
  },
]

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const desktopCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 1023px)').matches
    const cards = (isMobile ? mobileCardsRef : desktopCardsRef).current.filter(Boolean) as HTMLDivElement[]

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.querySelectorAll('.work-header-reveal'), {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
        })
      }

      if (reducedMotion || isMobile || cards.length < 2) return

      const totalScroll = isMobile ? window.innerHeight * 0.9 : window.innerHeight * 1.35
      const stage = section.querySelector(isMobile ? '.work-mobile-stage' : '.work-desktop-stage')
      if (!stage) return

      cards.forEach((card, index) => {
        gsap.set(card, { yPercent: index === 0 ? 0 : 112 })
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: isMobile ? 'top 12%' : 'center center',
          end: `+=${totalScroll * (cards.length - 1)}`,
          pin: section,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setActiveIdx(Math.min(cards.length - 1, Math.floor(self.progress * cards.length * 0.999)))
          },
        },
      })

      cards.forEach((card, index) => {
        if (index === 0) return
        const start = (index - 1) * 1.5
        timeline.to(card, { yPercent: 0, duration: 1.5, ease: 'power1.inOut' }, start)
        timeline.to(cards[index - 1], { filter: 'blur(7px)', scale: 0.965, opacity: 0.82, duration: 1.5, ease: 'power1.inOut' }, start)
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="work" className="border-t border-stroke bg-ivory py-14 lg:py-0 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="max-w-[1200px] w-full mx-auto px-6 md:px-10 xl:px-12">
        <div ref={headerRef} className="mb-8 lg:mb-10 flex items-end justify-between">
          <div>
            <span className="work-header-reveal block font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted mb-3">02 / Selected Work</span>
            <h2 className="work-header-reveal hidden lg:block font-serif text-ink leading-[1.12]" style={{ fontSize: 'clamp(28px, 3.8vw, 46px)' }}>A few things I've built.</h2>
            <h2 className="work-header-reveal lg:hidden w-full max-w-full break-words font-serif text-[clamp(30px,8.5vw,40px)] leading-[1.05] text-ink" style={{ overflowWrap: 'break-word' }}>The work I take on.</h2>
          </div>
          <div className="hidden lg:flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.18em]" aria-label={`Project ${activeIdx + 1} of ${projects.length}`}>
            {projects.map((project, index) => <span key={project.number} className={index === activeIdx ? 'text-ink font-medium' : 'text-ink-muted/40'}>{project.number}</span>)}
          </div>
        </div>

        <div className="work-desktop-stage hidden lg:block relative w-full h-[66vh] min-h-[520px] max-h-[640px]">
          {projects.map((project, index) => <PosterCard key={project.number} project={project} index={index} cardRef={(element) => { desktopCardsRef.current[index] = element }} />)}
        </div>

        <div className="work-mobile-stage lg:hidden relative space-y-8">
          {projects.map((project, index) => <PosterCard key={project.number} project={project} index={index} mobile cardRef={(element) => { mobileCardsRef.current[index] = element }} />)}
        </div>
      </div>
    </section>
  )
}

function PosterCard({ project, index, mobile = false, cardRef }: {
  project: (typeof projects)[number]
  index: number
  mobile?: boolean
  cardRef: (element: HTMLDivElement | null) => void
}) {
  return (
    <div
      ref={cardRef}
      role="link"
      tabIndex={0}
      data-cursor="project"
      aria-label={`Open ${project.title} live demo`}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('a')) return
        window.open(project.url, '_blank', 'noopener,noreferrer')
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          window.open(project.url, '_blank', 'noopener,noreferrer')
        }
      }}
      className={`${mobile ? 'relative min-h-[680px] w-full' : 'absolute inset-0'} ${project.theme} overflow-hidden rounded-[22px] border border-ink/10 shadow-[0_22px_55px_rgba(13,12,11,0.12)]`}
      style={{ zIndex: index + 1, willChange: 'transform, filter' }}
    >
      <div className={`${mobile ? 'relative min-h-[680px] p-6' : 'absolute inset-0 p-6 sm:p-9 lg:p-12'}`}>
        <div className={`${mobile ? 'relative z-20 flex min-h-[632px] flex-col' : 'relative z-20 flex h-full flex-col justify-between'}`}>
          <div className="flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.2em] text-ink-mid">
            <span>{project.meta}</span>
            <span>{project.number}</span>
          </div>
          <div className={`${mobile ? 'relative z-20 mt-10 max-w-full pr-2' : 'max-w-[45%] pb-4'}`}>
            <p className="mb-4 max-w-[280px] font-sans text-[12px] leading-[1.55] text-ink-mid/75">{project.description}</p>
            <h3 className={`${mobile ? 'text-[clamp(44px,14vw,64px)]' : 'text-[clamp(40px,6vw,88px)]'} font-serif font-medium uppercase leading-[0.82] tracking-[-0.045em] text-ink`}>
              {project.posterTitle.map((line) => <span key={line} className="block">{line}</span>)}
            </h3>
          </div>
          <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className={`${mobile ? 'absolute bottom-0 left-0' : 'relative'} z-30 inline-flex min-h-[44px] w-fit items-center border-b border-ink/50 pb-1 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ink hover:border-ink`} aria-label={`View ${project.title} project`}>View Project ↗</a>
        </div>
        <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className={`absolute ${mobile ? 'inset-x-6 bottom-24 h-[36%]' : index === 0 ? 'right-[5%] top-[13%] h-[72%] w-[47%]' : 'right-[7%] top-[9%] h-[76%] w-[49%]'} z-10 block overflow-hidden rounded-[14px] border border-white/50 shadow-[0_16px_35px_rgba(13,12,11,0.16)]`} aria-label={`Open ${project.title} live demo in new tab`}>
          <img src={project.image} alt={project.imageAlt} className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]" loading="lazy" />
        </a>
      </div>
    </div>
  )
}
