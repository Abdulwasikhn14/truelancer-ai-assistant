import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, MessageSquare, Briefcase, DollarSign, Bot, BarChart3 } from 'lucide-react'

const CARDS = [
  { num: '01', Icon: FileText,      bg: '#F0F9FF', color: '#0284C7', title: 'Proposal Generator', desc: 'Write winning proposals in 30 seconds. AI tailors every word to the job posting.' },
  { num: '02', Icon: MessageSquare, bg: '#ECFEFF', color: '#38BDF8', title: 'Client Assistant',    desc: 'Handle negotiations, follow-ups, and awkward conversations with perfect replies.' },
  { num: '03', Icon: Briefcase,     bg: '#FFF7ED', color: '#F97316', title: 'Gig Generator',       desc: 'Create compelling gig descriptions that rank higher and convert better.' },
  { num: '04', Icon: DollarSign,    bg: '#ECFDF5', color: '#10B981', title: 'Pricing Tool',        desc: 'Never undersell again. Get data-driven pricing suggestions for any project.' },
  { num: '05', Icon: Bot,           bg: '#F0F9FF', color: '#0284C7', title: 'AI Chatbot',          desc: 'Your personal AI assistant for any freelancing question, available 24/7.' },
  { num: '06', Icon: BarChart3,     bg: '#ECFEFF', color: '#38BDF8', title: 'Analytics',           desc: 'Track your performance, monitor trends, and make smarter business decisions.' },
]

// Curved-fan geometry: each card is rotated/pushed back based on its distance
// from the centre so the row reads as a 3D arc (like the reference coverflow).
const CENTER = (CARDS.length - 1) / 2
// Lightweight 2D "fanned arc": each card is tilted (in-plane rotate) and dropped
// slightly based on its distance from centre. No perspective / preserve-3d, so
// hover stays buttery — 3D transforms were forcing full-scene re-rasterisation.
const layoutFor = (i) => {
  const offset = i - CENTER
  return {
    rot: offset * 3.4,             // fan tilt: outer cards ~±8.5°, centre ~±1.7°
    ty: Math.abs(offset) * 9,      // arc: outer cards sit a little lower
  }
}

function CardBody({ card, big = false }) {
  const { Icon } = card
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: big ? 3 : 2, background: 'linear-gradient(90deg, #0284C7, #38BDF8)' }} />
      <div style={{ fontSize: 11, color: '#D1D5DB', letterSpacing: 1, marginBottom: 16 }}>{card.num}</div>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={20} color={card.color} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.3px', marginBottom: 8 }}>{card.title}</h3>
      <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
    </>
  )
}

// ── Desktop: 3D perspective fan ──────────────────────────────────────────────
function FanCard({ card, i }) {
  const { rot, ty } = layoutFor(i)
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 44 },
        // Resting state — no per-card delay here (the parent staggers the reveal),
        // so returning from hover animates back instantly and smoothly.
        show: {
          opacity: 1, y: ty, rotate: rot,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      whileHover={{ rotate: 0, scale: 1.06, zIndex: 10, transition: { duration: 0.26, ease: 'easeOut' } }}
      style={{
        width: 186, minHeight: 300, flexShrink: 0,
        willChange: 'transform',
        background: '#fff', border: '1px solid #E5E7EB', borderRadius: 18,
        padding: '24px 20px', position: 'relative', zIndex: 1, overflow: 'hidden',
        boxShadow: '0 12px 34px rgba(16,24,40,0.09)',
        cursor: 'default',
      }}
    >
      <CardBody card={card} big />
    </motion.div>
  )
}

// ── Mobile / tablet: readable grid ───────────────────────────────────────────
function GridCard({ card, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      style={{
        background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16,
        padding: '28px 24px', position: 'relative', overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', cursor: 'default',
      }}
    >
      <CardBody card={card} />
    </motion.div>
  )
}

export default function Features() {
  // A 6-card 3D fan only makes sense on wide screens; below that we fall back
  // to the plain grid so every tool stays fully readable.
  const [fan, setFan] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 992)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 992px)')
    const apply = () => setFan(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    <section style={{ background: '#F9FAFB', padding: '120px 48px', borderTop: '1px solid #F3F4F6', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 72, gap: 40, flexWrap: 'wrap' }}
        >
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, paddingBottom: 0 }}>
              WHAT WE OFFER
            </p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-2px', color: '#0A0A0A', lineHeight: 1.1, margin: 0 }}>
              Six AI Tools That
              <br />
              <span style={{ background: 'linear-gradient(135deg, #0284C7, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Transform
              </span>
              {' '}Your
              <br />
              Freelancing.
            </h2>
          </div>

          <p style={{ fontSize: 16, color: '#9CA3AF', maxWidth: 300, lineHeight: 1.7, margin: 0, paddingTop: 56 }}>
            From winning proposals to smart pricing — every tool you need to succeed as a freelancer in one place.
          </p>
        </motion.div>

        {fan ? (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14,
              padding: '48px 0',
            }}
          >
            {CARDS.map((card, i) => <FanCard key={card.num} card={card} i={i} />)}
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }} className="features-grid">
            {CARDS.map((card, i) => <GridCard key={card.num} card={card} index={i} />)}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) { .features-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
