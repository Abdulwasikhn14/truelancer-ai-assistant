import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Trash2, Sparkles } from 'lucide-react'
import api from '../../services/api'

const WELCOME_MSG = {
  id: 'welcome', role: 'bot',
  text: "Hi! I'm your Truelancer AI Assistant 👋 I can help you with freelancing tips, proposal advice, pricing guidance, and much more. What would you like to know?",
  timestamp: new Date(),
}

const SUGGESTIONS = [
  { emoji: '📄', text: 'How do I write a winning proposal?' },
  { emoji: '💰', text: 'What should I charge as a beginner?' },
  { emoji: '😤', text: 'How do I handle difficult clients?' },
  { emoji: '🚀', text: 'Tips to grow on Fiverr?' },
]

const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
      style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}
    >
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0284C7, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Bot style={{ width: 16, height: 16, color: 'white' }} />
      </div>
      <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
        {[0, 0.16, 0.32].map((delay, i) => (
          <motion.span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#9CA3AF', display: 'block' }}
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.55, repeat: Infinity, delay, ease: 'easeInOut' }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: '#9CA3AF', alignSelf: 'center', marginBottom: 4 }}>Typing…</span>
    </motion.div>
  )
}

function BotMessage({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.32, ease: 'easeOut' }}
      style={{ display: 'flex', alignItems: 'flex-end', gap: 10, maxWidth: '80%' }}
    >
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0284C7, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Bot style={{ width: 16, height: 16, color: 'white' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px 16px 16px 4px', padding: '12px 16px' }}>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>{msg.text}</p>
        </div>
        <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 4 }}>{formatTime(msg.timestamp)}</span>
      </div>
    </motion.div>
  )
}

function UserMessage({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ display: 'flex', alignItems: 'flex-end', gap: 10, justifyContent: 'flex-end', maxWidth: '80%', alignSelf: 'flex-end' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <div style={{ background: 'linear-gradient(135deg, #0284C7, #38BDF8)', borderRadius: '16px 16px 4px 16px', padding: '12px 16px', boxShadow: '0 4px 16px rgba(2,132,199,0.2)' }}>
          <p style={{ fontSize: 14, color: 'white', lineHeight: 1.6, margin: 0 }}>{msg.text}</p>
        </div>
        <span style={{ fontSize: 11, color: '#9CA3AF', marginRight: 4 }}>{formatTime(msg.timestamp)}</span>
      </div>
    </motion.div>
  )
}

function SuggestionCard({ emoji, text, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(text)}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(2,132,199,0.1)' }} whileTap={{ scale: 0.97 }}
      style={{ textAlign: 'left', padding: '12px 16px', borderRadius: 12, background: '#ffffff', border: '1px solid #E5E7EB', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10, transition: 'all 0.2s', fontFamily: 'inherit' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(2,132,199,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
    >
      <span style={{ fontSize: 16, lineHeight: 1, marginTop: 2 }}>{emoji}</span>
      <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>{text}</span>
    </motion.button>
  )
}

export default function Chatbot() {
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input,    setInput]    = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const showSuggestions = messages.length === 1 && !isTyping

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const sendMessage = useCallback(async (text) => {
    const trimmed = (typeof text === 'string' ? text : input).trim()
    if (!trimmed || isTyping) return
    const userMsg = { id: Date.now(), role: 'user', text: trimmed, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    inputRef.current?.focus()
    setIsTyping(true)
    try {
      const conversationHistory = [...messages, userMsg].map((m) => ({
        role: m.role === 'bot' ? 'assistant' : 'user', content: m.text,
      }))
      const { data } = await api.post('/api/ai/chat', { message: trimmed, conversationHistory })
      setIsTyping(false)
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'bot', text: data.reply, timestamp: new Date() }])
    } catch (err) {
      console.error('Chat error:', err)
      setIsTyping(false)
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'bot', text: 'Sorry, I ran into an error. Please try again.', timestamp: new Date() }])
    }
  }, [input, isTyping, messages])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const clearChat = () => { setMessages([{ ...WELCOME_MSG, timestamp: new Date() }]); setIsTyping(false); inputRef.current?.focus() }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #F3F4F6', background: '#ffffff', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #0284C7, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot style={{ width: 20, height: 20, color: 'white' }} />
            </div>
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, background: '#10B981', borderRadius: '50%', border: '2px solid white' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>Truelancer AI Assistant</h2>
              <span style={{ fontSize: 10, fontWeight: 600, background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)', color: '#0284C7', padding: '2px 8px', borderRadius: 99 }}>Claude AI</span>
            </div>
            <p style={{ fontSize: 12, color: '#10B981', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, background: '#10B981', borderRadius: '50%', display: 'inline-block' }} />
              Online — ready to help
            </p>
          </div>
        </div>
        <motion.button onClick={clearChat} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6B7280', border: '1px solid #E5E7EB', background: '#ffffff', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB' }}
        >
          <Trash2 style={{ width: 14, height: 14 }} /> Clear chat
        </motion.button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, background: '#FAFAFA' }}>
        {messages.map((msg) =>
          msg.role === 'bot'
            ? <BotMessage key={msg.id} msg={msg} />
            : <UserMessage key={msg.id} msg={msg} />
        )}

        <AnimatePresence>
          {isTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div key="suggestions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: 0.3, duration: 0.35 }} style={{ paddingTop: 8 }}>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles style={{ width: 14, height: 14, color: '#0284C7' }} /> Suggested questions
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
                {SUGGESTIONS.map((s, i) => (
                  <motion.div key={s.text} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.07 }}>
                    <SuggestionCard emoji={s.emoji} text={s.text} onClick={sendMessage} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ flexShrink: 0, borderTop: '1px solid #F3F4F6', background: '#ffffff', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, maxWidth: 800, margin: '0 auto' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about freelancing…"
              rows={1}
              disabled={isTyping}
              style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: '12px 16px', paddingRight: 48, fontSize: 14, color: '#0A0A0A', outline: 'none', resize: 'none', lineHeight: 1.5, minHeight: 48, maxHeight: 140, fontFamily: 'inherit', boxSizing: 'border-box', opacity: isTyping ? 0.5 : 1 }}
              onFocus={e => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)' }}
              onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
              onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px' }}
            />
            <p style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 10, color: '#9CA3AF', pointerEvents: 'none' }}>↵ to send</p>
          </div>
          <motion.button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            whileHover={input.trim() && !isTyping ? { scale: 1.06 } : {}}
            whileTap={input.trim() && !isTyping ? { scale: 0.93 } : {}}
            style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: !input.trim() || isTyping ? 'not-allowed' : 'pointer', opacity: !input.trim() || isTyping ? 0.4 : 1 }}
          >
            {isTyping
              ? <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} />
              : <Send style={{ width: 16, height: 16, color: 'white' }} />
            }
          </motion.button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 10 }}>
          Powered by Claude AI · Conversation context is maintained throughout the session
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </motion.div>
  )
}
