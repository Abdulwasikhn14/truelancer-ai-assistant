import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [visible,  setVisible]  = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (sessionStorage.getItem('tl_loaded')) return
    setVisible(true)

    const steps = [20, 45, 70, 88, 100]
    let i = 0
    const tick = setInterval(() => {
      setProgress(steps[i])
      i++
      if (i >= steps.length) {
        clearInterval(tick)
        setTimeout(() => {
          setVisible(false)
          sessionStorage.setItem('tl_loaded', '1')
        }, 400)
      }
    }, 200)

    return () => clearInterval(tick)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          style={{
            position:       'fixed',
            inset:          0,
            zIndex:         100000,
            background:     '#ffffff',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            32,
          }}
        >
          {/* Logo mark */}
          <motion.img
            src="/logo.png"
            alt="Truelancer"
            style={{ width: 56, height: 56 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1, transition: { duration: 0.4 } }}
          />

          {/* Progress bar */}
          <div style={{ width: 180, height: 2, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg, #0284C7, #38BDF8)', borderRadius: 2 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          <p style={{ fontSize: 12, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Loading
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
