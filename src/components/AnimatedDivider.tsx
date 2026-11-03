import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedDividerProps {
  className?: string
  color?: string
}

export default function AnimatedDivider({
  className = '',
  color = 'bg-stroke',
}: AnimatedDividerProps) {
  const lineRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const line = lineRef.current
      if (!line) return

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 92%',
            end: 'top 65%',
            scrub: 1.2,
          },
        },
      )
    },
    { scope: lineRef },
  )

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div ref={lineRef} className={`h-[1px] w-full ${color}`} style={{ willChange: 'transform' }} />
    </div>
  )
}

