import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { motion, AnimatePresence, animate } from 'framer-motion'
import api from '../../services/api'
import {
  LayoutDashboard, FileText, MessageSquare, Briefcase, Bot,
  DollarSign, BarChart2, Clock, LogOut, Sparkles,
  Menu, Activity, ChevronDown, Lightbulb,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/ui/Logo'
import UserAvatar from '../../components/ui/UserAvatar'

// ── Constants ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/dashboard',           end: true },
  { icon: FileText,        label: 'Proposals',     path: '/dashboard/proposals'            },
  { icon: MessageSquare,   label: 'Messages',      path: '/dashboard/messages'             },
  { icon: Briefcase,       label: 'Gig Generator', path: '/dashboard/gigs'                 },
  { icon: Bot,             label: 'AI Chatbot',    path: '/dashboard/chatbot'              },
  { icon: DollarSign,      label: 'Pricing Tool',  path: '/dashboard/pricing'              },
  { icon: BarChart2,       label: 'Analytics',     path: '/dashboard/analytics'            },
  { icon: Clock,           label: 'History',       path: '/dashboard/history'              },
]

const PAGE_TITLES = {
  '/dashboard':           'Dashboard',
  '/dashboard/proposals': 'Proposals',
  '/dashboard/messages':  'Messages',
  '/dashboard/gigs':      'Gig Generator',
  '/dashboard/chatbot':   'AI Chatbot',
  '/dashboard/pricing':   'Pricing Tool',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/history':   'History',
  '/dashboard/profile':   'Profile',
}

const STAT_CONFIG = [
  { icon: FileText,      label: 'Proposals Generated', key: 'totalProposals',  suffix: '' },
  { icon: Briefcase,     label: 'Gigs Created',        key: 'totalGigs',       suffix: '' },
  { icon: MessageSquare, label: 'Client Replies',      key: 'totalReplies',    suffix: '' },
  { icon: Sparkles,      label: 'Avg Success Score',   key: 'avgSuccessScore', suffix: '%' },
]

const QUICK_ACTIONS = [
  { icon: FileText,      label: 'Generate Proposal',      desc: 'Win more clients with AI-crafted bids',    path: '/dashboard/proposals' },
  { icon: MessageSquare, label: 'Write Client Reply',     desc: 'Craft the perfect response instantly',     path: '/dashboard/messages'  },
  { icon: Briefcase,     label: 'Create Gig Description', desc: 'Build a gig listing that stands out',      path: '/dashboard/gigs'      },
  { icon: Bot,           label: 'Ask AI Assistant',       desc: 'Get freelancing guidance in seconds',      path: '/dashboard/chatbot'   },
  { icon: DollarSign,    label: 'Get Pricing Help',       desc: 'Set rates that win and still pay well',    path: '/dashboard/pricing'   },
  { icon: BarChart2,     label: 'View Analytics',         desc: 'Track your performance and growth',        path: '/dashboard/analytics' },
]

const TIPS = [
  "Personalize every proposal — clients can tell when it's copy-pasted.",
  "Your profile is your storefront. Update it monthly with your latest work.",
  "Charge what you're worth. Underpricing attracts difficult clients.",
  "Follow up once if you don't hear back — a polite nudge can win the job.",
  "Niche down. A specialist earns more than a generalist.",
  "Ask for a review every time you deliver great work.",
  "Read the job description twice before applying.",
  "Deliver slightly early when possible — it's a powerful differentiator.",
  "Set boundaries upfront: response hours, revision count, scope.",
]

const ACTIVITY_LABELS = {
  proposal: { label: 'Proposal', bg: '#F0F9FF', color: '#0284C7' },
  gig:      { label: 'Gig',      bg: '#ECFEFF', color: '#38BDF8' },
  message:  { label: 'Message',  bg: '#ECFDF5', color: '#10B981' },
  chat:     { label: 'Chatbot',  bg: '#FFF7ED', color: '#F59E0B' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatRelativeDate(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function AnimatedCount({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(0)
  useEffect(() => {
    const ctrl = animate(ref.current, value, {
      duration: 0.9, ease: 'easeOut',
      onUpdate: v => setDisplay(Math.round(v)),
    })
    ref.current = value
    return ctrl.stop
  }, [value])
  return <>{display}{suffix}</>
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
            className="lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: 224, background: '#ffffff', borderRight: '1px solid #F3F4F6' }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 20px 0' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Logo size="md" />
          </Link>
        </div>

        {/* MENU label */}
        <p style={{ fontSize: 10, letterSpacing: 2, color: '#D1D5DB', margin: '24px 0 8px', padding: '0 20px', textTransform: 'uppercase', fontWeight: 600 }}>
          MENU
        </p>

        {/* Nav items */}
        <nav style={{ flex: 1, overflow: 'auto', padding: '0 12px' }}>
          {NAV_ITEMS.map(item => {
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) onClose() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8, marginBottom: 2,
                  fontSize: 13, fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#0284C7' : '#9CA3AF',
                  background: isActive ? '#F0F9FF' : 'transparent',
                  textDecoration: 'none', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#374151' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF' } }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div style={{ borderTop: '1px solid #F3F4F6', padding: '16px 12px 12px', marginTop: 'auto' }}>
          <Link
            to="/dashboard/profile"
            onClick={() => { if (window.innerWidth < 1024) onClose() }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, textDecoration: 'none', marginBottom: 4, transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <UserAvatar size={36} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.full_name || 'User'}
              </p>
              <p style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || ''}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, width: '100%', fontSize: 12, color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', textAlign: 'left' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

// ── TopNav ────────────────────────────────────────────────────────────────────

function TopNav({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [dropOpen, setDropOpen] = useState(false)
  const title = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, height: 60, background: '#ffffff', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onMenuToggle} className="lg:hidden" style={{ background: 'none', border: 'none', color: '#6B7280', padding: 4, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Menu size={20} />
        </button>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.3px' }}>{title}</h1>
      </div>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setDropOpen(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 8, transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <UserAvatar size={32} />
          <span className="hidden sm:block" style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
            {user?.full_name?.split(' ')[0] || 'User'}
          </span>
          <ChevronDown size={14} color="#9CA3AF" style={{ transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>

        <AnimatePresence>
          {dropOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.08)', zIndex: 20, minWidth: 180, overflow: 'hidden' }}
              >
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>{user?.full_name}</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                </div>
                <div style={{ padding: 6 }}>
                  {[
                    { label: 'Profile Settings', action: () => { setDropOpen(false); navigate('/dashboard/profile') }, danger: false },
                    { label: 'Sign out', action: () => { setDropOpen(false); logout(); navigate('/login') }, danger: true },
                  ].map(item => (
                    <button key={item.label} onClick={item.action}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 6, fontSize: 13, color: item.danger ? '#EF4444' : '#374151', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = item.danger ? '#FEF2F2' : '#F9FAFB'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

// ── DashboardHome ─────────────────────────────────────────────────────────────

export function DashboardHome() {
  const { user } = useAuth()
  const firstName = user?.full_name?.trim().split(' ')[0] || 'there'
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)])
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    api.get('/api/history/analytics').then(({ data }) => setAnalytics(data)).catch(() => {})
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      style={{ padding: 32, maxWidth: 1200 }}
    >
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.5px' }}>
          {getGreeting()}, {firstName} 👋
        </h2>
        <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4 }}>
          Here's an overview of your freelancing activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4" style={{ marginBottom: 32 }}>
        {STAT_CONFIG.map((s, i) => {
          const Icon  = s.icon
          const value = analytics?.[s.key] ?? 0
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.06, duration: 0.4 }}
              style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s', position: 'relative', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ position: 'absolute', top: 20, right: 24, color: '#0284C7' }}>
                <Icon size={20} />
              </div>
              <p style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>{s.label}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-1px', lineHeight: 1 }}>
                <AnimatedCount value={value} suffix={s.suffix} />
              </p>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>All time</p>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#D1D5DB', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
          QUICK ACTIONS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((a, i) => {
            const Icon = a.icon
            return (
              <motion.div
                key={a.path}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
              >
                <Link to={a.path} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <div
                    style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#0284C7'; e.currentTarget.style.background = '#F0F9FF'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(2,132,199,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <Icon size={24} color="#0284C7" />
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', marginTop: 12, marginBottom: 4 }}>{a.label}</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>{a.desc}</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Tip */}
      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 32 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Lightbulb size={16} color="#F59E0B" />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            💡 Freelancing Tip
          </p>
          <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.6 }}>{tip}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#D1D5DB', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
          RECENT ACTIVITY
        </p>
        {!analytics || analytics.recentActivity.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Activity size={22} color="#9CA3AF" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', marginBottom: 6 }}>No activity yet</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20 }}>
              Start using the tools above and your history will appear here.
            </p>
            <Link to="/dashboard/proposals">
              <button style={{ background: '#0284C7', border: 'none', borderRadius: 8, padding: '10px 20px', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Generate your first proposal →
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
            {analytics.recentActivity.map((item, i) => {
              const tc = ACTIVITY_LABELS[item.type] ?? ACTIVITY_LABELS.proposal
              return (
                <div key={item.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < analytics.recentActivity.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                >
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: tc.bg, color: tc.color, flexShrink: 0 }}>
                    {tc.label}
                  </span>
                  <p style={{ flex: 1, fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title || '(untitled)'}
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>
                    {formatRelativeDate(item.created_at)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Layout shell ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const h = (e) => { if (e.matches) setMobileOpen(false) }
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ffffff' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:ml-[224px]" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav onMenuToggle={() => setMobileOpen(v => !v)} />
        <main style={{ flex: 1, overflowY: 'auto', background: '#ffffff' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
