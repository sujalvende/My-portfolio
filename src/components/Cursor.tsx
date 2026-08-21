import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

type CursorState = 'default' | 'link' | 'project' | 'talk'

// Detect touch on first render (SSR-safe)
const isTouch =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Cursor() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/sujal9892')

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [cursorState, setCursorState] = useState<CursorState>('default')
  const [visible, setVisible] = useState(false)
  const [label, setLabel] = useState('')

  useEffect(() => {
    // Disable on admin routes, touch, or reduced-motion
    if (isAdmin || isTouch || prefersReducedMotion) {
      document.body.classList.remove('custom-cursor-active')
      return
    }

    // Enable custom cursor styles on body for public routes
    document.body.classList.add('custom-cursor-active')

    let dotX = 0, dotY = 0
    let ringX = 0, ringY = 0
    let rafId: number

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      ringX = lerp(ringX, dotX, 0.1)
      ringY = lerp(ringY, dotY, 0.1)
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    const onMouseMove = (e: MouseEvent) => {
      dotX = e.clientX
      dotY = e.clientY
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      setVisible(true)
    }

    const onMouseLeave = () => setVisible(false)
    const onMouseEnter = () => setVisible(true)

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const closest = el.closest('a, button, [data-cursor]') as HTMLElement | null
      if (!closest) {
        setCursorState('default')
        setLabel('')
        return
      }

      const dataCursor = closest.getAttribute('data-cursor')
      if (dataCursor === 'project') {
        setCursorState('project')
        setLabel('VIEW ↗')
      } else if (dataCursor === 'talk') {
        setCursorState('talk')
        setLabel('TALK ↗')
      } else {
        setCursorState('link')
        setLabel('')
      }
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      cancelAnimationFrame(rafId)
      document.body.classList.remove('custom-cursor-active')
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [isAdmin])

  // Don't render cursor elements on admin routes or touch devices
  if (isAdmin || isTouch || prefersReducedMotion) return null

  const ringSize =
    cursorState === 'link' ? 44 :
    cursorState === 'project' || cursorState === 'talk' ? 72 :
    32

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#0D0C0B',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          willChange: 'transform',
        }}
      />

      {/* Ring — follows with slight lag via rAF lerp */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: '1.5px solid rgba(13,12,11,0.4)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: visible ? 1 : 0,
          transition: `opacity 0.3s ease, width 0.25s cubic-bezier(0.16,1,0.3,1), height 0.25s cubic-bezier(0.16,1,0.3,1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
        }}
      >
        {label && (
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 8,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#0D0C0B',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {label}
          </span>
        )}
      </div>
    </>
  )
}
