import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, LogIn, FileText, Bot, DollarSign, TrendingUp, CheckCircle2, X } from 'lucide-react'
import Logo from '../components/ui/Logo'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: FileText, text: 'Generate proposals in 30 seconds' },
  { icon: Bot,      text: 'AI chatbot for freelancing advice' },
  { icon: DollarSign, text: 'Smart market-based pricing' },
  { icon: TrendingUp, text: 'Track your success rate' },
]

const STATS = [
  { value: '12K+',  label: 'Freelancers' },
  { value: '94%',   label: 'Win rate boost' },
  { value: '3 min', label: 'Avg proposal time' },
]

const shakeVariants = {
  idle:  { x: 0 },
  shake: { x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
}

const fieldVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.09, duration: 0.4, ease: 'easeOut' } }),
}

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

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login, user, loading: authLoading } = useAuth()

  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState(
    searchParams.get('error') === 'oauth_failed'
      ? 'Google sign-in failed. Please try again or use email & password.'
      : ''
  )
  const [submitting, setSubmitting] = useState(false)
  const [shakeKey, setShakeKey]     = useState(0)
  const [showToast, setShowToast]   = useState(!!location.state?.fromSignup)

  useEffect(() => {
    if (!authLoading && user) navigate('/dashboard', { replace: true })
  }, [user, authLoading, navigate])

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.password) errs.password = 'Password is required.'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); setShakeKey((k) => k + 1); return }
    setSubmitting(true); setApiError('')
    try {
      await login(form.email, form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Invalid email or password.')
      setShakeKey((k) => k + 1)
    } finally {
      setSubmitting(false)
    }
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
        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: -120, left: -120, width: 480, height: 480, background: 'radial-gradient(circle, rgba(2,132,199,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 320, height: 320, background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo + badge */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} style={{ position: 'relative', zIndex: 10 }}>
          <Link to="/"><Logo size="lg" light /></Link>
          <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '5px 14px', background: 'rgba(255,255,255,0.03)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Trusted by 10,000+ freelancers</span>
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
            Join thousands of freelancers using AI to write better proposals, land more clients, and grow faster.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.1, duration: 0.4 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <div style={{ width: 28, height: 28, background: 'rgba(2,132,199,0.15)', border: '1px solid rgba(2,132,199,0.2)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 13, height: 13, color: '#0284C7' }} />
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.5 }} style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center' }}>
          {STATS.map(({ value, label }, i) => (
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
        {/* Mobile logo */}
        <div className="lg:hidden" style={{ marginBottom: 32 }}>
          <Link to="/"><Logo size="md" /></Link>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Signup success toast */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, padding: '12px 14px', marginBottom: 20 }}
              >
                <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981', flexShrink: 0 }} />
                <p style={{ color: '#10B981', fontSize: 14, flex: 1, margin: 0 }}>Account created successfully! Please login ✨</p>
                <button type="button" onClick={() => setShowToast(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }} style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.5px', margin: 0 }}>Welcome Back 👋</h1>
            <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4, marginBottom: 0 }}>Login to your Truelancer account</p>
          </motion.div>

          {/* Google button */}
          <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" style={{ marginBottom: 20 }}>
            <motion.button
              onClick={() => { window.location.href = 'http://localhost:5000/api/auth/google' }}
              whileHover={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderColor: '#D1D5DB' }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, color: '#374151', fontWeight: 500, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <GoogleIcon />
              Continue with Google
            </motion.button>
          </motion.div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            <span style={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Email */}
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 6 }} htmlFor="email">Email address</label>
                <motion.div key={`email-shake-${shakeKey}`} variants={shakeVariants} animate={errors.email ? 'shake' : 'idle'} style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }} />
                  <input
                    id="email" name="email" type="email" autoComplete="email"
                    value={form.email} onChange={handleChange} placeholder="you@example.com"
                    style={{ width: '100%', background: '#F9FAFB', border: `1px solid ${errors.email ? '#FCA5A5' : '#E5E7EB'}`, borderRadius: 8, paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: '#0A0A0A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    onFocus={e => { e.target.style.borderColor = errors.email ? '#FCA5A5' : '#0284C7'; e.target.style.boxShadow = errors.email ? '0 0 0 3px rgba(239,68,68,0.08)' : '0 0 0 3px rgba(2,132,199,0.08)'; e.target.style.background = '#ffffff' }}
                    onBlur={e => { e.target.style.borderColor = errors.email ? '#FCA5A5' : '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB' }}
                  />
                </motion.div>
                <AnimatePresence mode="wait">
                  {errors.email && (
                    <motion.p key="email-err" initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 6 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} style={{ color: '#EF4444', fontSize: 12, margin: 0 }}>
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password */}
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 14, color: '#374151' }} htmlFor="password">Password</label>
                  <button type="button" style={{ fontSize: 12, color: '#0284C7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                    Forgot Password?
                  </button>
                </div>
                <motion.div key={`pass-shake-${shakeKey}`} variants={shakeVariants} animate={errors.password ? 'shake' : 'idle'} style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }} />
                  <input
                    id="password" name="password" type={showPass ? 'text' : 'password'} autoComplete="current-password"
                    value={form.password} onChange={handleChange} placeholder="••••••••"
                    style={{ width: '100%', background: '#F9FAFB', border: `1px solid ${errors.password ? '#FCA5A5' : '#E5E7EB'}`, borderRadius: 8, paddingLeft: 42, paddingRight: 44, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: '#0A0A0A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    onFocus={e => { e.target.style.borderColor = errors.password ? '#FCA5A5' : '#0284C7'; e.target.style.boxShadow = errors.password ? '0 0 0 3px rgba(239,68,68,0.08)' : '0 0 0 3px rgba(2,132,199,0.08)'; e.target.style.background = '#ffffff' }}
                    onBlur={e => { e.target.style.borderColor = errors.password ? '#FCA5A5' : '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB' }}
                  />
                  <button type="button" onClick={() => setShowPass((v) => !v)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', padding: 0 }}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </motion.div>
                <AnimatePresence mode="wait">
                  {errors.password && (
                    <motion.p key="pass-err" initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 6 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} style={{ color: '#EF4444', fontSize: 12, margin: 0 }}>
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* API error box */}
              <AnimatePresence mode="wait">
                {apiError && (
                  <motion.div
                    key={`api-${shakeKey}`}
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px' }}
                  >
                    <p style={{ color: '#EF4444', fontSize: 13, margin: 0 }}>{apiError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login button */}
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={!submitting ? { scale: 1.02, boxShadow: '0 6px 24px rgba(2,132,199,0.45)' } : {}}
                  whileTap={!submitting ? { scale: 0.98 } : {}}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #0284C7, #6D4FF0)', border: 'none', borderRadius: 8, padding: 13, color: 'white', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 16px rgba(2,132,199,0.3)', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.6 : 1, fontFamily: 'inherit' }}
                >
                  {submitting
                    ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /> Logging in...</>
                    : <><LogIn style={{ width: 16, height: 16 }} /> Sign in</>
                  }
                </motion.button>
              </motion.div>
            </div>
          </form>

          {/* Sign up link */}
          <motion.p custom={4} variants={fieldVariants} initial="hidden" animate="visible" style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: '#9CA3AF' }}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" style={{ color: '#0284C7', fontWeight: 600, textDecoration: 'none' }}>
              Sign Up
            </Link>
          </motion.p>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
