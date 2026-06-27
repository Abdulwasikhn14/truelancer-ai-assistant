import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getInitials(name = '') {
  return name.trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?'
}

export function getAvatarState(userId) {
  if (!userId) return { type: 'initials' }
  const photo = localStorage.getItem(`profile_picture_${userId}`)
  if (photo) return { type: 'photo', src: photo }
  const id = localStorage.getItem(`selected_avatar_${userId}`)
  if (id) return { type: 'builtin', id }
  return { type: 'initials' }
}

// ── Built-in avatar catalogue ─────────────────────────────────────────────────

export const BUILTIN_AVATARS = [
  { id: 'explorer', label: 'Explorer', bg: '#2e1065' },
  { id: 'ninja',    label: 'Ninja',    bg: '#0f172a' },
  { id: 'robot',    label: 'Robot',    bg: '#0c4a6e' },
  { id: 'wizard',   label: 'Wizard',   bg: '#1e1b4b' },
  { id: 'hacker',   label: 'Hacker',   bg: '#052e16' },
  { id: 'phoenix',  label: 'Phoenix',  bg: '#7c2d12' },
]

// ── SVG characters ────────────────────────────────────────────────────────────

function ExplorerSVG() {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%' }}>
      <circle cx="30" cy="34" r="19" fill="#4c1d95" />
      <circle cx="30" cy="34" r="19" stroke="#0284C7" strokeWidth="1.5" />
      <ellipse cx="30" cy="33" rx="12" ry="10" fill="#0ea5e9" />
      <ellipse cx="30" cy="33" rx="12" ry="10" fill="url(#evg)" />
      <ellipse cx="26" cy="29" rx="3.5" ry="5" fill="white" opacity="0.22" />
      <path d="M11 36 Q30 47 49 36" stroke="#6d28d9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="11" cy="34" r="3" fill="#5b21b6" />
      <circle cx="49" cy="34" r="3" fill="#5b21b6" />
      <line x1="30" y1="15" x2="30" y2="8" stroke="#a78bfa" strokeWidth="2" />
      <circle cx="30" cy="7" r="3" fill="#a78bfa" />
      <defs>
        <linearGradient id="evg" x1="18" y1="23" x2="42" y2="43" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function NinjaSVG() {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="30" cy="30" rx="16" ry="18" fill="#fbbf24" />
      <rect x="14" y="17" width="32" height="8" rx="4" fill="#dc2626" />
      <circle cx="30" cy="21" r="3" fill="#991b1b" />
      <path d="M14 32 Q14 50 30 50 Q46 50 46 32 Z" fill="#1e293b" />
      <rect x="17" y="27" width="9" height="4" rx="2" fill="#0EA5E9" />
      <rect x="34" y="27" width="9" height="4" rx="2" fill="#0EA5E9" />
      <rect x="19" y="28" width="4" height="2" rx="1" fill="white" opacity="0.5" />
      <rect x="36" y="28" width="4" height="2" rx="1" fill="white" opacity="0.5" />
    </svg>
  )
}

function RobotSVG() {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="26" y="46" width="8" height="6" rx="2" fill="#075985" />
      <rect x="10" y="15" width="40" height="33" rx="8" fill="#075985" />
      <rect x="10" y="15" width="40" height="33" rx="8" stroke="#38bdf8" strokeWidth="1.5" />
      <line x1="30" y1="15" x2="30" y2="7" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="30" cy="6" r="3.5" fill="#38bdf8" />
      <rect x="13" y="23" width="13" height="9" rx="3" fill="#0ea5e9" />
      <rect x="16" y="25.5" width="5" height="4" rx="1" fill="white" opacity="0.85" />
      <rect x="34" y="23" width="13" height="9" rx="3" fill="#0ea5e9" />
      <rect x="37" y="25.5" width="5" height="4" rx="1" fill="white" opacity="0.85" />
      <circle cx="21" cy="39" r="2" fill="#38bdf8" />
      <circle cx="27" cy="39" r="2" fill="#38bdf8" />
      <circle cx="33" cy="39" r="2" fill="#38bdf8" />
      <circle cx="39" cy="39" r="2" fill="#38bdf8" />
      <rect x="5" y="28" width="6" height="7" rx="3" fill="#075985" stroke="#38bdf8" strokeWidth="1" />
      <rect x="49" y="28" width="6" height="7" rx="3" fill="#075985" stroke="#38bdf8" strokeWidth="1" />
    </svg>
  )
}

function WizardSVG() {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%' }}>
      <polygon points="30,4 46,34 14,34" fill="#4c1d95" />
      <polygon points="30,4 46,34 14,34" stroke="#0284C7" strokeWidth="1" />
      <path d="M30 12 L31.8 17 L37 17 L33 20 L34.5 25 L30 22 L25.5 25 L27 20 L23 17 L28.2 17 Z" fill="#fbbf24" opacity="0.9" />
      <circle cx="40" cy="24" r="2" fill="#a78bfa" />
      <circle cx="22" cy="28" r="1.5" fill="#a78bfa" />
      <rect x="8" y="32" width="44" height="5" rx="2.5" fill="#5b21b6" />
      <ellipse cx="30" cy="47" rx="14" ry="12" fill="#fde68a" />
      <circle cx="24" cy="45" r="2.5" fill="#1e1b4b" />
      <circle cx="36" cy="45" r="2.5" fill="#1e1b4b" />
      <circle cx="25" cy="44" r="1" fill="white" />
      <circle cx="37" cy="44" r="1" fill="white" />
      <path d="M25 51 Q30 55 35 51" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function HackerSVG() {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%' }}>
      <path d="M5 60 Q5 18 30 8 Q55 18 55 60 Z" fill="#14532d" />
      <path d="M12 60 Q14 26 30 16 Q46 26 48 60 Z" fill="#052e16" />
      <ellipse cx="30" cy="38" rx="13" ry="14" fill="#c9a96e" />
      <circle cx="23" cy="36" r="7" stroke="#4ade80" strokeWidth="2" fill="none" />
      <circle cx="37" cy="36" r="7" stroke="#4ade80" strokeWidth="2" fill="none" />
      <line x1="30" y1="36" x2="30" y2="36" stroke="#4ade80" strokeWidth="2" />
      <line x1="16" y1="36" x2="12" y2="34" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="44" y1="36" x2="48" y2="34" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="23" cy="36" r="2.5" fill="#0f172a" />
      <circle cx="37" cy="36" r="2.5" fill="#0f172a" />
      <circle cx="23" cy="36" r="7" fill="#4ade80" opacity="0.07" />
      <circle cx="37" cy="36" r="7" fill="#4ade80" opacity="0.07" />
    </svg>
  )
}

function PhoenixSVG() {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%' }}>
      <path d="M30 56 Q19 46 17 35 Q25 43 30 39 Q35 43 43 35 Q41 46 30 56 Z" fill="#f97316" />
      <path d="M30 52 Q22 43 20 37 Q27 42 30 39 Q33 42 40 37 Q38 43 30 52 Z" fill="#fbbf24" />
      <path d="M17 28 Q4 16 9 8 Q15 22 21 26 Z" fill="#f97316" />
      <path d="M43 28 Q56 16 51 8 Q45 22 39 26 Z" fill="#f97316" />
      <path d="M9 8 Q13 4 18 9 Q15 16 11 18 Z" fill="#fbbf24" />
      <path d="M51 8 Q47 4 42 9 Q45 16 49 18 Z" fill="#fbbf24" />
      <ellipse cx="30" cy="30" rx="13" ry="15" fill="#ea580c" />
      <circle cx="30" cy="19" r="9" fill="#c2410c" />
      <path d="M23 13 Q22 5 27 9 Q26 5 30 7 Q30 3 32 7 Q34 5 38 9 Q38 5 37 13" fill="#fbbf24" />
      <circle cx="27" cy="18" r="2.5" fill="#fde68a" />
      <circle cx="27" cy="18" r="1.5" fill="#1e293b" />
      <path d="M29 23 L25 25 L29 27 Z" fill="#fde68a" />
    </svg>
  )
}

const AVATAR_MAP = {
  explorer: ExplorerSVG,
  ninja:    NinjaSVG,
  robot:    RobotSVG,
  wizard:   WizardSVG,
  hacker:   HackerSVG,
  phoenix:  PhoenixSVG,
}

// ── BuiltinAvatar (used by Profile picker) ────────────────────────────────────

export function BuiltinAvatar({ id, className = '' }) {
  const meta = BUILTIN_AVATARS.find((a) => a.id === id)
  const SVGComp = AVATAR_MAP[id]
  if (!meta || !SVGComp) return null
  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}
      style={{ background: meta.bg, width: '100%', height: '100%' }}
    >
      <SVGComp />
    </div>
  )
}

// ── Main UserAvatar component ─────────────────────────────────────────────────

export default function UserAvatar({ size = 36, showBorder = false }) {
  const { user } = useAuth()
  const userId = user?.id || 'default'

  const [state, setState] = useState(() => getAvatarState(userId))

  // Re-read on userId change (e.g. login/logout)
  useEffect(() => {
    setState(getAvatarState(userId))
  }, [userId])

  // React to avatar/photo updates from Profile page
  useEffect(() => {
    const handler = () => setState(getAvatarState(userId))
    window.addEventListener('profileUpdated', handler)
    return () => window.removeEventListener('profileUpdated', handler)
  }, [userId])

  const base = {
    width:      size,
    height:     size,
    borderRadius: '50%',
    overflow:   'hidden',
    flexShrink: 0,
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border:     showBorder ? '2px solid #BAE6FD' : 'none',
  }

  if (state.type === 'photo') {
    return (
      <div style={{ ...base, background: 'transparent' }}>
        <img
          src={state.src}
          alt={getInitials(user?.full_name)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    )
  }

  if (state.type === 'builtin') {
    const meta = BUILTIN_AVATARS.find((a) => a.id === state.id)
    const SVGComp = AVATAR_MAP[state.id]
    return (
      <div style={{ ...base, background: meta?.bg || '#2e1065' }}>
        {SVGComp && <SVGComp />}
      </div>
    )
  }

  return (
    <div style={{
      ...base,
      background:  'linear-gradient(135deg, #0284C7, #38BDF8)',
      fontSize:    Math.round(size * 0.35),
      fontWeight:  700,
      color:       'white',
      fontFamily:  'Inter, sans-serif',
      letterSpacing: '-0.5px',
    }}>
      {getInitials(user?.full_name)}
    </div>
  )
}
