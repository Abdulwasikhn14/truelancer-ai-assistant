import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Plus, Trash2, Bot, Copy, Check,
  Download, Pencil, Send, Sparkles, Menu, ChevronRight,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../../services/api'

const TONES     = ['Friendly', 'Professional', 'Confident']
const PLATFORMS = ['Upwork', 'Fiverr', 'Freelancer.com']

const PERSONALITIES = {
  'Serious':        { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.2)'   },
  'Budget-Focused': { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.2)'   },
  'Difficult':      { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.2)'    },
  'Confused':       { color: '#F97316', bg: 'rgba(249,115,22,0.08)',   border: 'rgba(249,115,22,0.2)'   },
}

const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const formatDate = (ts) => {
  const d = new Date(ts), today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  const yest = new Date(today); yest.setDate(today.getDate() - 1)
  if (d.toDateString() === yest.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
const formatExport = (session, messages) => {
  const header = [`Client Assistant — ${session?.title || 'Chat'}`, `Date: ${formatDate(session?.created_at || Date.now())}`, `Tone: ${session?.tone || '—'}  |  Platform: ${session?.platform || '—'}`, '═'.repeat(52)].join('\n')
  const body = messages.map((m) => m.role === 'user' ? `[Client Message]\n${m.text}` : `[Suggested Reply]${m.personality ? ` (${m.personality})` : ''}\n${m.text}`).join('\n\n──────────────────────────────────────────────────\n\n')
  return `${header}\n\n${body}`
}
const mkMsg = (role, text, personality = null) => ({ id: crypto.randomUUID(), role, text, personality, timestamp: new Date().toISOString() })

function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.25 }}
      style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0284C7, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Bot style={{ width: 16, height: 16, color: 'white' }} />
      </div>
      <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
        {[0, 0.18, 0.36].map((delay, i) => (
          <motion.span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#9CA3AF', display: 'block' }}
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.6, repeat: Infinity, delay, ease: 'easeInOut' }} />
        ))}
      </div>
    </motion.div>
  )
}

function UserBubble({ msg }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20, y: 6 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }}
      style={{ display: 'flex', alignItems: 'flex-end', gap: 10, justifyContent: 'flex-end', maxWidth: '78%', alignSelf: 'flex-end' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <span style={{ fontSize: 10, color: '#9CA3AF', marginRight: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500 }}>Client message</span>
        <div style={{ background: 'linear-gradient(135deg, #0284C7, #38BDF8)', borderRadius: '16px 16px 4px 16px', padding: '12px 16px', boxShadow: '0 4px 20px rgba(2,132,199,0.2)' }}>
          <p style={{ fontSize: 14, color: 'white', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</p>
        </div>
        <span style={{ fontSize: 10, color: '#9CA3AF', marginRight: 4 }}>{formatTime(msg.timestamp)}</span>
      </div>
    </motion.div>
  )
}

function AIBubble({ msg }) {
  const [copied, setCopied] = useState(false)
  const p = PERSONALITIES[msg.personality]
  const copy = async () => { await navigator.clipboard.writeText(msg.text); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <motion.div initial={{ opacity: 0, x: -20, y: 6 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ display: 'flex', alignItems: 'flex-end', gap: 10, maxWidth: '78%' }} className="group">
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0284C7, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Bot style={{ width: 16, height: 16, color: 'white' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {p && (
          <motion.span initial={{ opacity: 0, scale: 0.75, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}
            style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: p.bg, border: `1px solid ${p.border}`, color: p.color }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }} />
            {msg.personality}
          </motion.span>
        )}
        <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px 16px 16px 4px', padding: '12px 16px' }}>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 4 }}>
          <span style={{ fontSize: 10, color: '#9CA3AF' }}>{formatTime(msg.timestamp)}</span>
          <motion.button onClick={copy} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: copied ? '#10B981' : '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, transition: 'color 0.2s' }}>
            {copied ? <><Check style={{ width: 12, height: 12 }} />Copied</> : <><Copy style={{ width: 12, height: 12 }} />Copy</>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function SessionCard({ session, isActive, onSelect, onDelete, index }) {
  const [hovering, setHovering] = useState(false)
  const preview = session.messages?.[0]?.text || 'Empty chat'
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16, height: 0, overflow: 'hidden' }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
      onClick={onSelect}
      style={{ position: 'relative', padding: '10px 12px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
        ...(isActive ? { background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)' } : { background: hovering ? '#F9FAFB' : 'transparent', border: '1px solid transparent' }) }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#0284C7' : '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{session.title}</p>
      <p style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{preview.slice(0, 48)}</p>
      <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>{formatDate(session.updated_at)}</p>
      <AnimatePresence>
        {hovering && (
          <motion.button initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.75 }} transition={{ duration: 0.12 }}
            onClick={(e) => { e.stopPropagation(); onDelete(session.id) }}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 6, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#EF4444'} onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
            <Trash2 style={{ width: 14, height: 14 }} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function WelcomeScreen({ tone, setTone, platform, setPlatform }) {
  return (
    <motion.div key="welcome" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px 32px', textAlign: 'center' }}>
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity }}
          style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageSquare style={{ width: 28, height: 28, color: '#0284C7' }} />
        </motion.div>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0A0A0A', marginBottom: 8 }}>Client Assistant</h3>
      <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 280, lineHeight: 1.6, marginBottom: 32 }}>Paste any client message and get a smart AI reply tailored to your tone and platform.</p>

      <div style={{ width: '100%', maxWidth: 340, marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Reply Tone</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {TONES.map((t) => (
            <motion.button key={t} type="button" whileTap={{ scale: 0.95 }} onClick={() => setTone(t)}
              style={{ padding: '10px 8px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                ...(tone === t ? { background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.3)', color: '#0284C7' } : { background: '#ffffff', border: '1px solid #E5E7EB', color: '#6B7280' }) }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 340 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Platform</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {PLATFORMS.map((pl) => (
            <motion.button key={pl} type="button" whileTap={{ scale: 0.95 }} onClick={() => setPlatform(pl)}
              style={{ padding: '10px 8px', borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                ...(platform === pl ? { background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', color: '#38BDF8' } : { background: '#ffffff', border: '1px solid #E5E7EB', color: '#6B7280' }) }}>
              {pl}
            </motion.button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 28, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Sparkles style={{ width: 12, height: 12, color: '#0284C7' }} /> These settings persist throughout the session
      </p>
    </motion.div>
  )
}

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onCancel}>
      <motion.div initial={{ opacity: 0, scale: 0.88, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.88, y: 20 }} transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24, maxWidth: 340, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Trash2 style={{ width: 20, height: 20, color: '#EF4444' }} />
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', marginBottom: 4 }}>Delete this chat?</h3>
        <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 20 }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, border: '1px solid #E5E7EB', background: '#ffffff', color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={onConfirm}
            style={{ flex: 1, padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', cursor: 'pointer', fontFamily: 'inherit' }}>
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Messages() {
  const [sessions,       setSessions]       = useState([])
  const [activeId,       setActiveId]       = useState(null)
  const [messages,       setMessages]       = useState([])
  const [tone,           setTone]           = useState('Professional')
  const [platform,       setPlatform]       = useState('Upwork')
  const [input,          setInput]          = useState('')
  const [isTyping,       setIsTyping]       = useState(false)
  const [isLoading,      setIsLoading]      = useState(true)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [chatTitle,      setChatTitle]      = useState('New Chat')
  const [isRenaming,     setIsRenaming]     = useState(false)
  const [renameValue,    setRenameValue]    = useState('')
  const [sidebarOpen,    setSidebarOpen]    = useState(true)
  const [deleteConfirm,  setDeleteConfirm]  = useState(null)

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const renameRef = useRef(null)
  const taRef     = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])
  useEffect(() => { if (isRenaming) renameRef.current?.focus() }, [isRenaming])
  useEffect(() => {
    api.get('/api/chat-sessions').then(({ data }) => setSessions(data)).catch(() => {}).finally(() => setIsLoading(false))
  }, [])

  const resizeTextarea = useCallback(() => {
    const el = taRef.current; if (!el) return
    el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [])
  useEffect(() => { resizeTextarea() }, [input, resizeTextarea])

  const loadSession = useCallback(async (session) => {
    if (session.id === activeId) return
    setSessionLoading(true); setActiveId(session.id); setMessages(session.messages || [])
    setTone(session.tone || 'Professional'); setPlatform(session.platform || 'Upwork')
    setChatTitle(session.title || 'New Chat'); setIsRenaming(false); setInput('')
    await new Promise((r) => setTimeout(r, 120)); setSessionLoading(false)
  }, [activeId])

  const startNewChat = useCallback(() => {
    setActiveId(null); setMessages([]); setChatTitle('New Chat'); setIsRenaming(false); setInput('')
    setTimeout(() => inputRef.current?.focus(), 80)
  }, [])

  const handleDelete = useCallback(async (id) => {
    try { await api.delete(`/api/chat-sessions/${id}`); setSessions((prev) => prev.filter((s) => s.id !== id)); if (activeId === id) startNewChat(); toast.success('Chat deleted') }
    catch { toast.error('Failed to delete chat') }
    setDeleteConfirm(null)
  }, [activeId, startNewChat])

  const saveRename = useCallback(async () => {
    if (!activeId || !renameValue.trim()) { setIsRenaming(false); return }
    const title = renameValue.trim().slice(0, 80)
    setChatTitle(title); setIsRenaming(false)
    setSessions((prev) => prev.map((s) => s.id === activeId ? { ...s, title } : s))
    api.put(`/api/chat-sessions/${activeId}`, { title }).catch(() => {})
  }, [activeId, renameValue])

  const exportChat = useCallback(async () => {
    const session = sessions.find((s) => s.id === activeId)
    const text = formatExport(session, messages)
    await navigator.clipboard.writeText(text); toast.success('Chat copied to clipboard')
  }, [activeId, sessions, messages])

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return
    const userMsg = mkMsg('user', trimmed)
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages); setInput(''); setIsTyping(true)
    const conversationHistory = messages.map((m) => ({ role: m.role, content: m.text }))
    let sessionId = activeId
    try {
      if (!sessionId) {
        const { data: newSession } = await api.post('/api/chat-sessions', { title: trimmed.slice(0, 60), tone, platform, messages: [userMsg] })
        sessionId = newSession.id; setActiveId(sessionId); setChatTitle(newSession.title); setSessions((prev) => [newSession, ...prev])
      }
      const { data } = await api.post('/api/ai/reply', { clientMessage: trimmed, tone, platform, conversationHistory })
      const aiMsg = mkMsg('assistant', data.reply, data.detectedPersonality)
      const finalMessages = [...updatedMessages, aiMsg]
      setMessages(finalMessages); setIsTyping(false)
      api.put(`/api/chat-sessions/${sessionId}`, { messages: finalMessages }).catch(() => {})
      setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, messages: finalMessages, updated_at: new Date().toISOString() } : s))
    } catch { setIsTyping(false); setMessages((prev) => [...prev, mkMsg('assistant', 'Sorry, something went wrong. Please try again.')]); toast.error('Failed to generate reply.') }
  }, [input, isTyping, messages, activeId, tone, platform])

  const handleKeyDown = (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); sendMessage() } }
  const cycleTone     = () => setTone((t) => TONES[(TONES.indexOf(t) + 1) % TONES.length])
  const cyclePlatform = () => setPlatform((p) => PLATFORMS[(PLATFORMS.indexOf(p) + 1) % PLATFORMS.length])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      style={{ display: 'flex', overflow: 'hidden', height: 'calc(100vh - 64px)' }}>

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ flexShrink: 0, borderRight: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#ffffff' }}>
            <div style={{ padding: 12, borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
              <motion.button onClick={startNewChat} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: 'none', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                <Plus style={{ width: 16, height: 16 }} /> New Chat
              </motion.button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {isLoading && [1, 2, 3, 4].map((i) => (
                <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.12 }}
                  style={{ height: 56, borderRadius: 10, background: '#F3F4F6' }} />
              ))}
              {!isLoading && sessions.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', textAlign: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(2,132,199,0.06)', border: '1px solid rgba(2,132,199,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <MessageSquare style={{ width: 20, height: 20, color: '#0284C7' }} />
                  </div>
                  <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>No chats yet.<br />Start a new conversation.</p>
                </motion.div>
              )}
              <AnimatePresence>
                {sessions.map((session, index) => (
                  <SessionCard key={session.id} session={session} index={index} isActive={session.id === activeId}
                    onSelect={() => loadSession(session)} onDelete={(id) => setDeleteConfirm(id)} />
                ))}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#FAFAFA' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #F3F4F6', background: '#ffffff', flexShrink: 0 }}>
          <motion.button onClick={() => setSidebarOpen((v) => !v)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            style={{ padding: 6, borderRadius: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', cursor: 'pointer', color: '#6B7280', flexShrink: 0, display: 'flex' }}>
            <Menu style={{ width: 16, height: 16 }} />
          </motion.button>
          <div style={{ flex: 1, minWidth: 0 }}>
            {isRenaming ? (
              <input ref={renameRef} value={renameValue} onChange={(e) => setRenameValue(e.target.value)}
                onBlur={saveRename} onKeyDown={(e) => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setIsRenaming(false) }}
                style={{ border: '1px solid #0284C7', borderRadius: 8, padding: '6px 12px', fontSize: 14, color: '#0A0A0A', outline: 'none', width: '100%', maxWidth: 300, fontFamily: 'inherit', background: '#ffffff', boxShadow: '0 0 0 3px rgba(2,132,199,0.08)' }} />
            ) : (
              <motion.button onClick={() => { if (!activeId) return; setRenameValue(chatTitle); setIsRenaming(true) }} disabled={!activeId} whileHover={activeId ? { x: 1 } : {}}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: activeId ? 'pointer' : 'default', padding: 0, fontFamily: 'inherit' }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{chatTitle}</h2>
                {activeId && <Pencil style={{ width: 14, height: 14, color: '#9CA3AF' }} />}
              </motion.button>
            )}
          </div>
          {activeId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {[
                { icon: Download, title: 'Export chat', action: exportChat, hover: '#0284C7' },
                { icon: Trash2,   title: 'Delete chat', action: () => setDeleteConfirm(activeId), hover: '#EF4444' },
              ].map(({ icon: Icon, title, action, hover }) => (
                <motion.button key={title} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={action} title={title}
                  style={{ padding: 6, borderRadius: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', cursor: 'pointer', color: '#6B7280', display: 'flex', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = hover} onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}>
                  <Icon style={{ width: 16, height: 16 }} />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <AnimatePresence mode="wait">
            {sessionLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #E5E7EB', borderTopColor: '#0284C7', animation: 'spin 0.7s linear infinite' }} />
              </motion.div>
            ) : messages.length === 0 && !isTyping ? (
              <WelcomeScreen tone={tone} setTone={setTone} platform={platform} setPlatform={setPlatform} />
            ) : (
              <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {messages.map((msg) => msg.role === 'user' ? <UserBubble key={msg.id} msg={msg} /> : <AIBubble key={msg.id} msg={msg} />)}
                <AnimatePresence>{isTyping && <TypingIndicator key="typing" />}</AnimatePresence>
                <div ref={bottomRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <div style={{ flexShrink: 0, padding: '16px 20px', borderTop: '1px solid #F3F4F6', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, maxWidth: 800, margin: '0 auto' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <motion.textarea ref={(el) => { inputRef.current = el; taRef.current = el }}
                value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Paste the client's message here…" disabled={isTyping} rows={1}
                style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#0A0A0A', outline: 'none', resize: 'none', lineHeight: 1.5, minHeight: 48, maxHeight: 160, fontFamily: 'inherit', boxSizing: 'border-box', opacity: isTyping ? 0.5 : 1 }}
                onFocus={e => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)' }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }} />
            </div>
            <motion.button onClick={sendMessage} disabled={!input.trim() || isTyping}
              whileHover={input.trim() && !isTyping ? { scale: 1.07 } : {}} whileTap={input.trim() && !isTyping ? { scale: 0.92 } : {}}
              style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: !input.trim() || isTyping ? 'not-allowed' : 'pointer', opacity: !input.trim() || isTyping ? 0.35 : 1 }}>
              {isTyping ? <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /> : <Send style={{ width: 16, height: 16, color: 'white' }} />}
            </motion.button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, maxWidth: 800, margin: '10px auto 0' }}>
            <motion.button onClick={cycleTone} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }} title="Click to change tone"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)', color: '#0284C7', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Sparkles style={{ width: 12, height: 12 }} />{tone}
            </motion.button>
            <motion.button onClick={cyclePlatform} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }} title="Click to change platform"
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38BDF8', cursor: 'pointer', fontFamily: 'inherit' }}>
              {platform}<ChevronRight style={{ width: 12, height: 12, opacity: 0.6 }} />
            </motion.button>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 'auto' }}>Ctrl+Enter to send</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {deleteConfirm && <DeleteModal key="delete-modal" onConfirm={() => handleDelete(deleteConfirm)} onCancel={() => setDeleteConfirm(null)} />}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </motion.div>
  )
}
