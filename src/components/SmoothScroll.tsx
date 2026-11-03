import React, { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface LenisContextType {
  lenis: Lenis | null
  scrollTo: (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => void
  stopScroll: () => void
  startScroll: () => void
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
  stopScroll: () => {},
  startScroll: () => {},
})

export const useLenis = () => useContext(LenisContext)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return
    }

    // Initialize Lenis with fluid inertia tuned to human satisfaction
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.4,
      infinite: false,
    })

    lenisRef.current = lenis

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Add Lenis's requestAnimationFrame callback to GSAP's central ticker with smooth lag tolerance
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(1000, 16)

    // Smooth scroll for anchor clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (href && href.startsWith('#') && href.length > 1) {
        const element = document.querySelector(href)
        if (element) {
          e.preventDefault()
          lenis.scrollTo(element as HTMLElement, {
            offset: -76,
            duration: 1.35,
          })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick, { capture: true })

    // Refresh ScrollTrigger after elements paint
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true })
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = (
    target: string | HTMLElement,
    options?: { offset?: number; duration?: number },
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? -76,
        duration: options?.duration ?? 1.35,
      })
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const stopScroll = () => {
    if (lenisRef.current) {
      lenisRef.current.stop()
    }
  }

  const startScroll = () => {
    if (lenisRef.current) {
      lenisRef.current.start()
    }
  }

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo, stopScroll, startScroll }}>
      {children}
    </LenisContext.Provider>
  )
}
