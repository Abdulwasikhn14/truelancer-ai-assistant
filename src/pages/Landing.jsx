import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import Navbar       from '../components/layout/Navbar'
import Hero         from '../components/landing/Hero'
import Features     from '../components/landing/Features'
import HowItWorks   from '../components/landing/HowItWorks'
import Pricing      from '../components/landing/Pricing'
import Testimonials from '../components/landing/Testimonials'
import CTA          from '../components/landing/CTA'
import Footer       from '../components/layout/Footer'

export default function Landing() {
  const [showBTT, setShowBTT] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBTT(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <main>
        <Hero />
        <div id="features"><Features /></div>
        <div id="howitworks"><HowItWorks /></div>
        <div id="pricing"><Pricing /></div>
        <Testimonials />
        <CTA />
      </main>

      <Footer />

      <AnimatePresence>
        {showBTT && (
          <motion.button
            key="btt"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            style={{
              position:       'fixed',
              bottom:         32,
              right:          32,
              width:          44,
              height:         44,
              background:     '#0284C7',
              border:         'none',
              borderRadius:   '50%',
              color:          'white',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      '0 4px 20px rgba(2,132,199,0.35)',
              zIndex:         50,
            }}
            initial={{ opacity: 0, scale: 0.7, y: 16 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{    opacity: 0, scale: 0.7, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
