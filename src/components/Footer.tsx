import AnimatedDivider from './AnimatedDivider'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-ivory overflow-hidden">
      <AnimatedDivider />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left */}
          <div>
            <p className="font-sans text-sm font-semibold tracking-wide text-ink mb-1">
              Sujal Vende
            </p>
            <p className="font-sans text-[13px] text-ink-muted">
              Building ideas i
              <a
                href="https://sujalvende-portfolio.vercel.app/sujal9892/login"
                className="text-inherit no-underline hover:text-inherit"
                aria-label="Admin login"
              >
                n
              </a>
              to digital reality.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col sm:items-end gap-3">
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/sujalvende"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[13px] text-ink-muted hover:text-ink hover:underline underline-offset-4 transition-colors duration-200"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/sujalvende"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[13px] text-ink-muted hover:text-ink hover:underline underline-offset-4 transition-colors duration-200"
              >
                LinkedIn
              </a>
              <a
                href="mailto:sujalvende9@gmail.com"
                className="font-sans text-[13px] text-ink-muted hover:text-ink hover:underline underline-offset-4 transition-colors duration-200"
              >
                Email
              </a>
            </div>
            <p className="font-sans text-[12px] text-ink-muted/80">
              &copy; {year} Sujal Vende &bull; All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
