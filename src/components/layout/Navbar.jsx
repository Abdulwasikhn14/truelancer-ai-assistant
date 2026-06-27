import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../ui/Logo'

function SmartAnchor({ anchor, children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
      }, 400)
    }
  }

  return (
    <a
      href={`/#${anchor}`}
      onClick={handleClick}
      style={{ fontSize: 14, fontWeight: 500, color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.color = '#0A0A0A' }}
      onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF' }}
    >
      {children}
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const docH    = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(scrollY > 20)
      setProgress(docH > 0 ? (scrollY / docH) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goAnchor = (anchor) => {
    setMenuOpen(false)
    if (location.pathname === '/') {
      setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 100)
    } else {
      navigate('/')
      setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 500)
    }
  }

  return (
    <>
      {/* Scroll progress bar */}
      <div
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          zIndex:        101,
          height:        2,
          width:         `${progress}%`,
          background:    'linear-gradient(90deg, #0284C7, #38BDF8)',
          transition:    'width 0.1s linear',
          pointerEvents: 'none',
        }}
      />

      <nav
        style={{
          position:             'fixed',
          top:                  0,
          left:                 0,
          right:                0,
          zIndex:               100,
          height:               72,
          background:           'rgba(255,255,255,0.85)',
          backdropFilter:       'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom:         scrolled ? '1px solid #F3F4F6' : '1px solid transparent',
          transition:           'border-color 0.3s',
          display:              'flex',
          alignItems:           'center',
          padding:              '0 48px',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Logo size="lg" />
        </Link>

        {/* Center nav — desktop */}
        <div className="nav-center">
          <SmartAnchor anchor="features">Features</SmartAnchor>
          <SmartAnchor anchor="howitworks">How It Works</SmartAnchor>
          <Link
            to="/blog"
            style={{ fontSize: 14, fontWeight: 500, color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0A0A0A' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF' }}
          >
            Blog
          </Link>
          <SmartAnchor anchor="pricing">Pricing</SmartAnchor>
        </div>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Desktop buttons */}
          <Link
            to="/login"
            className="nav-btn-ghost"
            style={{
              background:     'transparent',
              border:         '1px solid #E5E7EB',
              borderRadius:   7,
              padding:        '8px 20px',
              color:          '#374151',
              fontSize:       13,
              fontWeight:     500,
              textDecoration: 'none',
              transition:     'border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#D1D5DB' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB' }}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="nav-btn-primary"
            style={{
              background:     '#0284C7',
              border:         'none',
              borderRadius:   7,
              padding:        '8px 20px',
              color:          'white',
              fontSize:       13,
              fontWeight:     600,
              textDecoration: 'none',
              boxShadow:      '0 4px 14px rgba(2,132,199,0.25)',
              transition:     'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(2,132,199,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(2,132,199,0.25)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Get Started Free
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="nav-hamburger"
            style={{ background: 'none', border: 'none', color: '#374151', padding: 4, display: 'none' }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position:             'fixed',
            top:                  72,
            left:                 0,
            right:                0,
            background:           'rgba(255,255,255,0.98)',
            backdropFilter:       'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom:         '1px solid #F3F4F6',
            zIndex:               99,
            padding:              '20px 24px 28px',
            display:              'flex',
            flexDirection:        'column',
            gap:                  4,
          }}
        >
          {[
            { label: 'Features',     anchor: 'features'   },
            { label: 'How It Works', anchor: 'howitworks' },
            { label: 'Pricing',      anchor: 'pricing'    },
          ].map(link => (
            <button
              key={link.anchor}
              onClick={() => goAnchor(link.anchor)}
              style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 0', fontSize: 15, fontWeight: 500, color: '#374151', borderBottom: '1px solid #F3F4F6' }}
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/blog"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: 'none', padding: '12px 0', fontSize: 15, fontWeight: 500, color: '#374151', borderBottom: '1px solid #F3F4F6', display: 'block' }}
          >
            Blog
          </Link>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              style={{ textAlign: 'center', textDecoration: 'none', border: '1px solid #E5E7EB', borderRadius: 7, padding: 11, color: '#374151', fontSize: 14, fontWeight: 500, display: 'block' }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              style={{ textAlign: 'center', textDecoration: 'none', background: '#0284C7', borderRadius: 7, padding: 11, color: 'white', fontSize: 14, fontWeight: 600, display: 'block' }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .nav-center {
          display: flex;
          align-items: center;
          gap: 36px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        @media (max-width: 767px) {
          .nav-center      { display: none !important; }
          .nav-btn-ghost   { display: none !important; }
          .nav-btn-primary { display: none !important; }
          .nav-hamburger   { display: flex !important; }
        }
        @media (min-width: 768px) {
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </>
  )
}
