import { useState, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedDivider from './AnimatedDivider'

gsap.registerPlugin(ScrollTrigger)

export interface GalleryItem {
  id: string
  title: string
  project: string
  projectShort: string
  category: 'admin' | 'website'
  categoryLabel: string
  tag: string
  image: string
  browserUrl: string
  url?: string
  description: string
  highlights: string[]
  tech: string[]
}

const galleryItems: GalleryItem[] = [
  {
    id: 'skyevents-home',
    title: 'Luxury Wedding & Celebration Showcase',
    project: 'Sky Events',
    projectShort: 'Sky Events',
    category: 'website',
    categoryLabel: 'Live Website',
    tag: 'Luxury Event Platform',
    image: '/screenshots/sky-events.jpg',
    browserUrl: 'skyevents-website.vercel.app',
    url: 'https://skyevents-website.vercel.app',
    description:
      'Luxury wedding, milestone celebration and corporate gathering management platform crafted with calm, editorial precision from the initial mood board to the final guest.',
    highlights: ['Editorial luxury aesthetic', 'Bespoke event planning', 'Calm curation'],
    tech: ['React / Next.js', 'Tailwind CSS', 'Editorial Design'],
  },
  {
    id: 'gaming-overview',
    title: "Today's Overview & Station Controls",
    project: 'PS PRO Gaming',
    projectShort: 'PS PRO',
    category: 'admin',
    categoryLabel: 'Admin Suite',
    tag: 'Live Station Monitor',
    image: '/screenshots/gaming-admin-overview.png',
    browserUrl: 'advance-admin-panel-gaming-cafe.vercel.app/overview',
    url: 'https://advance-admin-panel-gaming-cafe.vercel.app',
    description:
      'Real-time operations center tracking active PS5 stations, Sim Racing rig, VR zone availability, revenue metrics, and booking states.',
    highlights: ['Station status toggles', 'Live revenue counter', 'Hardware availability tracking'],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Live State Machine'],
  },
  {
    id: 'salon-home',
    title: 'Luxury Beauty & Hair Showcase',
    project: 'Maison Aurelle Salon',
    projectShort: 'Maison Aurelle',
    category: 'website',
    categoryLabel: 'Live Website',
    tag: 'Editorial Website',
    image: '/screenshots/salon-home.png',
    browserUrl: 'salon-hair-style.vercel.app',
    url: 'https://salon-hair-style.vercel.app',
    description:
      'Editorial luxury salon website with refined serif typography, specialist menus, artist portfolio, and effortless booking.',
    highlights: ['Warm editorial aesthetic', 'Curated service portfolios', 'Seamless online booking'],
    tech: ['Playfair Typography', 'Smooth Transitions', 'Mobile-First UX'],
  },
  {
    id: 'salon-dashboard',
    title: 'Appointments & Performance Overview',
    project: 'Maison Aurelle Salon',
    projectShort: 'Maison Aurelle',
    category: 'admin',
    categoryLabel: 'Admin Suite',
    tag: 'Operations Overview',
    image: '/screenshots/salon-admin-dashboard.png',
    browserUrl: 'salon-hair-style.vercel.app/admin/dashboard',
    url: 'https://salon-hair-style.vercel.app',
    description:
      'Executive dashboard tracking daily bookings, confirmation pipeline, client appointment calendar, and top-requested services.',
    highlights: ['Real-time appointment requests', 'Confirmation workflow', 'Service metrics & revenue'],
    tech: ['React 19', 'Pipeline State Manager', 'Data Visualizations'],
  },
  {
    id: 'travel-home',
    title: 'Destination Discovery & Planning Portal',
    project: 'Travel Agency',
    projectShort: 'Travel Agency',
    category: 'website',
    categoryLabel: 'Live Website',
    tag: 'Destination Hero',
    image: '/screenshots/travel-home.png',
    browserUrl: 'traveling-agency-website-seven.vercel.app',
    url: 'https://traveling-agency-website-seven.vercel.app',
    description:
      'Inspiring travel platform with destination search, curated regional tours, rich photography, and direct WhatsApp trip planning.',
    highlights: ['Live destination search', 'Curated tour routes', 'Direct WhatsApp booking'],
    tech: ['Full-Width Imagery', 'Search Filtering', 'Instant WhatsApp CTAs'],
  },
  {
    id: 'osd-admin',
    title: 'Student & Parent Admission CRM',
    project: 'OSD Coaching Classes',
    projectShort: 'OSD Coaching',
    category: 'admin',
    categoryLabel: 'Admin Suite',
    tag: 'Lead & Enquiry CRM',
    image: '/screenshots/osd-admin.png',
    browserUrl: 'osd-couching-classes.vercel.app/admin',
    url: 'https://osd-couching-classes.vercel.app',
    description:
      'Centralized admissions CRM tracking parent inquiries across Grade 5–12, board streams (CBSE, ICSE, HSC), and one-click WhatsApp/Call contact actions.',
    highlights: ['1-Click WhatsApp follow-ups', 'Board & grade filtering', 'Lifecycle status pipeline'],
    tech: ['React', 'WhatsApp Web Hook', 'Admissions Pipeline'],
  },
  {
    id: 'gaming-home',
    title: 'Gaming Café Experience & Booking',
    project: 'PS PRO Gaming',
    projectShort: 'PS PRO',
    category: 'website',
    categoryLabel: 'Live Website',
    tag: 'Landing & Booking Portal',
    image: '/screenshots/gaming-home.png',
    browserUrl: 'advance-admin-panel-gaming-cafe.vercel.app',
    url: 'https://advance-admin-panel-gaming-cafe.vercel.app',
    description:
      'Bold, dark-themed platform introducing PS5 consoles, racing rigs, game library, and an instant slot reservation engine.',
    highlights: ['Immersive dark aesthetic', 'PS5 & Sim-Rig showcase', 'Fast reservation flow'],
    tech: ['Tailwind CSS', 'Responsive Grid', 'Direct Reservation Engine'],
  },
  {
    id: 'gaming-bookings',
    title: 'Active Player Sessions & Billing',
    project: 'PS PRO Gaming',
    projectShort: 'PS PRO',
    category: 'admin',
    categoryLabel: 'Admin Suite',
    tag: 'Billing & Session Manager',
    image: '/screenshots/gaming-admin-bookings.png',
    browserUrl: 'advance-admin-panel-gaming-cafe.vercel.app/bookings',
    url: 'https://advance-admin-panel-gaming-cafe.vercel.app',
    description:
      'Session dashboard tracking player game-time with live minute counters, dynamic hourly billing, online/cash payments, and instant session stops.',
    highlights: ['Live minute-by-minute timers', 'Split player billing', 'Instant session control'],
    tech: ['React', 'Dynamic Billing Engine', 'Timer Automation'],
  },
  {
    id: 'travel-packages',
    title: 'Pilgrimage & Holiday Package Catalog',
    project: 'Travel Agency',
    projectShort: 'Travel Agency',
    category: 'website',
    categoryLabel: 'Live Website',
    tag: 'Interactive Catalog',
    image: '/screenshots/travel-packages.png',
    browserUrl: 'traveling-agency-website-seven.vercel.app/packages',
    url: 'https://traveling-agency-website-seven.vercel.app',
    description:
      'Interactive tour package catalog displaying temple circuits (Pandharpur, Akkalkot, Jyotirlinga), vehicle pricing, and custom quotation forms.',
    highlights: ['Temple yatra circuits', 'Per-vehicle & per-person rates', 'Custom quote builder'],
    tech: ['Dynamic Rate Engine', 'Itinerary Modals', 'WhatsApp Trip Inquiry'],
  },
  {
    id: 'osd-home',
    title: 'Institute Academic Portal',
    project: 'OSD Coaching Classes',
    projectShort: 'OSD Coaching',
    category: 'website',
    categoryLabel: 'Live Website',
    tag: 'Educational Platform',
    image: '/screenshots/osd-home.png',
    browserUrl: 'osd-couching-classes.vercel.app',
    url: 'https://osd-couching-classes.vercel.app',
    description:
      'Credibility-focused coaching website showcasing 25+ years teaching legacy, faculty profiles, curriculum details, and inquiry flows.',
    highlights: ['25+ year trust markers', 'Curriculum breakdown', 'Instant admission inquiry'],
    tech: ['Tailwind CSS', 'Curriculum Tabs', 'Conversion Architecture'],
  },
  {
    id: 'clinic-admin',
    title: 'Patient Appointments Management',
    project: 'Doctor Practice Portal',
    projectShort: 'Clinic Portal',
    category: 'admin',
    categoryLabel: 'Admin Suite',
    tag: 'Clinical Operations',
    image: '/screenshots/clinic-admin.png',
    browserUrl: 'doctor-portal.internal/admin/appointments',
    description:
      'Clinical scheduling dashboard for managing patient consultation queues, confirmed appointments, cancellations, and daily date filters.',
    highlights: ['Consultation status pipeline', 'Date-based filtering', 'Patient record actions'],
    tech: ['React', 'Healthcare Scheduling', 'Status Badges'],
  },
  {
    id: 'salon-services',
    title: 'Service Catalog & Pricing Controls',
    project: 'Maison Aurelle Salon',
    projectShort: 'Maison Aurelle',
    category: 'admin',
    categoryLabel: 'Admin Suite',
    tag: 'Catalog Management',
    image: '/screenshots/salon-admin-services.png',
    browserUrl: 'salon-hair-style.vercel.app/admin/services',
    url: 'https://salon-hair-style.vercel.app',
    description:
      'Service catalog editor enabling staff to update hair treatments, color rituals, prices, duration times, and active statuses.',
    highlights: ['Hair, color & skin taxonomy', 'Duration & price configuration', 'Instant catalog sync'],
    tech: ['React', 'Live CRUD State', 'Category Filtering'],
  },
  {
    id: 'skillbridge-home',
    title: 'Interactive Peer-to-Peer Learning',
    project: 'Skill Bridge',
    projectShort: 'Skill Bridge',
    category: 'website',
    categoryLabel: 'Live Website',
    tag: 'EdTech Web App',
    image: '/screenshots/skillbridge-home.png',
    browserUrl: 'skill-bridge-prototype.vercel.app',
    url: 'https://skill-bridge-prototype.vercel.app',
    description:
      'Collaborative learning application showcasing real-time code mentor chat, peer skill verification, rating feedback, and credit system.',
    highlights: ['Live mentor session UI', 'Peer verified skill badges', 'Interactive credit economy'],
    tech: ['React', 'Simulated Live Chat', 'Skill Verification Flow'],
  },
  {
    id: 'clinic-home',
    title: 'Doctor Profile & Consultation Portal',
    project: 'Doctor Practice Portal',
    projectShort: 'Clinic Portal',
    category: 'website',
    categoryLabel: 'Live Website',
    tag: 'Practice Website',
    image: '/screenshots/clinic-home.png',
    browserUrl: 'doctor-portal.internal/overview',
    description:
      'Professional medical practice portal highlighting physician qualifications (MBBS, MD), clinical facilities, patient care philosophy, and online appointments.',
    highlights: ['Clean medical branding', 'Doctor credentials & specialties', 'Direct appointment scheduling'],
    tech: ['Accessible Layout', 'Appointment Request Form', 'Trust Markers'],
  },
]

const MOBILE_INITIAL_COUNT = 4

export default function ProjectGallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<'all' | 'admin' | 'website'>('all')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('grid')
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null)

  const projectsList = [
    { key: 'all', label: 'All Projects', count: galleryItems.length },
    { key: 'Sky Events', label: 'Sky Events', count: 1 },
    { key: 'PS PRO Gaming', label: 'PS PRO Gaming', count: 3 },
    { key: 'Maison Aurelle Salon', label: 'Maison Aurelle', count: 3 },
    { key: 'OSD Coaching Classes', label: 'OSD Coaching', count: 2 },
    { key: 'Travel Agency', label: 'Travel Agency', count: 2 },
    { key: 'Skill Bridge', label: 'Skill Bridge', count: 1 },
    { key: 'Doctor Practice Portal', label: 'Clinic Portal', count: 2 },
  ]

  const filteredItems = galleryItems.filter((item) => {
    const matchesCategory = filter === 'all' || item.category === filter
    const matchesProject = selectedProject === 'all' || item.project === selectedProject
    return matchesCategory && matchesProject
  })

  const handleFilterChange = (newFilter: 'all' | 'admin' | 'website') => {
    setFilter(newFilter)
    setMobileExpanded(false)
  }

  const handleProjectChange = (newProject: string) => {
    setSelectedProject(newProject)
    setMobileExpanded(false)
  }

  useGSAP(
    () => {
      const el = sectionRef.current
      if (!el) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) return

      gsap.fromTo(
        el.querySelectorAll('.gallery-reveal'),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    },
    { scope: sectionRef },
  )

  // Modal navigation controls & keyboard shortcuts
  useEffect(() => {
    if (!activeModalItem) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalItem(null)
      } else if (e.key === 'ArrowRight') {
        const currentIndex = filteredItems.findIndex((it) => it.id === activeModalItem.id)
        if (currentIndex !== -1 && currentIndex < filteredItems.length - 1) {
          setActiveModalItem(filteredItems[currentIndex + 1])
        }
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = filteredItems.findIndex((it) => it.id === activeModalItem.id)
        if (currentIndex > 0) {
          setActiveModalItem(filteredItems[currentIndex - 1])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [activeModalItem, filteredItems])

  const navigateModal = (direction: 'prev' | 'next') => {
    if (!activeModalItem) return
    const currentIndex = filteredItems.findIndex((it) => it.id === activeModalItem.id)
    if (direction === 'next' && currentIndex < filteredItems.length - 1) {
      setActiveModalItem(filteredItems[currentIndex + 1])
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveModalItem(filteredItems[currentIndex - 1])
    }
  }

  const currentModalIndex = activeModalItem
    ? filteredItems.findIndex((it) => it.id === activeModalItem.id)
    : -1

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative bg-ivory py-16 md:py-24 lg:py-28 overflow-hidden"
    >
      <AnimatedDivider />
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 pb-8 border-b border-stroke">
          <div>
            <div className="gallery-reveal flex items-center gap-3 mb-3.5">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-ink-muted font-medium">
                03 / Visual Archive
              </span>
              <span className="w-6 h-px bg-stroke inline-block" />
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-bronze font-semibold">
                Client Platforms & Admin Consoles
              </span>
            </div>

            <h2 className="gallery-reveal font-serif text-[clamp(30px,4.2vw,50px)] leading-[1.08] text-ink tracking-[-0.01em]">
              Interface Gallery.
            </h2>
          </div>

          <div className="gallery-reveal max-w-[500px]">
            <p className="font-sans text-[14px] md:text-[15px] text-ink-muted leading-[1.7] mb-4">
              Real screenshots of deployed web systems — spanning live customer booking frontends,
              e-commerce menus, and custom admin dashboards built for business operations.
            </p>

            {/* Quick Proof Strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 border-t border-stroke/70 font-sans text-[11px] uppercase tracking-[0.12em] text-ink-mid">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
                <strong>13</strong> Live Captures
              </span>
              <span className="text-stroke">•</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                <strong>6</strong> Admin Consoles
              </span>
              <span className="text-stroke">•</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <strong>7</strong> Client Frontends
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Control Bar */}
        <div className="space-y-4 mb-10 pb-6 border-b border-stroke">
          {/* Top row: Primary Category Tabs & View Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleFilterChange('all')}
                className={`font-sans text-[11px] uppercase tracking-[0.16em] px-4 py-2 border transition-all duration-200 cursor-pointer ${
                  filter === 'all'
                    ? 'bg-ink text-ivory border-ink shadow-sm'
                    : 'bg-white text-ink-mid border-stroke hover:border-ink hover:text-ink'
                }`}
              >
                All Captures ({galleryItems.length})
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange('admin')}
                className={`font-sans text-[11px] uppercase tracking-[0.16em] px-4 py-2 border transition-all duration-200 cursor-pointer ${
                  filter === 'admin'
                    ? 'bg-ink text-ivory border-ink shadow-sm'
                    : 'bg-white text-ink-mid border-stroke hover:border-ink hover:text-ink'
                }`}
              >
                Admin Consoles ({galleryItems.filter((i) => i.category === 'admin').length})
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange('website')}
                className={`font-sans text-[11px] uppercase tracking-[0.16em] px-4 py-2 border transition-all duration-200 cursor-pointer ${
                  filter === 'website'
                    ? 'bg-ink text-ivory border-ink shadow-sm'
                    : 'bg-white text-ink-mid border-stroke hover:border-ink hover:text-ink'
                }`}
              >
                Client Frontends ({galleryItems.filter((i) => i.category === 'website').length})
              </button>
            </div>

            {/* Layout density toggle (desktop) */}
            <div className="hidden md:flex items-center gap-1.5 bg-ivory-dark/60 p-1 border border-stroke self-start sm:self-auto">
              <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-ink-muted px-2">
                Grid:
              </span>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-[11px] font-sans uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-ink border border-stroke shadow-2xs font-medium'
                    : 'text-ink-muted hover:text-ink'
                }`}
                title="3-Column Compact Grid"
              >
                3 Col
              </button>
              <button
                type="button"
                onClick={() => setViewMode('detailed')}
                className={`px-2.5 py-1 text-[11px] font-sans uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                  viewMode === 'detailed'
                    ? 'bg-white text-ink border border-stroke shadow-2xs font-medium'
                    : 'text-ink-muted hover:text-ink'
                }`}
                title="2-Column Detailed Showcase"
              >
                2 Col
              </button>
            </div>
          </div>

          {/* Bottom row: Project Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink-muted shrink-0 mr-1 hidden sm:inline-block">
              Filter Project:
            </span>
            {projectsList.map((p) => {
              const isSelected = selectedProject === p.key
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handleProjectChange(p.key)}
                  className={`font-sans text-[11px] whitespace-nowrap px-3 py-1.5 border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-bronze text-white border-bronze font-medium'
                      : 'bg-ivory text-ink-muted border-stroke hover:border-ink-mid hover:text-ink'
                  }`}
                >
                  {p.label}
                  <span
                    className={`ml-1.5 text-[9px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-ivory-dark text-ink-muted'
                    }`}
                  >
                    {p.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <div
          className={`grid gap-8 ${
            viewMode === 'detailed'
              ? 'grid-cols-1 lg:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {filteredItems.map((item, index) => {
            const isHiddenOnMobile = !mobileExpanded && index >= MOBILE_INITIAL_COUNT
            return (
              <article
                key={item.id}
                className={`group bg-white border border-stroke flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_36px_rgba(13,12,11,0.09)] hover:border-ink/40 ${
                  isHiddenOnMobile ? 'hidden md:flex' : 'flex'
                }`}
              >
                <div>
                  {/* Browser Window Chrome Header */}
                  <div className="px-4 py-2.5 border-b border-stroke bg-ivory flex items-center justify-between gap-3 select-none">
                    {/* macOS style dots */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E58273]/80 border border-[#C56B5D]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E8BA60]/80 border border-[#C69A48]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#78C384]/80 border border-[#5FA46A]" />
                    </div>

                    {/* Faux browser URL pill */}
                    <div className="flex-1 max-w-[280px] bg-white border border-stroke px-2.5 py-0.5 rounded-sm flex items-center gap-1.5 overflow-hidden">
                      <span className="text-[10px] text-emerald-600">🔒</span>
                      <span className="font-sans text-[10px] text-ink-muted truncate font-mono tracking-tight">
                        {item.browserUrl}
                      </span>
                    </div>

                    {/* Badge */}
                    <span
                      className={`font-sans text-[9px] uppercase tracking-[0.16em] px-2 py-0.5 border shrink-0 ${
                        item.category === 'admin'
                          ? 'border-bronze/40 text-bronze bg-bronze/5 font-medium'
                          : 'border-ink/20 text-ink bg-ink/5'
                      }`}
                    >
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Screenshot Frame with Zoom Action */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveModalItem(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActiveModalItem(item)
                      }
                    }}
                    className="relative aspect-[16/10] bg-[#161514] overflow-hidden cursor-zoom-in block"
                    aria-label={`Inspect ${item.title}`}
                  >
                    <img
                      src={item.image}
                      alt={`${item.project} - ${item.title}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      loading="eager"
                    />

                    {/* Hover inspection overlay */}
                    <div className="absolute inset-0 bg-ink/35 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                      <div className="bg-ink/95 text-ivory border border-white/20 px-4 py-2 flex items-center gap-2 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                        <span className="font-sans text-[11px] uppercase tracking-[0.18em]">
                          Inspect Full Resolution
                        </span>
                        <span className="text-bronze">↗</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink-muted font-medium">
                        {item.project}
                      </span>
                      <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-bronze">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-serif text-[20px] text-ink mb-2.5 leading-[1.24]">
                      {item.title}
                    </h3>

                    <p className="font-sans text-[13px] text-ink-muted leading-[1.65] line-clamp-2 mb-4">
                      {item.description}
                    </p>

                    {/* Highlights pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.highlights.slice(0, 2).map((h) => (
                        <span
                          key={h}
                          className="font-sans text-[10.5px] text-ink-mid bg-ivory px-2 py-0.5 border border-stroke/80"
                        >
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-6 py-3.5 border-t border-stroke bg-ivory/40 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModalItem(item)}
                    className="font-sans text-[12px] text-ink hover:text-bronze transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
                  >
                    Inspect Screen ↗
                  </button>

                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[12px] text-ink-muted hover:text-ink transition-colors inline-flex items-center gap-1"
                      aria-label={`Open live ${item.project} website`}
                    >
                      Open Live Site ↗
                    </a>
                  ) : (
                    <span className="font-sans text-[11px] text-ink-muted/70 italic">
                      Internal Client Portal
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {/* Mobile See More / Show Less Toggle Button */}
        {filteredItems.length > MOBILE_INITIAL_COUNT && (
          <div className="flex flex-col items-center justify-center pt-8 md:hidden">
            {!mobileExpanded ? (
              <button
                type="button"
                onClick={() => setMobileExpanded(true)}
                className="w-full sm:w-auto font-sans text-[12px] uppercase tracking-[0.16em] text-ivory bg-ink px-6 py-3.5 border border-ink shadow-sm hover:bg-bronze hover:border-bronze transition-colors flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
              >
                <span>See More Captures ({filteredItems.length - MOBILE_INITIAL_COUNT} More)</span>
                <span className="text-bronze font-bold text-sm">↓</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileExpanded(false)
                  const el = document.getElementById('gallery')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full sm:w-auto font-sans text-[12px] uppercase tracking-[0.16em] text-ink bg-ivory px-6 py-3 border border-stroke hover:bg-ink hover:text-ivory transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Show Less</span>
                <span className="text-sm">↑</span>
              </button>
            )}
          </div>
        )}

        {/* Empty state fallback */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 border border-stroke bg-white p-8">
            <p className="font-serif text-2xl text-ink mb-2">No captures found</p>
            <p className="font-sans text-sm text-ink-muted mb-6 max-w-[420px] mx-auto">
              There are no screenshots matching your active category and project filters.
            </p>
            <button
              type="button"
              onClick={() => {
                handleFilterChange('all')
                handleProjectChange('all')
              }}
              className="font-sans text-xs uppercase tracking-widest px-5 py-2.5 bg-ink text-ivory hover:bg-bronze transition-colors cursor-pointer"
            >
              Reset Filters & Show All (13)
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal (Inspection Suite) */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 bg-ink/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-8"
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeModalItem.title}
        >
          <div
            className="bg-white border border-stroke max-w-[1200px] w-full max-h-[94vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-3.5 border-b border-stroke bg-ivory flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-bronze font-semibold shrink-0">
                  {activeModalItem.project}
                </span>
                <span className="text-stroke text-sm">/</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-ink-muted shrink-0">
                  {activeModalItem.categoryLabel}
                </span>
                <span className="text-stroke text-sm hidden sm:inline">/</span>
                <span className="font-sans text-[11px] text-ink-mid truncate hidden sm:inline font-mono">
                  {activeModalItem.browserUrl}
                </span>
              </div>

              {/* Navigation Controls & Close */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-sans text-[11px] text-ink-muted mr-1 hidden sm:inline">
                  {currentModalIndex + 1} / {filteredItems.length}
                </span>
                <button
                  type="button"
                  onClick={() => navigateModal('prev')}
                  disabled={currentModalIndex === 0}
                  className="px-3 py-1 text-xs font-sans border border-stroke hover:bg-ink hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink transition-colors cursor-pointer"
                  aria-label="Previous capture"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={() => navigateModal('next')}
                  disabled={currentModalIndex === filteredItems.length - 1}
                  className="px-3 py-1 text-xs font-sans border border-stroke hover:bg-ink hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink transition-colors cursor-pointer"
                  aria-label="Next capture"
                >
                  Next →
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="w-8 h-8 border border-stroke flex items-center justify-center text-ink hover:bg-ink hover:text-ivory transition-colors ml-1 cursor-pointer"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Image Viewport */}
            <div className="relative flex-1 bg-[#141312] overflow-auto max-h-[58vh] flex items-center justify-center p-3 sm:p-6 select-none">
              <img
                src={activeModalItem.image}
                alt={`${activeModalItem.project} - ${activeModalItem.title}`}
                className="max-h-full max-w-full w-auto h-auto object-contain shadow-2xl rounded-xs"
              />
            </div>

            {/* Thumbnail Filmstrip */}
            <div className="bg-[#1C1A19] border-t border-stroke/20 px-4 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2 select-none">
              <span className="font-sans text-[9px] uppercase tracking-[0.18em] text-white/50 shrink-0 mr-1 hidden md:inline-block">
                Captures ({filteredItems.length}):
              </span>
              {filteredItems.map((thumb) => {
                const isActive = thumb.id === activeModalItem.id
                return (
                  <button
                    key={thumb.id}
                    type="button"
                    onClick={() => setActiveModalItem(thumb)}
                    className={`relative shrink-0 w-16 h-11 border transition-all cursor-pointer overflow-hidden ${
                      isActive
                        ? 'border-bronze scale-105 shadow-md ring-1 ring-bronze'
                        : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/60'
                    }`}
                    title={thumb.title}
                  >
                    <img
                      src={thumb.image}
                      alt={thumb.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                )
              })}
            </div>

            {/* Modal Footer / Detailed Metadata Drawer */}
            <div className="p-6 bg-white border-t border-stroke flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-[760px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-bronze font-semibold">
                    {activeModalItem.tag}
                  </span>
                  <span className="text-stroke">•</span>
                  <span className="font-sans text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
                    {activeModalItem.categoryLabel}
                  </span>
                </div>

                <h3 className="font-serif text-[22px] md:text-[24px] text-ink mb-2 leading-snug">
                  {activeModalItem.title}
                </h3>

                <p className="font-sans text-[13px] md:text-[14px] text-ink-muted leading-[1.65] mb-3.5">
                  {activeModalItem.description}
                </p>

                {/* Highlights & Tech Stack */}
                <div className="flex flex-wrap items-center gap-2">
                  {activeModalItem.highlights.map((h) => (
                    <span
                      key={h}
                      className="font-sans text-[11px] text-ink-mid bg-ivory px-2.5 py-1 border border-stroke"
                    >
                      ✓ {h}
                    </span>
                  ))}
                  {activeModalItem.tech.map((t) => (
                    <span
                      key={t}
                      className="font-sans text-[10.5px] text-ink-muted bg-ivory-dark/60 px-2 py-1 border border-stroke/60 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {activeModalItem.url && (
                  <a
                    href={activeModalItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[12px] uppercase tracking-[0.16em] text-ivory bg-ink px-6 py-3 border border-ink hover:bg-bronze hover:border-bronze transition-colors inline-flex items-center justify-center gap-2 font-medium shadow-sm"
                  >
                    Open Live Deployment ↗
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="font-sans text-[12px] uppercase tracking-[0.14em] text-ink bg-ivory px-5 py-3 border border-stroke hover:bg-ink hover:text-ivory transition-colors cursor-pointer text-center"
                >
                  Back to Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
