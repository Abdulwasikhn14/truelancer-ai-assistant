import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'

const CONSENT_KEY = 'cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  const dismiss = () => setVisible(false)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-5 left-4 right-4 z-[100] flex justify-center"
        >
          <div
            className="w-full max-w-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl px-5 py-4"
            style={{
              background:           '#ffffff',
              border:               '1px solid #E5E7EB',
              boxShadow:            '0 8px 32px rgba(0,0,0,0.08)',
              borderRadius:         12,
            }}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)' }}
            >
              <Cookie className="w-5 h-5" style={{ color: '#0284C7' }} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-0.5" style={{ color: '#0A0A0A' }}>We use cookies</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                We use cookies to improve your experience and analyze usage.{' '}
                <Link
                  to="/cookies"
                  style={{ color: '#0284C7', textDecoration: 'underline', textUnderlineOffset: 2 }}
                >
                  Learn more
                </Link>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/cookies" onClick={dismiss}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-xs px-4 py-2 whitespace-nowrap"
                  style={{
                    background:   '#ffffff',
                    color:        '#374151',
                    border:       '1px solid #E5E7EB',
                    borderRadius: 8,
                    fontWeight:   500,
                    cursor:       'pointer',
                    fontFamily:   'Manrope, sans-serif',
                  }}
                >
                  Manage
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(2,132,199,0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={accept}
                className="text-xs px-4 py-2 whitespace-nowrap"
                style={{
                  background:   'linear-gradient(135deg, #0284C7, #6D4FF0)',
                  color:        '#fff',
                  border:       'none',
                  borderRadius: 8,
                  fontWeight:   600,
                  cursor:       'pointer',
                  fontFamily:   'Manrope, sans-serif',
                  boxShadow:    '0 4px 14px rgba(2,132,199,0.3)',
                }}
              >
                Accept All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={dismiss}
                aria-label="Dismiss"
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#9CA3AF' }}
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
