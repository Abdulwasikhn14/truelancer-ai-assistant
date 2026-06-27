import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' })
      gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.35, ease: 'power2.out' })
    }

    const onEnterClickable = () => {
      gsap.to(dot,  { scale: 2,   duration: 0.25, ease: 'back.out(2)' })
      gsap.to(ring, { scale: 1.5, opacity: 0.5, duration: 0.25, ease: 'back.out(2)' })
    }

    const onLeaveClickable = () => {
      gsap.to(dot,  { scale: 1, duration: 0.25, ease: 'back.out(2)' })
      gsap.to(ring, { scale: 1, opacity: 1,   duration: 0.25, ease: 'back.out(2)' })
    }

    const onMouseDown = () => gsap.to(dot, { scale: 0.7, duration: 0.1 })
    const onMouseUp   = () => gsap.to(dot, { scale: 1,   duration: 0.1 })

    const attachToClickables = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label').forEach((el) => {
        el.addEventListener('mouseenter', onEnterClickable)
        el.addEventListener('mouseleave', onLeaveClickable)
      })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup',   onMouseUp)
    attachToClickables()

    // Re-attach when DOM changes (e.g. route navigation)
    const observer = new MutationObserver(attachToClickables)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup',   onMouseUp)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         8,
          height:        8,
          background:    '#0284C7',
          borderRadius:  '50%',
          pointerEvents: 'none',
          zIndex:        99999,
          mixBlendMode:  'difference',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         36,
          height:        36,
          border:        '1.5px solid rgba(2,132,199,0.6)',
          borderRadius:  '50%',
          pointerEvents: 'none',
          zIndex:        99998,
        }}
      />
    </>
  )
}
