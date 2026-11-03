import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroPortraitSrc from '../imports/hero-portrait.png'

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
  startAnimation?: boolean
}

export default function Hero({ startAnimation = true }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const typographyRef = useRef<HTMLDivElement>(null)
  const portraitWrapRef = useRef<HTMLDivElement>(null)
  const portraitImgRef = useRef<HTMLImageElement>(null)
  const mobileImgRef = useRef<HTMLImageElement>(null)

  // ── Coordinated Entrance & Scroll-Driven Parallax ────────────────────────
  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reducedMotion) {
        section
          .querySelectorAll(
            '.hero-badge-reveal, .hero-title-mask, .hero-copy-reveal, .hero-cta-reveal, .hero-portrait-img, .scroll-indicator',
          )
          .forEach((el) => {
            ;(el as HTMLElement).style.opacity = '1'
            ;(el as HTMLElement).style.transform = 'none'
          })
        return
      }

      if (!startAnimation) {
        // Hold initial hidden states cleanly without any flash
        gsap.set(
          '.hero-badge-reveal, .hero-copy-reveal, .hero-cta-reveal, .scroll-indicator',
          { opacity: 0, y: 22 },
        )
        gsap.set('.hero-title-mask', { opacity: 0, yPercent: 110 })
        gsap.set('.hero-portrait-img', {
          opacity: 0,
          scale: 1.08,
          filter: 'brightness(0.9) contrast(0.95)',
        })
        return
      }

      // Entrance timeline — seamlessly timed as curtain lifts
      const enterTl = gsap.timeline({
        delay: 0.1,
        onComplete: () => {
          ScrollTrigger.refresh()
        },
      })

      // 1. Portrait image entrance with subtle scale settlement
      enterTl.to(
        '.hero-portrait-img',
        {
          scale: 1,
          opacity: 1,
          filter: 'brightness(0.98) saturate(0.96)',
          duration: 1.3,
          ease: 'power3.out',
        },
        0,
      )

      // 2. Identity badge reveal
      enterTl.to(
        '.hero-badge-reveal',
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        0.15,
      )

      // 3. Mask-based headline lines reveal (rising up from overflow hidden)
      enterTl.to(
        '.hero-title-mask',
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
        },
        0.25,
      )

      // 4. Supporting text reveal
      enterTl.to(
        '.hero-copy-reveal',
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
        0.55,
      )

      // 5. CTA buttons reveal
      enterTl.to(
        '.hero-cta-reveal',
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power2.out' },
        0.7,
      )

      // 6. Scroll indicator fade in
      enterTl.to(
        '.scroll-indicator',
        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
        0.95,
      )

      // ── Scroll-Driven Parallax Scrub (Reverses naturally on scroll-up) ───
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      })

      // Typography drifts upward and softens
      scrollTl.to(
        '.hero-typography',
        { y: -60, opacity: 0.15, ease: 'none' },
        0,
      )

      // Portrait has layered parallax depth
      scrollTl.to(
        '.hero-portrait-img',
        { y: -40, scale: 1.05, ease: 'none' },
        0,
      )

      // Ambient background glow drifts
      scrollTl.to(
        '.hero-ambient-glow',
        { y: 50, opacity: 0.3, ease: 'none' },
        0,
      )

      // CTAs and scroll indicator fade early
      scrollTl.to(
        '.hero-cta-wrap, .scroll-indicator',
        { opacity: 0, y: -20, ease: 'none' },
        0,
      )
    },
    { scope: sectionRef, dependencies: [startAnimation] },
  )

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden pt-[68px] md:pt-[84px] bg-ivory min-h-[100svh] lg:min-h-screen flex items-center"
      aria-label="Hero — Sujal Vende, Full-Stack Developer"
    >
      {/* Ambient background architectural lighting */}
      <div
        className="hero-ambient-glow absolute top-1/4 left-1/4 w-[480px] h-[480px] rounded-full pointer-events-none opacity-40 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(140, 115, 85, 0.15) 0%, rgba(249, 247, 244, 0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── DESKTOP LAYOUT ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-full min-h-[calc(100vh-84px)] items-center relative">
        {/* Left Side — Typography with mask-based line reveals */}
        <div
          ref={typographyRef}
          className="hero-typography relative z-10 w-[52%] max-w-[660px] pl-10 md:pl-16 lg:pl-20 xl:pl-24 pr-6 py-16 flex flex-col justify-center"
        >
          {/* Identity Label */}
          <div className="overflow-hidden mb-6">
            <p
              className="hero-badge-reveal font-sans uppercase tracking-[0.24em] text-ink-muted inline-flex items-center gap-2.5"
              style={{ fontSize: 11 }}
            >
              <span className="w-2 h-2 rounded-full bg-bronze/80 inline-block" />
              Sujal Vende &mdash; Full-Stack Developer
            </p>
          </div>

          {/* Main Headline with Masked Spans */}
          <h1
            className="font-serif text-ink mb-6"
            style={{
              fontSize: 'clamp(44px, 5.2vw, 76px)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
            }}
          >
            <span className="block overflow-hidden pb-1">
              <span className="hero-title-mask block">I turn ideas into</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="hero-title-mask block text-bronze italic">digital reality.</span>
            </span>
          </h1>

          {/* Supporting Copy */}
          <div className="overflow-hidden mb-10">
            <p
              className="hero-copy-reveal font-sans text-ink-muted"
              style={{
                fontSize: 17,
                lineHeight: 1.68,
                maxWidth: 460,
              }}
            >
              I build thoughtful websites and digital experiences for businesses, creators, and
              ideas that deserve to exist online.
            </p>
          </div>

          {/* CTAs */}
          <div className="hero-cta-wrap flex flex-wrap items-center gap-5">
            <a
              href="#work"
              className="hero-cta-reveal font-sans text-ink border border-ink/30 hover:border-ink hover:bg-ink hover:text-ivory inline-flex items-center gap-2.5 transition-all duration-300 shadow-2xs hover:shadow-md"
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: '14px 28px',
                letterSpacing: '0.02em',
              }}
            >
              View My Work
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                style={{ display: 'inline-block' }}
              >
                →
              </span>
            </a>
            <a
              href="#contact"
              data-cursor="talk"
              className="hero-cta-reveal font-sans text-ink-mid hover:text-ink inline-flex items-center gap-1.5 transition-colors duration-200"
              style={{ fontSize: 13, padding: '14px 18px' }}
            >
              Let's Talk
              <span style={{ display: 'inline-block' }}>→</span>
            </a>
          </div>
        </div>

        {/* Right Side — Editorial Photograph with layered masks */}
        <div
          ref={portraitWrapRef}
          className="hero-portrait-wrap absolute right-0 top-0 bottom-0 w-[54%] h-full overflow-hidden pointer-events-none select-none z-0"
        >
          {/* Soft Left Gradient Mask */}
          <div
            className="absolute inset-y-0 left-0 w-36 xl:w-48 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, #F9F7F4 0%, rgba(249,247,244,0.85) 40%, rgba(249,247,244,0) 100%)',
            }}
          />

          {/* Soft Bottom Gradient Mask */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, #F9F7F4 0%, rgba(249,247,244,0) 100%)',
            }}
          />

          {/* Photograph */}
          <img
            ref={portraitImgRef}
            src={heroPortraitSrc}
            alt="Sujal Vende — Full-Stack Developer"
            className="hero-portrait-img w-full h-full object-cover object-[62%_center]"
            style={{
              willChange: 'transform, opacity, filter',
            }}
            loading="eager"
            draggable={false}
          />
        </div>
      </div>

      {/* ── MOBILE / TABLET LAYOUT ─────────────────────────────────────── */}
      <div className="lg:hidden w-full flex flex-col">
        {/* Portrait container with soft gradient mask */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: 'clamp(210px, 45svh, 420px)',
          }}
        >
          <img
            ref={mobileImgRef}
            src={heroPortraitSrc}
            alt="Sujal Vende — Full-Stack Developer"
            className="hero-portrait-img w-full h-full object-cover"
            style={{
              objectPosition: '55% 18%',
              willChange: 'transform, opacity',
            }}
            loading="eager"
            draggable={false}
          />
          {/* Bottom fade into ivory content area */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, #F9F7F4 0%, rgba(249,247,244,0) 100%)',
            }}
          />
        </div>

        {/* Typography Below Portrait */}
        <div className="px-6 pt-5 pb-12 flex flex-col justify-center">
          <div className="overflow-hidden mb-3">
            <p
              className="hero-badge-reveal font-sans uppercase tracking-[0.22em] text-ink-muted inline-flex items-center gap-2"
              style={{ fontSize: 10 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-bronze inline-block" />
              Sujal Vende &mdash; Full-Stack Developer
            </p>
          </div>

          <h1
            className="font-serif text-ink mb-4"
            style={{
              fontSize: 'clamp(32px, 8vw, 52px)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
          >
            <span className="block overflow-hidden">
              <span className="hero-title-mask block">I turn ideas into</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="hero-title-mask block text-bronze italic">digital reality.</span>
            </span>
          </h1>

          <div className="overflow-hidden mb-7">
            <p
              className="hero-copy-reveal font-sans text-ink-muted"
              style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 440 }}
            >
              I build thoughtful websites and digital experiences for businesses, creators, and
              ideas that deserve to exist online.
            </p>
          </div>

          {/* CTAs */}
          <div className="hero-cta-wrap flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="hero-cta-reveal font-sans text-ivory bg-ink border border-ink hover:bg-ink-mid hover:border-ink-mid transition-all duration-200 inline-flex items-center gap-2"
              style={{ fontSize: 13, fontWeight: 500, padding: '13px 24px', minHeight: 46 }}
            >
              View My Work →
            </a>
            <a
              href="#contact"
              className="hero-cta-reveal font-sans text-ink border border-ink/25 hover:border-ink hover:bg-ink hover:text-ivory transition-all duration-200 inline-flex items-center gap-1.5"
              style={{ fontSize: 13, padding: '13px 20px', minHeight: 46 }}
            >
              Let's Talk →
            </a>
          </div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ────────────────────────────────────────────── */}
      <div
        className="scroll-indicator hidden md:flex absolute bottom-7 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      >
        <div
          style={{
            width: 1,
            height: 32,
            background: 'linear-gradient(to bottom, transparent, rgba(140, 115, 85, 0.7))',
            animation: 'scrollPulse 2.2s ease-in-out infinite',
          }}
        />
        <span className="font-sans uppercase tracking-[0.24em] text-ink-muted text-[8px]">
          Scroll
        </span>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.7); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1.1); transform-origin: top; }
        }
      `}</style>
    </section>
  )
}
