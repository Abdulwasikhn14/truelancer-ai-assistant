import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, Search, Rocket, Bot, Shield, CreditCard, MessageSquare } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const QUICK_LINKS = [
  { icon: Rocket,     color: '#0284C7', title: 'Getting Started',    desc: 'Set up your account and connect your freelance platforms in minutes.',  href: '#getting-started' },
  { icon: Bot,        color: '#00D4FF', title: 'AI Features',        desc: 'Learn how our proposal generator and chatbot assistant work.',           href: '#ai-features' },
  { icon: CreditCard, color: '#10b981', title: 'Billing & Plans',    desc: 'Manage your subscription, upgrade, or request a refund.',                href: '#billing' },
  { icon: Shield,     color: '#38BDF8', title: 'Account & Security', desc: 'Change your password, enable 2FA, or delete your account.',              href: '#account' },
]

const FAQ_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    color: '#0284C7',
    faqs: [
      {
        q: 'How do I create a Truelancer account?',
        a: 'Click "Get Started" on the homepage, enter your email and a password, then verify your email. You can also sign up instantly using your Google account — no email verification needed.',
      },
      {
        q: 'Which freelance platforms does Truelancer support?',
        a: 'Truelancer currently supports Upwork, Fiverr, and LinkedIn. We\'re actively working on Freelancer.com and Toptal integrations. You can use the proposal generator for any platform even without a direct connection.',
      },
      {
        q: 'How do I connect my Upwork account?',
        a: 'Go to Dashboard → Profile → Connected Accounts and click "Connect Upwork." You\'ll be redirected to Upwork to authorize the connection. We only request read access to your profile and job history — we never post on your behalf.',
      },
      {
        q: 'Is there a free plan?',
        a: 'Yes. The free plan includes 5 AI proposal generations per month, basic gig analysis, and access to the help center. Paid plans unlock unlimited proposals, advanced analytics, and priority support.',
      },
      {
        q: 'Can I use Truelancer on mobile?',
        a: 'Yes — the web app is fully responsive and works on all modern mobile browsers. A dedicated iOS/Android app is on our roadmap for Q3 2026.',
      },
    ],
  },
  {
    id: 'ai-features',
    title: 'AI Features',
    color: '#00D4FF',
    faqs: [
      {
        q: 'How does the AI proposal generator work?',
        a: 'You paste the job description into the proposal tool and answer a few questions about your relevant experience. The AI drafts a personalized proposal in seconds. You can then edit, regenerate, or copy it. The more context you give, the better the output.',
      },
      {
        q: 'Will clients know my proposal was AI-assisted?',
        a: 'No — the proposal is generated as a draft for you to review and edit. We strongly recommend personalizing it with specific details about the client\'s project before sending. Think of it as a first draft, not a finished product.',
      },
      {
        q: 'What is the AI chatbot used for?',
        a: 'The AI chatbot (Dashboard → Chatbot) can answer questions about your Truelancer account, help you draft follow-up messages, suggest improvements to your gig descriptions, and give advice on freelance strategy. It doesn\'t have access to external platforms.',
      },
      {
        q: 'How accurate is the gig pricing recommendation?',
        a: 'Pricing recommendations are based on anonymized data from our platform and publicly available market data. They are a starting point, not a guarantee. Actual rates depend heavily on your portfolio, reviews, and the client\'s budget.',
      },
      {
        q: 'Can I train the AI on my own writing style?',
        a: 'Not yet — but it\'s one of our most-requested features. We\'re building a style profile system that will let you upload past proposals and let the AI match your tone. Expected in Q2 2026.',
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & Plans',
    color: '#10b981',
    faqs: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) and PayPal. All payments are processed securely by Stripe. We do not store your card details.',
      },
      {
        q: 'Can I switch between monthly and annual billing?',
        a: 'Yes. You can switch from monthly to annual billing at any time — you\'ll get a prorated credit for the remaining days on your current cycle. Switching from annual to monthly takes effect at the end of your annual period.',
      },
      {
        q: 'How do I cancel my subscription?',
        a: 'Go to Dashboard → Settings → Billing and click "Cancel Subscription." Your access continues until the end of the current billing period. You won\'t be charged again after cancellation.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'We offer a 7-day money-back guarantee for first-time paid subscriptions. Email billing@truelancer.app within 7 days of your first payment with your account email and reason — we\'ll process the refund within 2 business days.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & Security',
    color: '#38BDF8',
    faqs: [
      {
        q: 'How do I change my password?',
        a: 'Go to Dashboard → Profile → Security and click "Change Password." You\'ll need to enter your current password before setting a new one. If you forgot your password, use the "Forgot Password" link on the login page.',
      },
      {
        q: 'Does Truelancer support two-factor authentication?',
        a: 'Not yet — 2FA with an authenticator app is on our roadmap for Q2 2026. In the meantime, we strongly recommend using a unique, strong password and a password manager.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Dashboard → Settings → Account and scroll to the bottom to find "Delete Account." This permanently deletes all your data. If you\'d prefer to pause your account instead, consider downgrading to the free plan first.',
      },
      {
        q: 'How do I download a copy of my data?',
        a: 'Email privacy@truelancer.app with your account email and subject line "Data Export Request." We will send you a complete export of your account data in JSON format within 30 days, as required by GDPR.',
      },
      {
        q: 'What do I do if I suspect my account was compromised?',
        a: 'Change your password immediately and email security@truelancer.app. We\'ll help you audit recent activity, revoke any connected OAuth tokens, and secure your account. We respond to security issues within 24 hours.',
      },
    ],
  },
]

const CARD = {
  background: '#ffffff',
  border: '1px solid #E5E7EB',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        borderBottom: '1px solid #F3F4F6',
        background: open ? '#F0F9FF' : 'transparent',
        borderLeft: open ? '3px solid #0284C7' : '3px solid transparent',
        paddingLeft: open ? 12 : 0,
        marginLeft: open ? -3 : 0,
        transition: 'background 0.2s, border-left-color 0.2s',
        borderRadius: open ? '0 8px 8px 0' : 0,
      }}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span
          className="text-sm font-medium transition-colors"
          style={{ color: open ? '#0284C7' : '#0A0A0A' }}
        >
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4" style={{ color: '#9CA3AF' }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-sm leading-relaxed pb-5" style={{ color: '#6B7280' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HelpCenter() {
  const [showBTT, setShowBTT] = useState(false)
  const [query, setQuery]     = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    const onScroll = () => setShowBTT(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filtered = query.trim()
    ? FAQ_SECTIONS.map((sec) => ({
        ...sec,
        faqs: sec.faqs.filter(
          ({ q, a }) =>
            q.toLowerCase().includes(query.toLowerCase()) ||
            a.toLowerCase().includes(query.toLowerCase()),
        ),
      })).filter((sec) => sec.faqs.length > 0)
    : FAQ_SECTIONS

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      <main className="pt-20">

        {/* ── Hero + Search ── */}
        <section className="py-20 px-4 text-center" style={{ background: '#F9FAFB' }}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: '#0A0A0A' }}
          >
            Help{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0284C7, #38BDF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Center</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="max-w-xl mx-auto mb-8"
            style={{ color: '#6B7280' }}
          >
            Find answers to common questions, or reach out and we'll respond within 24 hours.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative max-w-lg mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search questions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none"
              style={{
                background: '#ffffff',
                border: '1px solid #E5E7EB',
                color: '#0A0A0A',
                fontFamily: 'Manrope, sans-serif',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            />
          </motion.div>
        </section>

        {/* ── Quick Links ── */}
        {!query && (
          <section className="py-16 px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {QUICK_LINKS.map(({ icon: Icon, color, title, desc, href }, i) => (
                <motion.a
                  key={title}
                  href={href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  whileHover={{ y: -4 }}
                  className="block"
                  style={{ ...CARD, padding: 20 }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5" style={{ color: '#0A0A0A' }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
                </motion.a>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQ Sections ── */}
        <section className="pb-24 px-4" style={{ background: query ? '#ffffff' : '#F9FAFB' }}>
          <div className="max-w-3xl mx-auto space-y-8 pt-8">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="mb-2" style={{ color: '#6B7280' }}>No results for "{query}"</p>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>Try different keywords or browse the sections below.</p>
              </motion.div>
            ) : (
              filtered.map(({ id, title, color, faqs }, i) => (
                <motion.div
                  key={id}
                  id={id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  style={{ ...CARD, padding: 28 }}
                >
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2.5" style={{ color: '#0A0A0A' }}>
                    <span
                      className="w-1.5 h-5 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    {title}
                  </h2>
                  <div>
                    {faqs.map(({ q, a }) => (
                      <FaqItem key={q} q={q} a={a} />
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* ── Still need help ── */}
        <section className="pb-24 px-4" style={{ background: '#ffffff' }}>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 text-center"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(2,132,199,0.2)',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(2,132,199,0.07)',
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)' }}
              >
                <MessageSquare className="w-6 h-6" style={{ color: '#0284C7' }} />
              </div>
              <h3 className="font-bold text-xl mb-2" style={{ color: '#0A0A0A' }}>Still need help?</h3>
              <p className="text-sm leading-relaxed mb-6 max-w-md mx-auto" style={{ color: '#6B7280' }}>
                Can't find what you're looking for? Our team responds to every message within 24 hours.
              </p>
              <Link to="/contact">
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
                  Contact Support
                </motion.button>
              </Link>
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
