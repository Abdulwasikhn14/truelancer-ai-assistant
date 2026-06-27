import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Search, Clock, ArrowRight, Mail } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { BLOG_POSTS, CATEGORIES } from '../data/blogPosts'

const CARD = {
  background: '#ffffff',
  border: '1px solid #E5E7EB',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

function PostCard({ post, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      className="overflow-hidden"
      style={{ ...CARD, transition: 'box-shadow 0.2s, transform 0.2s' }}
    >
      <div className="h-2 w-full" style={{ background: post.gradient }} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(2,132,199,0.08)', color: '#0284C7', border: '1px solid rgba(2,132,199,0.2)' }}
          >
            {post.category}
          </span>
          <span className="text-xs flex items-center gap-1" style={{ color: '#9CA3AF' }}>
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2" style={{ color: '#0A0A0A' }}>
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: '#6B7280' }}>{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#9CA3AF' }}>{post.date}</span>
          <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0284C7' }}>
            Read more <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export default function Blog() {
  const [showBTT, setShowBTT]       = useState(false)
  const [category, setCategory]     = useState('All')
  const [query, setQuery]           = useState('')
  const [email, setEmail]           = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const onScroll = () => setShowBTT(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const featured = BLOG_POSTS.find((p) => p.featured)
  const rest     = BLOG_POSTS.filter((p) => !p.featured)

  const displayed = rest.filter((p) => {
    const matchCat   = category === 'All' || p.category === category
    const matchQuery = !query.trim() ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQuery
  })

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      <main className="pt-20">

        {/* ── Hero ── */}
        <section className="py-20 px-4 text-center" style={{ background: '#F9FAFB' }}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: '#0A0A0A' }}
          >
            Truelancer{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0284C7, #38BDF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Blog</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="max-w-xl mx-auto mb-8"
            style={{ color: '#6B7280' }}
          >
            Actionable guides on proposals, pricing, AI tools, and winning more freelance work.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative max-w-lg mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none"
              style={{
                background: '#ffffff',
                border: '1px solid #E5E7EB',
                color: '#0A0A0A',
                fontFamily: 'Manrope, sans-serif',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            />
          </motion.div>
        </section>

        {/* ── Category Filters ── */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setCategory(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={
                  category === cat
                    ? { background: '#0284C7', color: '#fff', border: '1px solid #0284C7' }
                    : { background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }
                }
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── Featured Post ── */}
        {!query && category === 'All' && featured && (
          <section className="pb-12 px-4">
            <div className="max-w-6xl mx-auto">
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
                style={CARD}
              >
                <div className="h-1.5 w-full" style={{ background: featured.gradient }} />
                <div className="p-8 sm:p-10 lg:flex lg:items-center lg:gap-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(2,132,199,0.1)', color: '#0284C7', border: '1px solid rgba(2,132,199,0.2)' }}
                      >
                        Featured
                      </span>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}
                      >
                        {featured.category}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug" style={{ color: '#0A0A0A' }}>
                      {featured.title}
                    </h2>
                    <p className="leading-relaxed mb-6 max-w-xl" style={{ color: '#6B7280' }}>{featured.excerpt}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-sm" style={{ color: '#9CA3AF' }}>{featured.date}</span>
                      <span className="text-sm flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                        <Clock className="w-3.5 h-3.5" /> {featured.readTime}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 lg:mt-0 lg:flex-shrink-0">
                    <Link to={`/blog/${featured.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(2,132,199,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 text-sm font-semibold"
                        style={{
                          background: 'linear-gradient(135deg, #0284C7, #6D4FF0)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 10,
                          padding: '12px 24px',
                          cursor: 'pointer',
                          fontFamily: 'Manrope, sans-serif',
                          boxShadow: '0 4px 16px rgba(2,132,199,0.3)',
                        }}
                      >
                        Read Article <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.article>
            </div>
          </section>
        )}

        {/* ── Grid ── */}
        <section className="pb-20 px-4" style={{ background: '#F9FAFB' }}>
          <div className="max-w-6xl mx-auto pt-8">
            {displayed.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p style={{ color: '#6B7280' }}>No articles found for your search.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayed.map((post, i) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <PostCard post={post} index={i} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Newsletter ── */}
        <section className="pb-24 px-4 pt-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden p-10 text-center"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(2,132,199,0.2)',
                boxShadow: '0 4px 32px rgba(2,132,199,0.08)',
              }}
            >
              <div
                className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'rgba(2,132,199,0.06)', filter: 'blur(40px)' }}
              />
              <div
                className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'rgba(56,189,248,0.05)', filter: 'blur(40px)' }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)' }}
                >
                  <Mail className="w-6 h-6" style={{ color: '#0284C7' }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#0A0A0A' }}>Weekly freelance insights</h3>
                <p className="text-sm mb-7 max-w-md mx-auto" style={{ color: '#6B7280' }}>
                  One email per week. No fluff — just actionable tips on proposals, pricing, and winning clients.
                </p>
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.p
                      key="done"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-semibold text-emerald-600"
                    >
                      You're in! Check your inbox.
                    </motion.p>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubscribe}
                      className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
                    >
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                        style={{
                          background: '#F9FAFB',
                          border: '1px solid #E5E7EB',
                          color: '#0A0A0A',
                          fontFamily: 'Manrope, sans-serif',
                        }}
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(2,132,199,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                        className="text-sm font-semibold whitespace-nowrap"
                        style={{
                          background: 'linear-gradient(135deg, #0284C7, #6D4FF0)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 10,
                          padding: '12px 20px',
                          cursor: 'pointer',
                          fontFamily: 'Manrope, sans-serif',
                          boxShadow: '0 4px 16px rgba(2,132,199,0.3)',
                        }}
                      >
                        Subscribe
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />

      <AnimatePresence>
        {showBTT && (
          <motion.button
            key="btt"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#0284C7,#38BDF8)', boxShadow: '0 0 18px rgba(2,132,199,0.5)' }}
            initial={{ opacity: 0, scale: 0.65, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.65, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp size={20} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
