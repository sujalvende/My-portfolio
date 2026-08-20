import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    number: '01',
    title: 'OSD Coaching Classes',
    url: 'https://osd-couching-classes.vercel.app',
    description:
      'A professional coaching-class website designed to present information clearly, build trust with students and parents, and create a strong online presence for a growing educational institution.',
    tags: ['Web Design', 'Development', '2026'],
    built: [
      'Responsive interface across all devices',
      'Clear information architecture',
      'Trust-building design for parents & students',
      'Performance-optimised frontend',
    ],
    image:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1400&h=900&fit=crop&auto=format&q=80',
    imageAlt: 'Study environment with books and warm lighting',
  },
  {
    number: '02',
    title: 'Skill Bridge',
    url: 'https://skill-bridge-prototype.vercel.app',
    description:
      'A learning and career-oriented web experience focused on connecting users with useful skills and opportunities through a clean, accessible, and purposeful interface.',
    tags: ['Web Application', 'UI / UX', '2026'],
    built: [
      'Intuitive navigation and user flows',
      'Accessible, responsive frontend',
      'Clean component structure',
      'Focused user experience design',
    ],
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&h=900&fit=crop&auto=format&q=80',
    imageAlt: 'Laptop with code on screen in a clean workspace',
  },
]

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const pinWrapperRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeIdx, setActiveIdx] = useState(0)

  // ── Unified Master Timeline with Depth-of-Field Blur (No Darkening) ───────
  useEffect(() => {
    const section = sectionRef.current
    const pinWrapper = pinWrapperRef.current
    if (!section || !pinWrapper) return

    const isMobile = window.innerWidth < 1024
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isMobile || reducedMotion) return

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]

    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.from(headerRef.current.querySelectorAll('.work-header-reveal'), {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        })
      }

      // Master Pinned Timeline
      const totalScroll = window.innerHeight * 1.35 * (projects.length - 1)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapper,
          start: 'center center',
          end: `+=${totalScroll}`,
          pin: section,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              projects.length - 1,
              Math.floor(self.progress * projects.length * 0.999),
            )
            setActiveIdx(idx)
          },
        },
      })

      // Layered Upward Stacking with Smooth Depth-of-Field Blur
      cards.forEach((card, i) => {
        if (i === 0) return

        const stepTime = (i - 1) * 1.5

        // Incoming project slides smoothly upward — always crisp and sharp
        tl.fromTo(
          card,
          {
            yPercent: 115,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
          },
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power1.inOut',
            duration: 1.5,
          },
          stepTime,
        )

        // Previous project card softly blurs (0px → 8px) — NO darkening
        tl.fromTo(
          cards[i - 1],
          {
            filter: 'blur(0px)',
            scale: 1,
            opacity: 1,
          },
          {
            filter: 'blur(8px)',
            scale: 0.96,
            opacity: 0.85,
            ease: 'power1.inOut',
            duration: 1.5,
          },
          stepTime,
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="border-t border-stroke py-14 lg:py-0 lg:min-h-screen lg:flex lg:flex-col lg:justify-center bg-ivory"
    >
      <div className="max-w-[1200px] w-full mx-auto px-6 md:px-10 xl:px-12">
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="mb-8 lg:mb-10 flex items-end justify-between"
        >
          <div>
            <span className="work-header-reveal block font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted mb-3">
              02 / Selected Work
            </span>
            <h2
              className="work-header-reveal font-serif text-ink leading-[1.12]"
              style={{ fontSize: 'clamp(28px, 3.8vw, 46px)' }}
            >
              A few things I've built.
            </h2>
          </div>

          {/* Progress indicator */}
          <div
            className="hidden lg:flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.18em]"
            aria-label={`Project ${activeIdx + 1} of ${projects.length}`}
          >
            {projects.map((p, i) => (
              <span
                key={p.number}
                className={`transition-colors duration-300 ${
                  i === activeIdx ? 'text-ink font-medium' : 'text-ink-muted/40'
                }`}
              >
                {p.number}
              </span>
            ))}
          </div>
        </div>

        {/* ── DESKTOP: Centered Floating Cards Stage ─────────────────────── */}
        <div
          ref={pinWrapperRef}
          className="hidden lg:block relative w-full h-[66vh] min-h-[520px] max-h-[640px]"
        >
          {projects.map((project, i) => (
            <div
              key={project.number}
              ref={(el) => {
                cardsRef.current[i] = el
                if (el) {
                  el.style.zIndex = String(i + 1)
                  el.style.willChange = 'transform, filter'
                }
              }}
              className="absolute inset-0 bg-[#FAF8F5] border border-stroke/90 rounded-2xl overflow-hidden shadow-[0_16px_44px_rgba(13,12,11,0.06)] grid grid-cols-[13fr_11fr] transition-[filter] duration-200"
            >
              {/* Left — Clickable Cover Image */}
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="project"
                className="relative block h-full w-full overflow-hidden group border-r border-stroke/60"
                aria-label={`Open ${project.title} live demo in new tab`}
              >
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-all duration-300 flex items-end justify-end p-6">
                  <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-ink/80 px-3.5 py-2 rounded">
                    View Project ↗
                  </span>
                </div>
              </a>

              {/* Right — Project Details */}
              <div className="flex flex-col justify-between p-8 xl:p-10 overflow-y-auto">
                <div>
                  {/* Number & Subtitle */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                      {project.number}
                    </span>
                    <span className="w-6 h-px bg-stroke inline-block" />
                    <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      Featured Project
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-serif text-ink leading-[1.15] mb-4"
                    style={{ fontSize: 'clamp(24px, 2.3vw, 34px)' }}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-[14px] xl:text-[15px] text-ink-muted leading-[1.7] mb-5">
                    {project.description}
                  </p>

                  {/* What I built */}
                  <div className="mb-5">
                    <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink-muted mb-2.5">
                      What I built
                    </p>
                    <ul className="space-y-1.5">
                      {project.built.map((item) => (
                        <li
                          key={item}
                          className="font-sans text-[12px] xl:text-[13px] text-ink-mid flex items-start gap-2"
                        >
                          <span className="text-bronze mt-px shrink-0">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar: Tags + Direct CTA */}
                <div className="pt-5 border-t border-stroke/60 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans text-[10px] uppercase tracking-[0.16em] text-ink-muted border border-stroke px-2.5 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[13px] font-medium text-ink hover:text-bronze transition-colors duration-200 inline-flex items-center gap-1.5 shrink-0"
                  >
                    View Project <span className="inline-block">↗</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MOBILE / TABLET: Refined stacked vertical cards ──────────────── */}
        <div className="lg:hidden space-y-6">
          {projects.map((project) => (
            <div
              key={project.number}
              className="bg-[#FAF8F5] border border-stroke rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(13,12,11,0.04)]"
            >
              {/* Clickable Cover Image */}
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative overflow-hidden"
                style={{ aspectRatio: '16/10' }}
                aria-label={`Open ${project.title}`}
              >
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </a>

              {/* Content */}
              <div className="p-6 pb-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                    {project.number}
                  </span>
                  <span className="w-5 h-px bg-stroke inline-block" />
                  <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    Featured Project
                  </span>
                </div>

                <h3 className="font-serif text-[22px] text-ink mb-3 leading-[1.18]">
                  {project.title}
                </h3>

                <p className="font-sans text-[14px] text-ink-muted leading-[1.68] mb-4">
                  {project.description}
                </p>

                {/* What I built — restored for mobile parity with desktop */}
                <div className="mb-5">
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink-muted mb-2.5">
                    What I built
                  </p>
                  <ul className="space-y-1.5">
                    {project.built.map((item) => (
                      <li
                        key={item}
                        className="font-sans text-[13px] text-ink-mid flex items-start gap-2"
                      >
                        <span className="text-bronze mt-px shrink-0">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags + CTA */}
                <div className="pt-4 border-t border-stroke/60 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans text-[10px] uppercase tracking-[0.16em] text-ink-muted border border-stroke px-2.5 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[13px] font-medium text-ink inline-flex items-center gap-1.5 border-b border-ink/30 pb-0.5 shrink-0"
                  >
                    View Project ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
