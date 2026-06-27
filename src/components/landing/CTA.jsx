import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CTA() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [email, setEmail] = useState('')

  return (
    <section
      ref={ref}
      style={{
        background: '#0A0A0A',
        padding:    '120px 48px',
        textAlign:  'center',
        position:   'relative',
        overflow:   'hidden',
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position:      'absolute',
          top:           '50%',
          left:          '50%',
          transform:     'translate(-50%, -50%)',
          width:          800,
          height:         400,
          background:    'radial-gradient(ellipse, rgba(2,132,199,0.12) 0%, transparent 65%)',
          filter:        'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Heading */}
          <h2
            style={{
              fontSize:      'clamp(36px, 5vw, 64px)',
              fontWeight:    800,
              color:         'white',
              letterSpacing: '-2px',
              lineHeight:    1.1,
              marginBottom:  20,
            }}
          >
            Ready to Transform
            <br />
            Your Freelancing?
          </h2>

          {/* Subtext */}
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginBottom: 48, lineHeight: 1.6 }}>
            Join 10,000+ freelancers winning more clients
          </p>

          {/* Email + button */}
          <div
            style={{
              display:        'flex',
              gap:            10,
              justifyContent: 'center',
              flexWrap:       'wrap',
              maxWidth:       560,
              margin:         '0 auto',
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                background:  'rgba(255,255,255,0.06)',
                border:      '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding:     '14px 20px',
                color:       'white',
                fontSize:    14,
                outline:     'none',
                width:       320,
                fontFamily:  'inherit',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(2,132,199,0.5)' }}
              onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            />
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background:   '#0284C7',
                  border:       'none',
                  borderRadius: 8,
                  padding:      '14px 28px',
                  color:        'white',
                  fontSize:     14,
                  fontWeight:   600,
                  fontFamily:   'inherit',
                  whiteSpace:   'nowrap',
                  transition:   'background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#6D4EE8' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0284C7' }}
              >
                Get Started Free →
              </button>
            </Link>
          </div>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 20 }}>
            No credit card required &nbsp;•&nbsp; Free forever
          </p>
        </motion.div>
      </div>
    </section>
  )
}
