export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stroke">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left */}
          <div>
            <p className="font-sans text-sm font-medium text-ink mb-1">
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
              to digital experiences.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col sm:items-end gap-3">
            <div className="flex items-center gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[13px] text-ink-muted hover:text-ink transition-colors duration-200"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[13px] text-ink-muted hover:text-ink transition-colors duration-200"
              >
                LinkedIn
              </a>
              <a
                href="mailto:sujalvende9@gmail.com"
                className="font-sans text-[13px] text-ink-muted hover:text-ink transition-colors duration-200"
              >
                Email
              </a>
            </div>
            <p className="font-sans text-[12px] text-ink-muted">
              &copy; {year} Sujal Vende
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
