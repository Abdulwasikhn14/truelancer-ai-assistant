import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Mail, Clock, Globe, Timer, CheckCircle2, Send } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const XIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12 24 5.373 18.627 0 12 0z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const INFO_CARDS = [
  { icon: Mail,  color: '#0284C7', label: 'Email',         value: 'support@truelancer.app' },
  { icon: Clock, color: '#00D4FF', label: 'Response Time', value: 'Within 24 hours' },
  { icon: Globe, color: '#10b981', label: 'Available',     value: 'Worldwide' },
  { icon: Timer, color: '#38BDF8', label: 'Hours',         value: 'Mon–Fri, 9AM–6PM PKT' },
]

const SOCIALS = [
  { icon: GithubIcon,   label: 'GitHub',    href: 'https://github.com',   color: '#0284C7' },
  { icon: LinkedInIcon, label: 'LinkedIn',  href: 'https://linkedin.com', color: '#00D4FF' },
  { icon: XIcon,        label: 'Twitter/X', href: 'https://twitter.com',  color: '#38BDF8' },
]

const SUBJECTS = [
  'General Inquiry',
  'Technical Support',
  'Feature Request',
  'Bug Report',
  'Partnership',
]

const CARD = {
  background: '#ffffff',
  border: '1px solid #E5E7EB',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

const baseInput = {
  background: '#F9FAFB',
  border: '1px solid #E5E7EB',
  borderRadius: 10,
  color: '#0A0A0A',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  fontFamily: 'Manrope, sans-serif',
  fontSize: 14,
}

export default function Contact() {
  const [showBTT, setShowBTT] = useState(false)
  const [form, setForm]       = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const onScroll = () => setShowBTT(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setSending(true)
    await new Promise((r) => setTimeout(r, 1400))
    setSending(false)
    setSent(true)
  }

  const fieldStyle = (name) => ({
    ...baseInput,
    borderColor: focused === name ? '#0284C7' : '#E5E7EB',
    boxShadow:   focused === name ? '0 0 0 3px rgba(2,132,199,0.08)' : 'none',
    background:  focused === name ? '#ffffff' : '#F9FAFB',
  })

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      <Navbar />

      <main className="pt-20">

        {/* ── Header ── */}
        <section className="py-20 px-4 text-center" style={{ background: '#ffffff' }}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: '#0A0A0A' }}
          >
            Get in{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0284C7, #38BDF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="max-w-xl mx-auto"
            style={{ color: '#6B7280' }}
          >
            Have a question, idea, or issue? We'd love to hear from you.
          </motion.p>
        </section>

        {/* ── Two-column layout ── */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* ── Left: Info + Socials ── */}
            <div className="space-y-5">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="text-sm leading-relaxed mb-2"
                style={{ color: '#6B7280' }}
              >
                We're a small team, but we respond quickly. Reach out through the form or directly via email.
              </motion.p>

              {INFO_CARDS.map(({ icon: Icon, color, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="flex items-center gap-4"
                  style={{ ...CARD, padding: 20 }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{label}</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: '#0A0A0A' }}>{value}</p>
                  </div>
                </motion.div>
              ))}

              {/* Socials */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.45 }}
                style={{ ...CARD, padding: 20 }}
              >
                <p className="text-sm font-semibold mb-4" style={{ color: '#374151' }}>Find us on</p>
                <div className="flex gap-3">
                  {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      whileHover={{ scale: 1.12, y: -2 }}
                      transition={{ duration: 0.18 }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}
                    >
                      <Icon />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── Right: Form ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ ...CARD, padding: 32 }}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="relative mb-6">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
                      >
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#0A0A0A' }}>Message Sent!</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                      We'll get back to you within 24 hours.
                    </p>
                    <motion.button
                      onClick={() => { setSent(false); setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' }) }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-8 text-sm px-6 py-2.5"
                      style={{
                        background: '#ffffff',
                        color: '#0A0A0A',
                        border: '1px solid #E5E7EB',
                        borderRadius: 10,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                    >
                      Send another message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    <h2 className="text-xl font-bold mb-2" style={{ color: '#0A0A0A' }}>Send a Message</h2>

                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: '#374151', fontWeight: 500 }} htmlFor="name">Full Name</label>
                      <input
                        id="name" name="name" type="text" required
                        value={form.name} onChange={handleChange}
                        placeholder="Jane Doe"
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        style={{ ...fieldStyle('name'), padding: '12px 16px' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: '#374151', fontWeight: 500 }} htmlFor="email">Email Address</label>
                      <input
                        id="email" name="email" type="email" required
                        value={form.email} onChange={handleChange}
                        placeholder="you@example.com"
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        style={{ ...fieldStyle('email'), padding: '12px 16px' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: '#374151', fontWeight: 500 }} htmlFor="subject">Subject</label>
                      <select
                        id="subject" name="subject"
                        value={form.subject} onChange={handleChange}
                        onFocus={() => setFocused('subject')}
                        onBlur={() => setFocused(null)}
                        style={{ ...fieldStyle('subject'), padding: '12px 16px', cursor: 'pointer' }}
                      >
                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: '#374151', fontWeight: 500 }} htmlFor="message">Message</label>
                      <textarea
                        id="message" name="message" required rows={6}
                        value={form.message} onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        onFocus={() => setFocused('message')}
                        onBlur={() => setFocused(null)}
                        style={{ ...fieldStyle('message'), padding: '12px 16px', resize: 'vertical', minHeight: 140 }}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={sending}
                      whileHover={sending ? {} : { scale: 1.02, boxShadow: '0 8px 28px rgba(2,132,199,0.4)' }}
                      whileTap={sending ? {} : { scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, #0284C7, #6D4FF0)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        padding: '14px 24px',
                        cursor: 'pointer',
                        fontFamily: 'Manrope, sans-serif',
                        boxShadow: '0 4px 16px rgba(2,132,199,0.3)',
                      }}
                    >
                      {sending ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </section>

      </main>

      <Footer />

      <AnimatePresence>
        {showBTT && (
          <motion.button
            key="btt"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#0284C7,#38BDF8)', boxShadow: '0 0 18px rgba(2,132,199,0.5)' }}
            initial={{ opacity: 0, scale: 0.65, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.65, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp size={20} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
