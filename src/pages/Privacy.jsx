import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Shield } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const SECTIONS = [
  {
    num: '01',
    title: 'Information We Collect',
    body: `We collect information you provide directly when you create an account, use our services, or contact us for support. This includes your name, email address, and billing information. We also automatically collect usage data such as IP addresses, browser type, pages visited, and time spent on the platform. This helps us understand how freelancers use Truelancer so we can improve the experience.

When you connect third-party platforms (such as Upwork or LinkedIn), we access only the data you explicitly authorize. We do not store your third-party credentials — we use OAuth tokens that you can revoke at any time from your account settings.`,
  },
  {
    num: '02',
    title: 'How We Use Your Information',
    body: `We use your data to provide, improve, and personalize the Truelancer platform. Specifically, we use it to generate AI-powered proposals and recommendations, send transactional emails (account confirmations, invoices), analyze usage patterns to fix bugs and improve features, and respond to your support requests.

We do not use your data to train AI models that are sold or licensed to third parties. Your proposal content, gig descriptions, and account details are yours — we use them only to serve you within the platform.`,
  },
  {
    num: '03',
    title: 'Data Storage & Security',
    body: `All data is stored on servers located in the European Union and United States. We use AES-256 encryption for data at rest and TLS 1.3 for all data in transit. Passwords are hashed using bcrypt with a minimum cost factor of 12 — we never store plaintext passwords.

Access to production databases is restricted to authorized personnel only, protected by multi-factor authentication and audit logging. We conduct annual security audits and respond to verified vulnerability reports within 72 hours.`,
  },
  {
    num: '04',
    title: 'Third-Party Services',
    body: `We use a small number of trusted third-party services to operate the platform:

• Stripe — payment processing (we do not store card numbers)
• Resend — transactional email delivery
• Posthog — product analytics (anonymized, opt-out available)
• Cloudflare — CDN and DDoS protection

Each of these providers has been reviewed for GDPR compliance. We do not sell, rent, or share your personal data with advertisers or data brokers under any circumstances.`,
  },
  {
    num: '05',
    title: 'Your Rights',
    body: `Depending on your location, you may have the following rights regarding your personal data:

• Access: Request a copy of all data we hold about you
• Correction: Update inaccurate or incomplete information
• Deletion: Request erasure of your account and associated data
• Portability: Export your data in a machine-readable format
• Objection: Opt out of processing for analytics or marketing

To exercise any of these rights, email us at privacy@truelancer.app. We respond to all verified requests within 30 days. Users in the EU/EEA may also file a complaint with their local data protection authority.`,
  },
  {
    num: '06',
    title: 'Cookies & Tracking',
    body: `We use strictly necessary cookies to maintain your login session, and optional analytics cookies (Posthog) to understand how the product is used. We do not use advertising cookies or tracking pixels.

You can manage cookie preferences at any time through the cookie banner or your browser settings. Disabling optional cookies will not affect your ability to use the platform. For full details, see our Cookie Policy.`,
  },
  {
    num: '07',
    title: 'Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you via email and display a prominent notice in the app at least 14 days before the changes take effect. Your continued use of the platform after that date constitutes acceptance of the updated policy.

We keep historical versions of this policy available on request. If you have questions about any changes, contact us at privacy@truelancer.app before the effective date.`,
  },
]

const CARD = {
  background: '#ffffff',
  border: '1px solid #E5E7EB',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

export default function Privacy() {
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
            style={{ background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)' }}
          >
            <Shield className="w-8 h-8" style={{ color: '#0284C7' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: '#0A0A0A' }}
          >
            Privacy{' '}
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
            We believe privacy is a right, not a feature. Here's exactly what we collect, why, and how you can control it.
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

        {/* ── Sections ── */}
        <section className="pb-24 px-4 pt-12">
          <div className="max-w-3xl mx-auto space-y-6">
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
                    style={{ color: 'rgba(2,132,199,0.2)', fontVariantNumeric: 'tabular-nums' }}
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
                Questions about this policy?{' '}
                <a
                  href="mailto:privacy@truelancer.app"
                  style={{ color: '#0284C7', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  privacy@truelancer.app
                </a>
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
