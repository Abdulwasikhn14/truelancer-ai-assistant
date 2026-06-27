import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, FileText } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const SECTIONS = [
  {
    num: '01',
    title: 'Acceptance of Terms',
    body: `By creating an account or using any part of the Truelancer platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you are using Truelancer on behalf of an organization, you represent that you have authority to bind that organization to these terms.

If you do not agree with any part of these terms, you must not use the platform. We reserve the right to update these terms, and your continued use after changes are posted constitutes acceptance.`,
  },
  {
    num: '02',
    title: 'Account Registration',
    body: `To access Truelancer's features, you must create an account with a valid email address. You are responsible for maintaining the confidentiality of your password and for all activity that occurs under your account.

You must not create accounts for others without their consent, use automated methods to create multiple accounts, or impersonate any person or entity. You must notify us immediately if you suspect unauthorized access to your account at security@truelancer.app.`,
  },
  {
    num: '03',
    title: 'Permitted Use',
    body: `Truelancer is intended for legitimate freelance business activities including writing proposals, managing client relationships, analyzing market data, and optimizing service offerings. You may use the platform for personal or commercial purposes provided you comply with these terms.

You may not use Truelancer to violate any applicable laws, infringe intellectual property rights, send spam or unsolicited communications, scrape or bulk-download platform data, or attempt to gain unauthorized access to other users' accounts or data.`,
  },
  {
    num: '04',
    title: 'AI-Generated Content',
    body: `Truelancer uses artificial intelligence to help generate proposals, descriptions, and recommendations. You acknowledge that AI-generated content may not always be accurate, complete, or appropriate for your specific situation.

You are solely responsible for reviewing, editing, and approving any AI-generated content before using it. You retain ownership of the final content you submit to clients. We make no guarantees that AI-assisted proposals will result in winning jobs or achieving specific business outcomes.`,
  },
  {
    num: '05',
    title: 'Subscription & Billing',
    body: `Truelancer offers free and paid subscription tiers. Paid subscriptions are billed monthly or annually in advance. By subscribing, you authorize us to charge your payment method on a recurring basis until you cancel.

You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period — we do not provide prorated refunds for unused time. If a payment fails, we will retry up to three times before suspending your account.`,
  },
  {
    num: '06',
    title: 'Refund Policy',
    body: `We offer a 7-day money-back guarantee for first-time paid subscriptions. If you are not satisfied for any reason, contact us at billing@truelancer.app within 7 days of your first payment and we will issue a full refund.

After the 7-day window, subscription fees are non-refundable. We may issue discretionary credits or refunds in cases of technical errors that prevented you from using the service for an extended period, at our sole discretion.`,
  },
  {
    num: '07',
    title: 'Intellectual Property',
    body: `Truelancer and its original content, features, and functionality are owned by Truelancer and protected by international copyright, trademark, and other intellectual property laws. Our trademarks may not be used without our prior written consent.

You retain all rights to the content you create using our tools. By using Truelancer, you grant us a limited, non-exclusive license to process and store your content solely for the purpose of providing the service. We do not claim ownership over your proposals, gig descriptions, or other user-generated content.`,
  },
  {
    num: '08',
    title: 'Third-Party Platforms',
    body: `Truelancer may integrate with third-party platforms such as Upwork, LinkedIn, or Fiverr. Your use of those platforms is governed by their respective terms of service. We are not affiliated with, endorsed by, or responsible for the policies or practices of any third-party platform.

When you connect a third-party account, you grant us permission to read the data you authorize. You may disconnect any third-party integration at any time from your account settings. We are not liable for changes to third-party APIs that affect Truelancer features.`,
  },
  {
    num: '09',
    title: 'Limitation of Liability',
    body: `To the fullest extent permitted by applicable law, Truelancer and its officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or business opportunities.

Our total liability to you for any claims arising from your use of the platform shall not exceed the amount you paid to Truelancer in the 12 months preceding the claim. Some jurisdictions do not allow limitation of liability for certain damages — in such cases, our liability is limited to the maximum extent permitted by law.`,
  },
  {
    num: '10',
    title: 'Dispute Resolution',
    body: `Any disputes arising from these terms or your use of Truelancer shall be resolved through binding arbitration in accordance with the rules of the International Chamber of Commerce, except that either party may seek injunctive relief in a court of competent jurisdiction for intellectual property infringement.

You and Truelancer agree to resolve disputes individually. Class action lawsuits and class arbitrations are not permitted. If any portion of this section is found unenforceable, the remaining portions continue in full force and effect.`,
  },
  {
    num: '11',
    title: 'Governing Law',
    body: `These Terms of Service are governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions. For users in the European Union, mandatory consumer protection laws of your country of residence may apply in addition to these terms.

If you have questions about these terms, contact us at legal@truelancer.app. We aim to respond to all legal inquiries within 5 business days.`,
  },
]

const CARD = {
  background: '#ffffff',
  border: '1px solid #E5E7EB',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

export default function Terms() {
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
            <FileText className="w-8 h-8" style={{ color: '#38BDF8' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: '#0A0A0A' }}
          >
            Terms of{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0284C7, #38BDF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Service</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5 }}
            className="max-w-xl mx-auto mb-3"
            style={{ color: '#6B7280' }}
          >
            Please read these terms carefully before using Truelancer. They explain your rights and responsibilities as a user.
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
                transition={{ delay: i * 0.05, duration: 0.45 }}
                style={{ ...CARD, padding: 32 }}
              >
                <div className="flex items-start gap-5">
                  <span
                    className="text-3xl font-black flex-shrink-0 leading-none"
                    style={{ color: 'rgba(56,189,248,0.2)', fontVariantNumeric: 'tabular-nums' }}
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
                Questions about these terms?{' '}
                <a
                  href="mailto:legal@truelancer.app"
                  style={{ color: '#0284C7', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  legal@truelancer.app
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
