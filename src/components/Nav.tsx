import { useEffect, useState } from 'react'
import { useLenis } from './SmoothScroll'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollTo } = useLenis()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      scrollTo(href, { offset: -70 })
      setMenuOpen(false)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-ivory/95 backdrop-blur-md border-b border-stroke shadow-xs'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 h-[68px] md:h-[76px] flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            scrollTo(0, { offset: 0 })
          }}
          className="font-sans text-sm font-semibold tracking-wide text-ink hover:text-bronze transition-colors duration-200"
        >
          Sujal Vende
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className="font-sans text-[13px] text-ink-muted hover:text-ink transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-bronze hover:after:w-full after:transition-all after:duration-250"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            data-cursor="talk"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="font-sans text-[13px] text-ink border border-ink/35 px-5 py-2.5 hover:bg-ink hover:text-ivory transition-all duration-250 inline-flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
          >
            Let's Talk
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] p-3 -mr-3 min-w-[44px] min-h-[44px] cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-px bg-ink transition-transform duration-300 origin-center ${
              menuOpen ? 'translate-y-[6px] rotate-45' : ''
            }`}
          />
          <span
            className={`block w-5 h-px bg-ink transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-px bg-ink transition-transform duration-300 origin-center ${
              menuOpen ? '-translate-y-[6px] -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden border-t border-stroke bg-ivory/98 backdrop-blur-lg transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-[400px] opacity-100 shadow-xl' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pt-2 pb-8">
          {navLinks.map(({ label, href }, i) => (
            <a
              key={label}
              href={href}
              className="flex items-center justify-between py-4 font-sans text-[15px] text-ink-mid border-b border-stroke last:border-0 hover:text-ink transition-colors duration-200"
              onClick={(e) => handleNavClick(e, href)}
            >
              <span>{label}</span>
              <span className="text-ink-muted text-xs font-mono">
                0{i + 1}
              </span>
            </a>
          ))}
          <a
            href="#contact"
            className="block mt-6 font-sans text-[14px] font-medium text-ink border border-ink/30 px-5 py-3 hover:bg-ink hover:text-ivory transition-all duration-200 inline-flex items-center justify-center gap-1.5 w-full"
            style={{ minHeight: 46 }}
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            Let's Talk →
          </a>
        </div>
      </div>
    </header>
  )
}
