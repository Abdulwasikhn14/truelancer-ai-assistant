import { motion } from 'framer-motion'
import { UserPlus, Layers, ClipboardList, Sparkles } from 'lucide-react'

const STEPS = [
  { num: '1', Icon: UserPlus,      title: 'Create Account',   desc: 'Sign up in seconds for free. No credit card needed.' },
  { num: '2', Icon: Layers,        title: 'Choose Your Tool', desc: 'Pick from 6 AI-powered freelancing tools.' },
  { num: '3', Icon: ClipboardList, title: 'Enter Details',    desc: 'Tell AI about your job, client, or project.' },
  { num: '4', Icon: Sparkles,      title: 'Get Results',      desc: 'Professional AI content generated in seconds.' },
]

export default function HowItWorks() {
  return (
    <section style={{ background: '#ffffff', padding: '120px 48px', borderTop: '1px solid #F3F4F6' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
            HOW IT WORKS
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#0A0A0A', letterSpacing: '-2px', lineHeight: 1.1, margin: 0 }}>
            Simple. Fast.{' '}
            <span style={{ background: 'linear-gradient(135deg, #0284C7, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Powerful.
            </span>
          </h2>
        </motion.div>

        <div style={{ position: 'relative' }}>

          {/* Static connecting line */}
          <div
            className="hiw-line"
            style={{
              position:   'absolute',
              top:        20,
              left:       '12.5%',
              right:      '12.5%',
              height:     1,
              background: 'linear-gradient(90deg, #0284C7, #38BDF8)',
              opacity:    0.25,
            }}
          />

          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}
            className="hiw-grid"
          >
            {STEPS.map((step, i) => {
              const { Icon } = step
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}
                >
                  {/* Number circle */}
                  <div
                    style={{
                      width:          40,
                      height:         40,
                      borderRadius:   '50%',
                      background:     i === 0 ? '#0284C7' : '#F9FAFB',
                      border:         '1px solid #E5E7EB',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      fontSize:       14,
                      fontWeight:     700,
                      color:          i === 0 ? 'white' : '#0284C7',
                      flexShrink:     0,
                      position:       'relative',
                      zIndex:         1,
                    }}
                  >
                    {step.num}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      width:          48,
                      height:         48,
                      borderRadius:   14,
                      background:     '#F9FAFB',
                      border:         '1px solid #F3F4F6',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={22} color="#0284C7" />
                  </div>

                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A0A0A', marginBottom: 6 }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.5, margin: 0 }}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hiw-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hiw-line { display: none !important; }
        }
        @media (max-width: 480px) {
          .hiw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
