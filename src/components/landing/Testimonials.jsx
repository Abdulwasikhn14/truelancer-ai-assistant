import { useRef, useLayoutEffect, useState } from 'react'
import { motion, useMotionValue, useAnimationFrame, useInView } from 'framer-motion'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    role: 'Fiverr Seller',
    initials: 'SK',
    avatarBg: '#E0F2FE',
    avatarColor: '#0284C7',
    text: 'Truelancer helped me land 3 new clients in my first week. The proposal generator is incredible!',
  },
  {
    name: 'Ahmed R.',
    role: 'Upwork Freelancer',
    initials: 'AR',
    avatarBg: '#ECFEFF',
    avatarColor: '#38BDF8',
    text: 'I used to spend hours writing proposals. Now it takes 30 seconds. Game changer!',
  },
  {
    name: 'Maria L.',
    role: 'Freelance Designer',
    initials: 'ML',
    avatarBg: '#ECFDF5',
    avatarColor: '#10B981',
    text: 'The client assistant feature saved me from so many awkward conversations.',
  },
  {
    name: 'James T.',
    role: 'Full Stack Developer',
    initials: 'JT',
    avatarBg: '#FFF7ED',
    avatarColor: '#F97316',
    text: 'My proposal acceptance rate went from 20% to 75% after using Truelancer.',
  },
  {
    name: 'Priya S.',
    role: 'Content Writer',
    initials: 'PS',
    avatarBg: '#FEF2F2',
    avatarColor: '#EF4444',
    text: 'The gig description generator wrote better descriptions than I ever could myself.',
  },
  {
    name: 'Carlos M.',
    role: 'Video Editor',
    initials: 'CM',
    avatarBg: '#F0F9FF',
    avatarColor: '#8B5CF6',
    text: "Worth every penny. The AI pricing tool helped me finally charge what I'm worth.",
  },
]

const ROW1 = TESTIMONIALS
const ROW2 = [...TESTIMONIALS.slice(3), ...TESTIMONIALS.slice(0, 3)]

function TestimonialCard({ testimonial }) {
  return (
    <div
      style={{
        flexShrink:   0,
        width:        300,
        margin:       '0 10px',
        padding:      '22px 20px',
        background:   '#ffffff',
        border:       '1px solid #E5E7EB',
        borderRadius: 16,
        boxShadow:    '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Stars */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} style={{ fill: '#FBBF24', stroke: '#FBBF24' }} />
        ))}
      </div>

      {/* Quote */}
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, marginBottom: 18 }}>
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width:          36,
            height:         36,
            borderRadius:   '50%',
            background:     testimonial.avatarBg,
            color:          testimonial.avatarColor,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       11,
            fontWeight:     700,
            flexShrink:     0,
          }}
        >
          {testimonial.initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A', lineHeight: 1.3 }}>
            {testimonial.name}
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
            {testimonial.role}
          </div>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ cards, direction = 1, speed = 45 }) {
  const [paused, setPaused]   = useState(false)
  const x                     = useMotionValue(0)
  const containerRef           = useRef(null)
  const halfWidthRef           = useRef(0)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    halfWidthRef.current = containerRef.current.scrollWidth / 2
    if (direction < 0) x.set(-halfWidthRef.current)
  }, [direction, x])

  useAnimationFrame((_, delta) => {
    if (paused || !halfWidthRef.current) return
    const halfW = halfWidthRef.current
    let curr    = x.get()
    if (direction > 0) {
      curr -= speed * (delta / 1000)
      if (curr <= -halfW) curr += halfW
    } else {
      curr += speed * (delta / 1000)
      if (curr >= 0) curr -= halfW
    }
    x.set(curr)
  })

  return (
    <div
      style={{ overflow: 'hidden' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        ref={containerRef}
        style={{ x, display: 'flex', paddingBlock: 8, width: 'max-content' }}
      >
        {[...cards, ...cards].map((card, i) => (
          <TestimonialCard key={`${card.name}-${i}`} testimonial={card} />
        ))}
      </motion.div>
    </div>
  )
}

export default function Testimonials() {
  const headerRef  = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section style={{ background: '#ffffff', padding: '120px 0', overflow: 'hidden', borderTop: '1px solid #F3F4F6' }}>
      {/* Header */}
      <motion.div
        ref={headerRef}
        style={{ textAlign: 'center', marginBottom: 56, padding: '0 48px' }}
        initial={{ opacity: 0, y: 28 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
          TESTIMONIALS
        </p>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#0A0A0A', letterSpacing: '-1.5px', marginBottom: 12 }}>
          Loved by{' '}
          <span style={{ background: 'linear-gradient(135deg, #0284C7, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Freelancers
          </span>
        </h2>
        <p style={{ fontSize: 16, color: '#9CA3AF', maxWidth: 400, margin: '0 auto' }}>
          Join thousands of freelancers already winning more with AI
        </p>
      </motion.div>

      {/* Marquee with fade mask */}
      <div
        style={{
          maskImage:       'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        <MarqueeRow cards={ROW1} direction={1}  speed={46} />
        <div style={{ height: 16 }} />
        <MarqueeRow cards={ROW2} direction={-1} speed={38} />
      </div>
    </section>
  )
}
