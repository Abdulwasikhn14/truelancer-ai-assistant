import { useState, useEffect, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Clock, ArrowLeft, ArrowRight, Rocket } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { BLOG_POSTS } from '../data/blogPosts'

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12 24 5.373 18.627 0 12 0z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const ARTICLE_STYLES = `
  .article-body h2 {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0A0A0A;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }
  .article-body h3 {
    font-size: 1.05rem;
    font-weight: 600;
    color: #374151;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .article-body p {
    color: #374151;
    font-size: 0.9375rem;
    line-height: 1.8;
    margin-bottom: 1rem;
  }
  .article-body ul {
    list-style: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    color: #374151;
    font-size: 0.9375rem;
    line-height: 1.8;
  }
  .article-body ul li {
    margin-bottom: 0.35rem;
  }
  .article-body strong {
    color: #0A0A0A;
    font-weight: 600;
  }
`

function extractHeadings(html) {
  const matches = [...html.matchAll(/<h([23])[^>]*>(.*?)<\/h[23]>/g)]
  return matches.map((m, i) => ({
    id: `heading-${i}`,
    level: parseInt(m[1]),
    text: m[2].replace(/<[^>]+>/g, ''),
  }))
}

function addHeadingIds(html) {
  let i = 0
  return html.replace(/<h([23])>/g, (_, n) => `<h${n} id="heading-${i++}">`)
}

const CARD = {
  background: '#ffffff',
  border: '1px solid #E5E7EB',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

export default function BlogPost() {
  const { id }        = useParams()
  const [showBTT, setShowBTT]   = useState(false)
  const [activeId, setActiveId] = useState('')
  const articleRef    = useRef(null)

  const postIndex = BLOG_POSTS.findIndex((p) => p.id === id)
  const post      = BLOG_POSTS[postIndex]

  useEffect(() => {
    window.scrollTo(0, 0)
    const onScroll = () => setShowBTT(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [id])

  useEffect(() => {
    if (!post) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    const headings = articleRef.current?.querySelectorAll('h2, h3') || []
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [post])

  if (!post) return <Navigate to="/blog" replace />

  const htmlWithIds = addHeadingIds(post.content)
  const headings    = extractHeadings(post.content)

  const prev = postIndex > 0 ? BLOG_POSTS[postIndex - 1] : null
  const next = postIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[postIndex + 1] : null

  const related = BLOG_POSTS
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2)

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <style>{ARTICLE_STYLES}</style>
      <Navbar />

      <main className="pt-20">

        {/* ── Article Header ── */}
        <section className="py-16 px-4" style={{ background: '#F9FAFB' }}>
          <div className="max-w-4xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
              style={{ color: '#9CA3AF' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'}
              onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(2,132,199,0.08)', color: '#0284C7', border: '1px solid rgba(2,132,199,0.2)' }}
              >
                {post.category}
              </span>
              <span className="text-xs flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                <Clock className="w-3.5 h-3.5" /> {post.readTime}
              </span>
              <span className="text-xs" style={{ color: '#9CA3AF' }}>{post.date}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ color: '#0A0A0A' }}>
              {post.title}
            </h1>

            <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#6B7280' }}>{post.excerpt}</p>

            <div
              className="mt-8 h-1 rounded-full max-w-xs"
              style={{ background: post.gradient }}
            />
          </div>
        </section>

        {/* ── Main + Sidebar ── */}
        <section className="pb-20 px-4 pt-8">
          <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[1fr_280px] lg:gap-10 items-start">

            {/* ── Article Body ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ ...CARD, padding: 40 }}
            >
              <div
                ref={articleRef}
                className="article-body"
                dangerouslySetInnerHTML={{ __html: htmlWithIds }}
              />

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="mt-8 pt-6 flex flex-wrap gap-2" style={{ borderTop: '1px solid #F3F4F6' }}>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── Sidebar ── */}
            <aside className="hidden lg:block mt-0 space-y-5 sticky top-28">

              {/* Table of Contents */}
              {headings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  style={{ ...CARD, padding: 20 }}
                >
                  <p
                    className="text-xs font-semibold uppercase mb-4"
                    style={{ color: '#9CA3AF', letterSpacing: '0.12em' }}
                  >
                    Contents
                  </p>
                  <nav className="space-y-1.5">
                    {headings.map(({ id: hId, level, text }) => (
                      <a
                        key={hId}
                        href={`#${hId}`}
                        onClick={(e) => {
                          e.preventDefault()
                          document.getElementById(hId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                        className="block text-xs leading-snug transition-colors"
                        style={{
                          paddingLeft: level === 3 ? '0.75rem' : '0',
                          color: activeId === hId ? '#0284C7' : '#9CA3AF',
                          fontWeight: activeId === hId ? 600 : 400,
                        }}
                      >
                        {text}
                      </a>
                    ))}
                  </nav>
                </motion.div>
              )}

              {/* Try Truelancer card */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="text-center"
                style={{
                  ...CARD,
                  padding: 24,
                  border: '1px solid rgba(2,132,199,0.2)',
                  boxShadow: '0 4px 16px rgba(2,132,199,0.07)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)' }}
                >
                  <Rocket className="w-5 h-5" style={{ color: '#0284C7' }} />
                </div>
                <p className="font-bold text-sm mb-2" style={{ color: '#0A0A0A' }}>Try Truelancer Free</p>
                <p className="text-xs leading-relaxed mb-4" style={{ color: '#6B7280' }}>
                  Write better proposals and win more clients with AI tools built for freelancers.
                </p>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(2,132,199,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2.5 text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #0284C7, #6D4FF0)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontFamily: 'Manrope, sans-serif',
                      boxShadow: '0 4px 16px rgba(2,132,199,0.3)',
                    }}
                  >
                    Get Started — It's Free
                  </motion.button>
                </Link>
              </motion.div>

              {/* Related Articles */}
              {related.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  style={{ ...CARD, padding: 20 }}
                >
                  <p
                    className="text-xs font-semibold uppercase mb-4"
                    style={{ color: '#9CA3AF', letterSpacing: '0.12em' }}
                  >
                    Related
                  </p>
                  <div className="space-y-4">
                    {related.map((rp) => (
                      <Link key={rp.id} to={`/blog/${rp.id}`} className="block group">
                        <div className="h-1 rounded-full mb-2.5 w-10" style={{ background: rp.gradient }} />
                        <p
                          className="text-xs font-semibold leading-snug line-clamp-2 transition-colors"
                          style={{ color: '#0A0A0A' }}
                        >
                          {rp.title}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{rp.readTime}</p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </aside>
          </div>
        </section>

        {/* ── Author Card ── */}
        <section className="pb-12 px-4" style={{ background: '#F9FAFB' }}>
          <div className="max-w-4xl mx-auto pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-start gap-5"
              style={{ ...CARD, padding: 28 }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#0284C7,#38BDF8)', boxShadow: '0 4px 16px rgba(2,132,199,0.25)' }}
              >
                AW
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <p className="font-bold" style={{ color: '#0A0A0A' }}>{post.author}</p>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                      style={{ color: '#9CA3AF' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
                    >
                      <GithubIcon />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                      style={{ color: '#9CA3AF' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
                    >
                      <LinkedInIcon />
                    </a>
                  </div>
                </div>
                <p className="text-xs mb-2" style={{ color: '#9CA3AF' }}>Founder at Truelancer · Karachi, Pakistan</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  Full-stack developer and indie founder. Writes about freelance strategy, AI tools, and building products
                  for independent workers.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="pb-16 px-4 pt-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden p-8 sm:p-10"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(2,132,199,0.2)',
                boxShadow: '0 4px 32px rgba(2,132,199,0.08)',
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{ background: post.gradient }}
              />
              <div className="relative flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2" style={{ color: '#0A0A0A' }}>
                    Put this into practice with Truelancer
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    Use our AI proposal generator, pricing tools, and analytics to apply what you just learned — starting today.
                  </p>
                </div>
                <Link to="/signup" className="flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(2,132,199,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    className="text-sm font-semibold whitespace-nowrap"
                    style={{
                      background: 'linear-gradient(135deg, #0284C7, #6D4FF0)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      padding: '12px 28px',
                      cursor: 'pointer',
                      fontFamily: 'Manrope, sans-serif',
                      boxShadow: '0 4px 16px rgba(2,132,199,0.3)',
                    }}
                  >
                    Start Free Today
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Prev / Next ── */}
        {(prev || next) && (
          <section className="pb-24 px-4" style={{ background: '#F9FAFB' }}>
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
              {prev ? (
                <Link to={`/blog/${prev.id}`}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    style={{ ...CARD, padding: 20 }}
                  >
                    <div className="flex items-center gap-2 text-xs mb-2" style={{ color: '#9CA3AF' }}>
                      <ArrowLeft className="w-3.5 h-3.5" /> Previous
                    </div>
                    <p className="text-sm font-semibold line-clamp-2" style={{ color: '#0A0A0A' }}>
                      {prev.title}
                    </p>
                  </motion.div>
                </Link>
              ) : <div />}
              {next ? (
                <Link to={`/blog/${next.id}`}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    style={{ ...CARD, padding: 20, textAlign: 'right' }}
                  >
                    <div className="flex items-center justify-end gap-2 text-xs mb-2" style={{ color: '#9CA3AF' }}>
                      Next <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm font-semibold line-clamp-2" style={{ color: '#0A0A0A' }}>
                      {next.title}
                    </p>
                  </motion.div>
                </Link>
              ) : <div />}
            </div>
          </section>
        )}

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
