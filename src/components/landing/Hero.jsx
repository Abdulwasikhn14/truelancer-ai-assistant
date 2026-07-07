import { useRef, useMemo, Suspense, Component } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'

class CanvasErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: false } }
  static getDerivedStateFromError() { return { error: true } }
  render() { return this.state.error ? null : this.props.children }
}

function AnimatedSphere() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshDistortMaterial
          color="#0284C7"
          distort={0.4}
          speed={2}
          roughness={0}
          metalness={0.1}
          opacity={0.12}
          transparent
          wireframe
        />
      </mesh>
    </Float>
  )
}

function ParticleField() {
  const count = 800
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#0284C7" transparent opacity={0.3} />
    </points>
  )
}

const STATS = [
  { num: '10K+',  label: 'Freelancers'  },
  { num: '2.4M+', label: 'Proposals'    },
  { num: '94%',   label: 'Success Rate' },
]

export default function Hero() {
  return (
    <section
      className="hero-section"
      style={{
        minHeight:     '100vh',
        background:    '#ffffff',
        display:       'flex',
        alignItems:    'center',
        paddingTop:    80,
        paddingBottom: 80,
        paddingLeft:   80,
        paddingRight:  80,
        position:      'relative',
        overflow:      'hidden',
      }}
    >
      {/* Radial gradient */}
      <div style={{
        position:      'absolute',
        inset:         0,
        background:    'radial-gradient(ellipse at 20% 50%, rgba(2,132,199,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Subtle grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Background particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <CanvasErrorBoundary>
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ background: 'transparent' }}>
              <ParticleField />
            </Canvas>
          </Suspense>
        </CanvasErrorBoundary>
      </div>

      {/* LEFT — text */}
      <div className="hero-left" style={{ flex: '0 0 55%', position: 'relative', zIndex: 10, paddingRight: 40 }}>

        {/* Badge */}
        <div style={{
          display:      'inline-flex',
          alignItems:   'center',
          gap:          8,
          border:       '1px solid #E5E7EB',
          borderRadius: 100,
          padding:      '6px 16px',
          marginBottom: 32,
          background:   '#ffffff',
        }}>
          <div style={{ width: 6, height: 6, background: '#10B981', borderRadius: '50%', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>AI-Powered Freelancing Assistant</span>
        </div>

        {/* Heading — all 3 lines */}
        <h1 style={{
          fontSize:      'clamp(52px, 7vw, 96px)',
          fontWeight:    900,
          letterSpacing: '-3px',
          lineHeight:    0.95,
          marginBottom:  24,
          fontFamily:    'Inter, sans-serif',
        }}>
          <div style={{ color: '#0A0A0A' }}>Win More</div>
          <div style={{ color: '#0A0A0A' }}>Clients With</div>
          <div style={{
            background:           'linear-gradient(135deg, #0284C7, #38BDF8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
          }}>AI.</div>
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize:     17,
          color:        '#9CA3AF',
          lineHeight:   1.7,
          maxWidth:     440,
          marginBottom: 36,
          fontWeight:   400,
        }}>
          Generate winning proposals, reply to clients smartly and grow your freelancing income with the power of artificial intelligence.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 56, flexWrap: 'wrap' }}>
          <Link
            to="/signup"
            style={{
              background:     '#0284C7',
              borderRadius:   8,
              padding:        '14px 28px',
              color:          'white',
              fontSize:       14,
              fontWeight:     600,
              textDecoration: 'none',
              display:        'inline-block',
              boxShadow:      '0 4px 20px rgba(2,132,199,0.3)',
              fontFamily:     'Inter, sans-serif',
              transition:     'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(2,132,199,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(2,132,199,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Start For Free →
          </Link>
          <a
            href="#features"
            style={{
              background:     '#ffffff',
              border:         '1px solid #E5E7EB',
              borderRadius:   8,
              padding:        '14px 28px',
              color:          '#374151',
              fontSize:       14,
              fontWeight:     500,
              textDecoration: 'none',
              display:        'inline-block',
              fontFamily:     'Inter, sans-serif',
              transition:     'border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#D1D5DB' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB' }}
          >
            See Features ↓
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 40, paddingTop: 32, borderTop: '1px solid #F3F4F6', flexWrap: 'wrap' }}>
          {STATS.map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-1px', fontFamily: 'Inter, sans-serif' }}>
                {stat.num}
              </div>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — 3D sphere */}
      <div className="hero-right" style={{ flex: '0 0 45%', height: '70vh', position: 'relative', zIndex: 5 }}>
        <CanvasErrorBoundary>
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 4], fov: 75 }}
              style={{ background: 'transparent', width: '100%', height: '100%' }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#0284C7" />
              <AnimatedSphere />
            </Canvas>
          </Suspense>
        </CanvasErrorBoundary>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll" style={{
        position:      'absolute',
        bottom:        32,
        left:          '50%',
        transform:     'translateX(-50%)',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           6,
        zIndex:        20,
        pointerEvents: 'none',
      }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#D1D5DB', letterSpacing: '2px', textTransform: 'uppercase', whiteSpace: 'nowrap', margin: 0 }}>
          Scroll to explore
        </p>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, #D1D5DB, transparent)' }} />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-section { min-height: auto !important; align-items: flex-start !important; padding: 104px 32px 64px !important; }
          .hero-right   { display: none !important; }
          .hero-left    { flex: none !important; width: 100% !important; padding-right: 0 !important; }
          .hero-scroll  { display: none !important; }
        }
      `}</style>
    </section>
  )
}
