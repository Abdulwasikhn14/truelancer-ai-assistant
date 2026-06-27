import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Sparkles, Copy, Check, RefreshCw,
  ChevronDown, Target, ClipboardList,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../../services/api'

const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Expert']
const PLATFORM_OPTIONS   = ['Upwork', 'Fiverr', 'Freelancer.com']
const TONE_OPTIONS       = ['Professional', 'Friendly', 'Confident']

const INITIAL_FORM = {
  jobTitle:   '',
  jobDesc:    '',
  skills:     '',
  experience: 'Intermediate',
  platform:   'Upwork',
  tone:       'Professional',
}

const fieldVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.38, ease: 'easeOut' } }),
}

function Label({ children }) {
  return (
    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
      {children}
    </label>
  )
}

const inputStyle = {
  width: '100%', background: '#ffffff', border: '1px solid #E5E7EB',
  borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#0A0A0A',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

function LightInput({ ...props }) {
  return (
    <input
      style={inputStyle}
      onFocus={e => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)' }}
      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
      {...props}
    />
  )
}

function LightTextarea({ ...props }) {
  return (
    <textarea
      style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
      onFocus={e => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)' }}
      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
      {...props}
    />
  )
}

function LightSelect({ value, onChange, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={onChange}
        style={{ ...inputStyle, appearance: 'none', paddingRight: 36, cursor: 'pointer' }}
        onFocus={e => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)' }}
        onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
      >
        {children}
      </select>
      <ChevronDown style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }} />
    </div>
  )
}

function SkeletonLine({ width = '100%', delay = 0 }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ width, height: 12, borderRadius: 6, background: '#F3F4F6' }}
    />
  )
}

function SkeletonLoader() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SkeletonLine width="80%" delay={0} />
      <SkeletonLine delay={0.1} />
      <SkeletonLine delay={0.15} />
      <SkeletonLine width="75%" delay={0.2} />
      <div style={{ paddingTop: 8 }} />
      <SkeletonLine delay={0.05} />
      <SkeletonLine delay={0.1} />
      <SkeletonLine width="83%" delay={0.15} />
      <div style={{ paddingTop: 8 }} />
      <SkeletonLine delay={0} />
      <SkeletonLine width="80%" delay={0.1} />
      <SkeletonLine delay={0.15} />
      <SkeletonLine width="67%" delay={0.2} />
      <div style={{ paddingTop: 16, display: 'flex', gap: 12 }}>
        <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }} style={{ height: 36, width: 144, borderRadius: 8, background: '#F3F4F6' }} />
        <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.5 }} style={{ height: 36, width: 112, borderRadius: 8, background: '#F3F4F6' }} />
      </div>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '64px 32px', textAlign: 'center' }}
    >
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <motion.div
          animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 80, height: 80, borderRadius: 16, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ClipboardList style={{ width: 36, height: 36, color: '#0284C7' }} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -5, 0], rotate: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          style={{ position: 'absolute', top: -8, right: -8, width: 32, height: 32, borderRadius: 10, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Sparkles style={{ width: 16, height: 16, color: '#38BDF8' }} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 5, 0], rotate: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          style={{ position: 'absolute', bottom: -8, left: -8, width: 28, height: 28, borderRadius: 8, background: 'rgba(2,132,199,0.1)', border: '1px solid rgba(2,132,199,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Target style={{ width: 14, height: 14, color: '#0284C7' }} />
        </motion.div>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', marginBottom: 8 }}>Ready to generate</h3>
      <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, maxWidth: 260 }}>
        Fill in the form on the left and hit <span style={{ color: '#0284C7', fontWeight: 600 }}>Generate Proposal</span> — your AI-crafted bid will appear here.
      </p>
      <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(2,132,199,0.5)' }} />
        ))}
      </div>
    </motion.div>
  )
}

function ScoreBar({ label, score, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.38, ease: 'easeOut' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>{label}</span>
        <motion.span style={{ fontSize: 12, fontWeight: 700, color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.5 }}>
          {score}%
        </motion.span>
      </div>
      <div style={{ height: 6, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', borderRadius: 99, background: color }}
          initial={{ width: 0 }} animate={{ width: `${score}%` }}
          transition={{ delay: delay + 0.1, duration: 0.85, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

function ProposalResult({ text, scores, onRegenerate }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>

      <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 16, right: 16, height: 2, background: 'linear-gradient(90deg, transparent, #0284C7, transparent)' }} />
        <pre style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
          {text}
        </pre>
        <p style={{ marginTop: 16, textAlign: 'right', fontSize: 11, color: '#9CA3AF' }}>{text.length.toLocaleString()} characters</p>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{ flex: 1, background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: 'none', borderRadius: 8, padding: '10px 16px', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}
        >
          <AnimatePresence mode="wait">
            {copied
              ? <motion.span key="copied" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check style={{ width: 16, height: 16, color: '#A7F3D0' }} /> Copied!
                </motion.span>
              : <motion.span key="copy" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Copy style={{ width: 16, height: 16 }} /> Copy to Clipboard
                </motion.span>
            }
          </AnimatePresence>
        </motion.button>

        <motion.button
          onClick={onRegenerate}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 16px', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}
        >
          <RefreshCw style={{ width: 16, height: 16 }} /> Regenerate
        </motion.button>
      </div>

      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Proposal Score</p>
        <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ScoreBar label="Success Score" score={scores.success} color="#10B981" delay={0.05} />
          <ScoreBar label="Tone Score"    score={scores.tone}    color="#38BDF8" delay={0.18} />
          <ScoreBar label="Clarity Score" score={scores.clarity} color="#0284C7" delay={0.31} />
        </div>
      </div>
    </motion.div>
  )
}

export default function Proposal() {
  const [form,     setForm]     = useState(INITIAL_FORM)
  const [status,   setStatus]   = useState('idle')
  const [proposal, setProposal] = useState('')
  const [scores,   setScores]   = useState(null)
  const [errors,   setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!form.jobTitle.trim()) e.jobTitle = 'Job title is required.'
    if (!form.jobDesc.trim())  e.jobDesc  = 'Job description is required.'
    if (!form.skills.trim())   e.skills   = 'Skills are required.'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const generate = useCallback(async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('loading'); setProposal(''); setScores(null)
    try {
      const { data } = await api.post('/api/ai/proposal', {
        jobTitle: form.jobTitle, jobDescription: form.jobDesc,
        skills: form.skills, experience: form.experience,
        platform: form.platform, tone: form.tone,
      })
      setProposal(data.proposal)
      setScores({ success: data.successScore, tone: data.toneScore, clarity: data.clarityScore })
      setStatus('done')
      toast.success('Proposal generated successfully! ✨')
    } catch (err) {
      console.error('Proposal generation error:', err)
      toast.error('Failed to generate proposal. Please try again.')
      setStatus('idle')
    }
  }, [form])

  const handleRegenerate = () => { setStatus('idle'); setTimeout(() => generate(), 50) }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      style={{ padding: '24px 32px' }}>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0A0A0A', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <FileText style={{ width: 20, height: 20, color: '#0284C7' }} />
          Proposal Generator
        </h2>
        <p style={{ marginTop: 4, fontSize: 13, color: '#6B7280' }}>Craft a winning proposal in seconds with AI.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>

        {/* Left: Input form */}
        <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>Job Details</h3>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Tell us about the project</p>
          </div>

          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
              <Label>Job Title</Label>
              <LightInput type="text" placeholder="e.g. Build a React dashboard" value={form.jobTitle} onChange={handleChange('jobTitle')} />
              <AnimatePresence>
                {errors.jobTitle && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
                    {errors.jobTitle}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
              <Label>Job Description</Label>
              <LightTextarea rows={5} placeholder="Paste the full job description here…" value={form.jobDesc} onChange={handleChange('jobDesc')} />
              <AnimatePresence>
                {errors.jobDesc && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
                    {errors.jobDesc}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
              <Label>Your Skills</Label>
              <LightInput type="text" placeholder="React, Node.js, Tailwind, PostgreSQL" value={form.skills} onChange={handleChange('skills')} />
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>Separate skills with commas</p>
              <AnimatePresence>
                {errors.skills && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
                    {errors.skills}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                <Label>Experience Level</Label>
                <LightSelect value={form.experience} onChange={handleChange('experience')}>
                  {EXPERIENCE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </LightSelect>
              </motion.div>
              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
                <Label>Platform</Label>
                <LightSelect value={form.platform} onChange={handleChange('platform')}>
                  {PLATFORM_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </LightSelect>
              </motion.div>
            </div>

            <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
              <Label>Proposal Tone</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {TONE_OPTIONS.map((t) => (
                  <motion.button
                    key={t} type="button"
                    onClick={() => setForm((prev) => ({ ...prev, tone: t }))}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      padding: '10px 8px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                      ...(form.tone === t
                        ? { background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.3)', color: '#0284C7' }
                        : { background: '#ffffff', border: '1px solid #E5E7EB', color: '#6B7280' })
                    }}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
              <motion.button
                onClick={generate}
                disabled={status === 'loading'}
                whileHover={status !== 'loading' ? { scale: 1.02 } : {}}
                whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
                style={{ width: '100%', background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: 'none', borderRadius: 10, padding: '13px 16px', color: 'white', fontSize: 14, fontWeight: 700, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', marginTop: 4 }}
              >
                {status === 'loading'
                  ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /> Generating…</>
                  : <><Sparkles style={{ width: 16, height: 16 }} /> Generate Proposal</>
                }
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Right: Output panel */}
        <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden', minHeight: 520, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>Generated Proposal</h3>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{status === 'done' ? 'Ready to copy and send' : 'Your proposal will appear here'}</p>
            </div>
            {status === 'done' && (
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#10B981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '4px 10px', borderRadius: 99 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse 1.5s ease-in-out infinite' }} />
                Ready
              </motion.span>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              {status === 'idle'    && <motion.div key="empty"   style={{ height: '100%' }}><EmptyState /></motion.div>}
              {status === 'loading' && <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SkeletonLoader /></motion.div>}
              {status === 'done' && proposal && <motion.div key="result"><ProposalResult text={proposal} scores={scores} onRegenerate={handleRegenerate} /></motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </motion.div>
  )
}
