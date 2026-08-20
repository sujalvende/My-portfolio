import { useEffect, useState } from 'react'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ivory/96 backdrop-blur-sm border-b border-stroke'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 h-[68px] md:h-[76px] flex items-center justify-between">
        <a
          href="#"
          className="font-sans text-sm font-medium tracking-wide text-ink hover:text-ink-muted transition-colors duration-200"
        >
          Sujal Vende
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-sans text-[13px] text-ink-muted hover:text-ink transition-colors duration-200"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            data-cursor="talk"
            className="font-sans text-[13px] text-ink border border-ink/35 px-5 py-2.5 hover:bg-ink hover:text-ivory transition-all duration-250 inline-flex items-center gap-1.5"
          >
            Let's Talk
            <span className="inline-block" aria-hidden="true">→</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-2"
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
        className={`md:hidden border-t border-stroke bg-ivory transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pt-2 pb-8">
          {navLinks.map(({ label, href }, i) => (
            <a
              key={label}
              href={href}
              className="flex items-center justify-between py-4 font-sans text-[15px] text-ink-mid border-b border-stroke last:border-0 hover:text-ink transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              <span>{label}</span>
              <span className="text-ink-muted text-xs">
                0{i + 1}
              </span>
            </a>
          ))}
          <a
            href="#contact"
            className="block mt-6 font-sans text-[15px] text-ink"
            onClick={() => setMenuOpen(false)}
          >
            Let's Talk →
          </a>
        </div>
      </div>
    </header>
  )
}
