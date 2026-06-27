import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function GoogleAuthSuccess() {
  const [params]          = useSearchParams()
  const { setUserFromGoogle } = useAuth()
  const navigate          = useNavigate()
  const calledRef         = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const token = params.get('token')
    const name  = params.get('name')
    const email = params.get('email')
    const error = params.get('error')

    if (error || !token) {
      navigate('/login?error=google_failed', { replace: true })
      return
    }

    setUserFromGoogle(token, {
      full_name: decodeURIComponent(name || ''),
      email:     decodeURIComponent(email || ''),
    })
    navigate('/dashboard', { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        minHeight:      '100vh',
        background:     '#0A0A0A',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        flexDirection:  'column',
        gap:            '20px',
        fontFamily:     'Manrope, sans-serif',
      }}
    >
      <div
        style={{
          width:        '48px',
          height:       '48px',
          border:       '3px solid #0284C7',
          borderTop:    '3px solid transparent',
          borderRadius: '50%',
          animation:    'spin 1s linear infinite',
        }}
      />
      <p style={{ color: '#E2E8F0', fontSize: '16px' }}>Signing you in with Google…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
