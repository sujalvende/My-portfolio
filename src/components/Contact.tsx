import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

gsap.registerPlugin(ScrollTrigger)

type FormState = 'idle' | 'loading' | 'success' | 'error'

const SERVICE_OPTIONS = [
  'Website',
  'Web Application',
  'UI / Frontend Development',
  'Website Redesign',
  'Full-Stack Project',
  'Other',
]

const BUDGET_OPTIONS = [
  'Under ₹15,000',
  '₹15,000 – ₹30,000',
  '₹30,000 – ₹60,000',
  '₹60,000+',
  "I'm not sure yet",
]

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block font-sans text-[11px] uppercase tracking-[0.18em] text-ink-muted mb-2 font-medium">
      {children}
      {required && <span className="ml-1 text-bronze">*</span>}
    </label>
  )
}

const inputClass =
  'w-full font-sans text-[15px] text-ink bg-transparent border border-ink/25 px-4 py-3 focus:outline-none focus:border-ink focus:bg-white/40 transition-colors duration-200 placeholder:text-ink-muted/40'

const selectClass =
  'w-full font-sans text-[15px] text-ink bg-ivory border border-ink/25 px-4 py-3 focus:outline-none focus:border-ink focus:bg-white/40 transition-colors duration-200 appearance-none cursor-pointer'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formState, setFormState] = useState<FormState>('idle')
  const [serverError, setServerError] = useState('')

  // ── Entrance animation ──────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.contact-reveal'), {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.11,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 78%' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  // ── Success card entrance animation ─────────────────────────────────────
  useEffect(() => {
    if (formState === 'success' && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      )
    }
  }, [formState])

  const validate = () => {
    const e: Record<string, string> = {}
    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim()
    const trimmedMessage = form.message.trim()
    const trimmedPhone = form.phone.trim()

    if (!trimmedName) {
      e.name = 'Your name is required.'
    } else if (trimmedName.length > 100) {
      e.name = 'Name must be under 100 characters.'
    }

    if (!trimmedEmail) {
      e.email = 'Your email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      e.email = 'Please enter a valid email address.'
    } else if (trimmedEmail.length > 255) {
      e.email = 'Email must be under 255 characters.'
    }

    if (!form.service) {
      e.service = 'Please select a service.'
    }

    if (!trimmedMessage) {
      e.message = 'Please describe your project (at least 10 characters).'
    } else if (trimmedMessage.length < 10) {
      e.message = 'Please describe your project with at least 10 characters.'
    } else if (trimmedMessage.length > 3000) {
      e.message = 'Message must be under 3,000 characters.'
    }

    if (trimmedPhone && trimmedPhone.length > 50) {
      e.phone = 'Phone number is too long (maximum 50 characters).'
    }

    return e
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setFormState('loading')
    setServerError('')

    if (!isSupabaseConfigured) {
      setFormState('error')
      setServerError(
        'Supabase is not configured yet. Please provide valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.',
      )
      return
    }

    try {
      const { error: insertError } = await supabase.from('inquiries').insert([
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || null,
          service: form.service,
          budget: form.budget || null,
          message: form.message.trim(),
          status: 'new',
        },
      ])

      if (insertError) {
        throw new Error(insertError.message || 'Failed to submit inquiry. Please try again.')
      }

      setFormState('success')
      setForm({ name: '', email: '', phone: '', service: '', budget: '', message: '' })
      setErrors({})
    } catch (err: unknown) {
      setFormState('error')
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <section ref={sectionRef} id="contact" className="border-t border-stroke bg-ivory">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 lg:gap-24 items-start">
          {/* ── Left Column — Heading & Direct Info ────────────────────────── */}
          <div className="contact-reveal">
            <span className="block font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted mb-8">
              07 / Contact
            </span>

            <h2
              className="font-serif text-ink leading-[1.08] tracking-[-0.01em] mb-6"
              style={{ fontSize: 'clamp(34px, 5vw, 64px)' }}
            >
              Have an idea worth building?
            </h2>

            <p className="font-sans text-[17px] text-ink-muted leading-[1.65] mb-12 max-w-[380px]">
              Tell me what you're thinking. Let's turn it into something real.
            </p>

            {/* Contact details */}
            <div className="space-y-7 border-t border-stroke pt-8">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                  Email
                </p>
                <a
                  href="mailto:sujalvende9@gmail.com"
                  className="font-sans text-[15px] text-ink-mid hover:text-ink transition-colors duration-200"
                >
                  sujalvende9@gmail.com
                </a>
              </div>

              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                  Phone / WhatsApp
                </p>
                <a
                  href="tel:+917977469282"
                  className="font-sans text-[15px] text-ink-mid hover:text-ink transition-colors duration-200"
                >
                  +91 7977469282
                </a>
              </div>

              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                  Profiles
                </p>
                <div className="flex items-center gap-5 pt-0.5">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[14px] text-ink-mid hover:text-ink transition-colors duration-200"
                  >
                    GitHub ↗
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[14px] text-ink-mid hover:text-ink transition-colors duration-200"
                  >
                    LinkedIn ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column — Restored Refined Minimal Form ──────────────── */}
          <div className="contact-reveal">
            {formState === 'success' ? (
              <div
                ref={successRef}
                className="border border-stroke p-10 md:p-12 text-center bg-[#FAF8F5]"
              >
                <div className="w-12 h-12 border border-ink/20 rounded-full flex items-center justify-center mx-auto mb-6 text-ink">
                  <span className="text-xl font-serif">✓</span>
                </div>

                <h3 className="font-serif text-[26px] text-ink mb-3 leading-[1.2]">
                  Inquiry sent successfully.
                </h3>

                <p className="font-sans text-[15px] text-ink-muted leading-[1.65] max-w-[340px] mx-auto mb-8">
                  Thank you for reaching out. I'll review your project details and get back to you shortly.
                </p>

                <button
                  onClick={() => setFormState('idle')}
                  className="font-sans text-[13px] text-ink-muted underline underline-offset-4 hover:text-ink transition-colors duration-200"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <FieldLabel required>Name</FieldLabel>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      autoComplete="name"
                      className={inputClass}
                      aria-required="true"
                    />
                    {errors.name && (
                      <p className="font-sans text-[11px] text-bronze mt-1.5 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel required>Email</FieldLabel>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className={inputClass}
                      aria-required="true"
                    />
                    {errors.email && (
                      <p className="font-sans text-[11px] text-bronze mt-1.5 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <FieldLabel required>What do you need?</FieldLabel>
                  <div className="relative">
                    <select
                      id="contact-service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={selectClass}
                      aria-required="true"
                    >
                      <option value="">Select a service</option>
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted text-xs">
                      ↓
                    </span>
                  </div>
                  {errors.service && (
                    <p className="font-sans text-[11px] text-bronze mt-1.5 font-medium">
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Project Description */}
                <div>
                  <FieldLabel required>Tell me about your project</FieldLabel>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="What are you building, who is it for, and what's the timeline?"
                    rows={5}
                    className={`${inputClass} resize-none`}
                    aria-required="true"
                  />
                  {errors.message && (
                    <p className="font-sans text-[11px] text-bronze mt-1.5 font-medium">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Optional Phone & Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <FieldLabel>Phone / WhatsApp</FieldLabel>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <FieldLabel>Approximate budget</FieldLabel>
                    <div className="relative">
                      <select
                        id="contact-budget"
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="">Not sure yet</option>
                        {BUDGET_OPTIONS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted text-xs">
                        ↓
                      </span>
                    </div>
                  </div>
                </div>

                {/* Server Error / Setup Banner with direct email fallback */}
                {formState === 'error' && serverError && (
                  <div className="border border-bronze/40 bg-bronze/5 p-4 space-y-3">
                    <p className="font-sans text-[13px] text-bronze leading-relaxed">{serverError}</p>
                    <div className="pt-1">
                      <a
                        href={`mailto:sujalvende9@gmail.com?subject=${encodeURIComponent(
                          `Project Inquiry: ${form.service || 'Website'} - ${form.name || 'Visitor'}`,
                        )}&body=${encodeURIComponent(
                          `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nService: ${form.service}\nBudget: ${form.budget}\n\nMessage:\n${form.message}`,
                        )}`}
                        className="inline-flex items-center gap-2 font-sans text-[12px] font-medium text-ink bg-white/80 border border-ink/20 px-3.5 py-2 hover:bg-ink hover:text-ivory transition-all duration-200"
                      >
                        Send via Email Instead ↗
                      </a>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="flex items-center justify-between pt-2">
                  <p className="font-sans text-[11px] text-ink-muted">
                    <span className="text-bronze">*</span> Required fields
                  </p>
                  <button
                    type="submit"
                    disabled={formState === 'loading'}
                    className="font-sans text-[13px] font-medium text-ink border border-ink/40 px-8 py-3.5 hover:bg-ink hover:text-ivory transition-all duration-250 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formState === 'loading' ? (
                      <>Sending…</>
                    ) : (
                      <>
                        Send Inquiry
                        <span className="inline-block">→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
