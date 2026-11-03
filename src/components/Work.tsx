import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedDivider from './AnimatedDivider'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    number: '01',
    title: 'Sky Events',
    posterTitle: ['SKY', 'EVENTS'],
    url: 'https://skyevents-website.vercel.app',
    meta: 'LUXURY CELEBRATIONS · EVENTS',
    description:
      'A luxury wedding, celebration & corporate event management platform designed with calm, editorial precision from the initial mood board to the final guest.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&h=900&fit=crop&auto=format&q=80',
    imageAlt: 'Opulent luxury evening wedding celebration with illuminated chandeliers and golden candlelight',
    theme: 'bg-[#EDE4DC]',
    accent: '#B08E66',
  },
  {
    number: '02',
    title: 'OSD Coaching Classes',
    posterTitle: ['OSD', 'COACHING'],
    url: 'https://osd-couching-classes.vercel.app',
    meta: 'WEB DEVELOPMENT · EDUCATION',
    description:
      'A professional digital presence for a coaching business, designed to make academic streams clearer and build parent trust online.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&h=900&fit=crop&auto=format&q=80',
    imageAlt: 'Students in a focused classroom session at Om Sai Datta Classes',
    theme: 'bg-[#DCE4DE]',
    accent: '#6A8A73',
  },
  {
    number: '03',
    title: 'Salon Hair Style',
    posterTitle: ['SALON', 'HAIR'],
    url: 'https://salon-hair-style.vercel.app',
    meta: 'WEB DEVELOPMENT · BEAUTY',
    description:
      'An elegant booking and showcase website for a premium hair salon, blending refined aesthetics with a seamless client reservation experience.',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1400&h=900&fit=crop&auto=format&q=80',
    imageAlt: 'Stylist at work in a modern luxury hair salon',
    theme: 'bg-[#F0E6E2]',
    accent: '#B37D70',
  },
  {
    number: '04',
    title: 'Skill Bridge',
    posterTitle: ['SKILL', 'BRIDGE'],
    url: 'https://skill-bridge-prototype.vercel.app',
    meta: 'WEB DEVELOPMENT · DIGITAL PLATFORM',
    description:
      'A learning-focused digital experience built around making mentorship opportunities and peer skills easier to discover and exchange.',
    image: 'https://images.unsplash.com/photo-1580894732930-0babd100d356?w=1400&h=900&fit=crop&auto=format&q=80',
    imageAlt: 'Learner using the Skill Bridge collaborative learning experience',
    theme: 'bg-[#DDE2EC]',
    accent: '#5E7399',
  },
  {
    number: '05',
    title: 'Travel Agency',
    posterTitle: ['TRAVEL', 'AGENCY'],
    url: 'https://traveling-agency-website-seven.vercel.app',
    meta: 'WEB DEVELOPMENT · TRAVEL',
    description:
      'A vibrant travel and pilgrimage package platform that inspires exploration and simplifies the journey from regional discovery to instant WhatsApp booking.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&h=900&fit=crop&auto=format&q=80',
    imageAlt: 'Scenic travel destination landscape at golden hour',
    theme: 'bg-[#D8E8EE]',
    accent: '#528294',
  },
  {
    number: '06',
    title: 'PS PRO Gaming',
    posterTitle: ['PS PRO', 'GAMING'],
    url: 'https://advance-admin-panel-gaming-cafe.vercel.app',
    meta: 'WEB DEVELOPMENT · GAMING',
    description:
      'A bold, immersive platform for a PS5, Sim Racing & VR gaming café — featuring live player session booking and an advanced operations admin dashboard.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400&h=900&fit=crop&auto=format&q=80',
    imageAlt: 'Immersive gaming setup with vibrant RGB lighting',
    theme: 'bg-[#D6D8E8]',
    accent: '#5A5E8C',
  },
]

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const desktopCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeIdx, setActiveIdx] = useState(0)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // ── Header reveal with mask ──
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      headerTl.fromTo(
        headerRef.current?.querySelectorAll('.work-header-reveal') || [],
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power2.out' },
      )

      if (reducedMotion) return

      // ── Desktop Pinned Deck Stacking Animation ──
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const cards = desktopCardsRef.current.filter(Boolean) as HTMLDivElement[]
        if (cards.length < 2) return

        const totalScroll = window.innerHeight * 1.2
        const stage = section.querySelector('.work-desktop-stage')
        if (!stage) return

        // Initial positions: first card at 0, subsequent stacked below
        cards.forEach((card, index) => {
          gsap.set(card, {
            yPercent: index === 0 ? 0 : 110,
            scale: 1,
            filter: 'blur(0px)',
            opacity: 1,
          })
        })

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'center center',
            end: `+=${totalScroll * (cards.length - 1)}`,
            pin: section,
            pinSpacing: true,
            scrub: 1.25,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const newIndex = Math.min(
                cards.length - 1,
                Math.floor(self.progress * cards.length * 0.999),
              )
              setActiveIdx(newIndex)
            },
          },
        })

        cards.forEach((card, index) => {
          if (index === 0) return
          const start = (index - 1) * 1.5

          // Current card enters smoothly from bottom
          timeline.to(
            card,
            {
              yPercent: 0,
              duration: 1.5,
              ease: 'power2.inOut',
            },
            start,
          )

          // Previous card recedes into depth with subtle blur and scale
          timeline.to(
            cards[index - 1],
            {
              filter: 'blur(6px)',
              scale: 0.95,
              yPercent: -4,
              opacity: 0.75,
              duration: 1.5,
              ease: 'power2.inOut',
            },
            start,
          )
        })
      })

      // ── Mobile Staggered Parallax Cards ──
      mm.add('(max-width: 1023px)', () => {
        const mCards = mobileCardsRef.current.filter(Boolean) as HTMLDivElement[]
        mCards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 35, opacity: 0.4 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                end: 'top 50%',
                scrub: 0.6,
              },
            },
          )
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-ivory py-16 lg:py-0 lg:min-h-screen lg:flex lg:flex-col lg:justify-center overflow-hidden"
    >
      <AnimatedDivider />

      <div className="max-w-[1240px] w-full mx-auto px-5 md:px-10 xl:px-12 py-6 lg:py-12">
        {/* Header */}
        <div ref={headerRef} className="mb-8 lg:mb-10 flex items-end justify-between">
          <div>
            <span className="work-header-reveal block font-sans text-[10px] uppercase tracking-[0.24em] text-ink-muted mb-3 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
              02 / Selected Work
            </span>
            <h2
              className="work-header-reveal hidden lg:block font-serif text-ink leading-[1.12]"
              style={{ fontSize: 'clamp(30px, 3.8vw, 48px)' }}
            >
              A few things I've built.
            </h2>
            <h2
              className="work-header-reveal lg:hidden w-full max-w-full break-words font-serif text-[clamp(28px,8vw,38px)] leading-[1.08] text-ink"
            >
              A few things I've built.
            </h2>
          </div>

          {/* Desktop Project Index Indicator */}
          <div
            className="hidden lg:flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.2em]"
            aria-label={`Project ${activeIdx + 1} of ${projects.length}`}
          >
            {projects.map((project, index) => (
              <span
                key={project.number}
                className={`transition-all duration-300 ${
                  index === activeIdx
                    ? 'text-ink font-semibold border-b-2 border-bronze pb-0.5 scale-110'
                    : 'text-ink-muted/40 hover:text-ink-muted'
                }`}
              >
                {project.number}
              </span>
            ))}
          </div>
        </div>

        {/* Desktop Pinned Stage */}
        <div className="work-desktop-stage hidden lg:block relative w-full h-[68vh] min-h-[530px] max-h-[660px]">
          {projects.map((project, index) => (
            <PosterCard
              key={project.number}
              project={project}
              index={index}
              cardRef={(element) => {
                desktopCardsRef.current[index] = element
              }}
            />
          ))}
        </div>

        {/* Mobile Stage */}
        <div className="work-mobile-stage lg:hidden relative space-y-7">
          {projects.map((project, index) => (
            <PosterCard
              key={project.number}
              project={project}
              index={index}
              mobile
              cardRef={(element) => {
                mobileCardsRef.current[index] = element
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function PosterCard({
  project,
  index,
  mobile = false,
  cardRef,
}: {
  project: (typeof projects)[number]
  index: number
  mobile?: boolean
  cardRef: (element: HTMLDivElement | null) => void
}) {
  const handleClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('a')) return
    window.open(project.url, '_blank', 'noopener,noreferrer')
  }
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      window.open(project.url, '_blank', 'noopener,noreferrer')
    }
  }

  if (mobile) {
    return (
      <div
        ref={cardRef}
        role="link"
        tabIndex={0}
        data-cursor="project"
        aria-label={`Open ${project.title} live demo`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`${project.theme} relative w-full overflow-hidden rounded-[20px] border border-ink/10 shadow-[0_12px_32px_rgba(13,12,11,0.08)]`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.2em] text-ink-mid">
            <span>{project.meta}</span>
            <span className="font-mono text-bronze font-bold">{project.number}</span>
          </div>

          <h3 className="text-[clamp(26px,6.8vw,34px)] font-serif font-medium uppercase leading-[0.9] tracking-[-0.02em] text-ink">
            {project.posterTitle.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h3>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="block aspect-[16/10] overflow-hidden rounded-[14px] border border-white/60 shadow-[0_10px_24px_rgba(13,12,11,0.12)] my-1"
            aria-label={`Open ${project.title} live demo in new tab`}
          >
            <img
              src={project.image}
              alt={project.imageAlt}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              loading="lazy"
            />
          </a>

          <p className="max-w-[440px] font-sans text-[13px] leading-[1.58] text-ink-mid/85">
            {project.description}
          </p>

          <div className="pt-1">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex min-h-[44px] w-fit items-center border-b border-ink/50 pb-1 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ink hover:border-ink hover:text-bronze transition-colors"
              aria-label={`View ${project.title} project`}
            >
              View Project ↗
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      role="link"
      tabIndex={0}
      data-cursor="project"
      aria-label={`Open ${project.title} live demo`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`absolute inset-0 ${project.theme} overflow-hidden rounded-[24px] border border-ink/10 shadow-[0_24px_60px_rgba(13,12,11,0.12)] cursor-pointer group`}
      style={{ zIndex: index + 1, willChange: 'transform, filter, opacity' }}
    >
      <div className="absolute inset-0 p-8 sm:p-10 lg:p-12 xl:p-14">
        <div className="relative z-20 flex h-full flex-col justify-between">
          {/* Card Top Strip */}
          <div className="flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.22em] text-ink-mid">
            <span className="inline-flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: project.accent }}
              />
              {project.meta}
            </span>
            <span className="font-mono text-bronze font-bold text-xs">{project.number}</span>
          </div>

          {/* Typography */}
          <div className="max-w-[46%] pb-4">
            <p className="mb-4 max-w-[320px] font-sans text-[13px] leading-[1.6] text-ink-mid/80">
              {project.description}
            </p>
            <h3 className="text-[clamp(44px,6.2vw,92px)] font-serif font-medium uppercase leading-[0.82] tracking-[-0.04em] text-ink transition-transform duration-300 group-hover:translate-x-1">
              {project.posterTitle.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
          </div>

          {/* Card Action */}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="relative z-30 inline-flex min-h-[44px] w-fit items-center border-b border-ink/40 pb-1 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:border-ink hover:text-bronze transition-all"
            aria-label={`View ${project.title} project`}
          >
            View Project ↗
          </a>
        </div>

        {/* Right Side Card Image Showcase with elegant shadow & hover tilt */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="absolute right-[5%] top-[10%] h-[78%] w-[48%] z-10 block overflow-hidden rounded-[16px] border border-white/60 shadow-[0_20px_45px_rgba(13,12,11,0.16)] transition-all duration-500 group-hover:shadow-[0_26px_55px_rgba(13,12,11,0.22)]"
          aria-label={`Open ${project.title} live demo in new tab`}
        >
          <img
            src={project.image}
            alt={project.imageAlt}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            loading="lazy"
          />
        </a>
      </div>
    </div>
  )
}
