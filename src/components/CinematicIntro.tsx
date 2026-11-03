import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface CinematicIntroProps {
  onStartReveal?: () => void
  onComplete?: () => void
}

export default function CinematicIntro({ onStartReveal, onComplete }: CinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [percent, setPercent] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const hasFinishedRef = useRef(false)

  useEffect(() => {
    // If reduced motion is requested, finish immediately
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsDone(true)
      onStartReveal?.()
      onComplete?.()
      return
    }

    const container = containerRef.current
    if (!container) return

    // Lock body scroll during intro
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const finishIntro = () => {
      if (hasFinishedRef.current) return
      hasFinishedRef.current = true

      const exitTl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = originalOverflow
          setIsDone(true)
          onComplete?.()
          // Recalculate all ScrollTrigger positions after curtain disappears
          requestAnimationFrame(() => {
            ScrollTrigger.refresh()
          })
        },
      })

      // 1. Trigger hero entrance as the curtain begins lifting
      exitTl.call(() => {
        onStartReveal?.()
      }, [], 0.1)

      // 2. Curtain glides smoothly upward with luxury theater easing
      exitTl.to(container, {
        yPercent: -100,
        duration: 1.1,
        ease: 'power4.inOut',
      }, 0)
    }

    // Sequence timeline: ~2.8s total deliberate pacing
    const mainTl = gsap.timeline({
      delay: 0.1,
      onComplete: finishIntro,
    })

    // Monogram & status reveal
    mainTl.fromTo(
      '.intro-badge',
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
      0,
    )

    // Name mask reveal (rising from overflow hidden)
    mainTl.fromTo(
      '.intro-mask-text',
      { yPercent: 120, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.95,
        ease: 'power3.out',
      },
      0.3,
    )

    // Hairline expands across center
    mainTl.fromTo(
      '.intro-hairline',
      { scaleX: 0, transformOrigin: 'center center' },
      {
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      0.65,
    )

    // Subtitle letter-spacing & fade
    mainTl.fromTo(
      '.intro-subtitle',
      { opacity: 0, y: 12, letterSpacing: '0.12em' },
      {
        opacity: 1,
        y: 0,
        letterSpacing: '0.26em',
        duration: 0.85,
        ease: 'power2.out',
      },
      0.8,
    )

    // Counter animation 0% -> 100%
    const counterObj = { value: 0 }
    mainTl.to(
      counterObj,
      {
        value: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          setPercent(Math.round(counterObj.value))
        },
      },
      0.4,
    )

    // Progress bar fill across bottom
    mainTl.fromTo(
      '.intro-progress-bar',
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: 1.8,
        ease: 'power2.inOut',
      },
      0.4,
    )

    // Brief hold at 100% for prestige
    mainTl.to({}, { duration: 0.4 })

    // Allow user to skip anytime with Escape or click
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        mainTl.kill()
        finishIntro()
      }
    }

    const handleClick = () => {
      mainTl.kill()
      finishIntro()
    }

    window.addEventListener('keydown', handleKeyDown)
    container.addEventListener('click', handleClick)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      container.removeEventListener('click', handleClick)
      mainTl.kill()
    }
  }, [onStartReveal, onComplete])

  if (isDone) return null

  return (
    <aside
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#F9F7F4] flex flex-col justify-between p-8 sm:p-14 select-none cursor-pointer shadow-[0_30px_70px_rgba(13,12,11,0.25)]"
      style={{ willChange: 'transform' }}
      aria-label="Loading introduction"
      role="status"
    >
      {/* Top Bar: Editorial coordinates & year */}
      <div className="flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.24em] text-ink-muted">
        <span className="font-semibold text-ink">Sujal Vende</span>
        <span className="text-bronze tracking-[0.18em]">Portfolio &bull; 2026</span>
      </div>

      {/* Centerpiece */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        {/* Monogram emblem */}
        <div className="intro-badge mb-6 flex items-center justify-center w-14 h-14 rounded-full border border-stroke bg-white/70 shadow-2xs">
          <span className="font-serif italic text-bronze text-base font-medium tracking-widest">
            SV
          </span>
        </div>

        {/* Masked name */}
        <div className="overflow-hidden pb-1 mb-2">
          <h1 className="intro-mask-text font-serif text-[clamp(42px,7.5vw,84px)] leading-[1.04] tracking-[-0.035em] text-[#0D0C0B]">
            Sujal Vende
          </h1>
        </div>

        {/* Animated bronze hairline */}
        <div className="intro-hairline w-28 sm:w-36 h-[1.5px] bg-bronze/60 my-4" />

        {/* Subtitle */}
        <div className="overflow-hidden mb-6">
          <p className="intro-subtitle font-sans text-[11px] sm:text-[12px] uppercase text-[#6E6A66]">
            Full-Stack Developer &bull; Digital Reality
          </p>
        </div>

        {/* Counter percentage */}
        <div className="font-mono text-[13px] text-ink-muted/80 tracking-wider">
          {percent.toString().padStart(2, '0')}%
        </div>
      </div>

      {/* Bottom Bar: Skip hint & hairline progress rule */}
      <div className="relative pt-6">
        {/* Full-width bottom progress line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-stroke/50 overflow-hidden">
          <div className="intro-progress-bar h-full w-full bg-bronze/70" />
        </div>

        <div className="flex items-center justify-between font-sans text-[9px] uppercase tracking-[0.22em] text-ink-muted/70">
          <span>Navi Mumbai, India</span>
          <span className="hover:text-ink transition-colors">
            Click anywhere or [Esc] to skip &rarr;
          </span>
        </div>
      </div>
    </aside>
  )
}
