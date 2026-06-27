import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, Search, Copy, Trash2, Eye, ChevronDown,
  FileText, Briefcase, MessageSquare, Bot, ArrowRight,
  SlidersHorizontal, X, Check,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../../services/api'

// ── Type + platform config ────────────────────────────────────────────────────

const TYPE_CONFIG = {
  Proposal: {
    icon: FileText,
    color: '#0284C7',
    bg: 'rgba(2,132,199,0.08)',
    border: 'rgba(2,132,199,0.2)',
    dot: '#0284C7',
  },
  Gig: {
    icon: Briefcase,
    color: '#38BDF8',
    bg: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.2)',
    dot: '#38BDF8',
  },
  Message: {
    icon: MessageSquare,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
    dot: '#10B981',
  },
  Chatbot: {
    icon: Bot,
    color: '#F97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.2)',
    dot: '#F97316',
  },
}

const PLATFORM_CONFIG = {
  Upwork:           { color: '#10B981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)'  },
  Fiverr:           { color: '#38BDF8', bg: 'rgba(56,189,248,0.08)',   border: 'rgba(56,189,248,0.2)'   },
  'Freelancer.com': { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
}

const DB_TYPE_MAP = {
  proposal: 'Proposal',
  gig:      'Gig',
  message:  'Message',
  chat:     'Chatbot',
}

const TYPE_FILTERS     = ['All', 'Proposal', 'Gig', 'Message', 'Chatbot']
const PLATFORM_FILTERS = ['All', 'Upwork', 'Fiverr', 'Freelancer.com']
const SORT_OPTIONS     = ['Newest', 'Oldest']

// ── Normalise ─────────────────────────────────────────────────────────────────

function normalise(row) {
  return {
    id:       row.id,
    type:     DB_TYPE_MAP[row.type] ?? 'Proposal',
    title:    row.title || '(untitled)',
    preview:  row.content ? row.content.substring(0, 120) : '',
    platform: row.platform ?? null,
    score:    row.score    ?? null,
    date:     row.created_at,
  }
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = async (text) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return [copied, copy]
}

// ── History card ──────────────────────────────────────────────────────────────

function HistoryCard({ item, index, onDelete }) {
  const [copied, copy] = useCopy()
  const [hovered, setHovered] = useState(false)
  const tc = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.Proposal
  const pc = PLATFORM_CONFIG[item.platform] ?? {}
  const Icon = tc.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
      layout
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: '#ffffff', border: `1px solid ${hovered ? 'rgba(2,132,199,0.2)' : '#E5E7EB'}`, borderRadius: 12, padding: '16px 20px', transition: 'border-color 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        {/* Left: icon + content */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, minWidth: 0, flex: 1 }}>
          <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 8, background: tc.bg, border: `1px solid ${tc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
            <Icon style={{ width: 16, height: 16, color: tc.color }} />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: tc.bg, border: `1px solid ${tc.border}`, color: tc.color }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: tc.dot, display: 'inline-block' }} />
                {item.type}
              </span>

              {item.platform && pc.color && (
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: pc.bg, border: `1px solid ${pc.border}`, color: pc.color }}>
                  {item.platform}
                </span>
              )}

              {item.score != null && (
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)', color: '#0284C7' }}>
                  Score: {item.score}
                </span>
              )}
            </div>

            <p style={{ fontSize: 14, fontWeight: 600, color: hovered ? '#0284C7' : '#0A0A0A', transition: 'color 0.2s', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.title}
            </p>

            {item.preview && (
              <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{item.preview}</p>
            )}

            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock style={{ width: 12, height: 12 }} />
              {formatDate(item.date)}
            </p>
          </div>
        </div>

        {/* Right: action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            style={{ width: 28, height: 28, borderRadius: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="View"
            onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB' }}
          >
            <Eye style={{ width: 14, height: 14, color: '#6B7280' }} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => copy(item.preview || item.title)}
            style={{ width: 28, height: 28, borderRadius: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="Copy"
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(2,132,199,0.06)'; e.currentTarget.style.borderColor = 'rgba(2,132,199,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#E5E7EB' }}
          >
            {copied
              ? <Check style={{ width: 14, height: 14, color: '#10B981' }} />
              : <Copy style={{ width: 14, height: 14, color: '#6B7280' }} />
            }
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(item.id)}
            style={{ width: 28, height: 28, borderRadius: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="Delete"
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#E5E7EB' }}
          >
            <Trash2 style={{ width: 14, height: 14, color: '#EF4444' }} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ isFiltered }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 0', textAlign: 'center' }}
    >
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 80, height: 80, borderRadius: 16, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Clock style={{ width: 36, height: 36, color: '#0284C7' }} />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '1px dashed rgba(2,132,199,0.2)' }}
        />
        {[
          { top: '-8px',  right: '-8px',  delay: 0   },
          { bottom: '-6px', left: '-10px', delay: 0.6 },
        ].map((pos, i) => (
          <motion.span
            key={i}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: pos.delay }}
            style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: 'rgba(56,189,248,0.4)', border: '1px solid rgba(56,189,248,0.3)', top: pos.top, right: pos.right, bottom: pos.bottom, left: pos.left }}
          />
        ))}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>
        {isFiltered ? 'No results found' : 'No history yet'}
      </h3>
      <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 6, maxWidth: 280, lineHeight: 1.6 }}>
        {isFiltered
          ? 'Try adjusting your filters or search term.'
          : 'Your generated proposals, gigs, messages and chatbot conversations will appear here.'}
      </p>

      {!isFiltered && (
        <Link to="/dashboard/proposals">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{ marginTop: 24, background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          >
            Start Generating
            <ArrowRight style={{ width: 16, height: 16 }} />
          </motion.button>
        </Link>
      )}
    </motion.div>
  )
}

// ── Filter pill ───────────────────────────────────────────────────────────────

function FilterPill({ active, onClick, children }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1px solid', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
        background: active ? 'rgba(2,132,199,0.08)' : '#ffffff',
        borderColor: active ? 'rgba(2,132,199,0.4)' : '#E5E7EB',
        color: active ? '#0284C7' : '#6B7280',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(2,132,199,0.25)'; e.currentTarget.style.color = '#374151' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#6B7280' } }}
    >
      {children}
    </motion.button>
  )
}

// ── Sort select ───────────────────────────────────────────────────────────────

function SortSelect({ value, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ appearance: 'none', WebkitAppearance: 'none', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 28px 6px 12px', fontSize: 12, fontWeight: 600, color: '#374151', outline: 'none', cursor: 'pointer' }}
        onFocus={e => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)' }}
        onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
      >
        {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#9CA3AF', pointerEvents: 'none' }} />
    </div>
  )
}

// ── Date input ────────────────────────────────────────────────────────────────

function DateInput({ value, onChange, placeholder }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#374151', outline: 'none', width: 144, cursor: 'pointer' }}
      onFocus={e => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)' }}
      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
    />
  )
}

// ── Skeleton row ──────────────────────────────────────────────────────────────

function SkeletonRow({ delay = 0 }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F3F4F6', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 10, background: '#F3F4F6', borderRadius: 99, width: '25%' }} />
        <div style={{ height: 12, background: '#F3F4F6', borderRadius: 99, width: '60%' }} />
        <div style={{ height: 8, background: '#F3F4F6', borderRadius: 99, width: '35%' }} />
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function History() {
  const [items,          setItems]          = useState([])
  const [loading,        setLoading]        = useState(true)
  const [search,         setSearch]         = useState('')
  const [typeFilter,     setTypeFilter]     = useState('All')
  const [platformFilter, setPlatformFilter] = useState('All')
  const [sort,           setSort]           = useState('Newest')
  const [dateFrom,       setDateFrom]       = useState('')
  const [dateTo,         setDateTo]         = useState('')
  const [filtersOpen,    setFiltersOpen]    = useState(true)

  useEffect(() => {
    api.get('/api/history')
      .then(({ data }) => setItems(data.map(normalise)))
      .catch(() => toast.error('Failed to load history.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    try {
      await api.delete(`/api/history/${id}`)
    } catch {
      toast.error('Failed to delete item.')
      api.get('/api/history')
        .then(({ data }) => setItems(data.map(normalise)))
        .catch(() => {})
    }
  }

  const hasActiveFilter =
    typeFilter !== 'All' || platformFilter !== 'All' || search || dateFrom || dateTo

  const clearFilters = () => {
    setSearch('')
    setTypeFilter('All')
    setPlatformFilter('All')
    setDateFrom('')
    setDateTo('')
    setSort('Newest')
  }

  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        if (typeFilter !== 'All' && item.type !== typeFilter) return false
        if (platformFilter !== 'All' && item.platform !== platformFilter) return false
        if (search && !item.title.toLowerCase().includes(search.toLowerCase()) &&
            !item.preview?.toLowerCase().includes(search.toLowerCase())) return false
        if (dateFrom && new Date(item.date) < new Date(dateFrom)) return false
        if (dateTo   && new Date(item.date) > new Date(dateTo + 'T23:59:59')) return false
        return true
      })
      .sort((a, b) =>
        sort === 'Newest'
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date)
      )
  }, [items, search, typeFilter, platformFilter, sort, dateFrom, dateTo])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ padding: '24px 32px' }}
    >
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0A0A0A', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <Clock style={{ width: 20, height: 20, color: '#0284C7' }} />
            History
          </h2>
          <p style={{ marginTop: 2, fontSize: 14, color: '#6B7280' }}>
            All your generated content in one place.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6B7280', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 12px' }}>
          <Clock style={{ width: 14, height: 14 }} />
          {items.length} item{items.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}
      >
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>
            <SlidersHorizontal style={{ width: 16, height: 16, color: '#0284C7' }} />
            Filters
            {hasActiveFilter && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', background: '#0284C7', color: 'white', fontSize: 9, fontWeight: 700 }}
              >
                !
              </motion.span>
            )}
          </div>
          <motion.div animate={{ rotate: filtersOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown style={{ width: 16, height: 16, color: '#9CA3AF' }} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '4px 20px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Search */}
                <div style={{ position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search your history…"
                    style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, paddingLeft: 40, paddingRight: 36, paddingTop: 10, paddingBottom: 10, fontSize: 14, color: '#0A0A0A', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    onFocus={e => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)'; e.target.style.background = '#ffffff' }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB' }}
                  />
                  <AnimatePresence>
                    {search && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setSearch('')}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#374151'}
                        onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
                      >
                        <X style={{ width: 16, height: 16 }} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Type + Platform filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Type</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {TYPE_FILTERS.map((t) => (
                        <FilterPill key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>
                          {t !== 'All' && TYPE_CONFIG[t] && (
                            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: TYPE_CONFIG[t].dot, marginRight: 4 }} />
                          )}
                          {t}
                        </FilterPill>
                      ))}
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Platform</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {PLATFORM_FILTERS.map((p) => (
                        <FilterPill key={p} active={platformFilter === p} onClick={() => setPlatformFilter(p)}>
                          {p}
                        </FilterPill>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sort + Date range */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Sort</p>
                    <SortSelect value={sort} onChange={setSort} />
                  </div>

                  <div>
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Date Range</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <DateInput value={dateFrom} onChange={setDateFrom} placeholder="From" />
                      <span style={{ color: '#9CA3AF', fontSize: 12 }}>—</span>
                      <DateInput value={dateTo} onChange={setDateTo} placeholder="To" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {hasActiveFilter && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={clearFilters}
                        whileTap={{ scale: 0.95 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280', border: '1px solid #E5E7EB', background: '#ffffff', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB' }}
                      >
                        <X style={{ width: 14, height: 14 }} />
                        Clear filters
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* History list */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0, 0.07, 0.14].map((d, i) => <SkeletonRow key={i} delay={d} />)}
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div key="empty">
            <EmptyState isFiltered={hasActiveFilter && items.length > 0} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
          >
            <p style={{ fontSize: 12, color: '#9CA3AF', paddingBottom: 8 }}>
              Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AnimatePresence>
                {filtered.map((item, i) => (
                  <HistoryCard
                    key={item.id}
                    item={item}
                    index={i}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
