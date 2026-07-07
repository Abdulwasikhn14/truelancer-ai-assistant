import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { motion, AnimatePresence, animate } from 'framer-motion'
import api from '../../services/api'
import {
  LayoutDashboard, FileText, MessageSquare, Briefcase, Bot,
  DollarSign, BarChart2, Clock, LogOut, Sparkles,
  Menu, Activity, ChevronDown, Lightbulb,
  TrendingUp, TrendingDown, Award, Plus, Rocket,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts'
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

// Segment palette shared across the ring / bar / activity widgets
const TOOL_SEGMENTS = [
  { key: 'proposals', label: 'Proposals', color: '#0284C7' },
  { key: 'gigs',      label: 'Gigs',      color: '#38BDF8' },
  { key: 'messages',  label: 'Messages',  color: '#10B981' },
  { key: 'chatbot',   label: 'Chatbot',   color: '#F59E0B' },
]
const PLATFORM_META = [
  { key: 'upwork',     label: 'Upwork',         color: '#0284C7' },
  { key: 'fiverr',     label: 'Fiverr',         color: '#38BDF8' },
  { key: 'freelancer', label: 'Freelancer.com', color: '#F97316' },
]

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 12 }}>
      {label && <p style={{ color: '#6B7280', margin: '0 0 4px' }}>{label}</p>}
      {payload.map((p) => <p key={p.name} style={{ color: p.color || '#0284C7', fontWeight: 600, margin: 0 }}>{p.name}: {p.value}</p>)}
    </div>
  )
}

// Reusable light card shell
function Panel({ children, style = {} }) {
  return <div style={{ background: '#ffffff', border: '1px solid #EEF0F3', borderRadius: 18, boxShadow: '0 1px 3px rgba(16,24,40,0.04)', ...style }}>{children}</div>
}

function PanelHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '18px 20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {Icon && (
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={16} color="#0284C7" />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h3>
          {subtitle && <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function DashboardHome() {
  const { user } = useAuth()
  const firstName = user?.full_name?.trim().split(' ')[0] || 'there'
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)])
  const [analytics, setAnalytics] = useState(null)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 5

  useEffect(() => {
    api.get('/api/history/analytics').then(({ data }) => setAnalytics(data)).catch(() => {})
  }, [])

  const a = analytics ?? {}
  const tools     = a.toolsUsage ?? { proposals: 0, gigs: 0, messages: 0, chatbot: 0 }
  const usageDays = a.usageByDay ?? []
  const platforms = a.platformDistribution ?? { upwork: 0, fiverr: 0, freelancer: 0 }
  const activity  = a.recentActivity ?? []
  const topProps  = a.topProposals ?? []

  const totalGenerations = (a.totalProposals ?? 0) + (a.totalGigs ?? 0) + (a.totalReplies ?? 0) + (a.totalChats ?? 0)
  const weekActivity = usageDays.reduce((s, d) => s + (d.total || 0), 0)

  // Ring: tool usage breakdown
  const ringData = TOOL_SEGMENTS.map((s) => ({ ...s, value: tools[s.key] || 0 }))
  const ringTotal = ringData.reduce((s, d) => s + d.value, 0)
  const ringChart = ringTotal === 0 ? ringData.map((d) => ({ ...d, value: 1 })) : ringData

  // Platform distribution
  const platData = PLATFORM_META.map((p) => ({ ...p, value: platforms[p.key] || 0 }))
  const platTotal = platData.reduce((s, d) => s + d.value, 0)
  const platChart = platTotal === 0 ? platData.map((d) => ({ ...d, value: 1 })) : platData

  const barData = TOOL_SEGMENTS.map((s) => ({ name: s.label, value: tools[s.key] || 0 }))

  const totalPages = Math.max(1, Math.ceil(activity.length / PAGE_SIZE))
  const pageItems = activity.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const bannerStats = [
    { icon: FileText, label: 'Total Generations', value: totalGenerations, sub: weekActivity > 0 ? `${weekActivity} this week` : 'No activity yet', up: weekActivity > 0 },
    { icon: Award,    label: 'Avg Success Score', value: `${a.avgSuccessScore ?? 0}%`, sub: 'Across your proposals', up: (a.avgSuccessScore ?? 0) >= 60 },
  ]

  return (
    <motion.div className="dash-home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      style={{ padding: 24, background: '#F7F8FA', minHeight: '100%' }}
    >
      {/* ── Banner + banner stats ── */}
      <div className="dash-banner-row" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18, marginBottom: 18 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, padding: '30px 32px', background: 'linear-gradient(120deg, #0284C7 0%, #0EA5E9 55%, #38BDF8 100%)', minHeight: 190, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* soft decorative blobs */}
          <div style={{ position: 'absolute', top: -60, right: -30, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, right: 90, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 460 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{getGreeting()}, {firstName} 👋</p>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.8px', margin: '10px 0 6px', lineHeight: 1.1 }}>Check Your Freelancing Growth!</h2>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.88)', margin: 0 }}>Here's your performance at a glance…</p>
            <Link to="/dashboard/proposals" style={{ textDecoration: 'none' }}>
              <button style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ffffff', color: '#0284C7', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
                <Sparkles size={15} /> New Proposal
              </button>
            </Link>
          </div>
          {/* Illustration cluster */}
          <div className="dash-illust" style={{ position: 'absolute', right: 28, top: 0, bottom: 0, width: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 128, height: 128, borderRadius: '50%', background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
              <Rocket size={54} color="#ffffff" strokeWidth={1.6} />
            </motion.div>
          </div>
        </motion.div>

        <div className="dash-banner-stats" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {bannerStats.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}>
                <Panel style={{ padding: '18px 20px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color="#0284C7" />
                    </div>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{s.label}</p>
                  </div>
                  <p style={{ fontSize: 26, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.6px', margin: 0, lineHeight: 1 }}>
                    {typeof s.value === 'number' ? <AnimatedCount value={s.value} /> : s.value}
                  </p>
                  <p style={{ fontSize: 11, color: s.up ? '#10B981' : '#9CA3AF', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{s.sub}
                  </p>
                </Panel>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Ring + Activity line ── */}
      <div className="dash-ring-row" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 18, marginBottom: 18 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.4 }}>
          <Panel style={{ padding: '0 0 18px' }}>
            <PanelHeader icon={Sparkles} title="This Week's Output" subtitle="Usage by tool" />
            <div style={{ height: 180, position: 'relative', margin: '8px 0 4px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ringChart} cx="50%" cy="50%" innerRadius={58} outerRadius={78} dataKey="value" strokeWidth={0} paddingAngle={ringTotal === 0 ? 0 : 3}>
                    {ringChart.map((e) => <Cell key={e.key} fill={e.color} opacity={ringTotal === 0 ? 0.18 : 1} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 26, fontWeight: 800, color: '#0A0A0A', margin: 0, letterSpacing: '-1px' }}>{ringTotal}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>generations</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'center', padding: '0 20px' }}>
              {ringData.map((d) => (
                <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: d.color }} />
                  <span style={{ fontSize: 11, color: '#6B7280' }}>{d.label}</span>
                  <span style={{ fontSize: 11, color: '#0A0A0A', fontWeight: 600 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </Panel>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.4 }}>
          <Panel style={{ padding: '0 0 12px', height: '100%' }}>
            <PanelHeader icon={TrendingUp} title="Activity Overview" subtitle="Generations · last 7 days"
              action={<span style={{ fontSize: 11, fontWeight: 600, color: '#0284C7', background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.16)', borderRadius: 99, padding: '5px 12px', whiteSpace: 'nowrap' }}>Weekly</span>} />
            <div style={{ height: 220, marginTop: 10, paddingRight: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageDays} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284C7" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} tickMargin={8} />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} width={36} tickMargin={8} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#0284C7', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.35 }} />
                  <Area type="monotone" dataKey="total" stroke="#0284C7" strokeWidth={2.5} fill="url(#dashArea)" name="Generations"
                    dot={{ r: 3, fill: '#0284C7', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#38BDF8', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* ── 3-up: Top proposals · Tools bar · Platform ── */}
      <div className="dash-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 18 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.4 }}>
          <Panel style={{ padding: '0 0 8px', height: '100%' }}>
            <PanelHeader icon={Award} title="Top Proposals" subtitle="Highest scored"
              action={<Link to="/dashboard/analytics" style={{ fontSize: 11, fontWeight: 600, color: '#0284C7', textDecoration: 'none' }}>View All</Link>} />
            <div style={{ padding: '10px 20px 0' }}>
              {topProps.length === 0 ? (
                <p style={{ fontSize: 12, color: '#9CA3AF', padding: '28px 0', textAlign: 'center' }}>No proposals scored yet.</p>
              ) : topProps.slice(0, 4).map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < Math.min(topProps.length, 4) - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', width: 16, textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{p.title || '(untitled)'}</p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{p.platform || 'Unknown'}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0284C7', flexShrink: 0 }}>{p.score}%</span>
                </div>
              ))}
            </div>
          </Panel>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.4 }}>
          <Panel style={{ padding: '0 0 14px', height: '100%' }}>
            <PanelHeader icon={BarChart2} title="Tools Usage" subtitle="Per tool" />
            <div style={{ height: 200, marginTop: 10, paddingRight: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barSize={26} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284C7" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} interval={0} tickMargin={8} />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} width={34} tickMargin={8} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(2,132,199,0.04)' }} />
                  <Bar dataKey="value" fill="url(#dashBar)" radius={[6, 6, 0, 0]} name="Uses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
          <Panel style={{ padding: '0 0 18px', height: '100%' }}>
            <PanelHeader icon={Activity} title="Platform Split" subtitle="By usage" />
            <div style={{ height: 150, position: 'relative', marginTop: 6 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={platChart} cx="50%" cy="50%" innerRadius={46} outerRadius={64} dataKey="value" strokeWidth={0} paddingAngle={platTotal === 0 ? 0 : 3}>
                    {platChart.map((e) => <Cell key={e.key} fill={e.color} opacity={platTotal === 0 ? 0.18 : 0.9} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#0284C7', margin: 0 }}>{platTotal}</p>
                  <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>uses</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: '4px 20px 0' }}>
              {platData.map((d) => (
                <div key={d.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#374151' }}>{d.label}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>{d.value} use{d.value !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* ── Tip strip ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, padding: '14px 18px', marginBottom: 18 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Lightbulb size={16} color="#F59E0B" />
        </div>
        <div>
          <p style={{ fontSize: 10.5, fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: 1, margin: '2px 0 4px' }}>💡 Freelancing Tip</p>
          <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.55, margin: 0 }}>{tip}</p>
        </div>
      </div>

      {/* ── Recent Activity table ── */}
      <Panel style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '18px 20px' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>Recent Activity</h3>
            <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: '3px 0 0' }}>Your latest generated content</p>
          </div>
          <Link to="/dashboard/proposals" style={{ textDecoration: 'none' }}>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg, #0284C7, #38BDF8)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(2,132,199,0.25)', whiteSpace: 'nowrap' }}>
              <Plus size={15} /> New
            </button>
          </Link>
        </div>

        {activity.length === 0 ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Activity size={22} color="#9CA3AF" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', marginBottom: 6 }}>No activity yet</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20 }}>Start using the tools and your history will appear here.</p>
            <Link to="/dashboard/proposals">
              <button style={{ background: '#0284C7', border: 'none', borderRadius: 8, padding: '10px 20px', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Generate your first proposal →</button>
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 560 }}>
              {/* header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 120px 80px 120px', gap: 12, padding: '10px 20px', background: '#F9FAFB', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}>
                {['Type', 'Title', 'Platform', 'Score', 'Created At'].map((c) => (
                  <p key={c} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>{c}</p>
                ))}
              </div>
              {pageItems.map((item) => {
                const tc = ACTIVITY_LABELS[item.type] ?? ACTIVITY_LABELS.proposal
                return (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 120px 80px 120px', gap: 12, padding: '13px 20px', borderBottom: '1px solid #F5F6F8', alignItems: 'center', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FAFBFC'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <div>
                      <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: tc.bg, color: tc.color }}>{tc.label}</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{item.title || '(untitled)'}</p>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{item.platform || '—'}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: item.score != null ? '#0284C7' : '#9CA3AF', margin: 0 }}>{item.score != null ? `${item.score}%` : '—'}</p>
                    <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: 0 }}>{formatRelativeDate(item.created_at)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activity.length > PAGE_SIZE && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 20px', borderTop: '1px solid #F3F4F6', flexWrap: 'wrap' }}>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Page {page + 1} of {totalPages}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', color: page === 0 ? '#D1D5DB' : '#374151', cursor: page === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>Previous</button>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 8, border: 'none', background: page >= totalPages - 1 ? '#E5E7EB' : 'linear-gradient(135deg, #0284C7, #38BDF8)', color: page >= totalPages - 1 ? '#9CA3AF' : '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>Next</button>
            </div>
          </div>
        )}
      </Panel>

      <style>{`
        @media (max-width: 1100px) {
          .dash-ring-row { grid-template-columns: 1fr !important; }
          .dash-3col { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 820px) {
          .dash-banner-row { grid-template-columns: 1fr !important; }
          .dash-banner-stats { flex-direction: row !important; }
          .dash-banner-stats > div { flex: 1; }
        }
        @media (max-width: 640px) {
          .dash-home { padding: 16px !important; }
          .dash-3col { grid-template-columns: 1fr !important; }
          .dash-banner-stats { flex-direction: column !important; }
          .dash-illust { display: none !important; }
        }
      `}</style>
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
        <main data-lenis-prevent style={{ flex: 1, overflowY: 'auto', background: '#ffffff' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
