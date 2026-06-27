import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Rocket, Heart, Shield, Zap, Users, TrendingUp, Globe } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

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

const STATS = [
  { value: '12K+',  label: 'Freelancers',     icon: Users },
  { value: '94%',   label: 'Win Rate Boost',  icon: TrendingUp },
  { value: '180+',  label: 'Countries',       icon: Globe },
  { value: '3.2M+', label: 'Proposals Sent',  icon: Rocket },
]

const VALUES = [
  {
    icon: Rocket,
    color: '#0284C7',
    title: 'Move Fast, Win More',
    desc: 'Speed wins deals. Every feature we ship puts hours back in freelancers\' hands — time better spent on actual work.',
  },
  {
    icon: Shield,
    color: '#00D4FF',
    title: 'Transparent by Default',
    desc: 'No dark patterns, no hidden fees, no data selling. We earn trust by being radically honest about what we do and why.',
  },
  {
    icon: Heart,
    color: '#38BDF8',
    title: 'Freelancer-First',
    desc: 'Every decision runs through one filter: does this make life better for independent workers? If not, we don\'t ship it.',
  },
]

const TIMELINE = [
  {
    year: '2023 Q1',
    title: 'The Idea',
    desc: 'After losing a $4,000 project because of a slow proposal response, our founder decided there had to be a smarter way.',
    color: '#0284C7',
  },
  {
    year: '2023 Q3',
    title: 'First Beta',
    desc: 'Shipped a rough prototype to 50 freelancers. Feedback was brutal and honest — we threw away half the features and rebuilt.',
    color: '#00D4FF',
  },
  {
    year: '2024 Q1',
    title: 'Public Launch',
    desc: 'Opened to the public with AI proposal generation, gig optimization, and real-time analytics. 1,000 users in week one.',
    color: '#10b981',
  },
  {
    year: '2024 Q4',
    title: 'Global Scale',
    desc: 'Crossed 12,000 active freelancers across 180+ countries. Launched multi-platform support and the AI chatbot assistant.',
    color: '#38BDF8',
  },
]

const CARD = {
  background: '#ffffff',
  border: '1px solid #E5E7EB',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

const GT = ({ children }) => (
  <span style={{
    background: 'linear-gradient(135deg, #0284C7, #38BDF8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }}>{children}</span>
)

export default function About() {
  const [showBTT, setShowBTT] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const onScroll = () => setShowBTT(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      <main className="pt-20">

        {/* ── Hero ── */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold"
              style={{ background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)', color: '#0284C7' }}
            >
              <Rocket className="w-3.5 h-3.5" />
              Our Story
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ color: '#0A0A0A' }}
            >
              Built by a freelancer,{' '}
              <GT>for freelancers</GT>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              className="text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: '#6B7280' }}
            >
              Truelancer started with a simple frustration: talented freelancers were losing work not because of skill,
              but because they couldn't respond fast enough or write compelling proposals. We fixed that.
            </motion.p>
          </div>
        </section>

        {/* ── Mission + Stats ── */}
        <section className="px-4 py-20" style={{ background: '#F9FAFB' }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-5" style={{ color: '#0A0A0A' }}>
                Our <GT>Mission</GT>
              </h2>
              <p className="leading-relaxed mb-5" style={{ color: '#6B7280' }}>
                We're on a mission to level the playing field for independent workers worldwide. The freelance economy
                should reward skill and hustle — not whoever has the best proposal template or the fastest internet connection.
              </p>
              <p className="leading-relaxed" style={{ color: '#6B7280' }}>
                Truelancer gives every freelancer access to AI tools that used to cost enterprise budgets. Smarter proposals,
                better-priced gigs, and real-time market data — all in one place, for a price that makes sense for solo workers.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ value, label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  style={{ ...CARD, padding: 24, textAlign: 'center' }}
                >
                  <Icon className="w-5 h-5 mx-auto mb-3" style={{ color: '#0284C7', opacity: 0.7 }} />
                  <p className="text-3xl font-bold mb-1" style={{
                    background: 'linear-gradient(135deg, #0284C7, #38BDF8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{value}</p>
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-20 px-4" style={{ background: '#ffffff' }}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl font-bold mb-3" style={{ color: '#0A0A0A' }}>
                What we <GT>stand for</GT>
              </h2>
              <p className="max-w-xl mx-auto" style={{ color: '#6B7280' }}>
                The principles that drive every product decision we make.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VALUES.map(({ icon: Icon, color, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{ ...CARD, padding: 28 }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${color}18`, border: `1px solid ${color}35` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#0A0A0A' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="py-20 px-4" style={{ background: '#F9FAFB' }}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl font-bold mb-3" style={{ color: '#0A0A0A' }}>
                How we got <GT>here</GT>
              </h2>
              <p className="max-w-xl mx-auto" style={{ color: '#6B7280' }}>
                From a lost project to a platform serving thousands.
              </p>
            </motion.div>

            <div className="relative">
              <div
                className="absolute left-8 top-0 bottom-0 w-px"
                style={{ background: 'linear-gradient(to bottom, rgba(2,132,199,0.4), rgba(255,101,132,0.15))' }}
              />
              <div className="space-y-10">
                {TIMELINE.map(({ year, title, desc, color }, i) => (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex gap-6 pl-20 relative"
                  >
                    <div
                      className="absolute left-5 top-1 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: `${color}15`, border: `2px solid ${color}` }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    </div>
                    <div style={{ ...CARD, padding: 24, flex: 1 }}>
                      <span className="text-xs font-semibold mb-2 block" style={{ color }}>{year}</span>
                      <h3 className="font-bold text-lg mb-2" style={{ color: '#0A0A0A' }}>{title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="py-20 px-4" style={{ background: '#ffffff' }}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl font-bold mb-3" style={{ color: '#0A0A0A' }}>
                Meet the <GT>team</GT>
              </h2>
              <p style={{ color: '#6B7280' }}>Small team, big ambitions.</p>
            </motion.div>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ ...CARD, padding: 32, maxWidth: 360, width: '100%', textAlign: 'center' }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-5"
                  style={{ background: 'linear-gradient(135deg,#0284C7,#38BDF8)', boxShadow: '0 4px 20px rgba(2,132,199,0.25)' }}
                >
                  AK
                </div>
                <h3 className="font-bold text-xl mb-1" style={{ color: '#0A0A0A' }}>Abdul Wasik</h3>
                <p className="text-sm mb-2" style={{ color: '#0284C7' }}>Founder &amp; Developer</p>
                <div className="flex items-center justify-center gap-1.5 text-xs mb-4" style={{ color: '#9CA3AF' }}>
                  <Globe className="w-3 h-3" />
                  <span>Karachi, Pakistan</span>
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B7280' }}>
                  Full-stack developer turned indie founder. Built Truelancer after years of freelancing taught him
                  that great work alone doesn't win great clients — great communication does.
                </p>
                <div className="flex justify-center gap-3">
                  <motion.a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#6B7280' }}
                  >
                    <GithubIcon />
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#6B7280' }}
                  >
                    <LinkedInIcon />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-4" style={{ background: '#F9FAFB' }}>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden p-10 text-center"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(2,132,199,0.2)',
                boxShadow: '0 4px 32px rgba(2,132,199,0.08)',
              }}
            >
              <div
                className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'rgba(2,132,199,0.06)', filter: 'blur(40px)' }}
              />
              <div
                className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'rgba(56,189,248,0.05)', filter: 'blur(40px)' }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)' }}
                >
                  <Zap className="w-6 h-6" style={{ color: '#0284C7' }} />
                </div>
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#0A0A0A' }}>Ready to win more work?</h2>
                <p className="mb-8 max-w-lg mx-auto" style={{ color: '#6B7280' }}>
                  Join thousands of freelancers already using Truelancer to write better proposals,
                  price smarter, and land more clients.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(2,132,199,0.4)' }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        background: 'linear-gradient(135deg, #0284C7, #6D4FF0)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        padding: '12px 28px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: 14,
                        boxShadow: '0 4px 16px rgba(2,132,199,0.3)',
                      }}
                    >
                      Get Started Free
                    </motion.button>
                  </Link>
                  <Link to="/contact">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        background: '#ffffff',
                        color: '#0A0A0A',
                        border: '1px solid #E5E7EB',
                        borderRadius: 10,
                        padding: '12px 28px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: 14,
                      }}
                    >
                      Contact Us
                    </motion.button>
                  </Link>
                </div>
              </div>
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
