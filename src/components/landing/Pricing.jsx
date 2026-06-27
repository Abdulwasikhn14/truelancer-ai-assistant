import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const FEATURES = [
  'Unlimited AI Proposals',
  'Unlimited Gig Descriptions',
  'Unlimited Client Replies',
  'Unlimited AI Chatbot Access',
  'Unlimited Pricing Suggestions',
  'Analytics Dashboard',
  'History & Saved Content',
  'Google Sign-In',
  'No Credit Card Required',
  'Free Forever',
]

export default function Pricing() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section style={{ background: '#F9FAFB', padding: '120px 48px', borderTop: '1px solid #F3F4F6' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
            PRICING
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#0A0A0A', letterSpacing: '-2px', lineHeight: 1.1, margin: 0 }}>
            Simple.{' '}
            <span style={{ background: 'linear-gradient(135deg, #0284C7, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Honest.
            </span>
            {' '}Free.
          </h2>
        </div>

        {/* Card */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 480, margin: '0 auto' }}
        >
          <div
            style={{
              background:    '#ffffff',
              border:        '1px solid #E5E7EB',
              borderRadius:  24,
              padding:       '48px 40px',
              boxShadow:     '0 20px 60px rgba(0,0,0,0.06)',
              textAlign:     'center',
              position:      'relative',
              overflow:      'hidden',
            }}
          >
            {/* Top gradient line */}
            <div
              style={{
                position:   'absolute',
                top:        0,
                left:       0,
                right:      0,
                height:     3,
                background: 'linear-gradient(90deg, #0284C7, #38BDF8)',
              }}
            />

            {/* Plan label */}
            <p style={{ fontSize: 11, color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              FREE PLAN
            </p>

            {/* Price */}
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 72, fontWeight: 900, color: '#0A0A0A', letterSpacing: '-4px', lineHeight: 1 }}>
                $0
              </span>
              <span style={{ fontSize: 18, color: '#9CA3AF', fontWeight: 400 }}>/month</span>
            </div>

            {/* Forever free badge */}
            <div style={{ display: 'inline-block', marginBottom: 28 }}>
              <span
                style={{
                  background:   '#F0F9FF',
                  border:       '1px solid #BAE6FD',
                  color:        '#0284C7',
                  borderRadius: 100,
                  padding:      '4px 14px',
                  fontSize:     12,
                  fontWeight:   600,
                }}
              >
                Forever Free
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#F3F4F6', marginBottom: 28 }} />

            {/* Features list */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                  <CheckCircle size={18} color="#10B981" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link to="/signup" style={{ textDecoration: 'none', display: 'block' }}>
              <button
                style={{
                  width:        '100%',
                  background:   'linear-gradient(135deg, #0284C7, #38BDF8)',
                  border:       'none',
                  borderRadius: 10,
                  padding:      16,
                  color:        'white',
                  fontSize:     15,
                  fontWeight:   700,
                  boxShadow:    '0 4px 20px rgba(2,132,199,0.3)',
                  transition:   'opacity 0.2s, transform 0.2s',
                  fontFamily:   'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1';   e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Get Started Free →
              </button>
            </Link>

            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 14 }}>
              No credit card required • Cancel anytime
            </p>
          </div>
        </motion.div>

        {/* Coming soon note */}
        <p style={{ textAlign: 'center', fontSize: 13, color: '#9CA3AF', marginTop: 32 }}>
          Pro &amp; Agency plans with advanced features coming soon 🚀
        </p>
      </div>
    </section>
  )
}
