import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration:  1.2,
      easing:    (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
    })

    lenisRef.current = lenis

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Allow anchor-scroll to work by forwarding native scrollIntoView calls
    const origScrollIntoView = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function (options) {
      if (options && typeof options === 'object' && options.behavior === 'smooth') {
        lenis.scrollTo(this, { offset: -80, duration: 1 })
      } else {
        origScrollIntoView.call(this, options)
      }
    }

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      Element.prototype.scrollIntoView = origScrollIntoView
    }
  }, [])

  return <>{children}</>
}
