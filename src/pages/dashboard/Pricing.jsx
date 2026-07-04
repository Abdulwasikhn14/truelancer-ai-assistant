import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, animate } from 'framer-motion'
import {
  DollarSign, TrendingUp, Gem, Target, Clock,
  AlertTriangle, Lightbulb, ChevronDown, Check,
  BarChart2, Zap, ShieldAlert, Users, Sparkles,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../../services/api'

const EXPERIENCES = ['Beginner (0-1 years)','Intermediate (1-3 years)','Expert (3-5 years)','Senior Expert (5+ years)']
const LOCATIONS   = ['Pakistan, India, Bangladesh (South Asia)','Philippines, Indonesia (Southeast Asia)','Eastern Europe','Western Europe','North America','Middle East','Africa','Other']
const COMPLEXITIES = [
  { id: 'Simple',     emoji: '🟢', desc: 'Basic task, clear requirements'          },
  { id: 'Medium',     emoji: '🟡', desc: 'Moderate complexity, some unknowns'      },
  { id: 'Complex',    emoji: '🔴', desc: 'High complexity, multiple integrations'  },
  { id: 'Enterprise', emoji: '⚫', desc: 'Large scale, ongoing work'               },
]
const DELIVERIES = [
  { id: 'Rush (24-48 hours)',   note: '+50% premium' },
  { id: 'Fast (3-5 days)',      note: '+25% premium' },
  { id: 'Standard (1-2 weeks)', note: ''             },
  { id: 'Relaxed (2-4 weeks)',  note: ''             },
  { id: 'Flexible (1+ month)',  note: ''             },
]
const PLATFORM_OPTIONS = [
  { id: 'fiverr',     label: 'Fiverr',        feeNote: '20% platform fee' },
  { id: 'upwork',     label: 'Upwork',         feeNote: '10-20% fee'      },
  { id: 'freelancer', label: 'Freelancer.com', feeNote: '10% fee'         },
  { id: 'direct',     label: 'Direct Client',  feeNote: 'No fee'          },
]
const BUDGETS = ['Unknown','$50-$200 (Small budget)','$200-$500 (Medium budget)','$500-$2000 (Good budget)','$2000+ (Enterprise budget)']

const PRICE_CARD_DEFS = [
  { key: 'minPrice',       icon: DollarSign, label: 'Minimum Viable',  emoji: '💵', sublabel: "Don't go below this",      clr: '#374151', ibg: '#F9FAFB',                       bdr: '#E5E7EB' },
  { key: 'sweetSpotPrice', icon: Target,     label: 'Sweet Spot',       emoji: '🎯', sublabel: 'Best chance of winning',    clr: '#0284C7', ibg: 'rgba(2,132,199,0.06)',        bdr: 'rgba(2,132,199,0.25)', glow: '0 0 18px rgba(2,132,199,0.1)' },
  { key: 'premiumPrice',   icon: Gem,        label: 'Premium Rate',     emoji: '💎', sublabel: 'For ideal clients',         clr: '#38BDF8', ibg: 'rgba(56,189,248,0.06)',         bdr: 'rgba(56,189,248,0.2)' },
  { key: 'hourlyRate',     icon: Clock,      label: 'Hourly Rate',      emoji: '⏱️', sublabel: 'If charging by hour',      clr: '#10B981', ibg: 'rgba(16,185,129,0.06)',        bdr: 'rgba(16,185,129,0.2)', suffix: '/hr' },
]

const inputStyle = { width: '100%', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#0A0A0A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
const focusIn  = (e) => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)' }
const focusOut = (e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }

function Label({ children }) {
  return <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{children}</label>
}

function LightInput({ value, onChange, placeholder, type = 'text', ...rest }) {
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ ...inputStyle, background: '#F9FAFB' }} onFocus={e => { focusIn(e); e.target.style.background = '#ffffff' }} onBlur={e => { focusOut(e); e.target.style.background = '#F9FAFB' }} {...rest} />
}

function LightTextarea({ value, onChange, placeholder, rows = 3 }) {
  return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ ...inputStyle, background: '#F9FAFB', resize: 'none', lineHeight: 1.6 }} onFocus={e => { focusIn(e); e.target.style.background = '#ffffff' }} onBlur={e => { focusOut(e); e.target.style.background = '#F9FAFB' }} />
}

function LightSelect({ value, onChange, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={onChange} style={{ ...inputStyle, appearance: 'none', paddingRight: 36, cursor: 'pointer', background: '#F9FAFB' }} onFocus={e => { focusIn(e); e.target.style.background = '#ffffff' }} onBlur={e => { focusOut(e); e.target.style.background = '#F9FAFB' }}>
        {children}
      </select>
      <ChevronDown style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }} />
    </div>
  )
}

function SectionHeader({ number, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#0284C7' }}>{number}</span>
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
  )
}

function AnimatedPrice({ value, prefix = '$', suffix = '', style = {} }) {
  const [display, setDisplay] = useState(0)
  const prevRef = useRef(0)
  useEffect(() => {
    const ctrl = animate(prevRef.current, value, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)) })
    prevRef.current = value
    return ctrl.stop
  }, [value])
  return <span style={style}>{prefix}{display.toLocaleString()}{suffix}</span>
}

function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', textAlign: 'center' }}>
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <motion.div animate={{ opacity: [0.12, 0.28, 0.12], scale: [1, 1.08, 1] }} transition={{ duration: 3.5, repeat: Infinity }}
          style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'linear-gradient(135deg,#0284C7,#38BDF8)', filter: 'blur(18px)' }} />
        <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3.5, repeat: Infinity }}
          style={{ position: 'relative', width: 72, height: 72, borderRadius: 16, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DollarSign style={{ width: 32, height: 32, color: '#0284C7' }} />
        </motion.div>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', marginBottom: 8 }}>Get your price range</h3>
      <p style={{ fontSize: 13, color: '#6B7280', maxWidth: 240, lineHeight: 1.6 }}>
        Fill in the form and click <span style={{ color: '#0284C7', fontWeight: 500 }}>Get Pricing</span> to see AI-powered market rates.
      </p>
    </motion.div>
  )
}

function Sk({ h = 12, w = '100%', delay = 0 }) {
  return <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay }} style={{ height: h, width: w, borderRadius: 6, background: '#F3F4F6' }} />
}

function SkeletonLoader() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <Sk h={12} w="128px" delay={0} /><Sk h={40} w="208px" delay={0.1} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[0, 0.1, 0.2, 0.3].map((d, i) => (
          <div key={i} style={{ borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
            <Sk h={10} w="67%" delay={d} /><Sk h={28} delay={d + 0.08} /><Sk h={8} w="50%" delay={d + 0.16} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><Sk h={10} w="33%" delay={0.2} /><Sk h={40} delay={0.25} /></div>
    </motion.div>
  )
}

function PriceCard({ def, value, index }) {
  const { icon: Icon, label, sublabel, clr, ibg, bdr, glow, suffix } = def
  return (
    <motion.div initial={{ opacity: 0, y: 18, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: index * 0.08, duration: 0.38, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      style={{ borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, background: ibg, border: `1px solid ${bdr}`, boxShadow: glow || 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: ibg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon style={{ width: 14, height: 14, color: clr }} />
        </div>
      </div>
      <AnimatedPrice value={value} suffix={suffix || ''} style={{ fontSize: 24, fontWeight: 700, color: clr }} />
      <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{sublabel}</p>
    </motion.div>
  )
}

function PlatformTable({ platformPricing, selectedPlatforms }) {
  const rows = PLATFORM_OPTIONS.filter((p) => selectedPlatforms.includes(p.id) && platformPricing?.[p.id])
  if (!rows.length) return null
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      style={{ borderRadius: 12, overflow: 'hidden', background: '#ffffff', border: '1px solid #E5E7EB' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #F3F4F6' }}>
        <BarChart2 style={{ width: 16, height: 16, color: '#0284C7' }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>Platform Specific Pricing</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
            {['Platform', 'Recommended', 'Fee'].map((col, i) => (
              <th key={col} style={{ padding: '10px 16px', textAlign: i === 0 ? 'left' : 'right', fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <motion.tr key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
              style={{ borderBottom: i < rows.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
              <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#374151' }}>{p.label}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right' }}><AnimatedPrice value={platformPricing[p.id]} style={{ fontSize: 14, fontWeight: 700, color: '#0284C7' }} /></td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, color: '#9CA3AF' }}>{p.feeNote}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}

function BreakdownCard({ breakdown }) {
  if (!breakdown) return null
  const rows = [
    { label: 'Base Rate',             value: `$${breakdown.baseRate}`,            highlight: false },
    { label: 'Complexity Multiplier', value: `${breakdown.complexityMultiplier}×`, highlight: false },
    { label: 'Rush Fee',              value: breakdown.rushFee > 0 ? `+$${breakdown.rushFee}` : 'None', highlight: false },
    { label: 'Platform Fee Note',     value: breakdown.platformFeeNote,            highlight: true  },
  ]
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
      style={{ borderRadius: 12, padding: 16, background: '#ffffff', border: '1px solid #E5E7EB' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <TrendingUp style={{ width: 16, height: 16, color: '#38BDF8' }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>Pricing Breakdown</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(({ label, value, highlight }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#6B7280', flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'right', color: highlight ? '#F59E0B' : '#374151' }}>{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function AdvicePanel({ advice, negotiationTips, redFlags }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {advice?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ borderRadius: 12, padding: 16, background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Lightbulb style={{ width: 16, height: 16, color: '#F59E0B' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>AI Pricing Advice</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {advice.map((tip, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.09 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{tip}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
      {negotiationTips?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}
          style={{ borderRadius: 12, padding: 16, background: 'rgba(2,132,199,0.04)', border: '1px solid rgba(2,132,199,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Zap style={{ width: 16, height: 16, color: '#0284C7' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>Negotiation Tips</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {negotiationTips.map((tip, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.64 + i * 0.09 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: '50%', background: '#0284C7', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{tip}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
      {redFlags?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.64 }}
          style={{ borderRadius: 12, padding: 16, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <ShieldAlert style={{ width: 16, height: 16, color: '#EF4444' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>Red Flags to Watch</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {redFlags.map((flag, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.09 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <AlertTriangle style={{ width: 14, height: 14, color: '#EF4444', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{flag}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}

function CompetitiveScale({ marketRates, sweetSpotPrice }) {
  const parseRange = (str) => { if (!str) return [0, 0]; const parts = str.split('-').map((s) => parseInt(s.replace(/\D/g, ''), 10)); return [isNaN(parts[0]) ? 0 : parts[0], isNaN(parts[1]) ? 0 : parts[1]] }
  const [, expMax] = parseRange(marketRates?.expert)
  const scaleMax = Math.max(expMax * 1.25, sweetSpotPrice * 1.1, 100)
  const toPct = (v) => Math.min(Math.max(((v) / scaleMax) * 100, 0), 100)
  const sweetPct = toPct(sweetSpotPrice)
  const tiers = [
    { label: 'Beginner',     range: marketRates?.beginner,     color: '#10B981' },
    { label: 'Intermediate', range: marketRates?.intermediate, color: '#F59E0B' },
    { label: 'Expert',       range: marketRates?.expert,       color: '#0284C7' },
  ]
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
      style={{ borderRadius: 12, padding: 16, background: '#ffffff', border: '1px solid #E5E7EB' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Users style={{ width: 16, height: 16, color: '#38BDF8' }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>Competitive Analysis</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {tiers.map(({ label, range, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#6B7280', width: 112, flexShrink: 0 }}>{label} typically:</span>
            <span style={{ fontSize: 12, fontWeight: 600, color }}>${range}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Your position on the market</p>
      <div style={{ position: 'relative', marginBottom: 4, height: 28 }}>
        <motion.div style={{ position: 'absolute', top: 0, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          initial={{ left: '0%', opacity: 0 }} animate={{ left: `${Math.min(sweetPct, 92)}%`, opacity: 1 }} transition={{ duration: 1.3, delay: 0.85, ease: 'easeOut' }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', background: 'rgba(2,132,199,0.1)', color: '#0284C7', border: '1px solid rgba(2,132,199,0.25)' }}>${sweetSpotPrice}</span>
          <div style={{ width: 1, height: 8, background: 'rgba(2,132,199,0.4)' }} />
        </motion.div>
      </div>
      <div style={{ position: 'relative', height: 12, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 99, background: 'linear-gradient(90deg, #10B981 0%, #F59E0B 40%, #0284C7 75%, #38BDF8 100%)' }} />
        <motion.div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%) translateX(-50%)', width: 16, height: 16, borderRadius: '50%', background: 'white', boxShadow: '0 0 10px rgba(2,132,199,0.6), 0 0 0 2px rgba(2,132,199,0.4)' }}
          initial={{ left: '0%' }} animate={{ left: `${Math.min(sweetPct, 93)}%` }} transition={{ duration: 1.3, delay: 0.85, ease: 'easeOut' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {tiers.map(({ label, color }) => <span key={label} style={{ fontSize: 10, fontWeight: 500, color }}>{label}</span>)}
      </div>
    </motion.div>
  )
}

function ResultsPanel({ result, selectedPlatforms }) {
  return (
    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', padding: '20px 16px', borderRadius: 12, background: 'rgba(2,132,199,0.04)', border: '1px solid rgba(2,132,199,0.12)' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Recommended Sweet Spot</p>
        <AnimatedPrice value={result.sweetSpotPrice} style={{ fontSize: 40, fontWeight: 800, color: '#0284C7', letterSpacing: -2 }} />
        <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>Based on your profile + market data</p>
      </motion.div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Price Recommendations</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {PRICE_CARD_DEFS.map((def, i) => <PriceCard key={def.key} def={def} value={result[def.key] || 0} index={i} />)}
        </div>
      </div>
      <PlatformTable platformPricing={result.platformPricing} selectedPlatforms={selectedPlatforms} />
      <BreakdownCard breakdown={result.breakdown} />
      <AdvicePanel advice={result.advice} negotiationTips={result.negotiationTips} redFlags={result.redFlags} />
      {result.marketRates && <CompetitiveScale marketRates={result.marketRates} sweetSpotPrice={result.sweetSpotPrice} />}
    </motion.div>
  )
}

export default function Pricing() {
  const [form, setForm] = useState({
    jobTitle: '', jobDescription: '', projectType: 'Fixed Price',
    skills: '', experience: 'Intermediate (1-3 years)', location: 'North America',
    complexity: 'Medium', estimatedHours: '', deliveryTime: 'Standard (1-2 weeks)',
    platforms: ['upwork', 'fiverr'], clientBudget: 'Unknown',
  })
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target ? e.target.value : e }))
  const togglePlatform = (id) => setForm((prev) => ({ ...prev, platforms: prev.platforms.includes(id) ? prev.platforms.filter((p) => p !== id) : [...prev.platforms, id] }))

  const handleGenerate = useCallback(async () => {
    if (!form.skills.trim()) { toast.error('Please enter your expertise/skills.'); return }
    setStatus('loading'); setResult(null)
    try {
      const { data } = await api.post('/api/ai/pricing', { jobTitle: form.jobTitle, jobDescription: form.jobDescription, skills: form.skills, experience: form.experience, projectType: form.projectType, complexity: form.complexity, estimatedHours: form.estimatedHours, location: form.location, deliveryTime: form.deliveryTime, platforms: form.platforms, clientBudget: form.clientBudget })
      setResult(data); setStatus('done'); toast.success('Pricing analysis ready! 💰')
    } catch (err) {
      console.error('Pricing error:', err); toast.error(err?.response?.data?.message || 'Failed to get pricing. Please try again.'); setStatus('idle')
    }
  }, [form])

  const sectionBorder = { borderBottom: '1px solid #F3F4F6' }
  const sectionPad    = { padding: '24px 24px 20px' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      style={{ display: 'flex', overflow: 'hidden', height: 'calc(100vh - 64px)' }}>

      {/* Left: Form */}
      <div style={{ width: '100%', maxWidth: 440, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid #F3F4F6' }}>
        <div style={{ flexShrink: 0, padding: '16px 24px', borderBottom: '1px solid #F3F4F6', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign style={{ width: 16, height: 16, color: '#0284C7' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>Pricing Tool</h2>
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>AI-powered rate calculator</p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff' }}>
          {/* Section 1 */}
          <div style={{ ...sectionPad, ...sectionBorder }}>
            <SectionHeader number="1" title="Project Details" subtitle="What are you being hired to do?" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><Label>Job Title</Label><LightInput value={form.jobTitle} onChange={set('jobTitle')} placeholder="What is this project called?" /></div>
              <div><Label>Job Description</Label><LightTextarea value={form.jobDescription} onChange={set('jobDescription')} placeholder="Describe the project in detail…" rows={3} /></div>
              <div>
                <Label>Project Type</Label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['Fixed Price', 'Hourly Rate'].map((t) => (
                    <motion.button key={t} type="button" whileTap={{ scale: 0.96 }} onClick={() => setForm((p) => ({ ...p, projectType: t }))}
                      style={{ padding: '10px 8px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                        ...(form.projectType === t ? { background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.25)', color: '#0284C7' } : { background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#6B7280' }) }}>
                      {t}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div style={{ ...sectionPad, ...sectionBorder }}>
            <SectionHeader number="2" title="Your Profile" subtitle="Tell us about your background" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><Label>Your Expertise / Skills</Label><LightInput value={form.skills} onChange={set('skills')} placeholder="e.g. React, UI/UX Design, Copywriting…" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><Label>Experience Level</Label><LightSelect value={form.experience} onChange={set('experience')}>{EXPERIENCES.map((e) => <option key={e}>{e}</option>)}</LightSelect></div>
                <div><Label>Your Location</Label><LightSelect value={form.location} onChange={set('location')}>{LOCATIONS.map((l) => <option key={l}>{l}</option>)}</LightSelect></div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div style={{ ...sectionPad, ...sectionBorder }}>
            <SectionHeader number="3" title="Project Scope" subtitle="How big and complex is this project?" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <Label>Project Complexity</Label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {COMPLEXITIES.map(({ id, emoji, desc }) => (
                    <motion.button key={id} type="button" whileTap={{ scale: 0.97 }} onClick={() => setForm((p) => ({ ...p, complexity: id }))}
                      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, padding: 12, borderRadius: 10, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                        ...(form.complexity === id ? { background: 'rgba(2,132,199,0.06)', border: '1px solid rgba(2,132,199,0.2)' } : { background: '#F9FAFB', border: '1px solid #E5E7EB' }) }}>
                      {form.complexity === id && (
                        <motion.div layoutId="complexity-check" style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: '50%', background: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check style={{ width: 10, height: 10, color: 'white' }} />
                        </motion.div>
                      )}
                      <span style={{ fontSize: 16 }}>{emoji}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: form.complexity === id ? '#0284C7' : '#374151' }}>{id}</span>
                      <span style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.3 }}>{desc}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><Label>Estimated Hours</Label><LightInput type="number" value={form.estimatedHours} onChange={set('estimatedHours')} placeholder="How many hours?" min="0" /></div>
                <div><Label>Delivery Timeline</Label><LightSelect value={form.deliveryTime} onChange={set('deliveryTime')}>{DELIVERIES.map(({ id, note }) => <option key={id} value={id}>{id}{note ? `  (${note})` : ''}</option>)}</LightSelect></div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div style={sectionPad}>
            <SectionHeader number="4" title="Market & Platform" subtitle="Where will you be selling your service?" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <Label>Target Platforms</Label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {PLATFORM_OPTIONS.map(({ id, label, feeNote }) => {
                    const selected = form.platforms.includes(id)
                    return (
                      <motion.button key={id} type="button" whileTap={{ scale: 0.97 }} onClick={() => togglePlatform(id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                          ...(selected ? { background: 'rgba(2,132,199,0.06)', border: '1px solid rgba(2,132,199,0.2)' } : { background: '#F9FAFB', border: '1px solid #E5E7EB' }) }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', ...(selected ? { background: '#0284C7' } : { border: '1px solid #D1D5DB', background: '#ffffff' }) }}>
                          {selected && <Check style={{ width: 10, height: 10, color: 'white' }} />}
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: selected ? '#0284C7' : '#374151', margin: 0 }}>{label}</p>
                          <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0 }}>{feeNote}</p>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
              <div><Label>Client Budget Range</Label><LightSelect value={form.clientBudget} onChange={set('clientBudget')}>{BUDGETS.map((b) => <option key={b}>{b}</option>)}</LightSelect></div>
            </div>
          </div>

          {/* Generate */}
          <div style={{ padding: '20px 24px', borderTop: '1px solid #F3F4F6' }}>
            <motion.button onClick={handleGenerate} disabled={status === 'loading'}
              whileHover={status !== 'loading' ? { scale: 1.02 } : {}} whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 10, fontSize: 14, fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
              {status === 'loading'
                ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} />Analyzing market rates…</>
                : <><Sparkles style={{ width: 16, height: 16 }} />Get Pricing Suggestion</>
              }
            </motion.button>
            {status === 'done' && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>Adjust any field and regenerate for updated rates</motion.p>}
          </div>
        </div>
      </div>

      {/* Right: Results */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <div style={{ flexShrink: 0, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', background: '#ffffff' }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>Pricing Analysis</h3>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{status === 'done' ? 'Based on current market data' : 'Your rates will appear here'}</p>
          </div>
          {status === 'done' && (
            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#10B981', padding: '4px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse 1.5s ease-in-out infinite' }} /> Live
            </motion.span>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', background: '#FAFAFA' }}>
          <AnimatePresence mode="wait">
            {status === 'idle'    && <motion.div key="empty"   style={{ height: '100%', display: 'flex', alignItems: 'center' }}><EmptyState /></motion.div>}
            {status === 'loading' && <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SkeletonLoader /></motion.div>}
            {status === 'done' && result && <ResultsPanel key="results" result={result} selectedPlatforms={form.platforms} />}
          </AnimatePresence>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </motion.div>
  )
}
