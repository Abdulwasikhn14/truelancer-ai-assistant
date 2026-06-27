import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Copy, Check, X, Package, Tag, FileText,
  HelpCircle, ClipboardList, Lightbulb, TrendingUp, Zap,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../../services/api'

const SUGGESTIONS = ['WordPress Developer','Logo Designer','Video Editor','SEO Expert','Content Writer','React Developer','Shopify Expert','UI/UX Designer']
const EXPERIENCE_LEVELS = [
  { id: 'Beginner',     emoji: '🟢', title: 'Beginner',     sub: '0-1 years, building portfolio' },
  { id: 'Intermediate', emoji: '🟡', title: 'Intermediate', sub: '1-3 years, steady clients'     },
  { id: 'Expert',       emoji: '🔴', title: 'Expert',       sub: '3+ years, premium rates'       },
]
const LOADING_MESSAGES = ['🔍 Analyzing market trends...','✍️ Writing your gig title...','💰 Calculating best pricing...','📦 Building your packages...','🏷️ Finding best keywords...','✅ Almost done...']
const PRO_TIP_ICONS = ['🚀','⭐','💡','🎯','📈']

const displayRevs = (r) => (r === -1 || r === '-1') ? 'Unlimited' : r

function formatAll(result, titleIdx = 0) {
  if (!result) return ''
  const sep = '─'.repeat(44), lines = []
  lines.push('GIG TITLE', sep, result.titles?.[titleIdx] || '', '')
  lines.push('DESCRIPTION', sep, result.description || '', '')
  if (result.packages) {
    lines.push('PACKAGES', sep)
    Object.entries(result.packages).forEach(([tier, p]) => {
      lines.push(`[${tier.toUpperCase()}] ${p.name} — $${p.price} | ${p.deliveryDays}d | ${displayRevs(p.revisions)} revisions`)
      if (p.tagline) lines.push(p.tagline)
      if (p.includes?.length) lines.push(`Includes: ${p.includes.join(', ')}`)
      if (p.notIncludes?.length) lines.push(`Not included: ${p.notIncludes.join(', ')}`)
      lines.push('')
    })
  }
  if (result.pricingStrategy) lines.push('PRICING STRATEGY', sep, result.pricingStrategy, '')
  if (result.tags?.length) lines.push('TAGS', result.tags.map((t) => `#${t}`).join(' '), '')
  if (result.keywords?.length) lines.push('KEYWORDS', result.keywords.join(', '), '')
  if (result.buyerRequirements?.length) { lines.push('BUYER REQUIREMENTS', sep); result.buyerRequirements.forEach((r, i) => lines.push(`${i + 1}. ${r}`)); lines.push('') }
  if (result.faqs?.length) { lines.push('FAQ', sep); result.faqs.forEach((f, i) => { lines.push(`Q${i + 1}: ${f.question}`, `A: ${f.answer}`, '') }) }
  if (result.proTips?.length) { lines.push('PRO TIPS', sep); result.proTips.forEach((t, i) => lines.push(`${i + 1}. ${t}`)) }
  return lines.join('\n')
}

function CopyBtn({ text, label = 'Copy', small = false }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => { if (!text) return; await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <motion.button onClick={copy} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.93 }}
      style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, borderRadius: 8, border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : '#E5E7EB'}`, background: copied ? 'rgba(16,185,129,0.06)' : '#ffffff', color: copied ? '#10B981' : '#6B7280', padding: small ? '4px 8px' : '6px 10px', fontSize: small ? 11 : 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
      <AnimatePresence mode="wait" initial={false}>
        {copied
          ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check style={{ width: 14, height: 14 }} /></motion.span>
          : <motion.span key="u" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Copy style={{ width: 14, height: 14 }} /></motion.span>
        }
      </AnimatePresence>
      {copied ? 'Copied!' : label}
    </motion.button>
  )
}

function OutCard({ index, icon: Icon, title, action, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {Icon && (
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon style={{ width: 14, height: 14, color: '#0284C7' }} />
            </div>
          )}
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>{title}</h3>
        </div>
        {action}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </motion.div>
  )
}

function InputView({ skill, setSkill, experienceLevel, setExperienceLevel, platform, setPlatform, onGenerate }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: '40px 16px' }}>
      <motion.div key="input-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 20, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 16, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)', marginBottom: 16 }}>
              <Sparkles style={{ width: 24, height: 24, color: '#0284C7' }} />
            </motion.div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0A0A0A', marginBottom: 6 }}>✨ Smart Gig Generator</h2>
            <p style={{ fontSize: 13, color: '#6B7280' }}>Tell us your skill and we'll build your complete gig</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Your Skill / Niche</label>
              <input value={skill} onChange={(e) => setSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
                placeholder="e.g. WordPress Developer, Logo Designer, Video Editor..."
                style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 16px', fontSize: 15, fontWeight: 500, color: '#0A0A0A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)'; e.target.style.background = '#ffffff' }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB' }} />
            </div>

            <div>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10 }}>Try one of these:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SUGGESTIONS.map((s, i) => (
                  <motion.button key={s} initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 400, damping: 22 }}
                    whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={() => setSkill(s)}
                    style={{ padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                      ...(skill === s ? { background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.3)', color: '#0284C7' } : { background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#6B7280' }) }}>
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Experience Level</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {EXPERIENCE_LEVELS.map(({ id, emoji, title, sub }) => (
                  <motion.button key={id} type="button" whileTap={{ scale: 0.96 }} onClick={() => setExperienceLevel(id)}
                    style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 8px', borderRadius: 12, textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                      ...(experienceLevel === id ? { background: 'rgba(2,132,199,0.06)', border: '1px solid rgba(2,132,199,0.25)' } : { background: '#F9FAFB', border: '1px solid #E5E7EB' }) }}>
                    {experienceLevel === id && <motion.div layoutId="exp-dot" style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#0284C7' }} />}
                    <span style={{ fontSize: 20 }}>{emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: experienceLevel === id ? '#0284C7' : '#374151' }}>{title}</span>
                    <span style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.3 }}>{sub}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Target Platform</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[{ id: 'Fiverr', label: 'Fiverr', emoji: '🎯' }, { id: 'Upwork', label: 'Upwork', emoji: '💼' }].map(({ id, label, emoji }) => (
                  <motion.button key={id} type="button" whileTap={{ scale: 0.97 }} onClick={() => setPlatform(id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                      ...(platform === id ? { background: 'rgba(2,132,199,0.06)', border: '1px solid rgba(2,132,199,0.25)', color: '#0284C7' } : { background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#374151' }) }}>
                    <span style={{ fontSize: 18 }}>{emoji}</span>{label}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button onClick={onGenerate} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ width: '100%', padding: '16px', borderRadius: 12, fontSize: 15, fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              🚀 Generate My Complete Gig
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function LoadingView({ msgIndex, progress }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32 }}>
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.35 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 320 }}>
        <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 32 }}>
          <motion.div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 0deg, #0284C7, #38BDF8, #10B981, #0284C7)' }}
            animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} />
          <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: 24, height: 24, color: '#0284C7' }} />
          </div>
        </div>
        <div style={{ height: 28, display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <AnimatePresence mode="wait">
            <motion.p key={msgIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
              style={{ fontSize: 14, fontWeight: 500, color: '#374151', textAlign: 'center', margin: 0 }}>
              {LOADING_MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div style={{ width: '100%', height: 6, borderRadius: 99, background: '#F3F4F6', overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #0284C7, #38BDF8)' }}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: 'linear' }} />
        </div>
        <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>{Math.round(progress)}%</p>
      </motion.div>
    </div>
  )
}

function TitleCard({ titles, selectedTitle, setSelectedTitle }) {
  return (
    <OutCard index={0} icon={FileText} title="Gig Titles — Choose your favourite">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {titles?.map((title, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            onClick={() => setSelectedTitle(i)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', borderRadius: 10, cursor: 'pointer', border: '1px solid', transition: 'all 0.2s',
              ...(selectedTitle === i ? { background: 'rgba(2,132,199,0.06)', borderColor: 'rgba(2,132,199,0.25)' } : { background: '#F9FAFB', borderColor: '#E5E7EB' }) }}>
            <p style={{ fontSize: 14, lineHeight: 1.4, color: selectedTitle === i ? '#0A0A0A' : '#374151', fontWeight: selectedTitle === i ? 600 : 400, margin: 0 }}>{title}</p>
            {selectedTitle === i
              ? <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(2,132,199,0.1)', color: '#0284C7', border: '1px solid rgba(2,132,199,0.25)', whiteSpace: 'nowrap' }}>Selected</span>
              : <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={(e) => { e.stopPropagation(); setSelectedTitle(i) }}
                  style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#ffffff', color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Use This
                </motion.button>
            }
          </motion.div>
        ))}
      </div>
    </OutCard>
  )
}

function DescriptionCard({ description }) {
  return (
    <OutCard index={1} icon={FileText} title="Gig Description" action={<CopyBtn text={description} />}>
      <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-line', margin: 0 }}>{description}</p>
    </OutCard>
  )
}

function PackagesCard({ packages }) {
  const tiers = ['basic', 'standard', 'premium']
  const tierStyles = {
    basic:    { color: '#374151', bg: '#F9FAFB',                      border: '#E5E7EB'                     },
    standard: { color: '#0284C7', bg: 'rgba(2,132,199,0.06)',        border: 'rgba(2,132,199,0.2)'        },
    premium:  { color: '#38BDF8', bg: 'rgba(56,189,248,0.06)',         border: 'rgba(56,189,248,0.2)'         },
  }
  const allFeatures = useMemo(() => { const set = new Set(); tiers.forEach((t) => { packages?.[t]?.includes?.forEach((f) => set.add(f)); packages?.[t]?.notIncludes?.forEach((f) => set.add(f)) }); return Array.from(set) }, [packages])
  const isIncluded = (tier, feature) => packages?.[tier]?.includes?.includes(feature) ?? false

  return (
    <OutCard index={2} icon={Package} title="Packages — 3 Tier Comparison">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
        <div />
        {tiers.map((t) => {
          const s = tierStyles[t], pkg = packages?.[t]
          return (
            <motion.div key={t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: tiers.indexOf(t) * 0.08 }}
              style={{ textAlign: 'center', padding: 12, borderRadius: 10, background: s.bg, border: `1px solid ${s.border}` }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, color: s.color }}>{t}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>${pkg?.price}</p>
              <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{pkg?.deliveryDays}d · {displayRevs(pkg?.revisions)} revs</p>
              {pkg?.tagline && <p style={{ fontSize: 10, color: '#6B7280', marginTop: 4, lineHeight: 1.3 }}>{pkg.tagline}</p>}
            </motion.div>
          )
        })}
      </div>
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #F3F4F6' }}>
        {allFeatures.map((feature, fi) => (
          <div key={feature} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '10px 12px', borderBottom: fi < allFeatures.length - 1 ? '1px solid #F9FAFB' : 'none', background: fi % 2 === 0 ? '#ffffff' : '#FAFAFA' }}>
            <p style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', margin: 0 }}>{feature}</p>
            {tiers.map((t) => (
              <div key={t} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isIncluded(t, feature) ? <Check style={{ width: 16, height: 16, color: '#10B981' }} /> : <X style={{ width: 16, height: 16, color: '#D1D5DB' }} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </OutCard>
  )
}

function PricingStrategyCard({ strategy }) {
  return (
    <OutCard index={3} icon={TrendingUp} title="💡 Pricing Strategy" action={<CopyBtn text={strategy} />}>
      <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>{strategy}</p>
    </OutCard>
  )
}

function TagPill({ text, color, index }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  const styles = {
    purple: { bg: 'rgba(2,132,199,0.08)', border: 'rgba(2,132,199,0.2)', clr: '#0284C7' },
    cyan:   { bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.2)', clr: '#38BDF8'  },
  }
  const s = styles[color] || styles.purple
  return (
    <motion.button onClick={copy} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 20, delay: index * 0.04 }}
      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, border: `1px solid ${s.border}`, background: s.bg, color: s.clr, cursor: 'pointer', fontFamily: 'inherit' }}>
      {copied && <Check style={{ width: 12, height: 12 }} />}{text}
    </motion.button>
  )
}

function SEOCard({ tags, keywords }) {
  return (
    <OutCard index={4} icon={Tag} title="SEO Keywords & Tags">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>Search Tags</p>
            <CopyBtn text={tags?.join(', ') || ''} label="Copy All Tags" small />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{tags?.map((tag, i) => <TagPill key={tag} text={`#${tag}`} color="purple" index={i} />)}</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>Keywords to Use</p>
            <CopyBtn text={keywords?.join(', ') || ''} label="Copy All" small />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{keywords?.map((kw, i) => <TagPill key={kw} text={kw} color="cyan" index={i} />)}</div>
        </div>
      </div>
    </OutCard>
  )
}

function RequirementsCard({ requirements }) {
  const allText = requirements?.map((r, i) => `${i + 1}. ${r}`).join('\n') || ''
  return (
    <OutCard index={5} icon={ClipboardList} title="Buyer Requirements" action={<CopyBtn text={allText} label="Copy All" />}>
      <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>What to ask your buyer before starting:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {requirements?.map((req, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '12px 16px', borderRadius: 10, background: '#F9FAFB', border: '1px solid #F3F4F6' }}
            className="group">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ color: '#0284C7', fontWeight: 700, fontSize: 12, flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>
              <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{req}</p>
            </div>
            <div style={{ flexShrink: 0 }}><CopyBtn text={req} small /></div>
          </motion.div>
        ))}
      </div>
    </OutCard>
  )
}

function FAQCard({ faqs }) {
  const allText = faqs?.map((f, i) => `Q${i + 1}: ${f.question}\nA: ${f.answer}`).join('\n\n') || ''
  return (
    <OutCard index={6} icon={HelpCircle} title="FAQ Section" action={<CopyBtn text={allText} label="Copy All FAQs" />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {faqs?.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ padding: '14px 16px', borderRadius: 10, background: '#F9FAFB', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', marginBottom: 6, lineHeight: 1.4 }}>{faq.question}</p>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{faq.answer}</p>
            </div>
            <div style={{ flexShrink: 0, marginTop: 2 }}><CopyBtn text={`Q: ${faq.question}\nA: ${faq.answer}`} small /></div>
          </motion.div>
        ))}
      </div>
    </OutCard>
  )
}

function ProTipsCard({ tips }) {
  return (
    <OutCard index={7} icon={Lightbulb} title="💡 Tips to Rank Your Gig Faster">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tips?.map((tip, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderRadius: 10, background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{PRO_TIP_ICONS[i % PRO_TIP_ICONS.length]}</span>
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>{tip}</p>
          </motion.div>
        ))}
      </div>
    </OutCard>
  )
}

function OutputView({ result, selectedTitle, setSelectedTitle, onRegenerate, onCopyAll, onReset, isRegenerating }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TitleCard titles={result.titles} selectedTitle={selectedTitle} setSelectedTitle={setSelectedTitle} />
          <DescriptionCard description={result.description} />
          <PackagesCard packages={result.packages} />
          <PricingStrategyCard strategy={result.pricingStrategy} />
          <SEOCard tags={result.tags} keywords={result.keywords} />
          <RequirementsCard requirements={result.buyerRequirements} />
          <FAQCard faqs={result.faqs} />
          <ProTipsCard tips={result.proTips} />
        </div>
      </div>
      <div style={{ flexShrink: 0, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F3F4F6', background: '#ffffff' }}>
        <motion.button onClick={onReset} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '8px 12px', borderRadius: 8, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#374151' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6B7280' }}>
          🔃 Start Over
        </motion.button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <motion.button onClick={onRegenerate} disabled={isRegenerating} whileHover={!isRegenerating ? { scale: 1.04 } : {}} whileTap={!isRegenerating ? { scale: 0.95 } : {}}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#ffffff', color: '#374151', cursor: isRegenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: isRegenerating ? 0.5 : 1 }}>
            <Zap style={{ width: 14, height: 14 }} /> 🔄 Regenerate
          </motion.button>
          <motion.button onClick={onCopyAll} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Copy style={{ width: 14, height: 14 }} /> 📋 Copy Everything
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default function Gig() {
  const [skill,           setSkill]           = useState('')
  const [experienceLevel, setExperienceLevel] = useState('Intermediate')
  const [platform,        setPlatform]        = useState('Fiverr')
  const [status,          setStatus]          = useState('idle')
  const [result,          setResult]          = useState(null)
  const [selectedTitle,   setSelectedTitle]   = useState(0)
  const [msgIndex,        setMsgIndex]        = useState(0)
  const [progress,        setProgress]        = useState(0)

  useEffect(() => {
    if (status !== 'loading') { setMsgIndex(0); return }
    const t = setInterval(() => setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length), 2000)
    return () => clearInterval(t)
  }, [status])

  useEffect(() => {
    if (status === 'loading') {
      setProgress(3)
      const id = setInterval(() => setProgress((p) => { if (p >= 88) { clearInterval(id); return p }; return p + 1.1 }), 200)
      return () => clearInterval(id)
    }
    if (status === 'done') setProgress(100)
  }, [status])

  const handleGenerate = useCallback(async () => {
    if (!skill.trim()) { toast.error('Please enter your skill or niche.'); return }
    setStatus('loading'); setResult(null); setSelectedTitle(0)
    try {
      const { data } = await api.post('/api/ai/gig', { skill, experienceLevel, platform })
      setResult(data); setStatus('done'); toast.success('Gig generated! ✨')
    } catch (err) {
      console.error('Gig generation error:', err)
      toast.error(err?.response?.data?.message || 'Failed to generate. Please try again.'); setStatus('idle')
    }
  }, [skill, experienceLevel, platform])

  const handleReset    = () => { setStatus('idle'); setResult(null) }
  const handleCopyAll  = async () => { const text = formatAll(result, selectedTitle); await navigator.clipboard.writeText(text); toast.success('Everything copied to clipboard! 📋') }

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden', background: '#FAFAFA' }}>
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div key="input" style={{ position: 'absolute', inset: 0, overflowY: 'auto' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <InputView skill={skill} setSkill={setSkill} experienceLevel={experienceLevel} setExperienceLevel={setExperienceLevel} platform={platform} setPlatform={setPlatform} onGenerate={handleGenerate} />
          </motion.div>
        )}
        {status === 'loading' && (
          <motion.div key="loading" style={{ position: 'absolute', inset: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <LoadingView msgIndex={msgIndex} progress={progress} />
          </motion.div>
        )}
        {status === 'done' && result && (
          <motion.div key="output" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <OutputView result={result} selectedTitle={selectedTitle} setSelectedTitle={setSelectedTitle} onRegenerate={handleGenerate} onCopyAll={handleCopyAll} onReset={handleReset} isRegenerating={status === 'loading'} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
