import { useState, useEffect, useRef } from 'react'
import { motion, animate } from 'framer-motion'
import {
  FileText, Briefcase, MessageSquare, TrendingUp,
  Activity, BarChart2, Award, Clock,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
  PieChart, Pie, Cell, Tooltip as PieTooltip,
} from 'recharts'
import { toast } from 'react-hot-toast'
import api from '../../services/api'

const TYPE_CONFIG = {
  proposal: { label: 'Proposal', color: '#0284C7', bg: 'rgba(2,132,199,0.08)', border: 'rgba(2,132,199,0.2)' },
  gig:      { label: 'Gig',      color: '#38BDF8', bg: 'rgba(56,189,248,0.08)',   border: 'rgba(56,189,248,0.2)' },
  message:  { label: 'Message',  color: '#10B981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)' },
  chat:     { label: 'Chatbot',  color: '#F97316', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.2)' },
}

const STAT_CONFIG = [
  { icon: FileText,      label: 'Total Proposals',   key: 'totalProposals',  suffix: '', color: '#0284C7', bg: 'rgba(2,132,199,0.08)', border: 'rgba(2,132,199,0.15)' },
  { icon: Briefcase,     label: 'Gigs Created',      key: 'totalGigs',       suffix: '', color: '#38BDF8', bg: 'rgba(56,189,248,0.08)',   border: 'rgba(56,189,248,0.15)'  },
  { icon: MessageSquare, label: 'Client Replies',    key: 'totalReplies',    suffix: '', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.15)' },
  { icon: TrendingUp,    label: 'Avg Success Score', key: 'avgSuccessScore', suffix: '%', color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)' },
]

const EMPTY = {
  totalProposals: 0, totalGigs: 0, totalReplies: 0, totalChats: 0, avgSuccessScore: 0,
  usageByDay:    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(date => ({ date, total: 0 })),
  platformDistribution: { upwork: 0, fiverr: 0, freelancer: 0 },
  toolsUsage:    { proposals: 0, gigs: 0, messages: 0, chatbot: 0 },
  recentActivity: [], topProposals: [],
}

const DONUT_META = [
  { name: 'Upwork',         key: 'upwork',     color: '#0284C7' },
  { name: 'Fiverr',         key: 'fiverr',     color: '#38BDF8' },
  { name: 'Freelancer.com', key: 'freelancer', color: '#F97316' },
]

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 12 }}>
      {label && <p style={{ color: '#6B7280', marginBottom: 4 }}>{label}</p>}
      {payload.map((p) => <p key={p.name} style={{ color: p.color, fontWeight: 600, margin: 0 }}>{p.name}: {p.value}</p>)}
    </div>
  )
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 12 }}>
      <p style={{ color: payload[0].payload.color, fontWeight: 600, margin: 0 }}>{payload[0].name}: {payload[0].payload.realValue ?? payload[0].value}</p>
    </div>
  )
}

function AnimatedStat({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const prevRef = useRef(0)
  useEffect(() => {
    const ctrl = animate(prevRef.current, value, { duration: 0.9, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)) })
    prevRef.current = value
    return ctrl.stop
  }, [value])
  return <>{display}{suffix}</>
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(2,132,199,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon style={{ width: 16, height: 16, color: '#0284C7' }} />
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
  )
}

function TableEmptyState() {
  return (
    <div style={{ padding: '64px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity style={{ width: 28, height: 28, color: '#D1D5DB' }} />
        </div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '1px dashed rgba(2,132,199,0.2)' }} />
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', marginBottom: 4 }}>No activity yet</p>
      <p style={{ fontSize: 12, color: '#9CA3AF', maxWidth: 220, lineHeight: 1.5 }}>Start generating content with any tool and your activity will appear here.</p>
    </div>
  )
}

function ProposalEmptyState() {
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Award style={{ width: 20, height: 20, color: '#0284C7' }} />
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', marginBottom: 4 }}>No proposals yet</p>
      <p style={{ fontSize: 12, color: '#9CA3AF', maxWidth: 200, lineHeight: 1.5 }}>Your best-scoring proposals will show up here once you start generating.</p>
    </div>
  )
}

function ChartCard({ children, style = {} }) {
  return <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20, ...style }}>{children}</div>
}

const cardVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
}
const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.45, ease: 'easeOut' } })

export default function Analytics() {
  const [analytics, setAnalytics] = useState(EMPTY)

  useEffect(() => {
    api.get('/api/history/analytics').then(({ data }) => setAnalytics(data)).catch(() => toast.error('Failed to load analytics.'))
  }, [])

  const barData = [
    { name: 'Proposals', value: analytics.toolsUsage.proposals },
    { name: 'Gigs',      value: analytics.toolsUsage.gigs      },
    { name: 'Messages',  value: analytics.toolsUsage.messages  },
    { name: 'Chatbot',   value: analytics.toolsUsage.chatbot   },
  ]

  const donutColors = DONUT_META.map(m => ({ ...m, realValue: analytics.platformDistribution[m.key], value: analytics.platformDistribution[m.key] }))
  const totalPlatformUses = donutColors.reduce((s, d) => s + d.value, 0)
  const donutChartData = totalPlatformUses === 0 ? donutColors.map(d => ({ ...d, value: 1 })) : donutColors

  const CHART_STYLE = { backgroundColor: 'transparent', fontSize: 11, fontFamily: 'Inter, system-ui, sans-serif' }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>

      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0A0A0A', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <BarChart2 style={{ width: 20, height: 20, color: '#0284C7' }} /> Analytics
        </h2>
        <p style={{ marginTop: 4, fontSize: 13, color: '#6B7280' }}>Track your freelancing performance and tool usage.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {STAT_CONFIG.map((s, i) => {
          const Icon = s.icon, value = analytics[s.key] ?? 0
          return (
            <motion.div key={s.label} custom={i} variants={cardVariants} initial="hidden" animate="visible"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              style={{ background: '#ffffff', border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', maxWidth: 80, lineHeight: 1.4, margin: 0 }}>{s.label}</p>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 16, height: 16, color: s.color }} />
                </div>
              </div>
              <p style={{ fontSize: 30, fontWeight: 700, color: s.color, margin: 0 }}><AnimatedStat value={value} suffix={s.suffix} /></p>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock style={{ width: 12, height: 12 }} />{value > 0 ? 'All time' : 'No activity yet'}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <motion.div {...fadeUp(0.28)}>
          <ChartCard>
            <SectionHeader icon={TrendingUp} title="Daily Activity" subtitle="Last 7 days · all tools" />
            <div style={{ height: 208 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.usageByDay} style={CHART_STYLE}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0284C7" /><stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="total" stroke="url(#lineGrad)" strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0284C7', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#38BDF8', strokeWidth: 0 }} name="Generations" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div {...fadeUp(0.36)}>
          <ChartCard style={{ height: '100%' }}>
            <SectionHeader icon={Activity} title="Platform Distribution" subtitle="By usage" />
            <div style={{ height: 176, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutChartData} cx="50%" cy="50%" innerRadius={52} outerRadius={72} dataKey="value" strokeWidth={0}>
                    {donutChartData.map((entry) => <Cell key={entry.name} fill={entry.color} opacity={totalPlatformUses === 0 ? 0.2 : 0.8} />)}
                  </Pie>
                  {totalPlatformUses > 0 && <PieTooltip content={<CustomPieTooltip />} />}
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#0284C7', margin: 0 }}>{totalPlatformUses}</p>
                  <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>uses</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {donutColors.map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#374151' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>{d.realValue} use{d.realValue !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </motion.div>
      </div>

      {/* Bar chart */}
      <motion.div {...fadeUp(0.44)}>
        <ChartCard>
          <SectionHeader icon={BarChart2} title="Tools Usage Breakdown" subtitle="Total usage per tool" />
          <div style={{ height: 208 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={36} style={CHART_STYLE}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity={0.9} /><stop offset="100%" stopColor="#38BDF8" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(2,132,199,0.04)' }} />
                <Bar dataKey="value" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Uses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </motion.div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        <motion.div {...fadeUp(0.52)}>
          <ChartCard>
            <SectionHeader icon={Activity} title="Recent Activity" subtitle="Your latest generated content" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, padding: '8px 12px', borderRadius: 8, background: '#F9FAFB', border: '1px solid #F3F4F6', marginBottom: 4 }}>
              {['Type','Title','Platform','Score','Date'].map((col) => (
                <p key={col} style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>{col}</p>
              ))}
            </div>
            {analytics.recentActivity.length === 0 ? <TableEmptyState /> : (
              <div>
                {analytics.recentActivity.map((item) => {
                  const tc = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.proposal
                  return (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, padding: '10px 12px', borderBottom: '1px solid #F9FAFB', alignItems: 'center', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: tc.bg, border: `1px solid ${tc.border}`, color: tc.color }}>{tc.label}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{item.title || '—'}</p>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{item.platform || '—'}</p>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{item.score ?? '—'}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{formatDate(item.created_at)}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </ChartCard>
        </motion.div>

        <motion.div {...fadeUp(0.58)}>
          <ChartCard style={{ height: '100%' }}>
            <SectionHeader icon={Award} title="Top Proposals" subtitle="Highest scored" />
            {analytics.topProposals.length === 0 ? <ProposalEmptyState /> : (
              <div>
                {analytics.topProposals.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < analytics.topProposals.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', width: 16, flexShrink: 0, textAlign: 'center' }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{p.title}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{p.platform || 'Unknown'}</p>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0284C7', flexShrink: 0 }}>{p.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </ChartCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
