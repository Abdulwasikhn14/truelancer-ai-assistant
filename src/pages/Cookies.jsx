import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Cookie } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const COOKIE_TYPES = [
  {
    name: 'Strictly Necessary',
    color: '#10b981',
    canDisable: false,
    purpose: 'Keep you logged in, maintain your session security, and remember your consent preferences.',
    examples: 'session_token, cookie_consent, csrf_token',
    retention: 'Session / 30 days',
  },
  {
    name: 'Analytics',
    color: '#0284C7',
    canDisable: true,
    purpose: 'Help us understand how users navigate the app so we can improve features and fix performance issues.',
    examples: 'ph_session, posthog_distinct_id',
    retention: '12 months',
  },
  {
    name: 'Preferences',
    color: '#38BDF8',
    canDisable: true,
    purpose: 'Remember your UI settings like sidebar state, theme overrides, and selected language.',
    examples: 'ui_prefs, locale',
    retention: '12 months',
  },
]

const SECTIONS = [
  {
    num: '01',
    title: 'What Are Cookies?',
    body: `Cookies are small text files stored on your device by your web browser when you visit a website. They allow the site to remember information about your visit — like whether you're logged in or what language you prefer — so you don't have to set it up again on every page load.

Cookies are not programs and cannot access other data on your device. They are a standard mechanism used across the internet and are essential to how modern web applications function.`,
  },
  {
    num: '02',
    title: 'Cookies We Use',
    body: `We use three categories of cookies on Truelancer. See the table below for specifics. We do not use advertising cookies, retargeting pixels, or tracking cookies that follow you across other websites.

All cookies set by Truelancer originate from the truelancer.app domain. We do not allow third-party advertisers to set cookies through our platform.`,
  },
  {
    num: '03',
    title: 'Third-Party Cookies',
    body: `Our analytics provider (Posthog) may set cookies to track anonymous usage patterns. These cookies do not contain personally identifiable information and are used only to aggregate product analytics data.

Our payment processor (Stripe) may set cookies during the checkout flow to prevent fraud. These cookies are strictly necessary for secure payment processing and cannot be disabled without disabling payments entirely.`,
  },
  {
    num: '04',
    title: 'Managing Your Preferences',
    body: `You can control cookie settings in several ways:

• Cookie banner: Use the "Manage Cookies" option when the banner appears on your first visit
• Browser settings: Most browsers let you block or delete cookies via their privacy/settings menu
• Opt-out tools: For Posthog analytics, you can opt out at posthog.com/privacy

Note that blocking strictly necessary cookies will prevent you from logging in or using core platform features. We recommend allowing at minimum the strictly necessary category.`,
  },
  {
    num: '05',
    title: 'Changes to This Policy',
    body: `We may update this Cookie Policy when we add new features or change our analytics tools. We will notify you of significant changes via email or the in-app cookie banner.

If you have questions about our use of cookies, contact us at privacy@truelancer.app. For general privacy questions, see our Privacy Policy.`,
  },
]

const CARD = {
  background: '#ffffff',
  border: '1px solid #E5E7EB',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

export default function Cookies() {
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

        {/* ── Header ── */}
        <section className="py-20 px-4 text-center" style={{ background: '#F9FAFB' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)' }}
          >
            <Cookie className="w-8 h-8" style={{ color: '#38BDF8' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: '#0A0A0A' }}
          >
            Cookie{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0284C7, #38BDF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Policy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5 }}
            className="max-w-xl mx-auto mb-3"
            style={{ color: '#6B7280' }}
          >
            We use only what we need. Here's a plain-language breakdown of every cookie we set and why.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-sm"
            style={{ color: '#9CA3AF' }}
          >
            Last updated: May 1, 2026
          </motion.p>
        </section>

        {/* ── Cookie Types ── */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-bold mb-6 text-center"
              style={{ color: '#0A0A0A' }}
            >
              Cookie Categories
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {COOKIE_TYPES.map(({ name, color, canDisable, purpose, examples, retention }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  style={{ ...CARD, padding: 24 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm" style={{ color: '#0A0A0A' }}>{name}</h3>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={
                        canDisable
                          ? { background: 'rgba(2,132,199,0.08)', color: '#0284C7', border: '1px solid rgba(2,132,199,0.2)' }
                          : { background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }
                      }
                    >
                      {canDisable ? 'Optional' : 'Required'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: '#6B7280' }}>{purpose}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Examples</p>
                      <p className="text-xs font-mono" style={{ color: '#6B7280' }}>{examples}</p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Retention</p>
                      <p className="text-xs font-semibold" style={{ color }}>{retention}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sections ── */}
        <section className="pb-24 px-4 pt-4" style={{ background: '#F9FAFB' }}>
          <div className="max-w-3xl mx-auto space-y-6 pt-8">
            {SECTIONS.map(({ num, title, body }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                style={{ ...CARD, padding: 32 }}
              >
                <div className="flex items-start gap-5">
                  <span
                    className="text-3xl font-black flex-shrink-0 leading-none"
                    style={{ color: 'rgba(255,101,132,0.2)', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {num}
                  </span>
                  <div>
                    <h2 className="font-bold text-xl mb-4" style={{ color: '#0A0A0A' }}>{title}</h2>
                    <div className="text-sm leading-relaxed space-y-3" style={{ color: '#6B7280' }}>
                      {body.split('\n\n').map((para, j) => (
                        <p key={j} className="whitespace-pre-line">{para}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="text-center pt-4"
            >
              <p className="text-sm" style={{ color: '#9CA3AF' }}>
                Questions?{' '}
                <a
                  href="mailto:privacy@truelancer.app"
                  style={{ color: '#0284C7', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  privacy@truelancer.app
                </a>
                {' '}·{' '}
                <Link
                  to="/privacy"
                  style={{ color: '#0284C7', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  Privacy Policy
                </Link>
              </p>
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
