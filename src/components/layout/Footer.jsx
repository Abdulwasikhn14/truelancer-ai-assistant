import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../ui/Logo'

const XIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12 24 5.373 18.627 0 12 0z" />
  </svg>
)

function SmartAnchor({ anchor, children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 600)
    }
  }

  return (
    <a
      href={`/#${anchor}`}
      onClick={handleClick}
      style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s', display: 'block' }}
      onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
    >
      {children}
    </a>
  )
}

function FLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s', display: 'block' }}
      onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
    >
      {children}
    </Link>
  )
}

const SOCIALS = [
  { Icon: XIcon,        label: 'X (Twitter)', href: 'https://twitter.com'  },
  { Icon: LinkedInIcon, label: 'LinkedIn',    href: 'https://linkedin.com' },
  { Icon: GitHubIcon,   label: 'GitHub',      href: 'https://github.com'   },
]

const COL_LABEL = {
  fontSize:      11,
  fontWeight:    600,
  color:         'rgba(255,255,255,0.2)',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  marginBottom:  20,
}

export default function Footer() {
  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid #1A1A1A', padding: '60px 48px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }} className="footer-grid">

          {/* Brand col */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
              <Logo size="sm" light />
            </Link>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6, marginBottom: 24, maxWidth: 220 }}>
              AI-powered tools for freelancers who want to win more clients.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width:          28,
                    height:         28,
                    borderRadius:   '50%',
                    border:         '1px solid #1A1A1A',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    color:          'rgba(255,255,255,0.3)',
                    textDecoration: 'none',
                    transition:     'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A1A1A'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p style={COL_LABEL}>Product</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SmartAnchor anchor="features">Features</SmartAnchor>
              <SmartAnchor anchor="howitworks">How It Works</SmartAnchor>
              <SmartAnchor anchor="pricing">Pricing</SmartAnchor>
              <FLink to="/signup">Get Started</FLink>
            </div>
          </div>

          {/* Support */}
          <div>
            <p style={COL_LABEL}>Support</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FLink to="/help">Help Center</FLink>
              <FLink to="/contact">Contact Us</FLink>
              <FLink to="/blog">Blog</FLink>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p style={COL_LABEL}>Legal</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FLink to="/privacy">Privacy Policy</FLink>
              <FLink to="/terms">Terms of Service</FLink>
              <FLink to="/cookies">Cookie Policy</FLink>
              <FLink to="/about">About Us</FLink>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop:      '1px solid #111111',
            paddingTop:     24,
            marginTop:      8,
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            flexWrap:       'wrap',
            gap:            12,
          }}
        >
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            © 2026 Truelancer. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            Made with ❤️ for freelancers
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
