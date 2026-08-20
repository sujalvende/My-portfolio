import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroPortraitSrc from '../imports/hero-portrait.png'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const typographyRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // ── Entrance Animation ──────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      section.querySelectorAll('.hero-reveal').forEach((el) => {
        ;(el as HTMLElement).style.opacity = '1'
      })
      return
    }

    const ctx = gsap.context(() => {
      // Portrait slides in subtly from right with gentle opacity fade
      gsap.from('.hero-portrait-wrap', {
        x: 40,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
        delay: 0.1,
      })

      // Typography staggers upward with refined editorial pacing
      gsap.from('.hero-reveal', {
        y: 45,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.25,
      })

      // Scroll indicator fades in
      gsap.from('.scroll-indicator', {
        opacity: 0,
        y: 10,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.4,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  // ── Subtle Scroll-Driven Parallax ────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Typography drifts upward gently
      tl.to(
        '.hero-typography',
        { y: -45, ease: 'none' },
        0,
      )

      // Portrait has very subtle parallax
      tl.to(
        '.hero-portrait-img',
        { y: -25, ease: 'none' },
        0,
      )

      // CTA fades out smoothly
      tl.to(
        '.hero-cta-wrap',
        { opacity: 0, y: -15, ease: 'none' },
        0,
      )

      // Scroll indicator fades out
      tl.to(
        '.scroll-indicator',
        { opacity: 0, ease: 'none', duration: 0.2 },
        0,
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden pt-[76px] md:pt-[84px] bg-ivory min-h-[92vh] lg:min-h-screen flex items-center"
      aria-label="Hero — Sujal Vende, Full-Stack Developer"
    >
      {/* ── DESKTOP LAYOUT ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-full min-h-[calc(100vh-84px)] items-center relative">
        {/* Left Side — Typography (Structured in the natural negative space) */}
        <div
          ref={typographyRef}
          className="hero-typography relative z-10 w-[52%] max-w-[660px] pl-10 md:pl-16 lg:pl-20 xl:pl-24 pr-6 py-16 flex flex-col justify-center"
        >
          {/* Identity Label */}
          <p
            className="hero-reveal font-sans uppercase tracking-[0.22em] text-ink-muted mb-8"
            style={{ fontSize: 10 }}
          >
            Sujal Vende &mdash; Full-Stack Developer
          </p>

          {/* Main Headline */}
          <h1
            className="hero-reveal font-serif text-ink"
            style={{
              fontSize: 'clamp(42px, 5.2vw, 74px)',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
            }}
          >
            I turn ideas into digital reality.
          </h1>

          {/* Supporting Copy */}
          <p
            className="hero-reveal font-sans text-ink-muted"
            style={{
              fontSize: 17,
              lineHeight: 1.68,
              maxWidth: 440,
              marginBottom: '2.75rem',
            }}
          >
            I build thoughtful websites and digital experiences for businesses,
            creators, and ideas that deserve to exist online.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="hero-cta-wrap hero-reveal flex flex-wrap items-center gap-5">
            <a
              href="#work"
              className="font-sans text-ink border border-ink/30 hover:border-ink hover:bg-ink hover:text-ivory inline-flex items-center gap-2.5 transition-all duration-250"
              style={{ fontSize: 13, fontWeight: 500, padding: '13px 26px', letterSpacing: '0.02em' }}
            >
              View My Work
              <span style={{ display: 'inline-block' }}>→</span>
            </a>
            <a
              href="#contact"
              data-cursor="talk"
              className="font-sans text-ink-mid hover:text-ink inline-flex items-center gap-1.5 transition-colors duration-200"
              style={{ fontSize: 13, padding: '13px 16px' }}
            >
              Let's Talk
              <span style={{ display: 'inline-block' }}>→</span>
            </a>
          </div>
        </div>

        {/* Right Side — Large Editorial Photograph */}
        <div
          ref={portraitRef}
          className="hero-portrait-wrap absolute right-0 top-0 bottom-0 w-[54%] h-full overflow-hidden pointer-events-none select-none z-0"
        >
          {/* Soft Left Gradient Mask — seamless transition from photo background into ivory */}
          <div
            className="absolute inset-y-0 left-0 w-36 xl:w-48 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, #F9F7F4 0%, rgba(249,247,244,0.8) 40%, rgba(249,247,244,0) 100%)',
            }}
          />

          {/* Soft Bottom Gradient Mask */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, #F9F7F4 0%, rgba(249,247,244,0) 100%)',
            }}
          />

          {/* Photograph */}
          <img
            src={heroPortraitSrc}
            alt="Sujal Vende — Full-Stack Developer"
            className="hero-portrait-img w-full h-full object-cover object-[62%_center]"
            style={{
              filter: 'brightness(0.98) saturate(0.96)',
            }}
            loading="eager"
            draggable={false}
          />
        </div>
      </div>

      {/* ── MOBILE / TABLET LAYOUT ─────────────────────────────────────── */}
      <div className="lg:hidden w-full flex flex-col">
        {/* Editorial Photograph at Top */}
        <div className="relative w-full h-[54vh] max-h-[500px] overflow-hidden">
          <img
            src={heroPortraitSrc}
            alt="Sujal Vende — Full-Stack Developer"
            className="w-full h-full object-cover object-[60%_20%]"
            style={{ filter: 'brightness(0.98) saturate(0.96)' }}
            loading="eager"
            draggable={false}
          />
          {/* Bottom fade into ivory content */}
          <div
            className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, #F9F7F4 0%, rgba(249,247,244,0) 100%)',
            }}
          />
        </div>

        {/* Typography Below */}
        <div className="px-6 py-8 pb-16 flex flex-col justify-center">
          <p
            className="hero-reveal font-sans uppercase tracking-[0.2em] text-ink-muted mb-4"
            style={{ fontSize: 10 }}
          >
            Sujal Vende &mdash; Full-Stack Developer
          </p>
          <h1
            className="hero-reveal font-serif text-ink"
            style={{
              fontSize: 'clamp(34px, 8.5vw, 50px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem',
            }}
          >
            I turn ideas into digital reality.
          </h1>
          <p
            className="hero-reveal font-sans text-ink-muted"
            style={{ fontSize: 15, lineHeight: 1.68, marginBottom: '2.25rem', maxWidth: 420 }}
          >
            I build thoughtful websites and digital experiences for businesses,
            creators, and ideas that deserve to exist online.
          </p>
          <div className="hero-cta-wrap hero-reveal flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="font-sans text-ink border border-ink/30 hover:border-ink hover:bg-ink hover:text-ivory transition-all duration-200 inline-flex items-center gap-2"
              style={{ fontSize: 13, fontWeight: 500, padding: '12px 22px' }}
            >
              View My Work →
            </a>
            <a
              href="#contact"
              className="font-sans text-ink-mid hover:text-ink transition-colors duration-200 inline-flex items-center gap-1"
              style={{ fontSize: 13, padding: '12px 14px' }}
            >
              Let's Talk →
            </a>
          </div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ────────────────────────────────────────────── */}
      <div
        ref={scrollIndicatorRef}
        className="scroll-indicator hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 pointer-events-none"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      >
        <div
          style={{
            width: 1,
            height: 28,
            background: 'linear-gradient(to bottom, transparent, rgba(110,106,102,0.5))',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}
        />
        <span
          className="font-sans uppercase tracking-[0.22em] text-ink-muted"
          style={{ fontSize: 8 }}
        >
          Scroll
        </span>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.35; transform: scaleY(0.85); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </section>
  )
}
