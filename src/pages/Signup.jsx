import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, FileText, Bot, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react'
import Logo from '../components/ui/Logo'
import { useAuth } from '../context/AuthContext'

// ── Left panel shared config ──────────────────────────────────────────────────

const FEATURES = [
  { icon: FileText,   text: 'Generate proposals in 30 seconds' },
  { icon: Bot,        text: 'AI chatbot for freelancing advice' },
  { icon: DollarSign, text: 'Smart market-based pricing' },
  { icon: TrendingUp, text: 'Track your success rate' },
]

const PANEL_STATS = [
  { value: '10K+',  label: 'Freelancers' },
  { value: '94%',   label: 'Win rate boost' },
  { value: '2.4M+', label: 'Proposals generated' },
]

// ── Password strength ─────────────────────────────────────────────────────────

function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8)                        score++
  if (pw.length >= 12)                       score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw))                         score++
  if (/[^A-Za-z0-9]/.test(pw))              score++
  if (score <= 1) return { score: 1, label: 'Weak',   color: '#EF4444' }
  if (score <= 3) return { score: 3, label: 'Medium', color: '#F59E0B' }
  return           { score: 5, label: 'Strong', color: '#10B981' }
}

// ── Google icon ───────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

// ── Shake variant ─────────────────────────────────────────────────────────────

const shakeVariants = {
  idle:  { x: 0 },
  shake: { x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
}

const fieldVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
}

// ── Light form input ──────────────────────────────────────────────────────────

function FormInput({ id, name, type = 'text', value, onChange, placeholder, autoComplete, icon: Icon, error, rightSlot, shakeKey }) {
  return (
    <motion.div
      key={`${name}-shake-${shakeKey}`}
      variants={shakeVariants}
      animate={error ? 'shake' : 'idle'}
      style={{ position: 'relative' }}
    >
      <Icon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }} />
      <input
        id={id} name={name} type={type} autoComplete={autoComplete}
        value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: '100%', background: '#F9FAFB', border: `1px solid ${error ? '#FCA5A5' : '#E5E7EB'}`, borderRadius: 8, paddingLeft: 42, paddingRight: rightSlot ? 44 : 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: '#0A0A0A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
        onFocus={e => { e.target.style.borderColor = error ? '#FCA5A5' : '#0284C7'; e.target.style.boxShadow = error ? '0 0 0 3px rgba(239,68,68,0.08)' : '0 0 0 3px rgba(2,132,199,0.08)'; e.target.style.background = '#ffffff' }}
        onBlur={e => { e.target.style.borderColor = error ? '#FCA5A5' : '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB' }}
      />
      {rightSlot}
    </motion.div>
  )
}

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({ onLogin }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 0' }}
    >
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <svg viewBox="0 0 96 96" style={{ width: 112, height: 112 }} fill="none">
          <motion.circle cx="48" cy="48" r="42" stroke="#10B981" strokeWidth="4" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.65, ease: 'easeOut' }} />
          <motion.path d="M28 48 L42 62 L68 34" stroke="#10B981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55, duration: 0.4, ease: 'easeOut' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(16,185,129,0.08)', filter: 'blur(20px)' }} />
      </div>

      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.4 }}
        style={{ fontSize: 28, fontWeight: 800, color: '#0A0A0A', margin: 0 }}>
        Account Created! 🎉
      </motion.h2>

      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.35 }}
        style={{ color: '#9CA3AF', fontSize: 14, marginTop: 8 }}>
        Welcome to Truelancer. Your account is ready to go.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.35 }}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={onLogin}
        style={{ marginTop: 32, background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: 'none', borderRadius: 8, padding: '12px 32px', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        Login Now →
      </motion.button>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Signup() {
  const navigate = useNavigate()
  const { register, user, loading: authLoading } = useAuth()

  const [fullName,        setFullName]        = useState('')
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms,   setAgreedToTerms]   = useState(false)
  const [showPass,        setShowPass]        = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [error,           setError]           = useState('')
  const [loading,         setLoading]         = useState(false)
  const [showSuccess,     setShowSuccess]     = useState(false)
  const [shakeKey,        setShakeKey]        = useState(0)

  const strength = getStrength(password)

  useEffect(() => {
    if (!authLoading && user) navigate('/dashboard', { replace: true })
  }, [user, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName || !email || !password || !confirmPassword) { setError('All fields are required'); setShakeKey((k) => k + 1); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); setShakeKey((k) => k + 1); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); setShakeKey((k) => k + 1); return }
    if (!agreedToTerms) { setError('Please agree to the Terms of Service'); setShakeKey((k) => k + 1); return }

    setLoading(true); setError('')
    const result = await register(fullName, email, password)
    setLoading(false)
    if (result.success) setShowSuccess(true)
    else { setError(result.message); setShakeKey((k) => k + 1) }
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #0284C7', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>

      {/* ── Left dark panel ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex"
        style={{ width: '55%', background: '#0A0A0A', padding: 48, flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 320, height: 320, background: 'radial-gradient(circle, rgba(2,132,199,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo + badge */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} style={{ position: 'relative', zIndex: 10 }}>
          <Link to="/"><Logo size="lg" light /></Link>
          <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '5px 14px', background: 'rgba(255,255,255,0.03)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Join 10,000+ freelancers already winning</span>
          </div>
        </motion.div>

        {/* Headline + features */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }} style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'white', letterSpacing: '-2px', lineHeight: 1.0, margin: '0 0 16px' }}>
            Win More<br />
            Clients<br />
            With{' '}
            <span style={{ background: 'linear-gradient(135deg, #0284C7, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, lineHeight: 1.7, marginBottom: 32, maxWidth: 360 }}>
            Stop losing bids to luck. Let AI craft proposals that convert — and watch your freelancing income grow.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <motion.div key={text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 + i * 0.1, duration: 0.4 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, background: 'rgba(2,132,199,0.15)', border: '1px solid rgba(2,132,199,0.2)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 13, height: 13, color: '#0284C7' }} />
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{text}</span>
              </motion.div>
            ))}
          </div>

          {/* Social proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: 0.5 }} style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {['#0284C7', '#38BDF8', '#EF4444', '#10B981', '#F59E0B'].map((bg, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #0A0A0A', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', marginLeft: i > 0 ? -10 : 0 }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>200+</span> joined this week
            </p>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }} style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center' }}>
          {PANEL_STATS.map(({ value, label }, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.12)', margin: '0 20px' }} />}
              <div>
                <p style={{ fontSize: 18, fontWeight: 800, color: 'white', margin: 0 }}>{value}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: '2px 0 0' }}>{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Right white panel ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: '#ffffff', overflowY: 'auto' }}
      >
        <div className="lg:hidden" style={{ marginBottom: 32 }}>
          <Link to="/"><Logo size="md" /></Link>
        </div>

        <div style={{ width: '100%', maxWidth: 420 }}>
          {showSuccess ? (
            <SuccessScreen onLogin={() => navigate('/login', { state: { fromSignup: true } })} />
          ) : (
            <>
              {/* Heading */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }} style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.5px', margin: 0 }}>Create Your Account 🚀</h1>
                <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4, marginBottom: 0 }}>Start winning more clients today</p>
              </motion.div>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Full Name */}
                  <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                    <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 6 }} htmlFor="full_name">Full Name</label>
                    <FormInput id="full_name" name="full_name" type="text" value={fullName}
                      onChange={(e) => { setFullName(e.target.value); setError('') }}
                      placeholder="Jane Doe" autoComplete="name" icon={User} shakeKey={shakeKey} />
                  </motion.div>

                  {/* Email */}
                  <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                    <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 6 }} htmlFor="email">Email Address</label>
                    <FormInput id="email" name="email" type="email" value={email}
                      onChange={(e) => { setEmail(e.target.value); setError('') }}
                      placeholder="you@example.com" autoComplete="email" icon={Mail} shakeKey={shakeKey} />
                  </motion.div>

                  {/* Password */}
                  <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                    <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 6 }} htmlFor="password">Password</label>
                    <FormInput id="password" name="password" type={showPass ? 'text' : 'password'} value={password}
                      onChange={(e) => { setPassword(e.target.value); setError('') }}
                      placeholder="Min. 8 characters" autoComplete="new-password" icon={Lock} shakeKey={shakeKey}
                      rightSlot={
                        <button type="button" onClick={() => setShowPass((v) => !v)}
                          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', padding: 0 }}>
                          {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                        </button>
                      }
                    />
                    <AnimatePresence>
                      {password && (
                        <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 8 }} exit={{ opacity: 0, height: 0, marginTop: 0 }}>
                          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                            {[1, 2, 3, 4, 5].map((seg) => (
                              <div key={seg} style={{ flex: 1, height: 4, borderRadius: 99, background: '#F3F4F6', overflow: 'hidden' }}>
                                <motion.div style={{ height: '100%', borderRadius: 99 }}
                                  initial={{ width: 0 }}
                                  animate={{ width: strength.score >= seg ? '100%' : '0%', backgroundColor: strength.color }}
                                  transition={{ duration: 0.3, ease: 'easeOut' }}
                                />
                              </div>
                            ))}
                          </div>
                          <motion.p animate={{ color: strength.color }} transition={{ duration: 0.3 }} style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>
                            {strength.label}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Confirm Password */}
                  <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                    <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 6 }} htmlFor="confirm">Confirm Password</label>
                    <FormInput id="confirm" name="confirm" type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                      placeholder="Repeat your password" autoComplete="new-password" icon={Lock} shakeKey={shakeKey}
                      rightSlot={
                        <button type="button" onClick={() => setShowConfirm((v) => !v)}
                          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', padding: 0 }}>
                          {showConfirm ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                        </button>
                      }
                    />
                    <AnimatePresence>
                      {confirmPassword && password && (
                        <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 6 }} exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {confirmPassword === password
                            ? <><CheckCircle2 style={{ width: 14, height: 14, color: '#10B981' }} /><span style={{ color: '#10B981', fontSize: 12 }}>Passwords match</span></>
                            : <span style={{ color: '#F59E0B', fontSize: 12 }}>Passwords don&apos;t match yet</span>
                          }
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Terms checkbox */}
                  <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}
                      onClick={() => { setAgreedToTerms((v) => !v); setError('') }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${agreedToTerms ? '#0284C7' : '#D1D5DB'}`, background: agreedToTerms ? '#0284C7' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.2s' }}>
                        {agreedToTerms && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span style={{ fontSize: 14, color: '#374151', userSelect: 'none', lineHeight: 1.5 }}>
                        I agree to the{' '}
                        <a href="/terms" style={{ color: '#0284C7', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" style={{ color: '#0284C7', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>Privacy Policy</a>
                      </span>
                    </div>
                  </motion.div>

                  {/* Error banner */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div key={`err-${shakeKey}`} initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}
                        style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px' }}>
                        <p style={{ color: '#EF4444', fontSize: 13, margin: 0 }}>{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
                    <motion.button type="submit" disabled={loading}
                      whileHover={!loading ? { scale: 1.02, boxShadow: '0 6px 24px rgba(2,132,199,0.45)' } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      style={{ width: '100%', background: 'linear-gradient(135deg, #0284C7, #6D4FF0)', border: 'none', borderRadius: 8, padding: 13, color: 'white', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 16px rgba(2,132,199,0.3)', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.6 : 1, fontFamily: 'inherit' }}
                    >
                      {loading
                        ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /> Creating account...</>
                        : <><UserPlus style={{ width: 16, height: 16 }} /> Create Account</>
                      }
                    </motion.button>
                  </motion.div>
                </div>
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
                <span style={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>or continue with</span>
                <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
              </div>

              {/* Google */}
              <motion.button
                onClick={() => { window.location.href = 'http://localhost:5000/api/auth/google' }}
                whileHover={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderColor: '#D1D5DB' }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, color: '#374151', fontWeight: 500, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <GoogleIcon />
                Sign up with Google
              </motion.button>

              {/* Login link */}
              <p style={{ marginTop: 28, textAlign: 'center', fontSize: 14, color: '#9CA3AF' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#0284C7', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
